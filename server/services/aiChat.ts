import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../db";
import { system_config, agents_config } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatOptions {
  empresaId: number;
  agentCode: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

// Cache for API clients
let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;
let geminiClient: GoogleGenerativeAI | null = null;

async function getApiKey(key: string, empresaId: number): Promise<string | null> {
  const [config] = await db
    .select()
    .from(system_config)
    .where(
      and(
        eq(system_config.key, key),
        eq(system_config.id_empresa, empresaId)
      )
    );
  return config?.value || null;
}

async function getOpenAIClient(): Promise<OpenAI | null> {
  if (openaiClient) return openaiClient;
  
  const apiKey = await getApiKey("openai_api_key");
  if (!apiKey) return null;
  
  openaiClient = new OpenAI({ apiKey });
  return openaiClient;
}

async function getAnthropicClient(): Promise<Anthropic | null> {
  if (anthropicClient) return anthropicClient;
  
  const apiKey = await getApiKey("claude_api_key");
  if (!apiKey) return null;
  
  anthropicClient = new Anthropic({ apiKey });
  return anthropicClient;
}

async function getGeminiClient(): Promise<GoogleGenerativeAI | null> {
  if (geminiClient) return geminiClient;
  
  const apiKey = await getApiKey("gemini_api_key");
  if (!apiKey) return null;
  
  geminiClient = new GoogleGenerativeAI(apiKey);
  return geminiClient;
}

async function chatWithOpenAI(
  messages: ChatMessage[],
  model: string,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const client = await getOpenAIClient();
  if (!client) {
    throw new Error("OpenAI API key não configurada");
  }

  const response = await client.chat.completions.create({
    model: model || "gpt-4",
    messages: messages.map(msg => ({
      role: msg.role as "user" | "assistant" | "system",
      content: msg.content,
    })),
    temperature,
    max_tokens: maxTokens,
  });

  return response.choices[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";
}

async function chatWithClaude(
  messages: ChatMessage[],
  model: string,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const client = await getAnthropicClient();
  if (!client) {
    throw new Error("Claude API key não configurada");
  }

  // Separate system message from conversation
  const systemMessage = messages.find(m => m.role === "system");
  const conversationMessages = messages.filter(m => m.role !== "system");

  const response = await client.messages.create({
    model: model || "claude-3-5-sonnet-20241022",
    system: systemMessage?.content || "",
    messages: conversationMessages.map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    temperature,
    max_tokens: maxTokens,
  });

  const textContent = response.content.find(c => c.type === "text");
  return textContent && "text" in textContent
    ? textContent.text
    : "Desculpe, não consegui gerar uma resposta.";
}

async function chatWithGemini(
  messages: ChatMessage[],
  model: string,
  temperature: number,
  maxTokens: number
): Promise<string> {
  const client = await getGeminiClient();
  if (!client) {
    throw new Error("Gemini API key não configurada");
  }

  const genModel = client.getGenerativeModel({
    model: model || "gemini-2.0-flash-exp",
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
  });

  // Build conversation history
  const systemMessage = messages.find(m => m.role === "system");
  const conversationMessages = messages.filter(m => m.role !== "system");

  // Create chat with system instruction
  const chat = genModel.startChat({
    systemInstruction: systemMessage?.content,
    history: conversationMessages.slice(0, -1).map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
  });

  // Send last message
  const lastMessage = conversationMessages[conversationMessages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  const response = result.response;
  
  return response.text() || "Desculpe, não consegui gerar uma resposta.";
}

export async function chatWithAgent(options: ChatOptions): Promise<string> {
  const { agentCode, messages, temperature, maxTokens } = options;

  // Get agent configuration
  const [agent] = await db
    .select()
    .from(agentsConfig)
    .where(eq(agentsConfig.code, agentCode));

  if (!agent) {
    throw new Error(`Agente ${agentCode} não encontrado`);
  }

  if (agent.status !== "ativo") {
    throw new Error(`Agente ${agentCode} está inativo`);
  }

  // Build messages with system prompt
  const fullMessages: ChatMessage[] = [
    {
      role: "system",
      content: agent.systemPrompt,
    },
    ...messages,
  ];

  const finalTemperature = temperature || parseFloat(agent.temperature || "0.7");
  const finalMaxTokens = maxTokens || agent.maxTokens || 2000;

  // Route to appropriate LLM
  switch (agent.provider) {
    case "openai":
      return await chatWithOpenAI(
        fullMessages,
        agent.model,
        finalTemperature,
        finalMaxTokens
      );

    case "claude":
      return await chatWithClaude(
        fullMessages,
        agent.model,
        finalTemperature,
        finalMaxTokens
      );

    case "gemini":
      return await chatWithGemini(
        fullMessages,
        agent.model,
        finalTemperature,
        finalMaxTokens
      );

    default:
      throw new Error(`Provider ${agent.provider} não suportado`);
  }
}
