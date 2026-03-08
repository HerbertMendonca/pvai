import { Router } from "express";
import { OpenAIService } from "../services/openaiService";
import { supabase } from "../_core/supabase";

const openaiRouter = Router();
const openaiService = new OpenAIService(supabase);

// Rota para chat simples (uma pergunta)
openaiRouter.post("/chat", async (req, res) => {
  const { agentId, userMessage } = req.body;
  const id_empresa = req.user?.id_empresa;

  if (!id_empresa) {
    return res.status(401).json({ error: "Unauthorized: id_empresa not found." });
  }

  if (!agentId || !userMessage) {
    return res.status(400).json({ error: "agentId and userMessage are required." });
  }

  try {
    const response = await openaiService.chatWithAgent(agentId, id_empresa, userMessage);
    res.json({ response });
  } catch (error: any) {
    console.error("Erro na rota /openai/chat:", error);
    res.status(500).json({ error: error.message || "Erro interno do servidor ao interagir com a IA." });
  }
});

// Rota para chat com histórico (conversa)
openaiRouter.post("/chat-history", async (req, res) => {
  const { agentId, conversationHistory } = req.body;
  const id_empresa = req.user?.id_empresa;

  if (!id_empresa) {
    return res.status(401).json({ error: "Unauthorized: id_empresa not found." });
  }

  if (!agentId || !conversationHistory || !Array.isArray(conversationHistory)) {
    return res.status(400).json({ error: "agentId and conversationHistory (array) are required." });
  }

  try {
    const response = await openaiService.chatWithAgentHistory(agentId, id_empresa, conversationHistory);
    res.json({ response });
  } catch (error: any) {
    console.error("Erro na rota /openai/chat-history:", error);
    res.status(500).json({ error: error.message || "Erro interno do servidor ao interagir com a IA." });
  }
});

export default openaiRouter;
