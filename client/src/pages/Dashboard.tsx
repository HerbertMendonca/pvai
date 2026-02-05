import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, DollarSign, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [idEmpresa] = useState(1); // TODO: Get from user context

  // Fetch KPIs
  const kpisQuery = trpc.kpis.getDiarios.useQuery({
    idEmpresa,
    data: selectedDate,
  });

  const financeirosQuery = trpc.kpis.getFinanceiro.useQuery({
    idEmpresa,
    data: selectedDate,
  });

  const operacaoQuery = trpc.kpis.getOperacao.useQuery({
    idEmpresa,
    data: selectedDate,
  });

  const comercialQuery = trpc.kpis.getComercial.useQuery({
    idEmpresa,
    data: selectedDate,
  });

  const riscoQuery = trpc.kpis.getRisco.useQuery({
    idEmpresa,
    data: selectedDate,
  });

  const alertasQuery = trpc.alerts.getNaoLidas.useQuery({
    idEmpresa,
  });

  // Sample data for charts
  const chartData = [
    { name: "Seg", receita: 4000, despesa: 2400 },
    { name: "Ter", receita: 3000, despesa: 1398 },
    { name: "Qua", receita: 2000, despesa: 9800 },
    { name: "Qui", receita: 2780, despesa: 3908 },
    { name: "Sex", receita: 1890, despesa: 4800 },
    { name: "Sab", receita: 2390, despesa: 3800 },
    { name: "Dom", receita: 2490, despesa: 4300 },
  ];

  const conversionData = [
    { name: "Leads", value: kpisQuery.data?.novosLeads || 0 },
    { name: "Qualificados", value: kpisQuery.data?.leadsQualificados || 0 },
    { name: "Convertidos", value: kpisQuery.data?.conversoes || 0 },
  ];

  const isLoading = kpisQuery.isLoading || financeirosQuery.isLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral de performance e KPIs</p>
        </div>
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Critical Alerts */}
      {alertasQuery.data && alertasQuery.data.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              Alertas Críticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertasQuery.data.slice(0, 3).map((alerta) => (
                <div key={alerta.id} className="text-sm text-red-600">
                  <strong>{alerta.titulo}:</strong> {alerta.descricao}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Receita Total */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {(kpisQuery.data?.receitaTotal || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-green-600 mt-1">+12% vs mês anterior</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        {/* Clientes Ativos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{kpisQuery.data?.clientesAtivos || 0}</p>
                <p className="text-xs text-blue-600 mt-1">+{kpisQuery.data?.novosClientes || 0} novos</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Taxa de Conversão */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{Number(kpisQuery.data?.taxaConversao || 0).toFixed(1)}%</p>
                <p className="text-xs text-orange-600 mt-1">Meta: 5%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        {/* Atendimentos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Atendimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{operacaoQuery.data?.totalAtendimentos || 0}</p>
                <p className="text-xs text-purple-600 mt-1">
                  {operacaoQuery.data?.atendimentosFechados || 0} resolvidos
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        {/* Tempo Médio */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Tempo Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {operacaoQuery.data?.tempoMedioAtendimentoMinutos || 0}m
                </p>
                <p className="text-xs text-gray-600 mt-1">por atendimento</p>
              </div>
              <Clock className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Receita vs Despesa</CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="receita" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Funil de Conversão</CardTitle>
            <CardDescription>Leads até Conversão</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Riscos Detectados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{riscoQuery.data?.anomaliasDetectadas || 0}</p>
            <p className="text-xs text-gray-600 mt-2">Anomalias no período</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Clientes em Atraso</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{riscoQuery.data?.clientesEmAtraso || 0}</p>
            <p className="text-xs text-gray-600 mt-2">
              R$ {(riscoQuery.data?.valorEmAtraso || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Taxa de Churn</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{Number(riscoQuery.data?.taxaChurn || 0).toFixed(1)}%</p>
            <p className="text-xs text-gray-600 mt-2">{riscoQuery.data?.clientesPerdidos || 0} clientes perdidos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
