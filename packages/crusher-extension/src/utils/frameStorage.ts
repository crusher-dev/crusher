import WebNavigationParentedCallbackDetails = chrome.webNavigation.WebNavigationParentedCallbackDetails;

interface iFrames {
	[frameId: string]: WebNavigationParentedCallbackDetails;
}

const frames: iFrames = {};

export class FrameStorage {
	static makeFrameId(tabId: number, frameId: any): string {
		return `${tabId}-${frameId}`;
	}

	static set(details: WebNavigationParentedCallbackDetails) {
		frames[this.makeFrameId(details.tabId, details.frameId)] = details;
	}

	static get(
		tabId: number,
		frameId: any,
	): WebNavigationParentedCallbackDetails | null {
		return frames[this.makeFrameId(tabId, frameId)];
	}

	static has(tabId: number, frameId: any): boolean {
		const id = this.makeFrameId(tabId, frameId);
		return frames[id] && frames[id] !== null;
	}
}
