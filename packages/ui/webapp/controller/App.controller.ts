import Helper from "../util/Helper";
import BaseController from "./BaseController";

/**
 * @namespace com.p36.capui5gptchat.controller
 */
export default class App extends BaseController {
  public onInit(): void {
    // apply content density mode to root view
    this.getView().addStyleClass(Helper.getContentDensityClass());
  }
}
