import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, X } from "lucide-react";

export interface DashboardFiltersState {
  startDate: Date | null;
  endDate: Date | null;
  setor?: string;
  status?: string;
  searchQuery?: string;
}

interface DashboardFiltersProps {
  onFiltersChange: (filters: DashboardFiltersState) => void;
  onReset: () => void;
}

const setores = [
  "Todos",
  "Proteção Veicular",
  "Assistência 24h",
  "Vidros",
  "Terceiros",
];

const statuses = [
  "Todos",
  "Ativo",
  "Inativo",
  "Suspenso",
  "Cancelado",
];

export default function DashboardFilters({ onFiltersChange, onReset }: DashboardFiltersProps) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [setor, setSetor] = useState<string>("Todos");
  const [status, setStatus] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApplyFilters = () => {
    const filters: DashboardFiltersState = {
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      setor: setor !== "Todos" ? setor : undefined,
      status: status !== "Todos" ? status : undefined,
      searchQuery: searchQuery || undefined,
    };
    onFiltersChange(filters);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setSetor("Todos");
    setStatus("Todos");
    setSearchQuery("");
    onReset();
  };

  const hasActiveFilters = startDate || endDate || setor !== "Todos" || status !== "Todos" || searchQuery;

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Filtros Avançados</h3>
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                {[startDate, endDate, setor !== "Todos", status !== "Todos", searchQuery].filter(Boolean).length} ativo(s)
              </span>
            )}
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <Input
                type="text"
                placeholder="Buscar por nome, CPF, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Setor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Setor</label>
              <select
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {setores.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleApplyFilters}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Aplicar Filtros
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
