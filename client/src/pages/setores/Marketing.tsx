import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Megaphone, 
  TrendingUp, 
  MousePointer2, 
  Users, 
  DollarSign, 
  BarChart3,
  PieChart as PieChartIcon,
  Globe,
  Share2,
  Mail
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

const campaignPerformance = [
  { name: 'Google Ads', leads: 450, cpa: 12.50 },
  { name: 'Facebook', leads: 320, cpa: 15.80 },
  { name: 'Instagram', leads: 280, cpa: 14.20 },
  { name: 'LinkedIn', leads: 120, cpa: 45.00 },
  { name: 'E-mail', leads: 85, cpa: 5.20 },
];

const leadSourceData = [
  { name: 'Orgânico', value: 35 },
  { name: 'Pago', value: 45 },
  { name: 'Indicação', value: 15 },
  { name: 'Eventos', value: 5 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const topCampaigns = [
  { id: 1, nome: "Campanha Verão 2026", gasto: "R$ 12.000", leads: 850, roi: "4.5x" },
  { id: 2, nome: "Proteção Veicular Total", gasto: "R$ 8.500", leads: 420, roi: "3.2x" },
  { id: 3, nome: "Indique um Amigo", gasto: "R$ 2.000", leads: 150, roi: "8.0x" },
];

export default function Marketing() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-purple-100 rounded-lg">
          <Megaphone className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Setor de Marketing</h1>
          <p className="text-gray-600 mt-1">Gestão de Campanhas, Leads e Presença Digital</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Leads Gerados</p>
                <h3 className="text-2xl font-bold text-gray-900">1.255</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" /> +18% vs mês anterior
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">CPA Médio</p>
                <h3 className="text-2xl font-bold text-gray-900">R$ 18,40</h3>
                <p className="text-xs text-blue-600 mt-1">Custo por Aquisição</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">CTR Médio</p>
                <h3 className="text-2xl font-bold text-gray-900">3.2%</h3>
                <p className="text-xs text-gray-500 mt-1">Taxa de Clique</p>
              </div>
              <MousePointer2 className="w-8 h-8 text-amber-500 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase">Investimento</p>
                <h3 className="text-2xl font-bold text-gray-900">R$ 22.5k</h3>
                <p className="text-xs text-purple-600 mt-1">Orçamento Mensal</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leads por Canal</CardTitle>
            <CardDescription>Volume de geração por plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Leads" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Origem do Tráfego</CardTitle>
            <CardDescription>Distribuição qualitativa dos leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-1/2 space-y-2">
                {leadSourceData.map((item, index) => (
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
            <CardTitle className="text-lg">Melhores Campanhas</CardTitle>
            <CardDescription>Performance por ROI e Conversão</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Campanha</th>
                    <th className="px-4 py-3">Investimento</th>
                    <th className="px-4 py-3">Leads</th>
                    <th className="px-4 py-3">ROI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topCampaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{c.nome}</td>
                      <td className="px-4 py-3 text-gray-600">{c.gasto}</td>
                      <td className="px-4 py-3 text-gray-600 font-bold">{c.leads}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">
                          {c.roi}
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
            <CardTitle className="text-lg">Ativos Digitais</CardTitle>
            <CardDescription>Saúde das redes e site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Visitas Site</span>
              </div>
              <span className="text-sm font-bold">45.2k</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-pink-500" />
                <span className="text-sm">Alcance Social</span>
              </div>
              <span className="text-sm font-bold">128k</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" />
                <span className="text-sm">Taxa Abertura E-mail</span>
              </div>
              <span className="text-sm font-bold">24%</span>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 italic">
                * Dados atualizados em tempo real via APIs de marketing.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
