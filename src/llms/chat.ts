import OpenAI from "openai";
import { ChatMessage } from "../constants";

export const chatFns = async (
  traceTag: string,
  sessionId: string,
  convo: ChatMessage[],
  funcs: any,
  extraParams = {}
) => {
  const openai = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  });
  const requestParams = {
    model: "llama-3.1-8b-instant",
    messages: convo,
    functions: funcs,
    temperature: 0,
    ...extraParams,
  };
  try {
    //@ts-ignore
    const response = await openai.chat.completions.create(requestParams);
    if (!response.choices[0].message.function_call) {
      throw new Error(
        `Failed to call function. Context:\n${response.choices[0].message.content}`
      );
    }
    return response;
  } catch (exc) {
    throw new Error("Error getting LLM Response");
  }
};
