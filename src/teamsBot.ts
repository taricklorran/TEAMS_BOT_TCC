import {
    TeamsActivityHandler,
    CardFactory,
    TurnContext,
    ConversationReference
} from "botbuilder";

// Importa a sua função que chama a API
import { aiAgentApi } from "./api/agent";
import * as rawWelcomeCard from "./adaptativeCards/welcome.json";

const conversationReferences: { [key: string]: Partial<ConversationReference> } = {};

export class TeamsBot extends TeamsActivityHandler {
    constructor() {
        super();

        // Manipulador para quando uma mensagem é recebida
        this.onMessage(async (context, next) => {
            console.log("Running with Message Activity.");

            // Pega o texto da mensagem e remove a menção ao bot
            const question = TurnContext.removeRecipientMention(context.activity)?.trim();

            if (!question) {
                await next();
                return;
            }

            const conversationReference = TurnContext.getConversationReference(context.activity);
            conversationReferences[conversationReference.conversation.id] = conversationReference;

            try {
                // Parâmetros para a API
                const userId = "tarick";
                const sessionId = context.activity.conversation.id.split('|')[0];

                // Informa ao usuário que a requisição está em andamento
                await context.sendActivity("Processando sua pergunta, por favor aguarde...");
                await context.sendActivity({ type: 'typing' });

                await aiAgentApi(userId, question, sessionId, conversationReference);
                
                console.log("API chamada com sucesso.");

            } catch (error) {
                console.error("Falha ao processar a mensagem com a API:", error);
                await context.sendActivity("Desculpe, não consegui processar sua solicitação no momento.");
            }
            await next();
        });

        // Manipulador para quando membros são adicionados ao chat (mantido como estava)
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            if (membersAdded && membersAdded.length > 0) {
                for (const member of membersAdded) {
                    if (member.id !== context.activity.recipient.id) {
                        const welcomeCard = CardFactory.adaptiveCard(rawWelcomeCard);
                        await context.sendActivity({ attachments: [welcomeCard] });
                    }
                }
            }
            await next();
        });
    }
}

export { conversationReferences };