import { StorageManagerInterface } from "@crusher-shared/lib/storage/interface";
import * as path from "path";

export class StorageManager {
  private static storageManager: StorageManagerInterface;
  private static baseAssetPath: string;

  static initialize(storageManager: StorageManagerInterface, baseAssetPath: string) {
    this.storageManager = storageManager;
    this.baseAssetPath = baseAssetPath;

    return this;
  }

  static async uploadAsset(name: string, buffer: Buffer): Promise<string> {
    return this.storageManager.uploadBuffer(buffer, path.resolve(this.baseAssetPath, name));
  }
};

export async function uploadAsset(name: string, buffer: Buffer): Promise<string> {
  return StorageManager.uploadAsset(name, buffer);
}