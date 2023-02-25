import RenderManager from "sap/ui/core/RenderManager";
import ListItemBase from "sap/m/ListItemBase";
import Renderer from "sap/ui/core/Renderer";
import MessageListItem from "./ChatMessageListItem";
import Text from "sap/m/Text";
import Avatar from "sap/m/Avatar";
import showdown from "showdown";
import showdownHighlight from "showdown-highlight/lib/index";

// Workaround for missing type definitions
interface ListItemBaseRenderer {
  renderLIContent(rm: RenderManager, control: ListItemBase): void;
  markdownToHtml(text: string): string;
}

const ChatMessageListItemRenderer = <ListItemBaseRenderer>Renderer.extend("sap.m.ListItemBaseRenderer");
ChatMessageListItemRenderer.renderLIContent = (rm: RenderManager, control: MessageListItem) => {
  rm.openStart("div").class("sapMMessageListItem").openEnd();
  rm.openStart("div").class("sapMMessageListItemText").openEnd();
  rm.unsafeHtml(ChatMessageListItemRenderer.markdownToHtml(control.getMessage()));
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

ChatMessageListItemRenderer.markdownToHtml = (text: string): string => {
  const converter = new showdown.Converter({
    extensions: [
      showdownHighlight({
        pre: true,
        auto_detection: true,
      }),
    ],
  });
  converter.setFlavor("github");
  return converter.makeHtml(text);
};

export default ChatMessageListItemRenderer;
