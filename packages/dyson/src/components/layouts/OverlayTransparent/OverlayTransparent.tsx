import { css } from "@emotion/react";
import { ReactElement } from "react";

export function CloseSVG({ ...props }) {
	return (
		<svg width={15} height={15} viewBox="0 0 15 15" fill="none" {...props}>
			<path
				d="M12.818 11.326L8.99 7.5l3.827-3.826a1.052 1.052 0 000-1.491 1.052 1.052 0 00-1.492 0L7.5 6.009 3.674 2.183a1.052 1.052 0 00-1.491 0 1.052 1.052 0 000 1.491L6.009 7.5l-3.826 3.826a1.052 1.052 0 000 1.492 1.052 1.052 0 001.491 0L7.5 8.99l3.826 3.827a1.052 1.052 0 001.492 0c.41-.413.41-1.081 0-1.492z"
				fill="#FCFCFC"
			/>
		</svg>
	);
}

type TransparentOverlayProps = {
	children: ReactElement;
	onClose: Function;
} & Record<any, any>;

export function OverlayTransparent({ children, onClose }: TransparentOverlayProps) {
	return (
		<div className={"flex justify-between leading-none relative"} css={overlay}>
			<div css={closeIcon}>
				<CloseSVG onClick={onClose && onClose} />
			</div>
			{children}
		</div>
	);
}

const overlay = css`
	background: rgba(15, 14, 14, 0.95);
	width: 100vw;
	height: 100vh;
	position: fixed;
	z-index: 10;
	top: 0;
	left: 0;
`;

const closeIcon = css`
	position: absolute;
	top: 44rem;
	right: 64rem;
`;
