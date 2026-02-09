import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, DollarSign, AlertCircle, Car, Shield, FileText } from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data para proteção veicular
  const kpiData = {
    totalAssociadosAtivos: 2847,
    totalVeiculosProtegidos: 3124,
    receitaMensalidades: 1247580.50,
    valorSinistrosPagos: 342150.00,
    inadimplencia: 87450.25,
    sinistrosAbertos: 23,
    sinistrosPagos: 45,
    atendimentosAbertos: 12,
    atendimentosResolvidos: 156,
    indiceSinistralidade: 27.45,
  };

  // Dados para gráfico de receita vs sinistros (últimos 7 dias)
  const chartData = [
    { name: "Seg", receita: 42500, sinistros: 12300 },
    { name: "Ter", receita: 38900, sinistros: 15200 },
    { name: "Qua", receita: 45200, sinistros: 18900 },
    { name: "Qui", receita: 41800, sinistros: 14500 },
    { name: "Sex", receita: 48300, sinistros: 21400 },
    { name: "Sab", receita: 35600, sinistros: 9800 },
    { name: "Dom", receita: 32100, sinistros: 8200 },
  ];

  // Dados para funil de conversão
  const funnelData = [
    { name: "Leads", value: 245, color: "#3b82f6" },
    { name: "Qualificados", value: 178, color: "#10b981" },
    { name: "Convertidos", value: 89, color: "#f59e0b" },
  ];

  // Dados para distribuição de sinistros por tipo
  const sinistrosTypeData = [
    { name: "Colisão", value: 45 },
    { name: "Roubo/Furto", value: 28 },
    { name: "Vidros", value: 15 },
    { name: "Incêndio", value: 8 },
    { name: "Outros", value: 12 },
  ];

  // Alertas críticos mockados
  const alertasCriticos = [
    { id: 1, titulo: "Sinistralidade Elevada", descricao: "Índice de sinistralidade acima de 25% no mês atual" },
    { id: 2, titulo: "Inadimplência em Alta", descricao: "R$ 87.450,25 em mensalidades atrasadas" },
    { id: 3, titulo: "Sinistros Pendentes", descricao: "23 sinistros aguardando análise há mais de 48h" },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard - Proteção Veicular</h1>
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
      {alertasCriticos.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              Alertas Críticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertasCriticos.map((alerta) => (
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Associados Ativos</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalAssociadosAtivos.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +5.2% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Veículos Protegidos</CardTitle>
            <Car className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalVeiculosProtegidos.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +3.8% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Receita Mensalidades</CardTitle>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpiData.receitaMensalidades.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +2.1% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sinistros Pagos</CardTitle>
            <Shield className="w-4 h-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpiData.valorSinistrosPagos.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {kpiData.sinistrosPagos} sinistros no período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Índice Sinistralidade</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.indiceSinistralidade}%</div>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              Acima da meta (25%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita vs Sinistros</CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                />
                <Legend />
                <Bar dataKey="receita" fill="#10b981" name="Receita" />
                <Bar dataKey="sinistros" fill="#ef4444" name="Sinistros" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Sinistros por Tipo</CardTitle>
            <CardDescription>Período atual</CardDescription>
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
            <CardDescription>Leads → Associados</CardDescription>
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
                <span className="text-2xl font-bold text-orange-700">{kpiData.sinistrosAbertos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Inadimplência</span>
                <span className="text-lg font-semibold text-orange-700">
                  {kpiData.inadimplencia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Fraudes Suspeitas</span>
                <span className="text-2xl font-bold text-orange-700">3</span>
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
                <span className="text-sm">Em Aberto</span>
                <span className="text-2xl font-bold text-blue-700">{kpiData.atendimentosAbertos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Resolvidos Hoje</span>
                <span className="text-2xl font-bold text-green-600">{kpiData.atendimentosResolvidos}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tempo Médio</span>
                <span className="text-lg font-semibold text-blue-700">2.3h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
