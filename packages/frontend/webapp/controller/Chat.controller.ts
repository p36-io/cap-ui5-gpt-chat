import BaseController from "./BaseController";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import UI5Event from "sap/ui/base/Event";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import MessageBox from "sap/m/MessageBox";
import BusyDialog from "sap/m/BusyDialog";
import Helper from "../util/Helper";
import Context from "sap/ui/model/odata/v4/Context";

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

  /**
   *
   *
   * @param event {sao.ui.base.Event}
   */
  public onRouteMatched(event: UI5Event): void {
    const chat = event.getParameter("arguments").chat;
    this.getView().bindElement({
      path: `/Chats(${chat})`,
    });
  }

  /**
   * Called when the user presses the delete button.
   */
  public onDeleteChat(): void {
    Helper.withConfirmation("Delete Chat", "Are you sure you want to delete this chat?", () => {
      const bindingContext = <Context>this.getView().getBindingContext();
      bindingContext.delete();
      const model = <ODataModel>this.getView().getModel();
      model.submitBatch(model.getUpdateGroupId()).then(() => {
        this.getRouter().navTo("home");
      });
    });
  }

  public async onPostMessage(event: UI5Event): Promise<void> {
    const message = event.getParameter("value");
    const chat = <any>this.getView().getBindingContext().getObject();
    const context = (<ODataListBinding>this.getView().byId("messageList").getBinding("items")).create(
      {
        text: message.trim(),
        engine: chat.engine,
        chat_ID: chat.ID,
      },
      false,
      true
    );

    // Note: This promise fails only if the transient entity is deleted
    context.created().then(
      async () => {
        const dialog = new BusyDialog({
          text: "Thinking...",
        });
        dialog.open();

        const response = await this.askChatGPT(chat.model, chat.personality_ID);
        dialog.close();
        const responseContext = (<ODataListBinding>this.getView().byId("messageList").getBinding("items")).create(
          {
            text: response,
            model: chat.model,
            sender: "AI",
            chat_ID: chat.ID,
          },
          false,
          true
        );
        model.submitBatch(model.getUpdateGroupId()); //.then(resetBusy, resetBusy);
      },
      function (oError) {
        // handle rejection of entity creation; if oError.canceled === true then the transient entity has been deleted
      }
    );
    const model = <ODataModel>this.getView().getModel();
    model.submitBatch(model.getUpdateGroupId()); //.then(resetBusy, resetBusy);
  }

  private async askChatGPT(model: string, personality: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const bindingContext = this.getView().getBindingContext();
      const binding = <ODataContextBinding>(
        this.getModel().bindContext("ChatService.getCompletion(...)", bindingContext)
      );
      binding.setParameter("model", model);
      binding.setParameter("personality", personality);
      binding.execute().then(
        () => {
          resolve(binding.getBoundContext().getObject().message);
        },
        (error) => {
          MessageBox.alert(error.message, {
            title: "Error",
          });
          reject(error);
        }
      );
    });
  }
}
