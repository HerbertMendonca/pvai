import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

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

async function deleteUser(email: string) {
  try {
    const { data: users, error: searchError } = await supabaseAdmin.auth.admin.listUsers();
    if (searchError) {
      console.error('Error listing users:', searchError.message);
      return;
    }

    const userToDelete = users.users.find(u => u.email === email);
    if (userToDelete) {
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userToDelete.id);
      if (deleteError) {
        console.error('Error deleting user:', deleteError.message);
      } else {
        console.log(`User ${email} deleted from Supabase Auth.`);
      }
    } else {
      console.log(`User ${email} not found in Supabase Auth.`);
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
}

deleteUser('nex1brasil@gmail.com');
