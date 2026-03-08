import { SupabaseClient } from "@supabase/supabase-js";

export interface DataContext {
  kpis: string;
  sinistros: string;
  mensalidades: string;
  associados: string;
  alertas: string;
}

export class RAGService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Busca dados de KPIs do período atual para contexto da IA.
   * @param id_empresa ID da empresa para multi-tenancy.
   * @returns String formatada com informações de KPIs.
   */
  private async fetchKPIsContext(id_empresa: string): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from("kpis_diarios")
        .select("*")
        .eq("id_empresa", id_empresa)
        .order("data", { ascending: false })
        .limit(30);

      if (error || !data || data.length === 0) {
        return "Nenhum dado de KPI disponível.";
      }

      // Formata os dados de KPI para um contexto legível
      const kpiSummary = data.slice(0, 5).map((kpi: any) => {
        return `Data: ${kpi.data}, Sinistralidade: ${kpi.sinistralidade}%, Churn: ${kpi.churn_rate}%, Inadimplência: ${kpi.inadimplencia}%`;
      }).join("\n");

      return `Últimos KPIs do período:\n${kpiSummary}`;
    } catch (error) {
      console.error("Erro ao buscar KPIs:", error);
      return "Erro ao buscar dados de KPIs.";
    }
  }

  /**
   * Busca dados de sinistros recentes para contexto da IA.
   * @param id_empresa ID da empresa para multi-tenancy.
   * @returns String formatada com informações de sinistros.
   */
  private async fetchSinistrosContext(id_empresa: string): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from("sinistros_dados")
        .select("*")
        .eq("id_empresa", id_empresa)
        .order("data_ocorrencia", { ascending: false })
        .limit(10);

      if (error || !data || data.length === 0) {
        return "Nenhum sinistro registrado.";
      }

      const sinistrosSummary = data.map((sinistro: any) => {
        return `ID: ${sinistro.id_sinistro_externo}, Tipo: ${sinistro.tipo}, Status: ${sinistro.status}, Valor: R$ ${sinistro.valor_sinistro}`;
      }).join("\n");

      return `Últimos Sinistros:\n${sinistrosSummary}`;
    } catch (error) {
      console.error("Erro ao buscar sinistros:", error);
      return "Erro ao buscar dados de sinistros.";
    }
  }

  /**
   * Busca dados de mensalidades para contexto da IA.
   * @param id_empresa ID da empresa para multi-tenancy.
   * @returns String formatada com informações de mensalidades.
   */
  private async fetchMensalidadesContext(id_empresa: string): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from("mensalidades_dados")
        .select("*")
        .eq("id_empresa", id_empresa)
        .eq("status", "atrasada")
        .order("data_vencimento", { ascending: true })
        .limit(10);

      if (error || !data || data.length === 0) {
        return "Nenhuma mensalidade atrasada.";
      }

      const mensalidadesSummary = data.map((msg: any) => {
        return `Associado: ${msg.id_associado_externo}, Valor: R$ ${msg.valor}, Vencimento: ${msg.data_vencimento}`;
      }).join("\n");

      return `Mensalidades Atrasadas:\n${mensalidadesSummary}`;
    } catch (error) {
      console.error("Erro ao buscar mensalidades:", error);
      return "Erro ao buscar dados de mensalidades.";
    }
  }

  /**
   * Busca dados de associados para contexto da IA.
   * @param id_empresa ID da empresa para multi-tenancy.
   * @returns String formatada com informações de associados.
   */
  private async fetchAssociadosContext(id_empresa: string): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from("associados_snapshot")
        .select("status, COUNT(*) as count")
        .eq("id_empresa", id_empresa)
        .group_by("status");

      if (error || !data || data.length === 0) {
        return "Nenhum dado de associados disponível.";
      }

      const associadosSummary = data.map((item: any) => {
        return `${item.status}: ${item.count} associados`;
      }).join("\n");

      return `Distribuição de Associados:\n${associadosSummary}`;
    } catch (error) {
      console.error("Erro ao buscar associados:", error);
      return "Erro ao buscar dados de associados.";
    }
  }

  /**
   * Busca alertas recentes para contexto da IA.
   * @param id_empresa ID da empresa para multi-tenancy.
   * @returns String formatada com informações de alertas.
   */
  private async fetchAlertasContext(id_empresa: string): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from("alertas")
        .select("*")
        .eq("id_empresa", id_empresa)
        .eq("status", "aberto")
        .order("data_criacao", { ascending: false })
        .limit(5);

      if (error || !data || data.length === 0) {
        return "Nenhum alerta aberto.";
      }

      const alertasSummary = data.map((alerta: any) => {
        return `Tipo: ${alerta.tipo}, Severidade: ${alerta.severidade}, Mensagem: ${alerta.mensagem}`;
      }).join("\n");

      return `Alertas Abertos:\n${alertasSummary}`;
    } catch (error) {
      console.error("Erro ao buscar alertas:", error);
      return "Erro ao buscar dados de alertas.";
    }
  }

  /**
   * Busca dados relevantes do Supabase baseado na pergunta do usuário.
   * Utiliza análise simples de palavras-chave para determinar qual contexto buscar.
   * @param id_empresa ID da empresa para multi-tenancy.
   * @param userMessage Mensagem do usuário para análise de contexto.
   * @returns Objeto com contextos de dados relevantes.
   */
  public async fetchRelevantContext(id_empresa: string, userMessage: string): Promise<DataContext> {
    const messageLower = userMessage.toLowerCase();

    // Análise de palavras-chave para determinar qual contexto buscar
    const needsKPIs = /kpi|métrica|performance|índice|taxa|rate|sinistralidade|churn|inadimplência|ltv/i.test(messageLower);
    const needsSinistros = /sinistro|claim|risco|ocorrência|acidente|colisão|roubo|furto/i.test(messageLower);
    const needsMensalidades = /mensalidade|pagamento|receita|faturamento|atrasado|vencimento|inadimplente/i.test(messageLower);
    const needsAssociados = /associado|cliente|membro|aderente|ativo|cancelado|suspenso/i.test(messageLower);
    const needsAlertas = /alerta|aviso|crítico|problema|erro|warning|risco/i.test(messageLower);

    // Busca contextos em paralelo
    const [kpis, sinistros, mensalidades, associados, alertas] = await Promise.all([
      needsKPIs ? this.fetchKPIsContext(id_empresa) : Promise.resolve(""),
      needsSinistros ? this.fetchSinistrosContext(id_empresa) : Promise.resolve(""),
      needsMensalidades ? this.fetchMensalidadesContext(id_empresa) : Promise.resolve(""),
      needsAssociados ? this.fetchAssociadosContext(id_empresa) : Promise.resolve(""),
      needsAlertas ? this.fetchAlertasContext(id_empresa) : Promise.resolve(""),
    ]);

    return { kpis, sinistros, mensalidades, associados, alertas };
  }

  /**
   * Formata o contexto de dados para ser injetado no prompt da IA.
   * @param context Objeto com contextos de dados.
   * @returns String formatada com o contexto completo.
   */
  public formatContextForPrompt(context: DataContext): string {
    const contextParts: string[] = [];

    if (context.kpis) contextParts.push(context.kpis);
    if (context.sinistros) contextParts.push(context.sinistros);
    if (context.mensalidades) contextParts.push(context.mensalidades);
    if (context.associados) contextParts.push(context.associados);
    if (context.alertas) contextParts.push(context.alertas);

    if (contextParts.length === 0) {
      return "Nenhum contexto de dados disponível.";
    }

    return `\n\n--- CONTEXTO DE DADOS DO NEGÓCIO ---\n${contextParts.join("\n\n")}\n--- FIM DO CONTEXTO ---\n`;
  }
}
