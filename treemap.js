/* ============================================
   Treemap — Squarified layout + Canvas render
   ============================================ */

const Treemap = (function () {
  let rects = [];

  // --- Squarified Treemap Algorithm ---

  function worstRatio(row, sideLen, totalArea) {
    if (!row.length) return Infinity;
    const rowArea = row.reduce((s, r) => s + r._area, 0);
    const maxA = row[row.length - 1]._area;
    const minA = row[0]._area;
    const s2 = sideLen * sideLen;
    return Math.max(
      (s2 * maxA) / (rowArea * rowArea),
      (rowArea * rowArea) / (s2 * minA)
    );
  }

  function layoutRow(row, rect, vertical) {
    const rowArea = row.reduce((s, r) => s + r._area, 0);
    const results = [];

    if (vertical) {
      const rowW = rowArea / rect.h;
      let y = rect.y;
      for (const item of row) {
        const h = item._area / rowW;
        results.push({ x: rect.x, y: y, w: rowW, h: h, company: item });
        y += h;
      }
      return {
        rects: results,
        remaining: { x: rect.x + rowW, y: rect.y, w: rect.w - rowW, h: rect.h }
      };
    } else {
      const rowH = rowArea / rect.w;
      let x = rect.x;
      for (const item of row) {
        const w = item._area / rowH;
        results.push({ x: x, y: rect.y, w: w, h: rowH, company: item });
        x += w;
      }
      return {
        rects: results,
        remaining: { x: rect.x, y: rect.y + rowH, w: rect.w, h: rect.h - rowH }
      };
    }
  }

  function squarify(items, rect) {
    if (!items.length) return [];
    if (items.length === 1) {
      return [{ x: rect.x, y: rect.y, w: rect.w, h: rect.h, company: items[0] }];
    }

    const totalValue = items.reduce((s, c) => s + c._area, 0);
    if (totalValue <= 0) return [];

    // Scale areas to fit the rect
    const scale = (rect.w * rect.h) / totalValue;
    items.forEach(c => { c._area = c._area * scale; });

    const allRects = [];
    let remaining = { ...rect };
    let row = [];
    let i = 0;

    while (i < items.length) {
      const vertical = remaining.w > remaining.h;
      const side = vertical ? remaining.h : remaining.w;

      if (row.length === 0) {
        row.push(items[i]);
        i++;
        continue;
      }

      const testRow = [...row, items[i]];
      if (worstRatio(testRow, side, remaining.w * remaining.h) <=
          worstRatio(row, side, remaining.w * remaining.h)) {
        row.push(items[i]);
        i++;
      } else {
        const result = layoutRow(row, remaining, vertical);
        allRects.push(...result.rects);
        remaining = result.remaining;
        row = [];
      }
    }

    // Layout final row
    if (row.length) {
      const vertical = remaining.w > remaining.h;
      const result = layoutRow(row, remaining, vertical);
      allRects.push(...result.rects);
    }

    return allRects;
  }

  // --- Text color based on background luminance ---
  function getTextColors(bgColorStr) {
    const match = bgColorStr.match(/(\d+)/g);
    if (!match || match.length < 3) return { main: 'rgba(224,224,232,0.95)', sub: 'rgba(160,160,170,0.85)' };
    const r = parseInt(match[0]), g = parseInt(match[1]), b = parseInt(match[2]);
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (lum > 0.48) {
      return { main: 'rgba(15,15,20,0.88)', sub: 'rgba(40,40,50,0.65)' };
    }
    return { main: 'rgba(224,224,232,0.95)', sub: 'rgba(160,160,170,0.85)' };
  }

  // --- Sub-label for active layer metric ---
  function getSubLabel(co, activeLayer) {
    switch (activeLayer) {
      case 'compute': {
        const g = co.compute.totalH100Equiv;
        return g >= 1e6 ? (g / 1e6).toFixed(1) + 'M GPU' : Math.round(g / 1e3) + 'K GPU';
      }
      case 'capex': {
        const ann = co.capex && co.capex.annual;
        if (!ann || !ann.length) return 'N/A';
        const amt = ann[ann.length - 1].amount;
        if (amt >= 1e12) return '$' + (amt / 1e12).toFixed(1) + '万亿';
        return '$' + Math.round(amt / 1e9) + '0亿';
      }
      case 'chipmix': return 'NVIDIA ' + co.chipMix.nvidia_pct + '%';
      case 'source': return '自建 ' + co.computeSource.selfBuilt_pct + '%';
      case 'growth': {
        if (!co.growth) return 'N/A';
        const v = co.growth.capexYoY;
        return (v > 0 ? '+' : '') + v + '% YoY';
      }
      default: return '';
    }
  }

  // --- Public API ---

  function layout(companies, w, h, valueFn) {
    valueFn = valueFn || function (c) { return c.compute.totalH100Equiv; };
    const items = companies
      .map(c => ({ ...c, _area: Math.max(0, valueFn(c)) }))
      .filter(c => c._area > 0)
      .sort((a, b) => b._area - a._area);

    rects = squarify(items, { x: 0, y: 0, w: w, h: h });
    return rects;
  }

  function draw(ctx, w, h, colorFn, hoveredId, activeLayer) {
    ctx.clearRect(0, 0, w, h);
    activeLayer = activeLayer || 'compute';

    for (const r of rects) {
      const co = r.company;
      const isHovered = hoveredId && co.id === hoveredId;

      // Fill rectangle
      const color = colorFn(co);
      ctx.fillStyle = color;
      ctx.fillRect(r.x, r.y, r.w, r.h);

      // Hover highlight
      if (isHovered) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(r.x, r.y, r.w, r.h);
        // Hover border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(r.x + 1, r.y + 1, r.w - 2, r.h - 2);
      }

      // Gap borders (dark lines to separate)
      ctx.strokeStyle = 'rgba(10, 10, 15, 0.9)';
      ctx.lineWidth = 2;
      ctx.strokeRect(r.x, r.y, r.w, r.h);

      // Confidence left border
      if (r.w > 30 && r.h > 20) {
        const conf = co.compute.confidence;
        if (conf === 'official') {
          ctx.fillStyle = 'rgba(76, 175, 80, 0.6)';
        } else if (conf === 'reported') {
          ctx.fillStyle = 'rgba(255, 193, 7, 0.5)';
        } else {
          ctx.fillStyle = 'rgba(255, 152, 0, 0.4)';
        }
        ctx.fillRect(r.x, r.y, 3, r.h);
      }

      // Text colors based on background luminance
      const txtColors = isHovered
        ? { main: '#ffffff', sub: 'rgba(255,255,255,0.7)' }
        : getTextColors(color);

      // Company name — centered text block
      if (r.w > 60 && r.h > 36) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(r.x + 4, r.y + 2, r.w - 8, r.h - 4);
        ctx.clip();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var cx = r.x + r.w / 2;
        var cy = r.y + r.h / 2;

        // Determine which lines to show
        var nameFontSize = r.w > 160 && r.h > 100 ? 16 : r.w > 120 && r.h > 70 ? 14 : r.w > 80 ? 12 : 11;
        var subFontSize = r.w > 120 && r.h > 80 ? 13 : 11;
        var lineGap = nameFontSize > 13 ? 22 : 18;

        var name = co.nameCN || co.name;
        ctx.font = 'bold ' + nameFontSize + 'px -apple-system, "PingFang SC", system-ui, sans-serif';
        if (ctx.measureText(name).width >= r.w - 16) name = co.name;

        var subLabel = getSubLabel(co, activeLayer);
        var showSub = r.h > 55 && r.w > 70;
        var showDate = r.h > 85 && r.w > 90;
        var dateTxt = co.compute.asOfDate || '';

        // Calculate total block height to center the group
        var lines = 1;
        if (showSub) lines = 2;
        if (showDate && dateTxt) lines = 3;
        var totalHeight = (lines - 1) * lineGap;
        var startY = cy - totalHeight / 2;

        // Line 1: Company name
        ctx.font = 'bold ' + nameFontSize + 'px -apple-system, "PingFang SC", system-ui, sans-serif';
        ctx.fillStyle = txtColors.main;
        ctx.fillText(name, cx, startY);

        // Line 2: Sub-label (metric value)
        if (showSub) {
          ctx.font = subFontSize + 'px -apple-system, system-ui, sans-serif';
          ctx.fillStyle = txtColors.sub;
          ctx.fillText(subLabel, cx, startY + lineGap);
        }

        // Line 3: Date
        if (showDate && dateTxt) {
          ctx.font = '10px -apple-system, system-ui, sans-serif';
          ctx.fillStyle = txtColors.sub;
          ctx.globalAlpha = 0.6;
          ctx.fillText(dateTxt, cx, startY + lineGap * 2);
          ctx.globalAlpha = 1.0;
        }

        ctx.restore();
      }
    }

    return rects;
  }

  function hitTest(x, y) {
    for (const r of rects) {
      if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
        return r.company;
      }
    }
    return null;
  }

  function getRects() {
    return rects;
  }

  // --- Gradient Legend ---

  function drawLegend(ctx, w, h, colorScale) {
    for (let i = 0; i < w; i++) {
      const t = i / (w - 1);
      const color = lerpColorArr(colorScale.low, colorScale.high, t, colorScale.mid);
      ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      ctx.fillRect(i, 0, 1, h);
    }
  }

  // --- Color Utilities ---

  function lerpColorArr(low, high, t, mid) {
    if (mid && t < 0.5) {
      const tt = t * 2;
      return [
        Math.round(low[0] + (mid[0] - low[0]) * tt),
        Math.round(low[1] + (mid[1] - low[1]) * tt),
        Math.round(low[2] + (mid[2] - low[2]) * tt)
      ];
    } else if (mid) {
      const tt = (t - 0.5) * 2;
      return [
        Math.round(mid[0] + (high[0] - mid[0]) * tt),
        Math.round(mid[1] + (high[1] - mid[1]) * tt),
        Math.round(mid[2] + (high[2] - mid[2]) * tt)
      ];
    }
    return [
      Math.round(low[0] + (high[0] - low[0]) * t),
      Math.round(low[1] + (high[1] - low[1]) * t),
      Math.round(low[2] + (high[2] - low[2]) * t)
    ];
  }

  return { layout, draw, hitTest, getRects, drawLegend, lerpColorArr };
})();
