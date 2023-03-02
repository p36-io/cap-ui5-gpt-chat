import { Service } from "typedi";
import { IPersonalities, Entity } from "../types/p36.capui5gpt.chat";

@Service()
export default class PersonalitiesRespository {
  public async getPersonality(personalityId: string): Promise<IPersonalities> {
    return await SELECT.one.from(Entity.Personalities, personalityId);
  }
}
