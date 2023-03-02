import { Service } from "typedi";
import { IMessages, Entity } from "../types/p36.capui5gpt.chat";

@Service()
export default class MessagesRespository {
  public async getMessages(chatId: string): Promise<IMessages[]> {
    return <IMessages[]>await SELECT.from(Entity.Messages).where({ chat_ID: chatId }).orderBy("createdAt");
  }
}
