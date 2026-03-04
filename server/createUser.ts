import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: ".env" });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createUserAndSync(email: string, password: string, role: string, id_empresa: number) {
  try {
    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Automatically confirm email
    });

    if (authError) {
      console.error('Error creating user in Supabase Auth:', authError.message);
      return;
    }

    if (!authData.user) {
      console.error('User data not returned after creation.');
      return;
    }

    console.log('User created in Supabase Auth:', authData.user.id);

    // 2. Sync user to 'users' table in public schema
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: authData.user.id, // Use the UUID from Supabase Auth
          email: authData.user.email,
          role: role,
          id_empresa: id_empresa,
          name: authData.user.email?.split('@')[0], // Default name
        },
      ])
      .select();

    if (userError) {
      console.error('Error syncing user to public.users table:', userError.message);
      // Optionally, delete the user from auth if sync fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return;
    }

    console.log('User synced to public.users table:', userData);
    console.log(`Admin user ${email} created and synced successfully!`);
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
}

const email = 'nex1brasil@gmail.com';
const password = '123456';
const role = 'super_admin';
const id_empresa = 1; // Assuming a default company ID for now

createUserAndSync(email, password, role, id_empresa);
