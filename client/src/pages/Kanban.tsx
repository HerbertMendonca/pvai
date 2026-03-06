import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, MoreHorizontal, GripHorizontal, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface KanbanCard {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: "baixa" | "media" | "alta";
  responsavel?: string;
  datavencimento?: string;
}

interface KanbanList {
  id: string;
  titulo: string;
  cards: KanbanCard[];
}

interface KanbanBoard {
  id: string;
  titulo: string;
  listas: KanbanList[];
}

const BOARDS_MOCK: KanbanBoard[] = [
  {
    id: "board-1",
    titulo: "Gestão de Sinistros",
    listas: [
      {
        id: "list-1",
        titulo: "Novos",
        cards: [
          { id: "card-1", titulo: "Sinistro #8942", descricao: "Colisão frontal - Análise pendente", prioridade: "alta", responsavel: "Carlos", datavencimento: "2026-03-08" },
          { id: "card-2", titulo: "Sinistro #8943", descricao: "Roubo de veículo", prioridade: "alta", responsavel: "Ana", datavencimento: "2026-03-10" },
        ]
      },
      {
        id: "list-2",
        titulo: "Em Análise",
        cards: [
          { id: "card-3", titulo: "Sinistro #8940", descricao: "Perda total - Aguardando laudo", prioridade: "media", responsavel: "Carlos", datavencimento: "2026-03-07" },
          { id: "card-4", titulo: "Sinistro #8939", descricao: "Dano parcial - Revisão de valores", prioridade: "media", responsavel: "Fernanda" },
        ]
      },
      {
        id: "list-3",
        titulo: "Aprovado",
        cards: [
          { id: "card-5", titulo: "Sinistro #8938", descricao: "Liberado para pagamento", prioridade: "baixa", responsavel: "Lucas", datavencimento: "2026-03-06" },
        ]
      },
      {
        id: "list-4",
        titulo: "Pago",
        cards: [
          { id: "card-6", titulo: "Sinistro #8935", descricao: "R$ 15.450,00 transferido", prioridade: "baixa", responsavel: "Fernanda" },
          { id: "card-7", titulo: "Sinistro #8936", descricao: "R$ 8.200,00 transferido", prioridade: "baixa", responsavel: "Lucas" },
        ]
      },
    ]
  },
  {
    id: "board-2",
    titulo: "Cobrança de Inadimplentes",
    listas: [
      {
        id: "list-5",
        titulo: "Pendente Contato",
        cards: [
          { id: "card-8", titulo: "Cliente: João Silva", descricao: "Atraso de 45 dias - R$ 2.450,00", prioridade: "alta", responsavel: "Lucas" },
          { id: "card-9", titulo: "Cliente: Maria Santos", descricao: "Atraso de 30 dias - R$ 1.850,00", prioridade: "media", responsavel: "Lucas" },
        ]
      },
      {
        id: "list-6",
        titulo: "Contato Realizado",
        cards: [
          { id: "card-10", titulo: "Cliente: Pedro Costa", descricao: "Prometeu pagar até 10/03", prioridade: "media", responsavel: "Lucas", datavencimento: "2026-03-10" },
        ]
      },
      {
        id: "list-7",
        titulo: "Negociação",
        cards: [
          { id: "card-11", titulo: "Cliente: Ana Oliveira", descricao: "Solicitou parcelamento em 3x", prioridade: "media", responsavel: "Lucas" },
        ]
      },
      {
        id: "list-8",
        titulo: "Resolvido",
        cards: [
          { id: "card-12", titulo: "Cliente: Carlos Mendes", descricao: "Pagamento recebido", prioridade: "baixa", responsavel: "Lucas" },
        ]
      },
    ]
  },
];

const getPrioridadeColor = (prioridade: string) => {
  switch (prioridade) {
    case "alta":
      return "bg-red-100 text-red-700 border-red-200";
    case "media":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "baixa":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export default function Kanban() {
  const [boards, setBoards] = useState<KanbanBoard[]>(BOARDS_MOCK);
  const [selectedBoard, setSelectedBoard] = useState<string>(BOARDS_MOCK[0].id);
  const [draggedCard, setDraggedCard] = useState<{ cardId: string; fromListId: string } | null>(null);
  const [newCardTitle, setNewCardTitle] = useState<Record<string, string>>({});
  const [showNewCardForm, setShowNewCardForm] = useState<Record<string, boolean>>({});

  const currentBoard = boards.find(b => b.id === selectedBoard);

  const handleAddCard = (listId: string) => {
    if (!newCardTitle[listId]?.trim()) return;

    setBoards(boards.map(b => {
      if (b.id === selectedBoard) {
        return {
          ...b,
          listas: b.listas.map(l => {
            if (l.id === listId) {
              return {
                ...l,
                cards: [
                  ...l.cards,
                  {
                    id: `card-${Date.now()}`,
                    titulo: newCardTitle[listId],
                    descricao: "",
                    prioridade: "media",
                  }
                ]
              };
            }
            return l;
          })
        };
      }
      return b;
    }));

    setNewCardTitle({ ...newCardTitle, [listId]: "" });
    setShowNewCardForm({ ...showNewCardForm, [listId]: false });
  };

  const handleDeleteCard = (listId: string, cardId: string) => {
    setBoards(boards.map(b => {
      if (b.id === selectedBoard) {
        return {
          ...b,
          listas: b.listas.map(l => {
            if (l.id === listId) {
              return {
                ...l,
                cards: l.cards.filter(c => c.id !== cardId)
              };
            }
            return l;
          })
        };
      }
      return b;
    }));
  };

  const handleDragStart = (e: React.DragEvent, cardId: string, listId: string) => {
    setDraggedCard({ cardId, fromListId: listId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropCard = (e: React.DragEvent, toListId: string) => {
    e.preventDefault();
    if (!draggedCard) return;

    const { cardId, fromListId } = draggedCard;

    if (fromListId === toListId) {
      setDraggedCard(null);
      return;
    }

    setBoards(boards.map(b => {
      if (b.id === selectedBoard) {
        const card = b.listas.find(l => l.id === fromListId)?.cards.find(c => c.id === cardId);
        if (!card) return b;

        return {
          ...b,
          listas: b.listas.map(l => {
            if (l.id === fromListId) {
              return { ...l, cards: l.cards.filter(c => c.id !== cardId) };
            }
            if (l.id === toListId) {
              return { ...l, cards: [...l.cards, card] };
            }
            return l;
          })
        };
      }
      return b;
    }));

    setDraggedCard(null);
  };

  return (
    <DashboardLayout>
      <div className="p-4 space-y-4 bg-slate-50/50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Kanban Board</h1>
            <p className="text-xs text-slate-500">Gerencie tarefas e fluxos de trabalho com drag-and-drop</p>
          </div>
        </div>

        {/* Seleção de Boards */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {boards.map(board => (
            <button
              key={board.id}
              onClick={() => setSelectedBoard(board.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                selectedBoard === board.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {board.titulo}
            </button>
          ))}
        </div>

        {/* Kanban Board */}
        {currentBoard && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
            {currentBoard.listas.map(lista => (
              <div
                key={lista.id}
                className="bg-slate-100/50 rounded-lg p-3 space-y-3 min-h-[600px] max-h-[600px] overflow-y-auto flex flex-col"
              >
                {/* Header da Lista */}
                <div className="flex items-center justify-between gap-2 sticky top-0 bg-slate-100/50 pb-2">
                  <h3 className="font-bold text-sm text-slate-900">{lista.titulo}</h3>
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-white text-slate-600">
                    {lista.cards.length}
                  </Badge>
                </div>

                {/* Cards */}
                <div
                  className="flex-1 space-y-2"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropCard(e, lista.id)}
                >
                  {lista.cards.map(card => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, card.id, lista.id)}
                      className="bg-white rounded-lg p-2.5 border border-slate-200 hover:shadow-md transition-all cursor-move group"
                    >
                      <div className="flex items-start gap-2">
                        <GripHorizontal className="w-3 h-3 text-slate-300 mt-0.5 flex-shrink-0 group-hover:text-slate-400" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{card.titulo}</h4>
                          {card.descricao && (
                            <p className="text-[10px] text-slate-600 line-clamp-2 mt-1">{card.descricao}</p>
                          )}
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            <Badge className={`text-[9px] h-4 px-1.5 border ${getPrioridadeColor(card.prioridade)}`}>
                              {card.prioridade}
                            </Badge>
                            {card.responsavel && (
                              <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                                {card.responsavel}
                              </span>
                            )}
                          </div>
                          {card.datavencimento && (
                            <p className="text-[9px] text-slate-500 mt-1">📅 {card.datavencimento}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteCard(lista.id, card.id)}
                          className="flex-shrink-0 text-slate-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Adicionar Card */}
                <div className="mt-auto pt-2 border-t border-slate-200">
                  {showNewCardForm[lista.id] ? (
                    <div className="space-y-2">
                      <Input
                        placeholder="Título do card..."
                        value={newCardTitle[lista.id] || ""}
                        onChange={(e) => setNewCardTitle({ ...newCardTitle, [lista.id]: e.target.value })}
                        className="h-8 text-xs"
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          className="h-7 text-[10px] flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleAddCard(lista.id)}
                        >
                          Adicionar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[10px] flex-1"
                          onClick={() => setShowNewCardForm({ ...showNewCardForm, [lista.id]: false })}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowNewCardForm({ ...showNewCardForm, [lista.id]: true })}
                      className="w-full px-2 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded transition-all flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Novo Card
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
