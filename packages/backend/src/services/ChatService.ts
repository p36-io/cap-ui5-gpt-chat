import { Service } from "typedi";
import { Entity } from "../types/p36.capui5gpt.chat";

@Service()
export default class ChatService {
  /**
   * Read all messages fromt the chat and provide the context.
   *
   * @param chatId
   * @returns {Promise<string>} the context of the chat
   */
  public async getContext(chatId: string): Promise<string> {
    const messages = await SELECT.from(Entity.Messages).where({ chat_ID: chatId }).orderBy("createdAt");
    return messages
      .map((message) => {
        return `${message.sender === "AI" ? "AI" : "Human"}: ${message.text.trim().replace(/\n/g, " ")}`;
      })
      .join("\n");
  }
}
