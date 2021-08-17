import { css } from "@emotion/react";
import { UserImage } from "dyson/src/components/atoms/userimage/UserImage";
import { userAtom } from "../../../store/atoms/global/user";
import { useAtom } from "jotai";
import { teamAtom } from "../../../store/atoms/global/team";
import { useState } from "react";
import { resolvePathToBackendURI } from "@utils/url";
import { useRouter } from "next/router";
import { MenuItem } from "@components/molecules/MenuItem";
import { Dropdown } from "../../../../../dyson/src/components/molecules/Dropdown";

function DropdownContent() {
	const router = useRouter();
	return (
		<div className={"flex flex-col justify-between h-full"}>
			<div>
				{[0, 0, 0, 0, 0].map((item) => (
					<MenuItem label={"New Profile"} rightLabel={"Ctrl + A"} />
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
					onClick={() => {
						router.push(resolvePathToBackendURI("/users/actions/logout"));
					}}
					label={"Logout"}
					rightLabel={"Ctrl + A"}
				/>
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
						{team.name.substr(0, 11)}
					</div>
					<div css={description} className={"font-500 leading-none capitalize"}>
						{team.plan.toLowerCase()}
					</div>
				</div>
			</div>

			<Dropdown
				component={<DropdownContent />}
				dropdownCSS={css`
					height: 276rem;
				`}
			>
				<div className={"flex items-center pr"}>
					<UserImage url={user?.avatar ?? "/assets/img/dashboard/default_user_image.png"} />
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
