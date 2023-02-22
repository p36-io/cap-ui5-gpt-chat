import Avatar from "sap/m/Avatar";
import { PropertyBindingInfo } from "sap/ui/base/ManagedObject";
import { $ListItemBaseSettings } from "sap/m/ListItemBase";

declare module "./MessageListItem" {

    /**
     * Interface defining the settings object used in constructor calls
     */
    interface $MessageListItemSettings extends $ListItemBaseSettings {
        message?: string | PropertyBindingInfo;
        sender?: string | PropertyBindingInfo;
        date?: string | PropertyBindingInfo;
        avatar?: Avatar;
    }

    export default interface MessageListItem {

        // property: message
        getMessage(): string;
        setMessage(message: string): this;

        // property: sender
        getSender(): string;
        setSender(sender: string): this;

        // property: date
        getDate(): string;
        setDate(date: string): this;

        // aggregation: avatar
        getAvatar(): Avatar;
        setAvatar(avatar: Avatar): this;
        destroyAvatar(): this;
    }
}
