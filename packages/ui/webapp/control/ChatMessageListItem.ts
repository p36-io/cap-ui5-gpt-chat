import ListItemBase from "sap/m/ListItemBase";
import ChatMessageListItemRenderer from "./ChatMessageListItemRenderer";

/**
 * @namespace com.p36.capui5gptchat
 */
export default class ChatMessageListItem extends ListItemBase {
  static readonly metadata = {
    properties: {
      message: { type: "string", group: "Misc", defaultValue: "" },
      sender: { type: "string", group: "Misc", defaultValue: "" },
      date: { type: "string", group: "Misc", defaultValue: "" },
    },
    aggregations: {
      avatar: { type: "sap.m.Avatar", multiple: false },
    },
  };

  renderer = ChatMessageListItemRenderer;
}
