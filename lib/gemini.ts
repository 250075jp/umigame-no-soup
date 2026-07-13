import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const isMockAI = process.env.MOCK_AI === "true";

export default ai;
