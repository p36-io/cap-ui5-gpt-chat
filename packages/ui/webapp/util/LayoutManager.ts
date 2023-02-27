import { LayoutType } from "sap/f/library";
import JSONModel from "sap/ui/model/json/JSONModel";

export default class LayoutManager {
  private static instance: LayoutManager;
  public model: JSONModel;

  /**
   * Private constructor to prevent creating instances of this class.
   * Use the static getInstance() method instead.
   */
  private constructor() {}

  /**
   * Instantiates the LayoutManager if it doesn't exist yet and returns the singleton instance.
   *
   * @returns {LayoutManager} The singleton instance of the LayoutManager.
   */
  public static getInstance(): LayoutManager {
    this.instance ??= new LayoutManager();
    return this.instance;
  }

  public setModel(model: JSONModel): void {
    this.model = model;
  }

  public setLayout(layout: LayoutType): void {
    this.model.setData({
      currentLayout: layout,
      oldLayout: this.getLayout(),
      isFullScreen: layout === LayoutType.MidColumnFullScreen || layout === LayoutType.EndColumnFullScreen,
    });
  }

  public getLayout(): LayoutType {
    return this.model.getProperty("/currentLayout");
  }

  public setMidColumnFullScreen(): void {
    this.setLayout(LayoutType.MidColumnFullScreen);
  }

  public setEndColumnFullScreen(): void {
    this.setLayout(LayoutType.EndColumnFullScreen);
  }

  public exitFullScreen(): void {
    this.setLayout(this.model.getProperty("/oldLayout"));
  }
}
