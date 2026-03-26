import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ businessId: string }> }
) {
    try {
        const { businessId } = await params;
        if (!businessId) return NextResponse.json({ error: 'Business ID required' }, { status: 400 });

        const messages = await db.messages.listByBusinessId(businessId);
        return NextResponse.json({ messages: messages.reverse() }); // Newest first
    } catch (error) {
        console.error('Fetch Messages Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
