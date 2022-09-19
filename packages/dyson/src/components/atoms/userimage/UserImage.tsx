import React from "react";
import { css } from "@emotion/react";

export interface UserImageProps {
	/**
	 * Emotion CSS style if any
	 */
	css?: [string] | string;
	/**
	 * Optional click handler
	 */
	onClick?: () => void;
	url: string;
}

const UserDefaultProps = {};

/**
 * Crusher Text component.
 */
export const UserImage: React.FC<UserImageProps> = ({ url }) => {
	return (
		<div css={userImage}>
			<div className={"relative"}>
				<img src={url} height={"20px"} />
				<div css={dotCSS}></div>
			</div>
		</div>
	);
};

export const UserIcon: React.FC<UserImageProps> = ({ initial }: any) => {
	return (
		<div css={userInitialCSS} className="flex items-center justify-center">
			<div className="mt-2">{initial}</div>
		</div>
	);
};

UserImage.defaultProps = UserDefaultProps;

const userInitialCSS = css`

	border-radius: 8rem;
	height: 32rem;
	width: 32rem;

    border: 0.6px solid rgba(255,255,255,0.10	);
	font-weight: 700;
	color: #efefef;
	:hover {
		background: rgba(255, 255, 255, 0.07);
	}
`;

const userImage = css`

	:hover {
		background: #202429;
		border-radius: 4px;
	}

	img {
		border-radius: 200rem;
		height: 22rem;
		margin-top: -2rem;
	}
`;

const dotCSS = css`
	position: absolute;
	background: #7dda6e;
	right: 1.2px;
	bottom: 0.4px;

	width: 6px;
	height: 6px;
	border-radius: 100px;
	border: 1px solid #f8f8f8;
`;
