import UIComponent from "sap/ui/core/UIComponent";
import models from "./model/models";
import IconFonts from "./util/IconFonts";

// @ts-ignore
import showdown from "showdown/dist/showdown";
// @ts-ignore
import showdownHighlight from "showdown-highlight/lib/index";

/**
 * @namespace com.p36.capui5gptchat
 */
export default class Component extends UIComponent {
  public static metadata = {
    manifest: "json",
  };

  public async init(): Promise<void> {
    // call the base component's init function
    super.init();

    this.setModel(models.createDeviceModel(), "device");
    this.setModel(models.createAppModel(), "app");
    this.setModel(await models.createUserModel(), "user");

    IconFonts.register();

    // create the views based on the url/hash
    this.getRouter().initialize();
  }
}
