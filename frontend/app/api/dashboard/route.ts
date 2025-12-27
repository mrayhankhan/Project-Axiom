import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // 1. Total Documents
        const totalDocuments = await db.document.count();

        // 2. Total Indexed Vectors (Chunks)
        const totalChunks = await db.documentChunk.count();

        // 3. Recent Activity (Last 5 uploaded documents)
        const recentDocs = await db.document.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        });

        const recentActivity = recentDocs.map(doc => ({
            action: 'Document uploaded',
            details: `${doc.name} added to knowledge base`,
            user: doc.user?.name || 'Unknown User',
            time: new Date(doc.createdAt).toLocaleDateString(), // Simplified time
            alert: false
        }));

        // 4. Mocked Metrics (for now, until we have real usage tracking)
        const activeModels = 14;
        const avgLatency = '124ms';
        const riskAlerts = 3;
        const monthlyTokens = '2.4M';

        return NextResponse.json({
            totalDocuments,
            totalChunks,
            activeModels,
            avgLatency,
            riskAlerts,
            monthlyTokens,
            recentActivity
        });

    } catch (error) {
        console.error('Dashboard API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
