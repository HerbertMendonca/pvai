import { useState, useRef, useEffect } from "react";
import { useAgents } from "@/_core/hooks/useAgents";
import { Bot, Send, User, Search, MoreHorizontal, Paperclip, Smile, Maximize2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  agentId: string;
  sender: "user" | "agent";
  content: string;
  timestamp: Date;
}

const agentColors = [
  "bg-red-50 text-red-600",
  "bg-orange-50 text-orange-600",
  "bg-green-50 text-green-600",
  "bg-blue-50 text-blue-600",
  "bg-purple-50 text-purple-600",
  "bg-cyan-50 text-cyan-600",
  "bg-indigo-50 text-indigo-600",
  "bg-yellow-50 text-yellow-600",
  "bg-pink-50 text-pink-600",
  "bg-gray-50 text-gray-600",
];

export default function EquipeIA() {
  const { agents: dbAgents, loading } = useAgents();
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
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

  const handleSelectAgent = (agent: any) => {
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

    // Simulação de resposta da IA
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

  const agents = dbAgents.map((agent, idx) => ({
    id: agent.id.toString(),
    name: agent.name,
    role: agent.role,
    description: agent.description,
    avatar: "🤖",
    color: agentColors[idx % agentColors.length],
    status: agent.status === "ativo" ? "online" : "offline",
  }));

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50/50 overflow-hidden gap-0">
      {/* Sidebar de Agentes - Compacta */}
      <div className="w-64 border-r bg-white flex flex-col flex-shrink-0">
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-600" />
              Equipe IA
            </h2>
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-blue-50 text-blue-600 border-0">
              {loading ? "..." : agents.length} Agentes
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
            {loading ? (
              <div className="p-4 text-center text-xs text-slate-500">Carregando agentes...</div>
            ) : filteredAgents.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">Nenhum agente encontrado</div>
            ) : (
              filteredAgents.map((agent) => (
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
                        agent.status === 'online' ? 'bg-green-500' : 'bg-slate-300'
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
              ))
            )}
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
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${message.sender === "user" ? "bg-blue-100 text-blue-600" : selectedAgent.color}`}>
                            {message.sender === "user" ? "👤" : selectedAgent.avatar}
                          </div>
                          <div className={`flex-1 max-w-xs ${message.sender === "user" ? "text-right" : "text-left"}`}>
                            <div className={`inline-block px-3 py-2 rounded-lg text-sm ${
                              message.sender === "user"
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-slate-100 text-slate-900 rounded-bl-none"
                            }`}>
                              {message.content}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="h-16 border-t bg-white px-4 py-3 flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input
                placeholder="Digite sua mensagem..."
                className="flex-1 h-8 text-sm bg-slate-50 border-0 focus-visible:ring-1"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                <Smile className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSendMessage}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="space-y-4">
              <div className="text-6xl">🤖</div>
              <h3 className="text-lg font-bold text-slate-900">Selecione um Agente</h3>
              <p className="text-sm text-slate-500">Clique em um agente na lista para começar a conversar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
