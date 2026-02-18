-- Torre de Controle IA - Generic Multi-Tenant Database Schema
-- This schema is designed to work with ANY business vertical

-- ============================================================================
-- CORE MULTI-TENANT TABLES
-- ============================================================================

-- Tenants/Companies
CREATE TABLE IF NOT EXISTS empresas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL,
  descricao TEXT,
  nicho VARCHAR(100) NOT NULL, -- e.g., "seguros", "ecommerce", "saas", "agencia"
  logo_url VARCHAR(500),
  cores_primarias JSONB, -- { "primary": "#000", "secondary": "#fff" }
  parametros_customizados JSONB, -- Custom fields per vertical
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departamentos (genéricos para qualquer empresa)
CREATE TABLE IF NOT EXISTS departamentos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  responsavel_id BIGINT,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_empresa, nome)
);

-- ============================================================================
-- OPERATIONAL DATA TABLES (Generic for any business)
-- ============================================================================

-- Clientes (customers/contacts - generic)
CREATE TABLE IF NOT EXISTS clientes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(320),
  telefone VARCHAR(20),
  documento VARCHAR(50), -- CPF, CNPJ, etc
  tipo_cliente VARCHAR(50), -- "pessoa_fisica", "pessoa_juridica", "prospect"
  status VARCHAR(50) DEFAULT 'ativo', -- "ativo", "inativo", "bloqueado"
  dados_adicionais JSONB, -- Custom fields per vertical
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_empresa, documento)
);

-- Produtos/Serviços (generic for any business)
CREATE TABLE IF NOT EXISTS produtos_servicos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50), -- "produto", "servico", "pacote"
  preco_base DECIMAL(15, 2),
  categoria VARCHAR(100),
  ativo BOOLEAN DEFAULT true,
  metadados JSONB, -- Custom fields per vertical
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads (prospects/opportunities)
CREATE TABLE IF NOT EXISTS leads (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(320),
  telefone VARCHAR(20),
  origem VARCHAR(100), -- "website", "campanha", "referencia", etc
  status VARCHAR(50) DEFAULT 'novo', -- "novo", "qualificado", "convertido", "perdido"
  valor_estimado DECIMAL(15, 2),
  responsavel_id BIGINT,
  dados_adicionais JSONB,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transações Financeiras (generic for any business)
CREATE TABLE IF NOT EXISTS transacoes_financeiras (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  id_cliente BIGINT REFERENCES clientes(id),
  tipo VARCHAR(50) NOT NULL, -- "receita", "despesa", "transferencia"
  categoria VARCHAR(100),
  descricao TEXT,
  valor DECIMAL(15, 2) NOT NULL,
  moeda VARCHAR(3) DEFAULT 'BRL',
  data_transacao DATE NOT NULL,
  data_vencimento DATE,
  status VARCHAR(50) DEFAULT 'pendente', -- "pendente", "pago", "cancelado", "atrasado"
  metodo_pagamento VARCHAR(100), -- "cartao", "boleto", "pix", "dinheiro"
  referencia_externa VARCHAR(255),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cobranças (accounts receivable - generic)
CREATE TABLE IF NOT EXISTS cobrancas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  id_cliente BIGINT NOT NULL REFERENCES clientes(id),
  id_transacao BIGINT REFERENCES transacoes_financeiras(id),
  valor_original DECIMAL(15, 2) NOT NULL,
  valor_pago DECIMAL(15, 2) DEFAULT 0,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status VARCHAR(50) DEFAULT 'pendente', -- "pendente", "pago", "vencido", "cancelado"
  tentativas_cobranca INT DEFAULT 0,
  proxima_tentativa DATE,
  motivo_cancelamento TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Atendimentos/Tickets (customer service - generic)
CREATE TABLE IF NOT EXISTS atendimentos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  id_cliente BIGINT REFERENCES clientes(id),
  numero_ticket VARCHAR(50) NOT NULL,
  assunto VARCHAR(255),
  descricao TEXT,
  categoria VARCHAR(100),
  prioridade VARCHAR(50) DEFAULT 'normal', -- "baixa", "normal", "alta", "critica"
  status VARCHAR(50) DEFAULT 'aberto', -- "aberto", "em_andamento", "aguardando_cliente", "resolvido", "fechado"
  responsavel_id BIGINT,
  tempo_resposta_minutos INT,
  tempo_resolucao_minutos INT,
  dados_adicionais JSONB,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversas (messages/communications)
CREATE TABLE IF NOT EXISTS conversas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  id_cliente BIGINT REFERENCES clientes(id),
  id_atendimento BIGINT REFERENCES atendimentos(id),
  tipo_canal VARCHAR(50), -- "whatsapp", "email", "chat", "telefone"
  remetente VARCHAR(255),
  destinatario VARCHAR(255),
  mensagem TEXT,
  anexos JSONB, -- Array of file URLs
  lida BOOLEAN DEFAULT false,
  data_leitura TIMESTAMP,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Eventos (generic events for any business)
CREATE TABLE IF NOT EXISTS eventos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  tipo_evento VARCHAR(100) NOT NULL, -- "venda", "cancelamento", "renovacao", "suporte", etc
  descricao TEXT,
  dados_evento JSONB, -- Flexible structure for any event type
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Etapas de Eventos (event pipeline stages)
CREATE TABLE IF NOT EXISTS eventos_etapas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_evento BIGINT NOT NULL REFERENCES eventos(id),
  numero_etapa INT,
  nome_etapa VARCHAR(100),
  status VARCHAR(50),
  data_inicio TIMESTAMP,
  data_fim TIMESTAMP,
  metadados JSONB
);

-- ============================================================================
-- AGGREGATED KPI TABLES (Daily)
-- ============================================================================

CREATE TABLE IF NOT EXISTS kpis_diarios (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  data_referencia DATE NOT NULL,
  
  -- Generic metrics
  total_clientes INT DEFAULT 0,
  novos_clientes INT DEFAULT 0,
  clientes_ativos INT DEFAULT 0,
  
  -- Financial metrics
  receita_total DECIMAL(15, 2) DEFAULT 0,
  receita_paga DECIMAL(15, 2) DEFAULT 0,
  receita_pendente DECIMAL(15, 2) DEFAULT 0,
  despesa_total DECIMAL(15, 2) DEFAULT 0,
  lucro_liquido DECIMAL(15, 2) DEFAULT 0,
  
  -- Operational metrics
  total_transacoes INT DEFAULT 0,
  total_atendimentos INT DEFAULT 0,
  atendimentos_resolvidos INT DEFAULT 0,
  tempo_medio_resolucao_minutos INT,
  
  -- Sales metrics
  novos_leads INT DEFAULT 0,
  leads_qualificados INT DEFAULT 0,
  conversoes INT DEFAULT 0,
  taxa_conversao DECIMAL(5, 2) DEFAULT 0,
  
  -- Custom metrics (per vertical)
  metricas_customizadas JSONB,
  
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_empresa, data_referencia)
);

CREATE TABLE IF NOT EXISTS financeiro_diario (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  data_referencia DATE NOT NULL,
  
  receita_dia DECIMAL(15, 2) DEFAULT 0,
  despesa_dia DECIMAL(15, 2) DEFAULT 0,
  saldo_dia DECIMAL(15, 2) DEFAULT 0,
  saldo_acumulado DECIMAL(15, 2) DEFAULT 0,
  
  -- Payment breakdown
  receita_cartao DECIMAL(15, 2) DEFAULT 0,
  receita_boleto DECIMAL(15, 2) DEFAULT 0,
  receita_pix DECIMAL(15, 2) DEFAULT 0,
  receita_dinheiro DECIMAL(15, 2) DEFAULT 0,
  
  -- Receivables
  cobrancas_vencidas DECIMAL(15, 2) DEFAULT 0,
  cobrancas_pendentes DECIMAL(15, 2) DEFAULT 0,
  
  metadados JSONB,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_empresa, data_referencia)
);

CREATE TABLE IF NOT EXISTS operacao_diaria (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  data_referencia DATE NOT NULL,
  
  total_tarefas INT DEFAULT 0,
  tarefas_concluidas INT DEFAULT 0,
  tarefas_pendentes INT DEFAULT 0,
  
  total_atendimentos INT DEFAULT 0,
  atendimentos_abertos INT DEFAULT 0,
  atendimentos_fechados INT DEFAULT 0,
  
  tempo_medio_atendimento_minutos INT,
  sla_cumprimento DECIMAL(5, 2) DEFAULT 0,
  
  metadados JSONB,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_empresa, data_referencia)
);

CREATE TABLE IF NOT EXISTS comercial_diario (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  data_referencia DATE NOT NULL,
  
  novos_leads INT DEFAULT 0,
  leads_contatados INT DEFAULT 0,
  leads_qualificados INT DEFAULT 0,
  
  propostas_enviadas INT DEFAULT 0,
  propostas_aceitas INT DEFAULT 0,
  propostas_recusadas INT DEFAULT 0,
  
  vendas_dia INT DEFAULT 0,
  valor_vendas_dia DECIMAL(15, 2) DEFAULT 0,
  ticket_medio DECIMAL(15, 2) DEFAULT 0,
  
  taxa_conversao DECIMAL(5, 2) DEFAULT 0,
  
  metadados JSONB,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_empresa, data_referencia)
);

CREATE TABLE IF NOT EXISTS risco_diario (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  data_referencia DATE NOT NULL,
  
  -- Risk indicators
  anomalias_detectadas INT DEFAULT 0,
  riscos_operacionais INT DEFAULT 0,
  riscos_financeiros INT DEFAULT 0,
  riscos_comerciais INT DEFAULT 0,
  
  -- Specific risks
  clientes_em_atraso INT DEFAULT 0,
  valor_em_atraso DECIMAL(15, 2) DEFAULT 0,
  
  taxa_churn DECIMAL(5, 2) DEFAULT 0,
  clientes_perdidos INT DEFAULT 0,
  
  alertas_criticos INT DEFAULT 0,
  alertas_avisos INT DEFAULT 0,
  
  metadados JSONB,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_empresa, data_referencia)
);

-- ============================================================================
-- AGGREGATED KPI TABLES (Monthly)
-- ============================================================================

CREATE TABLE IF NOT EXISTS kpis_mensais (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  mes INT NOT NULL,
  ano INT NOT NULL,
  
  receita_mes DECIMAL(15, 2) DEFAULT 0,
  despesa_mes DECIMAL(15, 2) DEFAULT 0,
  lucro_mes DECIMAL(15, 2) DEFAULT 0,
  
  crescimento_percentual DECIMAL(5, 2) DEFAULT 0,
  
  total_clientes INT DEFAULT 0,
  novos_clientes INT DEFAULT 0,
  clientes_perdidos INT DEFAULT 0,
  
  total_vendas INT DEFAULT 0,
  ticket_medio DECIMAL(15, 2) DEFAULT 0,
  
  metadados JSONB,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_empresa, mes, ano)
);

CREATE TABLE IF NOT EXISTS financeiro_mensal (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  mes INT NOT NULL,
  ano INT NOT NULL,
  
  receita_mes DECIMAL(15, 2) DEFAULT 0,
  despesa_mes DECIMAL(15, 2) DEFAULT 0,
  saldo_mes DECIMAL(15, 2) DEFAULT 0,
  
  metadados JSONB,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_empresa, mes, ano)
);

CREATE TABLE IF NOT EXISTS operacao_mensal (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  mes INT NOT NULL,
  ano INT NOT NULL,
  
  total_atendimentos INT DEFAULT 0,
  atendimentos_resolvidos INT DEFAULT 0,
  tempo_medio_resolucao_minutos INT,
  
  metadados JSONB,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_empresa, mes, ano)
);

CREATE TABLE IF NOT EXISTS comercial_mensal (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  mes INT NOT NULL,
  ano INT NOT NULL,
  
  total_vendas INT DEFAULT 0,
  valor_vendas DECIMAL(15, 2) DEFAULT 0,
  ticket_medio DECIMAL(15, 2) DEFAULT 0,
  
  metadados JSONB,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_empresa, mes, ano)
);

CREATE TABLE IF NOT EXISTS risco_mensal (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  mes INT NOT NULL,
  ano INT NOT NULL,
  
  total_anomalias INT DEFAULT 0,
  total_riscos INT DEFAULT 0,
  
  metadados JSONB,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_empresa, mes, ano)
);

-- ============================================================================
-- AGENTS & OBSERVABILITY TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS agents (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- "kpi", "analytics", "ceo", "conselheiro", "risco", "comercial", "copyright", "financeiro", "trafego", "operacional"
  descricao TEXT,
  prompt_sistema TEXT,
  modelo_llm VARCHAR(100) DEFAULT 'gpt-4',
  ativo BOOLEAN DEFAULT true,
  configuracoes JSONB, -- Agent-specific settings
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversas_agents (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  id_agent BIGINT NOT NULL REFERENCES agents(id),
  id_usuario BIGINT,
  mensagem_usuario TEXT,
  resposta_agent TEXT,
  contexto_dados JSONB, -- Data used for the response
  tokens_usados INT,
  tempo_resposta_ms INT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS logs_execucao (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  tipo_log VARCHAR(50), -- "workflow", "agent", "api", "sistema"
  nivel VARCHAR(20), -- "info", "warning", "error", "critical"
  mensagem TEXT,
  stack_trace TEXT,
  dados_adicionais JSONB,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alertas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  tipo_alerta VARCHAR(100), -- "anomalia", "risco", "evento_critico"
  severidade VARCHAR(50), -- "baixa", "media", "alta", "critica"
  titulo VARCHAR(255),
  descricao TEXT,
  dados_alerta JSONB,
  lido BOOLEAN DEFAULT false,
  data_leitura TIMESTAMP,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CONFIGURATION TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS configuracoes_empresa (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  chave VARCHAR(255) NOT NULL,
  valor JSONB,
  descricao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id_empresa, chave)
);

CREATE TABLE IF NOT EXISTS webhooks_n8n (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  id_empresa BIGINT NOT NULL REFERENCES empresas(id),
  nome VARCHAR(255) NOT NULL,
  url_webhook VARCHAR(500) NOT NULL,
  tipo_workflow VARCHAR(100), -- "coleta", "padronizacao", "agregacao"
  ativo BOOLEAN DEFAULT true,
  ultima_execucao TIMESTAMP,
  status_ultima_execucao VARCHAR(50),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_clientes_empresa ON clientes(id_empresa);
CREATE INDEX idx_clientes_status ON clientes(status);
CREATE INDEX idx_transacoes_empresa_data ON transacoes_financeiras(id_empresa, data_transacao);
CREATE INDEX idx_transacoes_status ON transacoes_financeiras(status);
CREATE INDEX idx_cobrancas_empresa_status ON cobrancas(id_empresa, status);
CREATE INDEX idx_atendimentos_empresa_status ON atendimentos(id_empresa, status);
CREATE INDEX idx_conversas_empresa ON conversas(id_empresa);
CREATE INDEX idx_eventos_empresa ON eventos(id_empresa);
CREATE INDEX idx_kpis_diarios_empresa_data ON kpis_diarios(id_empresa, data_referencia);
CREATE INDEX idx_logs_empresa_nivel ON logs_execucao(id_empresa, nivel);
CREATE INDEX idx_alertas_empresa_lido ON alertas(id_empresa, lido);
