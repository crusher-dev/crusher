import React from "react";
import { css } from "@emotion/core";
import OutsideClickHandler from "react-outside-click-handler";
import AddIcon from "../../../../public/svg/sidebarSettings/addDropdown.svg";
import { resolvePathToBackendURI } from "@utils/url";
import { Conditional } from "@ui/components/common/Conditional";
import { redirectToBackendURI } from "@utils/router";

interface iListItemProps {
	title: string;
	icon?: any;
	onClick?: () => void;
}
export const ListItem = (props: iListItemProps) => {
	const { title, icon: Icon, onClick } = props;

	return (
		<li css={addItemContainerCSS} onClick={onClick}>
			<Conditional If={Icon}>
				<Icon />
			</Conditional>
			<span css={addItemTextCSS}>{title}</span>
		</li>
	);
};

interface iSidebarTeamDropdownProps {
	onOutsideClick: () => void;
	onShowInviteTeamMemberModal: any;
	onAddProjectCallback: () => void;
}

export const SidebarTeamDropdown = (props: iSidebarTeamDropdownProps) => {
	const { onOutsideClick, onShowInviteTeamMemberModal, onAddProjectCallback } = props;

	const logoutUser = () => {
		redirectToBackendURI(resolvePathToBackendURI("/user/logout"));
	};

	return (
		<OutsideClickHandler onOutsideClick={onOutsideClick}>
			<ul css={settingsDropdownCSS}>
				<ListItem title={"Add team member"} icon={AddIcon} onClick={onShowInviteTeamMemberModal} />
				<ListItem title={"Add project"} icon={AddIcon} onClick={onAddProjectCallback} />
				<ListItem title={"Get support"} />
				<ListItem title={"Logout"} onClick={logoutUser} />
			</ul>
		</OutsideClickHandler>
	);
};

const addItemContainerCSS = css`
	display: flex;
	align-items: center;
`;
const addItemTextCSS = css`
	margin-left: 1rem;
`;
const settingsDropdownCSS = css`
	position: absolute;
	border: 1px solid #cdd0db;
	background: #fff;
	color: black;
	right: 1.25rem;
	top: 3.5rem;
	min-width: 14.3rem;
	box-sizing: border-box;
	box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
	border-radius: 4px;
	padding: 0.75rem 0;
	li {
		color: #303030;
		cursor: pointer;
		min-width: 12.5rem;
		font-family: Gilroy;
		font-weight: 500;
		font-size: 0.9rem;
		line-height: 0.86rem;
		padding: 0.7275rem 0.975rem;
		:hover {
			background: #f8f8f8;
		}
	}
	z-index: 99;
`;
