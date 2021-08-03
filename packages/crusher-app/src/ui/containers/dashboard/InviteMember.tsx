import { css } from "@emotion/react";

import { Button, Input } from "dyson/src/components/atoms";
import { Modal } from "dyson/src/components/molecules/Modal";
import { useCallback, useState } from "react";
import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "../../../types/RequestOptions";
import { LoadingSVG } from "@svg/dashboard";
import { Conditional } from "dyson/src/components/layouts";
import { projectsAtom } from "../../../store/atoms/global/project";
import { useAtom } from "jotai";
import { appStateItemMutator } from "../../../store/atoms/global/appState";
import { useRouter } from "next/router";

const inviteTeamMember = (name) => {
	return backendRequest("/projects/actions/create", {
		method: RequestMethod.POST,
		payload: { name },
	});
};

export const InvitePeople = ({ onClose }) => {
	const [emailList, changeEmailList] = useState("");
	const [processing, setProcessing] = useState(false);

	const isNoName = emailList.length === 0;

	const addProjectCallback = useCallback(() => {
		(async () => {
			await inviteTeamMember(emailList);
		})();

		setProcessing(true);
	}, [emailList]);
	return (
		<Modal onOutsideClick={onClose} onClose={onClose}>
			<div className={"font-cera text-16 font-600 leading-none"}>Invite your teammates</div>
			<div className={"text-13 mt-8"}>Members of the same team can create and run test.</div>
			<div
				className={"mt-44 text-13 font-600 mb-16"}
				css={css`
					color: #d8d8d8;
				`}
			>
				Enter email - comma separated
			</div>
			<Input
				placeholder={"test@x.ai, new@x.ai"}
				css={css`
					width: 100%;
				`}
				onChange={(e) => {
					changeEmailList(e.target.value);
				}}
				value={emailList}
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
								height={16}
								width={16}
							/>
						</Conditional>
						Invite
					</div>
				</Button>
			</div>
		</Modal>
	);
};

export default InvitePeople;
