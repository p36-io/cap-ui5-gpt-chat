import RenderManager from "sap/ui/core/RenderManager";
import Renderer from "sap/ui/core/Renderer";
import ListItemBaseRenderer from "sap/m/ListItemBase";
import MessageListItem from "./MessageListItem";
import Text from "sap/m/Text";
import Avatar from "sap/m/Avatar";

// @ts-ignore
import showdown from "showdown/dist/showdown";
// @ts-ignore
import showdownHighlight from "showdown-highlight/lib/index";

const markdownToHtml = (text: string): string => {
  const regex = /```([a-z]+)? ([\s\S]*?)*```/g;
  const matches = text.match(regex);
  if (matches) {
    text = text.replace(/```([a-z]+)?/g, "```\n");
  }

  const converter = new showdown.Converter({
    extensions: [
      showdownHighlight({
        pre: true,
        auto_detection: true,
      }),
    ],
  });
  converter.setFlavor("github");
  const html = converter.makeHtml(text);
  return html;
};

/**
 * @namespace com.p36.capui5gptchat
 */
const MessageListItemRenderer = <ListItemBaseRenderer>Renderer.extend(ListItemBaseRenderer);

// @ts-ignore
MessageListItemRenderer.renderLIContent = function (rm: RenderManager, control: MessageListItem) {
  rm.openStart("div").class("sapMMessageListItem").openEnd();
  rm.openStart("div").class("sapMMessageListItemText").openEnd();
  rm.unsafeHtml(markdownToHtml(control.getMessage()));
  rm.close("div");

  rm.openStart("div").class("sapMMessageListItemHeader").openEnd();
  rm.renderControl(<Avatar>control.getAggregation("avatar"));

  rm.openStart("div").class("sapMMessageListItemInfo").openEnd();
  rm.renderControl(<Text>new Text({ text: control.getSender() }));
  rm.renderControl(<Text>new Text({ text: "|" }));
  rm.renderControl(<Text>new Text({ text: control.getDate() }));
  rm.close("div");

  rm.close("div");
  rm.close("div");
};

export default MessageListItemRenderer;
