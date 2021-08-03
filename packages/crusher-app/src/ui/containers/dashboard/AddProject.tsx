import { css } from "@emotion/react";

import { Button, Input } from "dyson/src/components/atoms";
import { Modal } from 'dyson/src/components/molecules/Modal';
import { useCallback, useState } from 'react';
import { backendRequest } from '@utils/backendRequest';
import { RequestMethod } from '../../../types/RequestOptions';

const addProject = (name) => {
	return backendRequest("/projects/actions/create", {
		method: RequestMethod.POST,
		payload: { name },
	});
};


export const AddProjectMondal = ({ onClose }) => {
	const [projectName, changeProjectName] = useState("")
	const [processing, setProcessing] = useState(false)
	const isNoName = projectName.length ===0;

	const addProjectCallback = useCallback(()=>{

		(async ()=>{
			const data = await addProject(projectName);
			debugger;
			console.log(data)
		})()

		setProcessing(true)
	},[projectName])
	return (
		<Modal onOutsideClick={onClose} onClose={onClose}>
			<div className={"font-cera text-16 font-600 leading-none"}>Create new project</div>
			<div className={"text-13 mt-8"}>Organize test under one group</div>
			<div
				className={"mt-44 text-13 font-600 mb-16"}
				css={css`
					color: #d8d8d8;
				`}
			>
				Enter Project name
			</div>
			<Input
				placeholder={"Himanshu's killer app"}
				css={css`
					width: 100%;
				`}
				onChange={(e)=>{changeProjectName(e.target.value)}}
				value={projectName}
				disabled={processing}
			/>

			<div className={"flex justify-end mt-12"}>
				<Button
					css={css`
						width: 124rem;
					`}
					disabled={isNoName || processing}
					bgColor={isNoName ? "disabled" : ""}
					title={isNoName && "Please enter project name"}
					onClick={addProjectCallback}
				>
					Save test
				</Button>
			</div>
		</Modal>
	);
};

export default AddProjectMondal;
