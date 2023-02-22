import BaseController from "./BaseController";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import UI5Event from "sap/ui/base/Event";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import MessageBox from "sap/m/MessageBox";
import BusyDialog from "sap/m/BusyDialog";
import Helper from "../util/Helper";
import Context from "sap/ui/model/odata/v4/Context";
import { IChat, IChatMessage } from "../types/types";
import FeedInput from "sap/m/FeedInput";

/**
 * @namespace com.p36.capui5gptchat.controller
 */
export default class Chat extends BaseController {
  /**
   * Called when the chat controller is instantiated.
   */
  public onInit(): void {
    this.getRouter().getRoute("chat").attachPatternMatched(this.onRouteMatched, this);
  }

  public onAfterRendering(): void {
    this.addKeyboardEvents();
  }

  /**
   *
   *
   * @param event {sao.ui.base.Event}
   */
  public onRouteMatched(event: UI5Event): void {
    const { chat } = event.getParameter("arguments");
    this.getView().bindElement({
      path: `/Chats(${chat})`,
    });
  }

  /**
   * Called when the user presses the delete button.
   *
   * @param event {sap.ui.base.Event}
   */
  public onDeleteChat(event: UI5Event): void {
    Helper.withConfirmation("Delete Chat", "Are you sure you want to delete this chat?", () => {
      (<Context>this.getView().getBindingContext()).delete();
      const model = <ODataModel>this.getModel();
      model.submitBatch(model.getUpdateGroupId()).then(() => {
        this.getRouter().navTo("home");
      });
    });
  }

  public async onPostMessage(event: UI5Event): Promise<void> {
    const message = event.getParameter("value");
    const chat = <any>this.getView().getBindingContext().getObject();

    await this.createMessage(<IChatMessage>{
      text: message.trim(),
      model: chat.model,
      sender: this.getModel("user").getProperty("/displayName"),
      chat_ID: chat.ID,
    });

    const response = await this.getCompletion(chat);

    await this.createMessage(<IChatMessage>{
      text: response,
      model: chat.model,
      sender: "AI",
      chat_ID: chat.ID,
    });
  }

  private createMessage(message: IChatMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      const context = (<ODataListBinding>this.getView().byId("messageList").getBinding("items")).create(
        message,
        false,
        true
      );
      context.created().then(() => {
        resolve();
      }, reject);
      const model = <ODataModel>this.getModel();
      model.submitBatch(model.getUpdateGroupId());
    });
  }

  /**
   *
   * @param chat {IChat}
   * @returns {Promise<string>}
   */
  private async getCompletion(chat: IChat): Promise<string> {
    return new Promise((resolve, reject) => {
      // REVISIT: Relative binding does not work since CAP seems to have issues with authorizations and nested functions.
      // const bindingContext = this.getView().getBindingContext();
      // const binding = <ODataContextBinding>(
      //   this.getModel().bindContext("ChatService.getCompletion(...)", bindingContext)
      // );

      const binding = <ODataContextBinding>this.getModel().bindContext("/getCompletion(...)");
      binding.setParameter("model", chat.model);
      binding.setParameter("chat", chat.ID);
      binding.setParameter("personality", chat.personality_ID);
      const dialog = new BusyDialog({ text: "Thinking..." });
      dialog.open();
      binding.execute().then(
        () => {
          resolve(binding.getBoundContext().getObject().message);
          dialog.close();
        },
        (error) => {
          dialog.close();
          MessageBox.alert(error.message, {
            title: "Error",
          });
          reject(error);
        }
      );
    });
  }

  private addKeyboardEvents() {
    console.log("addKeyboardEvents");

    const input = <FeedInput>this.getView().byId("newMessageInput");
    // @ts-ignore
    input.onkeydown = (event: any) => {
      if (event.keyCode == 13 && event.metaKey) {
        input.fireEvent("post", { value: input.getValue() });
        input.setValue("");
        event.preventDefault();
      }
    };
  }
}
