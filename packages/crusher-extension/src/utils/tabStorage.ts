import { isOfCrusherExtension } from "../../../crusher-shared/utils/url";
import Tab = chrome.tabs.Tab;

export interface iSavedTabInfo {
	details: Tab;
	crusherAgent: string;
}

interface iTabs {
	[tabId: number]: iSavedTabInfo;
}

const tabs: iTabs = {};

export class TabStorage {
	static set(tabId: number, details: Tab, crusherAgent: string) {
		tabs[tabId] = {
			details,
			crusherAgent,
		};
	}

	static get(tabId: number): iSavedTabInfo {
		return tabs[tabId];
	}

	static isExtension(tabId: number): boolean {
		const tab = this.get(tabId);
		if (!tab) {
			return false;
		}
		return isOfCrusherExtension(this.get(tabId).details.url as string);
	}

	static remove(tabId: number) {
		delete tabs[tabId];
	}
}
