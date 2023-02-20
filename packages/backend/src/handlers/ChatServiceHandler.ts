import { Request } from "@sap/cds/apis/services";
import { Func, Handler, Req } from "cds-routing-handlers";
import { Inject, Service } from "typedi";
import ChatService from "../services/ChatService";
import OpenAIService from "../services/OpenAIService";
import PersonalitiesService from "../services/PersonalitiesService";

@Handler()
@Service()
export default class ChatServiceHandler {
  @Inject()
  private openAIService: OpenAIService;

  @Inject()
  private chatService: ChatService;

  @Inject()
  private personalityService: PersonalitiesService;

  @Func("getModels")
  public async getModels(@Req() req: Request): Promise<void> {
    const models = await this.openAIService.getModels().catch((error) => {
      req.notify(500, error.message);
    });
    req.reply(models);
  }

  @Func("getCompletion")
  public async getCompletion(@Req() req: Request): Promise<void> {
    const { model, personality, chat } = req.data;

    // Read the instructions and build the context of the chat
    const instructions = !personality
      ? ""
      : await (
          await this.personalityService.getPersonality(<string>personality)
        ).instructions;
    const context = await this.chatService.getContext(<string>chat);

    // Call the OpenAI API
    const prompt = `${instructions}\n\n${context}\nAI:}`;
    const response = await this.openAIService.getCompletion(prompt, model).catch((error) => {
      req.notify(500, error.message);
    });
    req.reply({
      message: response,
    });
  }
}
