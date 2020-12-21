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

const DUMMY_MEMBERS: Array<iMember> = [
	{
		id: 1,
		name: "Utkarsh Dixit",
		role: "Admin",
		email: "utkarshdix02@gmail.com",
	},
	{
		id: 1,
		name: "Himanshu Dixit",
		role: "Admin",
		email: "hudixt@gmail.com",
	},
	{
		id: 1,
		name: "Aastha Mathur",
		role: "Member",
		email: "aastha.mathur@gmail.com",
	},
	{
		id: 1,
		name: "Elon Musk",
		role: "Admin",
		email: "elon.musk@spacex.com",
	},
	{
		id: 1,
		name: "Aakash Goel",
		role: "Member",
		email: "aakash.goel@headout.com",
	},
	{
		id: 1,
		name: "Vikram Jeet Singh",
		role: "Admin",
		email: "vikram@headout.com",
	},
];

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
	const [roleSort, setRoleSort] = useState(null as string | null);

	const onToggleRoleSort = () => {
		if (roleSort === "DESC") {
			setRoleSort("ASC");
		} else {
			setRoleSort("DESC");
		}
	};

	const onInviteMember = useCallback(() => {
		console.log("Opening invite member modal");
	}, []);

	return (
		<SettingsContent>
			<SettingsContentHeader
				title={"Team members"}
				desc={"List of all team members in current project"}
				button={<InviteMemberButton onClick={onInviteMember} />}
			/>
			<div css={mainContainerCSS}>
				<MemberFilterTableList
					onToggleRoleSort={onToggleRoleSort}
					filterSort={roleSort}
					members={DUMMY_MEMBERS}
				/>
			</div>
		</SettingsContent>
	);
};

const mainContainerCSS = css`
	margin-top: ${47 / PIXEL_REM_RATIO}rem;
	width: 100%;
	height: ${547 / PIXEL_REM_RATIO}rem;
`;

ProjectIntegrationSettings.getInitialProps = async (ctx: any) => {
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

export default WithSession(WithSettingsLayout(ProjectIntegrationSettings));
