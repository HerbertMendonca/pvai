import { useState } from "react";
import { useAlerts } from "@/_core/hooks/useAlerts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Filter, RefreshCw, Bell, Search, MoreVertical, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

const SETORES = [
  { id: "todos", label: "Todos" },
  { id: "comercial", label: "Comercial" },
  { id: "financeiro", label: "Financeiro" },
  { id: "eventos", label: "Eventos" },
  { id: "rastreamento", label: "Rastreamento" },
  { id: "cadastro", label: "Cadastro" },
  { id: "marketing", label: "Marketing" },
  { id: "cobranca", label: "Cobrança" },
];

export default function Alerts() {
  const [selectedSetor, setSelectedSetor] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const { alerts, loading, refetch, markAsResolved } = useAlerts();
  
  const handleResolve = async (id: number) => {
    try {
      await markAsResolved(id);
    } catch (error) {
      console.error("Erro ao resolver alerta:", error);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const displayData = (selectedSetor === "todos" 
    ? alerts 
    : alerts.filter(a => a.setor === selectedSetor)
  ).filter(a => 
    a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeveridadeIcon = (severidade: string) => {
    switch (severidade) {
      case "critico":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "aviso":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getSeveridadeStyles = (severidade: string) => {
    switch (severidade) {
      case "critico":
        return "bg-red-50/50 border-red-100 hover:bg-red-50";
      case "aviso":
        return "bg-amber-50/50 border-amber-100 hover:bg-amber-50";
      default:
        return "bg-blue-50/50 border-blue-100 hover:bg-blue-50";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 bg-slate-50/50 min-h-screen">
      {/* Header Compacto */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Central de Alertas
          </h1>
          <p className="text-xs text-slate-500">Monitore anomalias e eventos críticos em tempo real</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Buscar alertas..."
              className="pl-8 h-9 text-xs w-[200px] bg-white border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs border-slate-200 bg-white"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtros de Setores - Compactos */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {SETORES.map((setor) => (
          <button
            key={setor.id}
            onClick={() => setSelectedSetor(setor.id)}
            className={`px-3 py-1.5 text-[11px] font-semibold rounded-full transition-all whitespace-nowrap border ${
              selectedSetor === setor.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {setor.label}
          </button>
        ))}
      </div>

      {/* Lista de Alertas - Alta Densidade */}
      <div className="grid gap-2">
        {loading ? (
          <Card className="border-dashed border-2 bg-white/50">
            <CardContent className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 mb-3">
                <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Carregando alertas...</h3>
              <p className="text-xs text-slate-500">Por favor, aguarde.</p>
            </CardContent>
          </Card>
        ) : displayData.length > 0 ? (
          displayData.map((alerta) => (
            <Card key={alerta.id} className={`border shadow-none transition-all ${getSeveridadeStyles(alerta.severidade)}`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">{getSeveridadeIcon(alerta.severidade)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900">{alerta.titulo}</h3>
                          <Badge variant="secondary" className="text-[9px] h-4 px-1.5 font-bold uppercase bg-white/80 text-slate-600 border-slate-200">
                            {alerta.setor}
                          </Badge>
                          {alerta.lido && (
                            <span className="text-[9px] font-medium text-slate-400">Lido</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{alerta.descricao}</p>
                      </div>
                      
                      <div className="text-right flex-shrink-0 space-y-1">
                        <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(alerta.created_at).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 block">
                          {alerta.origem}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-slate-200/50">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-7 text-[10px] font-bold text-slate-500 hover:text-slate-700"
                      >
                        Ver Detalhes
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="h-7 text-[10px] font-bold bg-green-600 hover:bg-green-700 text-white px-3"
                        onClick={() => handleResolve(alerta.id)}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1.5" />
                        Resolver
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-2 bg-white/50">
            <CardContent className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50 mb-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Tudo limpo por aqui!</h3>
              <p className="text-xs text-slate-500">Nenhum alerta pendente para os critérios selecionados.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
