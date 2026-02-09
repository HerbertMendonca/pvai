import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { chatWithAgent } from "../services/aiChat";
import { getAuthContext } from "../middleware/auth";

export const chatRouter = router({
  // Send message to agent
  sendMessage: publicProcedure
    .input(
      z.object({
        agentCode: z.string(),
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant", "system"]),
            content: z.string(),
          })
        ),
        temperature: z.number().optional(),
        maxTokens: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const auth = getAuthContext();
      
      try {
        const response = await chatWithAgent({
          empresaId: auth.empresaId,
          agentCode: input.agentCode,
          messages: input.messages,
          temperature: input.temperature,
          maxTokens: input.maxTokens,
        });

        return {
          success: true,
          message: response,
        };
      } catch (error) {
        console.error("Error in chat:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Erro ao processar mensagem",
        };
      }
    }),
});
