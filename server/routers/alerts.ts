import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { alertas } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export const alertsRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        idEmpresa: z.number(),
        setor: z.string().optional(),
        limit: z.number().default(50),
      })
    )
    .query(async ({ input }) => {
      const conditions = [eq(alertas.id_empresa, input.idEmpresa)];
      
      if (input.setor && input.setor !== "todos") {
        conditions.push(eq(alertas.setor, input.setor));
      }

      return await db
        .select()
        .from(alertas)
        .where(and(...conditions))
        .orderBy(desc(alertas.created_at))
        .limit(input.limit);
    }),

  markAsRead: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await db
        .update(alertas)
        .set({ lido: true })
        .where(eq(alertas.id, input.id));
    }),

  resolve: publicProcedure
    .input(z.object({ id: z.number(), userId: z.number() }))
    .mutation(async ({ input }) => {
      return await db
        .update(alertas)
        .set({ 
          resolvido: true, 
          resolvido_por: input.userId,
          resolvido_em: new Date()
        })
        .where(eq(alertas.id, input.id));
    }),
});
