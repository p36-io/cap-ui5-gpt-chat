import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai";
import { Service, Inject } from "typedi";
import MessagesRespository from "../repositories/MessagesRepository";
import PersonalitiesRespository from "../repositories/PersonalitiesRespository";
import { Sender } from "../types/p36.capui5gpt.chat";

@Service()
export default class ChatBuilder {
  @Inject()
  private messagesRepository: MessagesRespository;

  @Inject()
  private personalityRepository: PersonalitiesRespository;

  public async getChatAsPrompt(chatId: string, personalityId?: string): Promise<string> {
    const instructions = await this.readInstructions(personalityId);
    const chat = (await this.messagesRepository.getMessages(chatId))
      .map((message) => {
        const sender = message.sender === Sender.AI ? Sender.AI : Sender.HUMAN;
        const plainMessage = message.text.trim().replace(/\n/g, " ");

        return `${sender}: ${plainMessage}`;
      })
      .join("\n");

    return `${instructions}${chat}\nAI:`;
  }

  public async getChatAsMessages(chatId: string, personalityId?: string): Promise<ChatCompletionRequestMessage[]> {
    const instructions = await this.readInstructions(personalityId);
    const messages = (await this.messagesRepository.getMessages(chatId)).map((message) => {
      return {
        role:
          message.sender === Sender.AI
            ? ChatCompletionRequestMessageRoleEnum.Assistant
            : ChatCompletionRequestMessageRoleEnum.User,
        content: message.text.trim().replace(/\n/g, " "),
      };
    });

    return [{ role: ChatCompletionRequestMessageRoleEnum.System, content: instructions }, ...messages];
  }

  private async readInstructions(personalityId?: string): Promise<string> {
    if (!personalityId) return Promise.resolve("");

    const { instructions } = await this.personalityRepository.getPersonality(<string>personalityId);
    return instructions;
  }
}
