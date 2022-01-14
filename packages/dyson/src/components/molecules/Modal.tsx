import { OverlayTransparent } from "../layouts/OverlayTransparent/OverlayTransparent";
import { CenterLayout, Conditional } from "../layouts";
import { css, SerializedStyles } from "@emotion/react";
import { OnOutsideClick } from "../layouts/onOutsideClick/onOutsideClick";
import { CloseSVG } from "../icons/CloseSVG";
import React, { ReactElement } from "react";
import { HTMLAttributes } from "react";

type TModalProps = {
	/**
	 * Emotion CSS style if any
	 */
	css?: SerializedStyles;
	modalStyle?: SerializedStyles;
	children: ReactElement | ReactElement[];
	onClick?: () => void;
	onClose?: () => void;
	onOutsideClick?: () => void;
} & React.DetailedHTMLProps<HTMLAttributes<any>, any>;

export const Modal = ({ modalStyle, children, onClose, onOutsideClick }: TModalProps) => {
	return (
		<OverlayTransparent lightOverlay={true}>
			<CenterLayout>
				<OnOutsideClick onOutsideClick={onOutsideClick}>
					<div css={[primaryModalStyle, modalStyle]} className={"relative"}>
						{children}

						<Conditional showIf={!!onClose}>
							<div css={closeIcon} onClick={onClose}>
								<CloseSVG height={13} width={13} />
							</div>
						</Conditional>
					</div>
				</OnOutsideClick>
			</CenterLayout>
		</OverlayTransparent>
	);
};

const primaryModalStyle = css`
	min-width: 612rem;
	min-height: 271rem;

	background: #101215;
	border: 1px solid #1a1d26;
	box-sizing: border-box;
	border-radius: 10rem;
	margin-top: -200rem;

	/*
	Horizontal modal style
	*/
	padding: 28rem 36rem 44rem;
`;

const closeIcon = css`
	position: absolute;
	top: 26rem;
	right: 36rem;

	padding: 4px;

	:hover {
		background: rgba(255, 255, 255, 0.14);
		border-radius: 2px;
	}
`;
