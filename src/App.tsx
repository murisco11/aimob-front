import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/stores/authStore";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Visits from "./pages/Visits";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import PropertyRegister from "./pages/PropertyRegister";
import Leads from "./pages/Leads";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NewVisit from "./pages/VisitForm";
import NotFound from "./pages/NotFound";
import { GlobalConfirmDialog } from "./components/crm/Confirm";
import LeadForm from "./pages/LeadForm";
import AIConfig from "./pages/AiConfig";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />

      {/* Rotas Protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leads"
        element={
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leads/new"
        element={
          <ProtectedRoute>
            <LeadForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leads/:id"
        element={
          <ProtectedRoute>
            <LeadForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai"
        element={
          <ProtectedRoute>
            <AIConfig />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visits"
        element={
          <ProtectedRoute>
            <Visits />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visits/new"
        element={
          <ProtectedRoute>
            <NewVisit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visits/:id"
        element={
          <ProtectedRoute>
            <NewVisit />
          </ProtectedRoute>
        } />
      <Route
        path="/properties/edit/:id"
        element={
          <ProtectedRoute>
            <PropertyRegister />
          </ProtectedRoute>
        }
      />
      < Route
        path="/properties"
        element={
          < ProtectedRoute >
            <Properties />
          </ProtectedRoute >
        }
      />
      < Route
        path="/properties/new"
        element={
          < ProtectedRoute >
            <PropertyRegister />
          </ProtectedRoute >
        }
      />
      < Route
        path="/properties/:id"
        element={
          < ProtectedRoute >
            <PropertyDetail />
          </ProtectedRoute >
        }
      />
      < Route
        path="/analytics"
        element={
          < ProtectedRoute >
            <Analytics />
          </ProtectedRoute >
        }
      />
      < Route
        path="/settings"
        element={
          < ProtectedRoute >
            <Settings />
          </ProtectedRoute >
        }
      />

      {/* Rota 404 - deve ser última */}
      <Route path="*" element={<NotFound />} />

    </Routes >
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
        <GlobalConfirmDialog />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
