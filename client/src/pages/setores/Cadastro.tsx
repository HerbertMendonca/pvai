import SetorTemplate from "./SetorTemplate";
import { UserPlus } from "lucide-react";

export default function Cadastro() {
  return (
    <SetorTemplate
      title="Cadastro"
      description="Gestão de cadastros de associados e veículos"
      icon={<UserPlus className="w-8 h-8 text-blue-600" />}
    />
  );
}
