/* ============================================
   Detail — Company detail modal
   Click a treemap block → full data view
   ============================================ */

const Detail = (function () {
  let overlay = null;

  const FLAGS = { US: '\ud83c\uddfa\ud83c\uddf8', CN: '\ud83c\udde8\ud83c\uddf3' };
  const COUNTRY_CN = { US: '美国', CN: '中国' };
  const ROLE_CN = {
    hyperscaler: '超大规模运营商',
    cloud: '云服务提供商',
    'ai-lab': 'AI实验室',
    hardware: '硬件/芯片',
    conglomerate: '综合科技集团'
  };
  const TIER_LABELS = { 1: '第一梯队', 2: '第二梯队', 3: '第三梯队' };
  const TIER_CLASSES = { 1: 'dt-tier-1', 2: 'dt-tier-2', 3: 'dt-tier-3' };

  // --- Format helpers ---
  function fmtGPU(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return Math.round(n / 1e3) + 'K';
    return String(n);
  }

  function fmtUSD(n) {
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + '万亿';
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + '0亿';
    if (n >= 1e8) return '$' + (n / 1e8).toFixed(0) + '亿';
    return '$' + n.toLocaleString();
  }

  function fmtUSDShort(n) {
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(1) + '万亿';
    if (n >= 1e9) return '$' + Math.round(n / 1e9) + '0亿';
    return '$' + Math.round(n / 1e8) + '亿';
  }

  function confDots(level) {
    const map = { official: 4, reported: 3, estimated: 2 };
    const n = map[level] || 2;
    const labels = { official: '官方披露', reported: '媒体报道', estimated: '分析师估算' };
    let dots = '';
    for (let i = 0; i < 4; i++) {
      dots += i < n
        ? '<span class="conf conf-' + level + '">\u25cf</span>'
        : '<span class="conf conf-empty">\u25cb</span>';
    }
    return '<span class="dt-conf">' + dots + ' ' + (labels[level] || level) + '</span>';
  }

  // --- Create overlay once ---
  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'detail-overlay';
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hide();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hide();
    });
    document.body.appendChild(overlay);
  }

  // --- Show ---
  function show(company) {
    ensureOverlay();
    overlay.innerHTML = '<div class="dt-card">' + buildHTML(company) + '</div>';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Close button
    overlay.querySelector('.dt-close').addEventListener('click', hide);
  }

  // --- Hide ---
  function hide() {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // --- Build full detail HTML ---
  function buildHTML(co) {
    const flag = FLAGS[co.country] || '';
    const country = COUNTRY_CN[co.country] || co.country;
    const role = ROLE_CN[co.role] || co.role;

    let h = '';

    // Header
    h += '<button class="dt-close" aria-label="关闭">&times;</button>';
    h += '<div class="dt-header">';
    h += '  <h2 class="dt-company-name" style="border-left:4px solid ' + co.color + ';padding-left:12px">' + (co.nameCN || co.name) + '</h2>';
    h += '  <div class="dt-meta">';
    h += '    <span>' + flag + ' ' + country + '</span>';
    h += '    <span class="dt-tier ' + TIER_CLASSES[co.tier] + '">' + TIER_LABELS[co.tier] + '</span>';
    h += '    <span class="dt-role">' + role + '</span>';
    h += '  </div>';
    h += '</div>';

    // KPI cards row
    h += '<div class="dt-kpi-grid">';
    h += buildKPI(fmtGPU(co.compute.totalH100Equiv), 'H100等效GPU', confDots(co.compute.confidence));

    const latestCapex = co.capex && co.capex.annual && co.capex.annual.length
      ? co.capex.annual[co.capex.annual.length - 1] : null;
    if (latestCapex) {
      h += buildKPI(fmtUSDShort(latestCapex.amount), latestCapex.year + '年 CapEx', confDots(latestCapex.confidence));
    }

    if (co.growth && co.growth.capexYoY != null) {
      const sign = co.growth.capexYoY > 0 ? '+' : '';
      h += buildKPI(sign + co.growth.capexYoY + '%', 'CapEx同比增速', confDots(co.growth.confidence || 'estimated'));
    }

    h += buildKPI(co.chipMix.nvidia_pct + '%', 'NVIDIA芯片占比', '');
    h += '</div>';

    // GPU Breakdown
    h += '<div class="dt-section">';
    h += '  <h3>GPU 构成</h3>';
    h += buildChipBreakdown(co);
    h += '</div>';

    // CapEx Trend
    if (co.capex && co.capex.annual && co.capex.annual.length > 1) {
      h += '<div class="dt-section">';
      h += '  <h3>资本开支趋势</h3>';
      h += buildCapexChart(co);
      h += '</div>';
    }

    // Two-column: Chip Source + Compute Source
    h += '<div class="dt-two-col">';

    h += '<div class="dt-section">';
    h += '  <h3>芯片来源</h3>';
    h += buildChipMix(co);
    h += '</div>';

    h += '<div class="dt-section">';
    h += '  <h3>算力来源</h3>';
    h += buildComputeSource(co);
    h += '</div>';

    h += '</div>';

    // Key Facts
    if (co.keyFacts && co.keyFacts.length) {
      h += '<div class="dt-section">';
      h += '  <h3>关键事实</h3>';
      h += '  <ul class="dt-facts">';
      for (const f of co.keyFacts) {
        h += '    <li>' + f + '</li>';
      }
      h += '  </ul>';
      h += '</div>';
    }

    // Partnerships
    if (co.partnerships && co.partnerships.length) {
      h += '<div class="dt-section dt-partnerships">';
      h += '  <h3>合作伙伴</h3>';
      h += '  <div class="dt-tags">';
      for (const p of co.partnerships) {
        h += '    <span class="dt-tag">' + p + '</span>';
      }
      h += '  </div>';
      h += '</div>';
    }

    // Data source attribution
    h += '<div class="dt-source-attr">';
    h += '  数据来源: ';
    const srcIds = new Set();
    if (co.compute.sourceId) srcIds.add(co.compute.sourceId);
    if (co.capex && co.capex.annual) co.capex.annual.forEach(a => { if (a.sourceId) srcIds.add(a.sourceId); });

    const srcLabels = [];
    if (typeof AI_INFRA_DATA !== 'undefined' && AI_INFRA_DATA.sources) {
      for (const sid of srcIds) {
        const src = AI_INFRA_DATA.sources.find(s => s.id === sid);
        if (src) srcLabels.push(src.label);
      }
    }
    h += srcLabels.length ? srcLabels.join(' · ') : '多来源综合';
    h += '</div>';

    return h;
  }

  function buildKPI(value, label, conf) {
    return '<div class="dt-kpi">' +
      '<div class="dt-kpi-value">' + value + '</div>' +
      '<div class="dt-kpi-label">' + label + '</div>' +
      (conf ? '<div class="dt-kpi-conf">' + conf + '</div>' : '') +
      '</div>';
  }

  function buildChipBreakdown(co) {
    const bd = co.compute.breakdown;
    if (!bd || !bd.length) return '<div class="dt-muted">无详细数据</div>';

    const maxCount = Math.max(...bd.map(b => b.count));
    let h = '<div class="dt-chip-list">';

    for (const chip of bd) {
      const pct = maxCount > 0 ? (chip.count / maxCount * 100) : 0;
      const vendorColor = getVendorColor(chip.vendor);
      h += '<div class="dt-chip-row">';
      h += '  <span class="dt-chip-name">' + chip.chip + '</span>';
      h += '  <div class="dt-chip-bar-track">';
      h += '    <div class="dt-chip-bar-fill" style="width:' + pct + '%;background:' + vendorColor + '"></div>';
      h += '  </div>';
      h += '  <span class="dt-chip-count">' + fmtGPU(chip.count) + '</span>';
      h += '</div>';
    }

    h += '</div>';

    // Vendor legend
    const vendors = [...new Set(bd.map(b => b.vendor))];
    h += '<div class="dt-vendor-legend">';
    for (const v of vendors) {
      h += '<span class="dt-vendor-tag" style="border-left:3px solid ' + getVendorColor(v) + '">' + v + '</span>';
    }
    h += '</div>';

    return h;
  }

  function getVendorColor(vendor) {
    if (vendor.includes('NVIDIA')) return '#76b900';
    if (vendor.includes('Google') || vendor.includes('TPU')) return '#4285f4';
    if (vendor.includes('Amazon') || vendor.includes('Trainium') || vendor.includes('Inferentia')) return '#ff9900';
    if (vendor.includes('华为')) return '#cf0a2c';
    if (vendor.includes('Meta') || vendor.includes('MTIA')) return '#0668E1';
    if (vendor.includes('Microsoft') || vendor.includes('Maia')) return '#00a4ef';
    if (vendor.includes('Apple') || vendor.includes('M系列')) return '#a2aaad';
    if (vendor.includes('阿里') || vendor.includes('含光')) return '#ff6a00';
    if (vendor.includes('AMD')) return '#ed1c24';
    return '#888888';
  }

  function buildCapexChart(co) {
    const annual = co.capex.annual;
    const maxAmt = Math.max(...annual.map(a => a.amount));
    const aiShare = co.capex.aiSharePct || 0;

    let h = '<div class="dt-capex-chart">';
    for (const entry of annual) {
      const pct = maxAmt > 0 ? (entry.amount / maxAmt * 100) : 0;
      const confClass = 'conf-bar-' + entry.confidence;
      h += '<div class="dt-capex-col">';
      h += '  <div class="dt-capex-value">' + fmtUSDShort(entry.amount) + '</div>';
      h += '  <div class="dt-capex-bar-wrap">';
      h += '    <div class="dt-capex-bar ' + confClass + '" style="height:' + pct + '%"></div>';
      h += '  </div>';
      h += '  <div class="dt-capex-year">' + entry.year + '</div>';
      h += '</div>';
    }
    h += '</div>';

    if (aiShare > 0) {
      h += '<div class="dt-capex-note">AI相关支出占比约 ' + aiShare + '%</div>';
    }

    return h;
  }

  function buildChipMix(co) {
    const mix = co.chipMix;
    let h = '<div class="dt-mix-bars">';

    if (mix.nvidia_pct > 0) {
      h += mixBar('NVIDIA', mix.nvidia_pct, '#76b900');
    }
    if (mix.custom_pct > 0) {
      h += mixBar('自研', mix.custom_pct, '#7b1fa2');
    }
    if (mix.other_pct > 0) {
      h += mixBar('其他', mix.other_pct, '#ff9800');
    }

    h += '</div>';

    if (mix.details) {
      h += '<div class="dt-detail-text">' + mix.details + '</div>';
    }

    h += confDots(mix.confidence);
    return h;
  }

  function buildComputeSource(co) {
    const src = co.computeSource;
    let h = '<div class="dt-mix-bars">';

    if (src.selfBuilt_pct > 0) {
      h += mixBar('自建', src.selfBuilt_pct, '#42a5f5');
    }
    if (src.cloud_pct > 0) {
      h += mixBar('云', src.cloud_pct, '#ff8a65');
    }
    if (src.leased_pct > 0) {
      h += mixBar('租赁', src.leased_pct, '#ffd54f');
    }

    h += '</div>';

    if (src.details) {
      h += '<div class="dt-detail-text">' + src.details + '</div>';
    }

    h += confDots(src.confidence);
    return h;
  }

  function mixBar(label, pct, color) {
    return '<div class="dt-mix-row">' +
      '<span class="dt-mix-label">' + label + '</span>' +
      '<div class="dt-mix-track">' +
      '<div class="dt-mix-fill" style="width:' + pct + '%;background:' + color + '"></div>' +
      '</div>' +
      '<span class="dt-mix-pct">' + pct + '%</span>' +
      '</div>';
  }

  return { show, hide };
})();
