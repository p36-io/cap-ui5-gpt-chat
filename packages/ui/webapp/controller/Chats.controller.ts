import BaseController from "./BaseController";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import NewChatDialog from "../fragment/NewChatDialog";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import UI5Event from "sap/ui/base/Event";

/**
 * @namespace com.p36.capui5gptchat.controller
 */
export default class Chats extends BaseController {
  public onInit(): void {
    this.getRouter().getRoute("home").attachPatternMatched(this.onRouteMatched, this);
  }

  public onRouteMatched(): void {
    this.getView().byId("chatList").getBinding("items").refresh();
  }

  public onChatPress(event: UI5Event): void {
    const item = event.getParameter("listItem");
    this.getRouter().navTo("chat", {
      chat: item.getBindingContext().getProperty("ID"),
    });
  }

  public async onAddChat(): Promise<void> {
    const chat = await NewChatDialog.open(this.getView()).catch(() => {});
    if (chat) {
      const context = (<ODataListBinding>this.getView().byId("chatList").getBinding("items")).create(chat);
      context.created().then(
        () => {
          this.getRouter().navTo("chat", {
            chat: context.getProperty("ID"),
          });
        },
        () => (error: any) => {}
      );
      const model = <ODataModel>this.getView().getModel();
      model.submitBatch(model.getUpdateGroupId());
    }
  }
}
