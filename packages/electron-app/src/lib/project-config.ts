import { AppWindow } from "../main-process/app-window";
import { getStore } from "../store/configureStore";
import { getCurrentSelectedProjct } from "../store/selectors/app";

export const readProjectConfig = (configPath: string) => {
    return eval("require")(configPath);
};

export const shouldOverrideHost = async (appWindow: AppWindow) => {
    const store = getStore();
    const selectedProject = getCurrentSelectedProjct(store.getState() as any);
    console.log("Selected project is", selectedProject);

    if(selectedProject) {
        const projectConfigFiles = await appWindow.getWebContents().executeJavaScript("JSON.parse(localStorage.getItem('projectConfigFile') || {})");
        const projectConfigPath = projectConfigFiles[selectedProject];
        console.log("Project config path is", projectConfigPath);
        if(!projectConfigPath) return  null;
        const projectConfig = readProjectConfig(projectConfigPath);
        console.log("Project config is", projectConfig);
        if(!projectConfig) {
            return null;
        }

        if(projectConfig.selectedHost) {
            return { host: projectConfig.selectedHost };
        }
    }
    return null;
}