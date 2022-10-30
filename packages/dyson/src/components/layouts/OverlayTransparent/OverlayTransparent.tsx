import { css } from "@emotion/react";
import { ReactElement } from "react";
import { Conditional } from "../Conditional/Conditional";
import { CloseSVG } from "../../icons/CloseSVG";

type TransparentOverlayProps = {
	children: ReactElement;
	onClose?: Function;
} & Record<any, any>;

export function OverlayTransparent({ children, onClose, css, className = "", ...props }: TransparentOverlayProps) {
	return (
		<div
			className={`flex justify-between leading-none relative ${className}`}
			css={[overlay, css]}
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
	background: rgb(0 0 0 / 75%) !important;
	backdrop-filter: blur(3px);
	width: 100vw;
	height: 100vh;
	position: fixed;
	z-index: 100000;
	top: 0;
	left: 0;
`;



const closeIcon = css`
	position: absolute;
	top: 24rem;
	right: 40rem;
	cursor: pointer;
`;
