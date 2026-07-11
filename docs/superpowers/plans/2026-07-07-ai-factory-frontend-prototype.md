# AI Factory Frontend Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clickable frontend prototype for the Procloud AI Factory Bugfix workflow, covering product interaction screens and the Plane → Gateway → LangGraph → Agent → MR architecture trace.

**Architecture:** Add a standalone Next.js app under `frontend/` with static prototype data, route-based pages, shared layout primitives, and focused UI components. The prototype does not call the existing FastAPI service; it uses typed static data so the screen structure can later be wired to real APIs without changing page responsibilities.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-style primitives, lucide-react icons, Vitest, Testing Library, Playwright.

## Global Constraints

- Main workflow is Bugfix: `Plane Issue → AI Run → Review Loop → G3 MR Approval → MR`.
- Feature workflow is visible only as expansion: `G1 Product Approval` and `G2 Design Approval` are `Feature-only`; `G4 Release Approval` is `Coming Next`.
- First prototype pages: `Command Center`, `Issue Inbox`, `Runs / Run Detail`, `Gates / Gate Console`, `Agents / Agent Registry`, `Architecture / Architecture Trace`, `Feature Pipeline`.
- Static data only; do not connect to real Plane, SCM, LangGraph, Agent calls, or auth.
- Show audit concepts: `FactoryEvent`, `GateResult`, `Approval`, `BudgetEvent`.
- Show failure handling: duplicate webhook, HMAC failure, review loop, max review escalation, budget pause, agent failure.
- Show team programming and Git branch management: short-lived run branches, protected branch rules, Agent Git permissions, reviewer handoff, parallel change conflict detection, and Git audit events.
- UI should feel like a dense operational tool: restrained, scannable, no marketing landing page, no oversized hero.
- Use icons in action buttons where useful; avoid decorative gradients, nested cards, and purely illustrative filler.

---

## File Structure

Create these files:

- `frontend/package.json`: frontend scripts and dependencies.
- `frontend/next.config.mjs`: Next.js config.
- `frontend/tsconfig.json`: TypeScript config.
- `frontend/postcss.config.mjs`: Tailwind PostCSS config.
- `frontend/tailwind.config.ts`: Tailwind content and theme tokens.
- `frontend/vitest.config.ts`: unit test config.
- `frontend/playwright.config.ts`: browser test config.
- `frontend/app/globals.css`: global styles and design tokens.
- `frontend/app/layout.tsx`: app shell metadata and HTML wrapper.
- `frontend/app/page.tsx`: redirects or renders Command Center.
- `frontend/app/inbox/page.tsx`: Issue Inbox.
- `frontend/app/runs/[runId]/page.tsx`: Run Detail.
- `frontend/app/gates/page.tsx`: Gate Console.
- `frontend/app/agents/page.tsx`: Agent Registry.
- `frontend/app/architecture/page.tsx`: Architecture Trace.
- `frontend/app/feature-pipeline/page.tsx`: Feature Pipeline placeholder.
- `frontend/components/app-shell.tsx`: global navigation, top bar, page layout.
- `frontend/components/status-badge.tsx`: status/risk/gate badges.
- `frontend/components/metric-card.tsx`: compact metric display.
- `frontend/components/gate-rail.tsx`: G1-G4 visible stage rail.
- `frontend/components/timeline.tsx`: Run status timeline.
- `frontend/components/architecture-flow.tsx`: Plane → Gateway → LangGraph → Agent → MR diagram.
- `frontend/components/audit-log.tsx`: audit event list.
- `frontend/components/action-bar.tsx`: page action buttons.
- `frontend/data/prototype.ts`: typed static prototype dataset.
- `frontend/lib/types.ts`: shared domain types.
- `frontend/lib/format.ts`: formatting helpers.
- `frontend/test/prototype-data.test.ts`: static data contract tests.
- `frontend/test/navigation.test.tsx`: shell navigation tests.
- `frontend/e2e/bugfix-flow.spec.ts`: clickable flow smoke test.

Modify these files:

- `README.md`: add a short section explaining how to run the frontend prototype.

## Task 1: Scaffold Frontend App

**Files:**
- Create: `frontend/package.json`
- Create: `frontend/next.config.mjs`
- Create: `frontend/tsconfig.json`
- Create: `frontend/postcss.config.mjs`
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/vitest.config.ts`
- Create: `frontend/playwright.config.ts`
- Create: `frontend/app/globals.css`
- Create: `frontend/app/layout.tsx`

**Interfaces:**
- Produces: `npm run dev`, `npm run test`, and `npm run e2e` from `frontend/`.
- Produces: Tailwind classes and global CSS variables used by all later UI tasks.

- [ ] **Step 1: Create package and config files**

Create `frontend/package.json`:

```json
{
  "name": "procloud-ai-factory-prototype",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "lint": "next lint"
  },
  "dependencies": {
    "@testing-library/jest-dom": "^6.4.8",
    "@testing-library/react": "^16.0.1",
    "@vitejs/plugin-react": "^4.3.1",
    "lucide-react": "^0.468.0",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^2.5.2",
    "vitest": "^2.1.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.47.2",
    "@types/node": "^22.7.4",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.11.1",
    "eslint-config-next": "^15.0.0",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.6.2"
  }
}
```

Create `frontend/next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone"
};

export default nextConfig;
```

Create `frontend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `frontend/postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

Create `frontend/tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "var(--surface)",
        panel: "var(--panel)",
        line: "var(--line)",
        text: "var(--text)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        good: "var(--good)",
        warn: "var(--warn)",
        danger: "var(--danger)"
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
```

Create `frontend/vitest.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: []
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname
    }
  }
});
```

Create `frontend/playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ]
});
```

- [ ] **Step 2: Create global styles and layout**

Create `frontend/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --surface: #f6f7f9;
  --panel: #ffffff;
  --line: #d9dee7;
  --text: #111827;
  --muted: #5b6575;
  --accent: #2563eb;
  --good: #15803d;
  --warn: #b45309;
  --danger: #b91c1c;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
  background: var(--surface);
  color: var(--text);
}

body {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

button,
a {
  font: inherit;
}

.focus-ring:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

Create `frontend/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Procloud AI Factory Prototype",
  description: "Clickable product and architecture prototype for the AI Factory Bugfix workflow"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Install dependencies**

Run:

```bash
cd frontend
npm install
```

Expected: `package-lock.json` is created and dependencies install without errors.

- [ ] **Step 4: Verify empty app toolchain**

Run:

```bash
cd frontend
npm run test
```

Expected: Vitest exits successfully or reports no tests found. If it exits with no-test failure, add a temporary smoke test in Task 2 before re-running.

- [ ] **Step 5: Commit**

```bash
git add frontend/package.json frontend/package-lock.json frontend/next.config.mjs frontend/tsconfig.json frontend/postcss.config.mjs frontend/tailwind.config.ts frontend/vitest.config.ts frontend/playwright.config.ts frontend/app/globals.css frontend/app/layout.tsx
git commit -m "feat: scaffold frontend prototype app"
```

## Task 2: Add Domain Types and Static Prototype Data

**Files:**
- Create: `frontend/lib/types.ts`
- Create: `frontend/lib/format.ts`
- Create: `frontend/data/prototype.ts`
- Create: `frontend/test/prototype-data.test.ts`

**Interfaces:**
- Produces: `prototypeData: PrototypeData`.
- Produces: `formatCurrency(value: number): string`.
- Produces: `formatPercent(value: number): string`.
- Later pages consume `prototypeData.metrics`, `prototypeData.runs`, `prototypeData.gates`, `prototypeData.agents`, `prototypeData.architecture`.

- [ ] **Step 1: Write data contract test**

Create `frontend/test/prototype-data.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { prototypeData } from "@/data/prototype";
import { formatCurrency, formatPercent } from "@/lib/format";

describe("prototype data", () => {
  it("contains the approved Bugfix workflow and visible future gates", () => {
    expect(prototypeData.primaryRun.workflow).toEqual([
      "Plane Issue",
      "AI Run",
      "Review Loop",
      "G3 MR Approval",
      "MR"
    ]);
    expect(prototypeData.gates.map((gate) => `${gate.id}:${gate.status}`)).toEqual([
      "G1:Feature-only",
      "G2:Feature-only",
      "G3:Active",
      "G4:Coming Next"
    ]);
  });

  it("contains required audit object types and failure scenarios", () => {
    expect(prototypeData.auditObjects.map((item) => item.name)).toEqual([
      "FactoryEvent",
      "GateResult",
      "Approval",
      "BudgetEvent"
    ]);
    expect(prototypeData.failureScenarios.map((item) => item.scenario)).toContain("重复 webhook");
    expect(prototypeData.failureScenarios.map((item) => item.scenario)).toContain("HMAC 验签失败");
    expect(prototypeData.failureScenarios.map((item) => item.scenario)).toContain("成本超限");
  });

  it("formats command center metrics", () => {
    expect(formatCurrency(4.8)).toBe("$4.80");
    expect(formatPercent(0.68)).toBe("68%");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd frontend
npm run test -- prototype-data.test.ts
```

Expected: FAIL because `@/data/prototype` and `@/lib/format` do not exist.

- [ ] **Step 3: Add shared types and format helpers**

Create `frontend/lib/types.ts`:

```ts
export type GateStatus = "Feature-only" | "Active" | "Coming Next";
export type RiskLevel = "Low" | "Medium" | "High";
export type RunStatus =
  | "received"
  | "deduped"
  | "classified"
  | "branch_created"
  | "coding_running"
  | "review_running"
  | "fix_requested"
  | "mr_ready"
  | "g3_approved"
  | "escalated";

export interface Metric {
  label: string;
  value: string;
  detail: string;
  tone: "neutral" | "good" | "warn" | "danger";
}

export interface Gate {
  id: "G1" | "G2" | "G3" | "G4";
  name: string;
  status: GateStatus;
  description: string;
}

export interface TimelineEvent {
  status: RunStatus;
  label: string;
  actor: string;
  detail: string;
  time: string;
}

export interface Run {
  id: string;
  title: string;
  source: string;
  risk: RiskLevel;
  costUsed: number;
  costLimit: number;
  reviewLoop: string;
  workflow: string[];
  timeline: TimelineEvent[];
}

export interface Issue {
  id: string;
  title: string;
  source: string;
  type: "Bugfix" | "Feature";
  dedupeStatus: "deduped" | "new";
  readiness: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  permissions: string[];
  limits: string[];
}

export interface AuditObject {
  name: "FactoryEvent" | "GateResult" | "Approval" | "BudgetEvent";
  purpose: string;
  location: string;
}

export interface FailureScenario {
  scenario: string;
  systemBehavior: string;
  userFeedback: string;
}

export interface ArchitectureNode {
  name: string;
  responsibility: string;
}

export interface PrototypeData {
  metrics: Metric[];
  gates: Gate[];
  primaryRun: Run;
  issues: Issue[];
  agents: Agent[];
  auditObjects: AuditObject[];
  failureScenarios: FailureScenario[];
  architecture: ArchitectureNode[];
}
```

Create `frontend/lib/format.ts`:

```ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 0
  }).format(value);
}
```

- [ ] **Step 4: Add static prototype data**

Create `frontend/data/prototype.ts`:

```ts
import type { PrototypeData } from "@/lib/types";

export const prototypeData: PrototypeData = {
  metrics: [
    { label: "Issue → MR 成功率", value: "68%", detail: "V1.0 target ≥ 60%", tone: "good" },
    { label: "待审批任务", value: "4", detail: "3 个 G3 MR，1 个 escalation", tone: "warn" },
    { label: "平均 AI 成本", value: "$7.40", detail: "单 Bugfix 预算 $15", tone: "neutral" },
    { label: "Review Loop", value: "1.6", detail: "控制在 2-3 轮内", tone: "good" }
  ],
  gates: [
    { id: "G1", name: "Product Approval", status: "Feature-only", description: "Feature 流程中的产品审批扩展位" },
    { id: "G2", name: "Design Approval", status: "Feature-only", description: "Feature 流程中的设计审批扩展位" },
    { id: "G3", name: "MR Approval", status: "Active", description: "Bugfix 主线当前激活的人类审批点" },
    { id: "G4", name: "Release Approval", status: "Coming Next", description: "发布审批与 canary 验证扩展位" }
  ],
  primaryRun: {
    id: "BUG-1842",
    title: "订单退款状态异常",
    source: "Plane issue_created",
    risk: "Medium",
    costUsed: 4.8,
    costLimit: 15,
    reviewLoop: "1 / 3",
    workflow: ["Plane Issue", "AI Run", "Review Loop", "G3 MR Approval", "MR"],
    timeline: [
      { status: "received", label: "Webhook received", actor: "Plane", detail: "Issue BUG-1842 entered Gateway", time: "09:12" },
      { status: "deduped", label: "Idempotency checked", actor: "Gateway", detail: "Redis SETNX accepted first delivery", time: "09:12" },
      { status: "classified", label: "Bugfix workflow selected", actor: "LangGraph", detail: "FactoryState initialized", time: "09:13" },
      { status: "branch_created", label: "Branch created", actor: "SCM", detail: "bugfix/BUG-1842-refund-status", time: "09:14" },
      { status: "coding_running", label: "Patch generated", actor: "backend_coder", detail: "Refund status transition adjusted", time: "09:24" },
      { status: "review_running", label: "Review running", actor: "review_agent", detail: "Security audit and test scan in progress", time: "09:31" },
      { status: "mr_ready", label: "MR ready", actor: "SCM", detail: "Diff summary available for G3 approval", time: "09:38" }
    ]
  },
  issues: [
    { id: "BUG-1842", title: "订单退款状态异常", source: "Plane", type: "Bugfix", dedupeStatus: "new", readiness: "Ready for workflow" },
    { id: "BUG-1841", title: "库存同步偶发延迟", source: "Plane", type: "Bugfix", dedupeStatus: "deduped", readiness: "Duplicate webhook ignored" },
    { id: "FEAT-0920", title: "会员积分规则配置", source: "Plane", type: "Feature", dedupeStatus: "new", readiness: "Feature Pipeline preview" }
  ],
  agents: [
    {
      id: "backend_coder",
      name: "backend_coder",
      role: "执行 Bugfix 编码并提交补丁",
      permissions: ["create branch", "commit changes", "push branch"],
      limits: ["no merge", "no force push", "no CI modification"]
    },
    {
      id: "review_agent",
      name: "review_agent",
      role: "执行 AI review、安全审计和基础 UI 检查",
      permissions: ["read diff", "write review result", "request fix"],
      limits: ["max 3 review loops", "escalate on blocking risk"]
    }
  ],
  auditObjects: [
    { name: "FactoryEvent", purpose: "记录所有状态变更和系统事件", location: "Run Detail, Architecture Trace" },
    { name: "GateResult", purpose: "记录审查结论、风险等级、是否阻断", location: "Gate Console" },
    { name: "Approval", purpose: "记录人类审批动作、原因和时间", location: "Gate Console, Architecture Trace" },
    { name: "BudgetEvent", purpose: "记录成本消耗、预算阈值和熔断", location: "Command Center, Run Detail" }
  ],
  failureScenarios: [
    { scenario: "重复 webhook", systemBehavior: "Gateway 使用 Redis SETNX 去重", userFeedback: "Issue Inbox 显示 deduped" },
    { scenario: "HMAC 验签失败", systemBehavior: "Gateway 拒绝请求并记录事件", userFeedback: "Architecture Trace 显示 rejected event" },
    { scenario: "Review 失败", systemBehavior: "回到 coding_fix，最多 2-3 轮", userFeedback: "Run Detail 显示 review loop" },
    { scenario: "超过最大 review 轮次", systemBehavior: "升级人工处理", userFeedback: "Command Center 显示 escalation" },
    { scenario: "成本超限", systemBehavior: "Budget circuit breaker 暂停任务", userFeedback: "Run Detail 显示 paused by budget" },
    { scenario: "Agent 执行失败", systemBehavior: "记录失败事件并允许重试或中止", userFeedback: "Run Detail 显示 Retry / Abort" }
  ],
  architecture: [
    { name: "Plane Webhook", responsibility: "需求与 Bugfix issue 入口" },
    { name: "FastAPI Gateway", responsibility: "Webhook 接收、HMAC 验签、幂等去重、标准事件转换" },
    { name: "LangGraph Orchestrator", responsibility: "维护 FactoryState、执行 workflow、处理条件边和恢复" },
    { name: "Agent Registry", responsibility: "解析可用 Agent、能力、权限和执行约束" },
    { name: "backend_coder / review_agent", responsibility: "执行编码、审查、安全审计和修复循环" },
    { name: "SCM / MR", responsibility: "创建分支、提交、推送、创建 MR" }
  ]
};
```

- [ ] **Step 5: Run test to verify it passes**

Run:

```bash
cd frontend
npm run test -- prototype-data.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/lib/types.ts frontend/lib/format.ts frontend/data/prototype.ts frontend/test/prototype-data.test.ts
git commit -m "feat: add prototype domain data"
```

## Task 3: Build Shared App Shell and UI Primitives

**Files:**
- Create: `frontend/components/app-shell.tsx`
- Create: `frontend/components/status-badge.tsx`
- Create: `frontend/components/metric-card.tsx`
- Create: `frontend/components/gate-rail.tsx`
- Create: `frontend/components/action-bar.tsx`
- Create: `frontend/test/navigation.test.tsx`

**Interfaces:**
- Produces: `AppShell({ children, active })`.
- Produces: `StatusBadge({ label, tone })`.
- Produces: `MetricCard({ label, value, detail, tone })`.
- Produces: `GateRail({ gates })`.
- Produces: `ActionBar({ actions })`.

- [ ] **Step 1: Write shell navigation test**

Create `frontend/test/navigation.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "@/components/app-shell";
import { prototypeData } from "@/data/prototype";

describe("AppShell", () => {
  it("renders all primary navigation items and the visible gate rail", () => {
    render(
      <AppShell active="Command Center">
        <div>Page body</div>
      </AppShell>
    );

    for (const item of ["Command Center", "Issue Inbox", "Runs", "Gates", "Agents", "Architecture", "Feature Pipeline"]) {
      expect(screen.getByRole("link", { name: item })).toBeInTheDocument();
    }

    for (const gate of prototypeData.gates) {
      expect(screen.getByText(gate.id)).toBeInTheDocument();
      expect(screen.getByText(gate.status)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
cd frontend
npm run test -- navigation.test.tsx
```

Expected: FAIL because shared components do not exist.

- [ ] **Step 3: Implement shared components**

Create `frontend/components/status-badge.tsx`:

```tsx
const toneClass = {
  neutral: "border-line bg-surface text-muted",
  good: "border-green-200 bg-green-50 text-good",
  warn: "border-amber-200 bg-amber-50 text-warn",
  danger: "border-red-200 bg-red-50 text-danger"
};

export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: keyof typeof toneClass }) {
  return <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium border ${toneClass[tone]}`}>{label}</span>;
}
```

Create `frontend/components/metric-card.tsx`:

```tsx
import { StatusBadge } from "@/components/status-badge";

export function MetricCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: "neutral" | "good" | "warn" | "danger" }) {
  return (
    <section className="rounded-md border border-line bg-panel p-4 shadow-subtle">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted">{label}</p>
        <StatusBadge label={tone} tone={tone} />
      </div>
      <p className="mt-3 text-2xl font-semibold text-text">{value}</p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </section>
  );
}
```

Create `frontend/components/gate-rail.tsx`:

```tsx
import type { Gate } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

function gateTone(status: Gate["status"]) {
  if (status === "Active") return "good";
  if (status === "Coming Next") return "warn";
  return "neutral";
}

export function GateRail({ gates }: { gates: Gate[] }) {
  return (
    <aside className="rounded-md border border-line bg-panel p-4 shadow-subtle">
      <h2 className="text-sm font-semibold text-text">Approval Rail</h2>
      <div className="mt-4 space-y-3">
        {gates.map((gate) => (
          <div key={gate.id} className="flex items-start justify-between gap-3 border-l-2 border-line pl-3">
            <div>
              <p className="text-sm font-semibold">{gate.id}</p>
              <p className="text-sm text-muted">{gate.name}</p>
            </div>
            <StatusBadge label={gate.status} tone={gateTone(gate.status)} />
          </div>
        ))}
      </div>
    </aside>
  );
}
```

Create `frontend/components/action-bar.tsx`:

```tsx
import type { LucideIcon } from "lucide-react";

export interface ActionItem {
  label: string;
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "danger";
}

export function ActionBar({ actions }: { actions: ActionItem[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        const variant = action.variant ?? "secondary";
        const classes =
          variant === "primary"
            ? "bg-accent text-white border-accent"
            : variant === "danger"
              ? "bg-red-50 text-danger border-red-200"
              : "bg-panel text-text border-line";
        return (
          <button key={action.label} className={`focus-ring inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${classes}`}>
            <Icon size={16} aria-hidden="true" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
```

Create `frontend/components/app-shell.tsx`:

```tsx
import Link from "next/link";
import { Factory, Search } from "lucide-react";
import { GateRail } from "@/components/gate-rail";
import { prototypeData } from "@/data/prototype";

const navItems = [
  { label: "Command Center", href: "/" },
  { label: "Issue Inbox", href: "/inbox" },
  { label: "Runs", href: "/runs/BUG-1842" },
  { label: "Gates", href: "/gates" },
  { label: "Agents", href: "/agents" },
  { label: "Architecture", href: "/architecture" },
  { label: "Feature Pipeline", href: "/feature-pipeline" }
];

export function AppShell({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-line bg-panel">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface">
              <Factory size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold">Procloud AI Factory</p>
              <p className="text-xs text-muted">Bugfix workflow prototype</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm text-muted md:flex">
            <Search size={15} aria-hidden="true" />
            Search runs, gates, agents
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
        <nav className="rounded-md border border-line bg-panel p-2 shadow-subtle">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`focus-ring block rounded px-3 py-2 text-sm ${active === item.label ? "bg-surface font-semibold text-text" : "text-muted hover:text-text"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main>{children}</main>
        <GateRail gates={prototypeData.gates} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
cd frontend
npm run test -- navigation.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/components frontend/test/navigation.test.tsx
git commit -m "feat: add prototype app shell"
```

## Task 4: Implement Core Bugfix Flow Pages

**Files:**
- Create: `frontend/app/page.tsx`
- Create: `frontend/app/runs/[runId]/page.tsx`
- Create: `frontend/app/gates/page.tsx`
- Create: `frontend/components/timeline.tsx`
- Create: `frontend/components/audit-log.tsx`

**Interfaces:**
- Consumes: `AppShell`, `MetricCard`, `ActionBar`, `prototypeData`.
- Produces: primary demo path `Command Center → Run Detail → Gate Console`.

- [ ] **Step 1: Implement timeline and audit log**

Create `frontend/components/timeline.tsx`:

```tsx
import type { TimelineEvent } from "@/lib/types";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="space-y-3">
      {events.map((event) => (
        <li key={`${event.status}-${event.time}`} className="rounded-md border border-line bg-panel p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{event.label}</p>
              <p className="mt-1 text-sm text-muted">{event.detail}</p>
            </div>
            <span className="text-xs text-muted">{event.time}</span>
          </div>
          <p className="mt-2 text-xs text-muted">{event.actor}</p>
        </li>
      ))}
    </ol>
  );
}
```

Create `frontend/components/audit-log.tsx`:

```tsx
import type { AuditObject } from "@/lib/types";

export function AuditLog({ items }: { items: AuditObject[] }) {
  return (
    <div className="rounded-md border border-line bg-panel p-4 shadow-subtle">
      <h2 className="text-sm font-semibold">Audit Objects</h2>
      <div className="mt-3 divide-y divide-line">
        {items.map((item) => (
          <div key={item.name} className="py-3">
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="mt-1 text-sm text-muted">{item.purpose}</p>
            <p className="mt-1 text-xs text-muted">{item.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Implement Command Center**

Create `frontend/app/page.tsx`:

```tsx
import Link from "next/link";
import { ArrowRight, CirclePause } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { prototypeData } from "@/data/prototype";

export default function CommandCenterPage() {
  const run = prototypeData.primaryRun;

  return (
    <AppShell active="Command Center">
      <section className="space-y-4">
        <div className="rounded-md border border-line bg-panel p-5 shadow-subtle">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">Command Center</p>
              <h1 className="mt-1 text-2xl font-semibold">AI tasks needing human attention</h1>
              <p className="mt-2 text-sm text-muted">Bugfix 主线已激活，Feature Pipeline 保留 G1/G2/G4 扩展位。</p>
            </div>
            <Link href={`/runs/${run.id}`} className="focus-ring inline-flex items-center gap-2 rounded-md border border-accent bg-accent px-3 py-2 text-sm font-medium text-white">
              Open {run.id}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {prototypeData.metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <section className="rounded-md border border-line bg-panel p-4 shadow-subtle">
          <div className="flex items-center gap-2">
            <CirclePause size={17} aria-hidden="true" />
            <h2 className="text-base font-semibold">Pending intervention</h2>
          </div>
          <div className="mt-4 rounded-md border border-line p-4">
            <p className="text-sm font-semibold">{run.id}: {run.title}</p>
            <p className="mt-1 text-sm text-muted">Risk {run.risk} · Cost ${run.costUsed.toFixed(2)} / ${run.costLimit.toFixed(2)} · Review loop {run.reviewLoop}</p>
          </div>
        </section>
      </section>
    </AppShell>
  );
}
```

- [ ] **Step 3: Implement Run Detail**

Create `frontend/app/runs/[runId]/page.tsx`:

```tsx
import { CirclePause, RotateCcw, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ActionBar } from "@/components/action-bar";
import { Timeline } from "@/components/timeline";
import { prototypeData } from "@/data/prototype";

export default function RunDetailPage() {
  const run = prototypeData.primaryRun;

  return (
    <AppShell active="Runs">
      <section className="space-y-4">
        <div className="rounded-md border border-line bg-panel p-5 shadow-subtle">
          <p className="text-sm text-muted">Run Detail</p>
          <h1 className="mt-1 text-2xl font-semibold">{run.id}: {run.title}</h1>
          <p className="mt-2 text-sm text-muted">{run.workflow.join(" → ")}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-md border border-line p-3 text-sm">Cost ${run.costUsed.toFixed(2)} / ${run.costLimit.toFixed(2)}</div>
            <div className="rounded-md border border-line p-3 text-sm">Review loop {run.reviewLoop}</div>
            <div className="rounded-md border border-line p-3 text-sm">Risk {run.risk}</div>
          </div>
          <div className="mt-4">
            <ActionBar
              actions={[
                { label: "View Gate Result", icon: ShieldCheck, variant: "primary" },
                { label: "Request Fix", icon: RotateCcw },
                { label: "Pause Run", icon: CirclePause, variant: "danger" }
              ]}
            />
          </div>
        </div>
        <Timeline events={run.timeline} />
      </section>
    </AppShell>
  );
}
```

- [ ] **Step 4: Implement Gate Console**

Create `frontend/app/gates/page.tsx`:

```tsx
import { CheckCircle2, GitPullRequest, RotateCcw, TriangleAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ActionBar } from "@/components/action-bar";
import { AuditLog } from "@/components/audit-log";
import { prototypeData } from "@/data/prototype";

export default function GateConsolePage() {
  const run = prototypeData.primaryRun;

  return (
    <AppShell active="Gates">
      <section className="space-y-4">
        <div className="rounded-md border border-line bg-panel p-5 shadow-subtle">
          <p className="text-sm text-muted">Gate Console</p>
          <h1 className="mt-1 text-2xl font-semibold">G3 MR Approval</h1>
          <p className="mt-2 text-sm text-muted">{run.id} is ready for human review. G1/G2/G4 remain visible as Feature Pipeline expansion.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-md border border-line p-3 text-sm">Diff summary: refund status transition adjusted</div>
            <div className="rounded-md border border-line p-3 text-sm">Tests: unit and routing checks passed</div>
            <div className="rounded-md border border-line p-3 text-sm">Security: no blocking issue</div>
          </div>
          <div className="mt-4">
            <ActionBar
              actions={[
                { label: "Approve MR", icon: CheckCircle2, variant: "primary" },
                { label: "Request Fix", icon: RotateCcw },
                { label: "Escalate", icon: TriangleAlert, variant: "danger" },
                { label: "Open MR", icon: GitPullRequest }
              ]}
            />
          </div>
        </div>
        <AuditLog items={prototypeData.auditObjects} />
      </section>
    </AppShell>
  );
}
```

- [ ] **Step 5: Run build**

Run:

```bash
cd frontend
npm run build
```

Expected: PASS, pages compile.

- [ ] **Step 6: Commit**

```bash
git add frontend/app/page.tsx frontend/app/runs frontend/app/gates frontend/components/timeline.tsx frontend/components/audit-log.tsx
git commit -m "feat: build core bugfix prototype flow"
```

## Task 5: Implement Support Pages and Architecture Trace

**Files:**
- Create: `frontend/app/inbox/page.tsx`
- Create: `frontend/app/agents/page.tsx`
- Create: `frontend/app/architecture/page.tsx`
- Create: `frontend/app/feature-pipeline/page.tsx`
- Create: `frontend/components/architecture-flow.tsx`

**Interfaces:**
- Consumes: `prototypeData.issues`, `prototypeData.agents`, `prototypeData.architecture`, `prototypeData.failureScenarios`.
- Produces: support pages reachable from global navigation.

- [ ] **Step 1: Implement architecture flow component**

Create `frontend/components/architecture-flow.tsx`:

```tsx
import type { ArchitectureNode } from "@/lib/types";

export function ArchitectureFlow({ nodes }: { nodes: ArchitectureNode[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {nodes.map((node, index) => (
        <div key={node.name} className="rounded-md border border-line bg-panel p-4 shadow-subtle">
          <p className="text-xs text-muted">Step {index + 1}</p>
          <h2 className="mt-1 text-base font-semibold">{node.name}</h2>
          <p className="mt-2 text-sm text-muted">{node.responsibility}</p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Implement Issue Inbox**

Create `frontend/app/inbox/page.tsx`:

```tsx
import Link from "next/link";
import { Play } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { prototypeData } from "@/data/prototype";

export default function IssueInboxPage() {
  return (
    <AppShell active="Issue Inbox">
      <section className="rounded-md border border-line bg-panel p-5 shadow-subtle">
        <p className="text-sm text-muted">Issue Inbox</p>
        <h1 className="mt-1 text-2xl font-semibold">Plane inbound queue</h1>
        <div className="mt-4 divide-y divide-line">
          {prototypeData.issues.map((issue) => (
            <div key={issue.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-semibold">{issue.id}: {issue.title}</p>
                <p className="mt-1 text-sm text-muted">{issue.source} · {issue.type} · {issue.dedupeStatus} · {issue.readiness}</p>
              </div>
              {issue.id === "BUG-1842" ? (
                <Link href="/runs/BUG-1842" className="focus-ring inline-flex items-center gap-2 rounded-md border border-accent bg-accent px-3 py-2 text-sm font-medium text-white">
                  <Play size={16} aria-hidden="true" />
                  Start Bugfix Workflow
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
```

- [ ] **Step 3: Implement Agent Registry**

Create `frontend/app/agents/page.tsx`:

Requirements:

- Use `prototypeData.agents`.
- Show `permissions` and `limits`.
- Show team programming guardrails so reviewers can confirm which Git operations each Agent may perform and which operations require human ownership.

```tsx
import { AppShell } from "@/components/app-shell";
import { prototypeData } from "@/data/prototype";

export default function AgentRegistryPage() {
  return (
    <AppShell active="Agents">
      <section className="space-y-4">
        <div className="rounded-md border border-line bg-panel p-5 shadow-subtle">
          <p className="text-sm text-muted">Agent Registry</p>
          <h1 className="mt-1 text-2xl font-semibold">Agent capabilities and boundaries</h1>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {prototypeData.agents.map((agent) => (
            <article key={agent.id} className="rounded-md border border-line bg-panel p-4 shadow-subtle">
              <h2 className="text-base font-semibold">{agent.name}</h2>
              <p className="mt-2 text-sm text-muted">{agent.role}</p>
              <h3 className="mt-4 text-sm font-semibold">Permissions</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {agent.permissions.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <h3 className="mt-4 text-sm font-semibold">Limits</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {agent.limits.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
```

- [ ] **Step 4: Implement Architecture Trace**

Create `frontend/app/architecture/page.tsx`:

Requirements:

- Display `ArchitectureFlow`.
- Display team programming and Git branch policy, including branch naming, protected branch rules, reviewer handoff, conflict detection, and Git audit events.
- Display failure scenario table from `prototypeData.failureScenarios`.
- Display `AuditLog`.

```tsx
import { AppShell } from "@/components/app-shell";
import { ArchitectureFlow } from "@/components/architecture-flow";
import { AuditLog } from "@/components/audit-log";
import { prototypeData } from "@/data/prototype";

export default function ArchitectureTracePage() {
  return (
    <AppShell active="Architecture">
      <section className="space-y-4">
        <div className="rounded-md border border-line bg-panel p-5 shadow-subtle">
          <p className="text-sm text-muted">Architecture Trace</p>
          <h1 className="mt-1 text-2xl font-semibold">Plane → Gateway → LangGraph → Agent → MR</h1>
          <p className="mt-2 text-sm text-muted">Shows why the workflow is observable, auditable, and recoverable.</p>
        </div>
        <ArchitectureFlow nodes={prototypeData.architecture} />
        <section className="rounded-md border border-line bg-panel p-4 shadow-subtle">
          <h2 className="text-base font-semibold">Failure handling</h2>
          <div className="mt-3 divide-y divide-line">
            {prototypeData.failureScenarios.map((item) => (
              <div key={item.scenario} className="grid gap-2 py-3 text-sm md:grid-cols-3">
                <p className="font-semibold">{item.scenario}</p>
                <p className="text-muted">{item.systemBehavior}</p>
                <p className="text-muted">{item.userFeedback}</p>
              </div>
            ))}
          </div>
        </section>
        <AuditLog items={prototypeData.auditObjects} />
      </section>
    </AppShell>
  );
}
```

- [ ] **Step 5: Implement Feature Pipeline placeholder**

Create `frontend/app/feature-pipeline/page.tsx`:

```tsx
import { AppShell } from "@/components/app-shell";
import { prototypeData } from "@/data/prototype";

export default function FeaturePipelinePage() {
  return (
    <AppShell active="Feature Pipeline">
      <section className="rounded-md border border-line bg-panel p-5 shadow-subtle">
        <p className="text-sm text-muted">Feature Pipeline</p>
        <h1 className="mt-1 text-2xl font-semibold">G1/G2/G4 expansion path</h1>
        <p className="mt-2 text-sm text-muted">第一版原型只激活 Bugfix 的 G3 MR Approval；Feature workflow 在这里展示未来扩展位。</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {prototypeData.gates.map((gate) => (
            <div key={gate.id} className="rounded-md border border-line p-4">
              <p className="text-sm font-semibold">{gate.id}: {gate.name}</p>
              <p className="mt-1 text-sm text-muted">{gate.status}</p>
              <p className="mt-2 text-sm text-muted">{gate.description}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
```

- [ ] **Step 6: Run build**

Run:

```bash
cd frontend
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add frontend/app/inbox frontend/app/agents frontend/app/architecture frontend/app/feature-pipeline frontend/components/architecture-flow.tsx
git commit -m "feat: add prototype support pages"
```

## Task 6: Add End-to-End Flow Test and README Instructions

**Files:**
- Create: `frontend/e2e/bugfix-flow.spec.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: all implemented pages.
- Produces: Playwright smoke coverage for navigation and main demo path.

- [ ] **Step 1: Write e2e flow test**

Create `frontend/e2e/bugfix-flow.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("clicks through the Bugfix prototype flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "AI tasks needing human attention" })).toBeVisible();
  await page.getByRole("link", { name: /Open BUG-1842/ }).click();

  await expect(page.getByRole("heading", { name: /BUG-1842: 订单退款状态异常/ })).toBeVisible();
  await expect(page.getByText("Plane Issue → AI Run → Review Loop → G3 MR Approval → MR")).toBeVisible();

  await page.getByRole("link", { name: "Gates" }).click();
  await expect(page.getByRole("heading", { name: "G3 MR Approval" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Approve MR/ })).toBeVisible();

  await page.getByRole("link", { name: "Architecture" }).click();
  await expect(page.getByRole("heading", { name: "Plane → Gateway → LangGraph → Agent → MR" })).toBeVisible();
  await expect(page.getByText("FactoryEvent")).toBeVisible();
});
```

- [ ] **Step 2: Add README instructions**

Modify `README.md` by appending:

```markdown
## Frontend Prototype

The clickable AI Factory prototype lives in `frontend/`.

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
cd frontend
npm run test
npm run build
npm run e2e
```

The prototype uses static data only. It does not call Plane, FastAPI, LangGraph, SCM, or real agents.
```
```

- [ ] **Step 3: Run all frontend checks**

Run:

```bash
cd frontend
npm run test
npm run build
npm run e2e
```

Expected: all checks PASS in Chromium and mobile Playwright projects.

- [ ] **Step 4: Commit**

```bash
git add frontend/e2e/bugfix-flow.spec.ts README.md
git commit -m "test: cover bugfix prototype flow"
```

## Task 7: Visual QA and Polish Pass

**Files:**
- Modify only files under `frontend/app/`, `frontend/components/`, or `frontend/app/globals.css` if QA finds visual issues.

**Interfaces:**
- Consumes: running prototype at `http://localhost:3000`.
- Produces: verified desktop and mobile layouts.

- [ ] **Step 1: Start the dev server**

Run:

```bash
cd frontend
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Expected: local app starts at `http://127.0.0.1:3000`.

- [ ] **Step 2: Verify desktop pages**

Use a browser at 1440×900 and inspect:

```text
/
/inbox
/runs/BUG-1842
/gates
/agents
/architecture
/feature-pipeline
```

Expected:

- Left navigation, main content, and gate rail do not overlap.
- Text fits inside buttons, metric cards, and table rows.
- Command Center immediately shows operational state, not a marketing page.
- Gate rail clearly shows G1/G2/G4 as inactive expansion and G3 as active.

- [ ] **Step 3: Verify mobile pages**

Use a browser at 390×844 and inspect the same routes.

Expected:

- Layout stacks cleanly.
- Navigation remains usable.
- Gate rail appears after main content without obscuring primary actions.
- Buttons wrap without clipped text.

- [ ] **Step 4: Fix concrete issues only**

If text overflows in action buttons, change `ActionBar` button classes to:

```tsx
className={`focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium leading-tight ${classes}`}
```

If the three-column desktop shell is too narrow at tablet widths, change `AppShell` grid classes to:

```tsx
className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 xl:grid-cols-[220px_minmax(0,1fr)_260px]"
```

- [ ] **Step 5: Re-run checks**

Run:

```bash
cd frontend
npm run test
npm run build
npm run e2e
```

Expected: all checks PASS.

- [ ] **Step 6: Commit polish if any files changed**

```bash
git add frontend
git commit -m "fix: polish prototype responsive layout"
```

If no files changed after visual QA, do not create an empty commit.

## Self-Review

Spec coverage:

- Bugfix main workflow is covered by Tasks 2, 4, and 6.
- G1-G4 visible but only G3 active is covered by Tasks 2, 3, and 5.
- Six-page prototype is covered by Tasks 4 and 5.
- Technical architecture trace is covered by Tasks 2 and 5.
- Status flow is covered by Tasks 2 and 4.
- Audit objects are covered by Tasks 2, 4, and 5.
- Failure handling is covered by Tasks 2 and 5.
- Static data only is enforced by Tasks 2 through 6.
- Dashboard metrics are covered by Tasks 2 and 4.

Placeholder scan:

- The plan contains no unresolved markers or unspecified implementation steps.
- Each code-writing step includes concrete file contents.

Type consistency:

- `PrototypeData`, `Gate`, `Run`, `TimelineEvent`, `AuditObject`, `FailureScenario`, and `ArchitectureNode` are defined in Task 2 and consumed consistently in later tasks.
- `AppShell`, `MetricCard`, `GateRail`, `ActionBar`, `Timeline`, `AuditLog`, and `ArchitectureFlow` are defined before use.
