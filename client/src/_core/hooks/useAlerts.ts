import { supabase } from "@/_core/supabase";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export interface Alert {
  id: number;
  id_empresa: number;
  tipo: "anomalia" | "risco" | "operacional" | "financeiro" | "tecnico";
  severidade: "info" | "aviso" | "critico";
  titulo: string;
  descricao: string;
  origem: string;
  setor: string;
  dados_contexto: Record<string, any>;
  lido: boolean;
  resolvido: boolean;
  resolvido_por: number | null;
  resolvido_em: string | null;
  created_at: string;
}

interface UseAlertsOptions {
  enabled?: boolean;
  setor?: string;
  severidade?: "info" | "aviso" | "critico";
  lido?: boolean;
}

export function useAlerts(options?: UseAlertsOptions) {
  const { enabled = true, setor, severidade, lido } = options ?? {};
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAlerts = useCallback(async () => {
    if (!user?.id_empresa || !enabled) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase
        .from("alertas")
        .select("*")
        .eq("id_empresa", user.id_empresa);

      if (setor) query = query.eq("setor", setor);
      if (severidade) query = query.eq("severidade", severidade);
      if (lido !== undefined) query = query.eq("lido", lido);

      const { data, error: err } = await query.order("created_at", { ascending: false });

      if (err) throw err;
      setAlerts((data as Alert[]) || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch alerts"));
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id_empresa, enabled, setor, severidade, lido]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const markAsRead = useCallback(
    async (id: number) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { data, error: err } = await supabase
          .from("alertas")
          .update({ lido: true })
          .eq("id", id)
          .eq("id_empresa", user.id_empresa)
          .select()
          .single();

        if (err) throw err;
        setAlerts((prev) => prev.map((a) => (a.id === id ? (data as Alert) : a)));
        return data as Alert;
      } catch (err) {
        console.error("Error marking alert as read:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  const markAsResolved = useCallback(
    async (id: number) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { data, error: err } = await supabase
          .from("alertas")
          .update({
            resolvido: true,
            resolvido_por: parseInt(user.id),
            resolvido_em: new Date().toISOString(),
          })
          .eq("id", id)
          .eq("id_empresa", user.id_empresa)
          .select()
          .single();

        if (err) throw err;
        setAlerts((prev) => prev.map((a) => (a.id === id ? (data as Alert) : a)));
        return data as Alert;
      } catch (err) {
        console.error("Error marking alert as resolved:", err);
        throw err;
      }
    },
    [user?.id_empresa, user?.id]
  );

  const createAlert = useCallback(
    async (alertData: Omit<Alert, "id" | "id_empresa" | "created_at" | "resolvido_por" | "resolvido_em">) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { data, error: err } = await supabase
          .from("alertas")
          .insert([{ ...alertData, id_empresa: user.id_empresa }])
          .select()
          .single();

        if (err) throw err;
        setAlerts((prev) => [(data as Alert), ...prev]);
        return data as Alert;
      } catch (err) {
        console.error("Error creating alert:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  const deleteAlert = useCallback(
    async (id: number) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { error: err } = await supabase
          .from("alertas")
          .delete()
          .eq("id", id)
          .eq("id_empresa", user.id_empresa);

        if (err) throw err;
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error("Error deleting alert:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  return {
    alerts,
    loading,
    error,
    refetch: fetchAlerts,
    markAsRead,
    markAsResolved,
    createAlert,
    deleteAlert,
  };
}
