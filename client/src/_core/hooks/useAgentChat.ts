import { useState, useCallback } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface UseAgentChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  addMessage: (message: ChatMessage) => void;
}

/**
 * Hook para comunicação com agentes de IA
 * @param agentId ID do agente
 * @returns Objeto com métodos para gerenciar chat
 */
export function useAgentChat(agentId: string): UseAgentChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim()) {
        return;
      }

      // Adicionar mensagem do usuário ao histórico
      const newUserMessage: ChatMessage = {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Preparar histórico da conversa para enviar ao backend
        const conversationHistory = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        // Se houver histórico, usar a rota com histórico
        // Caso contrário, usar a rota simples
        const endpoint = conversationHistory.length > 0 ? "/api/openai/chat-history" : "/api/openai/chat";

        const payload =
          conversationHistory.length > 0
            ? {
                agentId,
                conversationHistory: [...conversationHistory, { role: "user", content: userMessage }],
              }
            : {
                agentId,
                userMessage,
              };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erro ao comunicar com o agente");
        }

        const data = await response.json();
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ao comunicar com o agente";
        setError(errorMessage);
        console.error("Erro no chat com agente:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [agentId, messages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    addMessage,
  };
}
