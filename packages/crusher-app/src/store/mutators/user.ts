import { atom } from 'jotai';
import { backendRequest } from '@utils/backendRequest';
import { RequestMethod } from '../../types/RequestOptions';
import { updateProjectAPI, updateTeamMetaAPI, updateUserMetaAPI } from '@constants/api';
import { appStateAtom } from '../atoms/global/appState';
import { userAtom } from '../atoms/global/user';
import produce from 'immer';
import { teamAtom } from '../atoms/global/team';
import { projectsAtom } from '../atoms/global/project';


interface IUpdateUserOnboarding{
	type: 'user'| 'team' | 'project',
	key: string,
	value: string
};


const updateUserMeta = (payload: Record<string, any>)=>{
	return backendRequest(updateUserMetaAPI(), {
		method: RequestMethod.POST,
		payload
	})
}


const updateProjectMeta = (projectId:number, payload: Record<string, any>)=>{
	return backendRequest(updateProjectAPI(projectId), {
		method: RequestMethod.POST,
		payload
	})
}

const updateTeamMeta = (payload: Record<string, any>)=>{
	return backendRequest(updateTeamMetaAPI(), {
		method: RequestMethod.POST,
		payload
	})
}

export const updateOnboardingMutator = atom(null,(_get, _set, {
	type, key, value
}:IUpdateUserOnboarding)=>{

	const {selectedProjectId} = _get(appStateAtom)
	const payload = {[`${key}`]: value};
	switch (type){
		case 'project':{

			const project = _get(projectsAtom);
			const newState = produce(project, (draftProjects) => {
				for(const project of draftProjects){
					if(project.id === selectedProjectId){
						project["meta"] = {...project["meta"],...payload}
					}
				}
			});
			_set(projectsAtom, newState)
			
			updateProjectMeta(selectedProjectId, payload)
		} break;

		case 'team':{
			const team = _get(teamAtom);
			const newState = produce(team, (newState) => {
				// @ts-ignore
				newState["meta"] = {...newState["meta"],...payload};
			});
			_set(teamAtom, newState)
			updateTeamMeta(payload)
		} break;

		case 'user':{
			const user = _get(userAtom);
			const newState = produce(user, (newState) => {
				// @ts-ignore
				newState["meta"] = {...newState["meta"],...payload};
			});
			_set(userAtom, newState)
			updateUserMeta(payload)
		} break;
	}

});
