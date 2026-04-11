/* ============================================
   Sankey — AI chip supply chain diagram
   Pure SVG with hover interactions
   ============================================ */

const Sankey = (function () {
  const NODE_COLORS = {
    'NVIDIA':           '#76b900',
    'Google TPU':       '#5e9bff',
    'Amazon Trainium':  '#ffb74d',
    'Meta MTIA':        '#42a5f5',
    'Huawei':           '#ef5350',
    'Meta':             '#42a5f5',
    'Google':           '#5e9bff',
    'Microsoft':        '#29b6f6',
    'Amazon':           '#ffb74d',
    'Oracle':           '#ff7043',
    'xAI':              '#ab47bc',
    'ByteDance':        '#ec407a',
    'Alibaba':          '#ffa726',
    'Tesla':            '#ef5350',
    'Apple':            '#bdbdbd',
    'OpenAI':           '#66bb6a',
    'Anthropic':        '#d4a574'
  };

  const COL_LEFT = ['NVIDIA', 'Google TPU', 'Amazon Trainium', 'Meta MTIA', 'Huawei'];
  const COL_MID = ['Meta', 'Google', 'Microsoft', 'Amazon', 'Oracle', 'xAI', 'ByteDance', 'Alibaba', 'Tesla', 'Apple'];
  const COL_RIGHT = ['OpenAI', 'Anthropic'];

  const FLOWS = [
    ['NVIDIA',          'Meta',       550],
    ['NVIDIA',          'Microsoft',  500],
    ['NVIDIA',          'Amazon',     300],
    ['NVIDIA',          'Google',     250],
    ['NVIDIA',          'ByteDance',  250],
    ['NVIDIA',          'xAI',        200],
    ['NVIDIA',          'Oracle',     150],
    ['NVIDIA',          'Alibaba',    120],
    ['NVIDIA',          'Tesla',       90],
    ['NVIDIA',          'Apple',       50],
    ['Google TPU',      'Google',     400],
    ['Amazon Trainium', 'Amazon',     200],
    ['Meta MTIA',       'Meta',       100],
    ['Huawei',          'ByteDance',   80],
    ['Huawei',          'Alibaba',     80],
    ['Microsoft',       'OpenAI',     350],
    ['Oracle',          'OpenAI',     100],
    ['Amazon',          'Anthropic',   60],
    ['Google',          'Anthropic',   30]
  ];

  // Precompute node totals for percentage calculation
  const NODE_TOTALS = {};
  function computeTotals() {
    for (const name of [...COL_LEFT, ...COL_MID, ...COL_RIGHT]) {
      const outVal = FLOWS.filter(f => f[0] === name).reduce((s, f) => s + f[2], 0);
      const inVal = FLOWS.filter(f => f[1] === name).reduce((s, f) => s + f[2], 0);
      NODE_TOTALS[name] = { out: outVal, in: inVal, total: Math.max(outVal, inVal) };
    }
  }

  function init() {
    computeTotals();
    const container = document.getElementById('sankey-container');
    if (!container) return;

    const width = container.clientWidth || 1000;
    const height = 480;
    const pad = { top: 30, right: 120, bottom: 20, left: 120 };
    const W = width - pad.left - pad.right;
    const H = height - pad.top - pad.bottom;
    const nodeW = 12;

    function nodeSize(name) {
      return NODE_TOTALS[name] ? NODE_TOTALS[name].total : 1;
    }

    function layoutCol(names, x) {
      const items = names.map(n => ({ name: n, size: nodeSize(n) }));
      const total = items.reduce((s, it) => s + it.size, 0);
      const gap = 5;
      const usableH = H - gap * (items.length - 1);
      const nodes = {};
      let y = 0;
      for (const it of items) {
        const h = Math.max(8, (it.size / total) * usableH);
        nodes[it.name] = { x, y, w: nodeW, h, name: it.name, _used_out: 0, _used_in: 0 };
        y += h + gap;
      }
      return nodes;
    }

    const colX = [0, W * 0.42, W * 0.84];
    const nodes = {
      ...layoutCol(COL_LEFT, colX[0]),
      ...layoutCol(COL_MID, colX[1]),
      ...layoutCol(COL_RIGHT, colX[2])
    };

    const parts = [];
    parts.push('<svg width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">');
    parts.push('<g transform="translate(' + pad.left + ',' + pad.top + ')">');

    // Column headers
    const headers = ['\u82af\u7247\u5236\u9020', '\u57fa\u7840\u8bbe\u65bd\u8fd0\u8425', 'AI\u6a21\u578b\u5f00\u53d1'];
    for (let i = 0; i < 3; i++) {
      parts.push('<text x="' + (colX[i] + nodeW / 2) + '" y="-12" text-anchor="middle" fill="#888894" font-size="11" letter-spacing="0.06em" font-family="system-ui, sans-serif">' + headers[i] + '</text>');
    }

    // Draw links with hover data attributes
    for (const [from, to, val] of FLOWS) {
      const fn = nodes[from];
      const tn = nodes[to];
      if (!fn || !tn) continue;

      const fromTotal = NODE_TOTALS[from].out || 1;
      const toTotal = NODE_TOTALS[to].in || 1;

      const fromH = (val / fromTotal) * fn.h;
      const fromY = fn.y + fn._used_out;
      fn._used_out += fromH;

      const toH = (val / toTotal) * tn.h;
      const toY = tn.y + tn._used_in;
      tn._used_in += toH;

      const x0 = fn.x + fn.w;
      const x1 = tn.x;
      const cx = (x0 + x1) / 2;

      const color = NODE_COLORS[from] || '#666';
      const fromPct = (val / fromTotal * 100).toFixed(1);
      const toPct = (val / toTotal * 100).toFixed(1);

      const d = 'M' + x0 + ',' + fromY + ' C' + cx + ',' + fromY + ' ' + cx + ',' + toY + ' ' + x1 + ',' + toY + ' L' + x1 + ',' + (toY + toH) + ' C' + cx + ',' + (toY + toH) + ' ' + cx + ',' + (fromY + fromH) + ' ' + x0 + ',' + (fromY + fromH) + ' Z';

      parts.push('<path class="sankey-flow" d="' + d + '" fill="' + color + '" fill-opacity="0.35" stroke="' + color + '" stroke-opacity="0.5" stroke-width="0.5" ' +
        'data-from="' + from + '" data-to="' + to + '" data-val="' + val + '" data-from-pct="' + fromPct + '" data-to-pct="' + toPct + '"/>');
    }

    // Draw nodes
    for (const [name, n] of Object.entries(nodes)) {
      const color = NODE_COLORS[name] || '#666';
      parts.push('<rect class="sankey-node" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" rx="2" fill="' + color + '" opacity="0.9" data-name="' + name + '"/>');

      const col = COL_LEFT.includes(name) ? 0 : COL_RIGHT.includes(name) ? 2 : 1;
      let lx, anchor;
      if (col === 0) { lx = n.x - 8; anchor = 'end'; }
      else { lx = n.x + n.w + 8; anchor = 'start'; }

      const ly = n.y + n.h / 2 + 4;
      parts.push('<text x="' + lx + '" y="' + ly + '" text-anchor="' + anchor + '" fill="#e0e0e8" font-size="12" font-family="system-ui, \'PingFang SC\', sans-serif" pointer-events="none">' + name + '</text>');
    }

    parts.push('</g></svg>');
    container.innerHTML = parts.join('\n');

    // --- Hover interactions ---
    setupHover(container);
  }

  function setupHover(container) {
    // Create tooltip element
    let tip = document.getElementById('sankey-tip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'sankey-tip';
      document.body.appendChild(tip);
    }

    const svg = container.querySelector('svg');
    if (!svg) return;

    // Flow hover
    svg.addEventListener('mouseover', function (e) {
      const flow = e.target.closest('.sankey-flow');
      if (flow) {
        // Dim all other flows
        svg.querySelectorAll('.sankey-flow').forEach(f => {
          f.setAttribute('fill-opacity', f === flow ? '0.7' : '0.1');
          f.setAttribute('stroke-opacity', f === flow ? '0.8' : '0.1');
        });

        const from = flow.dataset.from;
        const to = flow.dataset.to;
        const val = flow.dataset.val;
        const fromPct = flow.dataset.fromPct;
        const toPct = flow.dataset.toPct;

        tip.innerHTML =
          '<div class="sk-tip-title">' + from + ' \u2192 ' + to + '</div>' +
          '<div class="sk-tip-val">' + val + 'K GPU</div>' +
          '<div class="sk-tip-pct">\u5360 ' + from + ' \u4f9b\u5e94\u7684 ' + fromPct + '%</div>' +
          '<div class="sk-tip-pct">\u5360 ' + to + ' \u7b97\u529b\u7684 ' + toPct + '%</div>';
        tip.classList.add('visible');
        return;
      }

      // Node hover - highlight connected flows
      const node = e.target.closest('.sankey-node');
      if (node) {
        const name = node.dataset.name;
        svg.querySelectorAll('.sankey-flow').forEach(f => {
          const connected = f.dataset.from === name || f.dataset.to === name;
          f.setAttribute('fill-opacity', connected ? '0.6' : '0.08');
          f.setAttribute('stroke-opacity', connected ? '0.7' : '0.08');
        });

        const nt = NODE_TOTALS[name];
        if (nt) {
          tip.innerHTML =
            '<div class="sk-tip-title">' + name + '</div>' +
            (nt.in > 0 ? '<div class="sk-tip-val">\u6d41\u5165: ' + nt.in + 'K GPU</div>' : '') +
            (nt.out > 0 ? '<div class="sk-tip-val">\u6d41\u51fa: ' + nt.out + 'K GPU</div>' : '');
          tip.classList.add('visible');
        }
      }
    });

    svg.addEventListener('mousemove', function (e) {
      if (!tip.classList.contains('visible')) return;
      const pad = 12;
      let x = e.clientX + pad;
      let y = e.clientY + pad;
      const vw = window.innerWidth;
      const rect = tip.getBoundingClientRect();
      if (x + rect.width > vw - pad) x = e.clientX - rect.width - pad;
      if (y + rect.height > window.innerHeight - pad) y = e.clientY - rect.height - pad;
      tip.style.left = x + 'px';
      tip.style.top = y + 'px';
    });

    svg.addEventListener('mouseout', function (e) {
      const related = e.relatedTarget;
      if (related && (related.closest('.sankey-flow') || related.closest('.sankey-node'))) return;
      // Reset all flows
      svg.querySelectorAll('.sankey-flow').forEach(f => {
        f.setAttribute('fill-opacity', '0.35');
        f.setAttribute('stroke-opacity', '0.5');
      });
      tip.classList.remove('visible');
    });
  }

  return { init };
})();
