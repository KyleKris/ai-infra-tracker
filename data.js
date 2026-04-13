/* ============================================
   AI Infrastructure Tracker — Data Layer
   All company data with source attribution
   Last updated: 2026-04
   ============================================ */

const AI_INFRA_DATA = {
  meta: {
    lastUpdated: '2026-04-13',
    version: '1.1',
    h100EquivFactors: {
      'A100': 0.4,
      'H100': 1.0,
      'H200': 1.3,
      'H800': 0.9,
      'H20': 0.25,
      'B200': 2.5,
      'GB200': 3.0,
      'GB300': 3.5,
      'TPU v5p': 0.8,
      'TPU v6': 1.5,
      'Trainium2': 0.9,
      'MTIA v2': 0.3,
      'Ascend 910C': 0.5
    }
  },

  sources: [
    { id: 'meta-10k-2025', label: 'Meta 2025 10-K Filing', type: 'official' },
    { id: 'meta-earnings-q4-2025', label: 'Meta Q4 2025 Earnings Call', type: 'official' },
    { id: 'goog-10k-2025', label: 'Alphabet 2025 10-K Filing', type: 'official' },
    { id: 'msft-10k-fy2025', label: 'Microsoft FY2025 10-K Filing', type: 'official' },
    { id: 'amzn-10k-2025', label: 'Amazon 2025 10-K Filing', type: 'official' },
    { id: 'openai-stargate-2025', label: 'OpenAI Stargate Project Announcement, Jan 2025', type: 'official' },
    { id: 'openai-cfo-2026', label: 'OpenAI CFO Sarah Friar, Jan 2026', type: 'official' },
    { id: 'altman-gpu-2025', label: 'Sam Altman public statement, Jul 2025', type: 'reported' },
    { id: 'musk-colossus-2025', label: 'Elon Musk statements on Colossus, 2025', type: 'reported' },
    { id: 'orcl-fy2025', label: 'Oracle FY2025 10-K Filing', type: 'official' },
    { id: 'anthropic-aws-2025', label: 'Amazon-Anthropic partnership announcement', type: 'official' },
    { id: 'ft-bytedance-2025', label: 'Financial Times ByteDance reporting, 2025', type: 'reported' },
    { id: 'baba-earnings-2025', label: 'Alibaba FY2025 Earnings', type: 'official' },
    { id: 'tsla-10k-2025', label: 'Tesla 2025 10-K Filing', type: 'official' },
    { id: 'aapl-10k-2025', label: 'Apple FY2025 10-K Filing', type: 'official' },
    { id: 'epoch-gpu-clusters', label: 'Epoch AI GPU Clusters Database (CC-BY)', type: 'reported' },
    { id: 'lesswrong-gpu-est', label: 'LessWrong GPU Estimates (JeffTech/community)', type: 'estimated' },
    { id: 'cnbc-capex-2026', label: 'CNBC Big Tech AI CapEx reporting, Feb 2026', type: 'reported' },
    { id: 'dcd-stargate-2025', label: 'Data Center Dynamics Stargate reporting', type: 'reported' },
    { id: 'openai-oracle-2025', label: 'OpenAI-Oracle Stargate Partnership, Sep 2025', type: 'official' },
    { id: 'info-openai-stargate-shakeup-2026', label: 'The Information: OpenAI Stargate Leaders Depart, Apr 2026', type: 'reported' },
    { id: 'info-coreweave-anthropic-2026', label: 'The Information: CoreWeave Strikes Multi-Year Deal with Anthropic, Apr 2026', type: 'reported' },
    { id: 'info-anthropic-chip-2026', label: 'The Information: Anthropic Considers Designing its Own Chip, Apr 2026', type: 'reported' },
    { id: 'info-meta-compute-2026', label: 'The Information: OpenAI Stargate Execs Join Meta Compute Unit, Apr 2026', type: 'reported' },
    { id: 'info-google-intel-2026', label: 'The Information: Google Will Use Intel Chips in Data Centers, Apr 2026', type: 'reported' },
    { id: 'info-amazon-chips-2026', label: 'The Information: Amazon Considers Selling AI Chips Beyond AWS, Apr 2026', type: 'reported' },
    { id: 'info-meta-coreweave-35b-2026', label: 'The Information: Meta Expands CoreWeave Deals to $35B, Apr 2026', type: 'reported' },
    { id: 'info-openai-forecasts-2026', label: 'The Information: OpenAI Forecasts and Guesses, Apr 2026', type: 'reported' },
    { id: 'info-openai-rental-2025', label: 'The Information/量子位: OpenAI 2025-2030 Compute Rental Costs, Oct 2025', type: 'reported' }
  ],

  companies: [
    // =============================================
    // TIER 1: Data-rich
    // =============================================
    {
      id: 'meta',
      name: 'Meta',
      nameCN: 'Meta',
      country: 'US',
      tier: 1,
      role: 'hyperscaler',
      color: '#0668E1',

      compute: {
        totalH100Equiv: 650000,
        confidence: 'reported',
        sourceId: 'meta-earnings-q4-2025',
        asOfDate: '2025-12',
        breakdown: [
          { chip: 'H100', count: 350000, vendor: 'NVIDIA' },
          { chip: 'H200', count: 100000, vendor: 'NVIDIA' },
          { chip: 'GB200', count: 50000, vendor: 'NVIDIA' },
          { chip: 'A100', count: 100000, vendor: 'NVIDIA' },
          { chip: 'MTIA v2', count: 50000, vendor: 'Meta (自研)' }
        ]
      },

      capex: {
        annual: [
          { year: 2023, amount: 27.3e9, currency: 'USD', confidence: 'official', sourceId: 'meta-10k-2025' },
          { year: 2024, amount: 37.3e9, currency: 'USD', confidence: 'official', sourceId: 'meta-10k-2025' },
          { year: 2025, amount: 72.2e9, currency: 'USD', confidence: 'official', sourceId: 'meta-earnings-q4-2025' },
          { year: 2026, amount: 125e9, currency: 'USD', confidence: 'reported', sourceId: 'cnbc-capex-2026' }
        ],
        aiSharePct: 75
      },

      chipMix: {
        nvidia_pct: 85,
        custom_pct: 15,
        other_pct: 0,
        details: 'MTIA v2用于推理；NVIDIA H100/GB200用于训练',
        confidence: 'reported'
      },

      computeSource: {
        selfBuilt_pct: 70,
        cloud_pct: 0,
        leased_pct: 30,
        details: '自建为主 + CoreWeave $350亿(至2032) + Nebius $270亿(5年) + GCP $100亿+',
        confidence: 'reported'
      },

      growth: {
        capexYoY: 93,
        capacityYoY: 50,
        confidence: 'official'
      },

      keyFacts: [
        'Zuckerberg确认2024年底拥有约60万H100等效GPU',
        '计划2025-2026年部署超100万GPU',
        '自研MTIA v2芯片专注推理场景',
        '路易斯安那州在建全球最大AI数据中心（2GW）',
        '大规模租赁算力：CoreWeave $350亿(至2032) + Nebius $270亿 + GCP $100亿+',
        '2026年4月成立TBD Lab AI单元（Alexandr Wang领导）及Meta Compute部门',
        '从OpenAI Stargate招揽三名高管充实算力团队'
      ],
      partnerships: ['NVIDIA', 'Broadcom', 'CoreWeave ($35B)', 'Nebius ($27B)', 'Google Cloud']
    },

    {
      id: 'google',
      name: 'Google',
      nameCN: 'Google',
      country: 'US',
      tier: 1,
      role: 'hyperscaler',
      color: '#4285f4',

      compute: {
        totalH100Equiv: 1500000,
        confidence: 'estimated',
        sourceId: 'lesswrong-gpu-est',
        asOfDate: '2025-12',
        breakdown: [
          { chip: 'TPU v5p', count: 300000, vendor: 'Google (自研)' },
          { chip: 'TPU v6 Trillium', count: 200000, vendor: 'Google (自研)' },
          { chip: 'H100', count: 200000, vendor: 'NVIDIA' },
          { chip: 'H200', count: 50000, vendor: 'NVIDIA' },
          { chip: 'A100', count: 100000, vendor: 'NVIDIA' }
        ]
      },

      capex: {
        annual: [
          { year: 2023, amount: 32.3e9, currency: 'USD', confidence: 'official', sourceId: 'goog-10k-2025' },
          { year: 2024, amount: 52.5e9, currency: 'USD', confidence: 'official', sourceId: 'goog-10k-2025' },
          { year: 2025, amount: 91.4e9, currency: 'USD', confidence: 'official', sourceId: 'goog-10k-2025' },
          { year: 2026, amount: 180e9, currency: 'USD', confidence: 'reported', sourceId: 'cnbc-capex-2026' }
        ],
        aiSharePct: 70
      },

      chipMix: {
        nvidia_pct: 40,
        custom_pct: 60,
        other_pct: 0,
        details: 'TPU v5p/v6/v7为主力；GCP同时提供NVIDIA GPU',
        confidence: 'reported'
      },

      computeSource: {
        selfBuilt_pct: 100,
        cloud_pct: 0,
        leased_pct: 0,
        details: '全球自建超大规模数据中心网络',
        confidence: 'official'
      },

      growth: {
        capexYoY: 74,
        capacityYoY: 60,
        confidence: 'official'
      },

      keyFacts: [
        '自研TPU已迭代至第7代，是最成功的非NVIDIA AI芯片',
        '2026年CapEx指引$175-185B，涨幅惊人',
        'Google Cloud为Anthropic提供算力',
        'DeepMind是全球最大的内部AI研究消费方之一'
      ],
      partnerships: ['Broadcom (TPU设计)', 'Anthropic (云合作)']
    },

    {
      id: 'microsoft',
      name: 'Microsoft',
      nameCN: 'Microsoft',
      country: 'US',
      tier: 1,
      role: 'cloud',
      color: '#00a4ef',

      compute: {
        totalH100Equiv: 600000,
        confidence: 'estimated',
        sourceId: 'lesswrong-gpu-est',
        asOfDate: '2025-12',
        breakdown: [
          { chip: 'H100', count: 300000, vendor: 'NVIDIA' },
          { chip: 'H200', count: 100000, vendor: 'NVIDIA' },
          { chip: 'GB200', count: 50000, vendor: 'NVIDIA' },
          { chip: 'A100', count: 100000, vendor: 'NVIDIA' },
          { chip: 'Maia 100', count: 20000, vendor: 'Microsoft (自研)' }
        ]
      },

      capex: {
        annual: [
          { year: 2023, amount: 28.1e9, currency: 'USD', confidence: 'official', sourceId: 'msft-10k-fy2025' },
          { year: 2024, amount: 44.5e9, currency: 'USD', confidence: 'official', sourceId: 'msft-10k-fy2025' },
          { year: 2025, amount: 64.6e9, currency: 'USD', confidence: 'official', sourceId: 'msft-10k-fy2025' },
          { year: 2026, amount: 137e9, currency: 'USD', confidence: 'estimated', sourceId: 'cnbc-capex-2026' }
        ],
        aiSharePct: 75
      },

      chipMix: {
        nvidia_pct: 92,
        custom_pct: 8,
        other_pct: 0,
        details: '自研Maia AI芯片初步部署；Azure以NVIDIA为主',
        confidence: 'reported'
      },

      computeSource: {
        selfBuilt_pct: 70,
        cloud_pct: 0,
        leased_pct: 30,
        details: '正在从租赁转向自建；2025-2026取消大量租赁合同',
        confidence: 'reported'
      },

      growth: {
        capexYoY: 45,
        capacityYoY: 40,
        confidence: 'official'
      },

      keyFacts: [
        'OpenAI最大算力供应商，$250B Azure增量承诺',
        '自研Maia芯片2024年开始小规模部署',
        'Azure是全球第二大云，AI是最快增长业务',
        '正在大幅减少数据中心租赁，转向自建'
      ],
      partnerships: ['OpenAI ($250B Azure)', 'NVIDIA']
    },

    {
      id: 'amazon',
      name: 'Amazon',
      nameCN: 'Amazon',
      country: 'US',
      tier: 1,
      role: 'cloud',
      color: '#ff9900',

      compute: {
        totalH100Equiv: 500000,
        confidence: 'estimated',
        sourceId: 'lesswrong-gpu-est',
        asOfDate: '2025-12',
        breakdown: [
          { chip: 'Trainium2', count: 150000, vendor: 'Amazon (自研)' },
          { chip: 'H100', count: 150000, vendor: 'NVIDIA' },
          { chip: 'H200', count: 50000, vendor: 'NVIDIA' },
          { chip: 'Inferentia2', count: 80000, vendor: 'Amazon (自研)' },
          { chip: 'A100', count: 70000, vendor: 'NVIDIA' }
        ]
      },

      capex: {
        annual: [
          { year: 2023, amount: 52.7e9, currency: 'USD', confidence: 'official', sourceId: 'amzn-10k-2025' },
          { year: 2024, amount: 83e9, currency: 'USD', confidence: 'official', sourceId: 'amzn-10k-2025' },
          { year: 2025, amount: 131.8e9, currency: 'USD', confidence: 'official', sourceId: 'amzn-10k-2025' },
          { year: 2026, amount: 200e9, currency: 'USD', confidence: 'reported', sourceId: 'cnbc-capex-2026' }
        ],
        aiSharePct: 65
      },

      chipMix: {
        nvidia_pct: 55,
        custom_pct: 45,
        other_pct: 0,
        details: 'Trainium2/3用于训练，Inferentia用于推理；AWS同时提供NVIDIA',
        confidence: 'reported'
      },

      computeSource: {
        selfBuilt_pct: 85,
        cloud_pct: 0,
        leased_pct: 15,
        details: '自建为主，部分长期托管合同',
        confidence: 'reported'
      },

      growth: {
        capexYoY: 59,
        capacityYoY: 35,
        confidence: 'official'
      },

      keyFacts: [
        '2026年CapEx预计达$2000亿，全球最高',
        'Trainium自研芯片已迭代至第3代；芯片业务ARR超$200亿（若直接销售可达$500亿）',
        '正考虑向第三方直接销售芯片机架（不通过AWS）',
        'AWS AI收入run rate超$150亿（2026Q1）；AWS年化收入~$1420亿',
        '投资Anthropic $80亿，为其主要云供应商',
        'Project Rainier部署50万Trainium2芯片'
      ],
      partnerships: ['Anthropic ($8B投资)', 'NVIDIA']
    },

    {
      id: 'openai',
      name: 'OpenAI',
      nameCN: 'OpenAI',
      country: 'US',
      tier: 1,
      role: 'ai-lab',
      color: '#10a37f',

      compute: {
        totalH100Equiv: 1000000,
        confidence: 'reported',
        sourceId: 'altman-gpu-2025',
        asOfDate: '2025-12',
        breakdown: [
          { chip: 'H100', count: 300000, vendor: 'NVIDIA' },
          { chip: 'GB200', count: 450000, vendor: 'NVIDIA' },
          { chip: 'H200', count: 100000, vendor: 'NVIDIA' },
          { chip: 'GB300', count: 50000, vendor: 'NVIDIA' }
        ]
      },

      capex: {
        annual: [
          { year: 2023, amount: 2e9, currency: 'USD', confidence: 'estimated', sourceId: 'cnbc-capex-2026' },
          { year: 2024, amount: 5e9, currency: 'USD', confidence: 'reported', sourceId: 'cnbc-capex-2026' },
          { year: 2025, amount: 16e9, currency: 'USD', confidence: 'reported', sourceId: 'info-openai-rental-2025', note: '算力租赁成本口径（推理$7B+训练$9B），非传统CapEx' },
          { year: 2026, amount: 40e9, currency: 'USD', confidence: 'reported', sourceId: 'info-openai-rental-2025', note: '算力租赁成本（推理$19B+研发$15B+可货币化$6B）' }
        ],
        aiSharePct: 95
      },

      chipMix: {
        nvidia_pct: 95,
        custom_pct: 5,
        other_pct: 0,
        details: '几乎完全依赖NVIDIA；自研Titan推理芯片2026下半年量产',
        confidence: 'reported'
      },

      computeSource: {
        selfBuilt_pct: 0,
        cloud_pct: 60,
        leased_pct: 40,
        details: 'Azure $250B + Oracle/Stargate $500B + AWS $38B + CoreWeave $22B',
        confidence: 'official'
      },

      growth: {
        capexYoY: 150,
        capacityYoY: 200,
        confidence: 'reported'
      },

      keyFacts: [
        'Altman宣布2025年底前超100万GPU上线；ChatGPT周活跃用户9.2亿',
        'Stargate项目：与SoftBank/Oracle合建$5000亿，5个数据中心（TX/NM/OH/中西部），总计7GW',
        'Stargate团队已签约8GW容量（目标10GW未达成）',
        '2025年底算力容量达1.9GW；计划2026年底mid-single digit GW，2027年10+GW',
        '算力租赁成本：2025年$160亿→2030年$1000亿（6倍增长）；2025-2030累计~$4500亿',
        '2030年收入预测$2840亿（含广告$1020亿）；2028年为租赁峰值$1110亿',
        '战略转向：从自建转为租赁算力；NVIDIA $1000亿合作可能为芯片租赁模式',
        'Sachin Katti（前Intel高管）接任算力负责人',
        '自研Titan推理芯片（TSMC 3nm，Broadcom $100亿订单）'
      ],
      partnerships: ['Microsoft ($250B Azure)', 'SoftBank/Stargate', 'Oracle ($300B)', 'AWS ($38B)', 'CoreWeave ($22B)', 'NVIDIA ($100B LOI)']
    },

    // =============================================
    // TIER 2: Partial data
    // =============================================
    {
      id: 'xai',
      name: 'xAI',
      nameCN: 'xAI',
      country: 'US',
      tier: 2,
      role: 'ai-lab',
      color: '#666666',

      compute: {
        totalH100Equiv: 200000,
        confidence: 'reported',
        sourceId: 'musk-colossus-2025',
        asOfDate: '2025-06',
        breakdown: [
          { chip: 'H100', count: 150000, vendor: 'NVIDIA' },
          { chip: 'H200', count: 50000, vendor: 'NVIDIA' },
          { chip: 'GB200', count: 30000, vendor: 'NVIDIA' }
        ]
      },

      capex: {
        annual: [
          { year: 2024, amount: 5e9, currency: 'USD', confidence: 'estimated', sourceId: 'dcd-stargate-2025' },
          { year: 2025, amount: 10e9, currency: 'USD', confidence: 'estimated', sourceId: 'dcd-stargate-2025' }
        ],
        aiSharePct: 100
      },

      chipMix: {
        nvidia_pct: 100,
        custom_pct: 0,
        other_pct: 0,
        details: '完全依赖NVIDIA GPU',
        confidence: 'reported'
      },

      computeSource: {
        selfBuilt_pct: 60,
        cloud_pct: 0,
        leased_pct: 40,
        details: 'Memphis Colossus自建集群 + Oracle Cloud租赁',
        confidence: 'reported'
      },

      growth: {
        capexYoY: 100,
        capacityYoY: 150,
        confidence: 'estimated'
      },

      keyFacts: [
        'Memphis Colossus: 全球最大单体GPU集群之一',
        'Musk目标扩展至55万-100万GPU',
        '训练Grok系列大模型',
        'CFO Anthony Armstrong已离职；高管持续流失，联合创始人（除Musk外）已全部离开',
        '正逐步被SpaceX吸收；未上市，财务数据有限'
      ],
      partnerships: ['NVIDIA', 'Oracle Cloud']
    },

    {
      id: 'oracle',
      name: 'Oracle',
      nameCN: 'Oracle',
      country: 'US',
      tier: 2,
      role: 'cloud',
      color: '#f80000',

      compute: {
        totalH100Equiv: 450000,
        confidence: 'reported',
        sourceId: 'openai-oracle-2025',
        asOfDate: '2025-12',
        breakdown: [
          { chip: 'GB200', count: 450000, vendor: 'NVIDIA' },
          { chip: 'MI450', count: 0, vendor: 'AMD (计划中，Q3 2026部署50K)' }
        ]
      },

      capex: {
        annual: [
          { year: 2023, amount: 6.9e9, currency: 'USD', confidence: 'official', sourceId: 'orcl-fy2025' },
          { year: 2024, amount: 6.9e9, currency: 'USD', confidence: 'official', sourceId: 'orcl-fy2025' },
          { year: 2025, amount: 21.2e9, currency: 'USD', confidence: 'official', sourceId: 'orcl-fy2025' },
          { year: 2026, amount: 50e9, currency: 'USD', confidence: 'reported', sourceId: 'orcl-fy2025' }
        ],
        aiSharePct: 85
      },

      chipMix: {
        nvidia_pct: 95,
        custom_pct: 0,
        other_pct: 5,
        details: '以NVIDIA GB200为主；计划2026年部署5万AMD MI450',
        confidence: 'reported'
      },

      computeSource: {
        selfBuilt_pct: 100,
        cloud_pct: 0,
        leased_pct: 0,
        details: '为Stargate项目建设基础设施；OCI自有云',
        confidence: 'official'
      },

      growth: {
        capexYoY: 207,
        capacityYoY: 80,
        confidence: 'official'
      },

      keyFacts: [
        'Stargate项目核心建设方：Abilene部署45万GB200',
        'Zettascale10计划：目标80万GPU集群',
        'OCI云增长最快的超大规模厂商之一',
        'OpenAI $300B长期合同（2027-2031）'
      ],
      partnerships: ['OpenAI/Stargate ($300B)', 'NVIDIA', 'AMD']
    },

    {
      id: 'anthropic',
      name: 'Anthropic',
      nameCN: 'Anthropic',
      country: 'US',
      tier: 2,
      role: 'ai-lab',
      color: '#d4a574',

      compute: {
        totalH100Equiv: 80000,
        confidence: 'estimated',
        sourceId: 'lesswrong-gpu-est',
        asOfDate: '2025-06',
        breakdown: [
          { chip: 'H100', count: 30000, vendor: 'NVIDIA' },
          { chip: 'TPU v5p', count: 20000, vendor: 'Google' },
          { chip: 'Trainium2', count: 15000, vendor: 'Amazon' },
          { chip: 'A100', count: 15000, vendor: 'NVIDIA' }
        ]
      },

      capex: {
        annual: [
          { year: 2024, amount: 2.5e9, currency: 'USD', confidence: 'estimated', sourceId: 'lesswrong-gpu-est' },
          { year: 2025, amount: 4e9, currency: 'USD', confidence: 'estimated', sourceId: 'lesswrong-gpu-est' }
        ],
        aiSharePct: 90
      },

      chipMix: {
        nvidia_pct: 55,
        custom_pct: 0,
        other_pct: 45,
        details: 'NVIDIA (AWS) + Google TPU (GCP) + AWS Trainium2，多芯片多云策略',
        confidence: 'estimated'
      },

      computeSource: {
        selfBuilt_pct: 0,
        cloud_pct: 100,
        leased_pct: 0,
        details: 'AWS为主要云（Amazon投资$80亿）+ GCP（Google投资~$37.5亿）+ CoreWeave多年期合同（2026年启用）',
        confidence: 'official'
      },

      growth: {
        capexYoY: 60,
        capacityYoY: 80,
        confidence: 'estimated'
      },

      keyFacts: [
        'Amazon投资$80亿，指定AWS为主要云供应商',
        'Google投资~$37.5亿，使用GCP TPU训练；Broadcom/Google 3.5GW容量协议（2027年起）',
        'CoreWeave签署多年期算力供应合同（2026年内首批服务器上线）',
        '2025年底算力容量约1.4GW；目标确保10GW容量',
        'ARR达$300亿（2026年3月），同比增长超200%',
        '估值$380亿（2026年2月 Series G），总融资~$610-670亿',
        '正在探索自研AI芯片（早期阶段）',
        '多云多芯片策略：同时使用NVIDIA/TPU/Trainium',
        '无自建数据中心，完全依赖云供应商'
      ],
      partnerships: ['Amazon/AWS ($8B投资)', 'Google Cloud (~$3.75B投资)', 'CoreWeave (多年期算力合同)']
    },

    {
      id: 'bytedance',
      name: 'ByteDance',
      nameCN: '字节跳动',
      country: 'CN',
      tier: 2,
      role: 'conglomerate',
      color: '#010101',

      compute: {
        totalH100Equiv: 350000,
        confidence: 'estimated',
        sourceId: 'ft-bytedance-2025',
        asOfDate: '2025-12',
        breakdown: [
          { chip: 'H800', count: 150000, vendor: 'NVIDIA' },
          { chip: 'H20', count: 200000, vendor: 'NVIDIA' },
          { chip: 'Ascend 910C', count: 80000, vendor: '华为' }
        ]
      },

      capex: {
        annual: [
          { year: 2024, amount: 15e9, currency: 'USD', confidence: 'reported', sourceId: 'ft-bytedance-2025' },
          { year: 2025, amount: 21.3e9, currency: 'USD', confidence: 'reported', sourceId: 'ft-bytedance-2025' },
          { year: 2026, amount: 23e9, currency: 'USD', confidence: 'estimated', sourceId: 'ft-bytedance-2025' }
        ],
        aiSharePct: 75
      },

      chipMix: {
        nvidia_pct: 65,
        custom_pct: 0,
        other_pct: 35,
        details: 'NVIDIA H800/H20（受出口管制限制）+ 华为昇腾910C + 寒武纪',
        confidence: 'estimated'
      },

      computeSource: {
        selfBuilt_pct: 85,
        cloud_pct: 5,
        leased_pct: 10,
        details: '以自建数据中心为主，海外部分使用云服务',
        confidence: 'estimated'
      },

      growth: {
        capexYoY: 42,
        capacityYoY: 40,
        confidence: 'estimated'
      },

      keyFacts: [
        '2025年在NVIDIA芯片上花费约850亿元人民币',
        '大量囤积H20芯片（受出口管制最高规格）',
        '中国最大的AI算力买家',
        '同时采购华为昇腾和寒武纪芯片',
        '未上市，财务数据来自媒体报道'
      ],
      partnerships: ['NVIDIA (受限)', '华为', '寒武纪']
    },

    {
      id: 'alibaba',
      name: 'Alibaba',
      nameCN: '阿里巴巴',
      country: 'CN',
      tier: 2,
      role: 'cloud',
      color: '#ff6a00',

      compute: {
        totalH100Equiv: 200000,
        confidence: 'estimated',
        sourceId: 'lesswrong-gpu-est',
        asOfDate: '2025-12',
        breakdown: [
          { chip: 'H800', count: 60000, vendor: 'NVIDIA' },
          { chip: 'H20', count: 100000, vendor: 'NVIDIA' },
          { chip: 'Ascend 910C', count: 40000, vendor: '华为' },
          { chip: '含光', count: 10000, vendor: '阿里 (自研)' }
        ]
      },

      capex: {
        annual: [
          { year: 2023, amount: 5e9, currency: 'USD', confidence: 'official', sourceId: 'baba-earnings-2025' },
          { year: 2024, amount: 4.4e9, currency: 'USD', confidence: 'official', sourceId: 'baba-earnings-2025' },
          { year: 2025, amount: 11.8e9, currency: 'USD', confidence: 'official', sourceId: 'baba-earnings-2025' }
        ],
        aiSharePct: 70
      },

      chipMix: {
        nvidia_pct: 50,
        custom_pct: 15,
        other_pct: 35,
        details: 'NVIDIA H800/H20 + 华为昇腾 + 自研含光芯片',
        confidence: 'estimated'
      },

      computeSource: {
        selfBuilt_pct: 100,
        cloud_pct: 0,
        leased_pct: 0,
        details: '阿里云自有基础设施',
        confidence: 'official'
      },

      growth: {
        capexYoY: 168,
        capacityYoY: 60,
        confidence: 'official'
      },

      keyFacts: [
        'FY2025 CapEx创纪录792亿元人民币',
        '计划将AI产品支出翻倍',
        '阿里云是中国最大的云服务商',
        '自研含光AI芯片，但规模有限',
        '受美国芯片出口管制影响，加速国产替代'
      ],
      partnerships: ['NVIDIA (受限)', '华为', '自研含光']
    },

    // =============================================
    // TIER 3: Brief coverage
    // =============================================
    {
      id: 'tesla',
      name: 'Tesla',
      nameCN: 'Tesla',
      country: 'US',
      tier: 3,
      role: 'hardware',
      color: '#cc0000',

      compute: {
        totalH100Equiv: 100000,
        confidence: 'reported',
        sourceId: 'musk-colossus-2025',
        asOfDate: '2025-06',
        breakdown: [
          { chip: 'H100', count: 50000, vendor: 'NVIDIA' },
          { chip: 'H200', count: 30000, vendor: 'NVIDIA' },
          { chip: 'A100', count: 20000, vendor: 'NVIDIA' }
        ]
      },

      capex: {
        annual: [
          { year: 2023, amount: 8.9e9, currency: 'USD', confidence: 'official', sourceId: 'tsla-10k-2025' },
          { year: 2024, amount: 11.3e9, currency: 'USD', confidence: 'official', sourceId: 'tsla-10k-2025' },
          { year: 2025, amount: 8.5e9, currency: 'USD', confidence: 'official', sourceId: 'tsla-10k-2025' },
          { year: 2026, amount: 20e9, currency: 'USD', confidence: 'reported', sourceId: 'tsla-10k-2025' }
        ],
        aiSharePct: 44
      },

      chipMix: {
        nvidia_pct: 95,
        custom_pct: 5,
        other_pct: 0,
        details: 'NVIDIA GPU为主；Dojo自研芯片曾停摆后2026年重启',
        confidence: 'reported'
      },

      computeSource: {
        selfBuilt_pct: 100,
        cloud_pct: 0,
        leased_pct: 0,
        details: '得州Gigafactory内Cortex超级计算机',
        confidence: 'official'
      },

      growth: {
        capexYoY: 135,
        capacityYoY: 50,
        confidence: 'reported'
      },

      keyFacts: [
        'Cortex超级计算机位于得州Gigafactory',
        'Dojo自研芯片2025年8月停用，2026年1月重启',
        'AI主要用于自动驾驶FSD训练',
        '总CapEx中AI专项占比约30%'
      ],
      partnerships: ['NVIDIA']
    },

    {
      id: 'apple',
      name: 'Apple',
      nameCN: 'Apple',
      country: 'US',
      tier: 3,
      role: 'hardware',
      color: '#a2aaad',

      compute: {
        totalH100Equiv: 60000,
        confidence: 'estimated',
        sourceId: 'lesswrong-gpu-est',
        asOfDate: '2025-12',
        breakdown: [
          { chip: 'M系列服务器芯片', count: 30000, vendor: 'Apple (自研)' },
          { chip: 'H100', count: 20000, vendor: 'NVIDIA' },
          { chip: 'A100', count: 10000, vendor: 'NVIDIA' }
        ]
      },

      capex: {
        annual: [
          { year: 2023, amount: 11e9, currency: 'USD', confidence: 'official', sourceId: 'aapl-10k-2025' },
          { year: 2024, amount: 10e9, currency: 'USD', confidence: 'official', sourceId: 'aapl-10k-2025' },
          { year: 2025, amount: 12e9, currency: 'USD', confidence: 'official', sourceId: 'aapl-10k-2025' }
        ],
        aiSharePct: 25
      },

      chipMix: {
        nvidia_pct: 50,
        custom_pct: 50,
        other_pct: 0,
        details: '自研M系列芯片用于Private Cloud Compute；少量NVIDIA用于训练',
        confidence: 'estimated'
      },

      computeSource: {
        selfBuilt_pct: 100,
        cloud_pct: 0,
        leased_pct: 0,
        details: '自建服务器设施（亚利桑那Mesa, 得州Houston等）',
        confidence: 'official'
      },

      growth: {
        capexYoY: 20,
        capacityYoY: 15,
        confidence: 'estimated'
      },

      keyFacts: [
        '技术路线独特：用自研M系列芯片做服务器推理',
        'Private Cloud Compute: 端侧+云AI混合方案',
        'CapEx远低于其他巨头，AI投入相对保守',
        '宣布4年内在美投资$6000亿（含多种业务）'
      ],
      partnerships: ['TSMC (芯片制造)']
    }
  ]
};
