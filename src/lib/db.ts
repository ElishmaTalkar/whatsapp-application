import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null as any;

// Helper to ensure supabase is initialized before use
const getSupabase = () => {
    if (!supabase) {
        throw new Error("Supabase is not initialized. Check your environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY).");
    }
    return supabase;
};

export const db = {
    businesses: {
        insert: async (data: any) => {
            const { data: business, error } = await supabase
                .from('businesses')
                .insert([{
                    name: data.name,
                    use_case: data.use_case,
                    prompt_instruction: data.prompt_instruction
                }])
                .select()
                .single();

            if (error) throw error;
            return business;
        },
        find: async (id: string) => {
            const { data, error } = await supabase
                .from('businesses')
                .select('*')
                .eq('id', id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        },
        list: async () => {
            const { data, error } = await supabase
                .from('businesses')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        }
    },
    meta_connections: {
        insert: async (data: any) => {
            const { data: connection, error } = await supabase
                .from('meta_connections')
                .insert([{
                    business_id: data.businessId || data.business_id,
                    platform: data.platform,
                    access_token: data.accessToken || data.access_token,
                    phone_number_id: data.phone_number_id,
                    waba_id: data.waba_id,
                    page_id: data.page_id
                }])
                .select()
                .single();

            if (error) throw error;
            return connection;
        },
        findByPhone: async (phoneId: string) => {
            const { data, error } = await supabase
                .from('meta_connections')
                .select('*')
                .eq('phone_number_id', phoneId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        },
        findByBusinessId: async (bizId: string) => {
            const { data, error } = await supabase
                .from('meta_connections')
                .select('*')
                .eq('business_id', bizId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        },
        list: async () => {
            const { data, error } = await supabase
                .from('meta_connections')
                .select('*');

            if (error) throw error;
            return data || [];
        }
    },
    messages: {
        insert: async (data: any) => {
            const { data: message, error } = await supabase
                .from('messages')
                .insert([{
                    business_id: data.business_id,
                    customer_id: data.customer_id,
                    platform: data.platform,
                    incoming_payload: data.incoming_payload,
                    ai_response: data.ai_response,
                    status: data.status
                }])
                .select()
                .single();

            if (error) throw error;
            return message;
        },
        listByBusinessId: async (bizId: string) => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('business_id', bizId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        }
    },
    leads: {
        upsert: async (data: { business_id: string; phone_number: string; name?: string }) => {
            const { error } = await supabase.rpc('upsert_lead', {
                p_business_id: data.business_id,
                p_phone_number: data.phone_number,
                p_name: data.name
            });

            // Fallback if RPC is not set up correctly yet
            if (error) {
                const { error: upsertError } = await supabase
                    .from('leads')
                    .upsert({
                        business_id: data.business_id,
                        phone_number: data.phone_number,
                        name: data.name,
                        last_interaction: new Date().toISOString()
                    }, { onConflict: 'business_id,phone_number' });
                if (upsertError) throw upsertError;
            }
        },
        listByBusinessId: async (bizId: string) => {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('business_id', bizId)
                .order('last_interaction', { ascending: false });

            if (error) throw error;
            return data || [];
        }
    },
    users: {
        create: async (data: { email: string; passwordHash: string; name?: string }) => {
            const { data: user, error } = await supabase
                .from('users')
                .insert([{
                    email: data.email,
                    password: data.passwordHash,
                    name: data.name
                }])
                .select()
                .single();

            if (error) throw error;
            return user.id;
        },
        findByEmail: async (email: string) => {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data;
        }
    }
};
