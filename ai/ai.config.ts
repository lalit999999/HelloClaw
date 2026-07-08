import "dotenv/config";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export function getAgentModel(): any {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  const modelId = process.env.OPENROUTER_DEFAULT_MODEL;
 
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");
  if (!modelId) throw new Error("OPENROUTER_DEFAULT_MODEL not set");

  const Provider = createOpenRouter({ apiKey });
  return Provider(modelId);
}
