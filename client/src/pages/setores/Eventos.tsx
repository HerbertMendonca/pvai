import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Users, 
  Ticket, 
  Star, 
  TrendingUp, 
  MapPin, 
  Clock,
  CheckCircle2,
  AlertCircle,
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

const eventAttendance = [
  { name: 'Jan', inscritos: 120, presentes: 85 },
  { name: 'Fev', inscritos: 250, presentes: 210 },
  { name: 'Mar', inscritos: 180, presentes: 145 },
  { name: 'Abr', inscritos: 300, presentes: 280 },
];

const satisfactionData = [
  { name: 'Excelente', value: 65 },
  { name: 'Bom', value: 25 },
  { name: 'Regular', value: 8 },
  { name: 'Ruim', value: 2 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const proximosEventos = [
  { id: 1, nome: "Assembleia Geral 2026", data: "25/02", local: "Sede Social", status: "Confirmado" },
  { id: 2, nome: "Workshop: Segurança na Estrada", data: "10/03", local: "Auditório B", status: "Inscrições Abertas" },
  { id: 3, nome: "Jantar dos Associados", data: "15/04", local: "Hotel Palace", status: "Planejamento" },
];

export default function Eventos() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-amber-100 rounded-lg">
          <Calendar className="w-8 h-8 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Setor de Eventos</h1>
          <p className="text-gray-600 mt-1">Gestão de Assembleias, Treinamentos e Engajamento</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Total Eventos (Ano)</p>
                <h3 className="text-2xl font-bold text-gray-900">12</h3>
                <p className="text-xs text-blue-600 mt-1">4 realizados / 8 previstos</p>
              </div>
              <BarChart3 className="w-8 h-8 text-amber-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Inscrições Ativas</p>
                <h3 className="text-2xl font-bold text-gray-900">452</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" /> +15% vs último evento
                </p>
              </div>
              <Ticket className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">NPS Médio</p>
                <h3 className="text-2xl font-bold text-gray-900">88</h3>
                <p className="text-xs text-amber-600 mt-1">Zona de Excelência</p>
              </div>
              <Star className="w-8 h-8 text-amber-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Presença Média</p>
                <h3 className="text-2xl font-bold text-gray-900">82%</h3>
                <p className="text-xs text-gray-500 mt-1">Inscritos vs Presentes</p>
              </div>
              <Users className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Adesão por Evento</CardTitle>
            <CardDescription>Comparativo de inscritos e comparecimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventAttendance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="inscritos" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Inscritos" />
                  <Bar dataKey="presentes" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Presentes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Satisfação dos Participantes</CardTitle>
            <CardDescription>Avaliação qualitativa pós-evento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-1/2 space-y-2">
                {satisfactionData.map((item, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Calendário de Eventos</CardTitle>
            <CardDescription>Próximas atividades programadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Evento</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Local</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {proximosEventos.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{e.nome}</td>
                      <td className="px-4 py-3 text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {e.data}
                      </td>
                      <td className="px-4 py-3 text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {e.local}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          e.status === 'Confirmado' ? 'bg-green-100 text-green-700' :
                          e.status === 'Inscrições Abertas' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {e.status}
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
            <CardTitle className="text-lg">Checklist de Produção</CardTitle>
            <CardDescription>Status das tarefas pendentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-2 bg-green-50 rounded-md">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-green-800">Locação Confirmada</p>
                <p className="text-green-700">Assembleia Geral - Sede Social</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 bg-amber-50 rounded-md">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-amber-800">Catering Pendente</p>
                <p className="text-amber-700">Workshop Segurança - Orçamento</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <button className="w-full py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors font-medium">
                Ver Painel de Produção
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
