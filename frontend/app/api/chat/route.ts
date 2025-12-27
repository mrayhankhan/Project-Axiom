import { google } from '@ai-sdk/google';
import { streamText, embed } from 'ai';
import { db } from '@/lib/db';

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1];
        const userQuery = lastMessage.content;

        // 1. Embed User Query
        const { embedding } = await embed({
            model: google.textEmbeddingModel('text-embedding-004'),
            value: userQuery,
        });

        // 2. Search Vector DB
        // Use raw SQL for pgvector similarity search
        // Operator <-> is Euclidean distance (lower is better)
        // Operator <=> is Cosine distance (lower is better)
        // We use <=> for cosine similarity
        const vectorString = `[${embedding.join(',')}]`;

        const chunks = await db.$queryRaw`
      SELECT "content", "documentId", 1 - ("embedding" <=> ${vectorString}::vector) as similarity
      FROM "DocumentChunk"
      WHERE 1 - ("embedding" <=> ${vectorString}::vector) > 0.3
      ORDER BY similarity DESC
      LIMIT 5;
    ` as any[];

        // 3. Construct Context
        const context = chunks.map(chunk => chunk.content).join('\n\n');

        // 4. Generate Response
        const systemPrompt = `You are an intelligent assistant for Project Axiom.
    Use the following context to answer the user's question.
    If the answer is not in the context, say you don't know but try to be helpful.
    
    Context:
    ${context}
    `;

        const result = streamText({
            model: google('gemini-1.5-flash'),
            system: systemPrompt,
            messages,
        });

        return result.toTextStreamResponse();

    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
