import { css } from "@emotion/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { useAtom } from "jotai";

import { UserIcon, UserImage } from "dyson/src/components/atoms/userimage/UserImage";

import { MenuItem } from "@components/molecules/MenuItem";
import { resolvePathToBackendURI } from "@utils/common/url";

import { teamAtom } from "../../../store/atoms/global/team";
import { userAtom } from "../../../store/atoms/global/user";
import { backendRequest } from "@utils/common/backendRequest";
import { Dolphin, TopDown } from "./icont";
import { HoverCard } from "dyson/src/components/atoms/tooltip/Tooltip1";

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

function Logout(props) {
	return (
		<svg
			width={14}
			height={14}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M9.188 5.25V3.062A1.313 1.313 0 007.875 1.75h-3.5a1.313 1.313 0 00-1.313 1.313v7.874a1.313 1.313 0 001.313 1.313h3.5a1.313 1.313 0 001.313-1.313V8.75M7 5.25L5.25 7m0 0L7 8.75M5.25 7h7.438"
				stroke="#868686"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}


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

			<div className={"mt-66	"}>
				<hr
					css={css`
						color: #1a1d26;
					`}
				/>
				<MenuItem
					onClick={async () => {
						await backendRequest(resolvePathToBackendURI("/users/actions/logout"));
						router.push("/login");
					}}
					label={(
						<div className="flex items-center">
							<Logout className="mr-6" /><span>Logout</span>
						</div>
					)}
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
				<div css={nameInitial} className={"flex items-center justify-center uppercase font-700 mr-10"}>
					<Dolphin height={20} width={20} css={icon} />
				</div>
				<div className="flex items-center pb-2">
					<div className={"font-cera mb-1 font-600 flex items-center"} css={name}>
						<span className="mr-6">{team.name.substr(0, 8)}</span>
						<TopDown className="mb-1" />
					</div>
				</div>
			</div>


			<HoverCard wrapperCSS={userDropdownCSS} content={<DropdownContent />} placement="bottom" type="click" padding={8} offset={0}>

				<div className={"flex items-center pr"}>
					<UserIcon initial={user.name[0]} />
				</div>
			</HoverCard>

		</div>
	);
}

const userDropdownCSS = css`
	min-height: 400rem;
`

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
		background: rgba(255, 255, 255, 0.07);
		border-radius: 8px;
		.expand{
			fill: #fff;
		}
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
letter-spacing: 0.02em;

color: #CECECE;
`;

const description = css`
	font-size: 13rem;
	color: rgba(255, 255, 255, 0.32);
`;
