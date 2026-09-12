import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

const chatModel = process.env.CHAT_MODEL;

export function initOpenAIEmbeddingModel() {
  const embeddingModel = process.env.EMBEDDING_MODEL;
  const fields = {
    batchSize: 512,
    modelName: embeddingModel
  };

  return new OpenAIEmbeddings(fields);
}

export function initOpenAIChatModel() {
  const fields = {
    modelName: chatModel,
    temperature: 0.1,
    topP: 0.7
  };

  return new ChatOpenAI(fields);
}