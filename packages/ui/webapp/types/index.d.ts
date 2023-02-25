import RenderManager from "sap/ui/core/RenderManager";
import ListItemBase from "sap/m/ListItemBase";

export declare module sap {
  namespace m {
    interface ListItemBaseRenderer {
      renderLIContent(rm: RenderManager, control: ListItemBase): void;
    }
  }
}
