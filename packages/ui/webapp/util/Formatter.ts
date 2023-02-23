import { Sender } from "../types/ChatService";

/**
 * @namespace com.p36.capui5gptchat.util
 */
export default class Formatter {
  /**
   *
   * @param sender {string}
   * @returns {string}
   */
  public static senderIcon(sender: string): string {
    return sender === Sender.AI ? "sap-icon://tnt/robot" : "sap-icon://tnt/user";
  }
}
