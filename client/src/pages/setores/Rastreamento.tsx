import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Navigation, 
  ShieldCheck, 
  MapPin, 
  AlertTriangle, 
  Truck, 
  Activity, 
  Zap,
  Clock,
  CheckCircle2,
  BarChart3
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

const fleetStatus = [
  { name: 'Online', value: 850, color: '#10b981' },
  { name: 'Offline', value: 45, color: '#94a3b8' },
  { name: 'Alerta', value: 12, color: '#f59e0b' },
  { name: 'Manutenção', value: 28, color: '#3b82f6' },
];

const alertEvolution = [
  { name: 'Seg', alertas: 5 },
  { name: 'Ter', alertas: 8 },
  { name: 'Qua', alertas: 12 },
  { name: 'Qui', alertas: 7 },
  { name: 'Sex', alertas: 15 },
  { name: 'Sáb', alertas: 22 },
  { name: 'Dom', alertas: 18 },
];

const COLORS = ['#10b981', '#94a3b8', '#f59e0b', '#3b82f6'];

const alertasRecentes = [
  { id: 1, veiculo: "ABC-1234", evento: "Ignição Fora de Horário", hora: "02:15", status: "Crítico" },
  { id: 2, veiculo: "XYZ-9876", evento: "Excesso de Velocidade", hora: "10:45", status: "Atenção" },
  { id: 3, veiculo: "KJH-4455", evento: "Entrada em Área Restrita", hora: "14:20", status: "Normal" },
  { id: 4, veiculo: "MNO-3322", evento: "Bateria Desconectada", hora: "16:05", status: "Crítico" },
];

export default function Rastreamento() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Navigation className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Setor de Rastreamento</h1>
          <p className="text-gray-600 mt-1">Monitoramento de Frota e Segurança em Tempo Real</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Veículos Ativos</p>
                <h3 className="text-2xl font-bold text-gray-900">935</h3>
                <p className="text-xs text-green-600 mt-1">91% de disponibilidade</p>
              </div>
              <Truck className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Alertas (24h)</p>
                <h3 className="text-2xl font-bold text-gray-900">48</h3>
                <p className="text-xs text-amber-600 flex items-center mt-1">
                  <AlertTriangle className="w-3 h-3 mr-1" /> 5 casos críticos
                </p>
              </div>
              <Activity className="w-8 h-8 text-amber-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Instalações (Mês)</p>
                <h3 className="text-2xl font-bold text-gray-900">62</h3>
                <p className="text-xs text-blue-600 mt-1">SLA: 1.5 dias</p>
              </div>
              <Zap className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Taxa de Recuperação</p>
                <h3 className="text-2xl font-bold text-gray-900">100%</h3>
                <p className="text-xs text-green-600 mt-1">Últimos 12 meses</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status da Frota</CardTitle>
            <CardDescription>Distribuição operacional dos rastreadores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fleetStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {fleetStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-1/2 space-y-2">
                {fleetStatus.map((item, index) => (
                  <div key={item.name} className="flex items-center text-sm">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-600">{item.name}:</span>
                    <span className="font-bold ml-1">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evolução de Alertas</CardTitle>
            <CardDescription>Volume de ocorrências por dia da semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={alertEvolution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="alertas" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Alertas" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Últimas Ocorrências</CardTitle>
            <CardDescription>Alertas críticos gerados pelo sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Veículo</th>
                    <th className="px-4 py-3">Evento</th>
                    <th className="px-4 py-3">Hora</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {alertasRecentes.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{a.veiculo}</td>
                      <td className="px-4 py-3 text-gray-600">{a.evento}</td>
                      <td className="px-4 py-3 text-gray-500">{a.hora}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          a.status === 'Crítico' ? 'bg-red-100 text-red-700' :
                          a.status === 'Atenção' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {a.status}
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
            <CardTitle className="text-lg">Saúde Técnica</CardTitle>
            <CardDescription>Status da infraestrutura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Uptime Servidor</span>
                <span className="font-bold text-green-600">99.98%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '99%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delay Médio (GPS)</span>
                <span className="font-bold text-blue-600">2.5s</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                Áreas de Risco
              </h4>
              <p className="text-xs text-gray-500">
                Aumento de 15% em ocorrências na região Leste nas últimas 48h.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
