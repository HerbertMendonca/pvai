import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, User, Search, MoreHorizontal, Paperclip, Smile, Maximize2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  status: "online" | "offline" | "busy";
}

interface Message {
  id: string;
  agentId: string;
  sender: "user" | "agent";
  content: string;
  timestamp: Date;
}

const agents: Agent[] = [
  { id: "analista-risco", name: "Ana", role: "Análise de Risco", description: "Especialista em identificar padrões de fraude e avaliar riscos", avatar: "👩‍💼", color: "bg-red-50 text-red-600", status: "online" },
  { id: "gestor-sinistros", name: "Carlos", role: "Gestão de Sinistros", description: "Especialista em análise e processamento de sinistros", avatar: "👨‍💼", color: "bg-orange-50 text-orange-600", status: "online" },
  { id: "analista-financeiro", name: "Fernanda", role: "Análise Financeira", description: "Especialista em fluxo de caixa e inadimplência", avatar: "👩‍💻", color: "bg-green-50 text-green-600", status: "online" },
  { id: "especialista-comercial", name: "Roberto", role: "Comercial e Vendas", description: "Especialista em conversão de leads e estratégias comerciais", avatar: "👨‍💼", color: "bg-blue-50 text-blue-600", status: "busy" },
  { id: "analista-operacional", name: "Juliana", role: "Operações", description: "Especialista em eficiência operacional e SLA", avatar: "👩‍🔧", color: "bg-purple-50 text-purple-600", status: "online" },
  { id: "especialista-atendimento", name: "Pedro", role: "Atendimento", description: "Especialista em satisfação do cliente e resolução de problemas", avatar: "👨‍💼", color: "bg-cyan-50 text-cyan-600", status: "online" },
  { id: "analista-dados", name: "Mariana", role: "BI & Dados", description: "Especialista em análise de dados e insights estratégicos", avatar: "👩‍💻", color: "bg-indigo-50 text-indigo-600", status: "online" },
  { id: "gestor-cobranca", name: "Lucas", role: "Cobrança", description: "Especialista em recuperação de crédito e negociação", avatar: "👨‍💼", color: "bg-yellow-50 text-yellow-600", status: "offline" },
  { id: "especialista-marketing", name: "Camila", role: "Marketing", description: "Especialista em campanhas e engajamento", avatar: "👩‍🎨", color: "bg-pink-50 text-pink-600", status: "online" },
  { id: "analista-compliance", name: "Ricardo", role: "Compliance", description: "Especialista em conformidade regulatória", avatar: "👨‍⚖️", color: "bg-gray-50 text-gray-600", status: "online" },
  { id: "coordenadora-geral", name: "Alexandre", role: "Presidente", description: "Especialista em visão holística e decisões estratégicas", avatar: "👨‍💼", color: "bg-slate-50 text-slate-600", status: "online" },
];

export default function EquipeIA() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Record<string, Message[]>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setMessages(conversationHistory[agent.id] || []);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      agentId: selectedAgent.id,
      sender: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");

    setConversationHistory(prev => ({
      ...prev,
      [selectedAgent.id]: newMessages,
    }));

    // Simulação de resposta da IA (será substituído pela chamada TRPC real)
    setTimeout(() => {
      const agentMessage: Message = {
        id: `msg-${Date.now()}-agent`,
        agentId: selectedAgent.id,
        sender: "agent",
        content: `Olá! Sou ${selectedAgent.name}, especialista em ${selectedAgent.role}. Recebi sua mensagem: "${userMessage.content}". Como posso ajudar você hoje?`,
        timestamp: new Date(),
      };
      const updatedMessages = [...newMessages, agentMessage];
      setMessages(updatedMessages);
      setConversationHistory(prev => ({
        ...prev,
        [selectedAgent.id]: updatedMessages,
      }));
    }, 1000);
  };

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] bg-slate-50/50 overflow-hidden">
        {/* Sidebar de Agentes - Compacta */}
        <div className="w-72 border-r bg-white flex flex-col flex-shrink-0">
          <div className="p-4 border-b space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-600" />
                Equipe IA
              </h2>
              <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-blue-50 text-blue-600 border-0">
                {agents.length} Agentes
              </Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Buscar agente..."
                className="pl-8 h-8 text-xs bg-slate-50 border-0 focus-visible:ring-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => handleSelectAgent(agent)}
                  className={`w-full text-left p-2 rounded-lg transition-all group ${
                    selectedAgent?.id === agent.id
                      ? "bg-blue-50 shadow-sm"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xl ${agent.color} shadow-sm`}>
                        {agent.avatar}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        agent.status === 'online' ? 'bg-green-500' : agent.status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className={`text-xs font-bold truncate ${selectedAgent?.id === agent.id ? 'text-blue-700' : 'text-slate-900'}`}>
                          {agent.name}
                        </p>
                        {conversationHistory[agent.id] && (
                          <span className="text-[9px] text-slate-400">
                            {conversationHistory[agent.id].length}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate font-medium">{agent.role}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Área de Chat - Moderna e Densa */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedAgent ? (
            <>
              {/* Chat Header */}
              <div className="h-14 border-b px-4 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xl ${selectedAgent.color} shadow-sm`}>
                    {selectedAgent.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{selectedAgent.name}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><Search className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><Maximize2 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreHorizontal className="w-4 h-4" /></Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-hidden relative bg-slate-50/30">
                <ScrollArea className="h-full" ref={scrollRef}>
                  <div className="p-4 space-y-4 max-w-4xl mx-auto">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${selectedAgent.color} shadow-md animate-bounce`}>
                          {selectedAgent.avatar}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-slate-900">Conversar com {selectedAgent.name}</h4>
                          <p className="text-xs text-slate-500 max-w-xs mx-auto">
                            {selectedAgent.description}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full max-w-md pt-4">
                          {["Analisar KPIs de hoje", "Resumo de sinistros", "Previsão de receita", "Alertas críticos"].map((suggestion, i) => (
                            <button key={i} className="p-2 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all text-left shadow-sm">
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex items-start gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                          >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 shadow-sm ${
                              message.sender === "user" ? "bg-blue-600 text-white" : selectedAgent.color
                            }`}>
                              {message.sender === "user" ? <User className="w-3.5 h-3.5" /> : selectedAgent.avatar}
                            </div>
                            <div className={`max-w-[80%] space-y-1 ${message.sender === "user" ? "items-end" : "items-start"}`}>
                              <div className={`rounded-2xl px-3 py-2 text-xs shadow-sm leading-relaxed ${
                                message.sender === "user"
                                  ? "bg-blue-600 text-white rounded-tr-none"
                                  : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                              }`}>
                                {message.content}
                              </div>
                              <p className="text-[9px] font-bold text-slate-400 px-1">
                                {message.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Input Area - Compacta e Flutuante */}
              <div className="p-4 bg-white border-t">
                <div className="max-w-4xl mx-auto relative">
                  <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600"><Paperclip className="w-4 h-4" /></Button>
                    <textarea
                      placeholder={`Mensagem para ${selectedAgent.name}...`}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 bg-transparent border-0 focus:ring-0 text-xs py-2 px-1 resize-none min-h-[36px] max-h-32 scrollbar-hide"
                      rows={1}
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600"><Smile className="w-4 h-4" /></Button>
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!inputMessage.trim()}
                      size="icon"
                      className={`h-8 w-8 rounded-lg transition-all ${
                        inputMessage.trim() ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <p className="text-[9px] text-center text-slate-400 mt-2 font-medium">
                    A IA pode cometer erros. Verifique informações importantes.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30 p-8 text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center animate-pulse">
                  <Bot className="w-12 h-12 text-blue-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="text-xl font-bold text-slate-900">Sua Equipe de Especialistas IA</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Selecione um dos 11 agentes especializados à esquerda para obter insights, análises e suporte estratégico em tempo real.
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 px-3 py-1">Análise de Risco</Badge>
                <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 px-3 py-1">BI & Dados</Badge>
                <Badge variant="outline" className="bg-white text-slate-600 border-slate-200 px-3 py-1">Financeiro</Badge>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
