import { iMemberInfoResponse } from "@crusher-shared/types/response/membersInfoResponse";
import IAction from "@interfaces/redux/action";
import { SET_TEAM_MEMBERS } from "@redux/actions/team";

interface iState {
	members: {
		[memberId: number]: iMemberInfoResponse;
	};
}

const initialState: iState = {
	members: [],
};

const team = (state = initialState, action: IAction<any>) => {
	switch (action.type) {
		case SET_TEAM_MEMBERS: {
			const _membersMap = ((action.payload.members as iMemberInfoResponse[])).reduce((prev, current) => {
				return { ...prev, [current.id]: current };
			}, {});
			return {
				...state,
				members: _membersMap,
			};
		}
		default:
			return state;
	}
};
export default team;
