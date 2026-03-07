import { useState, useEffect } from "react";
import { useKanban } from "@/_core/hooks/useKanban";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, MoreHorizontal, GripHorizontal, X, Loader } from "lucide-react";

const getPrioridadeColor = (prioridade: string) => {
  switch (prioridade) {
    case "alta":
      return "bg-red-100 text-red-700 border-red-200";
    case "urgente":
      return "bg-red-200 text-red-800 border-red-300";
    case "media":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "baixa":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

export default function Kanban() {
  const { boards, cards, loading, createBoard, createCard, updateCard, moveCard, deleteCard } = useKanban();
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null);
  const [draggedCard, setDraggedCard] = useState<{ cardId: number; fromColunaId: string } | null>(null);
  const [newCardTitle, setNewCardTitle] = useState<Record<string, string>>({});
  const [showNewCardForm, setShowNewCardForm] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (boards.length > 0 && !selectedBoardId) {
      setSelectedBoardId(boards[0].id);
    }
  }, [boards, selectedBoardId]);

  const currentBoard = boards.find(b => b.id === selectedBoardId);
  const boardCards = selectedBoardId ? cards.filter(c => c.id_board === selectedBoardId) : [];

  const handleAddCard = async (colunaId: string) => {
    if (!newCardTitle[colunaId]?.trim() || !selectedBoardId) return;

    try {
      await createCard({
        id_board: selectedBoardId,
        coluna_id: colunaId,
        titulo: newCardTitle[colunaId],
        descricao: "",
        prioridade: "media",
        tags: [],
        ordem: 0,
        metadata: {},
      });

      setNewCardTitle({ ...newCardTitle, [colunaId]: "" });
      setShowNewCardForm({ ...showNewCardForm, [colunaId]: false });
    } catch (error) {
      console.error("Erro ao adicionar card:", error);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    try {
      await deleteCard(cardId);
    } catch (error) {
      console.error("Erro ao deletar card:", error);
    }
  };

  const handleDragStart = (e: React.DragEvent, cardId: number, colunaId: string) => {
    setDraggedCard({ cardId, fromColunaId: colunaId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropCard = async (e: React.DragEvent, toColunaId: string) => {
    e.preventDefault();
    if (!draggedCard) return;

    const { cardId, fromColunaId } = draggedCard;

    if (fromColunaId === toColunaId) {
      setDraggedCard(null);
      return;
    }

    try {
      const cardsInNewColumn = boardCards.filter(c => c.coluna_id === toColunaId);
      const newOrdem = cardsInNewColumn.length;
      await moveCard(cardId, toColunaId, newOrdem);
    } catch (error) {
      console.error("Erro ao mover card:", error);
    }

    setDraggedCard(null);
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 bg-slate-50/50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-sm text-slate-600">Carregando Kanban...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Kanban Board</h1>
          <p className="text-xs text-slate-500">Gerencie tarefas e fluxos de trabalho com drag-and-drop</p>
        </div>
      </div>

      {/* Seleção de Boards */}
      {boards.length > 0 ? (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {boards.map(board => (
              <button
                key={board.id}
                onClick={() => setSelectedBoardId(board.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedBoardId === board.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {board.nome}
              </button>
            ))}
          </div>

          {/* Kanban Board */}
          {currentBoard && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4">
              {currentBoard.colunas.map(coluna => {
                const colunaCards = boardCards.filter(c => c.coluna_id === coluna.id);
                return (
                  <div
                    key={coluna.id}
                    className="bg-slate-100/50 rounded-lg p-3 space-y-3 min-h-[600px] max-h-[600px] overflow-y-auto flex flex-col"
                  >
                    {/* Header da Lista */}
                    <div className="flex items-center justify-between gap-2 sticky top-0 bg-slate-100/50 pb-2">
                      <h3 className="font-bold text-sm text-slate-900">{coluna.titulo}</h3>
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-white text-slate-600">
                        {colunaCards.length}
                      </Badge>
                    </div>

                    {/* Cards */}
                    <div
                      className="flex-1 space-y-2"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropCard(e, coluna.id)}
                    >
                      {colunaCards.map(card => (
                        <div
                          key={card.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, card.id, coluna.id)}
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
                                {card.tags && card.tags.length > 0 && (
                                  <span className="text-[9px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded border border-purple-100">
                                    {card.tags[0]}
                                  </span>
                                )}
                              </div>
                              {card.data_vencimento && (
                                <p className="text-[9px] text-slate-500 mt-1">📅 {new Date(card.data_vencimento).toLocaleDateString("pt-BR")}</p>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteCard(card.id)}
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
                      {showNewCardForm[coluna.id] ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="Título do card..."
                            value={newCardTitle[coluna.id] || ""}
                            onChange={(e) => setNewCardTitle({ ...newCardTitle, [coluna.id]: e.target.value })}
                            className="h-8 text-xs"
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              className="h-7 text-[10px] flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => handleAddCard(coluna.id)}
                            >
                              Adicionar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-[10px] flex-1"
                              onClick={() => setShowNewCardForm({ ...showNewCardForm, [coluna.id]: false })}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowNewCardForm({ ...showNewCardForm, [coluna.id]: true })}
                          className="w-full px-2 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded transition-all flex items-center justify-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Novo Card
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Card className="border-dashed border-2 bg-white/50">
          <CardContent className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 mb-3">
              <Plus className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Nenhum Board criado</h3>
            <p className="text-xs text-slate-500">Crie um novo board para começar a gerenciar suas tarefas.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
