import { css } from "@emotion/react";
import { ReactElement } from "react";
import { Conditional } from "../Conditional/Conditional";
import { CloseSVG } from "../../icons/CloseSVG";

type TransparentOverlayProps = {
	children: ReactElement;
	onClose?: Function;
	lightOverlay?: boolean;
} & Record<any, any>;

export function OverlayTransparent({ children, onClose, lightOverlay }: TransparentOverlayProps) {
	return (
		<div
			className={"flex justify-between leading-none relative"}
			css={[overlay, lightOverlay ? lightOverlayStyle : null]}
			onClick={(e) => {
				e.stopPropagation();
				e.preventDefault();
			}}
		>
			<Conditional showIf={!!onClose}>
				<div css={closeIcon}>
					<CloseSVG onClick={onClose} />
				</div>
			</Conditional>
			{children}
		</div>
	);
}

const overlay = css`
	background: rgba(15, 14, 14, 0.95);
	width: 100vw;
	height: 100vh;
	position: fixed;
	z-index: 100000;
	top: 0;
	left: 0;
`;

const lightOverlayStyle = css`
	background: rgba(0, 0, 0, 0.88);
`;

const closeIcon = css`
	position: absolute;
	top: 44rem;
	right: 64rem;
`;
