import { Modal } from "@ui/containers/modals/modal";
import {useState} from "react";
import React from "react";
import {ModalInput} from "@ui/components/modal/input";
import {css} from "@emotion/core";
import { ModalButton } from '@ui/components/modal/button';

interface iProps {
	onSubmit: any;
	onClose: any;
};
const CreateProjectModal = (props: iProps) => {
	const {onSubmit, onClose} = props;
	const [projectName, setProjectName] = useState("");

	const handleSubmit = () => {
		if(projectName && projectName.replace(/\s/g, "").length){
			if(onSubmit) {
				onSubmit(projectName);
			}
		} else {
			alert("Invalid project name");
		}
	};

	const handleChange = (event: any) => {
		setProjectName(event.target.value);
	}

	return (
    <Modal
      heading={"Create a project"}
      desc={"in your team"}
      illustration={"/assets/img/illustration/create_project_illustration.png"}
      moto={"Structure your team in a nice-manner."}
			onClose={onClose}
    >
			<div css={bodyContainerCss}>
				<ModalInput id={"project_name"} title={"Project Name"} placeholder={"Enter project name"} value={projectName} onChange={handleChange}/>
				<div css={membersInputCss}>
					<div><label>Members of this project</label></div>
					<div css={membersDescCss}>All members get notification. You can modify this from project settings.</div>
				</div>

				<ModalButton containerCss={buttonCss} title={"Create a new Project"} onClick={handleSubmit}/>
			</div>
		</Modal>
  );
};

const bodyContainerCss = css`
	margin-top: 1.55rem;
	display: flex;
	flex-direction: column;
	label {
		font-family: Gilroy;
		font-weight: bold;
		color: #2B2B39;
		font-size: 0.825rem;
	}
	min-height: 22rem;
`;

const membersInputCss = css`
	margin-top: 2.15rem;
`

const membersDescCss = css`
	font-size: 0.8rem;
	margin-top: 0.5rem;
`;

const buttonCss = css`
	margin-top: auto;
`;


export { CreateProjectModal };
