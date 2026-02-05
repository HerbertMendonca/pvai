import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Plus, Trash2, Edit2, Save } from "lucide-react";

interface Empresa {
  id: number;
  nome: string;
  nicho: string;
  ativo: boolean;
}

interface Webhook {
  id: number;
  nome: string;
  url: string;
  tipo: string;
  ativo: boolean;
}

export default function Configuration() {
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);

  // Sample data
  const empresas: Empresa[] = [
    { id: 1, nome: "Empresa Principal", nicho: "seguros", ativo: true },
    { id: 2, nome: "Filial São Paulo", nicho: "ecommerce", ativo: true },
  ];

  const webhooks: Webhook[] = [
    {
      id: 1,
      nome: "Coleta de Dados",
      url: "https://n8n.example.com/webhook/coleta",
      tipo: "coleta",
      ativo: true,
    },
    {
      id: 2,
      nome: "Padronização",
      url: "https://n8n.example.com/webhook/padronizacao",
      tipo: "padronizacao",
      ativo: true,
    },
    {
      id: 3,
      nome: "Agregação Diária",
      url: "https://n8n.example.com/webhook/agregacao",
      tipo: "agregacao",
      ativo: false,
    },
  ];

  const agents = [
    { id: 1, nome: "Agent KPI", tipo: "kpi", ativo: true },
    { id: 2, nome: "Agent Analytics", tipo: "analytics", ativo: true },
    { id: 3, nome: "Agent CEO", tipo: "ceo", ativo: true },
    { id: 4, nome: "Agent Risco", tipo: "risco", ativo: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie empresas, webhooks e integrações</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {["Empresas", "Webhooks", "Agents"].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 border-b-2 font-medium text-sm transition-colors"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Empresas Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Empresas
            </CardTitle>
            <CardDescription>Gerencie suas empresas e nichos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {empresas.map((empresa) => (
              <button
                key={empresa.id}
                onClick={() => setSelectedEmpresa(empresa)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                  selectedEmpresa?.id === empresa.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-medium text-sm">{empresa.nome}</p>
                <p className="text-xs text-gray-600 mt-1">Nicho: {empresa.nicho}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      empresa.ativo ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-xs text-gray-600">
                    {empresa.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </button>
            ))}
            <Button className="w-full gap-2" variant="outline">
              <Plus className="w-4 h-4" />
              Nova Empresa
            </Button>
          </CardContent>
        </Card>

        {/* Empresa Details */}
        {selectedEmpresa && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Detalhes da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome</label>
                <Input
                  defaultValue={selectedEmpresa.nome}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Nicho de Negócio</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>seguros</option>
                  <option>ecommerce</option>
                  <option>saas</option>
                  <option>agencia</option>
                  <option>outro</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Cores Primárias</label>
                <div className="flex gap-2 mt-1">
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue="#3b82f6" className="w-10 h-10 rounded" />
                    <span className="text-sm">Primária</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue="#10b981" className="w-10 h-10 rounded" />
                    <span className="text-sm">Secundária</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Salvar
                </Button>
                <Button variant="outline">Cancelar</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Webhooks Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Webhooks n8n</CardTitle>
              <CardDescription>Configure suas automações e workflows</CardDescription>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Webhook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{webhook.nome}</p>
                  <p className="text-xs text-gray-600 mt-1 font-mono break-all">{webhook.url}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {webhook.tipo}
                    </span>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          webhook.ativo ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      <span className="text-xs text-gray-600">
                        {webhook.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agents Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuração de Agents</CardTitle>
          <CardDescription>Customize os prompts e comportamento de cada agente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{agent.nome}</p>
                    <p className="text-xs text-gray-600 mt-1">Tipo: {agent.tipo}</p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      agent.ativo ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3 gap-2">
                  <Edit2 className="w-4 h-4" />
                  Editar Prompt
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
