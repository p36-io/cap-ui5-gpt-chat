import { Service } from "typedi";
import { Entity, Sender } from "../types/p36.capui5gpt.chat";

@Service()
export default class ChatBuilder {
  /**
   * Read all messages fromt the chat and provide a string representation.
   *
   * @param chatId
   * @returns {Promise<string>} the context of the chat
   */
  public async getChatAsString(chatId: string): Promise<string> {
    const messages = await SELECT.from(Entity.Messages).where({ chat_ID: chatId }).orderBy("createdAt");
    return messages
      .map((message) => {
        const sender = message.sender === Sender.AI ? Sender.AI : "Human";
        const plainMessage = message.text.trim().replace(/\n/g, " ");

        return `${sender}: ${plainMessage}`;
      })
      .join("\n");
  }
}
