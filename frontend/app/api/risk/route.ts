import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const incidents = await db.riskIncident.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(incidents);
    } catch (error) {
        console.error('Error fetching risk incidents:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, model, severity, status, assignee, sla } = body;

        const incident = await db.riskIncident.create({
            data: {
                title,
                model,
                severity,
                status,
                assignee,
                sla,
                userId: session.user.id
            }
        });

        return NextResponse.json(incident);
    } catch (error) {
        console.error('Error creating risk incident:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
