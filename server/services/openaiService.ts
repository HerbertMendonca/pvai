import OpenAI from "openai";
import { SupabaseClient } from "@supabase/supabase-js";
import { RAGService } from "./ragService";
import { getAgentPromptConfig } from "./agentPrompts";

interface AgentConfig {
  id: string;
  nome: string;
  role: string;
  prompt_inicial: string;
  ferramentas_disponiveis: string[];
}

export class OpenAIService {
  private openai: OpenAI;
  private supabase: SupabaseClient;
  private ragService: RAGService;

  constructor(supabase: SupabaseClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_API_BASE || "https://api.openai.com/v1",
    });
    this.supabase = supabase;
    this.ragService = new RAGService(supabase);
  }

  /**
   * Busca a configuração de um agente específico do Supabase.
   * @param agentId ID do agente.
   * @param id_empresa ID da empresa para multi-tenancy.
   * @returns Configuração do agente ou null se não encontrado.
   */
  private async getAgentConfig(agentId: string, id_empresa: string): Promise<AgentConfig | null> {
    const { data, error } = await this.supabase
      .from("agents_config")
      .select("id, nome, role, prompt_inicial, ferramentas_disponiveis")
      .eq("id", agentId)
      .eq("id_empresa", id_empresa)
      .single();

    if (error) {
      console.error("Erro ao buscar configuração do agente:", error);
      return null;
    }
    return data as AgentConfig;
  }

  /**
   * Interage com o modelo de linguagem da OpenAI com contexto de dados (RAG).
   * @param agentId ID do agente para carregar o prompt inicial.
   * @param id_empresa ID da empresa para multi-tenancy.
   * @param userMessage Mensagem do usuário.
   * @returns Resposta do modelo de linguagem.
   */
  public async chatWithAgent(agentId: string, id_empresa: string, userMessage: string): Promise<string> {
    const agentConfig = await this.getAgentConfig(agentId, id_empresa);

    if (!agentConfig) {
      return "Desculpe, não consegui encontrar a configuração para este agente.";
    }

    // Buscar contexto de dados relevantes usando RAG
    const dataContext = await this.ragService.fetchRelevantContext(id_empresa, userMessage);
    const formattedContext = this.ragService.formatContextForPrompt(dataContext);

    // Usar prompt especializado baseado no role do agente
    const specializedPromptConfig = getAgentPromptConfig(agentConfig.role);
    const basePrompt = specializedPromptConfig?.prompt || agentConfig.prompt_inicial;

    // Injetar contexto no prompt do agente
    const systemPromptWithContext = `${basePrompt}${formattedContext}`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPromptWithContext },
      { role: "user", content: userMessage },
    ];

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0].message.content || "Não foi possível gerar uma resposta.";
    } catch (error) {
      console.error("Erro ao interagir com a OpenAI:", error);
      return "Ocorreu um erro ao processar sua solicitação com a IA. Por favor, tente novamente mais tarde.";
    }
  }

  /**
   * Interage com um agente em modo de conversa (histórico de mensagens).
   * @param agentId ID do agente.
   * @param id_empresa ID da empresa para multi-tenancy.
   * @param conversationHistory Histórico da conversa.
   * @returns Resposta do modelo de linguagem.
   */
  public async chatWithAgentHistory(
    agentId: string,
    id_empresa: string,
    conversationHistory: Array<{ role: "user" | "assistant"; content: string }>
  ): Promise<string> {
    const agentConfig = await this.getAgentConfig(agentId, id_empresa);

    if (!agentConfig) {
      return "Desculpe, não consegui encontrar a configuração para este agente.";
    }

    // Buscar contexto baseado na última mensagem do usuário
    const lastUserMessage = conversationHistory
      .filter((msg) => msg.role === "user")
      .pop()?.content || "";

    const dataContext = await this.ragService.fetchRelevantContext(id_empresa, lastUserMessage);
    const formattedContext = this.ragService.formatContextForPrompt(dataContext);

    // Usar prompt especializado
    const specializedPromptConfig = getAgentPromptConfig(agentConfig.role);
    const basePrompt = specializedPromptConfig?.prompt || agentConfig.prompt_inicial;

    const systemPromptWithContext = `${basePrompt}${formattedContext}`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPromptWithContext },
      ...conversationHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      return completion.choices[0].message.content || "Não foi possível gerar uma resposta.";
    } catch (error) {
      console.error("Erro ao interagir com a OpenAI:", error);
      return "Ocorreu um erro ao processar sua solicitação com a IA. Por favor, tente novamente mais tarde.";
    }
  }
}
