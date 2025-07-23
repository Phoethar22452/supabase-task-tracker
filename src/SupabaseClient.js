import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kkormvpqpfkqzptcshbn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrb3JtdnBxcGZrcXpwdGNzaGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMDUxODYsImV4cCI6MjA2ODY4MTE4Nn0.-PSH_3P6QlH6v_B4pB0MEhAtR4TNGy-hjlfsCVnDSyk';

export const supabase = createClient(supabaseUrl, supabaseKey);