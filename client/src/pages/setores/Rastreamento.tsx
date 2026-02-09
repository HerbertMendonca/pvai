import SetorTemplate from "./SetorTemplate";
import { MapPin } from "lucide-react";

export default function Rastreamento() {
  return <SetorTemplate title="Rastreamento" description="Monitoramento e rastreamento de veículos" icon={<MapPin className="w-8 h-8 text-blue-600" />} />;
}
