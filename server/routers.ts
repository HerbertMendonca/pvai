import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getKpisDiarios,
  getKpisDiariosRange,
  getFinanceiroDiario,
  getOperacaoDiaria,
  getComercialDiario,
  getRiscoDiario,
  getAgentsByEmpresa,
  getAgentById,
  getConversasAgent,
  getAlertasNaoLidas,
  getAlertas,
  getLogs,
  getLogsErros,
  getClientesByEmpresa,
  getTransacoesFinanceiras,
  getCobrancasVencidas,
  getAtendimentosAbertos,
} from "./db";


export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================================================
  // KPI PROCEDURES
  // ============================================================================

  kpis: router({
    getDiarios: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
        data: z.date().optional(),
      }))
      .query(async ({ input }) => {
        const data = input.data || new Date();
        data.setHours(0, 0, 0, 0);
        return await getKpisDiarios(input.idEmpresa, data);
      }),

    getDiariosRange: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
        dataInicio: z.date(),
        dataFim: z.date(),
      }))
      .query(async ({ input }) => {
        return await getKpisDiariosRange(input.idEmpresa, input.dataInicio, input.dataFim);
      }),

    getFinanceiro: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
        data: z.date().optional(),
      }))
      .query(async ({ input }) => {
        const data = input.data || new Date();
        data.setHours(0, 0, 0, 0);
        return await getFinanceiroDiario(input.idEmpresa, data);
      }),

    getOperacao: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
        data: z.date().optional(),
      }))
      .query(async ({ input }) => {
        const data = input.data || new Date();
        data.setHours(0, 0, 0, 0);
        return await getOperacaoDiaria(input.idEmpresa, data);
      }),

    getComercial: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
        data: z.date().optional(),
      }))
      .query(async ({ input }) => {
        const data = input.data || new Date();
        data.setHours(0, 0, 0, 0);
        return await getComercialDiario(input.idEmpresa, data);
      }),

    getRisco: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
        data: z.date().optional(),
      }))
      .query(async ({ input }) => {
        const data = input.data || new Date();
        data.setHours(0, 0, 0, 0);
        return await getRiscoDiario(input.idEmpresa, data);
      }),
  }),

  // ============================================================================
  // AGENTS PROCEDURES
  // ============================================================================

  agents: router({
    getByEmpresa: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
      }))
      .query(async ({ input }) => {
        return await getAgentsByEmpresa(input.idEmpresa);
      }),

    getById: protectedProcedure
      .input(z.object({
        idAgent: z.number(),
      }))
      .query(async ({ input }) => {
        return await getAgentById(input.idAgent);
      }),

    getConversas: protectedProcedure
      .input(z.object({
        idAgent: z.number(),
        limit: z.number().default(50),
      }))
      .query(async ({ input }) => {
        return await getConversasAgent(input.idAgent, input.limit);
      }),

    chat: protectedProcedure
      .input(z.object({
        idAgent: z.number(),
        idEmpresa: z.number(),
        mensagem: z.string(),
      }))
      .mutation(async ({ input }) => {
        const agent = await getAgentById(input.idAgent);
        if (!agent) throw new Error("Agent not found");

        // Build context for the LLM
        const systemPrompt = agent.promptSistema || `You are a helpful AI agent named ${agent.nome}. Provide insightful analysis and recommendations.`;
        
        try {
          // For now, return a placeholder response
          // In production, integrate with your LLM service
          const placeholderResponse = `Agent ${agent.nome} processed your message: "${input.mensagem}" and generated insights based on the current data context.`;
          
          return {
            success: true,
            resposta: placeholderResponse,
            tokensUsados: 100,
          };
        } catch (error) {
          console.error("Agent Error:", error);
          return {
            success: false,
            resposta: "Error generating response from AI agent",
            tokensUsados: 0,
          };
        }
      }),
  }),

  // ============================================================================
  // ALERTS PROCEDURES
  // ============================================================================

  alerts: router({
    getNaoLidas: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
      }))
      .query(async ({ input }) => {
        return await getAlertasNaoLidas(input.idEmpresa);
      }),

    getAll: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
        limit: z.number().default(100),
      }))
      .query(async ({ input }) => {
        return await getAlertas(input.idEmpresa, input.limit);
      }),
  }),

  // ============================================================================
  // LOGS PROCEDURES
  // ============================================================================

  logs: router({
    getAll: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
        limit: z.number().default(100),
      }))
      .query(async ({ input }) => {
        return await getLogs(input.idEmpresa, input.limit);
      }),

    getErros: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
        limit: z.number().default(50),
      }))
      .query(async ({ input }) => {
        return await getLogsErros(input.idEmpresa, input.limit);
      }),
  }),

  // ============================================================================
  // OPERATIONAL DATA PROCEDURES
  // ============================================================================

  operacional: router({
    getClientes: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
      }))
      .query(async ({ input }) => {
        return await getClientesByEmpresa(input.idEmpresa);
      }),

    getTransacoes: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
        dataInicio: z.date(),
        dataFim: z.date(),
      }))
      .query(async ({ input }) => {
        return await getTransacoesFinanceiras(input.idEmpresa, input.dataInicio, input.dataFim);
      }),

    getCobrancasVencidas: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
      }))
      .query(async ({ input }) => {
        return await getCobrancasVencidas(input.idEmpresa);
      }),

    getAtendimentosAbertos: protectedProcedure
      .input(z.object({
        idEmpresa: z.number(),
      }))
      .query(async ({ input }) => {
        return await getAtendimentosAbertos(input.idEmpresa);
      }),
  }),
});

export type AppRouter = typeof appRouter;
