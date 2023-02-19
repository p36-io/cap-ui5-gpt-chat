import BaseController from "./BaseController";
import UI5Event from "sap/ui/base/Event";

/**
 * @namespace com.p36.capui5gptchat.controller
 */
export default class NoChat extends BaseController {
  public onInit(): void {
    this.getRouter().getRoute("home").attachPatternMatched(this.onRouteMatched, this);
  }

  public onRouteMatched(event: UI5Event): void {}
}
