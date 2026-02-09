import SetorTemplate from "./SetorTemplate";
import { Megaphone } from "lucide-react";

export default function Marketing() {
  return <SetorTemplate title="Marketing" description="Campanhas e comunicação" icon={<Megaphone className="w-8 h-8 text-blue-600" />} />;
}
