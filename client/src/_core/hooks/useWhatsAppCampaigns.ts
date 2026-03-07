import { supabase } from "@/_core/supabase";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export interface WhatsAppCampaign {
  id: number;
  id_empresa: number;
  titulo: string;
  descricao: string;
  mensagem: string;
  lista_segmentada: string;
  data_agendada: string;
  hora_agendada: string;
  status: "agendado" | "enviando" | "enviado" | "erro";
  total_contatos: number;
  enviados: number;
  erros: number;
  criado_por: number;
  created_at: string;
  updated_at: string;
}

interface UseWhatsAppCampaignsOptions {
  enabled?: boolean;
}

export function useWhatsAppCampaigns(options?: UseWhatsAppCampaignsOptions) {
  const { enabled = true } = options ?? {};
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampaigns = useCallback(async () => {
    if (!user?.id_empresa || !enabled) {
      setCampaigns([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("whatsapp_campaigns")
        .select("*")
        .eq("id_empresa", user.id_empresa)
        .order("created_at", { ascending: false });

      if (err) throw err;
      setCampaigns((data as WhatsAppCampaign[]) || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch campaigns"));
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id_empresa, enabled]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const createCampaign = useCallback(
    async (campaignData: Omit<WhatsAppCampaign, "id" | "id_empresa" | "created_at" | "updated_at" | "enviados" | "erros">) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { data, error: err } = await supabase
          .from("whatsapp_campaigns")
          .insert([{
            ...campaignData,
            id_empresa: user.id_empresa,
            criado_por: parseInt(user.id),
            enviados: 0,
            erros: 0,
          }])
          .select()
          .single();

        if (err) throw err;
        setCampaigns((prev) => [data as WhatsAppCampaign, ...prev]);
        return data as WhatsAppCampaign;
      } catch (err) {
        console.error("Error creating campaign:", err);
        throw err;
      }
    },
    [user?.id_empresa, user?.id]
  );

  const updateCampaign = useCallback(
    async (id: number, campaignData: Partial<WhatsAppCampaign>) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { data, error: err } = await supabase
          .from("whatsapp_campaigns")
          .update(campaignData)
          .eq("id", id)
          .eq("id_empresa", user.id_empresa)
          .select()
          .single();

        if (err) throw err;
        setCampaigns((prev) => prev.map((c) => (c.id === id ? (data as WhatsAppCampaign) : c)));
        return data as WhatsAppCampaign;
      } catch (err) {
        console.error("Error updating campaign:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  const deleteCampaign = useCallback(
    async (id: number) => {
      if (!user?.id_empresa) throw new Error("User not authenticated");

      try {
        const { error: err } = await supabase
          .from("whatsapp_campaigns")
          .delete()
          .eq("id", id)
          .eq("id_empresa", user.id_empresa);

        if (err) throw err;
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Error deleting campaign:", err);
        throw err;
      }
    },
    [user?.id_empresa]
  );

  return {
    campaigns,
    loading,
    error,
    refetch: fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };
}
