import { AppWindow } from "../main-process/app-window";
import { getStore } from "../store/configureStore";
import { getCurrentSelectedProjct } from "../store/selectors/app";

export const readProjectConfig = (configPath: string) => {
    return eval("require")(configPath);
};

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