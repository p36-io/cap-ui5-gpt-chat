import MessageBox, { Action } from "sap/m/MessageBox";
import { LayoutType } from "sap/f/library";
import UI5Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import JSONModel from "sap/ui/model/json/JSONModel";

export default class Helper {
  public static setLayout(layout: LayoutType, event: UI5Event): void {
    (<JSONModel>(<Control>event.getSource()).getModel("app")).setProperty("/layout", layout);
  }

  public static withConfirmation(title: string, text: string, callback: () => void): void {
    MessageBox.confirm(text, {
      title,
      onClose: (action: Action) => {
        if (action === Action.OK) {
          callback();
        }
      },
    });
  }
}
