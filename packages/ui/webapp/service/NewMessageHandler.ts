import Context from "sap/ui/model/odata/v4/Context";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { IChats, IMessages, Sender } from "../types/ChatService";
import ChatService from "./ChatService";

export interface INewMessageHandlerSettings {
  chat: IChats;
  message: string;
  binding: ODataListBinding;
  sender: string;
  streamingCallback?: (chunk: string, replyContext: Context) => void;
}

/**
 * This class is responsible for creating a new message wtth a corresponding completion reply.
 */
export default class NewMessageHandler {
  private chat: IChats;
  private message: string;
  private binding: ODataListBinding;
  private sender: string;
  private streamingCallback?: (chunk: string, replyContext: Context) => void;

  constructor(settings: INewMessageHandlerSettings) {
    this.chat = settings.chat;
    this.message = settings.message;
    this.binding = settings.binding;
    this.sender = settings.sender;
    this.streamingCallback = settings.streamingCallback;
  }

  /**
   * Creates a new message and a completion reply. Depending on the chat settings, the completion
   * reply is either retrieved in one request or in multiple streaming requests, which can be captured by the streamingCallback.
   *
   * @returns {Promise<void>}
   */
  public async createMessageAndCompletion(): Promise<void> {
    const chatService = ChatService.getInstance();

    await chatService.createEntity<IMessages>({
      binding: this.binding,
      entity: <IMessages>{
        text: this.message.trim(),
        model: this.chat.model,
        sender: this.sender,
        chat_ID: this.chat.ID,
      },
      atEnd: true,
      submitBatch: true,
    });

    if (this.chat.streamingEnabled) {
      await this.handleStreamingCompletion();
    } else {
      await this.handleCompletion();
    }
  }

  protected async handleCompletion(): Promise<void> {
    const chatService = ChatService.getInstance();
    const completion = await chatService.getCompletion({
      chat: this.chat.ID,
      model: this.chat.model,
      personality: this.chat.personality_ID,
    });

    await chatService.createEntity<IMessages>({
      binding: this.binding,
      entity: <IMessages>{
        text: completion.message,
        model: this.chat.model,
        sender: Sender.AI,
        chat_ID: this.chat.ID,
      },
      atEnd: true,
      submitBatch: true,
    });
  }

  protected async handleStreamingCompletion(): Promise<void> {
    const chatService = ChatService.getInstance();
    const model = this.binding.getModel() as ODataModel;
    const responseContext = await chatService.createEntity<IMessages>({
      binding: this.binding,
      entity: <IMessages>{
        text: "",
        model: this.chat.model,
        sender: Sender.AI,
        chat_ID: this.chat.ID,
      },
      atEnd: true,
      submitBatch: false,
    });

    await chatService.getCompletionAsStream(
      {
        chat: this.chat.ID,
        model: this.chat.model,
        personality: this.chat.personality_ID,
      },
      (chunk: string) => {
        this.streamingCallback?.(chunk, responseContext);
      }
    );

    // Finaly submit
    model.submitBatch(model.getUpdateGroupId());
  }
}
