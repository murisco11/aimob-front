import { leadService } from "@/services/leadService";
import { Lead } from "@/services/types";
import { create } from "zustand";

export interface LeadStore {
    leads: Lead[];
    lead: Lead | null;
    isLoading: boolean;
    error: string | null

    fetchLeads: () => Promise<void>;
    getLeadById: (id: number) => Promise<void>;
    updateLeadAiActive: (id: number, aiActive: boolean) => Promise<void>; // Nova tipagem
}

export const useLeadStore = create<LeadStore>()(
    (set, get) => ({
        leads: [],
        isLoading: false,
        error: null,
        lead: null,

        fetchLeads: async () => {
            try {
                set({ isLoading: true, error: null });
                const leads = await leadService.getLeads();

                set({ leads: leads, isLoading: false });
            } catch (error) {
                console.error("Failed to fetch leads:", error);
                set({ error: "Failed to fetch leads", isLoading: false });
            }
        },
        updateLeadAiActive: async (id: number, aiActive: boolean) => {
            try {
                await leadService.updateAiActive(id, aiActive);

                const currentLeads = get().leads;
                set({
                    leads: currentLeads.map((lead) =>
                        lead.id === id ? { ...lead, aiActive: aiActive } : lead
                    )
                });
            } catch (error) {
                console.error(`Failed to update AI status for lead ${id}:`, error);
                throw error;
            }
        },
        getLeadById: async (id: number) => {
            try {
                set({ isLoading: true, error: null });
                const lead = await leadService.getLeadById(id);

                set({ lead: lead, isLoading: false });
            } catch (error) {
                console.error("Failed to fetch lead:", error);
                set({ error: "Failed to fetch lead", isLoading: false });
            }
        }
    })
);
