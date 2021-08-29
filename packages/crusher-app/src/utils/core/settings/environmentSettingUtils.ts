import produce from 'immer';

export const convertEnvToServerSide= (data)=>{
	const newState = produce((draft)=>{
		const varEntries = draft.vars.map(({variableName,variableValue})=>{
			return [variableName.value,variableValue.value]
		})

		draft.vars = Object.fromEntries(varEntries)
		delete draft.notSavedInDB
		delete draft.isOpen
	})(data)

	return newState;
}