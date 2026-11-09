# Physical Instinct

具身智能与机器人硬件相关的整理和工具。首页：https://quantumiracle.github.io/physical-instinct/

## 栏目

| 栏目 | 内容 | 数据 |
|---|---|---|
| [机器人硬件图谱 Robot Hardware Spectrum](https://quantumiracle.github.io/physical-instinct/robot-hardware-spectrum/) | 人形、机械臂、灵巧手、移动操作和数据采集设备，851 款 | [robots.json](robot-hardware-spectrum/data/robots.json) |
| [机器人基础模型图谱 Robot Foundation Model Spectrum](https://quantumiracle.github.io/physical-instinct/robot-model-spectrum/) | VLA、通用策略、世界模型、具身推理和全身控制模型，141 个 | [models.json](robot-model-spectrum/data/models.json) |
| [机器人数据集图谱 Robot Dataset Spectrum](https://quantumiracle.github.io/physical-instinct/robot-dataset-spectrum/) | 遥操作、UMI、第一视角视频、动捕和仿真数据集，112 个 | [datasets.json](robot-dataset-spectrum/data/datasets.json) |
| [机器人融资追踪 Robotics Funding Tracker](https://quantumiracle.github.io/physical-instinct/robot-funding-tracker/) | 2023–2026 年具身智能公司的融资、上市和并购，282 条 | [funding.json](robot-funding-tracker/data/funding.json) |
| [机器人硬件洞察 Robot Hardware Insights](https://quantumiracle.github.io/physical-instinct/robot-hardware-insights/) | 基于硬件图谱数据的 8 张图表 | [insights.json](robot-hardware-insights/data/insights.json) |
| [机器人仿真图谱 Robot Simulation Spectrum](https://quantumiracle.github.io/physical-instinct/robot-sim-spectrum/) | 物理引擎、仿真与学习平台、世界模型仿真和资产库，57 个 | [sims.json](robot-sim-spectrum/data/sims.json) |
| [机器人评测图谱 Robot Benchmark Spectrum](https://quantumiracle.github.io/physical-instinct/robot-benchmark-spectrum/) | 操作、导航、人形、灵巧手、具身推理和真机评测基准，61 个 | [benchmarks.json](robot-benchmark-spectrum/data/benchmarks.json) |

所有页面支持中英文切换，数据截至 2026 年 11 月 8 日，每条记录都附来源链接。

## 机器人硬件图谱 Robot Hardware Spectrum

人形机器人、轮式/移动操作平台、机械臂、灵巧手和数据采集设备的对比表，以中美为主，也收录 Franka、Sharpa、UR、Kinova 等其他国家常用于机器人学习的设备。

网页：https://quantumiracle.github.io/physical-instinct/robot-hardware-spectrum/ （支持中英文切换）

### 内容

- 851 款设备：中国 428、美国 155、其他国家 267
- 每款包含：图片、公司（中国公司附中文名）、国家、类别、发布时间、状态、价格、关键参数、所用模型/AI、官网、视频和数据来源链接
- 可按国家、类别、状态、是否 2025 年后的新设备筛选，支持中英文搜索
- 数据截至 2026 年 11 月 8 日

### 数据文件

- [`robots.json`](robot-hardware-spectrum/data/robots.json)：完整数据
- [`robots.csv`](robot-hardware-spectrum/data/robots.csv)：表格版，可直接用 Excel 打开

### 数据来源

- [humanoid.guide](https://humanoid.guide/)：人形机器人、灵巧手和数据采集设备的规格、图片和视频
- [Robotics Center](https://www.roboticscenter.ai/store)：机械臂、灵巧手、人形和采集套件的价格与图片
- [Robo2u Data](https://data.robo2u.com/)：发布时间、状态、AI 平台，以及工业机械臂和移动操作平台
- 少量条目根据厂商官网和媒体报道补充

三个来源按“公司 + 型号”合并去重。参数、价格和状态来自各数据库，部分是估计值，价格以厂商报价为准。“新设备”按发布时间判断，没有发布日期的按数据库收录时间判断。

### 图片与版权

产品图片来自上述数据库和各厂商官网的公开页面，版权归原厂商或原网站所有，仅用于识别产品。如需移除某张图片或更正数据，请提 [Issue](https://github.com/quantumiracle/physical-instinct/issues)。

## 本地预览

```bash
python3 -m http.server 8000
```

然后打开 http://localhost:8000 （首页）或 http://localhost:8000/robot-hardware-spectrum/ （图谱）。
