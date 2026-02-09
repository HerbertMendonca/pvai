import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
}

interface Message {
  id: string;
  agentId: string;
  sender: "user" | "agent";
  content: string;
  timestamp: Date;
}

const agents: Agent[] = [
  {
    id: "analista-risco",
    name: "Ana - Analista de Risco",
    role: "Análise de Risco",
    description: "Especialista em identificar padrões de fraude e avaliar riscos",
    avatar: "👩‍💼",
    color: "bg-red-100 text-red-700",
  },
  {
    id: "gestor-sinistros",
    name: "Carlos - Gestor de Sinistros",
    role: "Gestão de Sinistros",
    description: "Especialista em análise e processamento de sinistros",
    avatar: "👨‍💼",
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "analista-financeiro",
    name: "Fernanda - Analista Financeira",
    role: "Análise Financeira",
    description: "Especialista em fluxo de caixa e inadimplência",
    avatar: "👩‍💻",
    color: "bg-green-100 text-green-700",
  },
  {
    id: "especialista-comercial",
    name: "Roberto - Especialista Comercial",
    role: "Comercial e Vendas",
    description: "Especialista em conversão de leads e estratégias comerciais",
    avatar: "👨‍💼",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "analista-operacional",
    name: "Juliana - Analista Operacional",
    role: "Operações",
    description: "Especialista em eficiência operacional e SLA",
    avatar: "👩‍🔧",
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "especialista-atendimento",
    name: "Pedro - Especialista em Atendimento",
    role: "Atendimento ao Cliente",
    description: "Especialista em satisfação do cliente e resolução de problemas",
    avatar: "👨‍💼",
    color: "bg-cyan-100 text-cyan-700",
  },
  {
    id: "analista-dados",
    name: "Mariana - Analista de Dados",
    role: "Business Intelligence",
    description: "Especialista em análise de dados e insights estratégicos",
    avatar: "👩‍💻",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "gestor-cobranca",
    name: "Lucas - Gestor de Cobrança",
    role: "Cobrança e Recuperação",
    description: "Especialista em recuperação de crédito e negociação",
    avatar: "👨‍💼",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    id: "especialista-marketing",
    name: "Camila - Especialista em Marketing",
    role: "Marketing e Comunicação",
    description: "Especialista em campanhas e engajamento",
    avatar: "👩‍🎨",
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: "analista-compliance",
    name: "Ricardo - Analista de Compliance",
    role: "Compliance e Regulatório",
    description: "Especialista em conformidade regulatória",
    avatar: "👨‍⚖️",
    color: "bg-gray-100 text-gray-700",
  },
  {
    id: "coordenadora-geral",
    name: "Alexandre - Presidente",
    role: "Gestão Estratégica",
    description: "Especialista em visão holística e decisões estratégicas",
    avatar: "👨‍💼",
    color: "bg-slate-100 text-slate-700",
  },
];

export default function EquipeIA() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Record<string, Message[]>>({});

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    // Load conversation history for this agent
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

    // Save user message to conversation history
    setConversationHistory(prev => ({
      ...prev,
      [selectedAgent.id]: newMessages,
    }));

    try {
      // Prepare conversation history for API
      const conversationMessages = newMessages.map(msg => ({
        role: msg.sender === "user" ? "user" as const : "assistant" as const,
        content: msg.content,
      }));

      // Call AI API
      const response = await trpc.chat.sendMessage.mutate({
        agentCode: selectedAgent.id,
        messages: conversationMessages,
      });

      if (response.success && response.message) {
        const agentMessage: Message = {
          id: `msg-${Date.now()}-agent`,
          agentId: selectedAgent.id,
          sender: "agent",
          content: response.message,
          timestamp: new Date(),
        };
        const updatedMessages = [...newMessages, agentMessage];
        setMessages(updatedMessages);
        
        // Save to conversation history
        setConversationHistory(prev => ({
          ...prev,
          [selectedAgent.id]: updatedMessages,
        }));
      } else {
        // Show error message
        const errorMessage: Message = {
          id: `msg-${Date.now()}-error`,
          agentId: selectedAgent.id,
          sender: "agent",
          content: `Desculpe, ocorreu um erro: ${response.error || "Erro desconhecido"}. Verifique se as chaves de API estão configuradas corretamente em Configurações > Chaves.`,
          timestamp: new Date(),
        };
        const updatedMessages = [...newMessages, errorMessage];
        setMessages(updatedMessages);
        
        setConversationHistory(prev => ({
          ...prev,
          [selectedAgent.id]: updatedMessages,
        }));
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        agentId: selectedAgent.id,
        sender: "agent",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Verifique se as configurações estão corretas.",
        timestamp: new Date(),
      };
      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
      
      setConversationHistory(prev => ({
        ...prev,
        [selectedAgent.id]: updatedMessages,
      }));
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] p-6 gap-6">
      {/* Left Panel - Agents List */}
      <div className="w-80 flex-shrink-0">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Equipe IA
            </CardTitle>
            <CardDescription>
              Selecione um agente para conversar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-1 p-4">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => handleSelectAgent(agent)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedAgent?.id === agent.id
                        ? "bg-blue-100 border-2 border-blue-500"
                        : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl ${agent.color}`}>
                        {agent.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{agent.name}</p>
                        <p className="text-xs text-gray-600 truncate">{agent.role}</p>
                        {conversationHistory[agent.id] && (
                          <p className="text-xs text-blue-600 mt-1">
                            {conversationHistory[agent.id].length} mensagens
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col">
        {selectedAgent ? (
          <Card className="h-full flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl ${selectedAgent.color}`}>
                  {selectedAgent.avatar}
                </div>
                <div>
                  <CardTitle>{selectedAgent.name}</CardTitle>
                  <CardDescription>{selectedAgent.description}</CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Bot className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      Inicie uma conversa com {selectedAgent.name}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Digite sua mensagem abaixo para começar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.sender === "agent" && (
                              <div className="text-2xl">{selectedAgent.avatar}</div>
                            )}
                            <div className="flex-1">
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.sender === "user" ? "text-blue-200" : "text-gray-500"
                                }`}
                              >
                                {message.timestamp.toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            {message.sender === "user" && (
                              <User className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center">
              <Bot className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-xl font-medium">
                Selecione um agente para começar
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Escolha um dos agentes especializados na lista à esquerda
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
