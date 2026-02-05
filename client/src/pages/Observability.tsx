import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Info, AlertTriangle, Search, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";

type LogLevel = "info" | "warning" | "error" | "critical";

export default function Observability() {
  const [idEmpresa] = useState(1); // TODO: Get from user context
  const [filterLevel, setFilterLevel] = useState<LogLevel | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

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
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getLevelColor = (nivel: string) => {
    switch (nivel) {
      case "critical":
        return "bg-red-50 border-red-200";
      case "error":
        return "bg-orange-50 border-orange-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const filteredLogs = logsQuery.data?.filter((log) => {
    const matchesLevel = filterLevel === "all" || log.nivel === filterLevel;
    const matchesSearch = (log.mensagem || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Observabilidade</h1>
          <p className="text-gray-600 mt-1">Monitore logs, alertas e saúde do sistema</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            logsQuery.refetch();
            alertasQuery.refetch();
          }}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total de Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{logsQuery.data?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Erros</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{errosQuery.data?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{alertasQuery.data?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">Operacional</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {alertasQuery.data && alertasQuery.data.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Alertas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertasQuery.data.slice(0, 5).map((alerta) => (
              <div key={alerta.id} className="border-l-4 border-orange-600 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{alerta.titulo}</p>
                    <p className="text-xs text-gray-600 mt-1">{alerta.descricao}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    alerta.severidade === 'critica' ? 'bg-red-200 text-red-800' :
                    alerta.severidade === 'alta' ? 'bg-orange-200 text-orange-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {alerta.severidade}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Logs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Logs do Sistema</CardTitle>
          <CardDescription>Últimos 100 eventos registrados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar nos logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {["all", "info", "warning", "error", "critical"].map((level) => (
                <Button
                  key={level}
                  variant={filterLevel === level ? "default" : "outline"}
                  onClick={() => setFilterLevel(level as LogLevel | "all")}
                  size="sm"
                  className="capitalize"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>

          {/* Logs List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logsQuery.isLoading ? (
              <p className="text-center text-gray-500 py-4">Carregando logs...</p>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`border rounded-lg p-3 ${getLevelColor(log.nivel || 'info')}`}
                >
                  <div className="flex items-start gap-3">
                    {getLevelIcon(log.nivel || 'info')}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                          <p className="font-medium text-sm text-gray-900">{log.tipoLog || 'Log'}</p>
                          <span className="text-xs text-gray-600 flex-shrink-0">
                          {log.criadoEm ? new Date(log.criadoEm).toLocaleTimeString("pt-BR") : ""}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{log.mensagem || 'Sem mensagem'}</p>
                      {log.stackTrace && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-900">
                            Ver detalhes
                          </summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                            {log.stackTrace}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Nenhum log encontrado</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
