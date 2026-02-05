import {
  bigint,
  boolean,
  date,
  decimal,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

/**
 * Torre de Controle IA - Generic Multi-Tenant Database Schema
 * Designed to work with ANY business vertical
 */

// ============================================================================
// CORE USER TABLE (from template)
// ============================================================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// CORE MULTI-TENANT TABLES
// ============================================================================

export const empresas = mysqlTable(
  "empresas",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    nome: varchar("nome", { length: 255 }).notNull(),
    descricao: text("descricao"),
    nicho: varchar("nicho", { length: 100 }).notNull(), // "seguros", "ecommerce", "saas", etc
    logoUrl: varchar("logo_url", { length: 500 }),
    coresPrimarias: json("cores_primarias"), // { primary: "#000", secondary: "#fff" }
    parametrosCustomizados: json("parametros_customizados"), // Custom fields per vertical
    ativo: boolean("ativo").default(true),
    criadoEm: timestamp("criado_em").defaultNow(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idxNicho: index("idx_empresas_nicho").on(table.nicho),
  })
);

export type Empresa = typeof empresas.$inferSelect;
export type InsertEmpresa = typeof empresas.$inferInsert;

export const departamentos = mysqlTable(
  "departamentos",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    nome: varchar("nome", { length: 255 }).notNull(),
    descricao: text("descricao"),
    responsavelId: bigint("responsavel_id", { mode: "number" }),
    ativo: boolean("ativo").default(true),
    criadoEm: timestamp("criado_em").defaultNow(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idxEmpresa: index("idx_departamentos_empresa").on(table.idEmpresa),
    uniqueNome: uniqueIndex("unique_departamentos_empresa_nome").on(table.idEmpresa, table.nome),
  })
);

export type Departamento = typeof departamentos.$inferSelect;
export type InsertDepartamento = typeof departamentos.$inferInsert;

// ============================================================================
// OPERATIONAL DATA TABLES
// ============================================================================

export const clientes = mysqlTable(
  "clientes",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    nome: varchar("nome", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }),
    telefone: varchar("telefone", { length: 20 }),
    documento: varchar("documento", { length: 50 }),
    tipoCliente: varchar("tipo_cliente", { length: 50 }), // "pessoa_fisica", "pessoa_juridica", "prospect"
    status: varchar("status", { length: 50 }).default("ativo"), // "ativo", "inativo", "bloqueado"
    dadosAdicionais: json("dados_adicionais"),
    criadoEm: timestamp("criado_em").defaultNow(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idxEmpresa: index("idx_clientes_empresa").on(table.idEmpresa),
    idxStatus: index("idx_clientes_status").on(table.status),
    uniqueDocumento: uniqueIndex("unique_clientes_empresa_documento").on(table.idEmpresa, table.documento),
  })
);

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = typeof clientes.$inferInsert;

export const produtosServicos = mysqlTable(
  "produtos_servicos",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    nome: varchar("nome", { length: 255 }).notNull(),
    descricao: text("descricao"),
    tipo: varchar("tipo", { length: 50 }), // "produto", "servico", "pacote"
    precoBase: decimal("preco_base", { precision: 15, scale: 2 }),
    categoria: varchar("categoria", { length: 100 }),
    ativo: boolean("ativo").default(true),
    metadados: json("metadados"),
    criadoEm: timestamp("criado_em").defaultNow(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idxEmpresa: index("idx_produtos_empresa").on(table.idEmpresa),
  })
);

export type ProdutoServico = typeof produtosServicos.$inferSelect;
export type InsertProdutoServico = typeof produtosServicos.$inferInsert;

export const leads = mysqlTable(
  "leads",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    nome: varchar("nome", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }),
    telefone: varchar("telefone", { length: 20 }),
    origem: varchar("origem", { length: 100 }), // "website", "campanha", "referencia"
    status: varchar("status", { length: 50 }).default("novo"), // "novo", "qualificado", "convertido", "perdido"
    valorEstimado: decimal("valor_estimado", { precision: 15, scale: 2 }),
    responsavelId: bigint("responsavel_id", { mode: "number" }),
    dadosAdicionais: json("dados_adicionais"),
    criadoEm: timestamp("criado_em").defaultNow(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idxEmpresa: index("idx_leads_empresa").on(table.idEmpresa),
    idxStatus: index("idx_leads_status").on(table.status),
  })
);

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

export const transacoesFinanceiras = mysqlTable(
  "transacoes_financeiras",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    idCliente: bigint("id_cliente", { mode: "number" }).references(() => clientes.id),
    tipo: varchar("tipo", { length: 50 }).notNull(), // "receita", "despesa", "transferencia"
    categoria: varchar("categoria", { length: 100 }),
    descricao: text("descricao"),
    valor: decimal("valor", { precision: 15, scale: 2 }).notNull(),
    moeda: varchar("moeda", { length: 3 }).default("BRL"),
    dataTransacao: date("data_transacao").notNull(),
    dataVencimento: date("data_vencimento"),
    status: varchar("status", { length: 50 }).default("pendente"), // "pendente", "pago", "cancelado", "atrasado"
    metodoPagamento: varchar("metodo_pagamento", { length: 100 }), // "cartao", "boleto", "pix", "dinheiro"
    referenciaExterna: varchar("referencia_externa", { length: 255 }),
    criadoEm: timestamp("criado_em").defaultNow(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idxEmpresaData: index("idx_transacoes_empresa_data").on(table.idEmpresa, table.dataTransacao),
    idxStatus: index("idx_transacoes_status").on(table.status),
  })
);

export type TransacaoFinanceira = typeof transacoesFinanceiras.$inferSelect;
export type InsertTransacaoFinanceira = typeof transacoesFinanceiras.$inferInsert;

export const cobrancas = mysqlTable(
  "cobrancas",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    idCliente: bigint("id_cliente", { mode: "number" }).notNull().references(() => clientes.id),
    idTransacao: bigint("id_transacao", { mode: "number" }).references(() => transacoesFinanceiras.id),
    valorOriginal: decimal("valor_original", { precision: 15, scale: 2 }).notNull(),
    valorPago: decimal("valor_pago", { precision: 15, scale: 2 }).default("0"),
    dataVencimento: date("data_vencimento").notNull(),
    dataPagamento: date("data_pagamento"),
    status: varchar("status", { length: 50 }).default("pendente"), // "pendente", "pago", "vencido", "cancelado"
    tentativasCobranca: int("tentativas_cobranca").default(0),
    proximaTentativa: date("proxima_tentativa"),
    motivoCancelamento: text("motivo_cancelamento"),
    criadoEm: timestamp("criado_em").defaultNow(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idxEmpresaStatus: index("idx_cobrancas_empresa_status").on(table.idEmpresa, table.status),
  })
);

export type Cobranca = typeof cobrancas.$inferSelect;
export type InsertCobranca = typeof cobrancas.$inferInsert;

export const atendimentos = mysqlTable(
  "atendimentos",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    idCliente: bigint("id_cliente", { mode: "number" }).references(() => clientes.id),
    numeroTicket: varchar("numero_ticket", { length: 50 }).notNull(),
    assunto: varchar("assunto", { length: 255 }),
    descricao: text("descricao"),
    categoria: varchar("categoria", { length: 100 }),
    prioridade: varchar("prioridade", { length: 50 }).default("normal"), // "baixa", "normal", "alta", "critica"
    status: varchar("status", { length: 50 }).default("aberto"), // "aberto", "em_andamento", "aguardando_cliente", "resolvido", "fechado"
    responsavelId: bigint("responsavel_id", { mode: "number" }),
    tempoRespostaMinutos: int("tempo_resposta_minutos"),
    tempoResolucaoMinutos: int("tempo_resolucao_minutos"),
    dadosAdicionais: json("dados_adicionais"),
    criadoEm: timestamp("criado_em").defaultNow(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idxEmpresaStatus: index("idx_atendimentos_empresa_status").on(table.idEmpresa, table.status),
  })
);

export type Atendimento = typeof atendimentos.$inferSelect;
export type InsertAtendimento = typeof atendimentos.$inferInsert;

export const conversas = mysqlTable(
  "conversas",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    idCliente: bigint("id_cliente", { mode: "number" }).references(() => clientes.id),
    idAtendimento: bigint("id_atendimento", { mode: "number" }).references(() => atendimentos.id),
    tipoCanal: varchar("tipo_canal", { length: 50 }), // "whatsapp", "email", "chat", "telefone"
    remetente: varchar("remetente", { length: 255 }),
    destinatario: varchar("destinatario", { length: 255 }),
    mensagem: text("mensagem"),
    anexos: json("anexos"), // Array of file URLs
    lida: boolean("lida").default(false),
    dataLeitura: timestamp("data_leitura"),
    criadoEm: timestamp("criado_em").defaultNow(),
  },
  (table) => ({
    idxEmpresa: index("idx_conversas_empresa").on(table.idEmpresa),
  })
);

export type Conversa = typeof conversas.$inferSelect;
export type InsertConversa = typeof conversas.$inferInsert;

export const eventos = mysqlTable(
  "eventos",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    tipoEvento: varchar("tipo_evento", { length: 100 }).notNull(), // "venda", "cancelamento", "renovacao", etc
    descricao: text("descricao"),
    dadosEvento: json("dados_evento"),
    criadoEm: timestamp("criado_em").defaultNow(),
  },
  (table) => ({
    idxEmpresa: index("idx_eventos_empresa").on(table.idEmpresa),
  })
);

export type Evento = typeof eventos.$inferSelect;
export type InsertEvento = typeof eventos.$inferInsert;

export const eventosEtapas = mysqlTable(
  "eventos_etapas",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEvento: bigint("id_evento", { mode: "number" }).notNull().references(() => eventos.id),
    numeroEtapa: int("numero_etapa"),
    nomeEtapa: varchar("nome_etapa", { length: 100 }),
    status: varchar("status", { length: 50 }),
    dataInicio: timestamp("data_inicio"),
    dataFim: timestamp("data_fim"),
    metadados: json("metadados"),
  }
);

export type EventoEtapa = typeof eventosEtapas.$inferSelect;
export type InsertEventoEtapa = typeof eventosEtapas.$inferInsert;

// ============================================================================
// AGGREGATED KPI TABLES (Daily)
// ============================================================================

export const kpisDiarios = mysqlTable(
  "kpis_diarios",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    dataReferencia: date("data_referencia").notNull(),
    
    // Generic metrics
    totalClientes: int("total_clientes").default(0),
    novosClientes: int("novos_clientes").default(0),
    clientesAtivos: int("clientes_ativos").default(0),
    
    // Financial metrics
    receitaTotal: decimal("receita_total", { precision: 15, scale: 2 }).default("0"),
    receitaPaga: decimal("receita_paga", { precision: 15, scale: 2 }).default("0"),
    receitaPendente: decimal("receita_pendente", { precision: 15, scale: 2 }).default("0"),
    despesaTotal: decimal("despesa_total", { precision: 15, scale: 2 }).default("0"),
    lucroLiquido: decimal("lucro_liquido", { precision: 15, scale: 2 }).default("0"),
    
    // Operational metrics
    totalTransacoes: int("total_transacoes").default(0),
    totalAtendimentos: int("total_atendimentos").default(0),
    atendimentosResolvidos: int("atendimentos_resolvidos").default(0),
    tempoMedioResolucaoMinutos: int("tempo_medio_resolucao_minutos"),
    
    // Sales metrics
    novosLeads: int("novos_leads").default(0),
    leadsQualificados: int("leads_qualificados").default(0),
    conversoes: int("conversoes").default(0),
    taxaConversao: decimal("taxa_conversao", { precision: 5, scale: 2 }).default("0"),
    
    // Custom metrics
    metricasCustomizadas: json("metricas_customizadas"),
    
    criadoEm: timestamp("criado_em").defaultNow(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idxEmpresaData: index("idx_kpis_diarios_empresa_data").on(table.idEmpresa, table.dataReferencia),
  })
);

export type KpiDiario = typeof kpisDiarios.$inferSelect;
export type InsertKpiDiario = typeof kpisDiarios.$inferInsert;

export const financeiroDiario = mysqlTable(
  "financeiro_diario",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    dataReferencia: date("data_referencia").notNull(),
    
    receitaDia: decimal("receita_dia", { precision: 15, scale: 2 }).default("0"),
    despesaDia: decimal("despesa_dia", { precision: 15, scale: 2 }).default("0"),
    saldoDia: decimal("saldo_dia", { precision: 15, scale: 2 }).default("0"),
    saldoAcumulado: decimal("saldo_acumulado", { precision: 15, scale: 2 }).default("0"),
    
    receitaCartao: decimal("receita_cartao", { precision: 15, scale: 2 }).default("0"),
    receitaBoleto: decimal("receita_boleto", { precision: 15, scale: 2 }).default("0"),
    receitaPix: decimal("receita_pix", { precision: 15, scale: 2 }).default("0"),
    receitaDinheiro: decimal("receita_dinheiro", { precision: 15, scale: 2 }).default("0"),
    
    cobrancasVencidas: decimal("cobrancas_vencidas", { precision: 15, scale: 2 }).default("0"),
    cobrancasPendentes: decimal("cobrancas_pendentes", { precision: 15, scale: 2 }).default("0"),
    
    metadados: json("metadados"),
    criadoEm: timestamp("criado_em").defaultNow(),
  },
  (table) => ({
    idxEmpresaData: index("idx_financeiro_diario_empresa_data").on(table.idEmpresa, table.dataReferencia),
  })
);

export type FinanceiroDiario = typeof financeiroDiario.$inferSelect;
export type InsertFinanceiroDiario = typeof financeiroDiario.$inferInsert;

export const operacaoDiaria = mysqlTable(
  "operacao_diaria",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    dataReferencia: date("data_referencia").notNull(),
    
    totalTarefas: int("total_tarefas").default(0),
    tarefasConcluidas: int("tarefas_concluidas").default(0),
    tarefasPendentes: int("tarefas_pendentes").default(0),
    
    totalAtendimentos: int("total_atendimentos").default(0),
    atendimentosAbertos: int("atendimentos_abertos").default(0),
    atendimentosFechados: int("atendimentos_fechados").default(0),
    
    tempoMedioAtendimentoMinutos: int("tempo_medio_atendimento_minutos"),
    slaCumprimento: decimal("sla_cumprimento", { precision: 5, scale: 2 }).default("0"),
    
    metadados: json("metadados"),
    criadoEm: timestamp("criado_em").defaultNow(),
  },
  (table) => ({
    idxEmpresaData: index("idx_operacao_diaria_empresa_data").on(table.idEmpresa, table.dataReferencia),
  })
);

export type OperacaoDiaria = typeof operacaoDiaria.$inferSelect;
export type InsertOperacaoDiaria = typeof operacaoDiaria.$inferInsert;

export const comercialDiario = mysqlTable(
  "comercial_diario",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    dataReferencia: date("data_referencia").notNull(),
    
    novosLeads: int("novos_leads").default(0),
    leadsContatados: int("leads_contatados").default(0),
    leadsQualificados: int("leads_qualificados").default(0),
    
    propostasEnviadas: int("propostas_enviadas").default(0),
    propostasAceitas: int("propostas_aceitas").default(0),
    propostasRecusadas: int("propostas_recusadas").default(0),
    
    vendasDia: int("vendas_dia").default(0),
    valorVendasDia: decimal("valor_vendas_dia", { precision: 15, scale: 2 }).default("0"),
    ticketMedio: decimal("ticket_medio", { precision: 15, scale: 2 }).default("0"),
    
    taxaConversao: decimal("taxa_conversao", { precision: 5, scale: 2 }).default("0"),
    
    metadados: json("metadados"),
    criadoEm: timestamp("criado_em").defaultNow(),
  },
  (table) => ({
    idxEmpresaData: index("idx_comercial_diario_empresa_data").on(table.idEmpresa, table.dataReferencia),
  })
);

export type ComercialDiario = typeof comercialDiario.$inferSelect;
export type InsertComercialDiario = typeof comercialDiario.$inferInsert;

export const riscoDiario = mysqlTable(
  "risco_diario",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    dataReferencia: date("data_referencia").notNull(),
    
    anomaliasDetectadas: int("anomalias_detectadas").default(0),
    riscosOperacionais: int("riscos_operacionais").default(0),
    riscosFinanceiros: int("riscos_financeiros").default(0),
    riscosComerciais: int("riscos_comerciais").default(0),
    
    clientesEmAtraso: int("clientes_em_atraso").default(0),
    valorEmAtraso: decimal("valor_em_atraso", { precision: 15, scale: 2 }).default("0"),
    
    taxaChurn: decimal("taxa_churn", { precision: 5, scale: 2 }).default("0"),
    clientesPerdidos: int("clientes_perdidos").default(0),
    
    alertasCriticos: int("alertas_criticos").default(0),
    alertasAvisos: int("alertas_avisos").default(0),
    
    metadados: json("metadados"),
    criadoEm: timestamp("criado_em").defaultNow(),
  },
  (table) => ({
    idxEmpresaData: index("idx_risco_diario_empresa_data").on(table.idEmpresa, table.dataReferencia),
  })
);

export type RiscoDiario = typeof riscoDiario.$inferSelect;
export type InsertRiscoDiario = typeof riscoDiario.$inferInsert;

// ============================================================================
// AGENTS & OBSERVABILITY TABLES
// ============================================================================

export const agents = mysqlTable(
  "agents",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    nome: varchar("nome", { length: 100 }).notNull(),
    tipo: varchar("tipo", { length: 50 }).notNull(), // "kpi", "analytics", "ceo", "conselheiro", "risco", "comercial", "copyright", "financeiro", "trafego", "operacional"
    descricao: text("descricao"),
    promptSistema: text("prompt_sistema"),
    modeloLlm: varchar("modelo_llm", { length: 100 }).default("gpt-4"),
    ativo: boolean("ativo").default(true),
    configuracoes: json("configuracoes"),
    criadoEm: timestamp("criado_em").defaultNow(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
  }
);

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

export const conversasAgents = mysqlTable(
  "conversas_agents",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    idAgent: bigint("id_agent", { mode: "number" }).notNull().references(() => agents.id),
    idUsuario: bigint("id_usuario", { mode: "number" }),
    mensagemUsuario: text("mensagem_usuario"),
    respostaAgent: text("resposta_agent"),
    contextoData: json("contexto_dados"),
    tokensUsados: int("tokens_usados"),
    tempoRespostaMilis: int("tempo_resposta_ms"),
    criadoEm: timestamp("criado_em").defaultNow(),
  },
  (table) => ({
    idxEmpresa: index("idx_conversas_agents_empresa").on(table.idEmpresa),
  })
);

export type ConversaAgent = typeof conversasAgents.$inferSelect;
export type InsertConversaAgent = typeof conversasAgents.$inferInsert;

export const logsExecucao = mysqlTable(
  "logs_execucao",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    tipoLog: varchar("tipo_log", { length: 50 }), // "workflow", "agent", "api", "sistema"
    nivel: varchar("nivel", { length: 20 }), // "info", "warning", "error", "critical"
    mensagem: text("mensagem"),
    stackTrace: text("stack_trace"),
    dadosAdicionais: json("dados_adicionais"),
    criadoEm: timestamp("criado_em").defaultNow(),
  },
  (table) => ({
    idxEmpresaNivel: index("idx_logs_execucao_empresa_nivel").on(table.idEmpresa, table.nivel),
  })
);

export type LogExecucao = typeof logsExecucao.$inferSelect;
export type InsertLogExecucao = typeof logsExecucao.$inferInsert;

export const alertas = mysqlTable(
  "alertas",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    tipoAlerta: varchar("tipo_alerta", { length: 100 }), // "anomalia", "risco", "evento_critico"
    severidade: varchar("severidade", { length: 50 }), // "baixa", "media", "alta", "critica"
    titulo: varchar("titulo", { length: 255 }),
    descricao: text("descricao"),
    dadosAlerta: json("dados_alerta"),
    lido: boolean("lido").default(false),
    dataLeitura: timestamp("data_leitura"),
    criadoEm: timestamp("criado_em").defaultNow(),
  },
  (table) => ({
    idxEmpresaLido: index("idx_alertas_empresa_lido").on(table.idEmpresa, table.lido),
  })
);

export type Alerta = typeof alertas.$inferSelect;
export type InsertAlerta = typeof alertas.$inferInsert;

// ============================================================================
// CONFIGURATION TABLES
// ============================================================================

export const configuracoesEmpresa = mysqlTable(
  "configuracoes_empresa",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    chave: varchar("chave", { length: 255 }).notNull(),
    valor: json("valor"),
    descricao: text("descricao"),
    criadoEm: timestamp("criado_em").defaultNow(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
  },
  (table) => ({
    uniqueChave: uniqueIndex("unique_configuracoes_empresa_chave").on(table.idEmpresa, table.chave),
  })
);

export type ConfiguracaoEmpresa = typeof configuracoesEmpresa.$inferSelect;
export type InsertConfiguracaoEmpresa = typeof configuracoesEmpresa.$inferInsert;

export const webhooksN8n = mysqlTable(
  "webhooks_n8n",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    idEmpresa: bigint("id_empresa", { mode: "number" }).notNull().references(() => empresas.id),
    nome: varchar("nome", { length: 255 }).notNull(),
    urlWebhook: varchar("url_webhook", { length: 500 }).notNull(),
    tipoWorkflow: varchar("tipo_workflow", { length: 100 }), // "coleta", "padronizacao", "agregacao"
    ativo: boolean("ativo").default(true),
    ultimaExecucao: timestamp("ultima_execucao"),
    statusUltimaExecucao: varchar("status_ultima_execucao", { length: 50 }),
    criadoEm: timestamp("criado_em").defaultNow(),
    atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
  },
  (table) => ({
    idxEmpresa: index("idx_webhooks_n8n_empresa").on(table.idEmpresa),
  })
);

export type WebhookN8n = typeof webhooksN8n.$inferSelect;
export type InsertWebhookN8n = typeof webhooksN8n.$inferInsert;
