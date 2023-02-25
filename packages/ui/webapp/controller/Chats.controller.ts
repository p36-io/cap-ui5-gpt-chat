import BaseController from "./BaseController";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import NewEntityDialog from "../service/NewEntityDialog";
import UI5Event from "sap/ui/base/Event";
import { IChats } from "../types/ChatService";

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
    const binding = <ODataListBinding>this.getView().byId("chatList").getBinding("items");
    let context = binding.create(<IChats>{
      model: "text-davinci-003",
    });

    const dialog = new NewEntityDialog(context, "NewChatDialog", this.getView());
    await dialog.open().catch(() => {
      context.delete("$auto");
    });
    this.getRouter().navTo("chat", {
      chat: <IChats>context.getObject().ID,
    });
  }
}
