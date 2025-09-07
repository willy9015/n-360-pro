import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SplashScreen from "./pages/SplashScreen";
import Profile from "./pages/Profile";
import PredictiveAI from "./pages/PredictiveAI";
import PPEControl from "./pages/PPEControl";
import RiskMap from "./pages/RiskMap";
import ISOAudit from "./pages/ISOAudit";
import AITraining from "./pages/AITraining";
import Community from "./pages/Community";
import UserManual from "./pages/UserManual";
import Checklists from "./pages/Checklists";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/predictive-ai" element={<PredictiveAI />} />
            <Route path="/ppe-control" element={<PPEControl />} />
            <Route path="/risk-map" element={<RiskMap />} />
            <Route path="/iso-audit" element={<ISOAudit />} />
            <Route path="/ai-training" element={<AITraining />} />
            <Route path="/community" element={<Community />} />
            <Route path="/manual" element={<UserManual />} />
            <Route path="/checklists" element={<Checklists />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
