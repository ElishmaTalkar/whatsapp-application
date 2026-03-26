import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const businesses = await db.businesses.list();

        const businessList = await Promise.all(businesses.map(async (b: any) => {
            const connection = await db.meta_connections.findByBusinessId(b.id);
            return {
                id: b.id,
                name: b.name,
                hasConnection: !!connection
            };
        }));

        return NextResponse.json({
            businesses: businessList
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch businesses' }, { status: 500 });
    }
}
