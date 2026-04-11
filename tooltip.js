/* ============================================
   Tooltip — Hover info panel
   ============================================ */

const Tooltip = (function () {
  let el = null;
  let isMobile = false;

  function init() {
    el = document.getElementById('tooltip');
    isMobile = 'ontouchstart' in window;
    if (isMobile) {
      el.classList.add('mobile-mode');
    }
  }

  function show(company, activeLayer, mouseX, mouseY) {
    if (!el) return;
    el.innerHTML = buildHTML(company, activeLayer);
    el.classList.add('visible');

    if (!isMobile) {
      position(mouseX, mouseY);
    }
  }

  function hide() {
    if (!el) return;
    el.classList.remove('visible');
  }

  function position(mx, my) {
    const pad = 16;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x = mx + pad;
    let y = my + pad;

    if (x + rect.width > vw - pad) {
      x = mx - rect.width - pad;
    }
    if (y + rect.height > vh - pad) {
      y = my - rect.height - pad;
    }
    if (x < pad) x = pad;
    if (y < pad) y = pad;

    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }

  // --- Confidence dots ---
  function confDots(level) {
    const map = { official: 4, reported: 3, estimated: 2 };
    const n = map[level] || 2;
    const labels = { official: '官方披露', reported: '媒体报道', estimated: '分析师估算' };
    let dots = '';
    for (let i = 0; i < 4; i++) {
      const cls = i < n ? `conf conf-${level}` : 'conf conf-empty';
      dots += `<span class="${cls}">●</span>`;
    }
    return `<span class="tt-conf">${dots} ${labels[level] || level}</span>`;
  }

  // --- Format helpers ---
  function fmtGPU(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return Math.round(n / 1000) + 'K';
    return n.toString();
  }

  function fmtUSD(n) {
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(1) + '万亿';
    if (n >= 1e9) return '$' + Math.round(n / 1e9) + '0亿';
    if (n >= 1e8) return '$' + (n / 1e8).toFixed(1) + '亿';
    return '$' + n.toLocaleString();
  }

  function fmtBillionUSD(n) {
    if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + '万亿';
    if (n >= 1e9) return '$' + (n / 1e9).toFixed(0) + '0亿';
    return '$' + (n / 1e8).toFixed(0) + '亿';
  }

  // Country flags
  const FLAGS = { US: '\ud83c\uddfa\ud83c\uddf8', CN: '\ud83c\udde8\ud83c\uddf3' };
  const COUNTRY_CN = { US: '美国', CN: '中国' };
  const ROLE_CN = {
    hyperscaler: '超大规模运营商',
    cloud: '云服务提供商',
    'ai-lab': 'AI实验室',
    hardware: '硬件/芯片',
    conglomerate: '综合科技集团'
  };

  function buildHTML(co, activeLayer) {
    const flag = FLAGS[co.country] || '';
    const country = COUNTRY_CN[co.country] || co.country;
    const role = ROLE_CN[co.role] || co.role;
    const tierLabel = `T${co.tier}`;

    let html = `
      <div class="tt-title">${co.nameCN || co.name} <span style="color:var(--fg3);font-size:12px;font-weight:400">${tierLabel}</span></div>
      <div class="tt-meta">${flag} ${country} · ${role}</div>
    `;

    // Sections
    const sections = [
      { key: 'compute', label: '算力规模', build: buildCompute },
      { key: 'capex', label: '资本开支', build: buildCapex },
      { key: 'chipmix', label: 'GPU型号构成', build: buildChipMix },
      { key: 'source', label: '算力来源', build: buildSource },
      { key: 'growth', label: '增长趋势', build: buildGrowth }
    ];

    for (const sec of sections) {
      const isActive = sec.key === activeLayer;
      html += `<div class="tt-section ${isActive ? 'tt-active' : ''}">`;
      html += `<div class="tt-section-label">${sec.label}</div>`;
      html += sec.build(co);
      html += `</div>`;
    }

    // Key facts
    if (co.keyFacts && co.keyFacts.length) {
      html += `<div class="tt-facts">`;
      for (const f of co.keyFacts) {
        html += `<div>· ${f}</div>`;
      }
      html += `</div>`;
    }

    return html;
  }

  function buildCompute(co) {
    const c = co.compute;
    const totalAll = (typeof AI_INFRA_DATA !== 'undefined')
      ? AI_INFRA_DATA.companies.reduce((s, x) => s + x.compute.totalH100Equiv, 0)
      : 1;
    const share = ((c.totalH100Equiv / totalAll) * 100).toFixed(1);

    let html = `<div class="tt-section-value">${fmtGPU(c.totalH100Equiv)} H100等效GPU</div>`;
    html += `<div class="tt-mini-bar"><div class="tt-mini-fill" style="width:${share}%;background:var(--accent)"></div></div>`;
    html += `<div class="tt-section-detail">占全球已追踪算力 ${share}%</div>`;

    // Chip breakdown
    if (c.breakdown && c.breakdown.length) {
      const top3 = c.breakdown.slice(0, 3);
      html += `<div class="tt-section-detail" style="margin-top:4px">`;
      html += top3.map(b => `${b.chip}: ${fmtGPU(b.count)}`).join(' · ');
      html += `</div>`;
    }

    html += confDots(c.confidence);
    return html;
  }

  function buildCapex(co) {
    const cap = co.capex;
    if (!cap || !cap.annual || !cap.annual.length) {
      return `<div class="tt-section-detail" style="color:var(--fg3)">数据不可用</div>`;
    }

    const latest = cap.annual[cap.annual.length - 1];
    const prev = cap.annual.length > 1 ? cap.annual[cap.annual.length - 2] : null;

    let html = `<div class="tt-section-value">${fmtBillionUSD(latest.amount)} <span style="font-size:12px;font-weight:400;color:var(--fg2)">(${latest.year})</span></div>`;

    if (prev) {
      const yoy = ((latest.amount - prev.amount) / prev.amount * 100).toFixed(0);
      const sign = yoy > 0 ? '+' : '';
      html += `<div class="tt-section-detail">${prev.year}: ${fmtBillionUSD(prev.amount)} → 同比${sign}${yoy}%</div>`;
    }

    if (cap.aiSharePct) {
      html += `<div class="tt-section-detail">AI相关占比约 ${cap.aiSharePct}%</div>`;
    }

    html += confDots(latest.confidence);
    return html;
  }

  function buildChipMix(co) {
    const mix = co.chipMix;
    const nv = mix.nvidia_pct;
    const cu = mix.custom_pct;
    const ot = mix.other_pct || 0;

    let html = `<div class="tt-section-value">NVIDIA ${nv}%`;
    if (cu > 0) html += ` · 自研 ${cu}%`;
    if (ot > 0) html += ` · 其他 ${ot}%`;
    html += `</div>`;

    // Stacked mini bar
    html += `<div class="tt-mini-bar" style="display:flex;overflow:hidden">`;
    if (nv > 0) html += `<div style="width:${nv}%;height:100%;background:#4caf50"></div>`;
    if (cu > 0) html += `<div style="width:${cu}%;height:100%;background:#7b1fa2"></div>`;
    if (ot > 0) html += `<div style="width:${ot}%;height:100%;background:#ff9800"></div>`;
    html += `</div>`;

    if (mix.details) {
      html += `<div class="tt-section-detail">${mix.details}</div>`;
    }

    html += confDots(mix.confidence);
    return html;
  }

  function buildSource(co) {
    const src = co.computeSource;
    let parts = [];
    if (src.selfBuilt_pct > 0) parts.push(`自建 ${src.selfBuilt_pct}%`);
    if (src.cloud_pct > 0) parts.push(`云 ${src.cloud_pct}%`);
    if (src.leased_pct > 0) parts.push(`租赁 ${src.leased_pct}%`);

    let html = `<div class="tt-section-value">${parts.join(' · ')}</div>`;

    if (src.details) {
      html += `<div class="tt-section-detail">${src.details}</div>`;
    }

    html += confDots(src.confidence);
    return html;
  }

  function buildGrowth(co) {
    const g = co.growth;
    if (!g || g.capexYoY == null) {
      return `<div class="tt-section-detail" style="color:var(--fg3)">数据不足</div>`;
    }

    const sign = g.capexYoY > 0 ? '+' : '';
    let html = `<div class="tt-section-value">CapEx同比 ${sign}${g.capexYoY.toFixed(0)}%</div>`;

    if (g.capacityYoY != null) {
      const csign = g.capacityYoY > 0 ? '+' : '';
      html += `<div class="tt-section-detail">算力容量同比 ${csign}${g.capacityYoY}%</div>`;
    }

    html += confDots(g.confidence || 'estimated');
    return html;
  }

  return { init, show, hide, position };
})();
