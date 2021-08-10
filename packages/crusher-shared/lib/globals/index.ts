import { IGlobalManager } from "./interface";

class GlobalManager implements IGlobalManager {
  entires: Map<string, any>;

  constructor() {
    this.entires = new Map<string, any>();
  }

  has(key: string) {
    return this.entires.has(key);
  }

  get(key: string): any {
    return this.entires.get(key);
  }

  set(key: string, value: any) {
    this.entires.set(key, value);
    return true;
  }
}

export { GlobalManager };