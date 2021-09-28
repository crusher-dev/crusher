export interface IExportsManager {
	has(name: string): boolean;
	get(name: string): any;
	set(name: string, value: any): boolean;
}
