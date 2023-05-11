import Control from "sap/ui/core/Control";

export default class UIHelper {

    public static scrollToElement(element: Element, timeout: number = 0, behavior: ScrollBehavior = "smooth"): void {
        setTimeout(() => {
            element.scrollIntoView({ behavior: behavior });
        }, timeout);
    }
}