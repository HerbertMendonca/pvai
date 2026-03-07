import { supabase } from "@/_core/supabase";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export interface DashboardStats {
  // Período Atual
  totalAssociados: number;
  associadosAtivos: number;
  associadosInativos: number;
  associadosSuspensos: number;
  associadosCancelados: number;
  totalSinistros: number;
  sinistrosAbertos: number;
  sinistrosPagos: number;
  valorTotalSinistros: number;
  valorTotalPagoSinistros: number;
  totalMensalidades: number;
  mensalidadesPagas: number;
  mensalidadesPendentes: number;
  mensalidadesAtrasadas: number;
  valorTotalMensalidades: number;
  valorMensalidadesPagas: number;
  valorMensalidadesAtrasadas: number;
  sinistralidade: number;
  churnRate: number;
  ltv: number;
  inadimplenciaRate: number;
  
  // Período Anterior (para comparação)
  totalAssociadosAnterior: number;
  associadosAtivosAnterior: number;
  valorMensalidadesPagasAnterior: number;
  sinistrosAbertosAnterior: number;
  
  // Variações percentuais
  variacaoAssociados: number;
  variacaoAssociadosAtivos: number;
  variacaoReceita: number;
  variacaoSinistros: number;
  
  // Dados para gráficos
  sinistrosPorMes: { mes: string; valor: number }[];
  associadosPorMes: { mes: string; ativos: number; cancelados: number }[];
  mensalidadesPorMes: { mes: string; pagas: number; atrasadas: number }[];
}

interface UseDashboardStatsOptions {
  enabled?: boolean;
  realtimeEnabled?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export function useDashboardStats(options?: UseDashboardStatsOptions) {
  const { enabled = true, realtimeEnabled = true, startDate, endDate } = options ?? {};
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const calculateStats = useCallback(async (associadosData: any[], sinistrosData: any[], mensalidadesData: any[], isPreviousPeriod: boolean = false) => {
    // Associados
    const totalAssociados = associadosData.length;
    const associadosAtivos = associadosData.filter(a => a.status === "ativo").length;
    const associadosInativos = associadosData.filter(a => a.status === "inativo").length;
    const associadosSuspensos = associadosData.filter(a => a.status === "suspenso").length;
    const associadosCancelados = associadosData.filter(a => a.status === "cancelado").length;
    const churnRate = totalAssociados > 0 ? (associadosCancelados / totalAssociados) * 100 : 0;

    // Sinistros
    const totalSinistros = sinistrosData.length;
    const sinistrosAbertos = sinistrosData.filter(s => s.status === "aberto" || s.status === "em_analise" || s.status === "aguardando_documentos").length;
    const sinistrosPagos = sinistrosData.filter(s => s.status === "pago").length;
    const valorTotalSinistros = sinistrosData.reduce((sum, s) => sum + parseFloat(s.valor_sinistro || "0"), 0);
    const valorTotalPagoSinistros = sinistrosData.reduce((sum, s) => sum + parseFloat(s.valor_pago || "0"), 0);

    // Mensalidades
    const totalMensalidades = mensalidadesData.length;
    const mensalidadesPagas = mensalidadesData.filter(m => m.status === "pago").length;
    const mensalidadesPendentes = mensalidadesData.filter(m => m.status === "pendente").length;
    const mensalidadesAtrasadas = mensalidadesData.filter(m => m.status === "atrasado").length;
    const valorTotalMensalidades = mensalidadesData.reduce((sum, m) => sum + parseFloat(m.valor || "0"), 0);
    const valorMensalidadesPagas = mensalidadesData.filter(m => m.status === "pago").reduce((sum, m) => sum + parseFloat(m.valor || "0"), 0);
    const valorMensalidadesAtrasadas = mensalidadesData.filter(m => m.status === "atrasado").reduce((sum, m) => sum + parseFloat(m.valor || "0"), 0);

    // KPIs
    const sinistralidade = valorTotalMensalidades > 0 ? (valorTotalPagoSinistros / valorTotalMensalidades) * 100 : 0;
    const inadimplenciaRate = valorTotalMensalidades > 0 ? (valorMensalidadesAtrasadas / valorTotalMensalidades) * 100 : 0;
    const avgMensalidade = totalAssociados > 0 ? valorTotalMensalidades / totalAssociados : 0;
    const avgCustomerLifetimeMonths = 36;
    const ltv = avgMensalidade * avgCustomerLifetimeMonths;

    // Dados para gráficos (agregação mensal)
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const currentYear = new Date().getFullYear();
    const monthlyDataMap = new Map<string, { mes: string; valor: number; ativos: number; cancelados: number; pagas: number; atrasadas: number }>();

    for (let i = 0; i < 12; i++) {
      const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
      monthlyDataMap.set(monthKey, { mes: monthNames[i], valor: 0, ativos: 0, cancelados: 0, pagas: 0, atrasadas: 0 });
    }

    associadosData.forEach(a => {
      if (a.created_at) {
        const date = new Date(a.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthStats = monthlyDataMap.get(monthKey);
        if (monthStats) {
          if (a.status === "ativo") monthStats.ativos++;
          if (a.status === "cancelado") monthStats.cancelados++;
        }
      }
    });

    sinistrosData.forEach(s => {
      if (s.data_ocorrencia && s.valor_pago) {
        const date = new Date(s.data_ocorrencia);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthStats = monthlyDataMap.get(monthKey);
        if (monthStats) {
          monthStats.valor += parseFloat(s.valor_pago);
        }
      }
    });

    mensalidadesData.forEach(m => {
      if (m.mes_referencia) {
        const date = new Date(m.mes_referencia);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthStats = monthlyDataMap.get(monthKey);
        if (monthStats) {
          if (m.status === "pago") monthStats.pagas++;
          if (m.status === "atrasado") monthStats.atrasadas++;
        }
      }
    });

    const sinistrosPorMes = Array.from(monthlyDataMap.values()).map(m => ({ mes: m.mes, valor: m.valor }));
    const associadosPorMes = Array.from(monthlyDataMap.values()).map(m => ({ mes: m.mes, ativos: m.ativos, cancelados: m.cancelados }));
    const mensalidadesPorMes = Array.from(monthlyDataMap.values()).map(m => ({ mes: m.mes, pagas: m.pagas, atrasadas: m.atrasadas }));

    return {
      totalAssociados,
      associadosAtivos,
      associadosInativos,
      associadosSuspensos,
      associadosCancelados,
      totalSinistros,
      sinistrosAbertos,
      sinistrosPagos,
      valorTotalSinistros,
      valorTotalPagoSinistros,
      totalMensalidades,
      mensalidadesPagas,
      mensalidadesPendentes,
      mensalidadesAtrasadas,
      valorTotalMensalidades,
      valorMensalidadesPagas,
      valorMensalidadesAtrasadas,
      sinistralidade,
      churnRate,
      ltv,
      inadimplenciaRate,
      sinistrosPorMes,
      associadosPorMes,
      mensalidadesPorMes,
    };
  }, []);

  const fetchStats = useCallback(async () => {
    if (!user?.id_empresa || !enabled) {
      setStats(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Determinar datas para período atual e anterior
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Fetch Associados (período atual)
      const { data: associadosData, error: associadosError } = await supabase
        .from("associados_snapshot")
        .select("status, valor_mensalidade, created_at")
        .eq("id_empresa", user.id_empresa)
        .gte("created_at", currentMonthStart.toISOString());
      if (associadosError) throw associadosError;

      // Fetch Associados (período anterior)
      const { data: associadosDataAnterior, error: associadosErrorAnterior } = await supabase
        .from("associados_snapshot")
        .select("status, valor_mensalidade, created_at")
        .eq("id_empresa", user.id_empresa)
        .gte("created_at", previousMonthStart.toISOString())
        .lte("created_at", previousMonthEnd.toISOString());
      if (associadosErrorAnterior) throw associadosErrorAnterior;

      // Fetch Sinistros (período atual)
      const { data: sinistrosData, error: sinistrosError } = await supabase
        .from("sinistros_dados")
        .select("status, valor_sinistro, valor_pago, data_ocorrencia")
        .eq("id_empresa", user.id_empresa)
        .gte("data_ocorrencia", currentMonthStart.toISOString());
      if (sinistrosError) throw sinistrosError;

      // Fetch Sinistros (período anterior)
      const { data: sinistrosDataAnterior, error: sinistrosErrorAnterior } = await supabase
        .from("sinistros_dados")
        .select("status, valor_sinistro, valor_pago, data_ocorrencia")
        .eq("id_empresa", user.id_empresa)
        .gte("data_ocorrencia", previousMonthStart.toISOString())
        .lte("data_ocorrencia", previousMonthEnd.toISOString());
      if (sinistrosErrorAnterior) throw sinistrosErrorAnterior;

      // Fetch Mensalidades (período atual)
      const { data: mensalidadesData, error: mensalidadesError } = await supabase
        .from("mensalidades_dados")
        .select("status, valor, data_pagamento, mes_referencia")
        .eq("id_empresa", user.id_empresa)
        .gte("mes_referencia", currentMonthStart.toISOString());
      if (mensalidadesError) throw mensalidadesError;

      // Fetch Mensalidades (período anterior)
      const { data: mensalidadesDataAnterior, error: mensalidadesErrorAnterior } = await supabase
        .from("mensalidades_dados")
        .select("status, valor, data_pagamento, mes_referencia")
        .eq("id_empresa", user.id_empresa)
        .gte("mes_referencia", previousMonthStart.toISOString())
        .lte("mes_referencia", previousMonthEnd.toISOString());
      if (mensalidadesErrorAnterior) throw mensalidadesErrorAnterior;

      // Calcular stats para período atual
      const statsAtual = await calculateStats(associadosData || [], sinistrosData || [], mensalidadesData || []);

      // Calcular stats para período anterior
      const statsAnterior = await calculateStats(associadosDataAnterior || [], sinistrosDataAnterior || [], mensalidadesDataAnterior || [], true);

      // Calcular variações
      const variacaoAssociados = statsAtual.totalAssociados > 0 
        ? ((statsAtual.totalAssociados - statsAnterior.totalAssociados) / (statsAnterior.totalAssociados || 1)) * 100 
        : 0;
      
      const variacaoAssociadosAtivos = statsAtual.associadosAtivos > 0 
        ? ((statsAtual.associadosAtivos - statsAnterior.associadosAtivos) / (statsAnterior.associadosAtivos || 1)) * 100 
        : 0;
      
      const variacaoReceita = statsAtual.valorMensalidadesPagas > 0 
        ? ((statsAtual.valorMensalidadesPagas - statsAnterior.valorMensalidadesPagasAnterior) / (statsAnterior.valorMensalidadesPagasAnterior || 1)) * 100 
        : 0;
      
      const variacaoSinistros = statsAtual.sinistrosAbertos > 0 
        ? ((statsAtual.sinistrosAbertos - statsAnterior.sinistrosAbertosAnterior) / (statsAnterior.sinistrosAbertosAnterior || 1)) * 100 
        : 0;

      setStats({
        ...statsAtual,
        totalAssociadosAnterior: statsAnterior.totalAssociados,
        associadosAtivosAnterior: statsAnterior.associadosAtivos,
        valorMensalidadesPagasAnterior: statsAnterior.valorMensalidadesPagas,
        sinistrosAbertosAnterior: statsAnterior.sinistrosAbertos,
        variacaoAssociados,
        variacaoAssociadosAtivos,
        variacaoReceita,
        variacaoSinistros,
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch dashboard stats"));
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id_empresa, enabled, calculateStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Real-time Subscriptions
  useEffect(() => {
    if (!realtimeEnabled || !user?.id_empresa) return;

    const subscriptions = [
      supabase
        .channel(`associados:empresa:${user.id_empresa}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "associados_snapshot", filter: `id_empresa=eq.${user.id_empresa}` }, () => {
          fetchStats();
        })
        .subscribe(),
      
      supabase
        .channel(`sinistros:empresa:${user.id_empresa}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "sinistros_dados", filter: `id_empresa=eq.${user.id_empresa}` }, () => {
          fetchStats();
        })
        .subscribe(),
      
      supabase
        .channel(`mensalidades:empresa:${user.id_empresa}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "mensalidades_dados", filter: `id_empresa=eq.${user.id_empresa}` }, () => {
          fetchStats();
        })
        .subscribe(),
    ];

    return () => {
      subscriptions.forEach(sub => supabase.removeChannel(sub));
    };
  }, [realtimeEnabled, user?.id_empresa, fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
