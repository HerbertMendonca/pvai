import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Filter, RefreshCw, Bell } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const SETORES = [
  { id: "todos", label: "Todos os Setores" },
  { id: "comercial", label: "Comercial" },
  { id: "financeiro", label: "Financeiro" },
  { id: "eventos", label: "Eventos (Sinistros)" },
  { id: "rastreamento", label: "Rastreamento" },
  { id: "cadastro", label: "Cadastro" },
  { id: "marketing", label: "Marketing" },
];

export default function Alerts() {
  const { user } = useAuth();
  const [selectedSetor, setSelectedSetor] = useState("todos");
  
  const alertsQuery = trpc.alerts.getAll.useQuery({
    idEmpresa: user?.id_empresa || 1,
    setor: selectedSetor,
    limit: 50,
  });

  const markAsReadMutation = trpc.alerts.markAsRead.useMutation({
    onSuccess: () => alertsQuery.refetch(),
  });

  const resolveMutation = trpc.alerts.resolve.useMutation({
    onSuccess: () => alertsQuery.refetch(),
  });

  const getSeveridadeIcon = (severidade: string) => {
    switch (severidade) {
      case "critico":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "aviso":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getSeveridadeColor = (severidade: string) => {
    switch (severidade) {
      case "critico":
        return "bg-red-50 border-red-200";
      case "aviso":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-8 h-8 text-primary" />
            Central de Alertas
          </h1>
          <p className="text-gray-600 mt-1">Monitore anomalias e eventos críticos por setor</p>
        </div>
        <Button
          variant="outline"
          onClick={() => alertsQuery.refetch()}
          className="gap-2"
          disabled={alertsQuery.isFetching}
        >
          <RefreshCw className={`w-4 h-4 ${alertsQuery.isFetching ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      {/* Setores Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {SETORES.map((setor) => (
          <Button
            key={setor.id}
            variant={selectedSetor === setor.id ? "default" : "outline"}
            onClick={() => setSelectedSetor(setor.id)}
            size="sm"
            className="whitespace-nowrap"
          >
            {setor.label}
          </Button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="grid gap-4">
        {alertsQuery.isLoading ? (
          <div className="py-12 text-center text-gray-500">Carregando alertas...</div>
        ) : alertsQuery.data && alertsQuery.data.length > 0 ? (
          alertsQuery.data.map((alerta) => (
            <Card key={alerta.id} className={`${getSeveridadeColor(alerta.severidade)} transition-all hover:shadow-md`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getSeveridadeIcon(alerta.severidade)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900">{alerta.titulo}</h3>
                          <Badge variant="secondary" className="capitalize">
                            {alerta.setor}
                          </Badge>
                          {alerta.lido && (
                            <Badge variant="outline" className="text-gray-500">Lido</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{alerta.descricao}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs text-gray-500 block">
                          {new Date(alerta.created_at!).toLocaleString("pt-BR")}
                        </span>
                        <span className="text-xs font-medium text-gray-600 block mt-1">
                          Origem: {alerta.origem}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      {!alerta.lido && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => markAsReadMutation.mutate({ id: alerta.id })}
                        >
                          Marcar como lido
                        </Button>
                      )}
                      {!alerta.resolvido ? (
                        <Button 
                          variant="default" 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => resolveMutation.mutate({ id: alerta.id, userId: user?.id || 1 })}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Resolver
                        </Button>
                      ) : (
                        <div className="flex items-center text-green-700 text-sm font-medium px-2 py-1 bg-green-100 rounded">
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Resolvido
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <CheckCircle2 className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Tudo limpo por aqui!</h3>
              <p className="text-gray-500">Nenhum alerta pendente para o setor selecionado.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
