import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const BUCKET_NAME = 'documents';

export async function uploadFile(file: File | Blob, path: string) {
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
            upsert: true,
        });

    if (error) {
        throw error;
    }

    return data;
}

export async function getFileUrl(path: string) {
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);

    return data.publicUrl;
}
