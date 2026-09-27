-- Queryable copy of the food tracker's numbers (no photos, no coach chats).
--
-- The app mirrors every change here through the `nutrition-sync` edge
-- function, which calls nutrition_mirror() with the service role. The tables
-- have RLS enabled and no policies, so the public anon key can't read or
-- write them; only the edge function and the project owner (dashboard, SQL,
-- Claude via the Supabase connector) can.
--
-- Nutrient units: calories kcal; protein, carbs, fat, saturated_fat, fiber,
-- sugar g; sodium, cholesterol, potassium, calcium, iron, vitamin_c mg;
-- vitamin_d mcg. Entry and item values are what was actually eaten (portion
-- multipliers already applied).

create table if not exists public.nutrition_people (
  household_id      text not null,
  person_id         text not null,
  name              text,
  sex               text,
  age               int,
  height_cm         numeric,
  weight_kg         numeric,
  activity          text,
  goal              text,
  rate_lb_per_week  numeric,
  units             text,
  target_calories   int,
  target_protein    int,
  target_carbs      int,
  target_fat        int,
  target_fiber      int,
  custom_targets    jsonb,
  updated_at        timestamptz not null default now(),
  primary key (household_id, person_id)
);

create table if not exists public.nutrition_entries (
  id             text primary key,
  household_id   text not null,
  person_id      text not null,
  date           date not null,
  meal           text not null,
  name           text not null,
  source         text,
  health_score   int,
  notes          text,
  tip            text,
  barcode        text,
  recipe_id      text,
  logged_at      timestamptz,
  updated_at     timestamptz not null default now(),
  calories       numeric not null default 0,
  protein        numeric not null default 0,
  carbs          numeric not null default 0,
  fat            numeric not null default 0,
  saturated_fat  numeric not null default 0,
  fiber          numeric not null default 0,
  sugar          numeric not null default 0,
  sodium         numeric not null default 0,
  cholesterol    numeric not null default 0,
  potassium      numeric not null default 0,
  calcium        numeric not null default 0,
  iron           numeric not null default 0,
  vitamin_c      numeric not null default 0,
  vitamin_d      numeric not null default 0
);
create index if not exists nutrition_entries_person_date on public.nutrition_entries (household_id, person_id, date);

create table if not exists public.nutrition_items (
  id             bigint generated always as identity primary key,
  entry_id       text not null references public.nutrition_entries (id) on delete cascade,
  position       int not null,
  name           text,
  portion        text,
  grams          numeric,
  qty            numeric,
  confidence     text,
  calories       numeric not null default 0,
  protein        numeric not null default 0,
  carbs          numeric not null default 0,
  fat            numeric not null default 0,
  saturated_fat  numeric not null default 0,
  fiber          numeric not null default 0,
  sugar          numeric not null default 0,
  sodium         numeric not null default 0,
  cholesterol    numeric not null default 0,
  potassium      numeric not null default 0,
  calcium        numeric not null default 0,
  iron           numeric not null default 0,
  vitamin_c      numeric not null default 0,
  vitamin_d      numeric not null default 0
);
create index if not exists nutrition_items_entry on public.nutrition_items (entry_id);

create table if not exists public.nutrition_weights (
  household_id  text not null,
  person_id     text not null,
  date          date not null,
  weight_kg     numeric not null,
  weight_lb     numeric generated always as (round(weight_kg / 0.45359237, 1)) stored,
  updated_at    timestamptz not null default now(),
  primary key (household_id, person_id, date)
);

create table if not exists public.nutrition_water (
  household_id  text not null,
  person_id     text not null,
  date          date not null,
  cups          int not null,
  updated_at    timestamptz not null default now(),
  primary key (household_id, person_id, date)
);

alter table public.nutrition_people  enable row level security;
alter table public.nutrition_entries enable row level security;
alter table public.nutrition_items   enable row level security;
alter table public.nutrition_weights enable row level security;
alter table public.nutrition_water   enable row level security;
revoke all on public.nutrition_people, public.nutrition_entries, public.nutrition_items,
  public.nutrition_weights, public.nutrition_water from anon, authenticated;

-- One row per person per day: totals, targets and water, for easy querying.
create or replace view public.nutrition_daily
with (security_invoker = true) as
select
  e.household_id,
  e.person_id,
  p.name as person_name,
  e.date,
  count(*)                        as entries,
  round(sum(e.calories))          as calories,
  round(sum(e.protein), 1)        as protein,
  round(sum(e.carbs), 1)          as carbs,
  round(sum(e.fat), 1)            as fat,
  round(sum(e.saturated_fat), 1)  as saturated_fat,
  round(sum(e.fiber), 1)          as fiber,
  round(sum(e.sugar), 1)          as sugar,
  round(sum(e.sodium))            as sodium,
  round(sum(e.cholesterol))       as cholesterol,
  round(sum(e.potassium))         as potassium,
  round(sum(e.calcium))           as calcium,
  round(sum(e.iron), 1)           as iron,
  round(sum(e.vitamin_c))         as vitamin_c,
  round(sum(e.vitamin_d), 1)      as vitamin_d,
  round(avg(e.health_score), 1)   as avg_health_score,
  p.target_calories, p.target_protein, p.target_carbs, p.target_fat, p.target_fiber,
  w.cups as water_cups
from public.nutrition_entries e
left join public.nutrition_people p using (household_id, person_id)
left join public.nutrition_water w using (household_id, person_id, date)
group by e.household_id, e.person_id, p.name, e.date,
  p.target_calories, p.target_protein, p.target_carbs, p.target_fat, p.target_fiber, w.cups;
revoke all on public.nutrition_daily from anon, authenticated;

-- Apply one batch of changes from the app. Newer updated_at always wins, so
-- an older device can't overwrite a newer edit.
create or replace function public.nutrition_mirror(p jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  hh text := p->>'household';
  r jsonb;
  it jsonb;
  pos int;
  applied int;
  n_entries int := 0;
begin
  if hh is null or length(hh) < 6 then
    raise exception 'household required';
  end if;

  for r in select * from jsonb_array_elements(coalesce(p->'people', '[]')) loop
    insert into nutrition_people as t (household_id, person_id, name, sex, age, height_cm, weight_kg, activity, goal,
      rate_lb_per_week, units, target_calories, target_protein, target_carbs, target_fat, target_fiber, custom_targets, updated_at)
    values (hh, r->>'id', r->>'name', r->>'sex', (r->>'age')::numeric::int, (r->>'heightCm')::numeric, (r->>'weightKg')::numeric,
      r->>'activity', r->>'goal', (r->>'rateLbPerWeek')::numeric, r->>'units',
      (r#>>'{targets,calories}')::numeric::int, (r#>>'{targets,protein}')::numeric::int, (r#>>'{targets,carbs}')::numeric::int,
      (r#>>'{targets,fat}')::numeric::int, (r#>>'{targets,fiber}')::numeric::int,
      nullif(r->'custom', 'null'::jsonb), to_timestamp(coalesce((r->>'updatedAt')::numeric, 0) / 1000))
    on conflict (household_id, person_id) do update set
      name = excluded.name, sex = excluded.sex, age = excluded.age, height_cm = excluded.height_cm,
      weight_kg = excluded.weight_kg, activity = excluded.activity, goal = excluded.goal,
      rate_lb_per_week = excluded.rate_lb_per_week, units = excluded.units,
      target_calories = excluded.target_calories, target_protein = excluded.target_protein,
      target_carbs = excluded.target_carbs, target_fat = excluded.target_fat, target_fiber = excluded.target_fiber,
      custom_targets = excluded.custom_targets, updated_at = excluded.updated_at
    where excluded.updated_at >= t.updated_at;
  end loop;

  for r in select * from jsonb_array_elements(coalesce(p->'entries', '[]')) loop
    insert into nutrition_entries as t (id, household_id, person_id, date, meal, name, source, health_score, notes, tip,
      barcode, recipe_id, logged_at, updated_at, calories, protein, carbs, fat, saturated_fat, fiber, sugar, sodium,
      cholesterol, potassium, calcium, iron, vitamin_c, vitamin_d)
    values (r->>'id', hh, r->>'personId', (r->>'date')::date, r->>'meal', coalesce(r->>'name', ''), r->>'source',
      (r->>'healthScore')::numeric::int, r->>'notes', r->>'tip', r->>'barcode', r->>'recipeId',
      to_timestamp((r->>'createdAt')::numeric / 1000), to_timestamp(coalesce((r->>'updatedAt')::numeric, 0) / 1000),
      coalesce((r#>>'{totals,calories}')::numeric, 0), coalesce((r#>>'{totals,protein}')::numeric, 0),
      coalesce((r#>>'{totals,carbs}')::numeric, 0), coalesce((r#>>'{totals,fat}')::numeric, 0),
      coalesce((r#>>'{totals,saturatedFat}')::numeric, 0), coalesce((r#>>'{totals,fiber}')::numeric, 0),
      coalesce((r#>>'{totals,sugar}')::numeric, 0), coalesce((r#>>'{totals,sodium}')::numeric, 0),
      coalesce((r#>>'{totals,cholesterol}')::numeric, 0), coalesce((r#>>'{totals,potassium}')::numeric, 0),
      coalesce((r#>>'{totals,calcium}')::numeric, 0), coalesce((r#>>'{totals,iron}')::numeric, 0),
      coalesce((r#>>'{totals,vitaminC}')::numeric, 0), coalesce((r#>>'{totals,vitaminD}')::numeric, 0))
    on conflict (id) do update set
      household_id = excluded.household_id, person_id = excluded.person_id, date = excluded.date, meal = excluded.meal,
      name = excluded.name, source = excluded.source, health_score = excluded.health_score, notes = excluded.notes,
      tip = excluded.tip, barcode = excluded.barcode, recipe_id = excluded.recipe_id, logged_at = excluded.logged_at,
      updated_at = excluded.updated_at, calories = excluded.calories, protein = excluded.protein, carbs = excluded.carbs,
      fat = excluded.fat, saturated_fat = excluded.saturated_fat, fiber = excluded.fiber, sugar = excluded.sugar,
      sodium = excluded.sodium, cholesterol = excluded.cholesterol, potassium = excluded.potassium,
      calcium = excluded.calcium, iron = excluded.iron, vitamin_c = excluded.vitamin_c, vitamin_d = excluded.vitamin_d
    where excluded.updated_at >= t.updated_at;
    get diagnostics applied = row_count;

    if applied > 0 then
      n_entries := n_entries + 1;
      delete from nutrition_items where entry_id = r->>'id';
      pos := 0;
      for it in select * from jsonb_array_elements(coalesce(r->'items', '[]')) loop
        insert into nutrition_items (entry_id, position, name, portion, grams, qty, confidence, calories, protein, carbs,
          fat, saturated_fat, fiber, sugar, sodium, cholesterol, potassium, calcium, iron, vitamin_c, vitamin_d)
        values (r->>'id', pos, it->>'name', it->>'portion', (it->>'grams')::numeric, (it->>'qty')::numeric, it->>'confidence',
          coalesce((it#>>'{n,calories}')::numeric, 0), coalesce((it#>>'{n,protein}')::numeric, 0),
          coalesce((it#>>'{n,carbs}')::numeric, 0), coalesce((it#>>'{n,fat}')::numeric, 0),
          coalesce((it#>>'{n,saturatedFat}')::numeric, 0), coalesce((it#>>'{n,fiber}')::numeric, 0),
          coalesce((it#>>'{n,sugar}')::numeric, 0), coalesce((it#>>'{n,sodium}')::numeric, 0),
          coalesce((it#>>'{n,cholesterol}')::numeric, 0), coalesce((it#>>'{n,potassium}')::numeric, 0),
          coalesce((it#>>'{n,calcium}')::numeric, 0), coalesce((it#>>'{n,iron}')::numeric, 0),
          coalesce((it#>>'{n,vitaminC}')::numeric, 0), coalesce((it#>>'{n,vitaminD}')::numeric, 0));
        pos := pos + 1;
      end loop;
    end if;
  end loop;

  delete from nutrition_entries
  where household_id = hh and id in (select jsonb_array_elements_text(coalesce(p->'deletedEntries', '[]')));

  delete from nutrition_entries
  where household_id = hh and person_id in (select jsonb_array_elements_text(coalesce(p->'deletedPeople', '[]')));
  delete from nutrition_weights
  where household_id = hh and person_id in (select jsonb_array_elements_text(coalesce(p->'deletedPeople', '[]')));
  delete from nutrition_water
  where household_id = hh and person_id in (select jsonb_array_elements_text(coalesce(p->'deletedPeople', '[]')));
  delete from nutrition_people
  where household_id = hh and person_id in (select jsonb_array_elements_text(coalesce(p->'deletedPeople', '[]')));

  for r in select * from jsonb_array_elements(coalesce(p->'weights', '[]')) loop
    insert into nutrition_weights as t (household_id, person_id, date, weight_kg, updated_at)
    values (hh, r->>'personId', (r->>'date')::date, (r->>'kg')::numeric, to_timestamp(coalesce((r->>'updatedAt')::numeric, 0) / 1000))
    on conflict (household_id, person_id, date) do update set weight_kg = excluded.weight_kg, updated_at = excluded.updated_at
    where excluded.updated_at >= t.updated_at;
  end loop;

  for r in select * from jsonb_array_elements(coalesce(p->'water', '[]')) loop
    insert into nutrition_water as t (household_id, person_id, date, cups, updated_at)
    values (hh, r->>'personId', (r->>'date')::date, (r->>'cups')::numeric::int, to_timestamp(coalesce((r->>'updatedAt')::numeric, 0) / 1000))
    on conflict (household_id, person_id, date) do update set cups = excluded.cups, updated_at = excluded.updated_at
    where excluded.updated_at >= t.updated_at;
  end loop;

  return jsonb_build_object('ok', true, 'entries', n_entries);
end;
$$;

revoke all on function public.nutrition_mirror(jsonb) from public, anon, authenticated;
grant execute on function public.nutrition_mirror(jsonb) to service_role;

-- Moving a household (e.g. when this device joins a shared plan) re-labels its rows.
create or replace function public.nutrition_move_household(old_hh text, new_hh text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if old_hh is null or new_hh is null or old_hh = new_hh then return; end if;
  update nutrition_entries set household_id = new_hh where household_id = old_hh;
  -- People / weights / water: keep the newer row if both households have one.
  delete from nutrition_people o using nutrition_people n
    where o.household_id = old_hh and n.household_id = new_hh and n.person_id = o.person_id and n.updated_at >= o.updated_at;
  delete from nutrition_people n using nutrition_people o
    where n.household_id = new_hh and o.household_id = old_hh and n.person_id = o.person_id;
  update nutrition_people set household_id = new_hh where household_id = old_hh;
  delete from nutrition_weights o using nutrition_weights n
    where o.household_id = old_hh and n.household_id = new_hh and n.person_id = o.person_id and n.date = o.date and n.updated_at >= o.updated_at;
  delete from nutrition_weights n using nutrition_weights o
    where n.household_id = new_hh and o.household_id = old_hh and n.person_id = o.person_id and n.date = o.date;
  update nutrition_weights set household_id = new_hh where household_id = old_hh;
  delete from nutrition_water o using nutrition_water n
    where o.household_id = old_hh and n.household_id = new_hh and n.person_id = o.person_id and n.date = o.date and n.updated_at >= o.updated_at;
  delete from nutrition_water n using nutrition_water o
    where n.household_id = new_hh and o.household_id = old_hh and n.person_id = o.person_id and n.date = o.date;
  update nutrition_water set household_id = new_hh where household_id = old_hh;
end;
$$;

revoke all on function public.nutrition_move_household(text, text) from public, anon, authenticated;
grant execute on function public.nutrition_move_household(text, text) to service_role;
