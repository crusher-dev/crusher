import { iAction } from "@shared/types/action";
import { AxiosRequestConfig } from "axios";
import { getStore } from "electron-app/src/store/configureStore";
import { getCurrentSelectedProjct } from "electron-app/src/store/selectors/app";
import { createAuthorizedRequestFunc, resolveToBackend } from "electron-app/src/utils/url";



/*
    API
    1. /projects/:project_id/drafts => POST => Create draft test
        body: {
            name: string,
            events: any,
        }
    2. /projects/:project_id/drafts => GET => Get all drafts by project id
    3. /drafts/:draft_id => GET => Get draft by id
    4. /drafts/:draft_id => DELETE => Delete draft by id
    5. /drafts/:draft_id => PUT => Update draft by id
*/

interface ISaveDraftPayload {
    name?: string;
    events?: Array<iAction>;
}
const saveNewDraftTest: (payload: ISaveDraftPayload) => AxiosRequestConfig = createAuthorizedRequestFunc((authorizationOptions: any, payload: ISaveDraftPayload) => {
	const store = getStore();
	const selectedProject = getCurrentSelectedProjct(store.getState() as any);
	if (!selectedProject) return null;

	return {
		url: resolveToBackend(`/projects/${selectedProject}/drafts`),
		method: "POST",
        data: payload,
		...authorizationOptions,
	} as AxiosRequestConfig;
}, true);

const getDraft = createAuthorizedRequestFunc((authorizationOptions: any, draftId: number) => {
    const store = getStore();
    const selectedProject = getCurrentSelectedProjct(store.getState() as any);
    if (!selectedProject) return null;

    return {
        url: resolveToBackend(`/drafts/${draftId}`),
        method: "GET",
        ...authorizationOptions,
    } as AxiosRequestConfig;
}, true);

const getAllDrafts = createAuthorizedRequestFunc((authorizationOptions: any) => {
    const store = getStore();
    const selectedProject = getCurrentSelectedProjct(store.getState() as any);
    if (!selectedProject) return null;

    return {
        url: resolveToBackend(`/projects/${selectedProject}/drafts`),
        method: "GET",
        ...authorizationOptions,
    } as AxiosRequestConfig;
}, true);

const updateDraftTest: (payload: ISaveDraftPayload, id: number) => AxiosRequestConfig = createAuthorizedRequestFunc((authorizationOptions: any, payload: ISaveDraftPayload, draftId: number) => {
    const store = getStore();
    const selectedProject = getCurrentSelectedProjct(store.getState() as any);
    if (!selectedProject) return null;

    return {
        url: resolveToBackend(`/drafts/${draftId}`),
        method: "PUT",
        data: payload,
        ...authorizationOptions,
    } as AxiosRequestConfig;
}, true);

const deleteDraftTest = createAuthorizedRequestFunc((authorizationOptions: any, draftId: number) => {
    const store = getStore();
    const selectedProject = getCurrentSelectedProjct(store.getState() as any);
    if (!selectedProject) return null;

    return {
        url: resolveToBackend(`/drafts/${draftId}`),
        method: "DELETE",
        ...authorizationOptions,
    } as AxiosRequestConfig;
}, true);

export { saveNewDraftTest, updateDraftTest, getAllDrafts, deleteDraftTest, getDraft };
