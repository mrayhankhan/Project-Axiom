import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        // TODO: Get userId from session
        const userId = "demo-user-id";

        const documents = await db.document.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                _count: {
                    select: { chunks: true }
                }
            }
        });

        return NextResponse.json(documents);
    } catch (error: any) {
        console.error('Fetch documents error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
