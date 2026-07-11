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
  runs: [
    {
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
    }
  ],
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
  ],
  teamGitPolicy: [
    {
      name: "Branch ownership",
      responsibility: "每个 AI Run 创建独立短生命周期分支，命名格式为 bugfix/{issue-id}-{slug} 或 feature/{issue-id}-{slug}",
      owner: "LangGraph + SCM"
    },
    {
      name: "Protected branches",
      responsibility: "main、release/* 和 hotfix/* 只允许通过 MR 合入，Agent 禁止直接提交或 force push",
      owner: "SCM policy"
    },
    {
      name: "Team review handoff",
      responsibility: "G3 MR Approval 必须显示 reviewer、approval、request-fix、escalation 和最终 merge owner",
      owner: "Gate Console"
    },
    {
      name: "Parallel work safety",
      responsibility: "检测同一文件或模块的并行 AI Run，冲突时暂停自动推进并升级人工协调",
      owner: "FactoryState"
    },
    {
      name: "Git audit trail",
      responsibility: "FactoryEvent 记录 branch_created、commit_pushed、mr_opened、review_requested、merge_ready 等 Git 事件",
      owner: "Audit log"
    }
  ]
};
