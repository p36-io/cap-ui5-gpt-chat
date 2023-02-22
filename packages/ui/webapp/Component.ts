import UIComponent from "sap/ui/core/UIComponent";
import models from "./model/models";
import IconFonts from "./util/IconFonts";

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

    IconFonts.register();

    this.getRouter().initialize();
  }
}
