import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Meta Webhook Verification (GET)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
        return new NextResponse(challenge, { status: 200 });
    }
    return new NextResponse('Forbidden', { status: 403 });
}

// Outbound Message Dispatcher (Meta Graph API)
async function dispatchWhatsAppMessage(phoneNumberId: string, accessToken: string, customerId: string, text: string) {
    const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: customerId,
                type: "text",
                text: { body: text }
            }),
        });
        const data = await res.json();
        console.log('[Meta] Dispatch Result:', data);
        return data.messaging_product === 'whatsapp';
    } catch (e) {
        console.error('[Meta] Dispatch Failed:', e);
        return false;
    }
}

// Handle AI Generation (GEMINI + GROQ FALLBACK)
async function generateAIResponse(prompt: string, userMessage: string, businessName: string) {
    const geminiKey = process.env.GEMINI_API_KEY?.trim();
    const groqKey = process.env.GROQ_API_KEY?.trim();

    const structuredSystemPrompt = `
        <IDENTITY>
        You are the exclusive AI assistant for "${businessName}". 
        Your sole purpose is to represent this business and assist customers with its specialized offerings.
        </IDENTITY>

        <BUSINESS_IDEA>
        ${prompt}
        </BUSINESS_IDEA>

        <GUIDELINES>
        - TONE: Be extremely polite, professional, and helpful at all times.
        - FOCUS: Your knowledge is strictly limited to "${businessName}" and its business offerings as described in <BUSINESS_IDEA>.
        - OFF-TOPIC RULE: If the user asks about anything unrelated to "${businessName}" (e.g., general knowledge, politics, history, other businesses, personal advice), you MUST politely decline to answer.
        - EXAMPLE DECLINE: "I'm sorry, I am specifically built to assist with ${businessName} inquiries. I don't have knowledge of this topic, but I'd be happy to help you with anything related to our business!"
        - NEVER mention you are an AI from Google or OpenAI; you are the dedicated "${businessName}" assistant.
        - Respond concisely and stay within your role as an expert for "${businessName}".
        </GUIDELINES>

        User Message: ${userMessage}
    `;

    if (geminiKey) {
        try {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(structuredSystemPrompt);
            return result.response.text();
        } catch (e: any) {
            console.error('[AI Debug] Gemini Error:', e.message || e);
        }
    }

    if (groqKey) {
        try {
            const groq = new OpenAI({
                apiKey: groqKey,
                baseURL: "https://api.groq.com/openai/v1"
            });
            const completion = await groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: `You are the professional AI assistant for "${businessName}". ${prompt}. Respond concisely.` },
                    { role: "user", content: userMessage }
                ],
            });
            return completion.choices[0].message.content;
        } catch (e: any) {
            console.error('[AI Debug] Groq Error:', e.message || e);
            return `AI Error: Both providers failed. Groq error: ${e.message}`;
        }
    }

    return "Error: No valid AI API keys found. Please check .env.local.";
}

// Handle Incoming Messages (POST)
export async function POST(req: Request) {
    const body = await req.json();

    try {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;

        if (messages && messages.length > 0) {
            const message = messages[0];
            const customerId = message.from;
            const text = message.text?.body;
            const phoneNumberIdInbound = value.metadata?.phone_number_id;

            const businessIdHeader = req.headers.get('x-business-id');
            let business;
            let connection;

            if (businessIdHeader) {
                business = await db.businesses.find(businessIdHeader);
                connection = await db.meta_connections.findByBusinessId(businessIdHeader);
            } else {
                connection = await db.meta_connections.findByPhone(phoneNumberIdInbound);
                if (connection) business = await db.businesses.find(connection.business_id);
            }

            if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

            // Lead Extraction: Capture customer details
            const contact = value.contacts?.[0];
            const customerName = contact?.profile?.name;
            await db.leads.upsert({
                business_id: business.id,
                phone_number: customerId,
                name: customerName
            });

            // Generate AI Response
            const aiResponse = await generateAIResponse(business.prompt_instruction || '', text || '', business.name || '');

            // Production Handoff: Dispatch to real WhatsApp API
            const isDemo = req.headers.get('x-demo-mode') === 'true';
            if (!isDemo && connection?.access_token && connection?.phone_number_id && aiResponse) {
                await dispatchWhatsAppMessage(
                    connection.phone_number_id as string,
                    connection.access_token as string,
                    customerId,
                    aiResponse
                );
            }

            // Save to Local DB for Dashboard
            await db.messages.insert({
                business_id: business.id,
                customer_id: customerId,
                platform: 'whatsapp',
                incoming_payload: JSON.stringify(body),
                ai_response: aiResponse,
                status: 'dispatched'
            });

            if (isDemo) {
                return NextResponse.json({ status: 'success', aiResponse });
            }
        }
        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
