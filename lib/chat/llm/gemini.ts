import { GoogleGenerativeAI } from "@google/generative-ai";

import type { LLMStreamer, Message } from "../types";

export function createGeminiStreamer(
  apiKey: string | undefined,
  modelName = "gemini-2.5-flash"
): LLMStreamer {
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY missing — required to call Gemini chat. Set it in .env.local."
    );
  }
  const client = new GoogleGenerativeAI(apiKey);

  return {
    async *stream({ systemPrompt, messages }) {
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: { role: "system", parts: [{ text: systemPrompt }] },
      });
      const contents = messages.map((m: Message) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));
      const result = await model.generateContentStream({ contents });
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) yield text;
      }
    },
  };
}
