import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { agendas } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const agendasRouter = router({
  // Listar todas as agendas da empresa
  list: protectedProcedure.query(async ({ ctx }) => {
    return await db
      .select()
      .from(agendas)
      .where(eq(agendas.id_empresa, ctx.user.id_empresa))
      .orderBy(agendas.created_at);
  }),

  // Criar nova agenda
  create: protectedProcedure
    .input(
      z.object({
        nome: z.string().min(1, "Nome é obrigatório"),
        descricao: z.string().optional(),
        cor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [newAgenda] = await db
        .insert(agendas)
        .values({
          id_empresa: ctx.user.id_empresa,
          nome: input.nome,
          descricao: input.descricao,
          cor: input.cor,
        })
        .returning();
      return newAgenda;
    }),

  // Atualizar agenda existente
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        nome: z.string().min(1, "Nome é obrigatório"),
        descricao: z.string().optional(),
        cor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const [updatedAgenda] = await db
        .update(agendas)
        .set({
          nome: input.nome,
          descricao: input.descricao,
          cor: input.cor,
          updated_at: new Date(),
        })
        .where(
          and(
            eq(agendas.id, input.id),
            eq(agendas.id_empresa, ctx.user.id_empresa)
          )
        )
        .returning();
      
      if (!updatedAgenda) {
        throw new Error("Agenda não encontrada ou sem permissão");
      }
      
      return updatedAgenda;
    }),

  // Excluir agenda
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const [deletedAgenda] = await db
        .delete(agendas)
        .where(
          and(
            eq(agendas.id, input.id),
            eq(agendas.id_empresa, ctx.user.id_empresa)
          )
        )
        .returning();

      if (!deletedAgenda) {
        throw new Error("Agenda não encontrada ou sem permissão");
      }

      return { success: true };
    }),
});
