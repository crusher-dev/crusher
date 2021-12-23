import { AnyAction } from "redux";
import {} from "../actions/recorder";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { iAction } from "@shared/types/action";

export interface iSettings { 
    autoDetectActions: boolean;
    backendEndPoint: string;
}


interface IAppReducer {
	settings: iSettings
};

const initialState: IAppReducer = {
	settings: { autoDetectActions: true, backendEndPoint: "https://backend.crusher.dev" }
};

const appReducer = (state: IAppReducer = initialState, action: AnyAction) => {
	switch (action.type) {
		default:
			return state;
	}
};

export {IAppReducer, appReducer};

