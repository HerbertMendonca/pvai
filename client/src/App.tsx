import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import WhatsAppDispatcher from "./pages/WhatsAppDispatcher";
import Observability from "./pages/Observability";
import Configuration from "./pages/Configuration";
import Agendas from "./pages/Agendas";
import NotFound from "./pages/NotFound";
import EquipeIA from "./pages/EquipeIA";
import Alerts from "./pages/Alerts";
import Cadastro from "./pages/setores/Cadastro";
import Cobranca from "./pages/setores/Cobranca";
import Eventos from "./pages/setores/Eventos";
import Comercial from "./pages/setores/Comercial";
import Rastreamento from "./pages/setores/Rastreamento";
import Marketing from "./pages/setores/Marketing";
import Relacionamento from "./pages/setores/Relacionamento";
import Kanban from "./pages/Kanban";
import Login from "./pages/Login";
import { useAuth } from "./_core/hooks/useAuth";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={() => <DashboardLayout><ProtectedRoute component={Dashboard} /></DashboardLayout>} />
      <Route path="/agents" component={() => <DashboardLayout><ProtectedRoute component={Agents} /></DashboardLayout>} />
      <Route path="/whatsapp" component={() => <DashboardLayout><ProtectedRoute component={WhatsAppDispatcher} /></DashboardLayout>} />
      <Route path="/equipe-ia" component={() => <DashboardLayout><ProtectedRoute component={EquipeIA} /></DashboardLayout>} />
      <Route path="/setores/cadastro" component={() => <DashboardLayout><ProtectedRoute component={Cadastro} /></DashboardLayout>} />
      <Route path="/setores/cobranca" component={() => <DashboardLayout><ProtectedRoute component={Cobranca} /></DashboardLayout>} />
      <Route path="/setores/eventos" component={() => <DashboardLayout><ProtectedRoute component={Eventos} /></DashboardLayout>} />
      <Route path="/setores/comercial" component={() => <DashboardLayout><ProtectedRoute component={Comercial} /></DashboardLayout>} />
      <Route path="/setores/rastreamento" component={() => <DashboardLayout><ProtectedRoute component={Rastreamento} /></DashboardLayout>} />
      <Route path="/setores/marketing" component={() => <DashboardLayout><ProtectedRoute component={Marketing} /></DashboardLayout>} />
      <Route path="/setores/relacionamento" component={() => <DashboardLayout><ProtectedRoute component={Relacionamento} /></DashboardLayout>} />
      <Route path="/alerts" component={() => <DashboardLayout><ProtectedRoute component={Alerts} /></DashboardLayout>} />
      <Route path="/observability" component={() => <DashboardLayout><ProtectedRoute component={Observability} /></DashboardLayout>} />
      <Route path="/configuration" component={() => <DashboardLayout><ProtectedRoute component={Configuration} /></DashboardLayout>} />
      <Route path="/agendas" component={() => <ProtectedRoute component={Agendas} />} />
      <Route path="/kanban" component={() => <DashboardLayout><ProtectedRoute component={Kanban} /></DashboardLayout>} />
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
