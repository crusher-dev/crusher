import React, { useCallback, useState } from "react";
import { css } from "@emotion/core";
import { cleanHeaders } from "@utils/backendRequest";
import { getAllSlackIntegrationsForProject } from "@services/alerting";
import { getCookies } from "@utils/cookies";
import { redirectToFrontendPath } from "@utils/router";
import WithSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";
import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import { PIXEL_REM_RATIO } from "@constants/other";
import { Input } from "@ui/atom/Input";
import CopyIcon from "../../../public/svg/settings/copy.svg";
import CopySparkIcon from "../../../public/svg/settings/copySpark.svg";
import clipboardCopy from "clipboard-copy";
import { Conditional } from "@ui/components/common/Conditional";

const INVITE_LINK = "https://app.crusher.dev/invite/user/f321fasgc32ase";

interface iCopyInviteLinkActionProps {
	value: string;
	showOnlyIcon?: boolean;
}

const CopyInviteLinkAction = (props: iCopyInviteLinkActionProps) => {
	const { showOnlyIcon, value: inviteLink } = props;
	const copyInviteLinkToClipboard = () => {
		clipboardCopy(inviteLink).then(() => {
			console.log("Invite Link copied to clipboard");
		});
	};

	return (
		<div css={copyInviteLinkCSS} onClick={copyInviteLinkToClipboard}>
			<CopyIcon />
			<Conditional If={!showOnlyIcon}>
				<span css={copyActionTextCSS}>Copy</span>
			</Conditional>
		</div>
	);
};

CopyInviteLinkAction.defaultProps = {
	showOnlyIcon: false,
};

const copyInviteLinkCSS = css`
	display: flex;
	align-items: center;
	font-size: ${14 / PIXEL_REM_RATIO}rem;
	font-family: Gilroy;
	font-weight: 500;
	color: #373737;
`;

const copyActionTextCSS = css`
	margin-left: ${12 / PIXEL_REM_RATIO}rem;
`;

interface iInviteUserFromEmailButtonProps {
	onClick: any;
}
const InviteUserFromEmailButton = (props: iInviteUserFromEmailButtonProps) => {
	const { onClick } = props;
	return (
		<div css={[buttonCSS, inviteButtonCSS]} onClick={onClick}>
			Invite
		</div>
	);
};
const inviteButtonCSS = css`
	background: #6583fe;
`;

interface iCopyInviteLinkButtonProps {
	link: string;
}

const CopyInviteLinkButton = (props: iCopyInviteLinkButtonProps) => {
	const { link: inviteLink } = props;
	const copyInviteLinkToClipboard = () => {
		clipboardCopy(inviteLink).then(() => {
			console.log("Invite Link copied to clipboard");
		});
	};

	return (
		<div css={[buttonCSS, copyButtonCSS]} onClick={copyInviteLinkToClipboard}>
			<CopySparkIcon />
			<span>Copy Link</span>
		</div>
	);
};

const copyButtonCSS = css`
	background: #323232;
	display: flex;
	justify-content: center;
	span {
		margin-left: ${9 / PIXEL_REM_RATIO}rem;
	}
`;

const buttonCSS = css`
	border-radius: 4px;
	padding: ${10 / PIXEL_REM_RATIO}rem ${10 / PIXEL_REM_RATIO}rem;
	border: 1.2px solid #6583fe;
	color: #fff;
	min-width: ${150 / PIXEL_REM_RATIO}rem;
	text-align: center;
	margin-left: ${20 / PIXEL_REM_RATIO}rem;
	cursor: pointer;
	font-size: ${15 / PIXEL_REM_RATIO}rem;
	font-weight: 600;
	font-family: Gilroy;
`;

const Separator = () => {
	return <div css={separatorCSS}></div>;
};

const separatorCSS = css`
	height: 1px;
	margin-top: ${54 / PIXEL_REM_RATIO}rem;
	background: #f3f3f3;
	width: 100%;
`;

const InviteMembers = () => {
	const [newMemberEmail, setNewMemberEmail] = useState("");
	const onNewMemberChange = (event: InputEvent) => {
		setNewMemberEmail((event.target as HTMLInputElement).value);
	};

	const inviteNewMember = () => {
		console.log("Inviting new member by sending invite mail: ", newMemberEmail);
	};

	return (
		<SettingsContent>
			<SettingsContentHeader
				title={"Invite team members"}
				desc={"Invite your friends, employees or co-workers in current project"}
			/>
			<div css={mainContainerCSS}>
				<div>
					<Input
						label={"Invite by Email"}
						value={newMemberEmail}
						placeholder={"Enter email address"}
						onChange={onNewMemberChange}
						actionButton={<InviteUserFromEmailButton onClick={inviteNewMember} />}
						onKeySubmit={inviteNewMember}
					/>
				</div>
				<div css={inviteLinkContainerCSS}>
					<Input
						label={"Or share invite link"}
						value={INVITE_LINK}
						onChange={onNewMemberChange}
						isOnlyReadable={true}
						actionIcon={<CopyInviteLinkAction value={INVITE_LINK} />}
						inputContainerCSS={customInviteLinkInputContainerCSS}
					/>
				</div>
			</div>
			<Separator />
			<div css={inviteExternalMembersContainerCSS}>
				<div css={inviteBirdImageContainerCSS}>
					<img src={"/assets/img/inviteBird.png"} />
				</div>
				<div css={externalCardContentCSS}>
					<div css={externalCardHeadingCSS}>Invite external members</div>
					<div css={externalCardDescCSS}>
						You both get 1 month free when they upgrade to pro plan.
					</div>
					<div css={externalCardInputCSS}>
						<Input
							value={INVITE_LINK}
							onChange={onNewMemberChange}
							isOnlyReadable={true}
							actionButton={<CopyInviteLinkButton link={INVITE_LINK} />}
							inputContainerCSS={customInviteLinkInputContainerCSS}
						/>
					</div>
				</div>
			</div>
		</SettingsContent>
	);
};

const mainContainerCSS = css`
	margin-top: ${47 / PIXEL_REM_RATIO}rem;
	width: 100%;
`;

const inviteLinkContainerCSS = css`
	margin-top: ${54 / PIXEL_REM_RATIO}rem;
`;

const customInviteLinkInputContainerCSS = css`
	width: ${364 / PIXEL_REM_RATIO}rem;
`;

const inviteExternalMembersContainerCSS = css`
	display: flex;
	margin-top: ${54 / PIXEL_REM_RATIO}rem;
`;

const inviteBirdImageContainerCSS = css`
	width: ${88 / PIXEL_REM_RATIO}rem;
	height: ${88 / PIXEL_REM_RATIO}rem;
`;

const externalCardContentCSS = css`
	margin-left: ${20 / PIXEL_REM_RATIO}rem;
`;
const externalCardHeadingCSS = css`
	font-family: Gilroy;
	font-weight: 800;
	color: #323232;
	font-size: ${20 / PIXEL_REM_RATIO}rem;
`;

const externalCardDescCSS = css`
	margin-top: ${6 / PIXEL_REM_RATIO}rem;
	font-size: ${16 / PIXEL_REM_RATIO}rem;
	font-weight: 500;
	font-family: Gilroy;
	color: #323232;
`;

const externalCardInputCSS = css`
	margin-top: ${20 / PIXEL_REM_RATIO}rem;
`;

InviteMembers.getInitialProps = async (ctx: any) => {
	const { req, res } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}
		const cookies = getCookies(req);

		const selectedProject = JSON.parse(
			cookies.selectedProject ? cookies.selectedProject : null,
		);

		const slackIntegrations = await getAllSlackIntegrationsForProject(
			selectedProject,
			headers,
		);

		return {
			isIntegratedWithSlack: false,
			isIntegratedWithRepo: false,
			isIntegratedWithEmail: true,
			slackIntegrations: slackIntegrations,
		};
	} catch (ex) {
		throw ex;
		redirectToFrontendPath("/404", res);
		return null;
	}
};

export default WithSession(WithSettingsLayout(InviteMembers));
