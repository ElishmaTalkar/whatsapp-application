import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessId, platform, accessToken, phoneNumberId, wabaId, pageId } = body;

        if (!businessId || !platform) {
            return NextResponse.json({ error: 'Business ID and Platform are required' }, { status: 400 });
        }

        if (!accessToken) {
            return NextResponse.json({ error: 'Access Token is required' }, { status: 400 });
        }

        const connection = await db.meta_connections.insert({
            businessId,
            platform,
            accessToken,
            phone_number_id: platform === 'whatsapp' ? phoneNumberId : null,
            waba_id: platform === 'whatsapp' ? wabaId : null,
            page_id: platform === 'instagram' ? pageId : null
        });

        return NextResponse.json({ status: 'success', id: connection.id });
    } catch (error) {
        console.error('Connection Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
