export function sendMessageToBackground(payload: any, callback: any = null) {
  chrome.runtime.sendMessage(payload, (response: any) => {
    if (callback) {
      callback(response);
    }
  });
}

export function sendMessageToPage(payload: any, callback: any = null) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any) => {
    chrome.tabs.sendMessage(tabs[0].id, payload, (response: any) => {
      if (callback) {
        callback(response);
      }
    });
  });
}
