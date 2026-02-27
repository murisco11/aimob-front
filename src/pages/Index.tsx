import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import LeadTable from "@/components/crm/LeadTable";
import ChatInterface from "@/components/crm/ChatInterface";
import PropertyPanel from "@/components/crm/PropertyPanel";
import { leads, properties } from "@/data/mockData";

const Index = () => {
  const [searchParams] = useSearchParams();
  const leadIdFromUrl = searchParams.get("leadId");
  const [selectedLeadId, setSelectedLeadId] = useState(leadIdFromUrl || leads[0].id);
  const selectedLead = leads.find((l) => l.id === selectedLeadId) ?? leads[0];

  useEffect(() => {
    if (leadIdFromUrl && leads.some((l) => l.id === leadIdFromUrl)) {
      setSelectedLeadId(leadIdFromUrl);
    }
  }, [leadIdFromUrl]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CrmSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Lead Table */}
          <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 overflow-y-auto p-3 border-r border-border scrollbar-thin">
            <LeadTable leads={leads} selectedLeadId={selectedLeadId} onSelectLead={setSelectedLeadId} />
          </div>

          {/* Center: Chat */}
          <div className="hidden md:flex flex-1 min-w-0 p-3">
            <ChatInterface lead={selectedLead} />
          </div>

          {/* Right: Property Sidebar */}
          <div className="hidden xl:flex w-[300px] shrink-0 p-3 border-l border-border">
            <PropertyPanel properties={properties} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
