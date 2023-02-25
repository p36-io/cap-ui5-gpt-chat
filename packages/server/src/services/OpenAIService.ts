import { Configuration, OpenAIApi } from "openai";
import { Service, Inject } from "typedi";

export interface OpenAIConfing {
  apiKey: string;
  completionAttributes?: CompletionAttributes;
}
export interface CompletionAttributes {
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

@Service()
export default class OpenAIService {
  @Inject("openai-config")
  config: OpenAIConfing;

  private apiInstance: OpenAIApi;

  get api(): OpenAIApi {
    this.apiInstance ??= new OpenAIApi(
      new Configuration({
        apiKey: this.config.apiKey,
      })
    );

    return this.apiInstance;
  }

  /**
   * Returns a list of all models
   *
   * @returns {Promise<{ id: string }[]>} the list of models
   */
  public async readModels(): Promise<{ id: string }[]> {
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
  public async createCompletion(prompt: string, model: string = "text-davinci-003"): Promise<string> {
    const attributes = this.config.completionAttributes || {};
    const response = await this.api
      .createCompletion({
        model: model,
        prompt: prompt,
        stop: ["\nHuman:", "\nAI:"],
        max_tokens: attributes.max_tokens || 1200,
        temperature: attributes.temperature || 0.8,
        top_p: attributes.top_p || 1,
        frequency_penalty: attributes.frequency_penalty || 0,
        presence_penalty: attributes.presence_penalty || 0.6,
      })
      .then((response) => {
        return response.data.choices[0].text;
      })
      .catch((error) => {
        return `The OpenAI API sadly returned an error! (Error: ${error.message})`;
      });
    return response;
  }
}
