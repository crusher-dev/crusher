import fs from "fs";
import path from "path";
import { AppWindow } from "../main-process/app-window";
import { getStore } from "../store/configureStore";
import { getCurrentSelectedProjct } from "../store/selectors/app";
import dotenv from "dotenv";

export const readProjectConfig = (configPath: string) => {
    return eval("require")(configPath);
};

/*
    @TODO: Store project-configs information in persistent storage
    instead of localStorage. 
*/
export const shouldOverrideHost = async (appWindow: AppWindow) => {
    const store = getStore();
    const selectedProject = getCurrentSelectedProjct(store.getState() as any);

    if(selectedProject) {
        const projectConfigFiles = await appWindow.getWebContents().executeJavaScript("JSON.parse(localStorage.getItem('projectConfigFile') || {})");
        const projectConfigPath = projectConfigFiles[selectedProject];
        if(!projectConfigPath) return  null;
        const projectConfig = readProjectConfig(projectConfigPath);
        if(!projectConfig) {
            return null;
        }

        if(projectConfig.env?.BASE_URL) {
            return { host: projectConfig.env.BASE_URL };
        }
    }
    return null;
}

export const getEnvironmentsFromConfigPath = async (projectConfigPath: string) => {
    const projectDirPath = projectConfigPath.split(path.sep).slice(0, -1).join(path.sep);
    
    const envFiles = fs.readdirSync(projectDirPath).filter((file) => file.includes(".env"));
    
    const envs = envFiles.map((file) => {
        // Remove first .env
        const env = file.split(".").slice(2).join(".");
        const filePath = path.join(projectDirPath, file);

        const envFile = dotenv.parse(fs.readFileSync(filePath));
        
        return {
            name: env,
            path: filePath,
            variables: envFile,
        }
    });

    return envs;
}

export const getEnvironments = async (appWindow: AppWindow) => {
    const store = getStore();
    const selectedProject = getCurrentSelectedProjct(store.getState() as any);
    
    if(!selectedProject) return null;

    const projectConfigFiles = await appWindow.getWebContents().executeJavaScript("JSON.parse(localStorage.getItem('projectConfigFile') || {})");
    const projectConfigPath = projectConfigFiles[selectedProject];

    if(!projectConfigPath) return  null;


    return getEnvironmentsFromConfigPath(projectConfigPath);
}