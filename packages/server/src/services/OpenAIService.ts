import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { Service, Inject } from "typedi";
import { Readable } from "stream";
import CompletionStream from "./CompletionStream";

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
  public async readModels(): Promise<{ id: string; category: string }[]> {
    return this.api.listModels().then((response) =>
      response.data.data
        .map((model) => {
          return {
            id: model.id,
            category: model.id.startsWith("gpt-4")
              ? "GPT-4"
              : model.id.startsWith("gpt-3.5")
              ? "GPT-3.5"
              : "GPT-3 and others",
          };
        })
        .sort((a, b) => b.category.localeCompare(a.category))
    );
  }

  public async createChatCompletionAsStream(
    messages: ChatCompletionRequestMessage[],
    model: string = "gpt-3.5-turbo"
  ): Promise<CompletionStream> {
    const attributes = this.config.completionAttributes || {};
    const response = await this.api.createChatCompletion(
      {
        ...this.mergeAttributesWithDefaults(attributes),
        model: model,
        messages: messages,
        stream: true,
      },
      {
        responseType: "stream",
      }
    );

    const readable = response.data as any as Readable;
    return this.buildStream(readable, (data) => {
      return data.choices[0]?.delta?.content;
    });
  }

  public async createChatCompletion(
    messages: ChatCompletionRequestMessage[],
    model: string = "gpt-3.5-turbo"
  ): Promise<string> {
    const attributes = this.config.completionAttributes || {};
    const response = this.api
      .createChatCompletion({
        ...this.mergeAttributesWithDefaults(attributes),
        model: model,
        messages: messages,
      })
      .then((response) => {
        return response.data.choices[0].message.content;
      })
      .catch((error) => {
        return `The OpenAI API sadly returned an error! (Error: ${error.message})`;
      });
    return response;
  }

  public async createCompletionAsStream(prompt: string, model: string = "text-davinci-003"): Promise<CompletionStream> {
    const attributes = this.config.completionAttributes || {};
    const response = await this.api.createCompletion(
      {
        ...this.mergeAttributesWithDefaults(attributes),
        model: model,
        prompt: prompt,
        stream: true,
      },
      {
        responseType: "stream",
      }
    );

    const readable = response.data as any as Readable;
    return this.buildStream(readable, (data) => {
      return data.choices[0].text;
    });
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
        ...this.mergeAttributesWithDefaults(attributes),
        model: model,
        prompt: prompt,
        stop: ["\nHuman:", "\nAI:"],
      })
      .then((response) => {
        return response.data.choices[0].text;
      })
      .catch((error) => {
        return `The OpenAI API sadly returned an error! (Error: ${error.message})`;
      });
    return response;
  }

  private mergeAttributesWithDefaults(attributes: CompletionAttributes): CompletionAttributes {
    return {
      max_tokens: attributes.max_tokens || 1200,
      temperature: attributes.temperature || 0.8,
      top_p: attributes.top_p || 1,
      frequency_penalty: attributes.frequency_penalty || 0,
      presence_penalty: attributes.presence_penalty || 0.6,
    };
  }

  private buildStream(readable: Readable, extractorCallback: (data: any) => string): CompletionStream {
    const stream = new CompletionStream();
    readable.on("data", async (completionData) => {
      try {
        const data = JSON.parse(completionData.toString().trim().replace("data: ", ""));
        const chunk = extractorCallback(data);
        chunk && stream.emit("chunk", chunk);
      } catch (error) {
        stream.emit("error", error);
      }
    });

    readable.on("end", () => {
      stream.emit("end");
    });
    return stream;
  }
}
