import { Configuration, OpenAIApi } from "openai";
import { Service, Inject } from "typedi";

@Service()
export default class OpenAIService {
  @Inject("openai-api-token")
  apiKey: string;

  private apiInstance: OpenAIApi;

  get api(): OpenAIApi {
    if (!this.apiInstance) {
      this.apiInstance = new OpenAIApi(
        new Configuration({
          apiKey: this.apiKey,
        })
      );
    }
    return this.apiInstance;
  }

  /**
   * Returns a list of all models
   *
   * @returns {Promise<{ id: string }[]>} the list of models
   */
  public async getModels(): Promise<{ id: string }[]> {
    return this.api.listModels().then((response) =>
      response.data.data.map((model) => {
        return {
          id: model.id,
        };
      })
    );
  }

  /**
   * Returns a completion for the given prompt and model
   *
   * @param prompt {string}
   * @param model {string}
   * @returns  {Promise<string>} the response of the model
   */
  public async getCompletion(prompt: string, model: string = "text-davinci-003"): Promise<string> {
    const response = await this.api
      .createCompletion({
        model: model,
        prompt: prompt,
        max_tokens: 1200,
        temperature: 0.8,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: ["\nHuman:", "\nAI:"],
      })
      .then((response) => {
        return response.data.choices[0].text;
      })
      .catch((error) => {
        return `The OpenAI API sadly returned an error! (Error: ${error.message}`;
      });
    return response;
  }
}
