import 'dotenv/config';
import { Pool } from 'pg';

async function testConnection(connectionType: 'pooling' | 'direct') {
  let connectionString: string | undefined;

  if (connectionType === 'pooling') {
    connectionString = process.env.DATABASE_URL;
  } else {
    connectionString = process.env.DIRECT_URL;
  }

  if (!connectionString) {
    console.error(`A variável de ambiente para ${connectionType === 'pooling' ? 'DATABASE_URL' : 'DIRECT_URL'} não está configurada.`);
    return;
  }

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Necessário para Supabase com SSL
    },
  });

  try {
    console.log(`Tentando conectar ao Supabase (${connectionType})...`);
    const client = await pool.connect();
    console.log(`Conexão bem-sucedida com o Supabase (${connectionType})!`);
    const res = await client.query('SELECT NOW()');
    console.log('Query de teste executada com sucesso:', res.rows[0].now);
    client.release();
  } catch (error) {
    console.error(`Erro ao conectar ou consultar o Supabase (${connectionType}):`, error);
  } finally {
    await pool.end();
  }
}

testConnection('direct');
