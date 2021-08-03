import { css } from "@emotion/react";
import { UserImage } from "dyson/src/components/atoms/userimage/UserImage";
import { userAtom } from "../../../store/atoms/global/user";
import { useAtom } from "jotai";
import { teamAtom } from "../../../store/atoms/global/team";
import { useEffect, useRef, useState } from "react";

import { resolvePathToBackendURI } from "@utils/url";
import { ShowOnClick } from "dyson/src/components/layouts/ShowonAction/ShowOnAction";
import { useRouter } from "next/router";

function Dropdown() {
	const router = useRouter();
	return (
		<div css={dropdDown} className={"flex flex-col justify-between"}>
			<div>
				{[0, 0, 0, 0, 0].map((item) => (
					<div css={dropDownItem} className={"flex justify-between items-center px-16 py-12"}>
						<span className={"name font-500 leading-none font-cera"}>New Profile</span>
						<span className={"text-12 shortcut leading-none"}>Ctrl + A</span>
					</div>
				))}
			</div>

			<div className={"mt-16"}>
				<hr
					css={css`
						color: #1a1d26;
					`}
				/>
				<div css={dropDownItem} className={"flex justify-between items-center px-16 py-12"} onClick={() => {}}>
					<span
						className={"name font-500 leading-none font-cera"}
						onClick={() => {
							router.push(resolvePathToBackendURI("/user/logout"));
						}}
					>
						Logout
					</span>
					<span className={"text-12 shortcut leading-none"}>Ctrl + A</span>
				</div>
			</div>
		</div>
	);
}

export function UserNTeam() {
	const [user] = useAtom(userAtom);
	const [team] = useAtom(teamAtom);

	const [, setShow] = useState(false);
	return (
		<div className={"flex justify-between leading-none relative"} css={userCard}>
			<div className={"flex"} css={orgName}>
				<div css={nameInitial} className={"flex items-center justify-center uppercase font-700 pt-2 mr-14"}>
					{team.name.substr(0, 1)}
				</div>
				<div>
					<div className={"font-cera mb-4 font-600"} css={name}>
						{team.name.substr(0, 15)}
					</div>
					<div css={description} className={"font-500 leading-none capitalize"}>
						{team.plan.toLowerCase()}
					</div>
				</div>
			</div>

			<ShowOnClick component={<Dropdown />} callback={setShow.bind(this)}>
				<div className={"flex items-center pr"}>
					<UserImage url={user.avatar} />
				</div>
			</ShowOnClick>
		</div>
	);
}

const dropDownItem = css`
	.name {
		font-size: 12.5rem;
		color: #e7e7e8;
	}

	.shortcut {
		color: #7b7b7b;
	}

	:hover {
		background: rgba(32, 35, 36, 0.62);
	}

	hr {
		background: red;
	}
`;
export const dropdDown = css`
	top: calc(100% + 4rem);
	left: calc(100% - 54rem);
	position: absolute;

	width: 206.03rem;
	height: 276rem;

	background: #0f1112;
	border: 1px solid rgba(42, 47, 50, 0.8);
	box-sizing: border-box;
	box-shadow: 0 4px 15px rgba(16, 15, 15, 0.4);
	border-radius: 6px;
	padding: 8rem 0;
	z-index: 1;
`;

export function MenuItemHorizontal({ children, selected, ...props }) {
	return (
		<div css={[menuLink, selected && menuSelected]} {...props}>
			{children}
		</div>
	);
}

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
	padding: 6px 16px 6px 10px;
	:hover {
		background: #202429;
		border-radius: 4px;
	}
`;
const userCard = css``;

const nameInitial = css`
	line-height: 1;
	font-size: 12rem;
	width: 22rem;
	height: 22rem;
	border-radius: 4px;
	background: #e6ff9d;
	color: #46551b;
`;

const name = css`
	font-size: 13.2rem;
	color: #d0d0d0;
`;

const description = css`
	font-size: 12rem;
	color: #d0d0d0;
`;
