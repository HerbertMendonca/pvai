import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { configRouter } from "./routers/config";
import { chatRouter } from "./routers/chat";
import { agendasRouter } from "./routers/agendas";
import { alertsRouter } from "./routers/alerts";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  configuration: configRouter,
  chat: chatRouter,
  agendas: agendasRouter,
  alerts: alertsRouter,
  
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

  // TODO: Implementar routers específicos para KPIs, Associados, Sinistros, etc.
  // Por enquanto, usar o configRouter para gerenciar configurações
});

export type AppRouter = typeof appRouter;
