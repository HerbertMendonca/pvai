import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  HandCoins, 
  CalendarClock,
  PhoneCall,
  Mail,
  MessageSquare,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
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
  AreaChart,
  Area
} from "recharts";

// Dados simulados para inadimplência por faixa
const agingData = [
  { name: '0-15 dias', valor: 45000, color: '#3b82f6' },
  { name: '16-30 dias', valor: 28000, color: '#60a5fa' },
  { name: '31-60 dias', valor: 15000, color: '#f59e0b' },
  { name: '61-90 dias', valor: 8500, color: '#f97316' },
  { name: '90+ dias', valor: 12000, color: '#ef4444' },
];

// Evolução da Recuperação
const recoveryData = [
  { mes: 'Set', meta: 80000, realizado: 75000 },
  { mes: 'Out', meta: 85000, realizado: 82000 },
  { mes: 'Nov', meta: 85000, realizado: 88000 },
  { mes: 'Dez', meta: 90000, realizado: 95000 },
  { mes: 'Jan', meta: 95000, realizado: 91000 },
  { mes: 'Fev', meta: 95000, realizado: 98000 },
];

const COLORS = ['#3b82f6', '#60a5fa', '#f59e0b', '#f97316', '#ef4444'];

const devedoresPrioritarios = [
  { id: 1, associado: "Transportadora Rápida LTDA", valor: "R$ 4.500,00", dias: 45, contato: "WhatsApp", risco: "Alto" },
  { id: 2, associado: "Oficina do Sr. José", valor: "R$ 1.200,00", dias: 12, contato: "E-mail", risco: "Baixo" },
  { id: 3, associado: "Logística Express", valor: "R$ 8.900,00", dias: 65, contato: "Telefone", risco: "Crítico" },
  { id: 4, associado: "Cooperativa Agrícola", valor: "R$ 2.150,00", dias: 28, contato: "WhatsApp", risco: "Médio" },
];

export default function Cobranca() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <DollarSign className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Setor de Cobrança</h1>
            <p className="text-gray-600 mt-1">Gestão de Receita e Recuperação de Ativos</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors">
            <HandCoins className="w-4 h-4" />
            Novo Acordo
          </button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Arrecadação Mês</p>
                <h3 className="text-2xl font-bold text-gray-900">R$ 452.800</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> 5.2% vs meta
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Inadimplência Geral</p>
                <h3 className="text-2xl font-bold text-gray-900">4.8%</h3>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +0.3% este mês
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Recuperado (Hoje)</p>
                <h3 className="text-2xl font-bold text-gray-900">R$ 12.450</h3>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  18 acordos fechados
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-full">
                <HandCoins className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Ticket Médio Acordo</p>
                <h3 className="text-2xl font-bold text-gray-900">R$ 840,00</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Pagamento em até 3x
                </p>
              </div>
              <div className="p-2 bg-amber-50 rounded-full">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aging da Inadimplência</CardTitle>
            <CardDescription>Distribuição de valores por tempo de atraso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agingData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip 
                    formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                  />
                  <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                    {agingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance de Recuperação</CardTitle>
            <CardDescription>Meta vs. Realizado em cobrança</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recoveryData}>
                  <defs>
                    <linearGradient id="colorRealizado" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="realizado" stroke="#10b981" fillOpacity={1} fill="url(#colorRealizado)" name="Realizado" />
                  <Area type="monotone" dataKey="meta" stroke="#94a3b8" strokeDasharray="5 5" fill="none" name="Meta" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Priorities and Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Debtors */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Fila de Cobrança Prioritária</CardTitle>
            <CardDescription>Casos críticos para ação imediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Associado</th>
                    <th className="px-4 py-3">Valor</th>
                    <th className="px-4 py-3 text-center">Atraso</th>
                    <th className="px-4 py-3">Canal Pref.</th>
                    <th className="px-4 py-3">Risco</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {devedoresPrioritarios.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{d.associado}</td>
                      <td className="px-4 py-3 text-emerald-700 font-semibold">{d.valor}</td>
                      <td className="px-4 py-3 text-center">{d.dias} dias</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {d.contato === 'WhatsApp' && <MessageSquare className="w-3 h-3 text-green-500" />}
                          {d.contato === 'Telefone' && <PhoneCall className="w-3 h-3 text-blue-500" />}
                          {d.contato === 'E-mail' && <Mail className="w-3 h-3 text-amber-500" />}
                          {d.contato}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          d.risco === 'Crítico' ? 'bg-red-100 text-red-700' :
                          d.risco === 'Alto' ? 'bg-orange-100 text-orange-700' :
                          d.risco === 'Médio' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {d.risco}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Channels & Efficiency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Canais de Conversão</CardTitle>
            <CardDescription>Efetividade da régua</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-50 rounded-md">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">WhatsApp</span>
                </div>
                <span className="text-sm font-bold text-green-600">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-md">
                    <PhoneCall className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Telefone</span>
                </div>
                <span className="text-sm font-bold text-blue-600">22%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 rounded-md">
                    <Mail className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">E-mail</span>
                </div>
                <span className="text-sm font-bold text-amber-600">13%</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-blue-500" />
                Próximos Vencimentos
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Lote 15/02</span>
                    <span className="font-bold">R$ 125k</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1 rounded-full">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">40% já enviado para WhatsApp</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
