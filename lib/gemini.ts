import { GoogleGenerativeAI } from "@google/generative-ai";

const keys = process.env.GEMINI_API_KEYS?.split(",") || [];

let currentIndex = 0;

function getNextKey() {
  if (keys.length === 0) {
    throw new Error("No Gemini API keys configured");
  }

  const key = keys[currentIndex];
  currentIndex = (currentIndex + 1) % keys.length;
  return key;
}

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// export default model;


export async function callGeminiWithRotation(prompt: string) {
  const maxAttempts = keys.length;

  for (let i = 0; i < maxAttempts; i++) {
    const apiKey = getNextKey();
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const result = await model.generateContent(prompt);
      return result.response.text();

    } catch (error: any) {
      const isQuotaError =
        error?.status === 429 ||
        error?.message?.includes("quota") ||
        error?.message?.includes("exceeded");

      if (!isQuotaError) {
        throw error; // not quota issue, don't rotate
      }

      console.warn(`Key exhausted, switching to next key...`);
    }
  }

  throw new Error("All Gemini API keys exhausted");
}