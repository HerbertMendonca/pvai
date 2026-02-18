import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  empresas,
  users,
  system_config,
  agents_config,
  associados_snapshot,
  veiculos_snapshot,
  sinistros_dados,
  mensalidades_dados,
  atendimentos_dados,
  vistorias_dados,
  kpis_diarios,
  conversas_whatsapp,
  mensagens_whatsapp,
  kanban_boards,
  kanban_cards,
  alertas,
  webhook_logs,
  agent_execution_logs,
} from "../drizzle/schema";

// Create database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set in environment variables.");
  throw new Error("DATABASE_URL is not set.");
}
console.log("Attempting to connect to database with URL:", connectionString);
let client;
try {
  client = postgres(connectionString);
} catch (error) {
  console.error("Failed to initialize postgres client:", error);
  throw error;
}
export const db = drizzle(client);

// Export all tables for easy access
export {
  empresas,
  users,
  system_config,
  agents_config,
  associados_snapshot,
  veiculos_snapshot,
  sinistros_dados,
  mensalidades_dados,
  atendimentos_dados,
  vistorias_dados,
  kpis_diarios,
  conversas_whatsapp,
  mensagens_whatsapp,
  kanban_boards,
  kanban_cards,
  alertas,
  webhook_logs,
  agent_execution_logs,
};
