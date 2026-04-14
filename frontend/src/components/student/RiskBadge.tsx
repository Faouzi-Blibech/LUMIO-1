import { cn } from "@/lib/utils";

type RiskTier = "low" | "moderate" | "needs-attention";

const config: Record<RiskTier, { label: string; className: string }> = {
  low: { label: "Low Risk", className: "bg-success/10 text-success border-success/20" },
  moderate: { label: "Moderate", className: "bg-warning/10 text-warning border-warning/20" },
  "needs-attention": { label: "Needs Attention", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export const RiskBadge = ({ tier }: { tier: RiskTier }) => {
  const { label, className } = config[tier];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body font-medium border", className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
};
