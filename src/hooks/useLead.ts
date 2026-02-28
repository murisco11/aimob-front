import { useLeadStore } from "@/stores/leadStore";

export const useLead = () => {
    const {
        leads,
        isLoading,
        error,
        fetchLeads
    } = useLeadStore();

    return {
        leads,
        isLoading,
        error,
        fetchLeads
    };
}
