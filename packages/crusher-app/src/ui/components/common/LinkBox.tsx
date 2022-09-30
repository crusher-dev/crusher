import { css } from "@emotion/react";
import React from "react";

import { sendSnackBarEvent } from "@utils/common/notify";

const LinkBox = ({ value, children, ...props }) => {
	const ref = React.useRef(null);

	const handleOnClick = () => {
		ref.current.select();
		document.execCommand("copy");
		sendSnackBarEvent({ type: "success", message: `Copied to clipbaord!` });
	};
	return (
		<div css={linkContainerStyle} onClick={handleOnClick} {...props}>
			<input
				ref={ref}
				css={css`
					background: transparent;
					border: none;
					outline: none;
					width: 100%;
				`}
				type={"text"}
				value={value}
			/>
			{children}
		</div>
	);
};

const linkContainerStyle = css`
	background: rgba(0, 0, 0, 0.2);
	border: 1px solid rgba(255, 255, 255, 0.13);
	border-radius: 6px;
	padding: 12rem 18rem;

	font-family: "Gilroy";
	font-style: normal;
	font-weight: 400;
	font-size: 11rem;

	color: #888888;
`;

export { LinkBox };
