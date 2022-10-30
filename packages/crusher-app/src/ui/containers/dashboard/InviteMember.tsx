import { css } from "@emotion/react";
import { ReactEventHandler, useCallback, useState } from "react";
import React from "react";

import { useAtom } from "jotai";
import useSWR from "swr";

import { Button, Input } from "dyson/src/components/atoms";
import { Conditional } from "dyson/src/components/layouts";
import { Modal } from "dyson/src/components/molecules/Modal";

import { getInviteMemberAPI } from "@constants/api";
import { LoadingSVG } from "@svg/dashboard";
import { backendRequest } from "@utils/common/backendRequest";
import { sendSnackBarEvent } from "@utils/common/notify";
import { appStateAtom } from "crusher-app/src/store/atoms/global/appState";

import { RequestMethod } from "../../../types/RequestOptions";

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

	const { data } = useSWR(getInviteMemberAPI(selectedProjectId));
	const isNoName = emailList.length === 0;

	const inviteMembersCallback = useCallback(() => {
		(async () => {
			try {
				await inviteTeamMembers(selectedProjectId, emailList);
				sendSnackBarEvent({ type: "normal", message: "We have sent invitation links to their email" });
				onClose();
			} catch {
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
				Enter emails - comma separated
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
						min-width: 102rem;
					`}
					disabled={isNoName || processing}
					bgColor={isNoName ? "disabled" : "primary"}
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
								height={"16rem"}
								width={"16rem"}
							/>
						</Conditional>
						Invite
					</div>
				</Button>
			</div>

			<div className={"flex mt-32 items-center justify-between"}>
				<div
					className={"text-13 font-600 pt-8 mr-24"}
					css={css`
						color: #d8d8d8;
					`}
				>
					Or share link
				</div>
				<Input
					css={css`
						width: 400rem;
						height: 40rem !important;
					`}
					value={data ?? "Loading.."}
					onFocus={(event: ReactEventHandler<MouseEvent>) => {
						event.target.select();
						event.target.setSelectionRange(0, 99999);
						document.execCommand("copy");
						sendSnackBarEvent({ type: "normal", message: "Copied invite link to clipboard" });
					}}
				/>
			</div>
		</Modal>
	);
};

export default InvitePeople;
