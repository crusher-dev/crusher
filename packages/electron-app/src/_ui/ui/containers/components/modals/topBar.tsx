import { Conditional } from "@dyson/components/layouts";
import { css } from "@emotion/react";
import { CrossIcon } from "../../../../constants/old_icons";

interface iModalTopBarProps {
	title: string;
	actions?: any;
	desc: string;
	closeModal: () => void;
	className?: string;
}

const ModalTopBar = (props: iModalTopBarProps) => {
	const { title, desc, className, actions, closeModal } = props;

	return (
		<div id="top-bar" className={className} css={topBarStyle}>
			<div id="left-section" style={topLeftSectionStyle}>
				<div className="heading_container" style={headingContainerStyle}>
					<div className={"heading_title"} css={headingStyle}>
						{title}
					</div>
					<Conditional showIf={!!desc}>
						<div className={"heading_sub_title"} css={subHeadingStyle}>
							{desc}
						</div>
					</Conditional>
				</div>
			</div>
			<div css={actionButtonContainerStyle}>
				{actions || ""}
				<div id="close-button" onClick={closeModal} css={closeButtonStyle}>
					<CrossIcon
						css={css`
							width: 10rem;
						`}
						color={"#ffffff1a"}
					/>
				</div>
			</div>
		</div>
	);
};

const actionButtonContainerStyle = css`
	display: flex;
	align-items: center;
	gap: 16rem;
`;

const topBarStyle = css`
	display: flex;
	justify-content: space-between;
	margin-bottom: 1rem;
	padding: 28rem ;
`;

const topLeftSectionStyle = {
	display: "flex",
};
const headingContainerStyle = {};
const headingStyle = css`
    display: flex;
	font-family: Cera Pro;
    font-size: 17rem;
    
    font-weight: 600;

	marginBottom: 0,
	color: #FFFFFF;
`;
const subHeadingStyle = css`
	font-size: 14rem;
	color: #ffffff;
	font-family: Cera Pro;
	color: rgba(255, 255, 255, 0.4);
	margin-top: 12rem;
`;
const closeButtonStyle = css`
	margin-bottom: auto;
`;

export { ModalTopBar };
