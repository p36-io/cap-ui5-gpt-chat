import JSONModel from "sap/ui/model/json/JSONModel";
import BindingMode from "sap/ui/model/BindingMode";
import * as Device from "sap/ui/Device";
import { LayoutType } from "sap/f/library";
import UserModel from "./UserModel";
import { LayoutModel } from "./LayoutModel";

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
    const userModel = new UserModel();
    await userModel.initialize();
    return userModel;
  },

  createLayoutModel: () => {
    const layoutModel = new LayoutModel();
    layoutModel.setData({
      currentLayout: LayoutType.TwoColumnsMidExpanded,
      isFullScreen: false,
    });
    return layoutModel;
  },
};
