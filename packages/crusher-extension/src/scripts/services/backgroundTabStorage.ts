import { isOfCrusherExtension } from "../../utils/url";

export default {
  tabs: {},

  set(tabId: number, details: any) {
    this.tabs[tabId] = details;
  },

  all() {
    return this.tabs;
  },

  get(tabId: number) {
    return this.tabs[tabId];
  },

  has(tabId: number) {
    return this.tabs.hasOwnProperty(tabId) && this.tabs[tabId] !== null;
  },

  isExtension(tabId: number) {
    const tab = this.get(tabId);
    if (!tab) {
      return false;
    }
    return isOfCrusherExtension(this.get(tabId).url);
  },

  remove(tabId: number) {
    this.tabs[tabId] = null;
  },
};
