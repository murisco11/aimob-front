import { Instagram, MessageCircle } from "lucide-react";
import { Lead } from "@/data/mockData";
import LeadStatusBadge from "./LeadStatusBadge";

interface LeadTableProps {
  leads: Lead[];
  selectedLeadId: string;
  onSelectLead: (id: string) => void;
}

const LeadTable = ({ leads, selectedLeadId, onSelectLead }: LeadTableProps) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-card-foreground">Lead Intelligence</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{leads.length} active leads</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground bg-muted px-2 py-1 rounded-md">
            Sorted by priority
          </span>
        </div>
      </div>

      <div className="divide-y divide-border">
        {leads.map((lead) => (
          <button
            key={lead.id}
            onClick={() => onSelectLead(lead.id)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-muted/50 ${
              selectedLeadId === lead.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground">
                {lead.avatar}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-card flex items-center justify-center">
                {lead.origin === "instagram" ? (
                  <Instagram className="w-2.5 h-2.5 text-pink-500" />
                ) : (
                  <MessageCircle className="w-2.5 h-2.5 text-green-500" />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-card-foreground truncate">{lead.name}</span>
                <LeadStatusBadge status={lead.status} />
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{lead.summary}</p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] text-muted-foreground">{lead.lastMessageTime}</span>
              {lead.unread > 0 && (
                <div className="mt-1 ml-auto w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold flex items-center justify-center">
                  {lead.unread}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeadTable;
