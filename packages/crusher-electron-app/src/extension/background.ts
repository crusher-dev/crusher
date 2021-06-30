import { iSavedTabInfo, TabStorage } from "./utils/tabStorage";
import { FrameStorage } from "./utils/frameStorage";
import UserAgents from "@shared/constants/userAgents";
import TabChangeInfo = chrome.tabs.TabChangeInfo;
import Tab = chrome.tabs.Tab;
import WebRequestDetails = chrome.webRequest.WebRequestDetails;
import WebRequestFullDetails = chrome.webRequest.WebRequestFullDetails;
import WebResponseHeadersDetails = chrome.webRequest.WebResponseHeadersDetails;
import WebNavigationParentedCallbackDetails = chrome.webNavigation.WebNavigationParentedCallbackDetails;
import HttpHeader = chrome.webRequest.HttpHeader;
import MessageSender = chrome.runtime.MessageSender;

import { AdvancedURL } from "./utils/url";
import { generateCrusherExtensionUrl, getDefaultDeviceFromDeviceType } from "@shared/utils/extension";
import { DEVICE_TYPES } from "@shared/types/deviceTypes";
import { setupBackgroundScriptForExtensionReload } from "./utils/electronReload";

class BackgroundEventsListener {
	constructor() {
		this.handleBrowserIconClick = this.handleBrowserIconClick.bind(this);
		this.onTabUpdated = this.onTabUpdated.bind(this);
		this.onTabRemoved = this.onTabRemoved.bind(this);
		this.onBeforeRequest = this.onBeforeRequest.bind(this);
		this.onHeadersReceived = this.onHeadersReceived.bind(this);
		this.onBeforeSendHeaders = this.onBeforeSendHeaders.bind(this);
		this.onBeforeNavigation = this.onBeforeNavigation.bind(this);
		this.onExternalMessage = this.onExternalMessage.bind(this);

		setupBackgroundScriptForExtensionReload();
	}

	isRegisteredAsCrusherWindow(tabId: number): boolean {
		const tab: iSavedTabInfo = TabStorage.get(tabId);

		if (!tab || !tab.details.id) {
			return false;
		}

		return TabStorage.isExtension(tab.details.id);
	}

	onTabRemoved(tabId: number) {
		if (TabStorage.get(tabId)) {
			TabStorage.remove(tabId);
		}
	}

	onTabUpdated(tabId: number, changeInfo: TabChangeInfo, tab: Tab) {
		if (tab.url && AdvancedURL.checkIfCrusherExtension(tab.url)) {
			// @TODO: In case `iframeURL` is empty, show a modal asking for target website url.
			const iframeURL: string = AdvancedURL.getParameterByName("url", tab.url) as string;

			const selectedUserAgent = AdvancedURL.getUserAgentFromUrl(iframeURL);

			TabStorage.set(tabId, tab, selectedUserAgent ? selectedUserAgent.value : UserAgents[0].value);
		}
	}

	onBeforeRequest(details: WebRequestDetails) {
		const areActionsAllowed = this.isRegisteredAsCrusherWindow(details.tabId);

		if (!areActionsAllowed || details.parentFrameId !== 0) {
			return { cancel: false };
		}

		chrome.browsingData.remove(
			{},
			{
				serviceWorkers: true,
			},
		);

		return { cancel: false };
	}

	onHeadersReceived(details: WebResponseHeadersDetails) {
		const isRegisteredAsCrusherWindow = this.isRegisteredAsCrusherWindow(details.tabId);
		const headers: Array<HttpHeader> | undefined = details.responseHeaders;

		if (!headers || !isRegisteredAsCrusherWindow || details.parentFrameId !== 0) {
			return { responseHeaders: headers };
		}

		const responseHeaders = headers.filter((header) => {
			const name = header.name.toLowerCase();
			return ["x-frame-options", "content-security-policy", "frame-options"].indexOf(name) === -1;
		});

		const redirectUrl = headers.find((header) => header.name.toLowerCase() === "location");

		if (redirectUrl) {
			chrome.browsingData.remove(
				{},
				{
					serviceWorkers: true,
				},
			);
		}

		return {
			responseHeaders,
		};
	}

	onBeforeSendHeaders(details: WebRequestFullDetails) {
		const isRegisteredAsCrusherWindow = this.isRegisteredAsCrusherWindow(details.tabId);
		const headers: Array<HttpHeader> | undefined = details.requestHeaders;

		if (!isRegisteredAsCrusherWindow || details.parentFrameId !== 0) {
			return { requestHeaders: headers };
		}

		const frame = FrameStorage.get(details.tabId, details.frameId);
		if (!frame) {
			return {
				requestHeaders: details.requestHeaders,
			};
		}

		const userAgent = TabStorage.get(details.tabId).crusherAgent;

		details.requestHeaders?.push({
			name: "User-Agent",
			value: userAgent,
		});

		return { requestHeaders: details.requestHeaders };
	}

	onBeforeNavigation(details: WebNavigationParentedCallbackDetails) {
		const isAllowed = this.isRegisteredAsCrusherWindow(details.tabId);

		if (!isAllowed || details.frameId === 0) {
			return;
		}

		if (details.parentFrameId === 0 && details.url) {
			FrameStorage.set(details);
		}
	}

	onExternalMessage(request: { message: string }, sender: MessageSender, sendResponse: any) {
		console.log("Got this message", request);
		if (request) {
			if (request.message) {
				if (request.message == "version") {
					// @TODO: Replace this with the real extension version
					sendResponse({ version: 1.0 });
				}
			}
		}
		return true;
	}

	handleBrowserIconClick(activeTab: Tab) {
		const defaultDevice = getDefaultDeviceFromDeviceType(DEVICE_TYPES.DESKTOP);
		const newURL = generateCrusherExtensionUrl(chrome.extension.getURL("/"), activeTab.url as string, defaultDevice!.id);
		chrome.tabs.create({ url: newURL });
	}

	registerEventListeners() {
		chrome.browserAction.onClicked.addListener(this.handleBrowserIconClick);

		chrome.tabs.onUpdated.addListener(this.onTabUpdated);
		chrome.tabs.onRemoved.addListener(this.onTabRemoved);

		chrome.webRequest.onBeforeRequest.addListener(this.onBeforeRequest, { urls: ["<all_urls>"] }, ["blocking"]);

		chrome.webRequest.onBeforeSendHeaders.addListener(this.onBeforeSendHeaders, { urls: ["<all_urls>"], types: ["sub_frame"] }, [
			"blocking",
			"requestHeaders",
		]);

		chrome.webRequest.onHeadersReceived.addListener(this.onHeadersReceived, { urls: ["<all_urls>"], types: ["sub_frame", "main_frame"] }, [
			"blocking",
			"responseHeaders",
		]);

		chrome.webNavigation.onBeforeNavigate.addListener(this.onBeforeNavigation);

		// This listener is to send information to website asking information about crusher extension
		chrome.runtime.onMessageExternal.addListener(this.onExternalMessage);
	}

	boot() {
		this.registerEventListeners();
	}
}

const backgroundEventsListener = new BackgroundEventsListener();
backgroundEventsListener.boot();
