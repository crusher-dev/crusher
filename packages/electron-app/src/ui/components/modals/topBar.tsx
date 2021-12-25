import { css } from "@emotion/react";
import { BrowserIcon, CloseModalIcon } from "../../icons";

interface iModalTopBarProps {
	title: string;
	desc: string;
	closeModal: () => void;
}

const ModalTopBar = (props: iModalTopBarProps) => {
	const { title, desc, closeModal } = props;

	return (
		<div id="top-bar" css={topBarStyle}>
			<div id="left-section" style={topLeftSectionStyle}>
				<div className="heading_container" style={headingContainerStyle}>
					<div className={"heading_title"} css={headingStyle}>
						{title}
					</div>
					<div className={"heading_sub_title"} css={subHeadingStyle}>
						{desc}
					</div>
				</div>
			</div>
			<div id="close-button" onClick={closeModal} style={closeButtonStyle}>
				<CloseModalIcon color={"#ffffff1a"} height={14} width={14} />
			</div>
		</div>
	);
};

const topBarStyle = css`
	display: flex;
	justify-content: space-between;
	margin-bottom: 1rem;
	padding: 26rem 34rem;
`;

const topLeftSectionStyle = {
	display: "flex",
};
const headingContainerStyle = {
};
const headingStyle = css`
	font-family: Cera Pro;
    font-size: 17rem;
    font-style: normal;
    font-weight: 600;

	marginBottom: 0,
	color: #FFFFFF;
`;
const subHeadingStyle = css`
	font-style: normal;
	font-size: 14rem;
	color: #FFFFFF;
	font-family: Cera Pro;
	color: rgba(255, 255, 255, 0.4);
	margin-top: 13rem;
`;
const closeButtonStyle = {
};


export { ModalTopBar };
