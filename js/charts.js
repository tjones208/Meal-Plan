/*
 * Tiny dependency-free SVG charts for the Progress tab.
 *
 *  - barChart(): one bar per day with a dashed target reference line.
 *  - lineChart(): a single-series trend line (weight).
 *
 * Both are single-series (the card title names the series, so no legend),
 * use thin marks with recessive gridlines, and show a hover/tap tooltip.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs) {
  const n = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, v);
  return n;
}

function niceMax(v) {
  if (v <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * mag;
}

function chartFrame(container, height) {
  container.innerHTML = '';
  container.style.position = 'relative';
  const width = Math.max(280, container.clientWidth || 600);
  const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, width: '100%', height, role: 'img' });
  const tip = document.createElement('div');
  tip.className = 'chart-tip';
  tip.hidden = true;
  container.appendChild(svg);
  container.appendChild(tip);
  return { svg, tip, width };
}

function showTip(tip, container, x, y, html) {
  tip.innerHTML = html;
  tip.hidden = false;
  const cw = container.clientWidth;
  const tw = tip.offsetWidth;
  tip.style.left = `${Math.min(Math.max(0, x - tw / 2), cw - tw)}px`;
  tip.style.top = `${Math.max(0, y - tip.offsetHeight - 10)}px`;
}

function yAxis(svg, pad, width, height, max, fmt) {
  const ticks = 4;
  for (let i = 0; i <= ticks; i++) {
    const v = (max / ticks) * i;
    const y = height - pad.b - ((height - pad.t - pad.b) * i) / ticks;
    svg.appendChild(svgEl('line', { x1: pad.l, x2: width - pad.r, y1: y, y2: y, class: 'grid' }));
    const t = svgEl('text', { x: pad.l - 6, y: y + 4, class: 'axis', 'text-anchor': 'end' });
    t.textContent = fmt(v);
    svg.appendChild(t);
  }
}

/*
 * points: [{ label, value, sub? }]   target: number | null
 */
function barChart(container, points, target, opts) {
  const o = Object.assign({ unit: 'kcal', height: 220 }, opts || {});
  if (!points.some((p) => p.value > 0)) {
    container.innerHTML = '<p class="muted empty-chart">Log some meals to see this chart.</p>';
    return;
  }
  const { svg, tip, width } = chartFrame(container, o.height);
  const pad = { t: 14, r: 12, b: 26, l: 46 };
  const max = niceMax(Math.max(target || 0, ...points.map((p) => p.value)) * 1.08);
  yAxis(svg, pad, width, o.height, max, (v) => Math.round(v).toLocaleString());
  const plotW = width - pad.l - pad.r;
  const plotH = o.height - pad.t - pad.b;
  const slot = plotW / points.length;
  const barW = Math.max(3, Math.min(28, slot - 2)); // 2px gap between bars
  const labelEvery = Math.ceil(points.length / 10);

  points.forEach((p, i) => {
    const x = pad.l + slot * i + (slot - barW) / 2;
    const h = (p.value / max) * plotH;
    const y = o.height - pad.b - h;
    if (p.value > 0) {
      const r = Math.min(4, barW / 2, h);
      // Rounded top, square baseline.
      const d = `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + barW - r} Q${x + barW},${y} ${x + barW},${y + r} V${y + h} Z`;
      svg.appendChild(svgEl('path', { d, class: 'bar' + (target && p.value > target * 1.1 ? ' bar-over' : '') }));
    }
    if (i % labelEvery === 0) {
      const t = svgEl('text', { x: x + barW / 2, y: o.height - 8, class: 'axis', 'text-anchor': 'middle' });
      t.textContent = p.label;
      svg.appendChild(t);
    }
    // Hit target: full column, larger than the bar.
    const hit = svgEl('rect', { x: pad.l + slot * i, y: pad.t, width: slot, height: plotH, fill: 'transparent' });
    const tipHtml = `<strong>${p.sub || p.label}</strong><br>${Math.round(p.value).toLocaleString()} ${o.unit}` +
      (target ? `<br><span class="muted">target ${Math.round(target).toLocaleString()}</span>` : '');
    const show = () => showTip(tip, container, ((x + barW / 2) / width) * container.clientWidth, (y / o.height) * container.clientHeight, tipHtml);
    hit.addEventListener('mouseenter', show);
    hit.addEventListener('click', show);
    hit.addEventListener('mouseleave', () => (tip.hidden = true));
    svg.appendChild(hit);
  });

  if (target) {
    const ty = o.height - pad.b - (target / max) * plotH;
    svg.appendChild(svgEl('line', { x1: pad.l, x2: width - pad.r, y1: ty, y2: ty, class: 'target-line' }));
    const t = svgEl('text', { x: width - pad.r, y: ty - 5, class: 'axis target-label', 'text-anchor': 'end' });
    t.textContent = `Target ${Math.round(target).toLocaleString()}`;
    svg.appendChild(t);
  }
}

/*
 * points: [{ x: Date, value, label }] sorted by date.
 */
function lineChart(container, points, opts) {
  const o = Object.assign({ height: 200, fmt: (v) => String(v) }, opts || {});
  if (points.length < 2) {
    container.innerHTML = `<p class="muted empty-chart">${points.length ? 'Log another weigh-in to see your trend.' : 'Log your weight to see your trend.'}</p>`;
    return;
  }
  const { svg, tip, width } = chartFrame(container, o.height);
  const pad = { t: 14, r: 16, b: 26, l: 46 };
  const vals = points.map((p) => p.value);
  let lo = Math.min(...vals);
  let hi = Math.max(...vals);
  const span = Math.max(hi - lo, 2);
  lo -= span * 0.15;
  hi += span * 0.15;
  const t0 = points[0].x.getTime();
  const t1 = points[points.length - 1].x.getTime();
  const plotW = width - pad.l - pad.r;
  const plotH = o.height - pad.t - pad.b;
  const X = (t) => pad.l + (t1 === t0 ? plotW / 2 : ((t - t0) / (t1 - t0)) * plotW);
  const Y = (v) => pad.t + (1 - (v - lo) / (hi - lo)) * plotH;

  for (let i = 0; i <= 4; i++) {
    const v = lo + ((hi - lo) * i) / 4;
    const y = Y(v);
    svg.appendChild(svgEl('line', { x1: pad.l, x2: width - pad.r, y1: y, y2: y, class: 'grid' }));
    const t = svgEl('text', { x: pad.l - 6, y: y + 4, class: 'axis', 'text-anchor': 'end' });
    t.textContent = o.fmt(v);
    svg.appendChild(t);
  }
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${X(p.x.getTime()).toFixed(1)},${Y(p.value).toFixed(1)}`).join(' ');
  svg.appendChild(svgEl('path', { d, class: 'line' }));

  [points[0], points[points.length - 1]].forEach((p, i) => {
    const t = svgEl('text', { x: X(p.x.getTime()), y: o.height - 8, class: 'axis', 'text-anchor': i ? 'end' : 'start' });
    t.textContent = p.x.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    svg.appendChild(t);
  });

  points.forEach((p) => {
    const cx = X(p.x.getTime());
    const cy = Y(p.value);
    svg.appendChild(svgEl('circle', { cx, cy, r: 4, class: 'dot' }));
    const hit = svgEl('circle', { cx, cy, r: 14, fill: 'transparent' });
    const show = () => showTip(tip, container, (cx / width) * container.clientWidth, (cy / o.height) * container.clientHeight,
      `<strong>${p.label}</strong><br>${o.fmt(p.value)}`);
    hit.addEventListener('mouseenter', show);
    hit.addEventListener('click', show);
    hit.addEventListener('mouseleave', () => (tip.hidden = true));
    svg.appendChild(hit);
  });
}
