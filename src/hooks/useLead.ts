import { useLeadStore } from "@/stores/leadStore";

export const useLead = () => {
    const {
        leads,
        lead,
        isLoading,
        error,
        updateLeadAiActive,
        fetchLeads,
        getLeadById,
    } = useLeadStore();

    return {
        lead,
        leads,
        getLeadById,
        updateLeadAiActive,
        isLoading,
        error,
        fetchLeads
    };
}
