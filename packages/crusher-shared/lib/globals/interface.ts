export interface IGlobalManager {
  has(name: string): boolean;
  get(name: string): any;
  set(name: string, value: any): void;
}