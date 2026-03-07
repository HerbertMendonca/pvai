import { useState } from "react";
import { useWhatsAppCampaigns } from "@/_core/hooks/useWhatsAppCampaigns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Calendar, Users, Clock, CheckCircle2, AlertCircle, Trash2, Edit, Eye, Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const LISTAS_DISPONÍVEIS = [
  { id: "todos", label: "Todos os Clientes", count: 1250 },
  { id: "ativos", label: "Clientes Ativos", count: 890 },
  { id: "inadimplentes", label: "Inadimplentes (>30 dias)", count: 145 },
  { id: "proxima-renovacao", label: "Próxima Renovação (30 dias)", count: 320 },
  { id: "cancelamento-risco", label: "Risco de Cancelamento", count: 67 },
  { id: "novos-clientes", label: "Novos Clientes (últimos 30 dias)", count: 89 },
  { id: "vip", label: "Clientes VIP", count: 45 },
];

export default function WhatsAppDispatcher() {
  const { campaigns, loading, createCampaign, updateCampaign, deleteCampaign } = useWhatsAppCampaigns();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    mensagem: "",
    lista_segmentada: "todos",
    data_agendada: "",
    hora_agendada: "09:00",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.mensagem || !formData.data_agendada) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const listaInfo = LISTAS_DISPONÍVEIS.find(l => l.id === formData.lista_segmentada);
    
    try {
      if (editingId) {
        await updateCampaign(editingId, {
          ...formData,
          total_contatos: listaInfo?.count || 0,
        } as any);
        setEditingId(null);
      } else {
        await createCampaign({
          titulo: formData.titulo,
          descricao: formData.descricao,
          mensagem: formData.mensagem,
          lista_segmentada: formData.lista_segmentada,
          data_agendada: formData.data_agendada,
          hora_agendada: formData.hora_agendada,
          status: "agendado",
          total_contatos: listaInfo?.count || 0,
        } as any);
      }

      setFormData({ titulo: "", descricao: "", mensagem: "", lista_segmentada: "todos", data_agendada: "", hora_agendada: "09:00" });
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao salvar campanha:", error);
      alert("Erro ao salvar campanha");
    }
  };

  const handleEdit = (campaign: any) => {
    setFormData({
      titulo: campaign.titulo,
      descricao: campaign.descricao || "",
      mensagem: campaign.mensagem,
      lista_segmentada: campaign.lista_segmentada,
      data_agendada: campaign.data_agendada,
      hora_agendada: campaign.hora_agendada,
    });
    setEditingId(campaign.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta campanha?")) {
      try {
        await deleteCampaign(id);
      } catch (error) {
        console.error("Erro ao deletar campanha:", error);
        alert("Erro ao deletar campanha");
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "enviado":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "enviando":
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      case "agendado":
        return <Calendar className="w-4 h-4 text-slate-600" />;
      case "erro":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      enviado: "Enviado",
      enviando: "Enviando",
      agendado: "Agendado",
      erro: "Erro",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "enviado":
        return "bg-green-50 text-green-700 border-green-100";
      case "enviando":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "agendado":
        return "bg-slate-50 text-slate-700 border-slate-100";
      case "erro":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  return (
    <div className="p-4 space-y-4 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            Disparador WhatsApp
          </h1>
          <p className="text-xs text-slate-500">Envie mensagens em massa agendadas para suas listas de contatos</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ titulo: "", descricao: "", mensagem: "", lista_segmentada: "todos", data_agendada: "", hora_agendada: "09:00" });
          }}
          className="bg-green-600 hover:bg-green-700 text-white gap-2"
          size="sm"
        >
          <Send className="w-4 h-4" />
          {showForm ? "Cancelar" : "Nova Campanha"}
        </Button>
      </div>

      {/* Formulário de Nova Campanha */}
      {showForm && (
        <Card className="border-green-200 bg-green-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">{editingId ? "Editar Campanha" : "Criar Nova Campanha"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Título da Campanha *</label>
                  <Input
                    placeholder="Ex: Lembrete de Renovação"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Lista de Contatos *</label>
                  <select
                    value={formData.lista_segmentada}
                    onChange={(e) => setFormData({ ...formData, lista_segmentada: e.target.value })}
                    className="w-full h-8 px-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  >
                    {LISTAS_DISPONÍVEIS.map(lista => (
                      <option key={lista.id} value={lista.id}>
                        {lista.label} ({lista.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Descrição</label>
                <Input
                  placeholder="Descrição interna da campanha (opcional)"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mensagem *</label>
                <Textarea
                  placeholder="Digite sua mensagem. Use {{nome}}, {{dias}}, {{status}} para variáveis dinâmicas."
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  className="h-20 text-xs resize-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">Variáveis disponíveis: {{nome}}, {{dias}}, {{status}}, {{telefone}}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Data de Agendamento *</label>
                  <Input
                    type="date"
                    value={formData.data_agendada}
                    onChange={(e) => setFormData({ ...formData, data_agendada: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Hora de Envio *</label>
                  <Input
                    type="time"
                    value={formData.hora_agendada}
                    onChange={(e) => setFormData({ ...formData, hora_agendada: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="text-xs h-8"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                >
                  {editingId ? "Atualizar Campanha" : "Agendar Envio"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Campanhas */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-slate-900">Campanhas Recentes</h2>
        {loading ? (
          <Card className="border-slate-200">
            <CardContent className="py-8 text-center">
              <Loader className="w-5 h-5 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-600">Carregando campanhas...</p>
            </CardContent>
          </Card>
        ) : campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <Card key={campaign.id} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(campaign.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{campaign.titulo}</h3>
                        <p className="text-xs text-slate-600 line-clamp-1">{campaign.mensagem}</p>
                      </div>
                      <Badge className={`text-[10px] h-5 px-2 border ${getStatusColor(campaign.status)}`}>
                        {getStatusLabel(campaign.status)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2 text-[10px] text-slate-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{campaign.total_contatos} contatos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span>{campaign.enviados} enviados</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{campaign.data_agendada} às {campaign.hora_agendada}</span>
                      </div>
                      {campaign.erros > 0 && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          <span>{campaign.erros} erros</span>
                        </div>
                      )}
                    </div>

                    {campaign.status === "enviando" || campaign.status === "enviado" ? (
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                        <div
                          className="bg-green-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${(campaign.enviados / campaign.total_contatos) * 100}%` }}
                        />
                      </div>
                    ) : null}

                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[10px] text-slate-600 hover:text-slate-900"
                        onClick={() => alert(`Detalhes da campanha: ${campaign.titulo}`)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Detalhes
                      </Button>
                      {campaign.status === "agendado" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[10px] text-blue-600 hover:text-blue-900"
                            onClick={() => handleEdit(campaign)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[10px] text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(campaign.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Deletar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-2 bg-white/50">
            <CardContent className="py-8 text-center">
              <MessageCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">Nenhuma campanha criada</h3>
              <p className="text-xs text-slate-500">Comece criando sua primeira campanha de WhatsApp</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
