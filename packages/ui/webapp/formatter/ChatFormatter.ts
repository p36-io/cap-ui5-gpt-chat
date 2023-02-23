import { Sender } from "../types/ChatService";

/**
 * @namespace com.p36.capui5gptchat.formatter
 */
export default class ChatFormatter {
  /**
   *
   * @param sender {string}
   * @returns {string}
   */
  public static senderIcon(sender: string): string {
    return sender === Sender.AI ? "sap-icon://tnt/robot" : "sap-icon://tnt/user";
  }

  /**
   *
   * @param id {string}
   * @returns {boolean}
   */
  public static itemIsVisibleInList(id: string): boolean {
    return !!id;
  }
}
