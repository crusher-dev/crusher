import React, { SyntheticEvent } from "react";
import { css } from "@emotion/react";
import { Button, Input } from "dyson/src/components/atoms";
import { Modal } from "dyson/src/components/molecules/Modal";
import { useCallback, useState } from "react";
import { backendRequest } from "@utils/backendRequest";
import { RequestMethod } from "../../../types/RequestOptions";
import { LoadingSVG } from "@svg/dashboard";
import { Conditional } from "dyson/src/components/layouts";
import { sendSnackBarEvent } from "@utils/notify";
import { appStateAtom } from "crusher-app/src/store/atoms/global/appState";
import { useAtom } from "jotai";
import useSWR from 'swr';
import { getInviteMemberAPI, getRunTestApi } from '@constants/api';

const inviteTeamMembers = (projectId: number, emailList: string) => {
	return backendRequest("/users/actions/invite.project.members", {
		method: RequestMethod.POST,
		payload: {
			projectId: projectId,
			emails: emailList.split(","),
		},
	});
};

export const InvitePeople = ({ onClose }) => {
	const [emailList, changeEmailList] = useState("");
	const [processing, setProcessing] = useState(false);
	const [{ selectedProjectId }] = useAtom(appStateAtom);

	const {data} = useSWR(getInviteMemberAPI(selectedProjectId))
	const isNoName = emailList.length === 0;

	const inviteMembersCallback = useCallback(() => {
		(async () => {
			try {
				await inviteTeamMembers(selectedProjectId, emailList);
				sendSnackBarEvent({ type: "normal", message: "We have sent invitation links to their email" });
				onClose();
			} catch (err) {
				sendSnackBarEvent({ type: "error", message: "Failed to send invitations" });
			}
			setProcessing(false);
		})();
		setProcessing(true);
	}, [emailList]);

	return (
		<Modal onOutsideClick={onClose} onClose={onClose}>
			<div className={"font-cera text-16 font-600 leading-none"}>Invite your teammates</div>
			<div
				className={"text-13 mt-8"}
				css={css`
					font-size: 12.5rem;
				`}
			>
				Members of the same team can create and run test.
			</div>
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
				onChange={(e: React.FormEvent<HTMLInputElement>) => {
					changeEmailList(e.currentTarget.value);
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
					onClick={inviteMembersCallback}
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

			<div className={"flex mt-32 items-center"}>
				<div
					className={"mt-12 text-13 font-600 mb-16 mr-24"}
					css={css`
						color: #d8d8d8;
					`}
				>
					Or share link
				</div>
				<Input
					placeholder={"test@x.ai, new@x.ai"}
					css={css`
						flex: 1;
						height: 40rem !important;
					`}
					value={data || "Loading.."}
					disabled={true}
				/>
			</div>
		</Modal>
	);
};

export default InvitePeople;
