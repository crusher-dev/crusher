import ReactDOM from "react-dom";
import { css, SerializedStyles } from "@emotion/react";
import { useFloating, shift, autoPlacement, offset } from "@floating-ui/react-dom";
import React, { ReactElement, useState, useEffect, useMemo, useRef, SyntheticEvent, useCallback } from "react";

export type TooltipWrapperProps = {
	type?: "click" | "hover";
	placement: "top-start" | "top-end" | "right-start" | "right-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end" | "left" | "bottom" | "top" | "right";
	autoHide?: boolean;
	callback?: Function;
	content: ReactElement;
	children: any;
	padding: number;
	offset: number;
	wrapperCSS?: SerializedStyles;
	css?: SerializedStyles;
} & React.DetailedHTMLProps<any, any>;

export const TooltipBox = ({ children, className = "tooltip-box", el = "div" }) => {
	const [container] = React.useState(() => {
		return document.createElement(el);
	});

	React.useEffect(() => {
		container.classList.add(className);
		document.body.appendChild(container);
		return () => {
			document.body.removeChild(container);
		};
	}, []);

	return ReactDOM.createPortal(children, container);
};

/**
 * Unified tolltip component for Dyson UI system
 */
export const Tooltip: React.FC<TooltipWrapperProps> = ({ children, autoHide = "true", placement, type="click", content, padding = 0, ...props }) => {
	const [show, setShow] = useState(false);
	const [computedStyle, setComputedStyle] = useState(null);
	const { offset: offsetWrapper = 5 } = props;
	const { x, y, reference, floating, update, strategy, refs } = useFloating({
		placement,
		strategy: "fixed",
		middleware: [shift(), offset(offsetWrapper)],
	});
	const { css, wrapperCSS, callback } = props;

	const ref = useRef();

	const eventListener = () => {
		if (type === "hover") {
			return {
				onMouseOver: () => {
					setShow(true);
				},
				onMouseLeave: (e) => {
					const isElement = e.relatedTarget instanceof Element;
					const movedToToolip = (isElement && refs.floating?.current?.contains(e.relatedTarget)) || refs.floating.current === e.relatedTarget;
					if (movedToToolip) return;
					console.log(e.relatedTarget);
					if (autoHide) {
						setShow(false);
					}
				},
			};
		}

		return {
			onClick: () => {
				setShow(true);
			},
		};
	};

	const ClonedElement = useCallback(() => {
		return React.cloneElement(children, {
			ref: reference,
			...eventListener(),
		});
	}, []);

	useEffect(() => {
		callback && callback(show);
		update();
		if (type !== "click" || autoHide === false) return;
		const handleClick = (e: SyntheticEvent) => {
			const isChildrenClick = refs.reference?.current?.contains(e.target) || refs.reference.current === e.target;
			const isTooltipClick = refs.floating?.current?.contains(e.target) || refs.floating.current === e.target;
			if (!isChildrenClick || !isTooltipClick) setShow(false);
		};
		window.addEventListener("click", handleClick, { capture: true });

		return () => {
			window.removeEventListener("click", handleClick, { capture: true });
		};
	}, [show]);

	return (
		<React.Fragment>
			<ClonedElement />
			{show && (
				<TooltipBox>
					<div
						css={[tooltipWrapper(padding), computedStyle, wrapperCSS]}
						ref={floating}
						style={{
							position: strategy,
							top: y ?? "",
							left: x ?? "",
						}}
						onMouseOver={eventListener().onMouseOver}
						onMouseLeave={eventListener().onMouseLeave}
					>
						<div css={[tooltipBox, css]}>{content}</div>
					</div>
				</TooltipBox>
			)}
		</React.Fragment>
	);
};

const tooltipWrapper = (padding) => css`
	position: fixed;
	z-index: 400;
	padding: 0px;
	-webkit-animation: fadeIn 1s;
	animation: fadeIn 0.25s;
	padding: ${padding}px;
	@-webkit-keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`;

const tooltipBox = css`
	background: #161719;
	border: 0.5px solid rgba(255, 255, 255, 0.06);
	box-shadow: 0px 4px 9px -1px rgba(44, 40, 40, 0.12);
	border-radius: 4px;
	padding: 4rem 8rem;
	font-size: 13rem;
`;

const buttonCSS = css`
	cursor: default;
	border-radius: 4rem;
	color: white;
	font-weight: 700;
	height: 32rem;
	padding: 0 12rem;
	span,
	div {
		font-size: 14rem;
	}
`;

const extraSmallButton = css`
	padding: 0 12rem;
	height: 24rem;
	font-weight: 600 !important;
	font-size: 12.5rem;
`;

const smallButton = css`
	padding: 0 12rem;
	height: 28rem;
	font-weight: 600 !important;
	font-size: 13rem;
`;

const largeButton = css`
	box-sizing: border-box;
	border: 1rem solid #4675bd;
	height: 44rem;

	font-weight: 600;
	font-size: 14rem;
	width: 348rem;
`;

const mediumButton = css`
	box-sizing: border-box;
	border: 1rem solid #4675bd;
	height: 32rem;

	font-weight: 600;
	font-size: 14rem;
	width: 182rem;
`;

const blue = css`
	background-color: #687ef2;

	:hover {
		background-color: #6173d4;
	}
`;

const danger = css`
	background-color: #aa3e5f;

	:hover {
		background-color: #c0486d;
	}
`;

const tertiaryDark = css`
	background-color: #1e242c;
	border: 1rem solid #2e3744;

	:hover {
		background-color: #1b1d1f;
		border: 1rem solid #2a2e38;
	}
`;

const tertiaryOutline = css`
	border: 1rem solid #2e3744;
	background: rgba(255, 255, 255, 0);

	:hover {
		background: rgba(255, 255, 255, 0.05);
		border: 1rem solid #2a2e38;
	}
`;

const disabledButton = css`
	background-color: #1e242c !important;
	border: 1rem solid #2e3744 !important;
`;
