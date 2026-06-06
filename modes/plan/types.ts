export interface PlanStep {
  id: string;
  title: string;
  description: string;
  hints: string[] | undefined;
  complexity: "low" | "medium" | "high" | undefined;
}

export interface Plan {
  goal: string;
  researchSummary: string | undefined;
  steps: PlanStep[];
}
