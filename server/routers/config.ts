import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { db } from "../db";
import { system_config, agents_config } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { getAuthContext } from "../middleware/auth";

export const configRouter = router({
  // Get all system configs for current empresa
  getSystemConfig: publicProcedure.query(async () => {
    const auth = getAuthContext();
    const configs = await db
      .select()
      .from(system_config)
      .where(eq(system_config.id_empresa, auth.empresaId));
    return configs;
  }),

  // Get config by key for current empresa
  getConfigByKey: publicProcedure
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const auth = getAuthContext();
      const [config] = await db
        .select()
        .from(system_config)
        .where(
          and(
            eq(system_config.key, input.key),
            eq(system_config.id_empresa, auth.empresaId)
          )
        );
      return config;
    }),

  // Save or update system config for current empresa
  saveSystemConfig: publicProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.string(),
        category: z.string().optional(),
        encrypted: z.boolean().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const auth = getAuthContext();
      
      const existing = await db
        .select()
        .from(system_config)
        .where(
          and(
            eq(system_config.key, input.key),
            eq(system_config.id_empresa, auth.empresaId)
          )
        );

      if (existing.length > 0) {
        // Update
        const [updated] = await db
          .update(system_config)
          .set({
            value: input.value,
            category: input.category,
            encrypted: input.encrypted,
            description: input.description,
            updated_by: auth.userId,
            updated_at: new Date(),
          })
          .where(
            and(
              eq(system_config.key, input.key),
              eq(system_config.id_empresa, auth.empresaId)
            )
          )
          .returning();
        return updated;
      } else {
        // Insert
        const [created] = await db
          .insert(system_config)
          .values({
            id_empresa: auth.empresaId,
            key: input.key,
            value: input.value,
            category: input.category,
            encrypted: input.encrypted,
            description: input.description,
            updated_by: auth.userId,
          })
          .returning();
        return created;
      }
    }),

  // Batch save configs for current empresa
  batchSaveConfigs: publicProcedure
    .input(
      z.array(
        z.object({
          key: z.string(),
          value: z.string(),
          category: z.string().optional(),
          encrypted: z.boolean().optional(),
        })
      )
    )
    .mutation(async ({ input }) => {
      const auth = getAuthContext();
      const results = [];

      for (const config of input) {
        const existing = await db
          .select()
          .from(system_config)
          .where(
            and(
              eq(system_config.key, config.key),
              eq(system_config.id_empresa, auth.empresaId)
            )
          );

        if (existing.length > 0) {
          const [updated] = await db
            .update(system_config)
            .set({
              value: config.value,
              category: config.category,
              encrypted: config.encrypted,
              updated_by: auth.userId,
              updated_at: new Date(),
            })
            .where(
              and(
                eq(system_config.key, config.key),
                eq(system_config.id_empresa, auth.empresaId)
              )
            )
            .returning();
          results.push(updated);
        } else {
          const [created] = await db
            .insert(system_config)
            .values({
              id_empresa: auth.empresaId,
              key: config.key,
              value: config.value,
              category: config.category,
              encrypted: config.encrypted,
              updated_by: auth.userId,
            })
            .returning();
          results.push(created);
        }
      }

      return results;
    }),

  // Get all agents config for current empresa
  getAgentsConfig: publicProcedure.query(async () => {
    const auth = getAuthContext();
    const agents = await db
      .select()
      .from(agents_config)
      .where(eq(agents_config.id_empresa, auth.empresaId));
    return agents;
  }),

  // Save or update agent config for current empresa
  saveAgentConfig: publicProcedure
    .input(
      z.object({
        agent_id: z.string(),
        name: z.string(),
        role: z.string().optional(),
        description: z.string().optional(),
        system_prompt: z.string().optional(),
        ai_provider: z.enum(["openai", "gemini", "claude"]).optional(),
        model: z.string().optional(),
        temperature: z.string().optional(),
        max_tokens: z.number().optional(),
        status: z.enum(["ativo", "inativo"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const auth = getAuthContext();

      const existing = await db
        .select()
        .from(agents_config)
        .where(
          and(
            eq(agents_config.agent_id, input.agent_id),
            eq(agents_config.id_empresa, auth.empresaId)
          )
        );

      if (existing.length > 0) {
        const [updated] = await db
          .update(agents_config)
          .set({
            ...input,
            updated_at: new Date(),
          })
          .where(
            and(
              eq(agents_config.agent_id, input.agent_id),
              eq(agents_config.id_empresa, auth.empresaId)
            )
          )
          .returning();
        return updated;
      } else {
        const [created] = await db
          .insert(agents_config)
          .values({
            id_empresa: auth.empresaId,
            ...input,
          })
          .returning();
        return created;
      }
    }),

  // Batch save agents for current empresa
  batchSaveAgents: publicProcedure
    .input(
      z.array(
        z.object({
          agent_id: z.string(),
          name: z.string(),
          role: z.string().optional(),
          description: z.string().optional(),
          system_prompt: z.string().optional(),
          ai_provider: z.enum(["openai", "gemini", "claude"]).optional(),
          status: z.enum(["ativo", "inativo"]).optional(),
        })
      )
    )
    .mutation(async ({ input }) => {
      const auth = getAuthContext();
      const results = [];

      for (const agent of input) {
        const existing = await db
          .select()
          .from(agents_config)
          .where(
            and(
              eq(agents_config.agent_id, agent.agent_id),
              eq(agents_config.id_empresa, auth.empresaId)
            )
          );

        if (existing.length > 0) {
          const [updated] = await db
            .update(agents_config)
            .set({
              ...agent,
              updated_at: new Date(),
            })
            .where(
              and(
                eq(agents_config.agent_id, agent.agent_id),
                eq(agents_config.id_empresa, auth.empresaId)
              )
            )
            .returning();
          results.push(updated);
        } else {
          const [created] = await db
            .insert(agents_config)
            .values({
              id_empresa: auth.empresaId,
              ...agent,
            })
            .returning();
          results.push(created);
        }
      }

      return results;
    }),
});

export const configuration = configRouter;
