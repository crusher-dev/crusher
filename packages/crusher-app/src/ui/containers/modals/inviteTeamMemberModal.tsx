import { Modal } from "@ui/containers/modals/modal";
import React from "react";
import { InviteMembersContainer } from "@ui/containers/settings/inviteMembersContainer";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";

interface iProps {
	onClose: any;
}

const INVITE_LINK = "https://app.crusher.dev/invite/user/f321fasgc32ase";

const InviteTeamMemberModal = (props: iProps) => {
	const { onClose } = props;

	return (
		<Modal
			heading={"Invite team member"}
			subHeading={"to crusher"}
			illustration={"/assets/img/illustration/create_project_illustration.png"}
			onClose={onClose}
			topAreaCSS={topAreaCSS}
			mainContainerCSS={containerCSS}
		>
			<div css={bodyContainerCss}>
				<InviteMembersContainer
					externalInputCSS={externalInputCSS}
					link={INVITE_LINK}
				/>
			</div>
		</Modal>
	);
};

const containerCSS = css`
	width: ${648 / PIXEL_REM_RATIO}rem;
`;

const externalInputCSS = css`
	width: ${300 / PIXEL_REM_RATIO}rem;
`;

const topAreaCSS = css`
	background: linear-gradient(360deg, #8793ff 0%, #a36bff 100%);
	border-bottom: 2px solid #0a1215;
`;

const bodyContainerCss = css`
	display: flex;
	flex-direction: column;
	label {
		font-family: Gilroy;
		font-weight: bold;
		color: #2b2b39;
		font-size: 1rem;
	}
	min-height: 21rem;
`;

export { InviteTeamMemberModal };
