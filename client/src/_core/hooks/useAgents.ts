import { supabase } from "@/_core/supabase";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export interface Agent {
  id: number;
  id_empresa: number;
  agent_id: string;
  name: string;
  role: string;
  description: string;
  system_prompt: string;
  ai_provider: "openai" | "gemini" | "claude";
  model: string;
  temperature: number;
  max_tokens: number;
  status: "ativo" | "inativo";
  created_at: string;
  updated_at: string;
}

interface UseAgentsOptions {
  enabled?: boolean;
}

export function useAgents(options?: UseAgentsOptions) {
  const { enabled = true } = options ?? {};
  const { user } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAgents = useCallback(async () => {
    if (!user?.id_empresa || !enabled) {
      setAgents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("agents_config")
        .select("*")
        .eq("id_empresa", user.id_empresa)
        .order("created_at", { ascending: false });

      if (err) throw err;
      setAgents((data as Agent[]) || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching agents:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch agents"));
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id_empresa, enabled]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const createAgent = useCallback(
    async (agentData: Omit<Agent, "id" | "id_empresa" | "created_at" | "updated_at">) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { data, error: err } = await supabase
          .from("agents_config")
          .insert([{ ...agentData, id_empresa: user.id_empresa }])
          .select()
          .single();

        if (err) throw err;
        setAgents((prev) => [data as Agent, ...prev]);
        return data as Agent;
      } catch (err) {
        console.error("Error creating agent:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  const updateAgent = useCallback(
    async (id: number, agentData: Partial<Agent>) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { data, error: err } = await supabase
          .from("agents_config")
          .update(agentData)
          .eq("id", id)
          .eq("id_empresa", user.id_empresa)
          .select()
          .single();

        if (err) throw err;
        setAgents((prev) => prev.map((a) => (a.id === id ? (data as Agent) : a)));
        return data as Agent;
      } catch (err) {
        console.error("Error updating agent:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  const deleteAgent = useCallback(
    async (id: number) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { error: err } = await supabase
          .from("agents_config")
          .delete()
          .eq("id", id)
          .eq("id_empresa", user.id_empresa);

        if (err) throw err;
        setAgents((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error("Error deleting agent:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  return {
    agents,
    loading,
    error,
    refetch: fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
  };
}
