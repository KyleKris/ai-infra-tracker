/* ============================================
   Charts — Stats panel + bar charts
   ============================================ */

const Charts = (function () {
  const TIER_COLORS = { 1: '#4caf50', 2: '#ff9800', 3: '#9e9e9e' };
  const TIER_NAMES = { 1: '第一梯队', 2: '第二梯队', 3: '第三梯队' };

  const LAYER_LABELS = {
    compute: '算力规模 排名',
    capex: '资本开支 排名',
    chipmix: '芯片供应商构成',
    source: '算力基础设施来源',
    growth: 'CapEx增速 排名'
  };

  const INSIGHTS = {
    compute: '前五名（Google、Meta、Microsoft、Amazon、OpenAI）占全球已追踪AI算力的80%以上，算力高度集中于美国科技巨头。',
    capex: '2025年全球AI资本开支预计超$4000亿，同比增长约50%。Amazon以超$1000亿领跑，中国企业投入正在快速追赶。',
    chipmix: '仅Google（TPU）和Amazon（Trainium）大规模部署自研AI芯片。多数企业仍高度依赖NVIDIA，供应链集中度风险显著。',
    source: 'OpenAI和Anthropic是唯二完全依赖外部算力的主要AI实验室。Meta和Google坚持100%自建路线，掌控成本与安全。',
    growth: 'Oracle（207%）和阿里巴巴（168%）资本开支增速最快，反映了追赶者的激进扩张策略。Tesla和OpenAI也在大幅加码，头部企业绝对值巨大。'
  };

  function fmtGPU(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return Math.round(n / 1e3) + 'K';
    return String(n);
  }

  function fmtUSD(n) {
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(1) + '万亿';
    if (n >= 1e9) return '$' + Math.round(n / 1e9) + '0亿';
    return '$' + Math.round(n / 1e8) + '亿';
  }

  function fmtPct(n) {
    if (n == null) return 'N/A';
    return n.toFixed(0) + '%';
  }

  function latestCapex(co) {
    if (!co.capex || !co.capex.annual || !co.capex.annual.length) return 0;
    return co.capex.annual[co.capex.annual.length - 1].amount;
  }

  function getMetricValue(co, layer) {
    switch (layer) {
      case 'compute': return co.compute.totalH100Equiv;
      case 'capex': return latestCapex(co);
      case 'growth': return co.growth ? co.growth.capexYoY : 0;
      default: return 0;
    }
  }

  function getMetricLabel(val, layer) {
    switch (layer) {
      case 'compute': return fmtGPU(val);
      case 'capex': return fmtUSD(val);
      case 'growth': return (val > 0 ? '+' : '') + fmtPct(val);
      default: return String(val);
    }
  }

  function getBarColor(layer) {
    return { compute: '#42a5f5', capex: '#e65100', growth: '#66bb6a' }[layer] || '#4caf50';
  }

  function getConfidence(co, layer) {
    switch (layer) {
      case 'compute': return co.compute.confidence;
      case 'capex': {
        const ann = co.capex && co.capex.annual;
        return ann && ann.length ? ann[ann.length - 1].confidence : 'estimated';
      }
      case 'growth': return co.growth ? (co.growth.confidence || 'estimated') : 'estimated';
      default: return 'estimated';
    }
  }

  function shortName(name) {
    return name.length > 8 ? name.substring(0, 8) : name;
  }

  // --- Ranking bar chart (compute, capex, growth) ---
  function buildRankingChart(companies, activeLayer) {
    let html = '<div class="stat-card">';
    html += '<div class="stats-section-title">' + LAYER_LABELS[activeLayer] + '</div>';

    const byMetric = [...companies]
      .map(c => ({
        name: c.name, nameCN: c.nameCN,
        value: getMetricValue(c, activeLayer),
        confidence: getConfidence(c, activeLayer)
      }))
      .sort((a, b) => b.value - a.value);

    const maxVal = Math.max(...byMetric.map(b => Math.abs(b.value)), 1);
    const barColor = getBarColor(activeLayer);

    for (const item of byMetric) {
      const pct = Math.abs(item.value) / maxVal * 100;
      const label = getMetricLabel(item.value, activeLayer);
      const confClass = 'conf-' + item.confidence;
      html += '<div class="bar-row">' +
        '<span class="bar-name" title="' + item.nameCN + '">' + shortName(item.name) + '</span>' +
        '<div class="bar-track">' +
        '<div class="bar-fill ' + confClass + '" style="width:' + pct + '%;background:' + barColor + '"></div>' +
        '</div>' +
        '<span class="bar-value">' + label + '</span>' +
        '</div>';
    }
    html += '</div>';
    return html;
  }

  // --- Stacked bar chart (chipmix, source) ---
  function buildStackedChart(companies, layer) {
    let html = '<div class="stat-card">';
    html += '<div class="stats-section-title">' + LAYER_LABELS[layer] + '</div>';

    if (layer === 'chipmix') {
      const sorted = [...companies].sort((a, b) => b.chipMix.nvidia_pct - a.chipMix.nvidia_pct);
      for (const co of sorted) {
        const nv = co.chipMix.nvidia_pct;
        const cu = co.chipMix.custom_pct;
        const ot = co.chipMix.other_pct || 0;
        html += '<div class="bar-row">' +
          '<span class="bar-name" title="' + co.nameCN + '">' + shortName(co.name) + '</span>' +
          '<div class="bar-track stacked-track">' +
          (nv > 0 ? '<div class="bar-seg" style="width:' + nv + '%;background:#76b900" title="NVIDIA ' + nv + '%"></div>' : '') +
          (cu > 0 ? '<div class="bar-seg" style="width:' + cu + '%;background:#7b1fa2" title="自研 ' + cu + '%"></div>' : '') +
          (ot > 0 ? '<div class="bar-seg" style="width:' + ot + '%;background:#ff9800" title="其他 ' + ot + '%"></div>' : '') +
          '</div>' +
          '<span class="bar-value" style="font-size:10px">' + nv + '/' + cu + '/' + ot + '</span>' +
          '</div>';
      }
      html += '<div class="stacked-legend">' +
        '<span class="sl-item"><span class="sl-dot" style="background:#76b900"></span>NVIDIA</span>' +
        '<span class="sl-item"><span class="sl-dot" style="background:#7b1fa2"></span>自研</span>' +
        '<span class="sl-item"><span class="sl-dot" style="background:#ff9800"></span>其他</span>' +
        '</div>';
    } else if (layer === 'source') {
      const sorted = [...companies].sort((a, b) => {
        // Sort by most interesting: non-100% first (more diverse), then 100% self-built, then 0%
        const aScore = (a.computeSource.selfBuilt_pct > 0 && a.computeSource.selfBuilt_pct < 100) ? 1000 + a.computeSource.selfBuilt_pct : a.computeSource.selfBuilt_pct;
        const bScore = (b.computeSource.selfBuilt_pct > 0 && b.computeSource.selfBuilt_pct < 100) ? 1000 + b.computeSource.selfBuilt_pct : b.computeSource.selfBuilt_pct;
        return bScore - aScore;
      });
      for (const co of sorted) {
        const sb = co.computeSource.selfBuilt_pct;
        const cl = co.computeSource.cloud_pct;
        const le = co.computeSource.leased_pct;
        // Build a descriptive label
        let valLabel = '';
        if (sb === 100) valLabel = '自建';
        else if (sb === 0) valLabel = (cl > le ? '云' : '租赁') + '为主';
        else valLabel = '混合';

        html += '<div class="bar-row">' +
          '<span class="bar-name" title="' + co.nameCN + '">' + shortName(co.name) + '</span>' +
          '<div class="bar-track stacked-track">' +
          (sb > 0 ? '<div class="bar-seg" style="width:' + sb + '%;background:#42a5f5" title="自建 ' + sb + '%"></div>' : '') +
          (cl > 0 ? '<div class="bar-seg" style="width:' + cl + '%;background:#ff8a65" title="云 ' + cl + '%"></div>' : '') +
          (le > 0 ? '<div class="bar-seg" style="width:' + le + '%;background:#ffd54f" title="租赁 ' + le + '%"></div>' : '') +
          '</div>' +
          '<span class="bar-value" style="font-size:10px">' + valLabel + '</span>' +
          '</div>';
      }
      html += '<div class="stacked-legend">' +
        '<span class="sl-item"><span class="sl-dot" style="background:#42a5f5"></span>自建</span>' +
        '<span class="sl-item"><span class="sl-dot" style="background:#ff8a65"></span>云</span>' +
        '<span class="sl-item"><span class="sl-dot" style="background:#ffd54f"></span>租赁</span>' +
        '</div>';
    }

    html += '</div>';
    return html;
  }

  // --- Tier section ---
  function buildTierSection(companies, totalGPU) {
    let html = '<div class="stat-card">';
    html += '<div class="stats-section-title">梯队分布</div>';

    for (const tier of [1, 2, 3]) {
      const tierCos = companies.filter(c => c.tier === tier);
      const tierGPU = tierCos.reduce((s, c) => s + c.compute.totalH100Equiv, 0);
      const share = totalGPU > 0 ? (tierGPU / totalGPU * 100).toFixed(1) : '0';

      html += '<div class="tier-row">' +
        '<div class="tier-color" style="background:' + TIER_COLORS[tier] + '"></div>' +
        '<span class="tier-name">' + TIER_NAMES[tier] + '</span>' +
        '<span class="tier-stats">' + tierCos.length + '家 \u00b7 ' + share + '%算力</span>' +
        '</div>';
    }
    html += '</div>';
    return html;
  }

  // --- Main update function ---
  function update(companies, activeLayer) {
    const panel = document.getElementById('stats-panel');
    if (!panel) return;

    const totalGPU = companies.reduce((s, c) => s + c.compute.totalH100Equiv, 0);
    const totalCapex = companies.reduce((s, c) => s + latestCapex(c), 0);

    let html = '';

    // Headline stats
    html += '<div class="stat-card">' +
      '<div class="stat-big">' + fmtGPU(totalGPU) + '</div>' +
      '<div class="stat-label">12家企业 H100等效GPU总量</div>' +
      '</div>';
    html += '<div class="stat-card">' +
      '<div class="stat-big">' + fmtUSD(totalCapex) + '</div>' +
      '<div class="stat-label">12家企业 最近年度CapEx总额</div>' +
      '</div>';

    // Layer-specific chart — only for treemap layers (compute/capex)
    // Chart-view layers (chipmix/source/growth) already show full charts in main area
    const TREEMAP_LAYERS = { compute: true, capex: true };
    if (TREEMAP_LAYERS[activeLayer]) {
      html += buildRankingChart(companies, activeLayer);
    }

    // Tier breakdown
    html += buildTierSection(companies, totalGPU);

    // Insight
    html += '<div class="insight">' + INSIGHTS[activeLayer] + '</div>';

    panel.innerHTML = html;
  }

  return { update };
})();
