import { getCurrentSelectedProjct } from "electron-app/src/store/selectors/app";
import { getStore } from "../../store/configureStore";

const getCurrentProjectConfig = () => {
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

export { getCurrentProjectConfig };