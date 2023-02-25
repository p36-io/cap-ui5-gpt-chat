import JSONModel from "sap/ui/model/json/JSONModel";

export type IUser = {
  displayName: string;
  // extend with other parameters if needed
};

export default class UserModel extends JSONModel {
  /**
   * Initializes the user model by calling the user-api.
   * If the user-api is not available, the user is unknown.
   */
  public async initialize(): Promise<void> {
    const res = await fetch(sap.ui.require.toUrl("com/p36/capui5gptchat/user-api/currentUser"));
    if ((<Response>res)?.ok) {
      const data = (await (<Response>res).json()) as object;
      this.setData(data);
    } else {
      this.setProperty("/displayName", "unknown");
    }
  }

  getUser(): IUser {
    return this.getData();
  }
}
