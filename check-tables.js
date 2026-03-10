import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ooaoikddcyuujbgakrco.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vYW9pa2RkY3l1dWpiZ2FrcmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyOTYzMjQsImV4cCI6MjA4Njg3MjMyNH0.9tLxN6OXVoLFadek12Yspk-NCbfeYGlciOMdtNS9JuY';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkTables() {
  console.log('🔍 Verificando tabelas do Supabase...\n');

  const tables = [
    'associados_snapshot',
    'sinistros_dados',
    'mensalidades_dados',
    'agents_config',
    'alertas',
    'kanban_boards',
    'kanban_cards',
    'whatsapp_campaigns'
  ];

  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${count} registros`);
      }
    } catch (err) {
      console.log(`⚠️  ${table}: Erro ao acessar - ${err.message}`);
    }
  }

  console.log('\n📊 Verificando dados de uma empresa específica...\n');

  // Tentar buscar dados com id_empresa = 1
  try {
    const { data: associados, error: err1 } = await supabase
      .from('associados_snapshot')
      .select('*')
      .eq('id_empresa', 1)
      .limit(1);

    console.log('Associados (id_empresa=1):', associados?.length || 0, 'registros');
    if (err1) console.log('  Erro:', err1.message);

    const { data: sinistros, error: err2 } = await supabase
      .from('sinistros_dados')
      .select('*')
      .eq('id_empresa', 1)
      .limit(1);

    console.log('Sinistros (id_empresa=1):', sinistros?.length || 0, 'registros');
    if (err2) console.log('  Erro:', err2.message);

    const { data: mensalidades, error: err3 } = await supabase
      .from('mensalidades_dados')
      .select('*')
      .eq('id_empresa', 1)
      .limit(1);

    console.log('Mensalidades (id_empresa=1):', mensalidades?.length || 0, 'registros');
    if (err3) console.log('  Erro:', err3.message);
  } catch (err) {
    console.log('Erro ao buscar dados:', err.message);
  }
}

checkTables();
