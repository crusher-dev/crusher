"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const frames = {};
class FrameStorage {
    static makeFrameId(tabId, frameId) {
        return `${tabId}-${frameId}`;
    }
    static set(details) {
        frames[this.makeFrameId(details.tabId, details.frameId)] = details;
    }
    static get(tabId, frameId) {
        return frames[this.makeFrameId(tabId, frameId)];
    }
    static has(tabId, frameId) {
        const id = this.makeFrameId(tabId, frameId);
        return frames.hasOwnProperty(id) && frames[id] !== null;
    }
}
exports.default = FrameStorage;
//# sourceMappingURL=frameStorage.js.map