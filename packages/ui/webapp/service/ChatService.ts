import BusyDialog from "sap/m/BusyDialog";
import MessageBox from "sap/m/MessageBox";
import Context from "sap/ui/model/odata/v4/Context";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { IChats, ICompletion, IMessages } from "../types/ChatService";

export default class ChatService {
  /**
   *
   * @param model {ODataModel}
   */
  public constructor(private model: ODataModel) {}

  /**
   * Get the completion for the given chat from the OData service by calling the getCompletion function.
   *
   * @param chat {IChat}
   * @returns {Promise<ICompletion>}
   */
  public async getCompletion(chat: IChats): Promise<ICompletion> {
    return new Promise((resolve, reject) => {
      const binding = <ODataContextBinding>this.model.bindContext("/getCompletion(...)");
      binding.setParameter("model", chat.model);
      binding.setParameter("chat", chat.ID);
      binding.setParameter("personality", chat.personality_ID);
      const dialog = new BusyDialog({ text: "Thinking..." });
      dialog.open();
      binding.execute().then(
        () => {
          dialog.close();
          resolve(<ICompletion>binding.getBoundContext().getObject());
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

  /**
   * Creates a single message in the OData service by using the ODataListBinding.
   *
   * @param message {IMessages}
   * @returns {Promise<void>}
   */
  public createMessage(message: IMessages, binding?: ODataListBinding): Promise<void> {
    return new Promise((resolve, reject) => {
      binding ||= this.model.bindList("/Messages");
      const context = binding.create(message, false, true);
      context.created().then(() => {
        resolve(context.getProperty("/"));
      }, reject);
      this.model.submitBatch(this.model.getUpdateGroupId());
    });
  }

  /**
   * Creates a single chat in the OData service by using the ODataListBinding.
   *
   * @param message {IChats}
   * @param binding {sap.ui.model.odata.v4.ODataListBinding}
   * @returns {Promise<IChats>}
   */
  public createChat(chat: IChats, binding?: ODataListBinding): Promise<IChats> {
    return new Promise((resolve, reject) => {
      binding ||= this.model.bindList("/Chats");
      const context = binding.create(chat);
      context.created().then(() => {
        resolve(context.getObject());
      }, reject);
      this.model.submitBatch(this.model.getUpdateGroupId());
    });
  }

  /**
   * Deletes a single chat in the OData service by using the ODataContextBinding.
   *
   * @param context {sap.ui.model.odata.v4.Context}
   * @returns {Promise<void>}
   */
  public deleteChat(context: Context): Promise<void> {
    return new Promise((resolve, reject) => {
      context.delete().then(resolve, reject);
      this.model.submitBatch(this.model.getUpdateGroupId());
    });
  }
}
