import Dialog from "sap/m/Dialog";
import Fragment from "sap/ui/core/Fragment";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";
import { IChat } from "../types/types";

export default class NewChatDialog {
  private static promiseResolver: any;
  private static rejectResolver: any;
  private static newChatModel: JSONModel;
  private static dialog: Dialog;

  public static async open(view: View): Promise<IChat> {
    return new Promise(async (resolve, reject) => {
      this.promiseResolver = resolve;
      this.rejectResolver = reject;
      this.dialog = <Dialog>await Fragment.load({
        id: "newChatDialog",
        name: "com.p36.capui5gptchat.fragment.NewChatDialog",
        controller: this,
      });
      view.addDependent(this.dialog);

      this.newChatModel = new JSONModel(<IChat>{
        topic: "",
        model: "text-davinci-003",
        personality_ID: null,
      });
      this.dialog.setModel(this.newChatModel, "newChat");

      this.dialog.open();
    });
  }

  public static onCreateChat(): void {
    this.dialog.close();
    this.promiseResolver(this.newChatModel.getData());
  }

  public static onCancel(): void {
    this.dialog.close();
    this.rejectResolver();
  }
}
