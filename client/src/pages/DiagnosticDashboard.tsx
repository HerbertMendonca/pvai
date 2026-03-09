"use client";

import { useDiagnosticDashboard } from "@/_core/hooks/useDiagnosticDashboard";
import { AlertCircle, CheckCircle2, Loader } from "lucide-react";

export default function DiagnosticDashboard() {
  const { diagnostic, loading } = useDiagnosticDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center space-y-4">
          <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-slate-600">Executando diagnóstico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Diagnóstico do Dashboard</h1>
          <p className="text-slate-500 mt-2">Verificando conexão com Supabase e dados</p>
        </div>

        {/* Usuário */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">👤 Usuário Autenticado</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">ID Empresa:</span> {diagnostic?.user?.id_empresa || "❌ Não encontrado"}</p>
            <p><span className="font-semibold">Email:</span> {diagnostic?.user?.email || "❌ Não encontrado"}</p>
            <p><span className="font-semibold">Nome:</span> {diagnostic?.user?.name || "❌ Não encontrado"}</p>
          </div>
        </div>

        {/* Erros */}
        {diagnostic?.errors && diagnostic.errors.length > 0 && (
          <div className="bg-red-50 rounded-lg border border-red-200 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-bold text-red-900 mb-3">⚠️ Erros Encontrados</h2>
                <ul className="space-y-2">
                  {diagnostic.errors.map((error, idx) => (
                    <li key={idx} className="text-sm text-red-800 bg-red-100 p-2 rounded">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Dados Carregados */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              {diagnostic?.associadosCount ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-orange-600" />}
              <h3 className="font-semibold text-slate-900">Associados</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{diagnostic?.associadosCount || 0}</p>
            <p className="text-xs text-slate-500 mt-1">registros carregados</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              {diagnostic?.sinistrosCount ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-orange-600" />}
              <h3 className="font-semibold text-slate-900">Sinistros</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{diagnostic?.sinistrosCount || 0}</p>
            <p className="text-xs text-slate-500 mt-1">registros carregados</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              {diagnostic?.mensalidadesCount ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-orange-600" />}
              <h3 className="font-semibold text-slate-900">Mensalidades</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{diagnostic?.mensalidadesCount || 0}</p>
            <p className="text-xs text-slate-500 mt-1">registros carregados</p>
          </div>
        </div>

        {/* Dados Brutos */}
        <div className="space-y-4">
          {diagnostic?.associadosRaw && diagnostic.associadosRaw.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-3">📊 Amostra de Associados</h3>
              <pre className="bg-slate-50 p-4 rounded text-xs overflow-x-auto text-slate-700">
                {JSON.stringify(diagnostic.associadosRaw[0], null, 2)}
              </pre>
            </div>
          )}

          {diagnostic?.sinistrosRaw && diagnostic.sinistrosRaw.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-3">📊 Amostra de Sinistros</h3>
              <pre className="bg-slate-50 p-4 rounded text-xs overflow-x-auto text-slate-700">
                {JSON.stringify(diagnostic.sinistrosRaw[0], null, 2)}
              </pre>
            </div>
          )}

          {diagnostic?.mensalidadesRaw && diagnostic.mensalidadesRaw.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-3">📊 Amostra de Mensalidades</h3>
              <pre className="bg-slate-50 p-4 rounded text-xs overflow-x-auto text-slate-700">
                {JSON.stringify(diagnostic.mensalidadesRaw[0], null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Recomendações */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h2 className="text-lg font-bold text-blue-900 mb-3">💡 Recomendações</h2>
          <ul className="space-y-2 text-sm text-blue-800">
            {diagnostic?.errors && diagnostic.errors.length > 0 ? (
              <>
                <li>• Verifique se as políticas de RLS (Row Level Security) estão configuradas corretamente</li>
                <li>• Confirme que o usuário tem permissão de leitura nas tabelas</li>
                <li>• Verifique se os dados existem para o id_empresa: {diagnostic?.user?.id_empresa}</li>
              </>
            ) : (
              <>
                <li>✅ Conexão com Supabase funcionando corretamente</li>
                <li>✅ Dados sendo carregados com sucesso</li>
                <li>✅ Volte para o Dashboard para visualizar os KPIs</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
