import { eq, and, gte, lte, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  empresas,
  kpisDiarios,
  financeiroDiario,
  operacaoDiaria,
  comercialDiario,
  riscoDiario,
  agents,
  conversasAgents,
  logsExecucao,
  alertas,
  clientes,
  transacoesFinanceiras,
  cobrancas,
  atendimentos,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// KPI QUERIES
// ============================================================================

export async function getKpisDiarios(idEmpresa: number, dataReferencia: Date) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(kpisDiarios)
    .where(
      and(
        eq(kpisDiarios.idEmpresa, idEmpresa),
        eq(kpisDiarios.dataReferencia, dataReferencia)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getKpisDiariosRange(idEmpresa: number, dataInicio: Date, dataFim: Date) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(kpisDiarios)
    .where(
      and(
        eq(kpisDiarios.idEmpresa, idEmpresa),
        gte(kpisDiarios.dataReferencia, dataInicio),
        lte(kpisDiarios.dataReferencia, dataFim)
      )
    )
    .orderBy(desc(kpisDiarios.dataReferencia));
}

export async function getFinanceiroDiario(idEmpresa: number, dataReferencia: Date) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(financeiroDiario)
    .where(
      and(
        eq(financeiroDiario.idEmpresa, idEmpresa),
        eq(financeiroDiario.dataReferencia, dataReferencia)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getOperacaoDiaria(idEmpresa: number, dataReferencia: Date) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(operacaoDiaria)
    .where(
      and(
        eq(operacaoDiaria.idEmpresa, idEmpresa),
        eq(operacaoDiaria.dataReferencia, dataReferencia)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getComercialDiario(idEmpresa: number, dataReferencia: Date) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(comercialDiario)
    .where(
      and(
        eq(comercialDiario.idEmpresa, idEmpresa),
        eq(comercialDiario.dataReferencia, dataReferencia)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getRiscoDiario(idEmpresa: number, dataReferencia: Date) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(riscoDiario)
    .where(
      and(
        eq(riscoDiario.idEmpresa, idEmpresa),
        eq(riscoDiario.dataReferencia, dataReferencia)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// ============================================================================
// AGENTS QUERIES
// ============================================================================

export async function getAgentsByEmpresa(idEmpresa: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(agents)
    .where(eq(agents.idEmpresa, idEmpresa));
}

export async function getAgentById(idAgent: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(agents)
    .where(eq(agents.id, idAgent))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getConversasAgent(idAgent: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(conversasAgents)
    .where(eq(conversasAgents.idAgent, idAgent))
    .orderBy(desc(conversasAgents.criadoEm))
    .limit(limit);
}

// ============================================================================
// ALERTS QUERIES
// ============================================================================

export async function getAlertasNaoLidas(idEmpresa: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(alertas)
    .where(
      and(
        eq(alertas.idEmpresa, idEmpresa),
        eq(alertas.lido, false)
      )
    )
    .orderBy(desc(alertas.criadoEm));
}

export async function getAlertas(idEmpresa: number, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(alertas)
    .where(eq(alertas.idEmpresa, idEmpresa))
    .orderBy(desc(alertas.criadoEm))
    .limit(limit);
}

// ============================================================================
// LOGS QUERIES
// ============================================================================

export async function getLogs(idEmpresa: number, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(logsExecucao)
    .where(eq(logsExecucao.idEmpresa, idEmpresa))
    .orderBy(desc(logsExecucao.criadoEm))
    .limit(limit);
}

export async function getLogsErros(idEmpresa: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(logsExecucao)
    .where(
      and(
        eq(logsExecucao.idEmpresa, idEmpresa),
        eq(logsExecucao.nivel, 'error')
      )
    )
    .orderBy(desc(logsExecucao.criadoEm))
    .limit(limit);
}

// ============================================================================
// OPERATIONAL DATA QUERIES
// ============================================================================

export async function getClientesByEmpresa(idEmpresa: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(clientes)
    .where(eq(clientes.idEmpresa, idEmpresa));
}

export async function getTransacoesFinanceiras(idEmpresa: number, dataInicio: Date, dataFim: Date) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(transacoesFinanceiras)
    .where(
      and(
        eq(transacoesFinanceiras.idEmpresa, idEmpresa),
        gte(transacoesFinanceiras.dataTransacao, dataInicio),
        lte(transacoesFinanceiras.dataTransacao, dataFim)
      )
    )
    .orderBy(desc(transacoesFinanceiras.dataTransacao));
}

export async function getCobrancasVencidas(idEmpresa: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(cobrancas)
    .where(
      and(
        eq(cobrancas.idEmpresa, idEmpresa),
        eq(cobrancas.status, 'vencido')
      )
    );
}

export async function getAtendimentosAbertos(idEmpresa: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(atendimentos)
    .where(
      and(
        eq(atendimentos.idEmpresa, idEmpresa),
        eq(atendimentos.status, 'aberto')
      )
    );
}
