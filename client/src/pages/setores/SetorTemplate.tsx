import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface SetorTemplateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function SetorTemplate({ title, description, icon }: SetorTemplateProps) {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          {icon || <Building2 className="w-8 h-8 text-blue-600" />}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
            <CardDescription>Métricas e indicadores do setor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total de Registros</p>
                <p className="text-2xl font-bold">--</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold">--</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold">--</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas atualizações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 text-center py-8">
                Nenhuma atividade recente
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Operações frequentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-left text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                Nova Solicitação
              </button>
              <button className="w-full px-4 py-2 text-left text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                Visualizar Relatório
              </button>
              <button className="w-full px-4 py-2 text-left text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                Exportar Dados
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Setor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Esta página está em desenvolvimento. Em breve você terá acesso a todas as funcionalidades específicas do setor de {title}.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
