"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/_core/supabase";

export interface DiagnosticData {
  user: any;
  associadosCount: number;
  sinistrosCount: number;
  mensalidadesCount: number;
  associadosRaw: any[];
  sinistrosRaw: any[];
  mensalidadesRaw: any[];
  errors: string[];
}

export function useDiagnosticDashboard() {
  const { user } = useAuth();
  const [diagnostic, setDiagnostic] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runDiagnostic = async () => {
      const errors: string[] = [];
      let associadosRaw = [];
      let sinistrosRaw = [];
      let mensalidadesRaw = [];

      try {
        if (!user?.id_empresa) {
          errors.push("Usuário não autenticado ou id_empresa não encontrado");
          setDiagnostic({ user, associadosCount: 0, sinistrosCount: 0, mensalidadesCount: 0, associadosRaw, sinistrosRaw, mensalidadesRaw, errors });
          setLoading(false);
          return;
        }

        console.log("🔍 Iniciando diagnóstico com id_empresa:", user.id_empresa);

        // Teste 1: Buscar Associados
        try {
          const { data, error } = await supabase
            .from("associados_snapshot")
            .select("*")
            .eq("id_empresa", user.id_empresa)
            .limit(5);

          if (error) {
            errors.push(`Erro ao buscar associados: ${error.message}`);
          } else {
            associadosRaw = data || [];
            console.log("✅ Associados carregados:", associadosRaw.length, associadosRaw);
          }
        } catch (err) {
          errors.push(`Exceção ao buscar associados: ${err}`);
        }

        // Teste 2: Buscar Sinistros
        try {
          const { data, error } = await supabase
            .from("sinistros_dados")
            .select("*")
            .eq("id_empresa", user.id_empresa)
            .limit(5);

          if (error) {
            errors.push(`Erro ao buscar sinistros: ${error.message}`);
          } else {
            sinistrosRaw = data || [];
            console.log("✅ Sinistros carregados:", sinistrosRaw.length, sinistrosRaw);
          }
        } catch (err) {
          errors.push(`Exceção ao buscar sinistros: ${err}`);
        }

        // Teste 3: Buscar Mensalidades
        try {
          const { data, error } = await supabase
            .from("mensalidades_dados")
            .select("*")
            .eq("id_empresa", user.id_empresa)
            .limit(5);

          if (error) {
            errors.push(`Erro ao buscar mensalidades: ${error.message}`);
          } else {
            mensalidadesRaw = data || [];
            console.log("✅ Mensalidades carregadas:", mensalidadesRaw.length, mensalidadesRaw);
          }
        } catch (err) {
          errors.push(`Exceção ao buscar mensalidades: ${err}`);
        }

        setDiagnostic({
          user,
          associadosCount: associadosRaw.length,
          sinistrosCount: sinistrosRaw.length,
          mensalidadesCount: mensalidadesRaw.length,
          associadosRaw,
          sinistrosRaw,
          mensalidadesRaw,
          errors,
        });
      } catch (err) {
        errors.push(`Erro geral no diagnóstico: ${err}`);
        setDiagnostic({ user, associadosCount: 0, sinistrosCount: 0, mensalidadesCount: 0, associadosRaw, sinistrosRaw, mensalidadesRaw, errors });
      } finally {
        setLoading(false);
      }
    };

    runDiagnostic();
  }, [user?.id_empresa]);

  return { diagnostic, loading };
}
