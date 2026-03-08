import { Router } from "express";
import { OpenAIService } from "../services/openaiService";
import { supabase } from "../_core/supabase"; // Importar a instância do Supabase

const openaiRouter = Router();
const openaiService = new OpenAIService(supabase);

openaiRouter.post("/chat", async (req, res) => {
  const { agentId, userMessage } = req.body;
  const id_empresa = req.user?.id_empresa; // Assumindo que id_empresa está no objeto user do request

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

export default openaiRouter;
