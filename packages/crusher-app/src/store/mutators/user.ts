import { atom } from "jotai";

interface IUpdateUserOnboarding{
	type: 'user'| 'team' | 'project',
	key: string,
	value: string
}

export const updateOnboarding = atom(null,(_get,_set,{
	type, key, value
}:IUpdateUserOnboarding)=>{

	switch (type){
		case 'project':{
			console.log("sd");

		} break;
		case 'team':{
			console.log("sd");

		} break;
		case 'user':{
			console.log("sd");

		} break;
	}

});
