import SetorTemplate from "./SetorTemplate";
import { DollarSign } from "lucide-react";

export default function Cobranca() {
  return <SetorTemplate title="Cobrança" description="Gestão de mensalidades e inadimplência" icon={<DollarSign className="w-8 h-8 text-blue-600" />} />;
}
