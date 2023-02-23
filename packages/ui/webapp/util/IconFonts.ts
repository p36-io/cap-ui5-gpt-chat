import IconPool from "sap/ui/core/IconPool";

/**
 * @namespace com.p36.capui5gptchat.util
 */
export default class IconFonts {
  public static register(): void {
    IconPool.registerFont({
      collectionName: "tnt",
      fontFamily: "SAP-icons-TNT",
      fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts"),
      lazy: true,
    });
    IconPool.registerFont({
      collectionName: "suite",
      fontFamily: "BusinessSuiteInAppSymbols",
      fontURI: sap.ui.require.toUrl("sap/ushell/themes/base/fonts/"),
      lazy: true,
    });
  }
}
