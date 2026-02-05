CREATE TABLE `agents` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`nome` varchar(100) NOT NULL,
	`tipo` varchar(50) NOT NULL,
	`descricao` text,
	`prompt_sistema` text,
	`modelo_llm` varchar(100) DEFAULT 'gpt-4',
	`ativo` boolean DEFAULT true,
	`configuracoes` json,
	`criado_em` timestamp DEFAULT (now()),
	`atualizado_em` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `alertas` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`tipo_alerta` varchar(100),
	`severidade` varchar(50),
	`titulo` varchar(255),
	`descricao` text,
	`dados_alerta` json,
	`lido` boolean DEFAULT false,
	`data_leitura` timestamp,
	`criado_em` timestamp DEFAULT (now()),
	CONSTRAINT `alertas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `atendimentos` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`id_cliente` bigint,
	`numero_ticket` varchar(50) NOT NULL,
	`assunto` varchar(255),
	`descricao` text,
	`categoria` varchar(100),
	`prioridade` varchar(50) DEFAULT 'normal',
	`status` varchar(50) DEFAULT 'aberto',
	`responsavel_id` bigint,
	`tempo_resposta_minutos` int,
	`tempo_resolucao_minutos` int,
	`dados_adicionais` json,
	`criado_em` timestamp DEFAULT (now()),
	`atualizado_em` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `atendimentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clientes` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`nome` varchar(255) NOT NULL,
	`email` varchar(320),
	`telefone` varchar(20),
	`documento` varchar(50),
	`tipo_cliente` varchar(50),
	`status` varchar(50) DEFAULT 'ativo',
	`dados_adicionais` json,
	`criado_em` timestamp DEFAULT (now()),
	`atualizado_em` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientes_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_clientes_empresa_documento` UNIQUE(`id_empresa`,`documento`)
);
--> statement-breakpoint
CREATE TABLE `cobrancas` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`id_cliente` bigint NOT NULL,
	`id_transacao` bigint,
	`valor_original` decimal(15,2) NOT NULL,
	`valor_pago` decimal(15,2) DEFAULT '0',
	`data_vencimento` date NOT NULL,
	`data_pagamento` date,
	`status` varchar(50) DEFAULT 'pendente',
	`tentativas_cobranca` int DEFAULT 0,
	`proxima_tentativa` date,
	`motivo_cancelamento` text,
	`criado_em` timestamp DEFAULT (now()),
	`atualizado_em` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cobrancas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `comercial_diario` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`data_referencia` date NOT NULL,
	`novos_leads` int DEFAULT 0,
	`leads_contatados` int DEFAULT 0,
	`leads_qualificados` int DEFAULT 0,
	`propostas_enviadas` int DEFAULT 0,
	`propostas_aceitas` int DEFAULT 0,
	`propostas_recusadas` int DEFAULT 0,
	`vendas_dia` int DEFAULT 0,
	`valor_vendas_dia` decimal(15,2) DEFAULT '0',
	`ticket_medio` decimal(15,2) DEFAULT '0',
	`taxa_conversao` decimal(5,2) DEFAULT '0',
	`metadados` json,
	`criado_em` timestamp DEFAULT (now()),
	CONSTRAINT `comercial_diario_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `configuracoes_empresa` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`chave` varchar(255) NOT NULL,
	`valor` json,
	`descricao` text,
	`criado_em` timestamp DEFAULT (now()),
	`atualizado_em` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `configuracoes_empresa_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_configuracoes_empresa_chave` UNIQUE(`id_empresa`,`chave`)
);
--> statement-breakpoint
CREATE TABLE `conversas` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`id_cliente` bigint,
	`id_atendimento` bigint,
	`tipo_canal` varchar(50),
	`remetente` varchar(255),
	`destinatario` varchar(255),
	`mensagem` text,
	`anexos` json,
	`lida` boolean DEFAULT false,
	`data_leitura` timestamp,
	`criado_em` timestamp DEFAULT (now()),
	CONSTRAINT `conversas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversas_agents` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`id_agent` bigint NOT NULL,
	`id_usuario` bigint,
	`mensagem_usuario` text,
	`resposta_agent` text,
	`contexto_dados` json,
	`tokens_usados` int,
	`tempo_resposta_ms` int,
	`criado_em` timestamp DEFAULT (now()),
	CONSTRAINT `conversas_agents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `departamentos` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`nome` varchar(255) NOT NULL,
	`descricao` text,
	`responsavel_id` bigint,
	`ativo` boolean DEFAULT true,
	`criado_em` timestamp DEFAULT (now()),
	`atualizado_em` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `departamentos_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_departamentos_empresa_nome` UNIQUE(`id_empresa`,`nome`)
);
--> statement-breakpoint
CREATE TABLE `empresas` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`descricao` text,
	`nicho` varchar(100) NOT NULL,
	`logo_url` varchar(500),
	`cores_primarias` json,
	`parametros_customizados` json,
	`ativo` boolean DEFAULT true,
	`criado_em` timestamp DEFAULT (now()),
	`atualizado_em` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `empresas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eventos` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`tipo_evento` varchar(100) NOT NULL,
	`descricao` text,
	`dados_evento` json,
	`criado_em` timestamp DEFAULT (now()),
	CONSTRAINT `eventos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eventos_etapas` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_evento` bigint NOT NULL,
	`numero_etapa` int,
	`nome_etapa` varchar(100),
	`status` varchar(50),
	`data_inicio` timestamp,
	`data_fim` timestamp,
	`metadados` json,
	CONSTRAINT `eventos_etapas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financeiro_diario` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`data_referencia` date NOT NULL,
	`receita_dia` decimal(15,2) DEFAULT '0',
	`despesa_dia` decimal(15,2) DEFAULT '0',
	`saldo_dia` decimal(15,2) DEFAULT '0',
	`saldo_acumulado` decimal(15,2) DEFAULT '0',
	`receita_cartao` decimal(15,2) DEFAULT '0',
	`receita_boleto` decimal(15,2) DEFAULT '0',
	`receita_pix` decimal(15,2) DEFAULT '0',
	`receita_dinheiro` decimal(15,2) DEFAULT '0',
	`cobrancas_vencidas` decimal(15,2) DEFAULT '0',
	`cobrancas_pendentes` decimal(15,2) DEFAULT '0',
	`metadados` json,
	`criado_em` timestamp DEFAULT (now()),
	CONSTRAINT `financeiro_diario_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kpis_diarios` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`data_referencia` date NOT NULL,
	`total_clientes` int DEFAULT 0,
	`novos_clientes` int DEFAULT 0,
	`clientes_ativos` int DEFAULT 0,
	`receita_total` decimal(15,2) DEFAULT '0',
	`receita_paga` decimal(15,2) DEFAULT '0',
	`receita_pendente` decimal(15,2) DEFAULT '0',
	`despesa_total` decimal(15,2) DEFAULT '0',
	`lucro_liquido` decimal(15,2) DEFAULT '0',
	`total_transacoes` int DEFAULT 0,
	`total_atendimentos` int DEFAULT 0,
	`atendimentos_resolvidos` int DEFAULT 0,
	`tempo_medio_resolucao_minutos` int,
	`novos_leads` int DEFAULT 0,
	`leads_qualificados` int DEFAULT 0,
	`conversoes` int DEFAULT 0,
	`taxa_conversao` decimal(5,2) DEFAULT '0',
	`metricas_customizadas` json,
	`criado_em` timestamp DEFAULT (now()),
	`atualizado_em` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kpis_diarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`nome` varchar(255) NOT NULL,
	`email` varchar(320),
	`telefone` varchar(20),
	`origem` varchar(100),
	`status` varchar(50) DEFAULT 'novo',
	`valor_estimado` decimal(15,2),
	`responsavel_id` bigint,
	`dados_adicionais` json,
	`criado_em` timestamp DEFAULT (now()),
	`atualizado_em` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `logs_execucao` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`tipo_log` varchar(50),
	`nivel` varchar(20),
	`mensagem` text,
	`stack_trace` text,
	`dados_adicionais` json,
	`criado_em` timestamp DEFAULT (now()),
	CONSTRAINT `logs_execucao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `operacao_diaria` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`data_referencia` date NOT NULL,
	`total_tarefas` int DEFAULT 0,
	`tarefas_concluidas` int DEFAULT 0,
	`tarefas_pendentes` int DEFAULT 0,
	`total_atendimentos` int DEFAULT 0,
	`atendimentos_abertos` int DEFAULT 0,
	`atendimentos_fechados` int DEFAULT 0,
	`tempo_medio_atendimento_minutos` int,
	`sla_cumprimento` decimal(5,2) DEFAULT '0',
	`metadados` json,
	`criado_em` timestamp DEFAULT (now()),
	CONSTRAINT `operacao_diaria_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `produtos_servicos` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`nome` varchar(255) NOT NULL,
	`descricao` text,
	`tipo` varchar(50),
	`preco_base` decimal(15,2),
	`categoria` varchar(100),
	`ativo` boolean DEFAULT true,
	`metadados` json,
	`criado_em` timestamp DEFAULT (now()),
	`atualizado_em` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `produtos_servicos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `risco_diario` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`data_referencia` date NOT NULL,
	`anomalias_detectadas` int DEFAULT 0,
	`riscos_operacionais` int DEFAULT 0,
	`riscos_financeiros` int DEFAULT 0,
	`riscos_comerciais` int DEFAULT 0,
	`clientes_em_atraso` int DEFAULT 0,
	`valor_em_atraso` decimal(15,2) DEFAULT '0',
	`taxa_churn` decimal(5,2) DEFAULT '0',
	`clientes_perdidos` int DEFAULT 0,
	`alertas_criticos` int DEFAULT 0,
	`alertas_avisos` int DEFAULT 0,
	`metadados` json,
	`criado_em` timestamp DEFAULT (now()),
	CONSTRAINT `risco_diario_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transacoes_financeiras` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`id_cliente` bigint,
	`tipo` varchar(50) NOT NULL,
	`categoria` varchar(100),
	`descricao` text,
	`valor` decimal(15,2) NOT NULL,
	`moeda` varchar(3) DEFAULT 'BRL',
	`data_transacao` date NOT NULL,
	`data_vencimento` date,
	`status` varchar(50) DEFAULT 'pendente',
	`metodo_pagamento` varchar(100),
	`referencia_externa` varchar(255),
	`criado_em` timestamp DEFAULT (now()),
	`atualizado_em` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transacoes_financeiras_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webhooks_n8n` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`id_empresa` bigint NOT NULL,
	`nome` varchar(255) NOT NULL,
	`url_webhook` varchar(500) NOT NULL,
	`tipo_workflow` varchar(100),
	`ativo` boolean DEFAULT true,
	`ultima_execucao` timestamp,
	`status_ultima_execucao` varchar(50),
	`criado_em` timestamp DEFAULT (now()),
	`atualizado_em` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `webhooks_n8n_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `agents` ADD CONSTRAINT `agents_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `alertas` ADD CONSTRAINT `alertas_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `atendimentos` ADD CONSTRAINT `atendimentos_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `atendimentos` ADD CONSTRAINT `atendimentos_id_cliente_clientes_id_fk` FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clientes` ADD CONSTRAINT `clientes_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cobrancas` ADD CONSTRAINT `cobrancas_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cobrancas` ADD CONSTRAINT `cobrancas_id_cliente_clientes_id_fk` FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `cobrancas` ADD CONSTRAINT `cobrancas_id_transacao_transacoes_financeiras_id_fk` FOREIGN KEY (`id_transacao`) REFERENCES `transacoes_financeiras`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `comercial_diario` ADD CONSTRAINT `comercial_diario_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `configuracoes_empresa` ADD CONSTRAINT `configuracoes_empresa_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversas` ADD CONSTRAINT `conversas_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversas` ADD CONSTRAINT `conversas_id_cliente_clientes_id_fk` FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversas` ADD CONSTRAINT `conversas_id_atendimento_atendimentos_id_fk` FOREIGN KEY (`id_atendimento`) REFERENCES `atendimentos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversas_agents` ADD CONSTRAINT `conversas_agents_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `conversas_agents` ADD CONSTRAINT `conversas_agents_id_agent_agents_id_fk` FOREIGN KEY (`id_agent`) REFERENCES `agents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `departamentos` ADD CONSTRAINT `departamentos_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `eventos` ADD CONSTRAINT `eventos_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `eventos_etapas` ADD CONSTRAINT `eventos_etapas_id_evento_eventos_id_fk` FOREIGN KEY (`id_evento`) REFERENCES `eventos`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `financeiro_diario` ADD CONSTRAINT `financeiro_diario_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `kpis_diarios` ADD CONSTRAINT `kpis_diarios_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `logs_execucao` ADD CONSTRAINT `logs_execucao_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `operacao_diaria` ADD CONSTRAINT `operacao_diaria_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `produtos_servicos` ADD CONSTRAINT `produtos_servicos_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `risco_diario` ADD CONSTRAINT `risco_diario_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transacoes_financeiras` ADD CONSTRAINT `transacoes_financeiras_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `transacoes_financeiras` ADD CONSTRAINT `transacoes_financeiras_id_cliente_clientes_id_fk` FOREIGN KEY (`id_cliente`) REFERENCES `clientes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `webhooks_n8n` ADD CONSTRAINT `webhooks_n8n_id_empresa_empresas_id_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_alertas_empresa_lido` ON `alertas` (`id_empresa`,`lido`);--> statement-breakpoint
CREATE INDEX `idx_atendimentos_empresa_status` ON `atendimentos` (`id_empresa`,`status`);--> statement-breakpoint
CREATE INDEX `idx_clientes_empresa` ON `clientes` (`id_empresa`);--> statement-breakpoint
CREATE INDEX `idx_clientes_status` ON `clientes` (`status`);--> statement-breakpoint
CREATE INDEX `idx_cobrancas_empresa_status` ON `cobrancas` (`id_empresa`,`status`);--> statement-breakpoint
CREATE INDEX `idx_comercial_diario_empresa_data` ON `comercial_diario` (`id_empresa`,`data_referencia`);--> statement-breakpoint
CREATE INDEX `idx_conversas_empresa` ON `conversas` (`id_empresa`);--> statement-breakpoint
CREATE INDEX `idx_conversas_agents_empresa` ON `conversas_agents` (`id_empresa`);--> statement-breakpoint
CREATE INDEX `idx_departamentos_empresa` ON `departamentos` (`id_empresa`);--> statement-breakpoint
CREATE INDEX `idx_empresas_nicho` ON `empresas` (`nicho`);--> statement-breakpoint
CREATE INDEX `idx_eventos_empresa` ON `eventos` (`id_empresa`);--> statement-breakpoint
CREATE INDEX `idx_financeiro_diario_empresa_data` ON `financeiro_diario` (`id_empresa`,`data_referencia`);--> statement-breakpoint
CREATE INDEX `idx_kpis_diarios_empresa_data` ON `kpis_diarios` (`id_empresa`,`data_referencia`);--> statement-breakpoint
CREATE INDEX `idx_leads_empresa` ON `leads` (`id_empresa`);--> statement-breakpoint
CREATE INDEX `idx_leads_status` ON `leads` (`status`);--> statement-breakpoint
CREATE INDEX `idx_logs_execucao_empresa_nivel` ON `logs_execucao` (`id_empresa`,`nivel`);--> statement-breakpoint
CREATE INDEX `idx_operacao_diaria_empresa_data` ON `operacao_diaria` (`id_empresa`,`data_referencia`);--> statement-breakpoint
CREATE INDEX `idx_produtos_empresa` ON `produtos_servicos` (`id_empresa`);--> statement-breakpoint
CREATE INDEX `idx_risco_diario_empresa_data` ON `risco_diario` (`id_empresa`,`data_referencia`);--> statement-breakpoint
CREATE INDEX `idx_transacoes_empresa_data` ON `transacoes_financeiras` (`id_empresa`,`data_transacao`);--> statement-breakpoint
CREATE INDEX `idx_transacoes_status` ON `transacoes_financeiras` (`status`);--> statement-breakpoint
CREATE INDEX `idx_webhooks_n8n_empresa` ON `webhooks_n8n` (`id_empresa`);