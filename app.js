/* ============================================
   App — Main controller
   ============================================ */

(function () {
  // --- Application State ---
  const STATE = {
    activeLayer: 'compute',
    colorMode: 'layer',
    hoveredCompany: null,
    canvasW: 0,
    canvasH: 0
  };

  // Layers that use treemap vs chart-view
  const TREEMAP_LAYERS = { compute: true, capex: true };

  // --- Color Scales ---
  const COLOR_SCALES = {
    compute: {
      low: [26, 35, 126],
      high: [144, 202, 249],
      domain: [50000, 1500000],
      fn: (co) => co.compute.totalH100Equiv,
      lowLabel: '5\u4e07 GPU',
      highLabel: '150\u4e07 GPU',
      sizeLabel: 'H100\u7b49\u6548GPU\u6570'
    },
    capex: {
      low: [255, 243, 224],
      high: [230, 81, 0],
      domain: [5e9, 130e9],
      fn: (co) => {
        const ann = co.capex && co.capex.annual;
        return ann && ann.length ? ann[ann.length - 1].amount : 0;
      },
      lowLabel: '$50\u4ebf',
      highLabel: '$1300\u4ebf',
      sizeLabel: '\u6700\u8fd1\u5e74\u5ea6CapEx'
    },
    chipmix: {
      low: [123, 31, 162],
      mid: [66, 66, 66],
      high: [76, 175, 80],
      domain: [0, 100],
      fn: (co) => co.chipMix.nvidia_pct,
      lowLabel: '\u81ea\u7814\u4e3a\u4e3b',
      highLabel: 'NVIDIA\u4e3a\u4e3b'
    },
    source: {
      low: [255, 138, 101],
      high: [66, 165, 245],
      domain: [0, 100],
      fn: (co) => co.computeSource.selfBuilt_pct,
      lowLabel: '\u4e91/\u79df\u8d41',
      highLabel: '\u81ea\u5efa'
    },
    growth: {
      low: [239, 83, 80],
      mid: [255, 213, 79],
      high: [102, 187, 106],
      domain: [0, 200],
      fn: (co) => co.growth ? co.growth.capexYoY : 0,
      lowLabel: '\u4f4e\u589e\u957f',
      highLabel: '\u9ad8\u589e\u957f'
    }
  };

  const TIER_COLORS = {
    1: 'rgb(76, 175, 80)',
    2: 'rgb(255, 152, 0)',
    3: 'rgb(158, 158, 158)'
  };

  const LAYOUT_FNS = {
    compute: (co) => co.compute.totalH100Equiv,
    capex: (co) => {
      const ann = co.capex && co.capex.annual;
      return ann && ann.length ? ann[ann.length - 1].amount : 0;
    }
  };

  // --- DOM References ---
  let canvas, ctx, legendCanvas, legendCtx;
  let legendLow, legendHigh, legendEl, chartView;

  // --- Color function ---
  function getColor(company) {
    if (STATE.colorMode === 'tier') {
      return TIER_COLORS[company.tier] || TIER_COLORS[3];
    }
    const scale = COLOR_SCALES[STATE.activeLayer];
    const value = scale.fn(company);
    const [lo, hi] = scale.domain;
    const t = Math.max(0, Math.min(1, (value - lo) / (hi - lo)));
    const c = Treemap.lerpColorArr(scale.low, scale.high, t, scale.mid);
    return 'rgb(' + c[0] + ', ' + c[1] + ', ' + c[2] + ')';
  }

  // --- Canvas Setup ---
  function setupCanvas() {
    const container = document.getElementById('treemap-container');
    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = Math.max(450, Math.min(w * 0.55, 700));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    STATE.canvasW = w;
    STATE.canvasH = h;
  }

  // --- Legend ---
  function updateLegend() {
    const isTreemap = !!TREEMAP_LAYERS[STATE.activeLayer];

    // Hide legend for chart-view layers
    if (!isTreemap) {
      legendEl.style.display = 'none';
      return;
    }

    legendEl.style.display = 'flex';
    var prefixes = legendEl.querySelectorAll('.legend-prefix, .legend-sep');

    if (STATE.colorMode === 'tier') {
      legendCanvas.style.display = 'none';
      prefixes.forEach(function (el) { el.style.display = 'none'; });
      legendLow.innerHTML = '<span class="tier-dot" style="background:#4caf50"></span>T1 <span class="tier-dot" style="background:#ff9800;margin-left:8px"></span>T2 <span class="tier-dot" style="background:#9e9e9e;margin-left:8px"></span>T3';
      legendHigh.textContent = '';
      return;
    }

    prefixes.forEach(function (el) { el.style.display = ''; });
    legendCanvas.style.display = '';

    // Update "面积 = ..." prefix
    var sizePrefix = legendEl.querySelector('.legend-prefix');
    if (sizePrefix) {
      var scale = COLOR_SCALES[STATE.activeLayer];
      sizePrefix.textContent = '\u9762\u79ef = ' + (scale.sizeLabel || '');
    }

    var scale = COLOR_SCALES[STATE.activeLayer];
    var dpr = window.devicePixelRatio || 1;
    var w = 240, h = 10;
    legendCanvas.width = w * dpr;
    legendCanvas.height = h * dpr;
    legendCanvas.style.width = w + 'px';
    legendCanvas.style.height = h + 'px';
    legendCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    Treemap.drawLegend(legendCtx, w, h, scale);
    legendLow.textContent = scale.lowLabel;
    legendHigh.textContent = scale.highLabel;
  }

  // --- Chart-View: alternative vis for percentage layers ---
  function renderChartView() {
    if (!chartView) return;
    var isTreemap = !!TREEMAP_LAYERS[STATE.activeLayer];

    if (isTreemap) {
      chartView.style.display = 'none';
      canvas.style.display = 'block';
      return;
    }

    canvas.style.display = 'none';
    chartView.style.display = 'block';

    var companies = AI_INFRA_DATA.companies;
    var html = '';

    if (STATE.activeLayer === 'chipmix') {
      html = buildChipMixView(companies);
    } else if (STATE.activeLayer === 'source') {
      html = buildSourceView(companies);
    } else if (STATE.activeLayer === 'growth') {
      html = buildGrowthView(companies);
    }

    chartView.innerHTML = html;

    // Wire up click handlers on rows
    chartView.querySelectorAll('.cv-row').forEach(function (row) {
      row.addEventListener('click', function () {
        var co = companies.find(function (c) { return c.id === row.dataset.id; });
        if (co && typeof Detail !== 'undefined') Detail.show(co);
      });
    });
  }

  function buildChipMixView(companies) {
    var sorted = companies.slice().sort(function (a, b) { return b.chipMix.nvidia_pct - a.chipMix.nvidia_pct; });

    var h = '<div class="cv-header">\u5404\u4f01\u4e1aGPU\u82af\u7247\u6765\u6e90\u5360\u6bd4\uff08\u70b9\u51fb\u67e5\u770b\u8be6\u60c5\uff09</div>';
    h += '<div class="cv-legend">' +
      '<span class="cv-lg"><span class="cv-dot" style="background:#76b900"></span>NVIDIA</span>' +
      '<span class="cv-lg"><span class="cv-dot" style="background:#7b1fa2"></span>\u81ea\u7814</span>' +
      '<span class="cv-lg"><span class="cv-dot" style="background:#ff9800"></span>\u5176\u4ed6</span>' +
      '</div>';

    for (var i = 0; i < sorted.length; i++) {
      var co = sorted[i];
      var nv = co.chipMix.nvidia_pct;
      var cu = co.chipMix.custom_pct;
      var ot = co.chipMix.other_pct || 0;

      h += '<div class="cv-row" data-id="' + co.id + '">';
      h += '<div class="cv-name">' + (co.nameCN || co.name) + '</div>';
      h += '<div class="cv-bar-wrap"><div class="cv-stacked">';
      if (nv > 0) h += '<div class="cv-seg" style="width:' + nv + '%;background:#76b900"><span>' + (nv >= 12 ? 'NVIDIA ' + nv + '%' : '') + '</span></div>';
      if (cu > 0) h += '<div class="cv-seg" style="width:' + cu + '%;background:#7b1fa2"><span>' + (cu >= 12 ? '\u81ea\u7814 ' + cu + '%' : '') + '</span></div>';
      if (ot > 0) h += '<div class="cv-seg" style="width:' + ot + '%;background:#ff9800"><span>' + (ot >= 12 ? '\u5176\u4ed6 ' + ot + '%' : '') + '</span></div>';
      h += '</div></div></div>';
    }
    return h;
  }

  function buildSourceView(companies) {
    var sorted = companies.slice().sort(function (a, b) {
      // Mixed first (most interesting), then self-built, then cloud-only
      var aW = (a.computeSource.selfBuilt_pct > 0 && a.computeSource.selfBuilt_pct < 100) ? 1000 : a.computeSource.selfBuilt_pct;
      var bW = (b.computeSource.selfBuilt_pct > 0 && b.computeSource.selfBuilt_pct < 100) ? 1000 : b.computeSource.selfBuilt_pct;
      return bW - aW;
    });

    var h = '<div class="cv-header">\u5404\u4f01\u4e1a\u7b97\u529b\u57fa\u7840\u8bbe\u65bd\u6765\u6e90\uff08\u70b9\u51fb\u67e5\u770b\u8be6\u60c5\uff09</div>';
    h += '<div class="cv-legend">' +
      '<span class="cv-lg"><span class="cv-dot" style="background:#42a5f5"></span>\u81ea\u5efa</span>' +
      '<span class="cv-lg"><span class="cv-dot" style="background:#ff8a65"></span>\u4e91</span>' +
      '<span class="cv-lg"><span class="cv-dot" style="background:#ffd54f"></span>\u79df\u8d41</span>' +
      '</div>';

    for (var i = 0; i < sorted.length; i++) {
      var co = sorted[i];
      var sb = co.computeSource.selfBuilt_pct;
      var cl = co.computeSource.cloud_pct;
      var le = co.computeSource.leased_pct;

      h += '<div class="cv-row" data-id="' + co.id + '">';
      h += '<div class="cv-name">' + (co.nameCN || co.name) + '</div>';
      h += '<div class="cv-bar-wrap"><div class="cv-stacked">';
      if (sb > 0) h += '<div class="cv-seg" style="width:' + sb + '%;background:#42a5f5"><span>' + (sb >= 12 ? '\u81ea\u5efa ' + sb + '%' : '') + '</span></div>';
      if (cl > 0) h += '<div class="cv-seg" style="width:' + cl + '%;background:#ff8a65"><span>' + (cl >= 12 ? '\u4e91 ' + cl + '%' : '') + '</span></div>';
      if (le > 0) h += '<div class="cv-seg" style="width:' + le + '%;background:#ffd54f"><span>' + (le >= 12 ? '\u79df\u8d41 ' + le + '%' : '') + '</span></div>';
      h += '</div></div></div>';
    }
    return h;
  }

  function buildGrowthView(companies) {
    var sorted = companies.slice().sort(function (a, b) {
      return (b.growth ? b.growth.capexYoY : 0) - (a.growth ? a.growth.capexYoY : 0);
    });
    var maxVal = 0;
    for (var i = 0; i < sorted.length; i++) {
      var v = sorted[i].growth ? Math.abs(sorted[i].growth.capexYoY) : 0;
      if (v > maxVal) maxVal = v;
    }
    if (maxVal === 0) maxVal = 1;

    var h = '<div class="cv-header">\u8d44\u672c\u5f00\u652f\u540c\u6bd4\u589e\u901f\uff08YoY%\uff09\u00b7 \u70b9\u51fb\u67e5\u770b\u8be6\u60c5</div>';

    for (var i = 0; i < sorted.length; i++) {
      var co = sorted[i];
      var val = co.growth ? co.growth.capexYoY : 0;
      var pct = Math.abs(val) / maxVal * 100;
      var t = Math.max(0, Math.min(1, val / 200));
      // Red → yellow → green gradient
      var r, g, b;
      if (t < 0.5) {
        var tt = t * 2;
        r = Math.round(239 + (255 - 239) * tt);
        g = Math.round(83 + (213 - 83) * tt);
        b = Math.round(80 + (79 - 80) * tt);
      } else {
        var tt2 = (t - 0.5) * 2;
        r = Math.round(255 + (102 - 255) * tt2);
        g = Math.round(213 + (187 - 213) * tt2);
        b = Math.round(79 + (106 - 79) * tt2);
      }
      var color = 'rgb(' + r + ',' + g + ',' + b + ')';
      var sign = val > 0 ? '+' : '';

      h += '<div class="cv-row" data-id="' + co.id + '">';
      h += '<div class="cv-name">' + (co.nameCN || co.name) + '</div>';
      h += '<div class="cv-bar-wrap"><div class="cv-single-bar"><div class="cv-bar-fill" style="width:' + pct + '%;background:' + color + '"></div></div></div>';
      h += '<div class="cv-val">' + sign + val + '%</div>';
      h += '</div>';
    }
    return h;
  }

  // --- Redraw ---
  function redraw() {
    var isTreemap = !!TREEMAP_LAYERS[STATE.activeLayer];
    if (isTreemap) {
      var valueFn = LAYOUT_FNS[STATE.activeLayer] || LAYOUT_FNS.compute;
      Treemap.layout(AI_INFRA_DATA.companies, STATE.canvasW, STATE.canvasH, valueFn);
      Treemap.draw(ctx, STATE.canvasW, STATE.canvasH, getColor, STATE.hoveredCompany, STATE.activeLayer);
    }
    renderChartView();
    updateLegend();
    Charts.update(AI_INFRA_DATA.companies, STATE.activeLayer);
  }

  // --- Event Handlers ---
  function onLayerChange(e) {
    var btn = e.target.closest('.layer-btn');
    if (!btn) return;
    var layer = btn.dataset.layer;
    if (layer === STATE.activeLayer) return;
    document.querySelectorAll('.layer-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    STATE.activeLayer = layer;
    redraw();
  }

  function onColorModeChange(e) {
    var btn = e.target.closest('.color-btn');
    if (!btn) return;
    var mode = btn.dataset.color;
    if (mode === STATE.colorMode) return;
    document.querySelectorAll('.color-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    STATE.colorMode = mode;
    if (TREEMAP_LAYERS[STATE.activeLayer]) {
      Treemap.draw(ctx, STATE.canvasW, STATE.canvasH, getColor, STATE.hoveredCompany, STATE.activeLayer);
    }
    updateLegend();
  }

  function onCanvasMouseMove(e) {
    if (!TREEMAP_LAYERS[STATE.activeLayer]) return;
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var company = Treemap.hitTest(x, y);
    if (company) {
      if (!STATE.hoveredCompany || STATE.hoveredCompany !== company.id) {
        STATE.hoveredCompany = company.id;
        canvas.style.cursor = 'pointer';
        Treemap.draw(ctx, STATE.canvasW, STATE.canvasH, getColor, STATE.hoveredCompany, STATE.activeLayer);
      }
    } else {
      if (STATE.hoveredCompany) {
        STATE.hoveredCompany = null;
        canvas.style.cursor = 'default';
        Treemap.draw(ctx, STATE.canvasW, STATE.canvasH, getColor, null, STATE.activeLayer);
      }
    }
  }

  function onCanvasMouseLeave() {
    STATE.hoveredCompany = null;
    canvas.style.cursor = 'default';
    if (TREEMAP_LAYERS[STATE.activeLayer]) {
      Treemap.draw(ctx, STATE.canvasW, STATE.canvasH, getColor, null, STATE.activeLayer);
    }
  }

  function onCanvasClick(e) {
    if (!TREEMAP_LAYERS[STATE.activeLayer]) return;
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var company = Treemap.hitTest(x, y);
    if (company && typeof Detail !== 'undefined') {
      Detail.show(company);
    }
  }

  function onCanvasTouchStart(e) {
    if (!TREEMAP_LAYERS[STATE.activeLayer]) return;
    e.preventDefault();
    var touch = e.touches[0];
    var rect = canvas.getBoundingClientRect();
    var x = touch.clientX - rect.left;
    var y = touch.clientY - rect.top;
    var company = Treemap.hitTest(x, y);
    if (company) {
      STATE.hoveredCompany = company.id;
      Treemap.draw(ctx, STATE.canvasW, STATE.canvasH, getColor, STATE.hoveredCompany, STATE.activeLayer);
      if (typeof Detail !== 'undefined') Detail.show(company);
    }
  }

  // Debounced resize
  var resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      setupCanvas();
      redraw();
    }, 150);
  }

  // --- Company Tags ---
  function renderCompanyTags() {
    var container = document.getElementById('company-tags');
    if (!container) return;
    var tierDotColors = { 1: '#4caf50', 2: '#ff9800', 3: '#9e9e9e' };
    var html = '';
    for (var i = 0; i < AI_INFRA_DATA.companies.length; i++) {
      var co = AI_INFRA_DATA.companies[i];
      html += '<button class="company-tag" data-id="' + co.id + '">' +
        '<span class="tag-dot" style="background:' + tierDotColors[co.tier] + '"></span>' +
        (co.nameCN || co.name) +
        '</button>';
    }
    container.innerHTML = html;

    container.addEventListener('click', function (e) {
      var tag = e.target.closest('.company-tag');
      if (!tag) return;
      var co = AI_INFRA_DATA.companies.find(function (c) { return c.id === tag.dataset.id; });
      if (co && typeof Detail !== 'undefined') Detail.show(co);
    });

    container.addEventListener('mouseover', function (e) {
      var tag = e.target.closest('.company-tag');
      if (!tag) return;
      STATE.hoveredCompany = tag.dataset.id;
      if (TREEMAP_LAYERS[STATE.activeLayer]) {
        Treemap.draw(ctx, STATE.canvasW, STATE.canvasH, getColor, STATE.hoveredCompany, STATE.activeLayer);
      }
    });

    container.addEventListener('mouseout', function (e) {
      var tag = e.target.closest('.company-tag');
      if (!tag) return;
      STATE.hoveredCompany = null;
      if (TREEMAP_LAYERS[STATE.activeLayer]) {
        Treemap.draw(ctx, STATE.canvasW, STATE.canvasH, getColor, null, STATE.activeLayer);
      }
    });
  }

  // --- Init ---
  function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    legendCanvas = document.getElementById('legend-canvas');
    legendCtx = legendCanvas.getContext('2d');
    legendLow = document.getElementById('legend-low');
    legendHigh = document.getElementById('legend-high');
    legendEl = document.getElementById('legend');
    chartView = document.getElementById('chart-view');

    setupCanvas();
    redraw();
    renderCompanyTags();

    document.getElementById('controls').addEventListener('click', function (e) {
      if (e.target.closest('.layer-btn')) onLayerChange(e);
      if (e.target.closest('.color-btn')) onColorModeChange(e);
    });

    canvas.addEventListener('mousemove', onCanvasMouseMove);
    canvas.addEventListener('mouseleave', onCanvasMouseLeave);
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('touchstart', onCanvasTouchStart, { passive: false });
    window.addEventListener('resize', onResize);

    if (typeof Sankey !== 'undefined' && Sankey.init) {
      Sankey.init(AI_INFRA_DATA);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
