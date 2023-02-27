import UIComponent from "sap/ui/core/UIComponent";
import models from "./model/models";
import ChatService from "./service/ChatService";
import IconFonts from "./util/IconFonts";
import LayoutManager from "./util/LayoutManager";

/**
 * @namespace com.p36.capui5gptchat
 */
export default class Component extends UIComponent {
  public static metadata = {
    manifest: "json",
  };

  public async init(): Promise<void> {
    super.init();

    this.setModel(models.createDeviceModel(), "device");
    this.setModel(models.createAppModel(), "app");
    this.setModel(await models.createUserModel(), "user");

    const layoutModel = models.createLayoutModel();
    this.setModel(layoutModel, "appLayout");
    LayoutManager.getInstance().setModel(layoutModel);

    ChatService.getInstance().setModel(this.getModel());

    IconFonts.register();

    this.getRouter().initialize();
  }
}
