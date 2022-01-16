import { IExportsManager } from "@crusher-shared/lib/exports/interface";

export class ExportsManager {
	constructor(private exportsManager: IExportsManager) {
		return this;
	}

	has(key: string) {
		return this.exportsManager.has(key);
	}

	get(key: string) {
		return this.exportsManager.get(key);
	}

	set(key: string, value: any) {
		return this.exportsManager.set(key, value);
	}
}
