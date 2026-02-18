import {
  bigint,
  bigserial,
  boolean,
  date,
  decimal,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * PVAI - Sistema de BI e Apoio à Decisão para Proteção Veicular
 * Schema Multi-Tenant otimizado para PostgreSQL e Supabase
 */

// ============================================================================
// ENUMS
// ============================================================================

export const roleEnum = pgEnum("role", ["super_admin", "admin", "gestor", "analista", "operador", "visualizador"]);
export const aiProviderEnum = pgEnum("ai_provider", ["openai", "gemini", "claude"]);
export const agentStatusEnum = pgEnum("agent_status", ["ativo", "inativo"]);
export const statusAssociadoEnum = pgEnum("status_associado", ["ativo", "inativo", "suspenso", "cancelado"]);
export const statusSinistroEnum = pgEnum("status_sinistro", [
  "aberto", "em_analise", "aguardando_documentos", "aprovado", "pago", "recusado", "fechado"
]);
export const tipoSinistroEnum = pgEnum("tipo_sinistro", [
  "colisao", "roubo", "furto", "incendio", "danos_naturais", "vidros", "terceiros", "outros"
]);
export const statusMensalidadeEnum = pgEnum("status_mensalidade", ["pago", "pendente", "atrasado", "cancelado"]);
export const statusAtendimentoEnum = pgEnum("status_atendimento", [
  "aberto", "em_andamento", "aguardando_cliente", "resolvido", "fechado"
]);
export const canalAtendimentoEnum = pgEnum("canal_atendimento", ["whatsapp", "telefone", "email", "chat", "presencial"]);
export const statusVistoriaEnum = pgEnum("status_vistoria", [
  "agendada", "em_execucao", "aguardando_fotos", "em_analise", "aprovada", "reprovada"
]);
export const tipoAlertaEnum = pgEnum("tipo_alerta", ["anomalia", "risco", "operacional", "financeiro", "tecnico"]);
export const severidadeAlertaEnum = pgEnum("severidade_alerta", ["info", "aviso", "critico"]);
export const statusEmpresaEnum = pgEnum("status_empresa", ["ativa", "suspensa", "cancelada", "trial"]);

// ============================================================================
// EMPRESAS (TENANTS) - TABELA PRINCIPAL
// ============================================================================

export const empresas = pgTable("empresas", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  endereco: text("endereco"),
  logo_url: text("logo_url"),
  status: statusEmpresaEnum("status").default("ativa").notNull(),
  plano: varchar("plano", { length: 50 }).default("basic"), // basic, pro, enterprise
  max_usuarios: integer("max_usuarios").default(5),
  data_inicio: date("data_inicio").defaultNow(),
  data_fim_trial: date("data_fim_trial"),
  configuracoes: json("configuracoes").$type<Record<string, any>>(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  cnpjIdx: uniqueIndex("empresas_cnpj_idx").on(table.cnpj),
  statusIdx: index("empresas_status_idx").on(table.status),
}));

// ============================================================================
// USUÁRIOS - COM MULTI-TENANCY
// ============================================================================

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  nome: varchar("nome", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  senha_hash: text("senha_hash").notNull(),
  role: roleEnum("role").default("operador").notNull(),
  avatar_url: text("avatar_url"),
  ativo: boolean("ativo").default(true),
  ultimo_acesso: timestamp("ultimo_acesso"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  emailEmpresaIdx: uniqueIndex("users_email_empresa_idx").on(table.email, table.id_empresa),
  empresaIdx: index("users_empresa_idx").on(table.id_empresa),
  roleIdx: index("users_role_idx").on(table.role),
}));

// ============================================================================
// CONFIGURAÇÕES DO SISTEMA - COM MULTI-TENANCY
// ============================================================================

export const system_config = pgTable("system_config", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  key: varchar("key", { length: 255 }).notNull(),
  value: text("value"),
  category: varchar("category", { length: 100 }),
  encrypted: boolean("encrypted").default(false),
  description: text("description"),
  updated_by: integer("updated_by").references(() => users.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  keyEmpresaIdx: uniqueIndex("system_config_key_empresa_idx").on(table.key, table.id_empresa),
  empresaIdx: index("system_config_empresa_idx").on(table.id_empresa),
}));

// ============================================================================
// AGENTES IA - COM MULTI-TENANCY
// ============================================================================

export const agents_config = pgTable("agents_config", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  agent_id: varchar("agent_id", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  description: text("description"),
  system_prompt: text("system_prompt"),
  ai_provider: aiProviderEnum("ai_provider").default("openai"),
  model: varchar("model", { length: 100 }),
  temperature: decimal("temperature", { precision: 3, scale: 2 }).default("0.7"),
  max_tokens: integer("max_tokens").default(2000),
  status: agentStatusEnum("status").default("ativo"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  agentEmpresaIdx: uniqueIndex("agents_config_agent_empresa_idx").on(table.agent_id, table.id_empresa),
  empresaIdx: index("agents_config_empresa_idx").on(table.id_empresa),
}));

// ============================================================================
// DADOS RECEBIDOS VIA WEBHOOK - COM MULTI-TENANCY
// ============================================================================

export const associados_snapshot = pgTable("associados_snapshot", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  id_associado_externo: varchar("id_associado_externo", { length: 100 }).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cpf_cnpj: varchar("cpf_cnpj", { length: 18 }),
  email: varchar("email", { length: 255 }),
  telefone: varchar("telefone", { length: 20 }),
  data_adesao: date("data_adesao"),
  plano: varchar("plano", { length: 100 }),
  valor_mensalidade: decimal("valor_mensalidade", { precision: 10, scale: 2 }),
  status: statusAssociadoEnum("status"),
  dados_completos: json("dados_completos").$type<Record<string, any>>(),
  synced_at: timestamp("synced_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  associadoEmpresaIdx: uniqueIndex("associados_snapshot_associado_empresa_idx").on(table.id_associado_externo, table.id_empresa),
  empresaIdx: index("associados_snapshot_empresa_idx").on(table.id_empresa),
  statusIdx: index("associados_snapshot_status_idx").on(table.status),
}));

export const veiculos_snapshot = pgTable("veiculos_snapshot", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  id_veiculo_externo: varchar("id_veiculo_externo", { length: 100 }).notNull(),
  id_associado_externo: varchar("id_associado_externo", { length: 100 }),
  placa: varchar("placa", { length: 10 }),
  marca: varchar("marca", { length: 100 }),
  modelo: varchar("modelo", { length: 100 }),
  ano: integer("ano"),
  chassi: varchar("chassi", { length: 50 }),
  valor_mercado: decimal("valor_mercado", { precision: 12, scale: 2 }),
  dados_completos: json("dados_completos").$type<Record<string, any>>(),
  synced_at: timestamp("synced_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  veiculoEmpresaIdx: uniqueIndex("veiculos_snapshot_veiculo_empresa_idx").on(table.id_veiculo_externo, table.id_empresa),
  empresaIdx: index("veiculos_snapshot_empresa_idx").on(table.id_empresa),
  placaIdx: index("veiculos_snapshot_placa_idx").on(table.placa),
}));

export const sinistros_dados = pgTable("sinistros_dados", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  id_sinistro_externo: varchar("id_sinistro_externo", { length: 100 }).notNull(),
  id_associado_externo: varchar("id_associado_externo", { length: 100 }),
  id_veiculo_externo: varchar("id_veiculo_externo", { length: 100 }),
  tipo: tipoSinistroEnum("tipo"),
  data_ocorrencia: date("data_ocorrencia"),
  valor_sinistro: decimal("valor_sinistro", { precision: 12, scale: 2 }),
  valor_pago: decimal("valor_pago", { precision: 12, scale: 2 }),
  status: statusSinistroEnum("status"),
  descricao: text("descricao"),
  dados_completos: json("dados_completos").$type<Record<string, any>>(),
  synced_at: timestamp("synced_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  sinistroEmpresaIdx: uniqueIndex("sinistros_dados_sinistro_empresa_idx").on(table.id_sinistro_externo, table.id_empresa),
  empresaIdx: index("sinistros_dados_empresa_idx").on(table.id_empresa),
  statusIdx: index("sinistros_dados_status_idx").on(table.status),
  tipoIdx: index("sinistros_dados_tipo_idx").on(table.tipo),
}));

export const mensalidades_dados = pgTable("mensalidades_dados", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  id_mensalidade_externo: varchar("id_mensalidade_externo", { length: 100 }).notNull(),
  id_associado_externo: varchar("id_associado_externo", { length: 100 }),
  mes_referencia: date("mes_referencia"),
  valor: decimal("valor", { precision: 10, scale: 2 }),
  data_vencimento: date("data_vencimento"),
  data_pagamento: date("data_pagamento"),
  status: statusMensalidadeEnum("status"),
  dados_completos: json("dados_completos").$type<Record<string, any>>(),
  synced_at: timestamp("synced_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  mensalidadeEmpresaIdx: uniqueIndex("mensalidades_dados_mensalidade_empresa_idx").on(table.id_mensalidade_externo, table.id_empresa),
  empresaIdx: index("mensalidades_dados_empresa_idx").on(table.id_empresa),
  statusIdx: index("mensalidades_dados_status_idx").on(table.status),
}));

export const atendimentos_dados = pgTable("atendimentos_dados", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  id_atendimento_externo: varchar("id_atendimento_externo", { length: 100 }).notNull(),
  id_associado_externo: varchar("id_associado_externo", { length: 100 }),
  canal: canalAtendimentoEnum("canal"),
  assunto: varchar("assunto", { length: 255 }),
  descricao: text("descricao"),
  status: statusAtendimentoEnum("status"),
  data_abertura: timestamp("data_abertura"),
  data_fechamento: timestamp("data_fechamento"),
  tempo_resolucao_horas: integer("tempo_resolucao_horas"),
  dados_completos: json("dados_completos").$type<Record<string, any>>(),
  synced_at: timestamp("synced_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  atendimentoEmpresaIdx: uniqueIndex("atendimentos_dados_atendimento_empresa_idx").on(table.id_atendimento_externo, table.id_empresa),
  empresaIdx: index("atendimentos_dados_empresa_idx").on(table.id_empresa),
  statusIdx: index("atendimentos_dados_status_idx").on(table.status),
}));

export const vistorias_dados = pgTable("vistorias_dados", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  id_vistoria_externo: varchar("id_vistoria_externo", { length: 100 }).notNull(),
  id_veiculo_externo: varchar("id_veiculo_externo", { length: 100 }),
  id_associado_externo: varchar("id_associado_externo", { length: 100 }),
  data_agendada: date("data_agendada"),
  data_realizada: date("data_realizada"),
  status: statusVistoriaEnum("status"),
  resultado: text("resultado"),
  observacoes: text("observacoes"),
  dados_completos: json("dados_completos").$type<Record<string, any>>(),
  synced_at: timestamp("synced_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  vistoriaEmpresaIdx: uniqueIndex("vistorias_dados_vistoria_empresa_idx").on(table.id_vistoria_externo, table.id_empresa),
  empresaIdx: index("vistorias_dados_empresa_idx").on(table.id_empresa),
  statusIdx: index("vistorias_dados_status_idx").on(table.status),
}));

// ============================================================================
// KPIs AGREGADOS - COM MULTI-TENANCY
// ============================================================================

export const kpis_diarios = pgTable("kpis_diarios", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  data: date("data").notNull(),
  total_associados_ativos: integer("total_associados_ativos"),
  total_veiculos: integer("total_veiculos"),
  receita_mensalidades: decimal("receita_mensalidades", { precision: 12, scale: 2 }),
  total_sinistros_pagos: decimal("total_sinistros_pagos", { precision: 12, scale: 2 }),
  indice_sinistralidade: decimal("indice_sinistralidade", { precision: 5, scale: 2 }),
  taxa_inadimplencia: decimal("taxa_inadimplencia", { precision: 5, scale: 2 }),
  novos_associados: integer("novos_associados"),
  cancelamentos: integer("cancelamentos"),
  atendimentos_abertos: integer("atendimentos_abertos"),
  atendimentos_resolvidos: integer("atendimentos_resolvidos"),
  tempo_medio_resolucao_horas: decimal("tempo_medio_resolucao_horas", { precision: 6, scale: 2 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  dataEmpresaIdx: uniqueIndex("kpis_diarios_data_empresa_idx").on(table.data, table.id_empresa),
  empresaIdx: index("kpis_diarios_empresa_idx").on(table.id_empresa),
}));

// ============================================================================
// WHATSAPP - COM MULTI-TENANCY
// ============================================================================

export const conversas_whatsapp = pgTable("conversas_whatsapp", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  numero_contato: varchar("numero_contato", { length: 20 }).notNull(),
  nome_contato: varchar("nome_contato", { length: 255 }),
  ultima_mensagem: text("ultima_mensagem"),
  ultima_interacao: timestamp("ultima_interacao"),
  nao_lidas: integer("nao_lidas").default(0),
  atribuido_a: integer("atribuido_a").references(() => users.id),
  tags: json("tags").$type<string[]>(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  numeroEmpresaIdx: uniqueIndex("conversas_whatsapp_numero_empresa_idx").on(table.numero_contato, table.id_empresa),
  empresaIdx: index("conversas_whatsapp_empresa_idx").on(table.id_empresa),
}));

export const mensagens_whatsapp = pgTable("mensagens_whatsapp", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  id_conversa: integer("id_conversa").notNull().references(() => conversas_whatsapp.id, { onDelete: "cascade" }),
  id_mensagem_externo: varchar("id_mensagem_externo", { length: 100 }),
  direcao: varchar("direcao", { length: 20 }).notNull(), // "enviada" ou "recebida"
  conteudo: text("conteudo"),
  tipo: varchar("tipo", { length: 50 }), // "text", "image", "audio", "video", "document"
  midia_url: text("midia_url"),
  enviado_por: integer("enviado_por").references(() => users.id),
  lida: boolean("lida").default(false),
  created_at: timestamp("created_at").defaultNow(),
}, (table) => ({
  conversaIdx: index("mensagens_whatsapp_conversa_idx").on(table.id_conversa),
  empresaIdx: index("mensagens_whatsapp_empresa_idx").on(table.id_empresa),
}));

// ============================================================================
// KANBAN - COM MULTI-TENANCY
// ============================================================================

export const kanban_boards = pgTable("kanban_boards", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  setor: varchar("setor", { length: 100 }), // "sinistros", "atendimento", "vistorias", "leads"
  colunas: json("colunas").$type<Array<{ id: string; titulo: string; ordem: number }>>(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  empresaIdx: index("kanban_boards_empresa_idx").on(table.id_empresa),
}));

export const kanban_cards = pgTable("kanban_cards", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  id_board: integer("id_board").notNull().references(() => kanban_boards.id, { onDelete: "cascade" }),
  coluna_id: varchar("coluna_id", { length: 100 }).notNull(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  prioridade: varchar("prioridade", { length: 20 }), // "baixa", "media", "alta", "urgente"
  atribuido_a: integer("atribuido_a").references(() => users.id),
  data_vencimento: date("data_vencimento"),
  tags: json("tags").$type<string[]>(),
  ordem: integer("ordem").default(0),
  metadata: json("metadata").$type<Record<string, any>>(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  boardIdx: index("kanban_cards_board_idx").on(table.id_board),
  empresaIdx: index("kanban_cards_empresa_idx").on(table.id_empresa),
}));

// ============================================================================
// ALERTAS - COM MULTI-TENANCY
// ============================================================================

export const alertas = pgTable("alertas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  tipo: tipoAlertaEnum("tipo").notNull(),
  severidade: severidadeAlertaEnum("severidade").notNull(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  origem: varchar("origem", { length: 100 }), // qual agente ou sistema gerou
  setor: varchar("setor", { length: 100 }), // comercial, financeiro, eventos, etc.
  dados_contexto: json("dados_contexto").$type<Record<string, any>>(),
  lido: boolean("lido").default(false),
  resolvido: boolean("resolvido").default(false),
  resolvido_por: integer("resolvido_por").references(() => users.id),
  resolvido_em: timestamp("resolvido_em"),
  created_at: timestamp("created_at").defaultNow(),
}, (table) => ({
  empresaIdx: index("alertas_empresa_idx").on(table.id_empresa),
  severidadeIdx: index("alertas_severidade_idx").on(table.severidade),
  lidoIdx: index("alertas_lido_idx").on(table.lido),
}));

// ============================================================================
// LOGS - COM MULTI-TENANCY
// ============================================================================

export const webhook_logs = pgTable("webhook_logs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  webhook_name: varchar("webhook_name", { length: 100 }).notNull(),
  method: varchar("method", { length: 10 }),
  payload: json("payload").$type<Record<string, any>>(),
  response_status: integer("response_status"),
  response_body: json("response_body").$type<Record<string, any>>(),
  error_message: text("error_message"),
  processed_at: timestamp("processed_at").defaultNow(),
}, (table) => ({
  empresaIdx: index("webhook_logs_empresa_idx").on(table.id_empresa),
  webhookIdx: index("webhook_logs_webhook_idx").on(table.webhook_name),
}));

export const agent_execution_logs = pgTable("agent_execution_logs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  agent_id: varchar("agent_id", { length: 100 }).notNull(),
  user_id: integer("user_id").references(() => users.id),
  prompt: text("prompt"),
  response: text("response"),
  tokens_used: integer("tokens_used"),
  execution_time_ms: integer("execution_time_ms"),
  error_message: text("error_message"),
  metadata: json("metadata").$type<Record<string, any>>(),
  created_at: timestamp("created_at").defaultNow(),
}, (table) => ({
  empresaIdx: index("agent_execution_logs_empresa_idx").on(table.id_empresa),
  agentIdx: index("agent_execution_logs_agent_idx").on(table.agent_id),
}));

// ============================================================================
// AGENDAMENTOS - COM MULTI-TENANCY
// ============================================================================

export const agendas = pgTable("agendas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  id_empresa: integer("id_empresa").notNull().references(() => empresas.id, { onDelete: "cascade" }),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  cor: varchar("cor", { length: 7 }).default("#3b82f6"), // Cor hexadecimal para identificação visual
  ativo: boolean("ativo").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
}, (table) => ({
  empresaIdx: index("agendas_empresa_idx").on(table.id_empresa),
}));
