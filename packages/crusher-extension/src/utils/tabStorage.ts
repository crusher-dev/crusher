import { isOfCrusherExtension } from "~/crusher-shared/utils/url";
import Tab = chrome.tabs.Tab;

export default {
  tabs: {},

  set(tabId: number, details: Tab, crusherAgent: string) {
    this.tabs[tabId] = {
      ...details,
      crusherAgent,
    };
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
