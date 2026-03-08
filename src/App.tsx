import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VSCodeLayout from "@/components/vscode/VSCodeLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DashboardIoT from "./pages/DashboardIoT";
import DashboardGeo from "./pages/DashboardGeo";
import DashboardAlerts from "./pages/DashboardAlerts";
import DashboardTracking from "./pages/DashboardTracking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <VSCodeLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/iot" element={<DashboardIoT />} />
            <Route path="/dashboard/geo" element={<DashboardGeo />} />
            <Route path="/dashboard/alerts" element={<DashboardAlerts />} />
            <Route path="/dashboard/tracking" element={<DashboardTracking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </VSCodeLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
