import React from "react";
import { css } from "@emotion/core";
import { PIXEL_REM_RATIO } from "@constants/other";
import DownIcon from "../../../../public/svg/settings/down.svg";
import { iMember } from "@interfaces/redux/settings";
import { Conditional } from "@ui/components/common/Conditional";
import Avatar from "react-avatar";

interface iMemberFilterTableListProps {
	members: iMember[];
	filterSort: string | null;
	onToggleRoleSort: () => void;
}
interface iMemberItemProps {
	member: iMember;
}
interface iMemberMiniProfileProps {
	avatar?: string;
	name: string;
	email: string;
}

const MemberMiniProfile = (props: iMemberMiniProfileProps) => {
	const { name, email } = props;
	return (
		<div css={miniProfileContainerCSS}>
			<Avatar name={name} css={avatarCSS} size={"44"} maxInitials={1} />
			<div css={miniProfileContentCSS}>
				<div css={miniProfileNameCSS}>{name}</div>
				<div css={miniProfileEmailCSS}>{email}</div>
			</div>
		</div>
	);
};

const MemberItem = (props: iMemberItemProps) => {
	const { member } = props;

	return (
		<tr>
			<td>
				<MemberMiniProfile name={member.name} email={member.email} />
			</td>
			<td>
				<div className={"roleColumn"}>{member.role}</div>
			</td>
		</tr>
	);
};

const MemberFilterTableList = (props: iMemberFilterTableListProps) => {
	// Null filterSort means unordered list.
	const { members: unorderedMembers, onToggleRoleSort, filterSort } = props;

	let sortedMembers = unorderedMembers;
	if (filterSort === "DESC") {
		sortedMembers = sortedMembers.sort((a: iMember, b: iMember) => {
			return a.role < b.role ? 1 : -1;
		});
	} else if (filterSort === "ASC") {
		sortedMembers = sortedMembers.sort((a: iMember, b: iMember) => {
			return a.role < b.role ? -1 : 1;
		});
	}

	const membersOut = sortedMembers.map((member) => {
		return <MemberItem member={member} key={member.id} />;
	});

	return (
        <div css={containerCSS}>
			<table css={tableCSS}>
				<tr css={headerRowCSS}>
					<th>{membersOut.length} people in crusher</th>
					<th css={roleColumnCSS} onClick={onToggleRoleSort}>
						<span>Roles</span>
						<span className={"icon"}>
							<Conditional If={!filterSort || filterSort === "ASC"}>
								<DownIcon />
							</Conditional>
							<Conditional If={filterSort && filterSort !== "ASC"}>
								<span css={upIconContainerCSS}>
									<DownIcon />
								</span>
							</Conditional>
						</span>
					</th>
					<th></th>
				</tr>
				{membersOut}
			</table>
		</div>
    );
};

const containerCSS = css`
	border-color: #ececec;
	border-width: 1px;
	border-style: normal;
	border-radius: ${5 / PIXEL_REM_RATIO}rem;
	color: #383838;
	font-family: Gilroy;
`;

const tableCSS = css`
	width: 100%;
	border-width: 1px;
	border-color: #ececec;
	border-style: solid;
	border-collapse: collapse;
	tr {
		border-bottom-color: #ececec;
		border-bottom-width: 1px;
		border-bottom-style: double;
		border-collapse: collapse;
	}
	th,
	td {
		font-weight: 500;
		padding: ${18 / PIXEL_REM_RATIO}rem ${23 / PIXEL_REM_RATIO}rem;
		&:first-child {
			width: 70%;
		}
		border-collapse: collapse;
	}
`;

const headerRowCSS = css`
	th {
		padding: ${15 / PIXEL_REM_RATIO}rem ${23 / PIXEL_REM_RATIO}rem;
	}
`;

const miniProfileContainerCSS = css`
	display: flex;
	align-items: center;
`;

const avatarCSS = css`
	width: ${60 / PIXEL_REM_RATIO}rem;
	height: ${60 / PIXEL_REM_RATIO}rem;
	border-radius: ${30 / PIXEL_REM_RATIO}rem;
	display: flex;
	justify-content: center;
	align-items: center;
	background: #c4c4c4;
`;

const miniProfileContentCSS = css`
	margin-left: ${24 / PIXEL_REM_RATIO}rem;
`;

const miniProfileNameCSS = css`
	font-weight: bold;
`;

const miniProfileEmailCSS = css`
	margin-top: ${7 / PIXEL_REM_RATIO}rem;
	font-weight: 400;
	color: #a2a2a2;
	text-decoration-line: underline;
`;

const roleColumnCSS = css`
	cursor: pointer;
	padding: ${18 / PIXEL_REM_RATIO}rem ${4 / PIXEL_REM_RATIO}rem;
	display: flex;
	align-items: center;

	.icon {
		margin-left: ${15 / PIXEL_REM_RATIO}rem;
	}
`;

const upIconContainerCSS = css`
	svg {
		transform: rotate(180deg);
	}
`;

export { MemberFilterTableList };
