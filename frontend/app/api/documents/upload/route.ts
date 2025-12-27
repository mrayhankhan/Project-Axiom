import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { uploadFile, BUCKET_NAME } from '@/lib/storage';
import { supabase } from '@/lib/storage';
import { ingestDocument } from '@/lib/ingest';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const session = await auth();
        const userId = session?.user?.id || "demo-user-id";

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // 1. Upload to Supabase Storage
        const timestamp = Date.now();
        const filePath = `${userId}/${timestamp}-${file.name}`;

        // Convert File to ArrayBuffer for Supabase upload (Node.js environment)
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (uploadError) {
            console.error("Upload Error:", uploadError);
            return NextResponse.json({ error: 'Upload failed', details: uploadError.message }, { status: 500 });
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        // 3. Create Document Record in DB
        // First ensure we have a demo user if not exists (for testing without auth)
        let user = await db.user.findFirst({ where: { id: userId } });
        if (!user) {
            // Create a placeholder user if it doesn't exist (for development/demo)
            // In production, this would be handled by the auth session
            try {
                user = await db.user.upsert({
                    where: { email: 'demo@example.com' },
                    update: {},
                    create: {
                        id: userId,
                        email: 'demo@example.com',
                        name: 'Demo User',
                        role: 'admin'
                    }
                });
            } catch (e) {
                console.error("User creation error", e);
                // If upsert fails, try to find again or just proceed if we can't create
            }
        }

        const doc = await db.document.create({
            data: {
                name: file.name,
                url: publicUrl,
                type: file.type,
                size: file.size,
                status: 'pending', // Will be picked up by ingestion worker
                userId: userId,
            },
        });

        // 4. Trigger Ingestion
        try {
            await ingestDocument(doc.id);
        } catch (ingestError) {
            console.error("Ingestion triggered error but continuing:", ingestError);
        }

        return NextResponse.json({ success: true, document: doc });

    } catch (error: any) {
        console.error('Upload handler error:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
