import React, { ReactChildren, useEffect, useRef, useState } from "react";
import { css } from "@emotion/core";
import DownIcon from "../../../../public/svg/settings/down.svg";
import { PIXEL_REM_RATIO } from "@constants/other";
import { Conditional } from "@ui/components/common/Conditional";

interface iAccordionProps {
	children: ReactChildren;
	containerCSS?: any;
}
interface iAccordionTabProps {
	title: string;
	children: ReactChildren;
}
const AccordionTab = (props: iAccordionTabProps) => {
	const [isActive, setIsActive] = useState(false);
	const { title, children } = props;
	const _panelRef = useRef(null);

	useEffect(() => {
		setIsActive(true);
	}, []);

	const toggleTab = () => {
		setIsActive(!isActive);
	};

	return (
		<div css={accordionTabContainerCSS}>
			<div css={tabHeaderCSS} onClick={toggleTab}>
				<span css={tabHeaderTitleCSS}>{title}</span>
				<Conditional If={isActive}>
					<span css={[tabHeaderActionIconCSS, invertIconCSS]}>
						<DownIcon />
					</span>
				</Conditional>
				<Conditional If={!isActive}>
					<span css={tabHeaderActionIconCSS}>
						<DownIcon />
					</span>
				</Conditional>
			</div>
			<div
				css={tabHeaderPanelCSS}
				className={isActive ? "active-panel" : ""}
				style={{
					maxHeight: _panelRef.current ? (_panelRef.current as any).scrollHeight : 0,
				}}
				ref={_panelRef}
			>
				{children}
			</div>
		</div>
	);
};

const accordionTabContainerCSS = css`
	margin-top: 1rem;
	.active-panel {
		height: auto !important;
	}
`;
const tabHeaderCSS = css`
	display: flex;
	padding: ${12 / PIXEL_REM_RATIO}rem ${22 / PIXEL_REM_RATIO}rem;
	border: 1px solid #c4c4c4;
	border-radius: ${4 / PIXEL_REM_RATIO}rem;
	background: #fff;
	align-items: center;
	cursor: pointer;
	opacity: 0.7;

	&:hover {
		opacity: 1;
	}
`;
const tabHeaderPanelCSS = css`
	height: 0px !important;
	overflow: hidden;
`;
const tabHeaderTitleCSS = css`
	font-family: Gilroy;
	font-size: ${14 / PIXEL_REM_RATIO}rem;
	color: #323232;
	font-weight: 700;
`;
const tabHeaderActionIconCSS = css`
	margin-left: auto;
`;
const invertIconCSS = css`
	transform: rotate(180deg);
`;

const Accordion = (props: iAccordionProps) => {
	const { children, containerCSS } = props;

	return <div css={containerCSS}>{children}</div>;
};

export { Accordion, AccordionTab };
