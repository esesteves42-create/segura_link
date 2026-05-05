import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VSCodeLayout from "@/components/vscode/VSCodeLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardIoT = lazy(() => import("./pages/DashboardIoT"));
const DashboardGeo = lazy(() => import("./pages/DashboardGeo"));
const DashboardAlerts = lazy(() => import("./pages/DashboardAlerts"));
const DashboardTracking = lazy(() => import("./pages/DashboardTracking"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="flex h-full w-full items-center justify-center p-8 text-sm text-muted-foreground">
    A carregar…
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <VSCodeLayout>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/iot"
                element={<ProtectedRoute><DashboardIoT /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/geo"
                element={<ProtectedRoute><DashboardGeo /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/alerts"
                element={<ProtectedRoute><DashboardAlerts /></ProtectedRoute>}
              />
              <Route
                path="/dashboard/tracking"
                element={<ProtectedRoute><DashboardTracking /></ProtectedRoute>}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </VSCodeLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
