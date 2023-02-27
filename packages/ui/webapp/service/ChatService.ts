import BusyDialog from "sap/m/BusyDialog";
import MessageBox from "sap/m/MessageBox";
import Context from "sap/ui/model/odata/v4/Context";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { IFuncGetCompletionParams, FuncGetCompletionReturn } from "../types/ChatService";

export default class ChatService {
  private static instance: ChatService;
  private model: ODataModel;

  public static getInstance(): ChatService {
    this.instance ??= new ChatService();
    return this.instance;
  }
  private constructor() {}

  public setModel(model: ODataModel): void {
    this.model = model;
  }

  /**
   * Creates a single entity in the OData service by using the ODataListBinding.
   *
   * @param entity {T}
   * @param binding {sap.ui.model.odata.v4.ODataListBinding}
   * @param skipRefresh {boolean}
   * @param atEnd {boolean}
   * @returns {Promise<T>}
   */
  public createEntity<T extends Object>(
    entity: T,
    binding: ODataListBinding,
    skipRefresh = false,
    atEnd = false
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const context = binding.create(entity, skipRefresh, atEnd);
      context.created().then(() => {
        resolve(context.getObject());
      }, reject);
      this.model.submitBatch(this.model.getUpdateGroupId());
    });
  }

  /**
   * Deletes a single entity in the OData service by using the ODataContextBinding.
   *
   * @param context {sap.ui.model.odata.v4.Context}
   * @returns {Promise<void>}
   */
  public deleteEntity(context: Context): Promise<void> {
    return new Promise((resolve, reject) => {
      context.delete().then(resolve, reject);
      this.model.submitBatch(this.model.getUpdateGroupId());
    });
  }

  /**
   * Retrieve the completion from the OData service by calling the getCompletion function.
   *
   * @param params {IFuncGetCompletionParams}
   * @returns {Promise<ICompletion>}
   */
  public async getCompletion(params: IFuncGetCompletionParams): Promise<FuncGetCompletionReturn> {
    return new Promise((resolve, reject) => {
      const binding = <ODataContextBinding>this.model.bindContext("/getCompletion(...)");
      binding.setParameter("model", params.model);
      binding.setParameter("chat", params.chat);
      binding.setParameter("personality", params.personality);
      const dialog = new BusyDialog({ text: "Thinking..." });
      dialog.open();
      binding.execute().then(
        () => {
          dialog.close();
          resolve(<FuncGetCompletionReturn>binding.getBoundContext().getObject());
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
}
