import { supabase } from "@/_core/supabase";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export interface KanbanBoard {
  id: number;
  id_empresa: number;
  nome: string;
  descricao: string;
  setor: string;
  colunas: Array<{ id: string; titulo: string; ordem: number }>;
  created_at: string;
  updated_at: string;
}

export interface KanbanCard {
  id: number;
  id_empresa: number;
  id_board: number;
  coluna_id: string;
  titulo: string;
  descricao: string;
  prioridade: "baixa" | "media" | "alta" | "urgente";
  atribuido_a: number | null;
  data_vencimento: string | null;
  tags: string[];
  ordem: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface UseKanbanOptions {
  enabled?: boolean;
  boardId?: number;
}

export function useKanban(options?: UseKanbanOptions) {
  const { enabled = true, boardId } = options ?? {};
  const { user } = useAuth();
  const [boards, setBoards] = useState<KanbanBoard[]>([]);
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBoards = useCallback(async () => {
    if (!user?.id_empresa || !enabled) {
      setBoards([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("kanban_boards")
        .select("*")
        .eq("id_empresa", user.id_empresa)
        .order("created_at", { ascending: false });

      if (err) throw err;
      setBoards((data as KanbanBoard[]) || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching boards:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch boards"));
      setBoards([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id_empresa, enabled]);

  const fetchCards = useCallback(async () => {
    if (!user?.id_empresa || !enabled) {
      setCards([]);
      return;
    }

    try {
      let query = supabase
        .from("kanban_cards")
        .select("*")
        .eq("id_empresa", user.id_empresa);

      if (boardId) {
        query = query.eq("id_board", boardId);
      }

      const { data, error: err } = await query.order("ordem", { ascending: true });

      if (err) throw err;
      setCards((data as KanbanCard[]) || []);
    } catch (err) {
      console.error("Error fetching cards:", err);
      setCards([]);
    }
  }, [user?.id_empresa, enabled, boardId]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const createBoard = useCallback(
    async (boardData: Omit<KanbanBoard, "id" | "id_empresa" | "created_at" | "updated_at">) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { data, error: err } = await supabase
          .from("kanban_boards")
          .insert([{ ...boardData, id_empresa: user.id_empresa }])
          .select()
          .single();

        if (err) throw err;
        setBoards((prev) => [data as KanbanBoard, ...prev]);
        return data as KanbanBoard;
      } catch (err) {
        console.error("Error creating board:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  const updateBoard = useCallback(
    async (id: number, boardData: Partial<KanbanBoard>) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { data, error: err } = await supabase
          .from("kanban_boards")
          .update(boardData)
          .eq("id", id)
          .eq("id_empresa", user.id_empresa)
          .select()
          .single();

        if (err) throw err;
        setBoards((prev) => prev.map((b) => (b.id === id ? (data as KanbanBoard) : b)));
        return data as KanbanBoard;
      } catch (err) {
        console.error("Error updating board:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  const deleteBoard = useCallback(
    async (id: number) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { error: err } = await supabase
          .from("kanban_boards")
          .delete()
          .eq("id", id)
          .eq("id_empresa", user.id_empresa);

        if (err) throw err;
        setBoards((prev) => prev.filter((b) => b.id !== id));
      } catch (err) {
        console.error("Error deleting board:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  const createCard = useCallback(
    async (cardData: Omit<KanbanCard, "id" | "id_empresa" | "created_at" | "updated_at">) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { data, error: err } = await supabase
          .from("kanban_cards")
          .insert([{ ...cardData, id_empresa: user.id_empresa }])
          .select()
          .single();

        if (err) throw err;
        setCards((prev) => [data as KanbanCard, ...prev]);
        return data as KanbanCard;
      } catch (err) {
        console.error("Error creating card:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  const updateCard = useCallback(
    async (id: number, cardData: Partial<KanbanCard>) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { data, error: err } = await supabase
          .from("kanban_cards")
          .update(cardData)
          .eq("id", id)
          .eq("id_empresa", user.id_empresa)
          .select()
          .single();

        if (err) throw err;
        setCards((prev) => prev.map((c) => (c.id === id ? (data as KanbanCard) : c)));
        return data as KanbanCard;
      } catch (err) {
        console.error("Error updating card:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  const moveCard = useCallback(
    async (cardId: number, newColunaId: string, newOrdem: number) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { data, error: err } = await supabase
          .from("kanban_cards")
          .update({ coluna_id: newColunaId, ordem: newOrdem })
          .eq("id", cardId)
          .eq("id_empresa", user.id_empresa)
          .select()
          .single();

        if (err) throw err;
        setCards((prev) => prev.map((c) => (c.id === cardId ? (data as KanbanCard) : c)));
        return data as KanbanCard;
      } catch (err) {
        console.error("Error moving card:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  const deleteCard = useCallback(
    async (id: number) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { error: err } = await supabase
          .from("kanban_cards")
          .delete()
          .eq("id", id)
          .eq("id_empresa", user.id_empresa);

        if (err) throw err;
        setCards((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Error deleting card:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  return {
    boards,
    cards,
    loading,
    error,
    refetchBoards: fetchBoards,
    refetchCards: fetchCards,
    createBoard,
    updateBoard,
    deleteBoard,
    createCard,
    updateCard,
    moveCard,
    deleteCard,
  };
}
