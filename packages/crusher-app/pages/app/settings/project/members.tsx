import React, { useCallback, useState } from "react";
import { css } from "@emotion/core";
import { cleanHeaders } from "@utils/backendRequest";
import { redirectToFrontendPath } from "@utils/router";
import withSession from "@hoc/withSession";
import { WithSettingsLayout } from "@hoc/v2/withSettingLayout";
import { SettingsContent } from "@ui/components/settings/SettingsContent";
import { SettingsContentHeader } from "@ui/components/settings/SettingsContentHeader";
import { PIXEL_REM_RATIO } from "@constants/other";
import { MemberFilterTableList } from "@ui/components/settings/MemberFilterTableList";
import { InviteTeamMemberModal } from "@ui/containers/modals/inviteTeamMemberModal";
import { Conditional } from "@ui/components/common/Conditional";
import ReactDOM from "react-dom";
import { iMemberInfoResponse } from "@crusher-shared/types/response/membersInfoResponse";
import { useSelector } from "react-redux";
import { getCookies } from "@utils/cookies";
import { _getProjectMembers } from "@services/projects";
import { setProjectMembers } from "@redux/actions/project";
import { getProjectMembers, getSelectedProject } from "@redux/stateUtils/projects";

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

const ProjectMembersSettings = () => {
	const selectedProject = useSelector(getSelectedProject);
	const members = useSelector(getProjectMembers(selectedProject));
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
					<MemberFilterTableList onToggleRoleSort={onToggleRoleSort} filterSort={roleSort} members={Object.values(members)} />
				</div>
			</SettingsContent>
			<Conditional If={showMemberModal}>
				<InviteTeamMemberModal onClose={closeTeamMemberModal}></InviteTeamMemberModal>
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

ProjectMembersSettings.getInitialProps = async (ctx: any) => {
	const { req, res, store } = ctx;
	try {
		let headers;
		if (req) {
			headers = req.headers;
			cleanHeaders(headers);
		}

		const cookies = getCookies(req);
		const selectedProject = cookies.selectedProject ? JSON.parse(cookies.selectedProject) : null;

		await _getProjectMembers(selectedProject, headers).then((members: iMemberInfoResponse[]) => {
			store.dispatch(setProjectMembers(selectedProject, members));
		});

		return {};
	} catch {
		redirectToFrontendPath("/404", res);
		return null;
	}
};

export default withSession(WithSettingsLayout(ProjectMembersSettings));
