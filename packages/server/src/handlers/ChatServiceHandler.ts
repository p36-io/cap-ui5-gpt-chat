import { Request } from "@sap/cds/apis/services";
import { Func, Handler, Param, Req } from "cds-routing-handlers";
import { Inject, Service } from "typedi";
import ChatBuilder from "../services/ChatBuilder";
import OpenAIService from "../services/OpenAIService";
import { FuncGetCompletionReturn, FuncGetModelsReturn } from "../types/ChatService";

@Handler()
@Service()
export default class ChatServiceHandler {
  @Inject()
  private openAIService: OpenAIService;

  @Inject()
  private chatBuilder: ChatBuilder;

  @Func("getModels")
  public async getModels(@Req() req: Request): Promise<FuncGetModelsReturn> {
    const models = await this.openAIService.readModels().catch((error) => {
      req.notify(500, error.message);
    });
    return <FuncGetModelsReturn>models;
  }

  @Func("getCompletion")
  public async getCompletion(
    @Param("model") model: string,
    @Param("personality") personalityId: string,
    @Param("chat") chatId: string,
    @Req() req: Request
  ): Promise<FuncGetCompletionReturn> {
    let response: string;

    if (model.startsWith("gpt-3.5-turbo")) {
      const messages = await this.chatBuilder.getChatAsMessages(chatId, personalityId);
      response = await this.openAIService.createChatCompletion(messages, model);
    } else {
      const prompt = await this.chatBuilder.getChatAsPrompt(chatId, personalityId);
      response = await this.openAIService.createCompletion(prompt, model);
    }

    return <FuncGetCompletionReturn>{
      message: response,
    };
  }
}
