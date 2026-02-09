import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Webhook, Bot, Key, Save, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Agent {
  id: string;
  name: string;
  role: string;
  scope: string;
  functions: string;
  llm: "openai" | "claude" | "gemini";
  enabled: boolean;
}

interface WhatsAppAccount {
  id: string;
  name: string;
  token: string;
}

export default function Configuration() {
  const [activeTab, setActiveTab] = useState("empresa");
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  // Mutations
  const batchSaveConfigsMutation = trpc.configuration.batchSaveConfigs.useMutation();
  const saveSystemConfigMutation = trpc.configuration.saveSystemConfig.useMutation();
  const batchSaveAgentsMutation = trpc.configuration.batchSaveAgents.useMutation();

  // Empresa State
  const [empresa, setEmpresa] = useState({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  // Webhooks State
  const [webhooks, setWebhooks] = useState([
    { id: "1", name: "Webhook Associados", url: "", enabled: true },
    { id: "2", name: "Webhook Sinistros", url: "", enabled: true },
    { id: "3", name: "Webhook Mensalidades", url: "", enabled: false },
  ]);

  // Agents State
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "ana",
      name: "Ana - Analista de Risco",
      role: "Análise de Risco",
      scope: "Identificar padrões de fraude, avaliar perfis de risco de associados e sinistros",
      functions: "Análise de histórico, detecção de anomalias, scoring de risco",
      llm: "openai",
      enabled: true,
    },
    {
      id: "carlos",
      name: "Carlos - Gestor de Sinistros",
      role: "Gestão de Sinistros",
      scope: "Processar, validar e acompanhar sinistros desde abertura até pagamento",
      functions: "Triagem de sinistros, validação de documentos, cálculo de indenizações",
      llm: "claude",
      enabled: true,
    },
    {
      id: "fernanda",
      name: "Fernanda - Analista Financeira",
      role: "Análise Financeira",
      scope: "Monitorar fluxo de caixa, inadimplência e saúde financeira da associação",
      functions: "Análise de receitas/despesas, projeções, alertas de inadimplência",
      llm: "gemini",
      enabled: true,
    },
    {
      id: "roberto",
      name: "Roberto - Especialista Comercial",
      role: "Comercial e Vendas",
      scope: "Analisar conversão de leads, performance comercial e oportunidades de crescimento",
      functions: "Análise de funil, segmentação de leads, recomendações de ações comerciais",
      llm: "openai",
      enabled: true,
    },
    {
      id: "juliana",
      name: "Juliana - Analista Operacional",
      role: "Operações",
      scope: "Otimizar processos operacionais e identificar gargalos",
      functions: "Análise de SLA, eficiência de processos, automação de tarefas",
      llm: "claude",
      enabled: true,
    },
    {
      id: "pedro",
      name: "Pedro - Especialista em Atendimento",
      role: "Atendimento ao Cliente",
      scope: "Analisar satisfação, tempo de resposta e qualidade do atendimento",
      functions: "Análise de tickets, NPS, sugestões de melhoria no atendimento",
      llm: "openai",
      enabled: true,
    },
    {
      id: "mariana",
      name: "Mariana - Analista de Dados",
      role: "Business Intelligence",
      scope: "Gerar insights estratégicos a partir de dados consolidados",
      functions: "Dashboards, relatórios personalizados, análise preditiva",
      llm: "gemini",
      enabled: true,
    },
    {
      id: "lucas",
      name: "Lucas - Gestor de Cobrança",
      role: "Cobrança e Recuperação",
      scope: "Gerenciar inadimplência e estratégias de recuperação de crédito",
      functions: "Priorização de cobranças, negociação, análise de risco de churn",
      llm: "claude",
      enabled: true,
    },
    {
      id: "camila",
      name: "Camila - Especialista em Marketing",
      role: "Marketing e Comunicação",
      scope: "Analisar campanhas, engajamento e ROI de ações de marketing",
      functions: "Análise de campanhas, segmentação de público, recomendações de conteúdo",
      llm: "gemini",
      enabled: true,
    },
    {
      id: "ricardo",
      name: "Ricardo - Analista de Compliance",
      role: "Compliance e Regulatório",
      scope: "Garantir conformidade com regulamentações e boas práticas do setor",
      functions: "Auditoria de processos, alertas regulatórios, relatórios de compliance",
      llm: "openai",
      enabled: true,
    },
    {
      id: "alexandre",
      name: "Alexandre - Presidente",
      role: "Gestão Estratégica",
      scope: "Visão holística do negócio, decisões estratégicas e direcionamento da associação",
      functions: "Análise estratégica, tomada de decisão, planejamento de longo prazo",
      llm: "claude",
      enabled: true,
    },
  ]);

  // API Keys State
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    claude: "",
    gemini: "",
    wuzapi_url: "",
    wuzapi_admin_token: "",
  });

  // WhatsApp Accounts State
  const [whatsappAccounts, setWhatsAppAccount] = useState<WhatsAppAccount[]>([
    { id: "1", name: "Atendimento Principal", token: "" },
    { id: "2", name: "Suporte Técnico", token: "" },
  ]);

  const updateEmpresa = (field: string, value: string) => {
    setEmpresa({ ...empresa, [field]: value });
  };

  const updateWebhook = (id: string, field: string, value: any) => {
    setWebhooks(webhooks.map(wh => (wh.id === id ? { ...wh, [field]: value } : wh)));
  };

  const updateAgent = (id: string, field: keyof Agent, value: any) => {
    setAgents(agents.map(agent => (agent.id === id ? { ...agent, [field]: value } : agent)));
  };

  const saveConfiguration = async () => {
    console.log("[DEBUG] saveConfiguration chamada!");
    try {
      const toastId = toast.loading("Salvando configurações...");
      // Save API Keys
      const configsToSave = [
        { key: "openai_api_key", value: apiKeys.openai, category: "ai", encrypted: true },
        { key: "claude_api_key", value: apiKeys.claude, category: "ai", encrypted: true },
        { key: "gemini_api_key", value: apiKeys.gemini, category: "ai", encrypted: true },
        { key: "wuzapi_url", value: apiKeys.wuzapi_url, category: "whatsapp" },
        { key: "wuzapi_admin_token", value: apiKeys.wuzapi_admin_token, category: "whatsapp", encrypted: true },
        { key: "empresa_nome", value: empresa.nome, category: "empresa" },
        { key: "empresa_cnpj", value: empresa.cnpj, category: "empresa" },
        { key: "empresa_email", value: empresa.email, category: "empresa" },
        { key: "empresa_telefone", value: empresa.telefone, category: "empresa" },
        { key: "empresa_endereco", value: empresa.endereco, category: "empresa" },
      ];

      await batchSaveConfigsMutation.mutateAsync(configsToSave.filter(c => c.value));

      // Save WhatsApp accounts
      for (const account of whatsappAccounts) {
        if (account.token) {
          await saveSystemConfigMutation.mutateAsync({
            key: `whatsapp_account_${account.id}`,
            value: JSON.stringify({ name: account.name, token: account.token }),
            category: "whatsapp",
            encrypted: true,
          });
        }
      }

      // Save agents
      const agentsToSave = agents.map(agent => ({
        code: agent.id,
        name: agent.name,
        description: agent.role,
        provider: agent.llm,
        model: agent.llm === "openai" ? "gpt-4" : agent.llm === "claude" ? "claude-3-5-sonnet-20241022" : "gemini-2.0-flash-exp",
        systemPrompt: `${agent.scope}\n\nFunções: ${agent.functions}`,
        status: agent.enabled ? "ativo" as const : "inativo" as const,
      }));

      await batchSaveAgentsMutation.mutateAsync(agentsToSave);

      toast.dismiss(toastId);
      toast.success("✅ Configurações salvas com sucesso!", {
        description: "Todas as chaves e configurações foram armazenadas no banco de dados.",
      });
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.dismiss(toastId);
      toast.error("❌ Erro ao salvar configurações", {
        description: error instanceof Error ? error.message : "Verifique o console para mais detalhes.",
      });
    }
  };

  const isSaving = batchSaveConfigsMutation.isPending || saveSystemConfigMutation.isPending || batchSaveAgentsMutation.isPending;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">Gerencie as configurações do sistema</p>
        </div>
        <Button onClick={() => { console.log('[INLINE] Botão clicado!'); saveConfiguration(); }} disabled={isSaving} className="gap-2">
          <Save className="w-4 h-4" />
          {isSaving ? "Salvando..." : "Salvar Todas"}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="empresa" className="gap-2">
            <Building2 className="w-4 h-4" />
            Empresa
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="gap-2">
            <Webhook className="w-4 h-4" />
            Webhooks
          </TabsTrigger>
          <TabsTrigger value="agents" className="gap-2">
            <Bot className="w-4 h-4" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="chaves" className="gap-2">
            <Key className="w-4 h-4" />
            Chaves
          </TabsTrigger>
        </TabsList>

        {/* Aba Empresa */}
        <TabsContent value="empresa">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Empresa</CardTitle>
              <CardDescription>Informações cadastrais da empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Empresa</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: NEX1 Proteção Veicular"
                    value={empresa.nome}
                    onChange={(e) => updateEmpresa("nome", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={empresa.cnpj}
                    onChange={(e) => updateEmpresa("cnpj", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contato@empresa.com"
                    value={empresa.email}
                    onChange={(e) => updateEmpresa("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="(00) 0000-0000"
                    value={empresa.telefone}
                    onChange={(e) => updateEmpresa("telefone", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Textarea
                  id="endereco"
                  placeholder="Rua, número, bairro, cidade, estado, CEP"
                  value={empresa.endereco}
                  onChange={(e) => updateEmpresa("endereco", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Webhooks */}
        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhooks de Integração</CardTitle>
              <CardDescription>Configure os webhooks para receber dados do sistema principal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Switch
                    checked={webhook.enabled}
                    onCheckedChange={(checked) => updateWebhook(webhook.id, "enabled", checked)}
                  />
                  <div className="flex-1 space-y-2">
                    <Label>{webhook.name}</Label>
                    <Input
                      placeholder="https://api.exemplo.com/webhook"
                      value={webhook.url}
                      onChange={(e) => updateWebhook(webhook.id, "url", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Agents */}
        <TabsContent value="agents">
          <div className="space-y-4">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{agent.name}</CardTitle>
                      <CardDescription>{agent.role}</CardDescription>
                    </div>
                    <Switch
                      checked={agent.enabled}
                      onCheckedChange={(checked) => updateAgent(agent.id, "enabled", checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Escopo de Atuação</Label>
                    <Textarea
                      value={agent.scope}
                      onChange={(e) => updateAgent(agent.id, "scope", e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Funções e Responsabilidades</Label>
                    <Textarea
                      value={agent.functions}
                      onChange={(e) => updateAgent(agent.id, "functions", e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Modelo de LLM</Label>
                    <Select
                      value={agent.llm}
                      onValueChange={(value: "openai" | "claude" | "gemini") => updateAgent(agent.id, "llm", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                        <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                        <SelectItem value="gemini">Gemini (Google)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Aba Chaves */}
        <TabsContent value="chaves">
          <div className="space-y-4">
            {/* Chaves de API - Modelos de IA */}
            <Card>
              <CardHeader>
                <CardTitle>Chaves de API - Modelos de IA</CardTitle>
                <CardDescription>Configure as chaves para OpenAI, Claude e Gemini</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="openai-key"
                      type={showApiKeys.openai ? "text" : "password"}
                      placeholder="sk-..."
                      value={apiKeys.openai}
                      onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKeys({ ...showApiKeys, openai: !showApiKeys.openai })}
                    >
                      {showApiKeys.openai ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="claude-key">Claude API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="claude-key"
                      type={showApiKeys.claude ? "text" : "password"}
                      placeholder="sk-ant-..."
                      value={apiKeys.claude}
                      onChange={(e) => setApiKeys({ ...apiKeys, claude: e.target.value })}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKeys({ ...showApiKeys, claude: !showApiKeys.claude })}
                    >
                      {showApiKeys.claude ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gemini-key">Gemini API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="gemini-key"
                      type={showApiKeys.gemini ? "text" : "password"}
                      placeholder="AIza..."
                      value={apiKeys.gemini}
                      onChange={(e) => setApiKeys({ ...apiKeys, gemini: e.target.value })}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKeys({ ...showApiKeys, gemini: !showApiKeys.gemini })}
                    >
                      {showApiKeys.gemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wuzapi - WhatsApp API */}
            <Card>
              <CardHeader>
                <CardTitle>Wuzapi - WhatsApp API</CardTitle>
                <CardDescription>Configure a URL e tokens do Wuzapi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wuzapi-url">URL do Wuzapi</Label>
                  <Input
                    id="wuzapi-url"
                    placeholder="https://wuzapi.exemplo.com"
                    value={apiKeys.wuzapi_url}
                    onChange={(e) => setApiKeys({ ...apiKeys, wuzapi_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wuzapi-admin">Token de Admin</Label>
                  <div className="flex gap-2">
                    <Input
                      id="wuzapi-admin"
                      type={showApiKeys.wuzapi_admin ? "text" : "password"}
                      placeholder="Token de administrador"
                      value={apiKeys.wuzapi_admin_token}
                      onChange={(e) => setApiKeys({ ...apiKeys, wuzapi_admin_token: e.target.value })}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKeys({ ...showApiKeys, wuzapi_admin: !showApiKeys.wuzapi_admin })}
                    >
                      {showApiKeys.wuzapi_admin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contas WhatsApp */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Contas WhatsApp</CardTitle>
                    <CardDescription>Tokens individuais para cada conta conectada</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      const newId = String(whatsappAccounts.length + 1);
                      setWhatsAppAccount([...whatsappAccounts, { id: newId, name: "", token: "" }]);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Conta
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {whatsappAccounts.map((account, index) => (
                  <div key={account.id} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Nome da conta"
                        value={account.name}
                        onChange={(e) => {
                          const updated = [...whatsappAccounts];
                          updated[index].name = e.target.value;
                          setWhatsAppAccount(updated);
                        }}
                      />
                      <div className="flex gap-2">
                        <Input
                          type={showApiKeys[`whatsapp_${account.id}`] ? "text" : "password"}
                          placeholder="Token da conta"
                          value={account.token}
                          onChange={(e) => {
                            const updated = [...whatsappAccounts];
                            updated[index].token = e.target.value;
                            setWhatsAppAccount(updated);
                          }}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setShowApiKeys({
                              ...showApiKeys,
                              [`whatsapp_${account.id}`]: !showApiKeys[`whatsapp_${account.id}`],
                            })
                          }
                        >
                          {showApiKeys[`whatsapp_${account.id}`] ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setWhatsAppAccount(whatsappAccounts.filter((_, i) => i !== index));
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
