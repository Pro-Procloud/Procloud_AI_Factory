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
