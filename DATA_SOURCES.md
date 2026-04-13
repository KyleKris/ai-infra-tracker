# AI基础设施追踪器 — 数据溯源文档

> **用途**: 后台审核文档，用于逐条核实 `data.js` 中每个数据点的来源、原文引用和可信度  
> **最后更新**: 2026年4月13日  
> **维护说明**: 修改本文档后，通知开发者同步更新 `data.js` 和前端展示

---

## 目录

1. [方法论与换算系数](#方法论与换算系数)
2. [Meta](#1-meta)
3. [Google (Alphabet)](#2-google-alphabet)
4. [Microsoft](#3-microsoft)
5. [Amazon](#4-amazon)
6. [OpenAI](#5-openai)
7. [xAI](#6-xai)
8. [Oracle](#7-oracle)
9. [Anthropic](#8-anthropic)
10. [字节跳动 (ByteDance)](#9-字节跳动-bytedance)
11. [阿里巴巴 (Alibaba)](#10-阿里巴巴-alibaba)
12. [Tesla](#11-tesla)
13. [Apple](#12-apple)
14. [待核实/存疑项汇总](#待核实存疑项汇总)

---

## 方法论与换算系数

### H100等效GPU换算

本项目使用 **H100等效GPU数（H100e）** 作为统一算力度量单位。

| 芯片 | 换算系数 | 依据 |
|------|---------|------|
| A100 | 0.4x | 业界共识，基于FP16/FP8性能对比 |
| H100 | 1.0x | 基准单位 |
| H200 | 1.3x | 与H100同架构，HBM3e增加带宽 |
| H800 | 0.9x | 中国定制版H100，互联带宽降低 |
| H20 | 0.25x | 中国出口管制合规版，性能大幅削减 |
| B200 | 2.5x | Blackwell架构，FP8性能约为H100的2.5倍 |
| GB200 | 3.0x | Grace Blackwell超级芯片（含Grace CPU） |
| GB300 | 3.5x | GB200后继，HBM3e升级 |
| TPU v5p | 0.8x | Google自研，Epoch AI数据库估算 |
| TPU v6 (Trillium) | 1.5x | Google官方称性能为v5p的2倍，保守取1.5x |
| Trainium2 | 0.9x | AWS自研，基于公开基准测试 |
| MTIA v2 | 0.3x | Meta自研推理芯片，性能有限 |
| Ascend 910C | 0.5x | 华为自研，受制于先进制程限制 |

**来源**:
- Epoch AI GPU Clusters Documentation: https://epoch.ai/data/gpu-clusters-documentation
- Epoch AI定义: "H100e = AI超算的16-bit性能除以H100的16-bit性能"
- Epoch AI数据集（CC-BY许可）: https://epoch.ai/data/gpu-clusters/
- 部分系数为分析师估算，精确度约±20%

> ⚠️ **审核要点**: 换算系数影响全局数据，建议对照Epoch AI最新数据集验证。TPU v6和Trainium2的系数尤其需要确认。

---

## 1. Meta

**data.js中的值**: 梯队1 · 算力 650K H100e · 2025 CapEx $72.2B · 芯片 85% NVIDIA / 15%自研

### 1.1 算力规模: 650,000 H100等效

| 字段 | 值 |
|------|-----|
| data.js值 | 650,000 H100e |
| 可信度 | 🟡 reported |
| 来源 | Meta Q4 2025 Earnings; Zuckerberg公开声明 |

**原始引用与来源**:

- **2024年1月 Zuckerberg声明**: "Meta would have around 350,000 Nvidia H100 or around 600,000 H100 equivalents of compute if you include other GPUs by end of 2024."
  - 来源: [CNBC](https://www.cnbc.com/2024/01/18/mark-zuckerberg-indicates-meta-is-spending-billions-on-nvidia-ai-chips.html)
  - 来源: [HPCwire](https://www.hpcwire.com/2024/01/25/metas-zuckerberg-puts-its-ai-future-in-the-hands-of-600000-gpus/)
  - 来源: [DataCenterDynamics](https://www.datacenterdynamics.com/en/news/meta-to-operate-600000-gpus-by-year-end/)

- **2025年1月 Zuckerberg声明**: "Meta plans to end 2025 with more than 1.3 million GPUs"
  - 来源: [Sherwood News](https://sherwood.news/tech/holding-all-the-chips-meta-has-nearly-600-000-nvidia-h100-gpus/)
  - 来源: [Constellation Research](https://www.constellationr.com/blog-news/insights/meta-plans-end-2025-13-million-gpus-and-60b-65b-spent-ai)

> ⚠️ **审核要点**: data.js使用650K是基于"2024底600K + 2025年增量"的估算。但Zuckerberg说2025底1.3M GPU（非H100等效），实际H100e可能更高。需要确认Q4 2025 earnings中的最新数字。如果1.3M是原始GPU数（含A100等），H100e可能在800K-1M范围。**建议上调或注明差异**。

### 1.2 GPU明细

| 芯片 | data.js数量 | 来源 | 核实状态 |
|------|-----------|------|---------|
| H100 | 350,000 | Zuckerberg 2024年1月声明 | ✅ 有直接引用 |
| H200 | 100,000 | 分析师估算 | ⚠️ 无直接来源 |
| GB200 | 50,000 | 分析师估算 | ⚠️ 无直接来源 |
| A100 | 100,000 | 历史部署推测 | ⚠️ 无直接来源 |
| MTIA v2 | 50,000 | Meta官方提及部署，数量为估算 | ⚠️ 规模待确认 |

### 1.3 资本开支 (CapEx)

| 年度 | data.js值 | 实际/核实值 | 来源 | 可信度 |
|------|----------|-----------|------|--------|
| 2023 | $27.3B | **$28.1B**（含融资租赁）或$27.3B（仅物业设备） | Meta 10-K | 🟢 official |
| 2024 | $37.3B | **$39.2B**（含融资租赁）或$37.26B（仅物业设备） | Meta 10-K | 🟢 official |
| 2025 | $72.2B | **$72.22B**（实际值，非指引） | Meta Q4 2025 Earnings Release | 🟢 official |
| 2026 | $125B | **$115-135B（指引范围，$125B为中间值）** | Meta Q4 2025 Earnings Call | 🟡 reported |

> ⚠️ **审核要点**: Meta报告CapEx有两种口径：(1) 仅purchases of property and equipment；(2) 含principal payments on finance leases。2024年两者差距$2B。data.js使用的是口径(1)。建议统一使用口径(2)（含融资租赁），因为这是Meta官方新闻稿中的主要口径。如采用口径(2)，2023年应为$28.1B，2024年应为$39.2B。
>   - 来源: [Meta Q4 2023 Earnings](https://investor.atmeta.com/investor-news/press-release-details/2024/Meta-Reports-Fourth-Quarter-and-Full-Year-2023-Results-Initiates-Quarterly-Dividend/default.aspx)
>   - 来源: [Meta Q4 2024 10-K SEC Filing](https://www.sec.gov/Archives/edgar/data/1326801/000132680125000014/meta-12312024xexhibit991.htm)

**原始引用**:
- "Capital expenditures, including principal payments on finance leases, were $22.14 billion and $72.22 billion for the fourth quarter and full year 2025, respectively."
  - 来源: [Meta Q4 2025 Earnings](https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Fourth-Quarter-and-Full-Year-2025-Results/default.aspx)
  - PDF: [s21.q4cdn.com](https://s21.q4cdn.com/399680738/files/doc_news/Meta-Reports-Fourth-Quarter-and-Full-Year-2025-Results-2026.pdf)

- "Meta anticipates 2026 capital expenditures, including principal payments on finance leases, to be in the range of $115-135 billion"
  - 来源: 同上

> ✅ **审核结果**: 2023-2025 CapEx数据与官方财报一致。2026指引为$115-135B范围，data.js取$125B（中间值）合理。

### 1.4 芯片构成与算力来源

| 字段 | data.js值 | 核实状态 |
|------|----------|---------|
| NVIDIA占比 | 85% | ⚠️ 估算，无官方数字。**且遗漏AMD** |
| 自研占比 | 15% (MTIA) | ⚠️ Meta官方仅说"hundreds of thousands"MTIA芯片用于推理 |
| 自建比例 | 100% | ❌ **严重错误！见下方** |
| 路易斯安那2GW DC | 提及 | ✅ 2024年12月宣布，Richland Parish，$10B投资 |

> 🔴 **重大修正: Meta算力来源不是100%自建！**
>
> Meta签署了大量第三方云/算力租赁合同：
> - **CoreWeave**: $14.2B（2025年9月）+ 扩展$21B（2026年4月），总计~$35B，持续至2032年
>   - 来源: [CIO Dive](https://www.ciodive.com/news/meta-coreweave-strike-deal-expansion-compute-capacity/817109/)
> - **Nebius**: 最高$27B五年合同（2026年3月）
>   - 来源: [Techzine](https://www.techzine.eu/news/infrastructure/139622/dutch-nebius-signs-27-billion-deal-with-meta/)
> - **Google Cloud**: 报道$10B+合同（2025年8月）
>   - 来源: [Fortune](https://fortune.com/2026/01/24/meta-compute-zuckerberg-ai-infrastructure-giant-data-center/)
> - **Oracle**: 据报道正在洽谈~$20B合同
>
> Meta Q4 2025 earnings call提到费用增长来自"third-party cloud spend, higher depreciation, and higher infrastructure operating expenses"
>
> **建议更新**: selfBuilt_pct从100%改为约**70%**，leased_pct约**30%**
>
> 此外，芯片构成也需更新：Meta也使用**AMD MI300**芯片，不仅仅是NVIDIA+MTIA。2025年Meta官方称Andromeda推理系统已扩展至NVIDIA、AMD和MTIA三种芯片。
>   - 来源: [Meta官方博客, 2026年3月](https://about.fb.com/news/2026/03/expanding-metas-custom-silicon-to-power-our-ai-workloads/)

### 1.5 增长率

| 字段 | data.js值 | 计算核实 |
|------|----------|---------|
| CapEx YoY | 93% | ✅ ($72.2B - $37.3B) / $37.3B = 93.6% ✓ |

### 1.6 2026年4月更新（The Information报道）

**来源1**: The Information, "Meta Expands Cloud Deals With CoreWeave to $35 Billion through 2032", Apr 9, 2026
- Meta与CoreWeave新增 **$210亿** 合同（2027-2032），加此前$140亿，总计 **$350亿**
- CoreWeave SEC文件：合同取决于"satisfaction of delivery and availability of service requirements"
- 此前已签Nebius **$270亿**（5年）
- 2026年CapEx计划 **最高$1350亿**

**来源2**: The Information, "OpenAI Stargate Execs to Join Meta's New Compute Unit", Apr 10, 2026
- Meta成立 **TBD Lab** AI单元，由前Scale AI CEO **Alexandr Wang** 领导
- 新设 **Meta Compute** 部门，Santosh Janardhan（全球基础设施）和Daniel Gross（产品VP）直接向Zuckerberg汇报
- 招揽三名OpenAI Stargate高管（Hoeschele, Hemani, Saharan）加入Meta Compute
- Nat Friedman任高级AI主管，参与算力战略

> ✅ 已同步更新 data.js: computeSource从100%自建修正为70%自建/30%租赁，partnerships新增CoreWeave/Nebius/GCP

---

## 2. Google (Alphabet)

**data.js中的值**: 梯队1 · 算力 1,500K H100e · 2025 CapEx $91.4B · 芯片 40% NVIDIA / 60%自研

### 2.1 算力规模: 1,500,000 H100等效

| 字段 | 值 |
|------|-----|
| data.js值 | 1,500,000 H100e |
| 可信度 | 🔴 estimated |
| 来源 | LessWrong GPU Estimates / Epoch AI |

**核实情况**:
- Google从未公开披露GPU总量
- Epoch AI数据库有Google集群的部分条目: https://epoch.ai/data/gpu-clusters/
- 1.5M H100e是基于Google TPU部署规模 + GCP NVIDIA GPU的分析师估算

> ⚠️ **审核要点**: 这是全表中最大的单一数字，但可信度最低。Google的TPU到H100e的换算高度依赖系数设定。建议标注为"粗略估算"。

### 2.2 资本开支 (CapEx)

| 年度 | data.js值 | 实际/核实值 | 来源 | 可信度 |
|------|----------|-----------|------|--------|
| 2023 | $32.3B | $32.3B | Alphabet 2025 10-K | 🟢 official |
| 2024 | $52.5B | **$52.5B** | Alphabet 10-K | 🟢 official |
| 2025 | $91.4B | **$91.4B** | Alphabet Q4 2025 Earnings | 🟢 official |
| 2026 | $180B | **$175-185B（指引）** | Alphabet Q4 2025 Earnings Call | 🟡 reported |

**原始引用**:
- "Alphabet will spend between $175 billion to $185 billion in capex in 2026, possibly doubling the $91.4 billion it spent in 2025."
  - 来源: [CNBC](https://www.cnbc.com/2026/02/04/alphabet-resets-the-bar-for-ai-infrastructure-spending.html)
  - 来源: [Fortune](https://fortune.com/2026/02/04/alphabet-google-ai-spending-supply-constraints/)
  - 来源: [Tom's Hardware](https://www.tomshardware.com/tech-industry/alphabet-is-doubling-its-capital-expenditure-to-a-staggering-usd180-billion-in-2026-earnings-suggest-that-the-companys-ai-investments-may-be-paying-off)

- "Google's cloud unit saw its backlog surge 55% sequentially and more than double year-over-year, reaching $240 billion"
  - 来源: [DCD](https://www.datacenterdynamics.com/en/news/google-raises-2025-capex-estimate-again-to-91-93bn-significant-increase-in-data-center-spend-for-2026/)

> ✅ **审核结果**: CapEx数据与官方一致。2026指引$175-185B，data.js取$180B合理。

### 2.3 芯片构成

| 字段 | data.js值 | 核实状态 |
|------|----------|---------|
| NVIDIA占比 | 40% | ⚠️ 估算。Google大量使用TPU，但GCP也提供NVIDIA |
| 自研占比 (TPU) | 60% | ⚠️ 估算。Google是最大的自研AI芯片用户 |
| TPU v7 (Ironwood) | 已确认 | ✅ 2025年4月Google Cloud Next发布 |

**TPU v7 确认**:
- 代号"Ironwood"，2025年4月发布，第7代TPU，首款专为大规模推理设计
- "Ironwood delivers up to 10x higher peak performance than TPU v5p and over 4x better per-chip efficiency vs TPU v6e"
  - 来源: [Google Blog](https://blog.google/products/google-cloud/ironwood-tpu-age-of-inference/)（2025年4月）

### 2.4 增长率

| 字段 | data.js值 | 计算核实 |
|------|----------|---------|
| CapEx YoY | 74% | ✅ ($91.4B - $52.5B) / $52.5B = 74.1% ✓ |

---

## 3. Microsoft

**data.js中的值**: 梯队1 · 算力 600K H100e · FY2025 CapEx $64.6B · 芯片 92% NVIDIA / 8%自研

### 3.1 算力规模: 600,000 H100等效

| 字段 | 值 |
|------|-----|
| data.js值 | 600,000 H100e |
| 可信度 | 🔴 estimated |
| 来源 | LessWrong GPU Estimates |

> ⚠️ **审核要点**: Microsoft未公开GPU总量。600K是分析师基于CapEx和GPU单价推算的估计。

### 3.2 资本开支 (CapEx)

| 年度 | data.js值 | 实际/核实值 | 来源 | 可信度 |
|------|----------|-----------|------|--------|
| 2023 | $28.1B | $28.1B | Microsoft FY2024 10-K (FY ends June) | 🟢 official |
| 2024 | $44.5B | **$44.5B** | Microsoft FY2025 10-K | 🟢 official |
| 2025 | $64.6B | **$64.6B** | Microsoft FY2025 10-K | 🟢 official |
| 2026 | $137B | ⚠️ 分析师估算 | 🔴 estimated |

**原始引用**:
- "Microsoft spent $64.6 billion on capital expenditures in FY2025, up from $44.5 billion in FY2024 — a 45% increase."
  - 来源: [Beancount.io](https://beancount.io/blog/2026/03/23/microsoft-fy2025-earnings-analysis)
  - 来源: [Microsoft 2025 Annual Report](https://www.microsoft.com/investor/reports/ar25/index.html)

- "Microsoft expects to spend $80 billion on AI-enabled data centers in fiscal 2025" (早期指引，实际更高)
  - 来源: [CNBC, Jan 2025](https://www.cnbc.com/2025/01/03/microsoft-expects-to-spend-80-billion-on-ai-data-centers-in-fy-2025.html)

> ⚠️ **审核要点**: 注意Microsoft财年结束于6月底（FY2025 = 2024.7-2025.6），与日历年不同。data.js中的年份标注可能造成混淆。建议在注释中说明。2026年$137B为估算值，无官方指引。

### 3.3 OpenAI合作

**原始引用**:
- "OpenAI has contracted to purchase an incremental $250B of Azure services"
  - 来源: [OpenAI官方博客](https://openai.com/index/next-chapter-of-microsoft-openai-partnership/)
  - 来源: [Microsoft官方博客, Oct 2025](https://blogs.microsoft.com/blog/2025/10/28/the-next-chapter-of-the-microsoft-openai-partnership/)

- Microsoft持有OpenAI约27%股份（as-converted diluted basis），投资价值约$135B
  - 来源: [Pulse2](https://pulse2.com/microsoft-and-openai-sign-new-135-billion-partnership-agreement/)

> ✅ $250B Azure承诺有官方来源确认。

### 3.4 算力来源与Maia芯片

| 字段 | data.js值 | 核实状态 |
|------|----------|---------|
| 自建比例 | 70% | ❌ **可能方向错误，见下方** |
| 租赁比例 | 30% | ❌ **可能方向错误** |
| Maia芯片 | 20,000 | ⚠️ 高估。Maia 100仅用于内部员工培训，未投入生产 |

> 🔴 **重大修正: Microsoft算力来源比例可能颠倒！**
>
> L.E.K. Consulting数据显示Microsoft历史上**近100%依赖租赁**，正在向**70%租赁/30%自建**过渡（目标2028年）。
> 即data.js中的70%自建/30%租赁**可能完全颠倒**，实际情况更接近30%自建/70%租赁。
>   - 来源: [L.E.K. Consulting](https://www.lek.com/insights/tmt/au/vd/build-vs-lease-hyperscale-landscape)
>   - 来源: [SemiAnalysis](https://newsletter.semianalysis.com/p/microsofts-datacenter-freeze)
>
> **租赁合同取消详情**（已确认）:
> - 取消~200MW已签租赁容量
> - 放弃2GW+正在洽谈的合同
> - 让1GW+ LOI过期
> - 冻结1.5GW自建项目
> - 原因: 主要因2025年1月重组后不再支持OpenAI增量训练负载
>   - 来源: [Fortune, Feb 2025](https://fortune.com/2025/02/24/microsoft-cancels-leases-for-ai-data-centers-analyst-says/)
>   - 来源: [Bisnow](https://www.bisnow.com/national/news/data-center/microsoft-is-stepping-away-from-more-than-2gw-of-data-center-capacity-128681)
>
> **Maia芯片详情**:
> - Maia 100: 2023年11月发布，仅内部员工培训使用，未投入生产环境
>   - 来源: [DCD](https://www.datacenterdynamics.com/en/news/microsoft-delays-production-of-maia-100-ai-chip-to-2026-report/)
> - Maia 200: 2026年1月26日发布，推理专用，TSMC 3nm，10+ PFLOPS FP4
>   - 来源: [TechCrunch](https://techcrunch.com/2026/01/26/microsoft-announces-powerful-new-chip-for-ai-inference/)
>   - 来源: [Microsoft Blog](https://blogs.microsoft.com/blog/2026/01/26/maia-200-the-ai-accelerator-built-for-inference/)
> - 8%自研占比可能严重高估当前状态（Maia 200刚开始部署）

### 3.5 增长率

| 字段 | data.js值 | 计算核实 |
|------|----------|---------|
| CapEx YoY | 45% | ✅ ($64.6B - $44.5B) / $44.5B = 45.2% ✓ |

---

## 4. Amazon

**data.js中的值**: 梯队1 · 算力 500K H100e · 2025 CapEx $131.8B · 芯片 55% NVIDIA / 45%自研

### 4.1 算力规模: 500,000 H100等效

| 字段 | 值 |
|------|-----|
| data.js值 | 500,000 H100e |
| 可信度 | 🔴 estimated |
| 来源 | LessWrong GPU Estimates |

### 4.2 资本开支 (CapEx)

| 年度 | data.js值 | 实际/核实值 | 来源 | 可信度 |
|------|----------|-----------|------|--------|
| 2023 | $52.7B | $52.7B | Amazon 2024 10-K | 🟢 official |
| 2024 | $83B | **$83B** | Amazon 2025 10-K | 🟢 official |
| 2025 | $131.8B | **$131.82B** | Amazon Q4 2025 Earnings | 🟢 official |
| 2026 | $200B | **~$200B（指引）** | Amazon Q4 2025 Earnings Call | 🟡 reported |

**原始引用**:
- "For full-year 2025, Amazon reported capex of $131.82 billion... Amazon's capital expenditures increased in 2025 (+58.8%) compared to 2024."
  - 来源: [Futurum Group](https://futurumgroup.com/insights/amazon-q4-fy-2025-revenue-beat-aws-24-amid-200b-capex-plan/)
  
- "Management expects approximately $200.0 billion in FY 2026 capital expenditures, predominantly for AWS and AI infrastructure"
  - 来源: [Variety](https://variety.com/2026/digital/news/amazon-q4-2025-earnings-capex-advertising-sales-1236653797/)
  - 来源: [CNBC](https://www.cnbc.com/2025/02/06/amazon-expects-to-spend-100-billion-on-capital-expenditures-in-2025.html) (早期$100B指引)

> ✅ **审核结果**: CapEx数据与官方一致。

### 4.3 芯片构成

| 字段 | data.js值 | 核实状态 |
|------|----------|---------|
| NVIDIA占比 | 55% | ⚠️ 无官方数据 |
| 自研占比 | 45% | ⚠️ **可能高估**。2024年4月AWS内部数据显示Trainium仅占NVIDIA使用量0.5%，Inferentia 2.7% |

> ⚠️ **审核要点**: 45%自研芯片可能严重高估当前状态。行业估计自研芯片在hyperscaler中占15-25%市场份额。但Project Rainier (500K Trainium2) 部署后比例可能有显著提升。
>   - 来源: [CNBC](https://www.cnbc.com/2025/11/21/nvidia-gpus-google-tpus-aws-trainium-comparing-the-top-ai-chips.html)

### 4.4 Anthropic投资与Trainium

**原始引用**:
- Amazon对Anthropic总投资**$8B**: $1.25B（2023.9）+ $2.75B（2024.3）+ $4B（2024.11）= $8B
  - 来源: [GeekWire](https://www.geekwire.com/2024/amazon-boosts-total-anthropic-investment-to-8b-deepens-ai-partnership-with-claude-maker/)
  - 来源: [TechCrunch](https://techcrunch.com/2024/11/22/anthropic-raises-an-additional-4b-from-amazon-makes-aws-its-primary-cloud-partner/)

- **Project Rainier 500K Trainium2: ✅ 已确认**
  - 2025年10月底/11月初激活
  - AWS CEO Matt Garman: "Anthropic is already running about 500,000 chips in Indiana"
  - 目标: 年底前超100万Trainium2芯片
  - 来源: [Amazon官方](https://www.aboutamazon.com/news/aws/aws-project-rainier-ai-trainium-chips-compute-cluster)
  - 来源: [DCD](https://www.datacenterdynamics.com/en/news/aws-activates-project-rainier-cluster-of-nearly-500000-trainium2-chips/)

- **Trainium3: ✅ 已确认**
  - 2025年12月2日AWS re:Invent发布
  - TSMC 3nm，2.52 PFLOPS FP8，144 GB HBM3e
  - 性能为Trainium2的4.4倍
  - Trainium4已在开发中，计划集成NVIDIA NVLink
  - 来源: [AWS官方](https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/)
  - 来源: [TechCrunch](https://techcrunch.com/2025/12/02/amazon-releases-an-impressive-new-ai-chip-and-teases-a-nvidia-friendly-roadmap/)

### 4.4 增长率

| 字段 | data.js值 | 计算核实 |
|------|----------|---------|
| CapEx YoY | 59% | ✅ ($131.8B - $83B) / $83B = 58.8% ≈ 59% ✓ |

### 4.5 2026年4月更新

**来源**: The Information, "Amazon Considers Selling AI Chips Beyond AWS", Apr 9, 2026
- Amazon芯片业务ARR突破 **$200亿**（Jassy股东信，较2月的$100亿翻倍）
- 若直接向第三方销售芯片，run rate可达 **$500亿**
- CEO Jassy表示"quite possible"未来会直接向第三方出售芯片机架
- AWS AI收入run rate超 **$150亿**（2026Q1）
- AWS年化收入约 **$1420亿**

> ✅ 已同步更新 data.js keyFacts

---

## 5. OpenAI

**data.js中的值**: 梯队1 · 算力 1,000K H100e · 2025 CapEx $8B · 芯片 95% NVIDIA / 5%自研

### 5.1 算力规模: 1,000,000 H100等效

| 字段 | 值 |
|------|-----|
| data.js值 | 1,000,000 H100e |
| 可信度 | 🟡 reported |
| 来源 | Sam Altman公开声明, Jul 2025 |

**原始引用**:
- **Sam Altman, Jul 2025 (X/Twitter)**: "we will cross well over 1 million GPUs brought online by the end of this year! very proud of the team but now they better get to work figuring out how to 100x that lol"
  - 来源: [X.com/sama](https://x.com/sama/status/1947057625780396512)
  - 来源: [Tom's Hardware](https://www.tomshardware.com/tech-industry/sam-altman-teases-100-million-gpu-scale-for-openai-that-could-cost-usd3-trillion-chatgpt-maker-to-cross-well-over-1-million-by-end-of-year)
  - 来源: [NextBigFuture](https://www.nextbigfuture.com/2025/07/openai-sam-altman-claim-about-1-million-gpus-are-not-one-data-center.html)

> ⚠️ **审核要点**: Altman说"1 million GPUs"是原始GPU数量而非H100等效。如果包含大量GB200（3.0x系数），H100e可能远高于1M。但data.js直接用1M作为H100e值，可能偏保守。

### 5.2 GPU明细

| 芯片 | data.js数量 | 核实状态 |
|------|-----------|---------|
| H100 | 300,000 | ⚠️ 估算 |
| GB200 | 450,000 | ⚠️ 来自Abilene/Stargate报道，但450K具体分配需确认 |
| H200 | 100,000 | ⚠️ 估算 |
| GB300 | 50,000 | ⚠️ 估算 |

**Stargate/Abilene相关报道**:
- "By the end of summer 2025, 16,000 GB200 GPUs were installed, with 64,000 planned by end of 2026" — 这与data.js中450K GB200差距很大
  - 来源: [IntuitionLabs](https://intuitionlabs.ai/articles/openai-stargate-datacenter-details)

> ⚠️ **重大审核要点**: data.js中GB200数量450K可能严重高估。搜索结果显示Abilene站点2025夏仅安装16K GB200，2026底计划64K。需要重新核实。

### 5.3 资本开支 (CapEx)

| 年度 | data.js值 | 来源 | 可信度 |
|------|----------|------|--------|
| 2023 | $2B | 分析师估算 | 🔴 estimated |
| 2024 | $5B | 媒体报道 | 🟡 reported |
| 2025 | $8B | OpenAI CFO Sarah Friar | 🟡 reported |
| 2026 | $17B | 媒体报道 | 🟡 reported |

> ⚠️ **审核要点**: OpenAI不直接拥有大部分基础设施（通过Azure/Oracle/CoreWeave），其CapEx定义与hyperscaler不同。这些数字可能是运营支出而非资本支出。

### 5.4 Stargate项目与合作伙伴

**原始引用**:

- **Stargate总投资$500B**: "The Stargate Project is a new company which intends to invest $500 billion over the next four years building new AI infrastructure"
  - 来源: [OpenAI官方](https://openai.com/index/announcing-the-stargate-project/)

- **Oracle $300B合同**: "OpenAI commits to paying Oracle $60 billion annually for five years (2027-2031)"
  - 来源: [DataCenterFrontier](https://www.datacenterfrontier.com/machine-learning/article/55316610/openai-and-oracles-300b-stargate-deal-building-ais-national-scale-infrastructure)
  - 来源: [OpenAI官方](https://openai.com/index/stargate-advances-with-partnership-with-oracle/)

- **Microsoft Azure $250B**: 见上方Microsoft章节

- **AWS $38B**: "OpenAI and AWS Forge $38B Alliance"
  - 来源: [Logistics Viewpoints](https://logisticsviewpoints.com/2025/11/03/33669/)

- **CoreWeave $22B**: ⚠️ 需要单独核实

### 5.4b 2026年4月更新（The Information报道）

**来源**: The Information, "OpenAI Stargate Leaders Depart in Latest Shakeup to Data Center Strategy", Apr 9, 2026

**关键数据点**:
- Stargate团队已签约 **8 GW** 容量（短于2025年1月宣布时设定的10 GW目标）
- OpenAI 2025年底容量约 **1.9 GW**（"same amount of power as two nuclear power plants"）
- 容量规划：**2026年底 mid-single digit GW，2027年 10+ GW**
- OpenAI投资者备忘录估计Anthropic 2025年底容量 **1.4 GW**
- OpenAI估计Anthropic：2026年 **3-4 GW**，2027年底 **7-8 GW**
- 5年计算支出目标约 **$600B**（与此前keyFacts一致）
- 战略转向：**从自建数据中心转为租赁算力**
- **Sachin Katti**（前Intel高管）接任算力负责人
- 三名高管离职（Hoeschele, Hemani, Saharan）→ 加入Meta Compute

> ✅ 已同步更新 data.js keyFacts

### 5.5 自研Titan芯片

**原始引用**:
- "OpenAI's Titan chip is a custom ASIC designed exclusively for AI inference workloads... co-developed with Broadcom, manufactured by TSMC on the 3nm (N3) process node"
  - 来源: [TrendForce](https://www.trendforce.com/news/2026/01/15/news-openai-reportedly-to-deploy-custom-ai-chip-on-tsmc-n3-by-end-2026-second-gen-planned-for-a16/)
  - 来源: [DCD](https://www.datacenterdynamics.com/en/news/openai-building-first-custom-ai-inference-chip-with-tsmc-and-broadcom-report/)
- 量产时间：2026下半年
- Broadcom合作价值约$10B

> ✅ Titan芯片信息与data.js keyFacts一致

### 5.6 算力租赁成本预测（2025-2030）

**来源**: The Information (via 量子位), ~Oct 2025; Peter Gostev 整理

| 年度 | 推理 | 研发 | 可货币化 | **总计** |
|------|------|------|---------|---------|
| 2025 | $70亿 | $90亿 | — | **$160亿** |
| 2026 | $190亿 | $150亿 | $60亿 | **$400亿** |
| 2027 | $200亿 | $310亿 | $180亿 | **$690亿** |
| 2028 | $290亿 | $400亿 | $420亿 | **$1110亿**（峰值） |
| 2029 | $390亿 | $420亿 | $270亿 | **$1080亿** |
| 2030 | $500亿 | $500亿 | $50亿 | **$1050亿** |

- 2025-2030累计约 **$4500亿** 租赁服务器
- 推理CAGR 48%，训练CAGR 41%
- NVIDIA $1000亿合作可能为芯片租赁模式（2025年9月报道）

> ⚠️ **审核要点**: data.js CapEx此前使用$8B/2025，实为CFO Sarah Friar口径。The Information的$16B是"算力租赁成本"口径，更全面。已更新data.js采用$16B/$40B并标注口径差异。

### 5.7 收入预测与广告（2026年4月）

**来源**: The Information, "OpenAI, Forecasts and Guesses", Apr 9, 2026

- OpenAI 2025年收入 **$130亿**；2030年预测 **$2840亿**
- ChatGPT广告收入：2026年 $24亿 → 2027年 $110亿 → 2030年 **$1020亿**
  - 分析师（MoffettNathanson）认为路径"比预期更崎岖更慢"
- ChatGPT周活跃用户 **9.2亿**
- 2026年2月起测试广告

> ✅ 已同步更新 data.js keyFacts

---

## 6. xAI

**data.js中的值**: 梯队2 · 算力 200K H100e · 芯片 100% NVIDIA

### 6.1 算力规模: 200,000 H100等效

**原始引用**:
- "As of June 2025, the supercomputer consists of 150,000 H100 GPUs, 50,000 H200 GPUs and 30,000 GB200 GPUs, totaling approximately 230,000 GPUs"
  - 来源: [HPCwire](https://www.hpcwire.com/2025/05/13/colossus-ai-hits-200000-gpus-as-musk-ramps-up-ai-ambitions/)
  - 来源: [Tom's Hardware](https://www.tomshardware.com/tech-industry/artificial-intelligence/musks-colossus-is-fully-operational-with-200-000-gpus-backed-by-tesla-batteries-phase-2-to-consume-300-mw-enough-to-power-300-000-homes)

- 扩展计划: "The facility will house 555,000 NVIDIA GPUs purchased for approximately $18 billion"
  - 来源: [Introl Blog](https://introl.com/blog/xai-colossus-2-gigawatt-expansion-555k-gpus-january-2026)

- 历史时间线: 2024年7月100K H100 → 2025年2月200K GPU → 2025年6月230K GPU
  - 来源: [Wikipedia - Colossus](https://en.wikipedia.org/wiki/Colossus_(supercomputer))

> ⚠️ **审核要点**: data.js用200K H100e，但实际GPU数为230K（截至2025.6），按系数计算H100e应为: 150K×1.0 + 50K×1.3 + 30K×3.0 = 150K + 65K + 90K = **305K H100e**。**data.js严重低估，建议更新至~300K**。

### 6.2 GPU明细

| 芯片 | data.js | 媒体报道 | 差异 |
|------|---------|---------|------|
| H100 | 150,000 | 150,000 | ✅ 一致 |
| H200 | 50,000 | 50,000 | ✅ 一致 |
| GB200 | 30,000 | 30,000 | ✅ 一致 |

> 但总H100e计算有误，见上方。

### 6.3 资本开支

| 年度 | data.js值 | 来源 | 可信度 |
|------|----------|------|--------|
| 2024 | $5B | 估算 | 🔴 estimated |
| 2025 | $10B | 估算 | 🔴 estimated |

- 扩展至555K GPU花费约$18B（来源: Introl Blog）
- xAI未上市，无财报数据

### 6.3 2026年4月更新

**来源**: The Information, "OpenAI, Forecasts and Guesses", Apr 9, 2026
- CFO **Anthony Armstrong** 已离职，为"高管离职潮"一部分
- 除Musk外所有联合创始人已离开
- xAI正被 **SpaceX** 吸收；Armstrong最后向SpaceX CFO汇报
- 分析师质疑：若Musk专注SpaceX上市和轨道数据中心概念，xAI是否会逐步消亡

> ✅ 已同步更新 data.js keyFacts

---

## 7. Oracle

**data.js中的值**: 梯队2 · 算力 450K H100e · FY2025 CapEx $21.2B · 增长 207%

### 7.1 资本开支 (CapEx)

| 年度 | data.js值 | 实际/核实值 | 来源 | 可信度 |
|------|----------|-----------|------|--------|
| 2023 | $6.9B | $6.9B | Oracle FY2024 10-K | 🟢 official |
| 2024 | $6.9B | $6.9B | Oracle FY2025 10-K | 🟢 official |
| 2025 | $21.2B | **$21.21B** | Oracle FY2025 10-K | 🟢 official |
| 2026 | $50B | **$50B（上调后指引）** | Oracle FY2026 Earnings Call | 🟡 reported |

**原始引用**:
- "Oracle's FY2025 shows revenue of $57.40B and a sweeping $21.21B CapEx spike... CapEx as a share of revenue jumped to roughly 37.0% in FY2025 versus ~13.0% in the prior year."
  - 来源: [Monexa](https://www.monexa.ai/blog/oracle-corporation-ai-capex-cloud-push-and-the-cas-ORCL-2025-08-27)

- "Oracle told investors that it would ramp up capital expenditures in the current fiscal year to $50 billion from an earlier forecast of $35 billion"
  - 来源: [CNBC](https://www.cnbc.com/2025/12/11/oracle-lease-commitments-increase-almost-150percent-to-accommodate-ai-demand.html)

> ⚠️ **审核要点**: Oracle财年截止5月底（FY2025 = 2024.6-2025.5），需注意与日历年的差异。

### 7.2 增长率

| 字段 | data.js值 | 计算核实 |
|------|----------|---------|
| CapEx YoY | 207% | ✅ ($21.2B - $6.9B) / $6.9B = 207.2% ✓ |

### 7.3 算力规模: 450,000 H100等效

> ⚠️ **审核要点**: data.js称450K GPU主要为GB200。但这可能是Stargate项目的**规划**产能而非当前部署。需要区分"已部署"和"计划部署"。搜索显示Abilene站点2025夏仅部署16K GB200。

---

## 8. Anthropic

**data.js中的值**: 梯队2 · 算力 80K H100e · 2025 CapEx $4B · 100%云

### 8.1 融资与估值

**原始引用**:
- **2025年3月**: "Amazon-backed AI firm Anthropic valued at $61.5 billion"
  - 来源: [CNBC](https://www.cnbc.com/2025/03/03/amazon-backed-ai-firm-anthropic-valued-at-61point5-billion-after-latest-round.html)

- **2025年9月 Series F**: "Anthropic closed a $13 billion Series F funding round, valuing it at $183 billion"
  - 来源: [Anthropic官方](https://www.anthropic.com/news/anthropic-raises-series-f-at-usd183b-post-money-valuation)

- **2026年1月**: "Anthropic reportedly raising $10B at $350B valuation"
  - 来源: [TechCrunch](https://techcrunch.com/2026/01/07/anthropic-reportedly-raising-10b-at-350b-valuation/)

> ⚠️ **审核要点**: data.js keyFacts说"估值约$600亿"已过时。最新估值为$183B（Series F）或$350-380B（Series G）。**需要更新**。

### 8.2 投资方

- **Amazon**: 总计$8B投资（$4B + $4B），AWS为主要云供应商
  - 来源: [TechFundingNews](https://techfundingnews.com/amazon-anthropic-ai-investment-strategy/)

- **Google**: 总计约**$3.75B**（$2B 2023年 + $1B 2025年1月 + $750M可转债2025年9月），持有~14%股份
  - 来源: [CNBC](https://www.cnbc.com/2025/01/22/google-agrees-to-new-1-billion-investment-in-anthropic.html)
  - 来源: [DCD - Google owns 14% of Anthropic](https://www.datacenterdynamics.com/en/news/google-owns-14-percent-of-generative-ai-business-anthropic/)
  - **2025年10月云计算扩展协议**: Anthropic获得最多100万Google TPU的访问权限，预计2026年前上线>1GW算力
  - 来源: [Anthropic官方](https://www.anthropic.com/news/google-broadcom-partnership-compute)
  - 来源: [Google Cloud](https://www.googlecloudpresscorner.com/2025-10-23-Anthropic-to-Expand-Use-of-Google-Cloud-TPUs-and-Services)

> ⚠️ **审核要点**: data.js说Google投资$20亿，实际约为**$37.5亿**。**需要更新**。

### 8.3 算力规模

> 🔴 **重大修正: Anthropic算力严重低估！**
>
> data.js中80K H100e **远低于**实际规模:
> - **Project Rainier**: 500K Trainium2已上线（2025年10/11月）, 目标100万+
>   - 来源: [Amazon官方](https://www.aboutamazon.com/news/aws/aws-project-rainier-ai-trainium-chips-compute-cluster)
> - **Google TPU**: 承诺最多100万TPU（2025年10月协议）
>   - 来源: [Anthropic官方](https://www.anthropic.com/news/expanding-our-use-of-google-cloud-tpus-and-services)
> - **Broadcom/Google扩展**: 2027年起3.5GW Google TPU容量
>   - 来源: [Tom's Hardware](https://www.tomshardware.com/tech-industry/broadcom-expands-anthropic-deal-to-3-5gw-of-google-tpu-capacity-from-2027)
> - **Fluidstack数据中心**: $50B合作（2025年11月），暗示未来可能有自建/合建容量
>   - 来源: [Introl](https://introl.com/blog/anthropic-50-billion-data-center-plan-december-2025)
>
> 仅Rainier的500K Trainium2 ≈ 450K H100e（按0.9x系数）。**建议将totalH100Equiv上调至至少500K**。

### 8.4 CapEx与云支出

- 2025年AWS支出: **$2.66B**（已确认）
  - 来源: [LinkedIn/行业分析](https://www.linkedin.com/posts/sverdlik_in-2025-anthropic-spent-266-billion-on-activity-7392240784659623938--Jmc)
- Morgan Stanley估计: 2025年$1.28B → 2026年~$3B → 2027年$5.6B
- data.js的$2.5B/2024和$4B/2025为估算值

### 8.5 融资与估值（更新时间线）

| 轮次 | 时间 | 金额 | 估值 | 来源 |
|------|------|------|------|------|
| Series E | 2025.3 | — | $61.5B | [Anthropic官方](https://www.anthropic.com/news/anthropic-raises-series-e-at-usd61-5b-post-money-valuation) |
| Series F | 2025.9 | $13B | $183B | [CNBC](https://www.cnbc.com/2025/09/02/anthropic-raises-13-billion-at-18-billion-valuation.html) |
| Series G | 2026.2 | $30B | **$380B** | [CNBC](https://www.cnbc.com/2026/02/12/anthropic-closes-30-billion-funding-round-at-380-billion-valuation.html) |

- **总融资累计约$61-67B**（非data.js中的$13-15B）
- **年化收入**: 2026年3月达$30B ARR，同比增长1400%
  - 来源: [Sacra](https://sacra.com/c/anthropic/)

### 8.6 2026年4月更新（The Information报道）

**来源1**: The Information, "CoreWeave Strikes Multi-Year Deal with Anthropic", Apr 10, 2026
- CoreWeave签署多年期合同为Claude模型提供算力，2026年内首批服务器上线
- Anthropic ARR跃升至 **$30B**（2025年底$9B）
- Broadcom/Google 3.5GW容量协议（2027年起）（此前已有来源，再次确认）
- Anthropic正讨论确保 **10 GW** 总容量

**来源2**: The Information, "Anthropic Considers Designing its Own Chip", Apr 9, 2026 (via Reuters)
- Anthropic正在探索自研AI芯片，处于早期阶段

**来源3**: The Information, "OpenAI Stargate Leaders Depart", Apr 9, 2026
- OpenAI投资者备忘录数据：Anthropic 2025年底容量 **1.4 GW**
- OpenAI估计Anthropic：2026年 3-4 GW，2027年底 7-8 GW

> ✅ 已同步更新 data.js: computeSource.details（+CoreWeave）、partnerships（+CoreWeave）、keyFacts（ARR、容量、自研芯片探索）

---

## 9. 字节跳动 (ByteDance)

**data.js中的值**: 梯队2 · 算力 350K H100e · 2025 CapEx $21.3B · 芯片 65% NVIDIA / 35%其他

### 9.1 芯片采购与支出

**原始引用**:
- **2025年NVIDIA支出**: "2025年在NVIDIA芯片上花费约850亿元人民币"
  - 来源: [SCMP](https://www.scmp.com/tech/big-tech/article/3338191/bytedance-pour-us14-billion-nvidia-chips-2026-computing-demand-surges)

- **2026年计划**: "ByteDance plans to spend about 100 billion yuan (US$14 billion) on artificial intelligence chips from Nvidia in 2026"
  - 来源: [Yahoo Finance / Reuters](https://finance.yahoo.com/news/tiktok-parent-plans-14-billion-133112137.html)
  - 来源: [SCMP](https://www.scmp.com/tech/big-tech/article/3338191/bytedance-pour-us14-billion-nvidia-chips-2026-computing-demand-surges)

- **2026年总CapEx**: "ByteDance is preparing to boost its AI spending in 2026, with preliminary plans to allocate RMB 160 billion ($23 billion) in capital expenditure"
  - 来源: [TrendForce](https://www.trendforce.com/news/2025/12/23/news-bytedance-reportedly-to-boost-2026-ai-spend-to-23b-plans-preliminary-20k-h200-chips-order)

- **2025年总CapEx约RMB 150B**: "RMB 150 billion it spent on AI infrastructure in 2025"
  - 来源: 同上TrendForce

> 🔴 **审核要点**:
> - data.js 2025 CapEx $21.3B（≈RMB 150B）与TrendForce报道基本一致 ✅
> - data.js 2024 CapEx **$15B有误**！SCMP报道2024年为~80B RMB（≈**$11B**），非$15B
>   - 来源: [SCMP](https://www.scmp.com/tech/big-tech/article/3292770/bytedance-leads-chinas-big-tech-sector-capital-spending-us11-billion-2024)
> - **CapEx YoY也需修正**: 从$11B→$21.3B，YoY约**93%**，非data.js中的42%
>
> **GPU明细对照**（kr-asia/SemiAnalysis来源）:
>
> | 芯片 | data.js | 媒体报道 | 差异 |
> |------|---------|---------|------|
> | H800 | 150,000 | **24-25K** | ❌ data.js严重高估 |
> | H20 | 200,000 | **270K** | data.js偏低 |
> | A100/A800 | 未列出 | A100 16-17K + A800 60K | 遗漏 |
> | H100（海外） | 未列出 | 20K+ | 遗漏 |
>   - 来源: [kr-asia](https://kr-asia.com/bytedance-alibaba-and-tencent-stockpile-billions-worth-of-nvidia-chips)

### 9.2 自研芯片

- "ByteDance has built up a chip design unit that employed around 1,000 staff, and its internal chip unit has made progress in the tape-out of a processor that matches the performance of Nvidia's H20 chip"
  - 来源: [SCMP](https://www.scmp.com/tech/big-tech/article/3338191/bytedance-pour-us14-billion-nvidia-chips-2026-computing-demand-surges)

---

## 10. 阿里巴巴 (Alibaba)

**data.js中的值**: 梯队2 · 算力 200K H100e · FY2025 CapEx $11.8B · 增长 168%

### 10.1 资本开支与AI投资

**原始引用**:
- **三年投资计划**: "Alibaba announced plans to invest at least RMB 380 billion (US $53 billion) over the next three years" (2025年2月宣布)
  - 来源: [Alibaba Cloud Community](https://www.alibabacloud.com/blog/alibaba-to-invest-rmb380-billion-in-ai-and-cloud-infrastructure-over-next-three-years_602007)
  - 来源: [SCMP](https://www.scmp.com/tech/big-tech/article/3300111/alibabas-us52-billion-capex-seen-catalyst-chinas-big-tech-ai-race)

- **近四季度实际支出**: "Alibaba has spent around 120 billion yuan in capital expenditure toward AI and cloud infrastructure over the past four quarters"
  - 来源: 同上

- CEO Wu: "initial 380 billion yuan target 'might be on the small side'"
  - 来源: [Yahoo Finance](https://finance.yahoo.com/news/alibabas-us-52-billion-capex-093000887.html)

> ✅ **CapEx数据确认**:
> - FY2023: RMB 34,330M ($5.0B) ✅ — 来源: [BusinessWire](https://www.businesswire.com/news/home/20230517005640/en/Alibaba-Group-Announces-March-Quarter-and-Full-Fiscal-Year-2023-Results)
> - FY2024: RMB 32,087M ($4.4B) ✅ — 来源: [BusinessWire](https://www.businesswire.com/news/home/20240513641121/en/Alibaba-Group-Announces-March-Quarter-2024-and-Fiscal-Year-2024-Results)
> - FY2025: **RMB 85,972M ($11.8B)** ✅ — 来源: [Nasdaq](https://www.nasdaq.com/press-release/alibaba-group-announces-march-quarter-2025-and-fiscal-year-2025-results-2025-05-15)
>
> ⚠️ data.js keyFacts说"FY2025 CapEx创纪录**792亿元**"有误，实际为**859.72亿元**（~860亿元）。需更新。
> - 阿里财年截至3月底（FY2025 = 2024年4月-2025年3月）
> - 阿里云市场份额: Q3 2025约36%，中国最大
>   - 来源: [BizTechReports/Omdia](https://www.biztechreports.com/news-archive/2026/3/3/mainland-chinas-cloud-infrastructure-market-accelerates-to-24-growth-in-q3-2025-omdia-march-04-2026)

### 10.2 增长率

| 字段 | data.js值 | 计算核实 |
|------|----------|---------|
| CapEx YoY | 168% | ✅ ($11.8B - $4.4B) / $4.4B = 168.2% ✓ |

---

## 11. Tesla

**data.js中的值**: 梯队3 · 算力 100K H100e · 2025 CapEx $8.5B · 芯片 95% NVIDIA / 5% Dojo

### 11.1 Cortex超级计算机与GPU

**原始引用**:
- "By the end of 2024, Tesla deployed a 50,000 Nvidia H100 GPU training cluster known as Cortex."
  - 来源: [TechCrunch](https://techcrunch.com/2025/09/02/teslas-dojo-a-timeline/)

- "In Q2 2025, Tesla expanded AI training compute with an additional 16k H200 GPUs at Gigafactory Texas, bringing Cortex to a total of 67k H100 equivalents."
  - 来源: 同上

> ⚠️ **审核要点**: data.js说100K H100e，但报道仅确认67K H100e（截至Q2 2025）。**可能需要下调**，或确认Q3-Q4是否有进一步扩展。

### 11.2 资本开支

| 年度 | data.js值 | 实际/核实值 | 来源 | 可信度 |
|------|----------|-----------|------|--------|
| 2023 | $8.9B | $8.9B | Tesla 10-K | 🟢 official |
| 2024 | $11.3B | **$11.342B** | Tesla 10-K | 🟢 official |
| 2025 | $8.5B | **$8.527B** | Tesla 10-K | 🟢 official |
| 2026 | $20B | **$20B+（指引）** | 媒体报道 | 🟡 reported |

**原始引用**:
- "Tesla's annual capital expenditures for 2025 were $8.527 billion... capex fell 25% to $8.5 billion in 2025"
  - 来源: [FinanceCharts](https://www.financecharts.com/stocks/TSLA/cash-flow/capital-expenditures-annual)
  - 来源: [eletric-vehicles.com](https://eletric-vehicles.com/tesla/tesla-capex-to-more-than-double-to-20b-in-2026-amid-first-revenue-drop-since-ipo/)

> ✅ CapEx数据与财报一致。

### 11.3 Dojo芯片状态

**原始引用**:
- "In August 2025, Tesla disbanded the Dojo project"
  - 来源: [TechCrunch](https://techcrunch.com/2025/08/07/tesla-shuts-down-dojo-the-ai-training-supercomputer-that-musk-said-would-be-key-to-full-self-driving/)

- "Musk announced it would be restarted in January 2026 with a new chip iteration (Dojo 3)"
  - 来源: [Tom's Hardware](https://www.tomshardware.com/tech-industry/supercomputers/elon-musk-restarts-dojo3-space-supercomputer-project-as-ai5-chip-design-gets-in-good-shape-will-be-first-tesla-built-supercomputer-to-feature-all-in-house-hardware-with-no-help-from-nvidia)

- "Tesla signed a $16.5 billion deal to get its next-generation AI6 chips from Samsung"
  - 来源: [TechRadar](https://www.techradar.com/pro/teslas-chip-game-is-no-joke-elon-musk-confirms-it-has-restarted-work-on-its-biggest-supercomputer-yet-but-what-will-it-actually-be-used-for)

> ⚠️ **审核要点**: data.js说"Dojo自研芯片2025年8月停用，2026年1月重启"，与报道一致。但实际上是Dojo 3重启（非Dojo 2），且涉及Samsung合作。

### 11.4 增长率

| 字段 | data.js值 | 计算核实 |
|------|----------|---------|
| CapEx YoY（2025 vs 2024） | 135% | ❌ **计算有误!** ($8.5B - $11.3B) / $11.3B = **-24.8%**，2025年CapEx实际下降! |
| CapEx YoY（2026 vs 2025） | 135% | ✅ 如果用2026指引: ($20B - $8.5B) / $8.5B = 135.3%，但这是预估 |

> ⚠️ **重大审核要点**: data.js growth.capexYoY = 135% 的基准年不清楚。如果是2025 vs 2024，实际上是**负增长**。如果是2026 vs 2025的预估，那135%是合理的但应标明是预估。**需要修正或澄清**。

---

## 12. Apple

**data.js中的值**: 梯队3 · 算力 60K H100e · FY2025 CapEx $12B · 芯片 50% NVIDIA / 50%自研

### 12.1 资本开支

| 年度 | data.js值 | 实际值 | 来源 | 可信度 |
|------|----------|--------|------|--------|
| FY2023 (截至Sep 2023) | $11B | **$10.96B** | Apple 10-K | 🟢 official |
| FY2024 (截至Sep 2024) | $10B | **$9.45B** | Apple 10-K | 🟢 official |
| FY2025 (截至Sep 2025) | $12B | **$12.72B** | Apple 10-K | 🟢 official |

**原始引用**:
- "Apple spent $12.7 billion in fiscal 2025 capex, representing a 35% jump from the previous year."
  - 来源: [CNBC](https://www.cnbc.com/2025/10/30/apple-isnt-playing-the-same-ai-capex-game-as-the-rest-of-the-megacaps.html)
  - 来源: [FinanceCharts](https://www.financecharts.com/stocks/AAPL/cash-flow/capital-expenditures-annual)

> ⚠️ **审核要点**: data.js FY2024 $10B实际为$9.45B（偏高），FY2025 $12B实际为$12.72B（偏低）。Apple财年截止9月底。

### 12.2 Private Cloud Compute

**原始引用**:
- "Apple is starting to use M5 chips in Apple Private Cloud Compute servers"
  - 来源: [9to5Mac](https://9to5mac.com/2026/02/17/apple-plans-m5-based-private-cloud-compute-architecture-for-apple-intelligence/)

- "a new 250,000-square-foot AI server manufacturing hub in Houston, Texas, that began shipping servers in October 2025"
  - 来源: [Tom's Hardware](https://www.tomshardware.com/desktops/servers/apples-houston-built-ai-servers-now-shipping)

- "Apple's strategy changed in 2025 with a public plan to build a proprietary AI server and chip manufacturing base, increasing its domestic investment commitment from an initial $500 billion to $600 billion over four years."
  - 来源: [EnkiAI](https://enkiai.com/ai-market-intelligence/apple-ai-infrastructure-2025-inside-the-600b-us-plan/)

> ⚠️ **审核要点**: data.js说"M系列服务器芯片"，实际Private Cloud Compute使用M2 Ultra（2024）→ M5（2026），且Apple正在开发**专用AI服务器芯片**（非M系列），计划2026下半年量产。此外，Apple还在开发专用AI推理芯片（非通用M系列），应更新keyFacts。

### 12.3 增长率

| 字段 | data.js值 | 计算核实 |
|------|----------|---------|
| CapEx YoY | 20% | ❌ 实际FY2024=$9.45B → FY2025=$12.72B → **YoY=34.6%**。data.js值偏低近一半。 |

### 12.4 补充信息

- Apple也在与Broadcom合作开发代号"Baltra"的**专用AI服务器芯片**（非M系列），计划2026下半年量产
  - 来源: [DCD](https://www.datacenterdynamics.com/en/news/apple-working-with-broadcom-to-develop-ai-specific-server-chip-report/)
- Apple还订购了~250台NVIDIA NVL72服务器（~18,000颗Blackwell GPU），价值约$1B
  - 来源: [AppleInsider](https://appleinsider.com/articles/25/03/25/apple-is-reportedly-investing-heavily-into-nvidia-servers-for-ai-development)
- Tesla AI CapEx占总CapEx比例: data.js说~30%，但2024年实际约**44%**（$5B/$11.3B），2025年约**59%**（$5B/$8.5B）
  - 来源: [DCD](https://www.datacenterdynamics.com/en/news/tesla-spent-1bn-on-ai-infrastructure-in-q1-elon-musk-posits-using-cars-as-distributed-compute/)

---

## 待核实/存疑项汇总

以下是审核中发现的**需要修正或进一步确认**的数据点：

### 🔴 建议立即修正

| # | 公司 | 问题 | 当前值 | 建议值 | 依据 |
|---|------|------|--------|--------|------|
| 1 | **Meta** | **算力来源严重错误** | 100%自建 | ~70%自建/30%租赁 | CoreWeave $35B + Nebius $27B + GCP $10B+ |
| 2 | xAI | H100e计算错误 | 200K | ~300K | 按系数计算: 150K×1.0+50K×1.3+30K×3.0=305K |
| 3 | Tesla | CapEx YoY基准年错误 | +135% | -25%（2025 vs 2024）或标明2026E | 2025 CapEx $8.5B < 2024 $11.3B |
| 4 | Anthropic | 估值过时 | ~$600亿 | $183B（Sep 2025 Series F） | Anthropic官方公告 |
| 5 | Anthropic | Google投资金额 | $20亿 | ~$37.5亿 | CNBC+DCD ($2B+$1B+$0.75B转债) |
| 6 | **Meta** | CapEx口径不一致 | 2023 $27.3B / 2024 $37.3B | $28.1B / $39.2B（含融资租赁） | Meta官方Earnings Release口径 |
| 7 | **Microsoft** | **算力来源可能颠倒** | 70%自建/30%租赁 | ~30%自建/70%租赁 | L.E.K. Consulting + SemiAnalysis |
| 8 | **Microsoft** | Maia芯片占比高估 | 8%自研 | <2%（Maia 100未投产，Maia 200刚发布） | DCD + TechCrunch |
| 9 | **Anthropic** | **算力严重低估** | 80K H100e | ≥500K（仅Rainier 500K Trn2 ≈ 450K H100e） | Amazon/Anthropic官方 |
| 10 | **Anthropic** | 总融资过时 | $13-15B | ~$61-67B | CNBC（Series E+F+G累计） |
| 11 | **ByteDance** | 2024 CapEx错误 | $15B | **~$11B**（80B RMB） | SCMP |
| 12 | **ByteDance** | CapEx YoY错误 | 42% | **~93%**（$11B→$21.3B） | 计算修正 |
| 13 | **ByteDance** | H800数量严重高估 | 150K | **24-25K** | kr-asia/SemiAnalysis |
| 14 | **Alibaba** | keyFacts RMB金额 | 792亿元 | **860亿元** | Alibaba FY2025官方财报 |
| 15 | **Apple** | CapEx YoY偏低 | 20% | **~35%** | FY24 $9.45B→FY25 $12.72B |
| 16 | **Apple** | FY2024 CapEx偏高 | $10B | **$9.45B** | Apple 10-K |
| 17 | **Tesla** | AI CapEx占比偏低 | ~30% | ~44-59% | Tesla财报 + DCD报道 |

### 🟡 建议核实后决定

| # | 公司 | 问题 | 说明 |
|---|------|------|------|
| 5 | Meta | 总算力可能低估 | Zuckerberg说2025底1.3M GPU，H100e可能800K-1M |
| 6 | Google | ~~TPU v7是否已发布~~ | ✅ 已确认：代号Ironwood，2025年4月发布 |
| 7 | OpenAI | GB200 450K可能高估 | 报道显示Abilene 2025夏仅16K GB200 |
| 8 | Oracle | 450K GPU是规划还是已部署 | 需区分 |
| 9 | Apple | FY2025 CapEx | data.js $12B，实际$12.7B |
| 10 | Apple | CapEx YoY | data.js 20%，实际约27% |
| 11 | Tesla | 算力可能高估 | data.js 100K，报道仅确认67K H100e |
| 12 | Microsoft | FY vs CY年份标注 | 财年截止6月，可能与日历年数据产生混淆 |

### ⚪ 数据完全依赖估算，无法直接核实

| 公司 | 数据点 | 说明 |
|------|--------|------|
| Google | 1.5M H100e总算力 | 从未公开披露GPU总量 |
| Microsoft | 600K H100e总算力 | 同上 |
| Amazon | 500K H100e总算力 | 同上 |
| 所有公司 | GPU型号明细分配 | 多数为分析师估算 |
| Anthropic | 80K H100e / $4B CapEx | 未上市，无财报 |
| ByteDance | 350K H100e | 未上市，依赖媒体报道 |

---

## 来源链接索引

### 官方来源
- [Meta Q4 2025 Earnings](https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Fourth-Quarter-and-Full-Year-2025-Results/default.aspx)
- [Meta Q4 2025 Earnings PDF](https://s21.q4cdn.com/399680738/files/doc_news/Meta-Reports-Fourth-Quarter-and-Full-Year-2025-Results-2026.pdf)
- [Microsoft 2025 Annual Report](https://www.microsoft.com/investor/reports/ar25/index.html)
- [Microsoft FY2025 10-K SEC Filing](https://microsoft.gcs-web.com/static-files/b0a66351-38cf-4147-a907-191d774531bb)
- [Tesla 2025 10-K SEC Filing](https://www.sec.gov/Archives/edgar/data/1318605/000162828026003952/tsla-20251231.htm)
- [OpenAI Stargate公告](https://openai.com/index/announcing-the-stargate-project/)
- [OpenAI-Oracle合作公告](https://openai.com/index/stargate-advances-with-partnership-with-oracle/)
- [OpenAI-Microsoft合作公告](https://openai.com/index/next-chapter-of-microsoft-openai-partnership/)
- [Anthropic Series F公告](https://www.anthropic.com/news/anthropic-raises-series-f-at-usd183b-post-money-valuation)
- [Alibaba Cloud三年投资计划](https://www.alibabacloud.com/blog/alibaba-to-invest-rmb380-billion-in-ai-and-cloud-infrastructure-over-next-three-years_602007)

### 媒体报道
- [CNBC - Alphabet 2026 CapEx](https://www.cnbc.com/2026/02/04/alphabet-resets-the-bar-for-ai-infrastructure-spending.html)
- [Fortune - Alphabet CapEx](https://fortune.com/2026/02/04/alphabet-google-ai-spending-supply-constraints/)
- [CNBC - Amazon $100B CapEx 2025](https://www.cnbc.com/2025/02/06/amazon-expects-to-spend-100-billion-on-capital-expenditures-in-2025.html)
- [Variety - Amazon $200B CapEx 2026](https://variety.com/2026/digital/news/amazon-q4-2025-earnings-capex-advertising-sales-1236653797/)
- [CNBC - Microsoft $80B CapEx](https://www.cnbc.com/2025/01/03/microsoft-expects-to-spend-80-billion-on-ai-data-centers-in-fy-2025.html)
- [Tom's Hardware - Sam Altman 1M GPUs](https://www.tomshardware.com/tech-industry/sam-altman-teases-100-million-gpu-scale-for-openai-that-could-cost-usd3-trillion-chatgpt-maker-to-cross-well-over-1-million-by-end-of-year)
- [HPCwire - xAI Colossus 200K GPUs](https://www.hpcwire.com/2025/05/13/colossus-ai-hits-200000-gpus-as-musk-ramps-up-ai-ambitions/)
- [Introl - xAI 555K GPUs](https://introl.com/blog/xai-colossus-2-gigawatt-expansion-555k-gpus-january-2026)
- [SCMP - ByteDance $14B NVIDIA 2026](https://www.scmp.com/tech/big-tech/article/3338191/bytedance-pour-us14-billion-nvidia-chips-2026-computing-demand-surges)
- [TrendForce - ByteDance $23B CapEx 2026](https://www.trendforce.com/news/2025/12/23/news-bytedance-reportedly-to-boost-2026-ai-spend-to-23b-plans-preliminary-20k-h200-chips-order)
- [SCMP - Alibaba $52B CapEx](https://www.scmp.com/tech/big-tech/article/3300111/alibabas-us52-billion-capex-seen-catalyst-chinas-big-tech-ai-race)
- [CNBC - Anthropic Google $1B](https://www.cnbc.com/2025/01/22/google-agrees-to-new-1-billion-investment-in-anthropic.html)
- [TechCrunch - Tesla Dojo shutdown](https://techcrunch.com/2025/08/07/tesla-shuts-down-dojo-the-ai-training-supercomputer-that-musk-said-would-be-key-to-full-self-driving/)
- [CNBC - Apple AI CapEx](https://www.cnbc.com/2025/10/30/apple-isnt-playing-the-same-ai-capex-game-as-the-rest-of-the-megacaps.html)

### The Information（2026年4月，付费文档）
- OpenAI Stargate Leaders Depart in Latest Shakeup to Data Center Strategy (Apr 9, 2026)
- Anthropic Considers Designing its Own Chip (Apr 9, 2026, via Reuters)
- CoreWeave Strikes Multi-Year Deal with Anthropic (Apr 10, 2026)
- OpenAI Stargate Execs to Join Meta's New Compute Unit (Apr 10, 2026)
- Google Will Use Intel Chips in Data Centers (Apr 9, 2026)
- Amazon Considers Selling AI Chips Beyond AWS (Apr 9, 2026)
- Meta Expands Cloud Deals With CoreWeave to $35 Billion through 2032 (Apr 9, 2026)
- OpenAI, Forecasts and Guesses — Newsletter (Apr 9, 2026)

### 其他媒体（中文）
- 量子位: OpenAI算力租赁成本2025-2030预测 (~Oct 2025, 引用The Information数据)

### 数据库与分析
- [Epoch AI GPU Clusters Database](https://epoch.ai/data/gpu-clusters/)
- [Epoch AI GPU Clusters Documentation](https://epoch.ai/data/gpu-clusters-documentation)
- [Epoch AI Frontier Data Centers](https://epoch.ai/data/data-centers/)
- [Epoch AI GPU Clusters CSV](https://epoch.ai/data/gpu_clusters.csv)
- [Sam Altman X/Twitter (1M GPUs)](https://x.com/sama/status/1947057625780396512)
- [LessWrong: Estimates of GPU resources of large AI players](https://www.lesswrong.com/posts/bdQhzQsHjNrQp7cNS/estimates-of-gpu-or-equivalent-resources-of-large-ai-players)
- [JeffTech: Global GPU Powerhouses (Dec 2024)](https://jefftech.substack.com/p/global-gpu-powerhouses-revealed-over)
- [Apple Private Cloud Compute Security](https://security.apple.com/blog/private-cloud-compute/)
- [Tesla Cortex 50K GPU](https://www.datacenterdynamics.com/en/news/teslas-50000-gpu-cortex-supercomputer-went-live-in-q4-2024/)
- [Meta Louisiana DC](https://datacenters.atmeta.com/richland-parish-data-center/)
