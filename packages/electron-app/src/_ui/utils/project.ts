import { getCurrentSelectedProjct } from "electron-app/src/store/selectors/app";
import { getStore } from "../../store/configureStore";
import fs from "fs";

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
             config = eval("require")(projectConfigPath);
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

export { getCurrentProjectConfigPath, writeProjectConfig, getCurrentProjectConfig };