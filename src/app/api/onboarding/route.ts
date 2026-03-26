import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, useCase, id } = body;

        if (!name || !useCase) {
            return NextResponse.json({ error: 'Name and Use Case are required' }, { status: 400 });
        }

        const business = await db.businesses.insert({
            id,
            name,
            use_case: useCase,
            prompt_instruction: `You are a helpful assistant for ${name}. Your goal is to: ${useCase}.`
        });

        return NextResponse.json({ status: 'success', id: business.id });
    } catch (error) {
        console.error('Onboarding Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
