# Procloud AI Factory 产品交互与技术架构原型设计

日期：2026-07-07

## 1. 设计目标

本原型用于展示 Procloud AI Factory 的第一版产品闭环：以 Plane Issue 作为需求入口，由 AI Factory 接收、编排、执行、审查并产出 MR，在关键节点保留人工审批和审计轨迹。

第一版原型采用“混合演示闭环”：既展示项目经理、技术负责人、研发负责人看到的产品交互页面，也展示 Plane → Gateway → LangGraph → Agent → MR 的技术链路。

## 2. 原型范围

### 2.1 主线任务

第一版以 Bugfix 为主线：

```text
Plane Issue
→ AI Run
→ Review Loop
→ G3 MR Approval
→ MR
```

选择 Bugfix 主线的原因：

- 贴合 V1.0 PRD：Phase 1 重点支持 backend_coder 和 Review Graph。
- 闭环短，适合做成可点击原型。
- 能清楚展示 AI 执行、人类审批、质量门禁、审计和失败恢复。

### 2.2 Feature 扩展位

Feature 流程不在第一版中完整展开，但在导航和阶段轨道中保留扩展位置：

- G1 Product Approval：标记为 Feature-only。
- G2 Design Approval：标记为 Feature-only。
- G4 Release Approval：标记为 Coming Next。
- Feature Pipeline：作为全局导航中的未来能力入口。

### 2.3 团队编程与 Git 分支管理

项目需要支持团队协作式编程和可治理的 Git 分支管理。AI Factory 不能只是生成补丁，还必须在团队工作流里安全地创建、推进、交接和审计代码变更。

第一版原型需要体现：

- 每个 AI Run 创建独立短生命周期分支，命名格式为 `bugfix/{issue-id}-{slug}` 或 `feature/{issue-id}-{slug}`。
- `main`、`release/*`、`hotfix/*` 等保护分支禁止 Agent 直接提交，所有变更必须通过 MR。
- Agent 权限边界必须清楚展示：允许 create branch、commit、push、open/update MR；禁止 merge、force push、绕过审批。
- G3 MR Approval 需要展示 reviewer、request-fix、escalation、approval 和 merge owner 的团队交接关系。
- 系统需要检测并行 AI Run 是否修改同一文件或模块；发生冲突时暂停自动推进并升级人工协调。
- 审计链路需要记录 `branch_created`、`commit_pushed`、`mr_opened`、`review_requested`、`merge_ready` 等 Git 事件。

## 3. 信息架构

全局导航包含：

```text
Command Center
Issue Inbox
Runs
Gates
Agents
Architecture
Feature Pipeline
```

页面职责如下：

| 页面 | 主任务 | 关键内容 | 主要动作 |
|---|---|---|---|
| Command Center | 判断哪些 AI 任务需要人介入 | 运行健康、待审批、成本、风险、瓶颈 | 进入待处理 Bugfix Run |
| Issue Inbox | 查看 Plane 入站任务是否可启动 | Issue 摘要、去重状态、任务类型、触发来源 | Start Bugfix Workflow |
| Runs / Run Detail | 理解 AI 当前做到哪一步、是否卡住 | 状态时间线、预算、Agent 输出、Review Loop | 查看审查结果、暂停任务 |
| Gates / Gate Console | 完成 G3 MR 审批 | Diff 摘要、测试结果、安全审计、风险解释 | Approve MR、Request Fix、Escalate |
| Agents / Agent Registry | 确认 Agent 能力和权限边界 | backend_coder、review_agent、Git 权限、团队协作限制、审计 | 查看 Agent 配置和历史记录 |
| Architecture / Architecture Trace | 解释系统链路、状态和可信度 | 组件链路、FactoryState、Git 分支治理、事件审计、错误恢复 | 定位失败节点、查看事件详情 |

## 4. 审批流设计

原型采用“G1-G4 全部可见，但 Bugfix 只激活 G3”的方式。

阶段轨道：

```text
G1 Product Approval    Feature-only
G2 Design Approval     Feature-only
G3 MR Approval         Active
G4 Release Approval    Coming Next
```

这样设计可以同时满足两个目标：

- 对 V1.0 诚实：Bugfix 主线中只展开 G3 MR 审批。
- 对产品愿景完整：用户能看到 Feature Pipeline 未来会覆盖 G1/G2/G4。

## 5. 关键演示路径

推荐演示路径：

1. 用户进入 Command Center，看到待审批 Bugfix、成本、风险和运行健康。
2. 用户进入 Run Detail，查看 AI 执行状态、预算消耗、Agent 输出和 Review Loop。
3. 用户进入 Gate Console，查看 MR diff 摘要、测试结果、安全审计和风险说明。
4. 用户选择 Approve MR 或 Request Fix。
5. 用户打开 Architecture Trace，解释 Plane → Gateway → LangGraph → Agent → MR 的技术链路。

Issue Inbox 和 Agent Registry 是支撑页面：

- Issue Inbox 用于说明 Plane webhook 入站、去重和启动 workflow。
- Agent Registry 用于说明 backend_coder、review_agent 的能力、权限和限制。

## 6. 技术架构原型

### 6.1 组件链路

```text
Plane Webhook
→ FastAPI Gateway
→ LangGraph Orchestrator
→ Agent Registry
→ backend_coder / review_agent
→ SCM
→ MR
```

### 6.2 关键职责

| 组件 | 职责 |
|---|---|
| Plane | 需求与 Bugfix issue 入口 |
| Gateway | Webhook 接收、HMAC 验签、幂等去重、标准事件转换 |
| LangGraph Orchestrator | 维护 FactoryState、执行 workflow、处理条件边和恢复 |
| Agent Registry | 解析可用 Agent、能力、权限和执行约束 |
| backend_coder | 执行 Bugfix 编码任务、提交变更 |
| review_agent | 执行 AI review、安全审计和 UI 基础审计 |
| SCM | 创建分支、提交、推送、创建 MR、执行保护分支策略 |

## 7. 状态流

Bugfix Run 的状态流：

```text
received
→ deduped
→ classified
→ branch_created
→ coding_running
→ review_running
→ fix_requested
→ mr_ready
→ g3_approved / escalated
```

Run Detail 页面展示该状态时间线，并在每个节点提供：

- 当前节点状态。
- 最近事件。
- 产生该状态的 Agent 或系统组件。
- 关联的审计记录。
- 可用的人类操作。

Git 分支相关状态作为 FactoryState 的一部分进入同一条时间线：

```text
branch_created
→ commit_pushed
→ mr_opened
→ review_requested
→ merge_ready
```

当系统检测到保护分支写入、force push、并行修改冲突或 reviewer 缺失时，Run 进入 paused / escalated 状态，由团队负责人或指定 reviewer 接管。

## 8. 审计模型

原型中需要体现四类审计对象：

| 审计对象 | 用途 | 主要展示位置 |
|---|---|---|
| FactoryEvent | 记录所有状态变更和系统事件 | Run Detail、Architecture Trace |
| GateResult | 记录审查结论、风险等级、是否阻断 | Gate Console |
| Approval | 记录人类审批动作、原因和时间 | Gate Console、Architecture Trace |
| BudgetEvent | 记录成本消耗、预算阈值和熔断 | Command Center、Run Detail |

Git 分支管理事件归入 FactoryEvent，并在需要人工判断时关联 Approval。MR 审批记录需要保留 reviewer、merge owner、源分支、目标分支、提交摘要和风险说明。

## 9. 错误处理与恢复

原型需要展示的关键失败场景：

| 场景 | 系统行为 | 用户可见反馈 |
|---|---|---|
| 重复 webhook | Gateway 使用 Redis SETNX 去重 | Issue Inbox 显示 deduped |
| HMAC 验签失败 | Gateway 拒绝请求并记录事件 | Architecture Trace 显示 rejected event |
| Review 失败 | 回到 coding_fix，最多 2-3 轮 | Run Detail 显示 review loop |
| 超过最大 review 轮次 | 升级人工处理 | Command Center 显示 escalation |
| 成本超限 | Budget circuit breaker 暂停任务 | Run Detail 显示 paused by budget |
| Agent 执行失败 | 记录失败事件并允许重试或中止 | Run Detail 显示 Retry / Abort |

可恢复性依赖：

- FactoryState 作为单一状态源。
- LangGraph checkpointer 支持断点恢复。
- 用户在 Run Detail 中可以执行 Pause、Abort、Request Fix。

## 10. 仪表盘指标

Command Center 第一版展示以下指标：

- Issue → MR 成功率。
- 待审批任务数。
- 平均 AI 成本。
- Review loop 平均轮次。
- 失败和升级任务数。
- 当前预算消耗。
- 高风险任务数。

这些指标与 PRD 的 V1.0 核心指标保持一致。

## 11. 可点击原型建议

后续实现可点击前端原型时，建议优先实现以下页面顺序：

1. Command Center：建立演示入口和整体状态感。
2. Run Detail：承载主要故事线。
3. Gate Console：展示人类审批价值。
4. Architecture Trace：支撑技术评审。
5. Issue Inbox：补齐 Plane 入口。
6. Agent Registry：补齐 Agent 能力与权限说明。

第一版可使用静态数据完成演示，不需要接入真实 Plane、SCM 或 LangGraph。

## 12. 非目标

第一版原型不包含：

- 完整 Feature workflow 的可操作演示。
- 真实 Plane webhook 接入。
- 真实 GitHub/GitLab MR 创建。
- 真实 Agent 调用。
- 真实权限系统。
- 真实 Git 分支保护规则写入或仓库权限变更。
- 生产级监控与告警配置。

这些能力应在产品交互原型验证通过后，再进入实现计划。
