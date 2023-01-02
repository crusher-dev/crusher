import { getCurrentSelectedProjct } from "electron-app/src/store/selectors/app";
import { getStore } from "../../store/configureStore";
import fs from "fs";
import { remote } from "electron";

const getCurrentProjectConfigPath = () => {
    try {
        const store = getStore();
        const projectId = getCurrentSelectedProjct(store.getState() as any);
        const projectConfigFile = window.localStorage.getItem("projectConfigFile");
        const projectConfigFileJson = JSON.parse(projectConfigFile);
        if (projectConfigFileJson[projectId]) {
            return projectConfigFileJson[projectId];
        }
    } catch(err) {}

    return null;
};

const getCurrentProjectConfig = () => {
    const projectConfigPath = getCurrentProjectConfigPath();
    if (projectConfigPath) {
        let config = null;
        // if projectConfigPath is .js
        if (projectConfigPath.endsWith(".js")) {
             config = remote.require(projectConfigPath);
        } else {
            config = JSON.parse(fs.readFileSync(projectConfigPath, "utf8"));
        }

        console.log("projectConfigFIle", config);
        return config;
    }
};
const writeProjectConfig = (config: any) => {
        const store = getStore();
        const projectConfigPath = getCurrentProjectConfigPath();

        if (projectConfigPath) {
            if(projectConfigPath.endsWith(".js")) {
                fs.writeFileSync(projectConfigPath, `module.exports = ${JSON.stringify(config, null, 4)}`);
            } else {
                fs.writeFileSync(projectConfigPath, JSON.stringify(config, null, 4));
            }
        }

};

const timeSince = (date: any) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
};
export { getCurrentProjectConfigPath, writeProjectConfig, getCurrentProjectConfig, timeSince };