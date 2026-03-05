import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Calendar as CalendarIcon, Search, Filter, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function Agendas() {
  const utils = trpc.useUtils();
  const { data: agendas, isLoading } = trpc.agendas.list.useQuery();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    cor: "#3b82f6"
  });

  const createMutation = trpc.agendas.create.useMutation({
    onSuccess: () => {
      toast.success("Agenda criada com sucesso!");
      setIsCreateOpen(false);
      setFormData({ nome: "", descricao: "", cor: "#3b82f6" });
      utils.agendas.list.invalidate();
    },
    onError: (err) => toast.error(err.message)
  });

  const updateMutation = trpc.agendas.update.useMutation({
    onSuccess: () => {
      toast.success("Agenda atualizada com sucesso!");
      setEditingAgenda(null);
      utils.agendas.list.invalidate();
    },
    onError: (err) => toast.error(err.message)
  });

  const deleteMutation = trpc.agendas.delete.useMutation({
    onSuccess: () => {
      toast.success("Agenda excluída com sucesso!");
      utils.agendas.list.invalidate();
    },
    onError: (err) => toast.error(err.message)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAgenda) {
      updateMutation.mutate({ id: editingAgenda.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openEdit = (agenda: any) => {
    setEditingAgenda(agenda);
    setFormData({
      nome: agenda.nome,
      descricao: agenda.descricao || "",
      cor: agenda.cor || "#3b82f6"
    });
  };

  const filteredAgendas = agendas?.filter(a => 
    a.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 bg-slate-50/50 min-h-screen">
        {/* Header Compacto */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              Gerenciamento de Agendas
            </h2>
            <p className="text-xs text-slate-500">Organize e controle os compromissos da sua equipe</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Buscar agendas..."
                className="pl-8 h-9 text-xs w-[200px] bg-white border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs border-slate-200 bg-white">
              <Filter className="h-3.5 w-3.5" /> Filtrar
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-9 gap-1.5 text-xs bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-3.5 w-3.5" /> Nova Agenda
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-lg">Criar Nova Agenda</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3 py-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="nome" className="text-xs">Nome da Agenda</Label>
                    <Input 
                      id="nome" 
                      className="h-9 text-sm"
                      value={formData.nome} 
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      placeholder="Ex: Reuniões de Diretoria"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="descricao" className="text-xs">Descrição</Label>
                    <Input 
                      id="descricao" 
                      className="h-9 text-sm"
                      value={formData.descricao} 
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      placeholder="Opcional"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cor" className="text-xs">Cor de Identificação</Label>
                    <div className="flex gap-3 items-center">
                      <Input 
                        id="cor" 
                        type="color" 
                        className="w-10 h-9 p-1 border-slate-200"
                        value={formData.cor} 
                        onChange={(e) => setFormData({...formData, cor: e.target.value})}
                      />
                      <span className="text-xs font-mono text-slate-500 uppercase">{formData.cor}</span>
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit" className="h-9 text-xs" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "Criando..." : "Criar Agenda"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Grid de Agendas - Alta Densidade */}
        {isLoading ? (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse h-24 bg-slate-100 border-0" />
            ))}
          </div>
        ) : filteredAgendas?.length === 0 ? (
          <Card className="border-dashed border-2 bg-white/50">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <div className="bg-slate-100 p-3 rounded-full mb-3">
                <CalendarIcon className="h-6 w-6 text-slate-400" />
              </div>
              <CardTitle className="text-sm font-bold text-slate-700">Nenhuma agenda encontrada</CardTitle>
              <CardDescription className="text-xs">Comece criando sua primeira agenda para organizar seus compromissos.</CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAgendas?.map((agenda) => (
              <Card key={agenda.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all bg-white">
                <div className="h-1 w-full" style={{ backgroundColor: agenda.cor }} />
                <CardHeader className="p-3 pb-1">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-bold text-slate-900 truncate">{agenda.nome}</CardTitle>
                      <CardDescription className="text-[10px] text-slate-500 mt-0.5 truncate">
                        {agenda.descricao || "Sem descrição"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-slate-400 hover:text-blue-600" 
                        onClick={() => openEdit(agenda)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-slate-400 hover:text-red-600"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja excluir esta agenda?")) {
                            deleteMutation.mutate({ id: agenda.id });
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-2 flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px] font-medium bg-slate-100 text-slate-600 border-0">
                    Ativa
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono uppercase">{agenda.cor}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
