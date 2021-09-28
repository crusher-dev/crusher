import { IExportsManager } from "@crusher-shared/lib/exports/interface";

export class ExportsManager {
	constructor(private exportsManager: IExportsManager) {
		return this;
	}

  async has(key: string) {
    return this.exportsManager.has(key);
  }


  async get(key: string) {
    return this.exportsManager.get(key);
  }

  async set(key: string, value: any) {
    return this.exportsManager.set(key, value);
  }
}
