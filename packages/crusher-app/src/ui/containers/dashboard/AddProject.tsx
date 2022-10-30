import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

import { useAtom } from "jotai";

import { Button, Input } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";
import { Modal } from "dyson/src/components/molecules/Modal";

import { userAtom } from "@store/atoms/global/user";
import { LoadingSVG } from "@svg/dashboard";
import { backendRequest } from "@utils/common/backendRequest";
import { sendSnackBarEvent } from "@utils/common/notify";

import { appStateItemMutator } from "../../../store/atoms/global/appState";
import { projectsAtom } from "../../../store/atoms/global/project";
import { RequestMethod } from "../../../types/RequestOptions";

const addProject = (name) => {
	return backendRequest("/projects/actions/create", {
		method: RequestMethod.POST,
		payload: { name },
	});
};

export const AddProjectModal = ({ onClose }) => {
	const [projectName, changeProjectName] = useState("");
	const [processing, setProcessing] = useState(false);
	const [projects, setProjectsAtom] = useAtom(projectsAtom);
	const [user] = useAtom(userAtom);

	const [, setAppStateItem] = useAtom(appStateItemMutator);
	const router = useRouter();

	const isNoName = projectName.length === 0;

	const addProjectCallback = useCallback(() => {
		(async () => {
			const { id, name, teamID } = await addProject(projectName);
			const projectObject = { id, name, teamID, meta: {} };
			setProjectsAtom([...projects, projectObject]);

			setAppStateItem({ key: "selectedProjectId", value: id });
			onClose();
			await router.push("/app/dashboard");

			sendSnackBarEvent({ message: "Created and switched project" });
		})();

		setProcessing(true);
	}, [projectName]);

	return (
		<Modal onOutsideClick={onClose} onClose={onClose}>
			<div className={"font-cera text-16 font-600 leading-none"}>Create new project</div>
			<div
				className={"mt-44 text-13 font-600 mb-16"}
				css={css`
					color: #d8d8d8;
					margin-top: 62rem;
				`}
			>
				Enter Project name
			</div>
			<Input
				placeholder={`${user.name.split(" ")[0]}'s killer app`}
				css={css`
					width: 100%;
				`}
				onChange={(e) => {
					changeProjectName(e.target.value);
				}}
				value={projectName}
				disabled={processing}
			/>

			<div className={"flex justify-end mt-12"}>
				<Button
					css={css`
						min-width: 132rem;
					`}
					disabled={isNoName || processing}
					bgColor={isNoName ? "disabled" : ""}
					title={isNoName && "Please enter project name"}
					onClick={addProjectCallback}
				>
					<div className={"flex justify-center items-center"}>
						<Conditional showIf={processing}>
							<LoadingSVG
								css={css`
									margin-right: 8rem !important;
								`}
								color={"#fff"}
								height={"16rem"}
								width={"16rem"}
							/>
						</Conditional>
						Add Project
					</div>
				</Button>
			</div>
		</Modal>
	);
};

export default AddProjectModal;
