import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  UserPlus, 
  Users, 
  UserCheck, 
  UserX, 
  AlertCircle, 
  TrendingUp, 
  PieChart as PieChartIcon,
  Clock,
  FileWarning,
  CheckCircle2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from "recharts";

// Dados simulados para os gráficos
const growthData = [
  { name: 'Set', ativos: 1200, novos: 45 },
  { name: 'Out', ativos: 1230, novos: 52 },
  { name: 'Nov', ativos: 1255, novos: 38 },
  { name: 'Dez', ativos: 1280, novos: 60 },
  { name: 'Jan', ativos: 1310, novos: 48 },
  { name: 'Fev', ativos: 1345, novos: 55 },
];

const churnData = [
  { name: 'Financeiro', value: 45 },
  { name: 'Falta de Uso', value: 25 },
  { name: 'Mudança', value: 15 },
  { name: 'Outros', value: 15 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const pendencias = [
  { id: 1, nome: "João Silva", pendencia: "Comprovante de Residência", dias: 5, status: "Crítico" },
  { id: 2, nome: "Maria Oliveira", pendencia: "Termo de Adesão assinado", dias: 3, status: "Atenção" },
  { id: 3, nome: "Carlos Santos", pendencia: "Foto do Veículo", dias: 2, status: "Normal" },
  { id: 4, nome: "Ana Costa", pendencia: "RG/CNH", dias: 1, status: "Normal" },
];

export default function Cadastro() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <UserPlus className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Setor de Cadastro</h1>
          <p className="text-gray-600 mt-1">Inteligência de Dados e Gestão do Quadro Social</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Total de Ativos</p>
                <h3 className="text-2xl font-bold text-gray-900">1.345</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" /> +2.4% vs mês anterior
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Conversão (Mês)</p>
                <h3 className="text-2xl font-bold text-gray-900">84%</h3>
                <p className="text-xs text-gray-500 mt-1">Meta: 80%</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Pendências Doc.</p>
                <h3 className="text-2xl font-bold text-gray-900">28</h3>
                <p className="text-xs text-amber-600 mt-1">12 casos críticos (mais de 5 dias)</p>
              </div>
              <FileWarning className="w-8 h-8 text-amber-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Evasão (Churn)</p>
                <h3 className="text-2xl font-bold text-gray-900">1.2%</h3>
                <p className="text-xs text-red-600 mt-1">Abaixo da média setorial</p>
              </div>
              <UserX className="w-8 h-8 text-red-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Crescimento do Quadro Social
            </CardTitle>
            <CardDescription>Evolução de associados ativos e novas adesões</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="novos" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Novas Adesões" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-purple-500" />
              Motivos de Desligamento
            </CardTitle>
            <CardDescription>Análise qualitativa da perda de associados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={churnData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {churnData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-1/2 space-y-2">
                {churnData.map((item, index) => (
                  <div key={item.name} className="flex items-center text-sm">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-gray-600">{item.name}:</span>
                    <span className="font-bold ml-1">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality & SLA Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Documents Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Gestão de Qualidade Cadastral</CardTitle>
              <CardDescription>Documentos pendentes que impedem a ativação total</CardDescription>
            </div>
            <button className="text-sm text-blue-600 hover:underline">Ver todos</button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Associado</th>
                    <th className="px-4 py-3">Documento Faltante</th>
                    <th className="px-4 py-3 text-center">Dias</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendencias.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{p.nome}</td>
                      <td className="px-4 py-3 text-gray-600">{p.pendencia}</td>
                      <td className="px-4 py-3 text-center">{p.dias}d</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'Crítico' ? 'bg-red-100 text-red-700' :
                          p.status === 'Atenção' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* SLA & Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Eficiência Operacional
            </CardTitle>
            <CardDescription>SLA do setor de cadastro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tempo de Ativação</span>
                <span className="font-bold text-green-600">1.8 dias</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-[10px] text-gray-400">Meta: Abaixo de 2 dias</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Qualidade da Base</span>
                <span className="font-bold text-blue-600">92%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <p className="text-[10px] text-gray-400">Dados validados e completos</p>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold mb-3">Alertas de Decisão</h4>
              <div className="space-y-3">
                <div className="flex gap-3 p-2 bg-amber-50 rounded-md">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800">
                    <strong>Recadastramento:</strong> 15% da base não atualiza dados há mais de 12 meses.
                  </p>
                </div>
                <div className="flex gap-3 p-2 bg-blue-50 rounded-md">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <p className="text-xs text-blue-800">
                    <strong>Processo:</strong> Digitalização de termos reduziu SLA em 30%.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
