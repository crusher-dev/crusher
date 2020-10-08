import * as url from "./utils/url";
import tabStorage from "./utils/tabStorage";
import FrameStorage from "./utils/frameStorage";
import { getQueryStringParams } from "./utils/url";

import userAgents from "~/crusher-shared/constants/userAgents";
import TabChangeInfo = chrome.tabs.TabChangeInfo;
import Tab = chrome.tabs.Tab;
import WebRequestDetails = chrome.webRequest.WebRequestDetails;
import WebRequestFullDetails = chrome.webRequest.WebRequestFullDetails;
import WebResponseHeadersDetails = chrome.webRequest.WebResponseHeadersDetails;
import HttpHeader = chrome.webRequest.HttpHeader;
import {UserAgent} from "~/crusher-shared/types/userAgent";

class ChromeEventsListener {
  state: any;

  constructor() {
    this.onTabUpdated = this.onTabUpdated.bind(this);
    this.onTabRemoved = this.onTabRemoved.bind(this);
    this.onBeforeRequest = this.onBeforeRequest.bind(this);
    this.onHeadersReceived = this.onHeadersReceived.bind(this);
    this.onBeforeSendHeaders = this.onBeforeSendHeaders.bind(this);
    this.onRuntimeMessage = this.onRuntimeMessage.bind(this);
    this.onBeforeNavigation = this.onBeforeNavigation.bind(this);
  }

  isAllowedToPerformAction(tab: Tab) {
    if (!tab || !tab.id) {
      return false;
    }

    return tabStorage.isExtension(tab.id);
  }

  onTabUpdated(tabId: number, changeInfo: TabChangeInfo, tab: Tab) {
    if (tab.url && url.isOfCrusherExtension(tab.url)) {
      const iframeURL = getQueryStringParams("url", tab.url) as string;
      const crusherAgent = getQueryStringParams("__crusherAgent__", iframeURL);
      const userAgent : UserAgent | undefined = userAgents.find(
        (agent) => agent.name === (crusherAgent || userAgents[6].value)
      );

      tabStorage.set(tabId, tab, userAgent ? userAgent.value : userAgents[0].value);
    } else {
      tabStorage.remove(tabId);
    }
  }

  onTabRemoved(tabId: number) {
    if (!tabStorage.has(tabId)) {
    }
  }

  onBeforeRequest(details: WebRequestDetails) {
    const areActionsAllowed = this.isAllowedToPerformAction(
      tabStorage.get(details.tabId)
    );

    if (!areActionsAllowed || details.parentFrameId !== 0) {
      return { cancel: false };
    }

    chrome.browsingData.remove(
      {},
      {
        serviceWorkers: true,
      }
    );

    return { cancel: false };
  }

  onHeadersReceived(details: WebResponseHeadersDetails) {
    const areActionsAllowed = this.isAllowedToPerformAction(
      tabStorage.get(details.tabId)
    );
    const headers : Array<HttpHeader> | undefined = details.responseHeaders;

    if (!headers || !areActionsAllowed || details.parentFrameId !== 0) {
      return { responseHeaders: headers };
    }

    const responseHeaders = headers.filter((header) => {
      const name = header.name.toLowerCase();
      return (
        ["x-frame-options", "content-security-policy", "frame-options"].indexOf(
          name
        ) === -1
      );
    });

    const redirectUrl = headers.find(
      (header) => header.name.toLowerCase() === "location"
    );

    if (redirectUrl) {
      chrome.browsingData.remove(
        {},
        {
          serviceWorkers: true,
        }
      );
    }

    return {
      responseHeaders,
    };
  }

  onBeforeSendHeaders(details: WebRequestFullDetails) {
    const areActionsAllowed = this.isAllowedToPerformAction(
      tabStorage.get(details.tabId)
    );
    const headers = details.requestHeaders;

    if (!areActionsAllowed || details.parentFrameId !== 0) {
      return { requestHeaders: headers };
    }

    const frame = FrameStorage.get(details.tabId, details.frameId);
    if (!frame) {
      return {
        requestHeaders: details.requestHeaders,
      };
    }

    const userAgent = tabStorage.get(details.tabId).crusherAgent;

    details.requestHeaders?.push({
      name: "User-Agent",
      value: userAgent,
    });

    return { requestHeaders: details.requestHeaders };
  }

  onRuntimeMessage() {}

  onBeforeNavigation(details: any) {
    const isAllowed = this.isAllowedToPerformAction(
      tabStorage.get(details.tabId)
    );

    if (!isAllowed || details.frameId === 0) {
      return;
    }

    if (details.parentFrameId === 0) {
      const userAgentId = getQueryStringParams("__crusherAgent__", details.url);
      const userAgentFromUrl = userAgents.find(
        (agent) => agent.name === userAgentId
      );
      const userAgent = userAgentFromUrl
        ? userAgentFromUrl.value
        : tabStorage.get(details.tabId).crusherAgent;

      if (userAgent) {
        FrameStorage.set({
          ...details,
          userAgent,
        });
      }
    }
  }

  registerEventListeners() {
    chrome.tabs.onUpdated.addListener(this.onTabUpdated);
    chrome.tabs.onRemoved.addListener(this.onTabRemoved);
    chrome.webRequest.onBeforeRequest.addListener(
      this.onBeforeRequest,
      { urls: ["<all_urls>"] },
      ["blocking"]
    );
    chrome.webRequest.onHeadersReceived.addListener(
      this.onHeadersReceived,
      { urls: ["<all_urls>"], types: ["sub_frame", "main_frame"] },
      ["blocking", "responseHeaders"]
    );
    chrome.webRequest.onBeforeSendHeaders.addListener(
      this.onBeforeSendHeaders,
      { urls: ["<all_urls>"], types: ["sub_frame"] },
      ["blocking", "requestHeaders"]
    );
    chrome.runtime.onMessage.addListener(this.onRuntimeMessage);
    chrome.webNavigation.onBeforeNavigate.addListener(this.onBeforeNavigation);
  }

  boot() {
    this.registerEventListeners();
  }

  shutdown() {}
}

const chromeEventsManager = new ChromeEventsListener();
chromeEventsManager.boot();
