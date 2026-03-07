import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Info, AlertTriangle, Search, RefreshCw, Activity, Terminal, ShieldAlert, Zap, Loader } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDashboardStats } from "@/_core/hooks/useDashboardStats";

type LogLevel = "info" | "warning" | "error" | "critical";

export default function Observability() {
  const [idEmpresa] = useState(1); // TODO: Get from user context
  const [filterLevel, setFilterLevel] = useState<LogLevel | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();

  // Fetch logs
  const logsQuery = trpc.logs.getAll.useQuery({
    idEmpresa,
    limit: 100,
  });

  // Fetch error logs
  const errosQuery = trpc.logs.getErros.useQuery({
    idEmpresa,
    limit: 50,
  });

  // Fetch alerts
  const alertasQuery = trpc.alerts.getAll.useQuery({
    idEmpresa,
    limit: 100,
  });

  const getLevelIcon = (nivel: string) => {
    switch (nivel) {
      case "critical":
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getLevelColor = (nivel: string) => {
    switch (nivel) {
      case "critical":
        return "bg-red-50/50 border-red-100 text-red-900";
      case "error":
        return "bg-orange-50/50 border-orange-100 text-orange-900";
      case "warning":
        return "bg-yellow-50/50 border-yellow-100 text-yellow-900";
      default:
        return "bg-blue-50/50 border-blue-100 text-blue-900";
    }
  };

  const filteredLogs = logsQuery.data?.filter((log) => {
    const matchesLevel = filterLevel === "all" || log.nivel === filterLevel;
    const matchesSearch = (log.mensagem || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  }) || [];

  const handleRefresh = () => {
    logsQuery.refetch();
    errosQuery.refetch();
    alertasQuery.refetch();
    refetchStats();
  };

  const isLoading = logsQuery.isLoading || errosQuery.isLoading || alertasQuery.isLoading || statsLoading;
  const hasError = logsQuery.isError || errosQuery.isError || alertasQuery.isError || statsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <p className="ml-2 text-slate-600">Carregando dados de observabilidade...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-red-600">
        <AlertCircle className="w-8 h-8" />
        <p className="ml-2">Erro ao carregar dados: {logsQuery.error?.message || errosQuery.error?.message || alertasQuery.error?.message || statsError?.message || "Desconhecido"}</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3 bg-slate-50/50 min-h-screen">
      {/* Header Compacto */}
      <div className="flex justify-between items-center bg-white p-3 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">Observabilidade</h1>
            <p className="text-[11px] font-medium text-slate-500">Monitoramento em tempo real do sistema</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100 font-bold text-[10px] px-2 py-0.5">
            SISTEMA OPERACIONAL
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-8 gap-1.5 text-xs font-bold border-slate-200 hover:bg-slate-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Stats Grid - Alta Densidade */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total de Logs</p>
              <p className="text-lg font-black text-slate-600">{logsQuery.data?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Erros Críticos</p>
              <p className="text-lg font-black text-red-600">{errosQuery.data?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alertas Ativos</p>
              <p className="text-lg font-black text-orange-600">{alertasQuery.data?.length || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sinistros Abertos</p>
              <p className="text-lg font-black text-green-600">{stats?.sinistrosAbertos || 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Alertas Recentes - Compacto */}
        <Card className="lg:col-span-1 border-none shadow-sm flex flex-col">
          <CardHeader className="p-3 border-b">
            <CardTitle className="text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Alertas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 flex-1">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 pr-3">
                {alertasQuery.data && alertasQuery.data.length > 0 ? (
                  alertasQuery.data.slice(0, 8).map((alerta) => (
                    <div key={alerta.id} className="p-2 rounded-lg border bg-slate-50/50 hover:bg-white transition-colors group">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-[11px] text-slate-900 group-hover:text-blue-600 transition-colors">{alerta.titulo}</p>
                        <Badge className={`text-[9px] h-4 px-1.5 border-0 font-bold ${
                          alerta.severidade === 'critico' ? 'bg-red-100 text-red-700' :
                          alerta.severidade === 'aviso' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {alerta.severidade?.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{alerta.descricao}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <CheckCircle className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-[10px] font-bold">Nenhum alerta ativo</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Logs do Sistema - Alta Densidade */}
        <Card className="lg:col-span-2 border-none shadow-sm flex flex-col">
          <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-xs font-bold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-500" />
                Logs do Sistema
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-48">
                <Search className="absolute left-2 top-2 h-3 w-3 text-slate-400" />
                <Input
                  placeholder="Filtrar logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-7 pl-7 text-[10px] bg-slate-50 border-0 focus-visible:ring-1"
                />
              </div>
              <div className="flex bg-slate-100 p-0.5 rounded-md">
                {["all", "info", "warning", "error"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilterLevel(level as LogLevel | "all")}
                    className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${
                      filterLevel === level 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {level.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-[400px]">
              <div className="divide-y divide-slate-100">
                {logsQuery.isLoading ? (
                  <div className="p-10 text-center text-[11px] font-bold text-slate-400">Carregando logs...</div>
                ) : filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-2.5 hover:bg-slate-50/80 transition-colors flex items-start gap-3`}
                    >
                      <div className="mt-0.5">{getLevelIcon(log.nivel || 'info')}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
                              {log.tipoLog || 'SYSTEM'}
                            </span>
                            <Badge variant="outline" className={`text-[8px] h-3.5 px-1 border-0 font-black ${getLevelColor(log.nivel || 'info')}`}>
                              {log.nivel?.toUpperCase()}
                            </Badge>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 font-mono">
                            {log.criadoEm ? new Date(log.criadoEm).toLocaleTimeString("pt-BR") : ""}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium leading-tight">{log.mensagem}</p>
                        {log.stackTrace && (
                          <details className="mt-1.5">
                            <summary className="text-[9px] font-bold text-blue-500 cursor-pointer hover:underline">
                              VER STACK TRACE
                            </summary>
                            <pre className="text-[9px] bg-slate-900 text-slate-300 p-2 rounded-md mt-1.5 overflow-x-auto font-mono leading-relaxed border border-slate-800">
                              {log.stackTrace}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-[11px] font-bold text-slate-400">Nenhum log encontrado</div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
