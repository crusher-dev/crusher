import { css } from "@emotion/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useAtom } from "jotai";

import { Dropdown } from "../../../../../dyson/src/components/molecules/Dropdown";
import { UserIcon, UserImage } from "dyson/src/components/atoms/userimage/UserImage";

import { MenuItem } from "@components/molecules/MenuItem";
import { resolvePathToBackendURI } from "@utils/common/url";

import { teamAtom } from "../../../store/atoms/global/team";
import { userAtom } from "../../../store/atoms/global/user";
import { backendRequest } from "@utils/common/backendRequest";
import { Dolphin } from "./icont";

const userDropdownItems = [
	{
		leftLabel: "Settings",
		rightLabel: "",
		link: "/settings/project/basic",
		target: "",
	},
	{
		leftLabel: "Changelog",
		rightLabel: "",
		link: "https://github.com/crusherdev/crusher/releases",
		target: "_blank",
	},
	{
		leftLabel: "Help & Support",
		rightLabel: "",
		link: "https://docs.crusher.dev/docs/references/contact-us",
		target: "_blank",
	},
	{
		leftLabel: "Github",
		rightLabel: "",
		link: "https://github.com/crusherdev/crusher",
		target: "_blank",
	},
];
function DropdownContent() {
	const router = useRouter();
	return (
		<div className={"flex flex-col justify-between h-full"}>
			<div>
				{userDropdownItems.map(({ leftLabel, rightLabel, link, target }) => (
					<Link href={link}>
						<a href={link} target={target} className={"close-on-click"}>
							<MenuItem label={leftLabel} rightLabel={rightLabel} />
						</a>
					</Link>
				))}
			</div>

			<div className={"mt-16"}>
				<hr
					css={css`
						color: #1a1d26;
					`}
				/>
				<MenuItem
					showHighlighted={true}
					onClick={async () => {
						await backendRequest(resolvePathToBackendURI("/users/actions/logout"));
						router.push("/login");
					}}
					label={"Logout"}
					rightLabel={""}
				/>
			</div>
		</div>
	);
}

function DropdownIcon(props) {
	return (
		<svg width={9} height={7} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M4.5 6.109a.623.623 0 01-.446-.188L.184 1.986a.649.649 0 010-.907.623.623 0 01.892 0L4.5 4.561 7.924 1.08a.623.623 0 01.891 0 .648.648 0 010 .907L4.945 5.92a.623.623 0 01-.445.188z"
				fill="#CECECE"
			/>
		</svg>
	);
}

export function UserNTeam() {
	const [user] = useAtom(userAtom);
	const [team] = useAtom(teamAtom);

	return (
		<div className={"flex justify-between leading-none relative items-center px-12 pl-8"} css={userCard}>
			<div className={"flex"} css={orgName}>
				<div css={nameInitial} className={"flex items-center justify-center uppercase font-700 mr-4"}>
					<Dolphin height={16} width={16} css={icon} />
				</div>
				<div>
					<div className={"font-cera mb-4 font-600 flex items-center"} css={name}>
						<span className="mr-6">{team.name.substr(0, 8)}</span>

						<DropdownIcon className="mb-1" />
					</div>
					<div css={description} className={"font-400 leading-none"}>
						{team.plan.toLowerCase()} plan
					</div>
				</div>
			</div>

			<Dropdown
				component={<DropdownContent />}
				dropdownCSS={css`
					height: 256rem;
				`}
			>
				<div className={"flex items-center pr"}>
					<UserIcon initial={user.name[0]} />
				</div>
			</Dropdown>
		</div>
	);
}

export function MenuItemHorizontal({ children, selected, ...props }) {
	return (
		<div css={[menuLink, selected && menuSelected]} {...props}>
			{children}
		</div>
	);
}

const icon = css`
	margin-top: -4rem;
`;

const menuLink = css`
	box-sizing: border-box;
	border-radius: 6rem;
	line-height: 13rem;
	height: 30rem;
	padding: 0 12rem;
	color: rgba(255, 255, 255, 0.8);
	font-weight: 600;
	display: flex;
	align-items: center;

	:hover {
		background: rgba(255, 255, 255, 0.05);
	}
`;

const menuSelected = css`
	background: rgba(255, 255, 255, 0.05);
`;

const orgName = css`
	padding: 8rem 12rem 6rem 8rem;
	border-radius: 6px;
	:hover {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 6px;
	}
`;
const userCard = css`
	border-bottom: 0.5px solid #1b1b1b;
	min-height: 56rem;
`;

const nameInitial = css`
	line-height: 1;
	font-size: 12rem;
	width: 22rem;
	height: 22rem;
	border-radius: 4px;
	// background: #e6ff9d;
	// color: #46551b;
`;

const name = css`
	font-size: 14rem;
	color: #cecece;
`;

const description = css`
	font-size: 13rem;
	color: rgba(255, 255, 255, 0.32);
`;
