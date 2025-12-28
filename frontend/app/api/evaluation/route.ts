import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const evaluations = await db.evaluation.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            include: { testCases: true }
        });

        return NextResponse.json(evaluations);
    } catch (error) {
        console.error('Error fetching evaluations:', error);
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
        const { model, name } = body; // name is optional/unused in schema for now but good for future

        // Simulate a run
        const evaluation = await db.evaluation.create({
            data: {
                model,
                status: 'running',
                userId: session.user.id
            }
        });

        // In a real app, we'd trigger a background job here.
        // For now, we'll just simulate completion after a short delay in the frontend,
        // or we can update it immediately to 'completed' with mock results for the demo.

        // Let's update it to completed immediately for instant gratification in this demo phase
        const updatedEval = await db.evaluation.update({
            where: { id: evaluation.id },
            data: {
                status: 'completed',
                accuracy: 92.5,
                precision: 91.0,
                recall: 93.2,
                f1: 92.1,
                latency: 145,
                tokens: 15420,
                duration: '45s',
                testCases: {
                    create: [
                        { query: 'Test Query 1', expected: 'A', actual: 'A', match: true },
                        { query: 'Test Query 2', expected: 'B', actual: 'B', match: true },
                        { query: 'Test Query 3', expected: 'C', actual: 'D', match: false },
                    ]
                }
            },
            include: { testCases: true }
        });

        return NextResponse.json(updatedEval);
    } catch (error) {
        console.error('Error creating evaluation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
