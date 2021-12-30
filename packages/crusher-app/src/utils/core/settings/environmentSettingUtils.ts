import produce from "immer";

export const convertEnvToServerSide = (data) => {
	console.log(data);
	const newState = produce((draft) => {
		const varEntries = draft.vars.map(({ variableName, variableValue }) => {
			return [variableName.value, variableValue.value];
		});

		draft.vars = Object.fromEntries(varEntries);
		delete draft.id;
		delete draft.notSavedInDB;
		delete draft.isOpen;
	})(data);

	return newState;
};

export const converServerToClientSideState = (data) => {
	return data.map((dataItem) => {
		const { id, name, browser, vars, host } = dataItem;

		const parsedVars = Object.entries(JSON.parse(vars)).map(([k, v]) => {
			return {
				variableName: {
					value: k,
				},
				variableValue: {
					value: v,
				},
			};
		});
		return {
			id,
			name,
			browser,
			host,
			isOpen: false,
			vars: parsedVars,
			notSavedInDB: false,
		};
	});
};

export const converServerToClientSideStateMonitoring = (data) => {
	return data.map((dataItem) => {
		const { id, testInterval, environmentId } = dataItem;
		return {
			id,
			environmentId,
			testInterval,
			isOpen: false,
			notSavedInDB: false,
		};
	});
};

export const convertToServerSideMonitoring = (data) => {
	const newState = produce((draft) => {
		delete draft.id;
		delete draft.notSavedInDB;
		delete draft.isOpen;
	})(data);

	return newState;
};
