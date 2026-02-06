# SubReminder

A minimalist Chrome extension for tracking and managing your subscriptions. Built with React, TypeScript, and Tailwind CSS.

一款极简风格的 Chrome 浏览器扩展，用于追踪和管理你的订阅服务。基于 React、TypeScript 和 Tailwind CSS 构建。

---

## Features / 功能

- **Calendar View / 日历视图** — See all upcoming billing dates at a glance, with subscription icons on each day
- **List View / 列表视图** — Search, filter by status, and sort your subscriptions
- **Subscription Management / 订阅管理** — Add, edit, and delete subscriptions with billing cycle, category, and status tracking
- **Monthly Spend / 月度开支** — Automatic calculation of your total monthly subscription cost
- **Website Favicons / 网站图标** — Automatically fetches icons from subscription websites
- **Data Portability / 数据导入导出** — Export and import your data as JSON
- **Local Storage / 本地存储** — All data stored locally via `chrome.storage.local`, no account required
- **Notifications / 提醒通知** — Configurable billing reminders (1, 2, 3, 5, 7 days before)

## Screenshots / 截图

> Load the extension in Chrome and click the toolbar icon to open the popup.
>
> 在 Chrome 中加载扩展，点击工具栏图标打开弹窗。

## Tech Stack / 技术栈

| Layer | Technology |
|-------|-----------|
| UI | React 18, TypeScript, Tailwind CSS v3 |
| State | Zustand + `chrome.storage.local` persistence |
| Dates | date-fns |
| Build | Vite 5 + CRXJS Vite Plugin |
| Test | Vitest + Testing Library |
| Platform | Chrome Extension Manifest V3 |

## Project Structure / 项目结构

```
src/
├── background/          # Service worker (alarm registration)
├── popup/
│   ├── components/      # UI components (TopBar, CalendarView, ListView, etc.)
│   ├── hooks/           # Custom hooks (useCalendar, useFilteredSubscriptions, etc.)
│   ├── pages/           # Full-page views (SettingsPage)
│   ├── store/           # Zustand stores (subscriptions, settings)
│   ├── App.tsx          # Root component
│   ├── main.tsx         # Entry point
│   └── index.css        # Tailwind + CSS custom properties
├── shared/
│   ├── types/           # TypeScript interfaces
│   ├── constants.ts     # App constants
│   ├── storage.ts       # chrome.storage adapter
│   └── utils.ts         # Date calculations, formatting
└── test/                # Test setup
```

## Getting Started / 快速开始

### Prerequisites / 前置要求

- Node.js >= 18
- npm

### Install & Build / 安装与构建

```bash
# Install dependencies / 安装依赖
npm install

# Build for production / 生产构建
npm run build

# Run tests / 运行测试
npm run test:run
```

### Load in Chrome / 在 Chrome 中加载

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle) / 打开右上角 **开发者模式**
3. Click **Load unpacked** / 点击 **加载已解压的扩展程序**
4. Select the `dist/` folder / 选择 `dist/` 文件夹
5. Click the SubReminder icon in the toolbar / 点击工具栏中的 SubReminder 图标

### Development / 开发模式

```bash
npm run dev
```

This starts the Vite dev server with HMR. Load the extension from Chrome the same way — CRXJS handles live reload automatically.

启动 Vite 开发服务器（支持热更新）。同样从 Chrome 加载扩展，CRXJS 会自动处理实时刷新。

## Supported Billing Cycles / 支持的计费周期

| Cycle | Label |
|-------|-------|
| Weekly | /wk |
| Monthly | /mo |
| Quarterly | /qtr |
| Yearly | /yr |
| One-time | — |

## License / 许可证

MIT
