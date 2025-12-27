import { db } from '@/lib/db';
import { google } from '@ai-sdk/google';
import { embed, embedMany } from 'ai';
// Polyfill for pdf-parse in Node.js
if (typeof Promise.withResolvers === 'undefined') {
    // @ts-ignore
    Promise.withResolvers = function () {
        let resolve, reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return { promise, resolve, reject };
    };
}

// @ts-ignore
if (typeof global.DOMMatrix === 'undefined') {
    // @ts-ignore
    global.DOMMatrix = class DOMMatrix { };
}

// @ts-ignore
const pdf = require('pdf-parse');

export async function ingestDocument(documentId: string) {
    try {
        // 1. Fetch Document Record
        const doc = await db.document.findUnique({
            where: { id: documentId },
        });

        if (!doc) {
            throw new Error('Document not found');
        }

        await db.document.update({
            where: { id: documentId },
            data: { status: 'processing' },
        });

        // 2. Fetch File Content
        const response = await fetch(doc.url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 3. Extract Text
        let text = '';
        if (doc.type === 'application/pdf') {
            const data = await pdf(buffer);
            text = data.text;
        } else if (doc.type === 'text/plain' || doc.type === 'text/markdown') {
            text = buffer.toString('utf-8');
        } else {
            // TODO: Handle other types (DOCX, etc.)
            console.warn(`Unsupported file type: ${doc.type}`);
            text = "Unsupported file type for text extraction.";
        }

        // 4. Chunk Text
        const chunks = splitTextIntoChunks(text, 1000); // ~1000 chars per chunk

        // 5. Generate Embeddings (Batch)
        // Gemini embedding model: text-embedding-004
        const { embeddings } = await embedMany({
            model: google.textEmbeddingModel('text-embedding-004'),
            values: chunks,
        });

        // 6. Store Chunks in DB
        // Prisma doesn't support bulk insert with raw SQL for vectors easily, 
        // so we iterate or use a transaction. For MVP, iteration is fine.

        // We need to use raw SQL to insert vectors because Prisma's Typed Client 
        // doesn't fully support pgvector syntax directly in `create` without raw query 
        // or specific extensions setup which might be tricky.
        // However, with `prisma-extension-vector` or just raw SQL it works.
        // Let's use $executeRaw for safety.

        for (let i = 0; i < chunks.length; i++) {
            const content = chunks[i];
            const embedding = embeddings[i];

            // Format embedding as string for pgvector: '[0.1, 0.2, ...]'
            const vectorString = `[${embedding.join(',')}]`;

            await db.$executeRaw`
        INSERT INTO "DocumentChunk" ("id", "content", "embedding", "pageNumber", "documentId", "createdAt")
        VALUES (gen_random_uuid(), ${content}, ${vectorString}::vector, ${1}, ${documentId}, NOW());
      `;
        }

        // 7. Update Document Status
        await db.document.update({
            where: { id: documentId },
            data: { status: 'indexed' },
        });

        console.log(`Successfully ingested document ${documentId}`);

    } catch (error) {
        console.error('Ingestion error:', error);
        await db.document.update({
            where: { id: documentId },
            data: { status: 'error' },
        });
        throw error;
    }
}

function splitTextIntoChunks(text: string, chunkSize: number): string[] {
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
}
