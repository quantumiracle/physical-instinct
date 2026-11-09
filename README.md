# Physical Instinct

具身智能与机器人硬件相关的整理和工具。首页：https://quantumiracle.github.io/robot-atlas/

## 机器人硬件图谱 Robot Hardware Spectrum

人形机器人、轮式/移动操作平台、机械臂、灵巧手和数据采集设备的对比表，以中美为主，也收录 Franka、Sharpa、UR、Kinova 等其他国家常用于机器人学习的设备。

网页：https://quantumiracle.github.io/robot-atlas/robot-hardware-spectrum/ （支持中英文切换）

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

产品图片来自上述数据库和各厂商官网的公开页面，版权归原厂商或原网站所有，仅用于识别产品。如需移除某张图片或更正数据，请提 [Issue](https://github.com/quantumiracle/robot-atlas/issues)。

## 本地预览

```bash
python3 -m http.server 8000
```

然后打开 http://localhost:8000 （首页）或 http://localhost:8000/robot-hardware-spectrum/ （图谱）。
