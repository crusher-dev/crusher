export class LogManager {
  private static logManager: any;

  static initalize(logManager) {
    this.logManager = logManager;
  }

  static async logStep(...args) {
    return this.logManager.logStep(...args);
  }
}

export async function logStep(...args) {
  return LogManager.logStep(args);
}