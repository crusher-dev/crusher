import React, { useCallback, useState } from 'react';
import { css } from "@emotion/core";
// @ts-ignore
import OutsideClickHandler from "react-outside-click-handler";
import AddDropdownSVG from "../../../../public/svg/sidebarSettings/addDropdown.svg";
import { resolvePathToBackendURI } from "@utils/url";
import Link from "next/link";

import {CreateProjectModal} from "@ui/containers/modals/createProjectModal";

export const SidebarTeamDropdown = ({ onOutsideClick, onAddProjectCallback }) => {

	return (
		<OutsideClickHandler onOutsideClick={onOutsideClick}>
			<ul css={settingsDropdownStyle}>
				<li style={{ display: "flex", alignItems: "center" }} >
					<AddDropdownSVG style={{ marginRight: "1rem" }} />
					<span>Add team member</span>
				</li>
				<li style={{ display: "flex", alignItems: "center" }}  onClick={onAddProjectCallback}>
					<AddDropdownSVG style={{ marginRight: "1rem" }} />
					<span>Add Project</span>
				</li>
				<li>Manage Billing/Plan</li>
				<li>Manage Payment</li>
				<li>Get Support</li>
				<Link href={resolvePathToBackendURI("/user/logout")}>
					<li>Logout</li>
				</Link>
			</ul>
		</OutsideClickHandler>
	);
}

const settingsDropdownStyle = css`
	position: absolute;
	background: #fff;
	border: 1px solid #cdd0db;
	color: black;
	right: 1.25rem;
	top: 3.5rem;
	min-width: 14.3rem;
	background: #ffffff;
	border: 1px solid #cdd0db;
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
