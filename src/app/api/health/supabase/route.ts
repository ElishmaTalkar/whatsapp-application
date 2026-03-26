import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const businesses = await db.businesses.list();
        const count = businesses.length;
        return NextResponse.json({
            status: 'success',
            message: 'Successfully connected to Local JSON Database!',
            count
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Local DB Connection failed',
            error
        }, { status: 500 });
    }
}
