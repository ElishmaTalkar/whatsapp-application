/**
 * Meta Graph API Utilities for WhatsApp and Instagram
 */

const GRAPH_API_VERSION = 'v18.0';

export async function sendWhatsAppMessage(
    to: string,
    text: string,
    accessToken: string,
    phoneNumberId: string
) {
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: to,
                type: 'text',
                text: { body: text },
            }),
        });

        const result = await response.json();
        return { success: response.ok, data: result };
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        return { success: false, error };
    }
}

export async function sendInstagramMessage(
    to: string,
    text: string,
    accessToken: string,
    pageId: string
) {
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/messages`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipient: { id: to },
                message: { text: text },
            }),
        });

        const result = await response.json();
        return { success: response.ok, data: result };
    } catch (error) {
        console.error('Error sending Instagram message:', error);
        return { success: false, error };
    }
}
