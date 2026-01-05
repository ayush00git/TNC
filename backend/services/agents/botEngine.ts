import { BotPersona } from "./botPersonas.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"} );

interface chat {
    sender: string, 
    text: string,
};

export const generateBotReply = async (persona: BotPersona, chatHistory: Messages[]): Promise<string> => {    
    try{
        const historyText = chatHistory.map((msg) => `${msg.sender}: ${msg.text}`).join("\n");
        const prompt = `
            System Instructions: ${persona.systemLayer}
            
              Task: Read the chat history below and participate in the conversation.
            - If the conversation is empty, start a new topic relevant to your persona.
            - If people are talking, reply naturally.
            - Keep your reply short (under 2 sentences).
            - Do NOT start your message with your name.

            Chat History: ${historyText}
            Your Reply:
        `;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return text.trim();
    }catch(error) {
        console.log(`Bot engine error: ${error}`);
        throw new Error(`While generating bot reply`);
    }
};
