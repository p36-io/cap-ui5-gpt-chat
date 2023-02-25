import { LayoutType } from "sap/f/library";
import JSONModel from "sap/ui/model/json/JSONModel";

interface LayoutData {
  currentLayout: LayoutType;
  isFullScreen: boolean;
  oldLayout?: LayoutType;
}

export class LayoutModel extends JSONModel {
  public setData(data: LayoutData, merge?: boolean): void {
    super.setData(data, merge);
  }

  public getData(): LayoutData {
    return super.getData();
  }

  public setLayout(layout: LayoutType): void {
    this.setData({
      currentLayout: layout,
      oldLayout: this.getLayout(),
      isFullScreen: layout === LayoutType.MidColumnFullScreen || layout === LayoutType.EndColumnFullScreen,
    });
  }

  public getLayout(): LayoutType {
    return this.getProperty("/currentLayout");
  }

  public setMidColumnFullScreen(): void {
    this.setLayout(LayoutType.MidColumnFullScreen);
  }

  public setEndColumnFullScreen(): void {
    this.setLayout(LayoutType.EndColumnFullScreen);
  }

  public exitFullScreen(): void {
    this.setLayout(this.getProperty("/oldLayout"));
  }
}
