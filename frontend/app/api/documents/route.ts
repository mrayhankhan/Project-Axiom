import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        const userId = session?.user?.id || "demo-user-id";

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
