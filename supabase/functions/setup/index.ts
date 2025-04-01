
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject()
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    // Check if settings table exists, if not create it
    const { error: tableError } = await supabaseClient.rpc('create_settings_table_if_not_exists')
    
    if (tableError) {
      console.error('Error creating settings table:', tableError)
      
      // Try direct SQL if RPC fails
      const { error: sqlError } = await supabaseClient.from('_manual_sql').select('*').eq('name', 'create_settings_table').single()
      
      if (sqlError) {
        console.error('Error running manual SQL:', sqlError)
        
        // Last resort: create table directly
        const { error: directError } = await supabaseClient.rpc('exec', {
          sql: `
            CREATE TABLE IF NOT EXISTS public.settings (
              id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
              key TEXT NOT NULL UNIQUE,
              value JSONB NOT NULL DEFAULT '{}'::jsonb,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
            );
          `
        })
        
        if (directError) {
          console.error('Error creating settings table directly:', directError)
          throw new Error('Could not create settings table')
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

// Helper function to create a Supabase client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
