import { ConversationReference } from "botbuilder";

export async function aiAgentApi(user_id: string, question: string, session_id: string, conversationReference: Partial<ConversationReference>) {
    const API_URL = "http://localhost:8000/api/v1/ask";
    
    const WEBHOOK_URL = "http://localhost:3978/api/webhook";

    const payload = {
        user_id: user_id,
        question: question,
        session_id: "12345678",
        webhook_url: WEBHOOK_URL,
        addressing_info: conversationReference
    };

    console.log("Enviando payload para a API:", payload);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Erro na chamada da API! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Ocorreu um erro na função aiAgentApi:", error);
        throw error;
    }
}