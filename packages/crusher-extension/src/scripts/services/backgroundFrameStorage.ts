export default {
  frames: {},

  makeFrameId(tabId: number, frameId: number) {
    return `${tabId}-${frameId}`;
  },

  set(details: any) {
    this.frames[this.makeFrameId(details.tabId, details.frameId)] = details;
  },

  all() {
    return this.frames;
  },

  get(tabId: number, frameId: number) {
    return this.frames[this.makeFrameId(tabId, frameId)];
  },

  has(tabId: number, frameId: number) {
    const id = this.makeFrameId(tabId, frameId);
    return this.frames.hasOwnProperty(id) && this.frames[id] !== null;
  },
};
