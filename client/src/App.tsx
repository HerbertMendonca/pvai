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
import EquipeIA from "./pages/EquipeIA";
import Cadastro from "./pages/setores/Cadastro";
import Cobranca from "./pages/setores/Cobranca";
import Eventos from "./pages/setores/Eventos";
import Comercial from "./pages/setores/Comercial";
import Rastreamento from "./pages/setores/Rastreamento";
import Marketing from "./pages/setores/Marketing";
import Relacionamento from "./pages/setores/Relacionamento";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <DashboardLayout><Dashboard /></DashboardLayout>} />
      <Route path="/agents" component={() => <DashboardLayout><Agents /></DashboardLayout>} />
      <Route path="/whatsapp" component={() => <DashboardLayout><WhatsApp /></DashboardLayout>} />
      <Route path="/equipe-ia" component={() => <DashboardLayout><EquipeIA /></DashboardLayout>} />
      <Route path="/setores/cadastro" component={() => <DashboardLayout><Cadastro /></DashboardLayout>} />
      <Route path="/setores/cobranca" component={() => <DashboardLayout><Cobranca /></DashboardLayout>} />
      <Route path="/setores/eventos" component={() => <DashboardLayout><Eventos /></DashboardLayout>} />
      <Route path="/setores/comercial" component={() => <DashboardLayout><Comercial /></DashboardLayout>} />
      <Route path="/setores/rastreamento" component={() => <DashboardLayout><Rastreamento /></DashboardLayout>} />
      <Route path="/setores/marketing" component={() => <DashboardLayout><Marketing /></DashboardLayout>} />
      <Route path="/setores/relacionamento" component={() => <DashboardLayout><Relacionamento /></DashboardLayout>} />
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
