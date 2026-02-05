import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Agents() {
  const [idEmpresa] = useState(1); // TODO: Get from user context
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch agents
  const agentsQuery = trpc.agents.getByEmpresa.useQuery({
    idEmpresa,
  });

  // Fetch agent conversations
  const conversasQuery = trpc.agents.getConversas.useQuery(
    {
      idAgent: selectedAgentId || 0,
      limit: 50,
    },
    {
      enabled: !!selectedAgentId,
    }
  );

  // Chat mutation
  const chatMutation = trpc.agents.chat.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.resposta }]);
        setInputValue("");
      } else {
        toast.error("Erro ao gerar resposta do agente");
      }
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error("Erro na comunicação com o agente");
      setIsLoading(false);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedAgentId || isLoading) return;

    const userMessage = inputValue;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    chatMutation.mutate({
      idAgent: selectedAgentId,
      idEmpresa,
      mensagem: userMessage,
    });
  };

  const selectedAgent = agentsQuery.data?.find((a) => a.id === selectedAgentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Agents de IA</h1>
        <p className="text-gray-600 mt-1">Converse com seus agentes inteligentes para análises e insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Agents List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agentes Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {agentsQuery.isLoading ? (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </div>
              ) : agentsQuery.data && agentsQuery.data.length > 0 ? (
                agentsQuery.data.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgentId(agent.id);
                      setMessages([]);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedAgentId === agent.id
                        ? "bg-blue-100 text-blue-900 border-2 border-blue-500"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4" />
                      <div className="text-sm font-medium">{agent.nome}</div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{agent.tipo}</div>
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum agente disponível</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            {selectedAgent ? (
              <>
                <CardHeader className="border-b">
                  <CardTitle>{selectedAgent.nome}</CardTitle>
                  <CardDescription>{selectedAgent.descricao}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Inicie uma conversa com {selectedAgent.nome}</p>
                        <p className="text-xs text-gray-400 mt-2">Digite sua pergunta ou solicitação abaixo</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.role === "user"
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-gray-100 text-gray-900 rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </CardContent>

                <div className="border-t p-4 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Pressione Enter para enviar</p>
                </div>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Selecione um agente para começar</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
