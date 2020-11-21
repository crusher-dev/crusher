import React from "react";
import { css } from "@emotion/core";

import AddDropdownSVG from "../../../../public/svg/sidebarSettings/addDropdown.svg";

export const SidebarTeamDropdown = ({}) => (
	<ul css={settingsDropdownStyle}>
		<li style={{ display: "flex", alignItems: "center" }}>
			<AddDropdownSVG style={{ marginRight: "1rem" }} />
			<span>Add team member</span>
		</li>
		<li style={{ display: "flex", alignItems: "center" }}>
			<AddDropdownSVG style={{ marginRight: "1rem" }} />
			<span>Add Project</span>
		</li>
		<li>Manage Billing/Plan</li>
		<li>Manage Payment</li>
		<li>Get Support</li>
		<li>Logout</li>
	</ul>
);

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
		color: #636363;
		cursor: pointer;
		min-width: 12.5rem;
		font-family: Gilroy;
		font-weight: 600;
		font-size: 0.86rem;
		line-height: 0.86rem;
		padding: 0.7275rem 0.975rem;
		:hover {
			background: #f8f8f8;
		}
	}
	z-index: 99;
`;
