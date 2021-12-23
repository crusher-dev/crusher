import { AnyAction } from "redux";
import { iActionsState } from "../../interfaces/actionsReducer";
import {
	DELETE_RECORDED_ACTION,
	RECORD_ACTION,
	RESET_RECORDED_ACTIONS,
	SET_RECORDED_ACTION,
	UPDATE_ACTION_NAME,
	UPDATE_ACTION_TIMEOUT,
	UPDATE_LAST_RECORDED_ACTION,
	UPDATE_LAST_RECORDED_ACTION_OPTINALITY,
	UPDATE_LAST_RECORDED_ACTION_STATUS,
	UPDATE_SELECTED_ACTIONS,
} from "../actions/actions";
import { ActionStatusEnum, iAction } from "@shared/types/action";
import { ActionsInTestEnum } from "@shared/constants/recordedActions";

const initialState: iActionsState = {
	list: [],
	selectedActions: [],
	last_action: null,
};

export const actionsReducer = (state: any = initialState, action: AnyAction) => {
	if ([DELETE_RECORDED_ACTION, RECORD_ACTION, UPDATE_ACTION_NAME].includes(action.type)) {
		(window as any).electron.stepsUpdated();
	}

	switch (action.type) {
		case SET_RECORDED_ACTION: {
			const actionsArr = action.payload.actions;

			return {
				...state,
				list: actionsArr,
			};
		}
		case UPDATE_SELECTED_ACTIONS: {
			return {
				...state,
				selectedActions: action.payload.selectedActionIds,
			};
		}
		case UPDATE_LAST_RECORDED_ACTION_OPTINALITY: {
			const newList = [...state.list];
			if (newList.length) {
				newList[newList.length - 1] = {
					...newList[newList.length - 1],
					payload: {
						...newList[newList.length - 1].payload,
						isOptional: action.payload.isOptional,
					},
				};
			}
			return {
				...state,
				list: newList,
			};
		}
		case RESET_RECORDED_ACTIONS:
			return {
				...state,
				list: state.list.filter((action: iAction) => action.type === ActionsInTestEnum.SET_DEVICE),
			};
		case RECORD_ACTION:
			return {
				...state,
				list: [...state.list, action.payload.action],
				last_action: new Date(),
			};
		case UPDATE_LAST_RECORDED_ACTION_STATUS: {
			const actionsList = [...state.list];
			actionsList[actionsList.length - 1].status = action.payload.status;

			return {
				...state,
				list: actionsList,
				last_action: new Date(),
			};
		}
		case UPDATE_ACTION_NAME:
			return {
				...state,
				list: state.list.map((savedAction, index) => {
					if (index === action.payload.actionIndex)
						return {
							...savedAction,
							name: action.payload.name,
						};
					return savedAction;
				}),
			};
		case UPDATE_ACTION_TIMEOUT:
			return {
				...state,
				list: state.list.map((savedAction, index) => {
					if (index === action.payload.actionIndex)
						return {
							...savedAction,
							payload: {
								...savedAction.payload,
								timeout: action.payload.actionTimeout,
							},
						};
					return savedAction;
				}),
			};
		case UPDATE_LAST_RECORDED_ACTION: {
			const newList = state.list;
			newList[newList.length - 1] = action.payload.actionToBeReplacedWith;
			newList[newList.length - 1].status = ActionStatusEnum.SUCCESS;

			return {
				...state,
				list: [...newList],
				last_action: new Date(),
			};
		}
		case DELETE_RECORDED_ACTION: {
			const newList = state.list.filter((_: iAction, index: number) => {
				return index !== action.payload.actionIndex;
			});

			return {
				...state,
				list: newList,
			};
		}
		default:
			return state;
	}
};
