/**
 * Utilitários para exportação de dados em CSV e Excel
 */

export interface ExportData {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
}

/**
 * Exportar dados para CSV
 */
export function exportToCSV(data: ExportData) {
  const { headers, rows, filename } = data;

  // Criar conteúdo CSV
  const csvContent = [
    headers.join(","),
    ...rows.map(row => 
      row.map(cell => {
        // Escapar aspas e envolver em aspas se contiver vírgula
        const cellStr = String(cell);
        if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(",")
    ),
  ].join("\n");

  // Criar blob e download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exportar dados para Excel (usando formato CSV com BOM para melhor compatibilidade)
 */
export function exportToExcel(data: ExportData) {
  const { headers, rows, filename } = data;

  // Criar conteúdo CSV com BOM para melhor compatibilidade com Excel
  const csvContent = [
    headers.join("\t"),
    ...rows.map(row => row.join("\t")),
  ].join("\n");

  // Adicionar BOM para UTF-8
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.xls`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exportar dados de KPIs do Dashboard
 */
export function exportDashboardKPIs(stats: any) {
  const headers = [
    "Métrica",
    "Valor Atual",
    "Valor Anterior",
    "Variação (%)",
  ];

  const rows = [
    ["Associados Ativos", stats.associadosAtivos, stats.associadosAtivosAnterior, stats.variacaoAssociadosAtivos.toFixed(2)],
    ["Total Associados", stats.totalAssociados, stats.totalAssociadosAnterior, stats.variacaoAssociados.toFixed(2)],
    ["Receita Mensalidades", stats.valorMensalidadesPagas.toFixed(2), stats.valorMensalidadesPagasAnterior.toFixed(2), stats.variacaoReceita.toFixed(2)],
    ["Sinistros Abertos", stats.sinistrosAbertos, stats.sinistrosAbertosAnterior, stats.variacaoSinistros.toFixed(2)],
    ["Sinistros Pagos", stats.sinistrosPagos, "-", "-"],
    ["Valor Sinistros Pagos", stats.valorTotalPagoSinistros.toFixed(2), "-", "-"],
    ["Sinistralidade (%)", stats.sinistralidade.toFixed(2), "-", "-"],
    ["Inadimplência (%)", stats.inadimplenciaRate.toFixed(2), "-", "-"],
    ["Churn Rate (%)", stats.churnRate.toFixed(2), "-", "-"],
    ["LTV", stats.ltv.toFixed(2), "-", "-"],
  ];

  return { headers, rows, filename: `dashboard-kpis-${new Date().toISOString().split('T')[0]}` };
}

/**
 * Exportar dados de Associados
 */
export function exportAssociados(associados: any[]) {
  const headers = ["ID", "Nome", "CPF/CNPJ", "Email", "Telefone", "Status", "Data Adesão", "Plano", "Valor Mensalidade"];

  const rows = associados.map(a => [
    a.id_associado_externo || "-",
    a.nome || "-",
    a.cpf_cnpj || "-",
    a.email || "-",
    a.telefone || "-",
    a.status || "-",
    a.data_adesao ? new Date(a.data_adesao).toLocaleDateString("pt-BR") : "-",
    a.plano || "-",
    a.valor_mensalidade ? parseFloat(a.valor_mensalidade).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "-",
  ]);

  return { headers, rows, filename: `associados-${new Date().toISOString().split('T')[0]}` };
}

/**
 * Exportar dados de Sinistros
 */
export function exportSinistros(sinistros: any[]) {
  const headers = ["ID", "Associado", "Veículo", "Tipo", "Data Ocorrência", "Status", "Valor Sinistro", "Valor Pago"];

  const rows = sinistros.map(s => [
    s.id_sinistro_externo || "-",
    s.id_associado_externo || "-",
    s.id_veiculo_externo || "-",
    s.tipo || "-",
    s.data_ocorrencia ? new Date(s.data_ocorrencia).toLocaleDateString("pt-BR") : "-",
    s.status || "-",
    s.valor_sinistro ? parseFloat(s.valor_sinistro).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "-",
    s.valor_pago ? parseFloat(s.valor_pago).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "-",
  ]);

  return { headers, rows, filename: `sinistros-${new Date().toISOString().split('T')[0]}` };
}

/**
 * Exportar dados de Mensalidades
 */
export function exportMensalidades(mensalidades: any[]) {
  const headers = ["ID", "Associado", "Mês Referência", "Valor", "Data Vencimento", "Data Pagamento", "Status"];

  const rows = mensalidades.map(m => [
    m.id_mensalidade_externo || "-",
    m.id_associado_externo || "-",
    m.mes_referencia ? new Date(m.mes_referencia).toLocaleDateString("pt-BR") : "-",
    m.valor ? parseFloat(m.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "-",
    m.data_vencimento ? new Date(m.data_vencimento).toLocaleDateString("pt-BR") : "-",
    m.data_pagamento ? new Date(m.data_pagamento).toLocaleDateString("pt-BR") : "-",
    m.status || "-",
  ]);

  return { headers, rows, filename: `mensalidades-${new Date().toISOString().split('T')[0]}` };
}
