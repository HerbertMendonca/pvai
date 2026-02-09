import SetorTemplate from "./SetorTemplate";
import { Calendar } from "lucide-react";

export default function Eventos() {
  return <SetorTemplate title="Eventos" description="Gestão de eventos e atividades" icon={<Calendar className="w-8 h-8 text-blue-600" />} />;
}
