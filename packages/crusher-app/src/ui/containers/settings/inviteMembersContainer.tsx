import React, { useState } from "react";
import { Input } from "@ui/atom/Input";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import clipboardCopy from "clipboard-copy";
import CopyIcon from "../../../../public/svg/settings/copy.svg";
import { Conditional } from "@ui/components/common/Conditional";
import CopySparkIcon from "../../../../public/svg/settings/copySpark.svg";
import { Toast } from "@utils/toast";
import { _inviteTeamMember } from "@services/v2/invite";

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
	border: 1.2px solid #6583fe;
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
	border: 1.2px solid #141414;
	span {
		margin-left: ${9 / PIXEL_REM_RATIO}rem;
	}
`;

const buttonCSS = css`
	border-radius: 4px;
	padding: ${10 / PIXEL_REM_RATIO}rem ${10 / PIXEL_REM_RATIO}rem;
	color: #fff;
	min-width: ${150 / PIXEL_REM_RATIO}rem;
	text-align: center;
	margin-left: ${20 / PIXEL_REM_RATIO}rem;
	cursor: pointer;
	font-size: ${14 / PIXEL_REM_RATIO}rem;
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

interface iInviteMemberContainerProps {
	link: string | null;
	externalInputCSS?: any;
}

const InviteMembersContainer = (props: iInviteMemberContainerProps) => {
	const { link, externalInputCSS } = props;

	const [newMemberEmail, setNewMemberEmail] = useState("");
	const onNewMemberChange = (event: InputEvent) => {
		setNewMemberEmail((event.target as HTMLInputElement).value);
	};

	const inviteNewMember = () => {
		if (!newMemberEmail) {
			return Toast.showError("No email address provided");
		}
		_inviteTeamMember([newMemberEmail])
			.then((info) => {
				console.log(info);
				Toast.showSuccess("Successfully invited user");
				setNewMemberEmail("");
			})
			.catch(() => {
				Toast.showError("Some error occurred while inviting the user");
			});
	};

	return <>
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
                    value={link}
                    onChange={onNewMemberChange}
                    isOnlyReadable={true}
                    actionIcon={<CopyInviteLinkAction value={link} />}
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
                <div css={externalCardDescCSS}>You both get 1 month free when they upgrade to pro plan.</div>
                <div css={externalCardInputCSS}>
                    <Input
                        value={link || ""}
                        onChange={onNewMemberChange}
                        isOnlyReadable={true}
                        actionButton={<CopyInviteLinkButton link={link} />}
                        inputContainerCSS={[customInviteLinkInputContainerCSS, externalInputCSS]}
                    />
                </div>
            </div>
        </div>
    </>;
};

const mainContainerCSS = css`
	margin-top: ${47 / PIXEL_REM_RATIO}rem;
	width: 100%;
`;

const inviteLinkContainerCSS = css`
	margin-top: ${54 / PIXEL_REM_RATIO}rem;
`;

const customInviteLinkInputContainerCSS = css`
	width: ${390 / PIXEL_REM_RATIO}rem;
`;

const inviteExternalMembersContainerCSS = css`
	display: flex;
	margin-top: ${54 / PIXEL_REM_RATIO}rem;
`;

const inviteBirdImageContainerCSS = css`
	width: ${88 / PIXEL_REM_RATIO}rem;
	height: ${88 / PIXEL_REM_RATIO}rem;
	img {
		width: 100%;
		height: 100%;
	}
`;

const externalCardContentCSS = css`
	margin-left: ${20 / PIXEL_REM_RATIO}rem;
`;
const externalCardHeadingCSS = css`
	font-family: Gilroy;
	font-weight: 800;
	color: #323232;
	font-size: ${18 / PIXEL_REM_RATIO}rem;
`;

const externalCardDescCSS = css`
	margin-top: ${6 / PIXEL_REM_RATIO}rem;
	font-size: ${14 / PIXEL_REM_RATIO}rem;
	font-weight: 500;
	font-family: Gilroy;
	color: #323232;
`;

const externalCardInputCSS = css`
	margin-top: ${20 / PIXEL_REM_RATIO}rem;
`;

export { InviteMembersContainer };
