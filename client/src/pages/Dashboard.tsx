import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Users, DollarSign, AlertCircle, Car, Shield, FileText, Loader, Download } from "lucide-react";
import { useDashboardStats } from "@/_core/hooks/useDashboardStats";
import DashboardFilters, { DashboardFiltersState } from "@/components/DashboardFilters";
import { exportDashboardKPIs, exportToCSV, exportToExcel } from "@/lib/exportData";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const VariationBadge = ({ value }: { value: number }) => {
  const isPositive = value >= 0;
  const icon = isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
  const color = isPositive ? "text-green-600" : "text-red-600";
  
  return (
    <p className={`text-xs ${color} flex items-center gap-1 mt-1`}>
      {icon}
      {isPositive ? "+" : ""}{value.toFixed(1)}% vs mês anterior
    </p>
  );
};

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filters, setFilters] = useState<DashboardFiltersState | null>(null);
  const { stats, loading, error } = useDashboardStats();

  const handleExportKPIs = (format: 'csv' | 'excel') => {
    if (!stats) return;
    const data = exportDashboardKPIs(stats);
    if (format === 'csv') {
      exportToCSV(data);
    } else {
      exportToExcel(data);
    }
  };

  const handleFiltersChange = (newFilters: DashboardFiltersState) => {
    setFilters(newFilters);
    // TODO: Aplicar filtros aos dados do dashboard
  };

  const handleResetFilters = () => {
    setFilters(null);
    // TODO: Resetar filtros
  };

  const chartDataCombined = useMemo(() => {
    if (!stats) return [];
    const combined = new Map<string, { name: string; receita: number; sinistros: number }>();

    stats.mensalidadesPorMes.forEach(m => {
      const entry = combined.get(m.mes) || { name: m.mes, receita: 0, sinistros: 0 };
      entry.receita = m.pagas;
      combined.set(m.mes, entry);
    });

    stats.sinistrosPorMes.forEach(s => {
      const entry = combined.get(s.mes) || { name: s.mes, receita: 0, sinistros: 0 };
      entry.sinistros = s.valor;
      combined.set(s.mes, entry);
    });

    return Array.from(combined.values());
  }, [stats]);

  const funnelData = [
    { name: "Leads", value: 245, color: "#3b82f6" },
    { name: "Qualificados", value: 178, color: "#10b981" },
    { name: "Convertidos", value: 89, color: "#f59e0b" },
  ];

  const sinistrosTypeData = [
    { name: "Colisão", value: 45 },
    { name: "Roubo/Furto", value: 28 },
    { name: "Vidros", value: 15 },
    { name: "Incêndio", value: 8 },
    { name: "Outros", value: 12 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <p className="ml-2 text-slate-600">Carregando dados do dashboard...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-screen w-full text-red-600">
        <AlertCircle className="w-8 h-8" />
        <p className="ml-2">Erro ao carregar dados do dashboard: {error?.message || "Desconhecido"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard - Proteção Veicular</h1>
          <p className="text-gray-600 mt-1">Visão geral de performance e KPIs</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => handleExportKPIs('csv')}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              CSV
            </Button>
            <Button
              onClick={() => handleExportKPIs('excel')}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <DashboardFilters onFiltersChange={handleFiltersChange} onReset={handleResetFilters} />

      {/* Critical Alerts */}
      {stats.inadimplenciaRate > 10 || stats.sinistralidade > 25 ? (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              Alertas Críticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.sinistralidade > 25 && (
                <div className="text-sm text-red-600">
                  <strong>Sinistralidade Elevada:</strong> Índice de sinistralidade ({stats.sinistralidade.toFixed(2)}%) acima da meta (25%) no mês atual.
                </div>
              )}
              {stats.inadimplenciaRate > 10 && (
                <div className="text-sm text-red-600">
                  <strong>Inadimplência em Alta:</strong> Taxa de inadimplência ({stats.inadimplenciaRate.toFixed(2)}%) acima do limite de 10%.
                </div>
              )}
              {stats.sinistrosAbertos > 0 && (
                <div className="text-sm text-red-600">
                  <strong>Sinistros Pendentes:</strong> {stats.sinistrosAbertos} sinistros aguardando análise.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* KPI Cards com Variações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Associados Ativos</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.associadosAtivos.toLocaleString("pt-BR")}</div>
            <VariationBadge value={stats.variacaoAssociadosAtivos} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Associados</CardTitle>
            <Car className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssociados.toLocaleString("pt-BR")}</div>
            <VariationBadge value={stats.variacaoAssociados} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receita Mensalidades</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.valorMensalidadesPagas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <VariationBadge value={stats.variacaoReceita} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sinistros Pagos</CardTitle>
            <Shield className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.valorTotalPagoSinistros.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {stats.sinistrosPagos} sinistros no período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Índice Sinistralidade</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sinistralidade.toFixed(2)}%</div>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              {stats.sinistralidade > 25 ? "Acima da meta (25%)" : "Dentro da meta"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita vs Sinistros (Mensal)</CardTitle>
            <CardDescription>Últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartDataCombined}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                />
                <Legend />
                <Bar dataKey="receita" fill="#10b981" name="Receita (Pagas)" />
                <Bar dataKey="sinistros" fill="#ef4444" name="Sinistros (Valor Pago)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Sinistros por Tipo</CardTitle>
            <CardDescription>Período atual (Mock)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sinistrosTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sinistrosTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Funil de Conversão</CardTitle>
            <CardDescription>Leads → Associados (Mock)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${(item.value / funnelData[0].value) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">
                  Taxa de Conversão: <strong className="text-gray-900">36.3%</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="w-5 h-5" />
              Riscos Detectados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Sinistros Pendentes</span>
                <span className="text-2xl font-bold text-orange-700">{stats.sinistrosAbertos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Inadimplência</span>
                <span className="text-lg font-semibold text-orange-700">
                  {stats.valorMensalidadesAtrasadas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Taxa de Inadimplência</span>
                <span className="text-2xl font-bold text-orange-700">{stats.inadimplenciaRate.toFixed(2)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <FileText className="w-5 h-5" />
              Atendimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Associados Ativos</span>
                <span className="text-2xl font-bold text-blue-700">{stats.associadosAtivos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Associados Cancelados</span>
                <span className="text-2xl font-bold text-red-600">{stats.associadosCancelados}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Churn Rate</span>
                <span className="text-lg font-semibold text-blue-700">{stats.churnRate.toFixed(2)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
