import React from "react";
import { css } from "@emotion/react";
import { CreateIcon, PlayV2Icon } from "../../icons";
import { Link } from "../../layouts/modalContainer";
import { Button } from "@dyson/components/atoms/button/Button";
import { shell } from "electron";
import { useNavigate } from "react-router-dom";
import { goFullScreen } from "../../commands/perform";

export const ActionButton = ({ title, className, onClick }) => {
	return (
		<Button
			id={"verify-save-test"}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				onClick(e);
			}}
			className={`${className}`}
			bgColor="tertiary-outline"
			css={saveButtonStyle}
		>
			<span>{title}</span>
		</Button>
	);
};

const saveButtonStyle = css`
	width: 92rem;
	height: 30rem;
	background: #a966ff;
	border-radius: 6rem;
	font-family: Gilroy;
	font-style: normal;
	font-weight: 600;
	font-size: 14rem;
	line-height: 17rem;
	border: 0.5px solid transparent;
	color: #ffffff;
	:hover {
		border: 0.5px solid #8860de;
	}
`;

export const DocsGoBackActionBar = ({ buttonTitle, buttonCallback }) => {
	const openDocs = React.useCallback(() => {
		shell.openExternal("https://docs.crusher.dev");
	}, []);

	return (
		<div css={actionsContainerStyle}>
			<Link onClick={openDocs}>Docs</Link>
			<ActionButton title={buttonTitle} onClick={buttonCallback} css={createButtonStyle} />
		</div>
	);
};

export const CreateFirstTest = ({}) => {
	const navigate = useNavigate();

	const handleCreateTest = React.useCallback(() => {
		navigate("/recorder");
		goFullScreen();
	}, []);
	return (
		<div css={containerStyle}>
			<div css={contentContainerStyle}>
				<CreateIcon css={createIconStyle} />
				<div css={contentHeadingStyle}>Create your first test</div>
				<div css={contentDescriptionStyle}>Start with low-code browser to create a test</div>
			</div>
			<DocsGoBackActionBar buttonTitle={"Create"} buttonCallback={handleCreateTest} />

			<div css={watch}>
				<PlayV2Icon /> Watch video
			</div>
		</div>
	);
};

const watch = css`
	font-size: 14rem;
	display: flex;
	align-items: center;

	column-gap: 8rem;
	align-self: center !important;
	justify-self: end;

	margin-top: 100rem;

	:hover {
		color: #a966ff;
		text-decoration: underline;
		cursor: pointer;
	}
`;

const createButtonStyle = css`
	margin-left: 12rem;
`;

const containerStyle = css`
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
	margin-top: -2rem;
`;
const actionsContainerStyle = css`
	display: flex;
	margin-top: 20rem;
	justify-content: center;
	align-items: center;
`;

const contentContainerStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
`;
const createIconStyle = css`
	width: 28rem;
	height: 28rem;
`;
const contentHeadingStyle = css`
	margin-top: 28rem;
	font-family: Cera Pro;
	font-style: normal;
	font-weight: 900;
	font-size: 18rem;
	text-align: center;
	letter-spacing: 0.1px;
	color: #ffffff;
`;
const contentDescriptionStyle = css`
	margin-top: 10rem;

	font-family: Gilroy;
	font-style: normal;
	font-weight: 400;
	font-size: 14rem;
	text-align: center;
	letter-spacing: 0.2px;
	color: rgba(255, 255, 255, 0.64);
`;
