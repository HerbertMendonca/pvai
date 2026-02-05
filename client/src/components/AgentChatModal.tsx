import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Agent } from "./AgentSelectorModal";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AgentChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: Agent | null;
  onBackClick: () => void;
}

export function AgentChatModal({
  open,
  onOpenChange,
  agent,
  onBackClick,
}: AgentChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const agentChat = trpc.agents.chat.useMutation();

  // Initialize messages when agent changes
  useEffect(() => {
    if (agent) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: `Olá! Sou o ${agent.nome}. ${agent.descricao}. Como posso ajudá-lo hoje?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [agent]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !agent) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get agent ID based on agent type
      // For now, we'll use a mapping - in production this could come from the database
      const agentIdMap: Record<string, number> = {
        conselho: 1,
        ceo: 2,
        financeiro: 3,
        comercial: 4,
        risco: 5,
        bi: 6,
        rh: 7,
        trafego: 8,
        marketing: 9,
        copyright: 10,
        operacional: 11,
      };

      const agentId = agentIdMap[agent.id] || 1;

      // Call the agent chat mutation
      const response = await agentChat.mutateAsync({
        idAgent: agentId,
        idEmpresa: 1, // Default company ID - should come from context
        mensagem: input,
      });

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.resposta,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl h-[600px] flex flex-col bg-gradient-to-br ${agent.cor}`}>
        <DialogHeader className="bg-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackClick}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <div>
              <DialogTitle className="text-white">{agent.nome}</DialogTitle>
              <p className="text-xs text-white/80 mt-1">{agent.descricao}</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 bg-white/5">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-white text-gray-900 rounded-br-none shadow-md"
                      : "bg-white/20 text-white rounded-bl-none backdrop-blur-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className={`text-xs mt-1 block ${
                    message.role === "user" ? "text-gray-500" : "text-white/70"
                  }`}>
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/20 text-white px-4 py-3 rounded-lg rounded-bl-none backdrop-blur-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-4 border-t border-white/20 bg-white/5">
          <Input
            placeholder="Digite sua pergunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/50"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-white text-gray-900 hover:bg-white/90"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
