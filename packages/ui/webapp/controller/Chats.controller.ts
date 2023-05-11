import BaseController from "./BaseController";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import NewEntityDialog from "../service/NewEntityDialog";
import UI5Event from "sap/ui/base/Event";
import { IChats } from "../types/ChatService";
import ListItemBase from "sap/m/ListItemBase";

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

  public onRouteMatched(event: UI5Event): void {
    this.getView().byId("chatList").getBinding("items").refresh();
  }

  public onChatPress(event: UI5Event): void {
    const item = <ListItemBase>event.getParameter("listItem");
    this.getRouter().navTo("chat", {
      chat: item.getBindingContext().getProperty("ID"),
    });
  }

  public async onAddChat(event: UI5Event): Promise<void> {
    const binding = <ODataListBinding>this.getView().byId("chatList").getBinding("items");
    let context = binding.create(<IChats>{
      model: "gpt-3.5-turbo",
    });

    const dialog = new NewEntityDialog(context, "NewChatDialog", this.getView());
    await dialog
      .open()
      .then((context) => {
        this.getRouter().navTo("chat", {
          chat: <IChats>context.getObject().ID,
        });
      })
      .catch(() => {
        context.delete("$auto");
      });
  }
}
