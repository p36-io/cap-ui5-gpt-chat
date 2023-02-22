import Dialog from "sap/m/Dialog";
import Fragment from "sap/ui/core/Fragment";
import View from "sap/ui/core/mvc/View";
import Context from "sap/ui/model/odata/v4/Context";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";

export default class NewEntityDialog {
  private resolve: (args: any) => void;
  private reject: (error: any) => void;
  private dialog: Dialog;
  private model: ODataModel;

  constructor(private context: Context, private fragment: string, private view: View) {}

  public async open(): Promise<Context> {
    this.model = <ODataModel>this.context.getModel();

    return new Promise(async (resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      this.dialog = <Dialog>await Fragment.load({
        id: "newEntityDialog",
        name: `com.p36.capui5gptchat.fragment.${this.fragment}`,
        controller: this,
      });
      this.view.addDependent(this.dialog);
      this.dialog.setBindingContext(this.context);
      this.context.created().then(() => {
        this.dialog.close();
        this.resolve(this.context);
      }, reject);

      this.dialog.open();
    });
  }

  public async onCreate(): Promise<void> {
    await this.model.submitBatch(this.model.getUpdateGroupId());
  }

  public onCancel(): void {
    this.dialog.close();
    this.reject({ error: "User cancelled" });
  }
}
