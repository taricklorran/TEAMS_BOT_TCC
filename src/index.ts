// Import required packages
import express from "express";

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import {
  CloudAdapter,
  ConfigurationServiceClientCredentialFactory,
  ConfigurationBotFrameworkAuthentication,
  TurnContext,
} from "botbuilder";

// This bot's main dialog.
import { TeamsBot, conversationReferences } from "./teamsBot";
import config from "./config";

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const credentialsFactory = new ConfigurationServiceClientCredentialFactory(config);

const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(
  {},
  credentialsFactory
);

const adapter = new CloudAdapter(botFrameworkAuthentication);

// Catch-all for errors.
const onTurnErrorHandler = async (context: TurnContext, error: Error) => {
  // This check writes out errors to console log .vs. app insights.
  // NOTE: In production environment, you should consider logging this to Azure
  //       application insights.
  console.error(`\n [onTurnError] unhandled error: ${error}`);

  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await context.sendTraceActivity(
    "OnTurnError Trace",
    `${error}`,
    "https://www.botframework.com/schemas/error",
    "TurnError"
  );

  // Send a message to the user
  await context.sendActivity(`The bot encountered unhandled error:\n ${error.message}`);
  await context.sendActivity("To continue to run this bot, please fix the bot source code.");
};

// Set the onTurnError for the singleton CloudAdapter.
adapter.onTurnError = onTurnErrorHandler;

// Create the bot that will handle incoming messages.
const bot = new TeamsBot();

// Create express application.
const expressApp = express();
expressApp.use(express.json());

const server = expressApp.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nBot Started, ${expressApp.name} listening to`, server.address());
});

// Listen for incoming requests.
expressApp.post("/api/messages", async (req, res) => {
  await adapter.process(req, res, async (context) => {
    await bot.run(context);
  });
});


expressApp.post("/api/webhook", async (req, res) => {
    console.log("Webhook recebido:", req.body);

    const conversationReferenceFromApi = req.body.addressing_info;
    const answer = req.body.final_output;

    if (!conversationReferenceFromApi || !answer) {
        console.error("Webhook recebido com dados incompletos.");
        return res.status(400).send("Payload incompleto.");
    }
    
    const sessionId = conversationReferenceFromApi.conversation.id;
    const storedConversationReference = conversationReferences[sessionId];

    if (!storedConversationReference) {
        console.error(`Referência da conversa não encontrada para session_id: ${sessionId}`);
        return res.status(404).send("Conversation not found");
    }

    await adapter.continueConversationAsync(
        process.env.MicrosoftAppId,
        storedConversationReference, 
        async (proactiveContext) => {
            await proactiveContext.sendActivity(answer);
        }
    );

    res.sendStatus(200);
});