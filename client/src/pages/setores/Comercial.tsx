import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  Target, 
  Briefcase, 
  ArrowUpRight, 
  PieChart as PieChartIcon,
  BarChart3,
  UserCheck,
  Zap,
  Clock
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
  FunnelChart,
  Funnel,
  LabelList
} from "recharts";

const funnelData = [
  { value: 1000, name: 'Leads', fill: '#94a3b8' },
  { value: 600, name: 'Qualificados', fill: '#60a5fa' },
  { value: 300, name: 'Propostas', fill: '#3b82f6' },
  { value: 150, name: 'Fechamentos', fill: '#10b981' },
];

const performanceVendedores = [
  { name: 'Ricardo', vendas: 45, meta: 40 },
  { name: 'Ana', vendas: 38, meta: 40 },
  { name: 'Beatriz', vendas: 32, meta: 30 },
  { name: 'Marcos', vendas: 28, meta: 35 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const leadsRecentes = [
  { id: 1, empresa: "Frota Logística S.A", valor: "R$ 12.500", consultor: "Ricardo", status: "Proposta" },
  { id: 2, empresa: "Auto Peças Silva", valor: "R$ 2.800", consultor: "Ana", status: "Qualificado" },
  { id: 3, empresa: "Cooperativa de Táxi", valor: "R$ 45.000", consultor: "Beatriz", status: "Negociação" },
  { id: 4, empresa: "Distribuidora Sul", valor: "R$ 8.200", consultor: "Marcos", status: "Lead" },
];

export default function Comercial() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Briefcase className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Setor Comercial</h1>
          <p className="text-gray-600 mt-1">Gestão de Vendas e Expansão do Quadro Social</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Vendas Mês</p>
                <h3 className="text-2xl font-bold text-gray-900">143</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +12% vs mês anterior
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Taxa de Conversão</p>
                <h3 className="text-2xl font-bold text-gray-900">15%</h3>
                <p className="text-xs text-blue-600 mt-1">Lead para Venda</p>
              </div>
              <Zap className="w-8 h-8 text-amber-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Pipeline Ativo</p>
                <h3 className="text-2xl font-bold text-gray-900">R$ 285k</h3>
                <p className="text-xs text-gray-500 mt-1">45 propostas em aberto</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">CAC Médio</p>
                <h3 className="text-2xl font-bold text-gray-900">R$ 145</h3>
                <p className="text-xs text-emerald-600 mt-1">Custo de Aquisição</p>
              </div>
              <Users className="w-8 h-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Funil de Vendas</CardTitle>
            <CardDescription>Eficiência em cada etapa da jornada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                  >
                    <LabelList position="right" fill="#64748b" dataKey="name" stroke="none" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance da Equipe</CardTitle>
            <CardDescription>Vendas realizadas vs. Meta individual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceVendedores}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="vendas" fill="#3b82f6" name="Vendas" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="meta" fill="#e2e8f0" name="Meta" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Negociações em Destaque</CardTitle>
            <CardDescription>Oportunidades de alto valor no pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Empresa/Lead</th>
                    <th className="px-4 py-3">Valor Est.</th>
                    <th className="px-4 py-3">Consultor</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leadsRecentes.map((l) => (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{l.empresa}</td>
                      <td className="px-4 py-3 text-blue-600 font-bold">{l.valor}</td>
                      <td className="px-4 py-3 text-gray-600">{l.consultor}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          l.status === 'Negociação' ? 'bg-amber-100 text-amber-700' :
                          l.status === 'Proposta' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Tempo de Resposta
            </CardTitle>
            <CardDescription>Média de primeiro contato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-4">
              <h4 className="text-4xl font-bold text-blue-600">14 min</h4>
              <p className="text-sm text-gray-500">Média de atendimento</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Dentro do SLA</span>
                <span className="font-bold">92%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold mb-2">Principais Origens</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Google Ads</span>
                  <span className="font-bold">45%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Indicação</span>
                  <span className="font-bold">30%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
