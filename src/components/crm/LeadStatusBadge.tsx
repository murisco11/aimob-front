import { Flame, Thermometer, Snowflake } from "lucide-react";

interface LeadStatusBadgeProps {
  status?: string | null;
}

const config = {
  hot: { icon: Flame, label: "Hot", className: "bg-hot/10 text-hot" },
  warm: { icon: Thermometer, label: "Warm", className: "bg-warm/10 text-warm" },
  cold: { icon: Snowflake, label: "Cold", className: "bg-cold/10 text-cold" },
};

const LeadStatusBadge = ({ status }: LeadStatusBadgeProps) => {
  const statusKey = status?.toLowerCase() as keyof typeof config | undefined;
  const { icon: Icon, label, className } = config[statusKey ?? "cold"] ?? config.cold;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

export default LeadStatusBadge;
