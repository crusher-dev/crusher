const frames: any = {};

export default class FrameStorage {
  static makeFrameId(tabId: number, frameId: any): string {
    return `${tabId}-${frameId}`;
  }

  static set(details: any) {
    frames[this.makeFrameId(details.tabId, details.frameId)] = details;
  }

  static get(tabId: number, frameId: any) {
    return frames[this.makeFrameId(tabId, frameId)];
  }

  static has(tabId: number, frameId: any) {
    const id = this.makeFrameId(tabId, frameId);
    return frames.hasOwnProperty(id) && frames[id] !== null;
  }
}
