import Dialog from "sap/m/Dialog";
import Fragment from "sap/ui/core/Fragment";
import View from "sap/ui/core/mvc/View";
import JSONModel from "sap/ui/model/json/JSONModel";
import { IChats } from "../types/ChatService";

export default class NewChatDialog {
  private static resolve: (args: any) => void;
  private static reject: (error: any) => void;
  private static newChatModel: JSONModel;
  private static dialog: Dialog;

  public static async open(view: View): Promise<IChats> {
    return new Promise(async (resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      this.dialog = <Dialog>await Fragment.load({
        id: "newChatDialog",
        name: "com.p36.capui5gptchat.fragment.NewChatDialog",
        controller: this,
      });
      view.addDependent(this.dialog);

      this.newChatModel = new JSONModel(<IChats>{
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
    this.resolve(this.newChatModel.getData());
  }

  public static onCancel(): void {
    this.dialog.close();
    this.reject({ error: "User cancelled" });
  }
}
