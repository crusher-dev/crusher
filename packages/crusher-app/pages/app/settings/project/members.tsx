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
import { MemberFilterTableList } from "@ui/components/settings/MemberFilterTableList";
import { iMember } from "@interfaces/redux/settings";
import { InviteTeamMemberModal } from "@ui/containers/modals/inviteTeamMemberModal";
import { Conditional } from "@ui/components/common/Conditional";
import ReactDOM from "react-dom";
import { _getTeamMembers } from "@services/v2/team";
import { setTeamMembers } from "@redux/actions/team";
import { iMemberInfoResponse } from "@crusher-shared/types/response/membersInfoResponse";
import { useSelector } from "react-redux";
import { getTeamMembers } from "@redux/stateUtils/team";

interface iButtonProps {
	onClick: () => void;
}

const InviteMemberButton = (props: iButtonProps) => {
	const { onClick } = props;
	return (
		<div css={buttonCSS} onClick={onClick}>
			Invite Member
		</div>
	);
};

const buttonCSS = css`
	background: #5286ff;
	border-radius: ${4 / PIXEL_REM_RATIO}rem;
	padding: ${8 / PIXEL_REM_RATIO}rem ${8 / PIXEL_REM_RATIO}rem;
	min-width: ${180 / PIXEL_REM_RATIO}rem;
	font-size: ${16 / PIXEL_REM_RATIO}rem;
	font-weight: 600;
	font-family: Gilroy;
	color: #fff;
	text-align: center;
`;

const ProjectIntegrationSettings = () => {
	const members = useSelector(getTeamMembers);
	const [roleSort, setRoleSort] = useState(null as string | null);
	const [showMemberModal, setShowMemberModal] = useState(false);

	const onToggleRoleSort = () => {
		if (roleSort === "DESC") {
			setRoleSort("ASC");
		} else {
			setRoleSort("DESC");
		}
	};

	const closeTeamMemberModal = useCallback(() => {
		ReactDOM.render(null as any, document.getElementById("overlay"));
		setShowMemberModal(false);
	}, []);

	const onInviteMember = useCallback(() => {
		setShowMemberModal(true);
	}, []);

	return (
		<>
			<SettingsContent contentCSS={settingContentCSS}>
				<SettingsContentHeader
					title={"Team members"}
					desc={"List of all team members in current project"}
					button={<InviteMemberButton onClick={onInviteMember} />}
				/>
				<div css={mainContainerCSS}>
					<MemberFilterTableList
						onToggleRoleSort={onToggleRoleSort}
						filterSort={roleSort}
						members={Object.values(members)}
					/>
				</div>
			</SettingsContent>
			<Conditional If={showMemberModal}>
				<InviteTeamMemberModal
					onClose={closeTeamMemberModal}
				></InviteTeamMemberModal>
			</Conditional>
		</>
	);
};

const settingContentCSS = css`
	width: ${720 / PIXEL_REM_RATIO}rem;
`;

const mainContainerCSS = css`
	margin-top: ${47 / PIXEL_REM_RATIO}rem;
	width: 100%;
	height: ${547 / PIXEL_REM_RATIO}rem;
`;

ProjectIntegrationSettings.getInitialProps = async (ctx: any) => {
	const { req, res, store } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}

		await _getTeamMembers(headers).then((members: Array<iMemberInfoResponse>) => {
			store.dispatch(setTeamMembers(members));
		});

		return {};
	} catch (ex) {
		redirectToFrontendPath("/404", res);
		return null;
	}
};

export default WithSession(WithSettingsLayout(ProjectIntegrationSettings));
