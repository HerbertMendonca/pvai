import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  Crown,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Users2,
  Zap,
  Megaphone,
  FileText,
  Briefcase,
} from "lucide-react";

export interface Agent {
  id: string;
  nome: string;
  descricao: string;
  icon: React.ReactNode;
  cor: string;
}

const AGENTS: Agent[] = [
  {
    id: "conselho",
    nome: "Conselho de Administração",
    descricao: "Visão estratégica e governança corporativa",
    icon: <Users className="w-6 h-6" />,
    cor: "from-purple-600 to-purple-700",
  },
  {
    id: "ceo",
    nome: "CEO",
    descricao: "Liderança executiva e decisões estratégicas",
    icon: <Crown className="w-6 h-6" />,
    cor: "from-blue-600 to-blue-700",
  },
  {
    id: "financeiro",
    nome: "Diretor Financeiro",
    descricao: "Gestão financeira e fluxo de caixa",
    icon: <DollarSign className="w-6 h-6" />,
    cor: "from-green-600 to-green-700",
  },
  {
    id: "comercial",
    nome: "Diretor Comercial",
    descricao: "Vendas, receita e crescimento",
    icon: <TrendingUp className="w-6 h-6" />,
    cor: "from-orange-600 to-orange-700",
  },
  {
    id: "risco",
    nome: "Diretor de Risco",
    descricao: "Compliance e gestão de riscos",
    icon: <AlertTriangle className="w-6 h-6" />,
    cor: "from-red-600 to-red-700",
  },
  {
    id: "bi",
    nome: "Diretor de BI",
    descricao: "Análise de dados e inteligência empresarial",
    icon: <BarChart3 className="w-6 h-6" />,
    cor: "from-cyan-600 to-cyan-700",
  },
  {
    id: "rh",
    nome: "Diretor de RH",
    descricao: "Gestão de pessoas e cultura",
    icon: <Users2 className="w-6 h-6" />,
    cor: "from-pink-600 to-pink-700",
  },
  {
    id: "trafego",
    nome: "Gestor de Tráfego",
    descricao: "Otimização de campanhas e performance",
    icon: <Zap className="w-6 h-6" />,
    cor: "from-yellow-600 to-yellow-700",
  },
  {
    id: "marketing",
    nome: "Diretor de Marketing",
    descricao: "Estratégia de marca e posicionamento",
    icon: <Megaphone className="w-6 h-6" />,
    cor: "from-indigo-600 to-indigo-700",
  },
  {
    id: "copyright",
    nome: "Diretor de Copyright",
    descricao: "Criação de conteúdo e comunicação",
    icon: <FileText className="w-6 h-6" />,
    cor: "from-slate-600 to-slate-700",
  },
  {
    id: "operacional",
    nome: "Diretor Operacional",
    descricao: "Eficiência operacional e processos",
    icon: <Briefcase className="w-6 h-6" />,
    cor: "from-emerald-600 to-emerald-700",
  },
];

interface AgentSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectAgent: (agent: Agent) => void;
}

export function AgentSelectorModal({
  open,
  onOpenChange,
  onSelectAgent,
}: AgentSelectorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Falar com a Equipe IA</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AGENTS.map((agent) => (
              <button
                key={agent.id}
                onClick={() => {
                  onSelectAgent(agent);
                  onOpenChange(false);
                }}
                className={`bg-gradient-to-br ${agent.cor} p-4 rounded-lg text-white hover:shadow-lg transition-all transform hover:scale-105 text-left group`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    {agent.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-tight">
                      {agent.nome}
                    </h3>
                    <p className="text-xs opacity-90 mt-1 line-clamp-2">
                      {agent.descricao}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
