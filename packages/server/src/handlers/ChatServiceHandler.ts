import { Request } from "@sap/cds/apis/services";
import { Func, Handler, Param, Req } from "cds-routing-handlers";
import { Inject, Service } from "typedi";
import ChatBuilder from "../services/ChatBuilder";
import OpenAIService from "../services/OpenAIService";
import PersonalitiesRespository from "../services/PersonalitiesRespository";

@Handler()
@Service()
export default class ChatServiceHandler {
  @Inject()
  private openAIService: OpenAIService;

  @Inject()
  private chatBuilder: ChatBuilder;

  @Inject()
  private personalityRepository: PersonalitiesRespository;

  @Func("getModels")
  public async getModels(@Req() req: Request): Promise<void> {
    const models = await this.openAIService.readModels().catch((error) => {
      req.notify(500, error.message);
    });
    req.reply(models);
  }

  @Func("getCompletion")
  public async getCompletion(
    @Param("model") model: string,
    @Param("personality") personalityId: string,
    @Param("chat") chatId: string,
    @Req() req: Request
  ): Promise<void> {
    const chat = await this.chatBuilder.getChatAsString(<string>chatId);
    let prompt = `${chat}\nAI:`;

    if (personalityId) {
      const { instructions } = await this.personalityRepository.getPersonality(<string>personalityId);
      prompt = `${instructions}\n\n${prompt}`;
    }

    const response = await this.openAIService.createCompletion(prompt, model).catch((error) => {
      req.notify(500, error.message);
    });
    req.reply({
      message: response,
    });
  }
}
