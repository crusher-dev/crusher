import { app } from "electron";
import fs from "fs";
import path from "path";

class SettingsManager {
    static appPath = path.resolve(app ? app.getAppPath() : eval("require")("electron/renderer").remote.app.getAppPath(), "crusher-settings.json");

    static initSettingsConfig() {
        if(!fs.existsSync(this.appPath)) {
            fs.writeFileSync(this.appPath, JSON.stringify({}), "utf8");
        } 
    }

    static saveSettings(payload) {
        this.initSettingsConfig();
        fs.writeFileSync(this.appPath, JSON.stringify(payload), "utf8");
    }

    static getSavedSettings() {
        this.initSettingsConfig();
        return JSON.parse(fs.readFileSync(this.appPath, "utf8"));
    }
}

export { SettingsManager };