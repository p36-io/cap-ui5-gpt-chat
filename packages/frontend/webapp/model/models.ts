import JSONModel from "sap/ui/model/json/JSONModel";
import BindingMode from "sap/ui/model/BindingMode";
import * as Device from "sap/ui/Device";
import { LayoutType } from "sap/f/library";

export default {
  createDeviceModel: () => {
    const model = new JSONModel(Device);
    model.setDefaultBindingMode(BindingMode.OneWay);
    return model;
  },

  createAppModel: () => {
    const model = new JSONModel({
      layout: LayoutType.TwoColumnsMidExpanded,
    });
    model.setDefaultBindingMode(BindingMode.OneWay);
    return model;
  },

  createUserModel: async () => {
    const userModel = new JSONModel();
    const res = await fetch(sap.ui.require.toUrl("com/p36/capui5gptchat/user-api/currentUser")).catch(
      (error: Error) => {
        userModel.setProperty("/displayName", "unknown");
      }
    );
    if ((<Response>res).ok) {
      const data = (await (<Response>res).json()) as object;
      userModel.setData(data);
    }
    return userModel;
  },
};
