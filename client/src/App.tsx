import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import WhatsApp from "./pages/WhatsApp";
import Observability from "./pages/Observability";
import Configuration from "./pages/Configuration";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <DashboardLayout><Dashboard /></DashboardLayout>} />
      <Route path="/agents" component={() => <DashboardLayout><Agents /></DashboardLayout>} />
      <Route path="/whatsapp" component={() => <DashboardLayout><WhatsApp /></DashboardLayout>} />
      <Route path="/observability" component={() => <DashboardLayout><Observability /></DashboardLayout>} />
      <Route path="/configuration" component={() => <DashboardLayout><Configuration /></DashboardLayout>} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
