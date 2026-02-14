import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Smile, 
  MessageSquare, 
  RefreshCcw, 
  TrendingUp, 
  Users, 
  Star,
  Clock,
  ShieldCheck,
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

const satisfactionHistory = [
  { name: 'Set', nps: 78 },
  { name: 'Out', nps: 82 },
  { name: 'Nov', nps: 80 },
  { name: 'Dez', nps: 85 },
  { name: 'Jan', nps: 88 },
  { name: 'Fev', nps: 92 },
];

const contactReasons = [
  { name: 'Dúvidas', value: 40 },
  { name: 'Elogios', value: 15 },
  { name: 'Reclamações', value: 10 },
  { name: 'Solicitações', value: 35 },
];

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'];

const feedbacksRecentes = [
  { id: 1, associado: "Carlos Eduardo", tipo: "Elogio", comentario: "Atendimento rápido no guincho.", data: "Hoje" },
  { id: 2, associado: "Juliana Lima", tipo: "Dúvida", comentario: "Como adicionar dependente?", data: "Ontem" },
  { id: 3, associado: "Roberto Silva", tipo: "Sugestão", comentario: "App poderia ter modo escuro.", data: "12/02" },
];

export default function Relacionamento() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-pink-100 rounded-lg">
          <Heart className="w-8 h-8 text-pink-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Setor de Relacionamento</h1>
          <p className="text-gray-600 mt-1">Gestão da Experiência e Sucesso do Associado</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">NPS Atual</p>
                <h3 className="text-2xl font-bold text-gray-900">92</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" /> Zona de Encantamento
                </p>
              </div>
              <Smile className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Taxa de Retenção</p>
                <h3 className="text-2xl font-bold text-gray-900">98.5%</h3>
                <p className="text-xs text-blue-600 mt-1">Fidelidade da Base</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Atendimentos (Mês)</p>
                <h3 className="text-2xl font-bold text-gray-900">845</h3>
                <p className="text-xs text-gray-500 mt-1">Média: 28/dia</p>
              </div>
              <MessageSquare className="w-8 h-8 text-pink-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Renovações</p>
                <h3 className="text-2xl font-bold text-gray-900">156</h3>
                <p className="text-xs text-purple-600 mt-1">Contratos renovados</p>
              </div>
              <RefreshCcw className="w-8 h-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Evolução do NPS</CardTitle>
            <CardDescription>Índice de satisfação ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={satisfactionHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="nps" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} name="NPS" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Motivos de Contato</CardTitle>
            <CardDescription>Distribuição por categoria de atendimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contactReasons}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {contactReasons.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-1/2 space-y-2">
                {contactReasons.map((item, index) => (
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
            <CardTitle className="text-lg">Voz do Associado</CardTitle>
            <CardDescription>Últimos feedbacks e interações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedbacksRecentes.map((f) => (
                <div key={f.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{f.associado}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        f.tipo === 'Elogio' ? 'bg-green-100 text-green-700' :
                        f.tipo === 'Dúvida' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {f.tipo}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{f.data}</span>
                  </div>
                  <p className="text-sm text-gray-600 italic">"{f.comentario}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Saúde da Base</CardTitle>
            <CardDescription>Indicadores de relacionamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tempo Médio Resposta</span>
                <span className="font-bold text-blue-600">45 min</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxa de Resolução</span>
                <span className="font-bold text-green-600">94%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Programa de Pontos
              </h4>
              <p className="text-xs text-gray-500">
                850 associados ativos no programa de benefícios (63% da base).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
