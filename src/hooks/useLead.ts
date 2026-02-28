import { useLeadStore } from "@/stores/leadStore";

export const useLead = () => {
    const {
        leads,
        isLoading,
        error,
        updateLeadAiActive,
        fetchLeads
    } = useLeadStore();

    return {
        leads,
        updateLeadAiActive,
        isLoading,
        error,
        fetchLeads
    };
}
