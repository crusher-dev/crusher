export class StorageManager {
  private static storageManager: any;

  static initialize(storageManager: any) {
    this.storageManager = storageManager;
  }

  static async uploadAsset(name: string, buffer: Buffer): Promise<string> {
    return this.storageManager.uploadAsset(name, buffer);
  }
};

export async function uploadAsset(name: string, buffer: Buffer): Promise<string> {
  return StorageManager.uploadAsset(name, buffer);
}