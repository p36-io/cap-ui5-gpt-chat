import BaseController from "./BaseController";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import NewChatDialog from "../fragment/NewChatDialog";
import UI5Event from "sap/ui/base/Event";

/**
 * @namespace com.p36.capui5gptchat.controller
 */
export default class Chats extends BaseController {
  /**
   * Called when the controller is instantiated.
   */
  public onInit(): void {
    this.getRouter().getRoute("home").attachPatternMatched(this.onRouteMatched, this);
  }

  /**
   * Event handler for the route matched event.
   * Refreshes the chat list.
   *
   * @param event {sap.ui.base.Event}
   **/
  public onRouteMatched(event: UI5Event): void {
    this.getView().byId("chatList").getBinding("items").refresh();
  }

  /**
   * Event handler when the user presses a chat.
   *
   * @param event {sap.ui.base.Event}
   */
  public onChatPress(event: UI5Event): void {
    const item = event.getParameter("listItem");
    this.getRouter().navTo("chat", {
      chat: item.getBindingContext().getProperty("ID"),
    });
  }

  /**
   * Event handler for the add chat button.
   *
   * @param event {sap.ui.base.Event}
   */
  public async onAddChat(event: UI5Event): Promise<void> {
    let chat = await NewChatDialog.open(this.getView()).catch(() => {});
    if (chat) {
      const binding = <ODataListBinding>this.getView().byId("chatList").getBinding("items");
      chat = await this.getChatService().createEntity(chat, binding);
      this.getRouter().navTo("chat", {
        chat: chat.ID,
      });
    }
  }
}
