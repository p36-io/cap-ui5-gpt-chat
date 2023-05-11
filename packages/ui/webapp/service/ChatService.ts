import BusyDialog from "sap/m/BusyDialog";
import MessageBox from "sap/m/MessageBox";
import Context from "sap/ui/model/odata/v4/Context";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import { IFuncGetCompletionParams, FuncGetCompletionReturn } from "../types/ChatService";

interface ICreateEntityParams<T> {
  entity: T;
  binding: ODataListBinding;
  skipRefresh?: boolean;
  atEnd?: boolean;
  submitBatch?: boolean;
}

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

  public async submitChanges(): Promise<void> {
    this.model.submitBatch(this.model.getUpdateGroupId());
  }

  public async createEntity<T extends Object>(params: ICreateEntityParams<T>): Promise<Context> {
    const { entity, binding, skipRefresh = false, atEnd = true, submitBatch = true } = params;
    return new Promise(async (resolve, reject) => {
      const context = binding.create(entity, skipRefresh, atEnd);
      if (submitBatch) {
        context.created().then(() => {
          resolve(context);
        });
        this.model.submitBatch(this.model.getUpdateGroupId());
      } else {
        resolve(context);
      }
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

  public async getCompletionAsStream(
    params: IFuncGetCompletionParams,
    callback?: (chuck: string) => void
  ): Promise<FuncGetCompletionReturn> {
    return new Promise(async (resolve, reject) => {
      const res = await fetch(
        `${this.model.getServiceUrl()}getCompletionAsStream(model='${params.model}',chat='${
          params.chat
        }',personality='${params.personality}')`
      );

      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          resolve(null);
          break;
        }
        const regex = /{"message":"[^{}]+?"}/g;
        const objects = value.match(regex);
        objects?.forEach((object) => {
          try {
            const data = JSON.parse(object);
            data.message && callback?.call(this, data.message);
          } catch (error) {
            console.error(error);
          }
        });
      }
    });
  }
}
