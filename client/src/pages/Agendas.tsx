import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

export default function Agendas() {
  const utils = trpc.useUtils();
  const { data: agendas, isLoading } = trpc.agendas.list.useQuery();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<any>(null);
  
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

  return (
    <DashboardLayout title="Gerenciamento de Agendas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Agendas</h2>
            <p className="text-muted-foreground">
              Crie e gerencie as agendas da sua organização.
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Nova Agenda
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Agenda</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Agenda</Label>
                  <Input 
                    id="nome" 
                    value={formData.nome} 
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: Reuniões de Diretoria"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input 
                    id="descricao" 
                    value={formData.descricao} 
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Opcional"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cor">Cor de Identificação</Label>
                  <div className="flex gap-2 items-center">
                    <Input 
                      id="cor" 
                      type="color" 
                      className="w-12 h-10 p-1"
                      value={formData.cor} 
                      onChange={(e) => setFormData({...formData, cor: e.target.value})}
                    />
                    <span className="text-sm text-muted-foreground">{formData.cor}</span>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Criando..." : "Criar Agenda"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse h-32 bg-muted" />
            ))}
          </div>
        ) : agendas?.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle>Nenhuma agenda encontrada</CardTitle>
              <CardDescription>Comece criando sua primeira agenda para organizar seus compromissos.</CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agendas?.map((agenda) => (
              <Card key={agenda.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: agenda.cor }}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{agenda.nome}</CardTitle>
                    <div className="flex gap-1">
                      <Dialog open={editingAgenda?.id === agenda.id} onOpenChange={(open) => !open && setEditingAgenda(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(agenda)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Agenda</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-nome">Nome da Agenda</Label>
                              <Input 
                                id="edit-nome" 
                                value={formData.nome} 
                                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-descricao">Descrição</Label>
                              <Input 
                                id="edit-descricao" 
                                value={formData.descricao} 
                                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-cor">Cor de Identificação</Label>
                              <div className="flex gap-2 items-center">
                                <Input 
                                  id="edit-cor" 
                                  type="color" 
                                  className="w-12 h-10 p-1"
                                  value={formData.cor} 
                                  onChange={(e) => setFormData({...formData, cor: e.target.value})}
                                />
                                <span className="text-sm text-muted-foreground">{formData.cor}</span>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm("Tem certeza que deseja excluir esta agenda?")) {
                            deleteMutation.mutate({ id: agenda.id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{agenda.descricao || "Sem descrição"}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
