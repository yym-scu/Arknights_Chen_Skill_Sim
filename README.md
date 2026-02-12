# 🐉 CHEN SIMULATOR (陈模拟器)

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange?style=for-the-badge&logo=react)](https://github.com/pmndrs/zustand)

这是一个基于《明日方舟》干员**陈（Ch'en）**与**娜斯提（Nasty）**技能特性开发的战术编辑器/演算模拟器。采用 PRTS 战术终端风格设计，支持关卡障碍布设、路径规划及战斗演算模拟。

## 🌟 核心特性

- **PRTS 战术终端 UI**：深度还原《明日方舟》战术 UI 风格，包含数字扫描线、色散故障（Glitch）动画及硬核工业美学。
- **娜工之力 (Na Gong Power)**：深度集成娜斯提（Nasty）的建设能力，支持实时障碍物摆放模拟，配备专属动态视频交互按钮。
- **战斗演算系统**：
  - 模拟陈的技能路径及多段打击效果。
  - **炫酷 HIT 动画**：具备色散重影（Chromatic Aberration）与战术能量脉冲效果的连击计数器。
  - **即时重播**：支持动画演算的即时重置与重播，以便精准调校战术细节。
- **全平台适配**：
  - **桌面端**：沉浸式侧边栏布局，集成详细的演算结果报告。
  - **移动端**：专为横屏（Landscape）模式优化，采用紧凑的左右控制面板布局，通过 vh 响应式设计确保最佳的操作手感。
- **存档管理**：支持多位存档保存与加载，内置自定义战术终端风格的文件管理器。

## 🛠️ 技术栈

- **框架**: Next.js 15+ (App Router)
- **前端库**: React 19
- **状态管理**: Zustand (集成深度持久化逻辑)
- **样式**: Tailwind CSS 4.0 (采用全新的高拟真色值变量)
- **动画**: Framer Motion & CSS keyframes
- **图标**: Lucide React
- **部署**: Vercel / Docker

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-repo/chen-simulator.git
cd chen-simulator
```

### 2. 安装依赖

```bash
npm install
# 或者
yarn install
```

### 3. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 📸 预览

_(在此处添加您的截图或 GIF 展示)_

- **左侧面板**: 选择不同的工具（障碍、禁区、路径、节点）。
- **右侧面板**: 查看实时的演算结果（击杀数、连击数、评分）。
- **底部/浮动 HUD**: 监控模拟状态，开启“娜工之力”进行高级地形重塑。

---

**注意**: 本项目为粉丝创作，所有角色、技能设计及音视频素材版权归 [鹰角网络 (Hypergryph)](https://www.hypergryph.com/) 所有。
