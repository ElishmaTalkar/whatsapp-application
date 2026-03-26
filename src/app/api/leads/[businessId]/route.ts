import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ businessId: string }> }
) {
    try {
        const { businessId } = await params;
        if (!businessId) return NextResponse.json({ error: 'Business ID required' }, { status: 400 });

        const leads = await db.leads.listByBusinessId(businessId);
        return NextResponse.json({ leads });
    } catch (error) {
        console.error('Fetch Leads Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
