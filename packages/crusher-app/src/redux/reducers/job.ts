import { ADD_COMMENT_TO_SCREENSHOT, SET_CURRENT_JOB_INFO, SET_CURRENT_JOB_PLATFORM } from "@redux/actions/job";

const initialState = {
	platform: "CHROME",
	job: null,
	referenceJob: null,
	comments: {},
	instances: {},
	results: {},
};

const job = (state = initialState, action: any) => {
	switch (action.type) {
		case SET_CURRENT_JOB_INFO:
            return {
				...state,
				job: action.job,
				referenceJob: action.referenceJob,
				comments: action.comments,
				instances: action.instances,
				results: action.results,
			};
		case ADD_COMMENT_TO_SCREENSHOT:
            return {
				...state,
				comments: {
					...state.comments,
					[action.comment.result_id]: [
						...((state.comments[action.comment.result_id] || [])),
						{
							id: action.comment.id,
							user_id: action.comment.user_id,
							user_first_name: action.comment.user_first_name,
							user_last_name: action.comment.user_last_name,
							result_id: action.comment.result_id,
							report_id: action.comment.report_id,
							message: action.comment.message,
							created_at: new Date().toString(),
						},
					],
				},
			};
		case SET_CURRENT_JOB_PLATFORM:
            return {
				...state,
				platform: action.platform,
			};
		default:
			return state;
	}
};

export default job;
