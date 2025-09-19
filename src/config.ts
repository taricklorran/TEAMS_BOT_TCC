// Em seu arquivo config.ts
import * as dotenv from "dotenv";
dotenv.config();

const config = {
    MicrosoftAppId: process.env.MicrosoftAppId || "",
    MicrosoftAppPassword: process.env.MicrosoftAppPassword || "",
};

export default config;