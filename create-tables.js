import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ooaoikddcyuujbgakrco.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vYW9pa2RkY3l1dWpiZ2FrcmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI5NjMyNCwiZXhwIjoyMDg2ODcyMzI0fQ.gq_e-dpkhH5SWnOEa6762GzUozh2HGkoRHJGStZzR60';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function createTables() {
  console.log('📊 Criando tabelas e inserindo dados de teste...\n');

  // 1. Criar tabela associados_snapshot
  console.log('1️⃣  Criando tabela associados_snapshot...');
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.associados_snapshot (
          id BIGSERIAL PRIMARY KEY,
          id_empresa BIGINT NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          cpf VARCHAR(20),
          status VARCHAR(50) DEFAULT 'ativo',
          valor_mensalidade DECIMAL(10, 2) DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_associados_empresa ON public.associados_snapshot(id_empresa);
      `
    });
    if (error) console.log('  ⚠️  Erro:', error.message);
    else console.log('  ✅ Tabela criada');
  } catch (err) {
    console.log('  ⚠️  Erro:', err.message);
  }

  // 2. Criar tabela sinistros_dados
  console.log('2️⃣  Criando tabela sinistros_dados...');
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.sinistros_dados (
          id BIGSERIAL PRIMARY KEY,
          id_empresa BIGINT NOT NULL,
          id_associado BIGINT,
          status VARCHAR(50) DEFAULT 'aberto',
          valor_sinistro DECIMAL(10, 2) DEFAULT 0,
          valor_pago DECIMAL(10, 2) DEFAULT 0,
          data_ocorrencia DATE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_sinistros_empresa ON public.sinistros_dados(id_empresa);
      `
    });
    if (error) console.log('  ⚠️  Erro:', error.message);
    else console.log('  ✅ Tabela criada');
  } catch (err) {
    console.log('  ⚠️  Erro:', err.message);
  }

  // 3. Criar tabela mensalidades_dados
  console.log('3️⃣  Criando tabela mensalidades_dados...');
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.mensalidades_dados (
          id BIGSERIAL PRIMARY KEY,
          id_empresa BIGINT NOT NULL,
          id_associado BIGINT,
          status VARCHAR(50) DEFAULT 'pendente',
          valor DECIMAL(10, 2) DEFAULT 0,
          mes_referencia DATE,
          data_pagamento DATE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_mensalidades_empresa ON public.mensalidades_dados(id_empresa);
      `
    });
    if (error) console.log('  ⚠️  Erro:', error.message);
    else console.log('  ✅ Tabela criada');
  } catch (err) {
    console.log('  ⚠️  Erro:', err.message);
  }

  // Aguardar um pouco para as tabelas serem criadas
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 4. Inserir dados de teste
  console.log('\n📝 Inserindo dados de teste...\n');

  // Associados
  console.log('4️⃣  Inserindo associados de teste...');
  try {
    const { error } = await supabase.from('associados_snapshot').insert([
      { id_empresa: 1, name: 'João Silva', email: 'joao@example.com', cpf: '123.456.789-00', status: 'ativo', valor_mensalidade: 150.00 },
      { id_empresa: 1, name: 'Maria Santos', email: 'maria@example.com', cpf: '987.654.321-00', status: 'ativo', valor_mensalidade: 150.00 },
      { id_empresa: 1, name: 'Pedro Oliveira', email: 'pedro@example.com', cpf: '456.789.123-00', status: 'inativo', valor_mensalidade: 150.00 },
      { id_empresa: 1, name: 'Ana Costa', email: 'ana@example.com', cpf: '789.123.456-00', status: 'ativo', valor_mensalidade: 200.00 },
      { id_empresa: 1, name: 'Carlos Mendes', email: 'carlos@example.com', cpf: '321.654.987-00', status: 'cancelado', valor_mensalidade: 150.00 },
    ]);
    if (error) console.log('  ⚠️  Erro:', error.message);
    else console.log('  ✅ 5 associados inseridos');
  } catch (err) {
    console.log('  ⚠️  Erro:', err.message);
  }

  // Sinistros
  console.log('5️⃣  Inserindo sinistros de teste...');
  try {
    const { error } = await supabase.from('sinistros_dados').insert([
      { id_empresa: 1, id_associado: 1, status: 'pago', valor_sinistro: 5000.00, valor_pago: 5000.00, data_ocorrencia: new Date('2024-02-15') },
      { id_empresa: 1, id_associado: 2, status: 'aberto', valor_sinistro: 3000.00, valor_pago: 0, data_ocorrencia: new Date('2024-03-01') },
      { id_empresa: 1, id_associado: 3, status: 'em_analise', valor_sinistro: 2500.00, valor_pago: 0, data_ocorrencia: new Date('2024-03-05') },
      { id_empresa: 1, id_associado: 4, status: 'pago', valor_sinistro: 8000.00, valor_pago: 8000.00, data_ocorrencia: new Date('2024-01-20') },
    ]);
    if (error) console.log('  ⚠️  Erro:', error.message);
    else console.log('  ✅ 4 sinistros inseridos');
  } catch (err) {
    console.log('  ⚠️  Erro:', err.message);
  }

  // Mensalidades
  console.log('6️⃣  Inserindo mensalidades de teste...');
  try {
    const { error } = await supabase.from('mensalidades_dados').insert([
      { id_empresa: 1, id_associado: 1, status: 'pago', valor: 150.00, mes_referencia: new Date('2024-02-01'), data_pagamento: new Date('2024-02-05') },
      { id_empresa: 1, id_associado: 2, status: 'pago', valor: 150.00, mes_referencia: new Date('2024-02-01'), data_pagamento: new Date('2024-02-03') },
      { id_empresa: 1, id_associado: 3, status: 'atrasado', valor: 150.00, mes_referencia: new Date('2024-02-01'), data_pagamento: null },
      { id_empresa: 1, id_associado: 4, status: 'pago', valor: 200.00, mes_referencia: new Date('2024-02-01'), data_pagamento: new Date('2024-02-02') },
      { id_empresa: 1, id_associado: 1, status: 'pago', valor: 150.00, mes_referencia: new Date('2024-03-01'), data_pagamento: new Date('2024-03-05') },
      { id_empresa: 1, id_associado: 2, status: 'pendente', valor: 150.00, mes_referencia: new Date('2024-03-01'), data_pagamento: null },
    ]);
    if (error) console.log('  ⚠️  Erro:', error.message);
    else console.log('  ✅ 6 mensalidades inseridas');
  } catch (err) {
    console.log('  ⚠️  Erro:', err.message);
  }

  console.log('\n✅ Tabelas criadas e dados de teste inseridos com sucesso!');
}

createTables();
