import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export async function GET() {
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const groqKey = process.env.GROQ_API_KEY?.trim();

    const results: any = { gemini: {}, groq: {} };

    // Test Gemini
    if (geminiKey) {
        try {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("Test");
            results.gemini = { success: true, message: result.response.text().slice(0, 20) };
        } catch (e: any) {
            results.gemini = { success: false, error: e.message };
        }
    } else {
        results.gemini = { success: false, error: "Key missing" };
    }

    // Test Groq
    if (groqKey) {
        try {
            const groq = new OpenAI({
                apiKey: groqKey,
                baseURL: "https://api.groq.com/openai/v1"
            });
            const completion = await groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: "Say 'Groq Ready'" }],
            });
            results.groq = { success: true, message: completion.choices[0].message.content };
        } catch (e: any) {
            results.groq = { success: false, error: e.message };
        }
    } else {
        results.groq = { success: false, error: "Key missing" };
    }

    return NextResponse.json(results);
}
