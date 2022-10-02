import { OverlayTransparent } from "../layouts/OverlayTransparent/OverlayTransparent";
import { CenterLayout, Conditional } from "../layouts";
import { css, SerializedStyles } from "@emotion/react";
import { OnOutsideClick } from "../layouts/onOutsideClick/onOutsideClick";
import { CloseSVG } from "../icons/CloseSVG";
import React, { ReactElement, useEffect, useState } from "react";
import { HTMLAttributes } from "react";

type TModalProps = {
	/**
	 * Emotion CSS style if any
	 */
	id?: any;
	css?: SerializedStyles;
	modalStyle?: SerializedStyles;
	children: ReactElement | ReactElement[];
	onClick?: () => void;
	onClose?: () => void;
	onOutsideClick?: () => void;
	lightOverlay?: boolean;
} & React.DetailedHTMLProps<HTMLAttributes<any>, any>;

export const Modal = ({ modalStyle, id, children, onClose, lightOverlay, onOutsideClick }: TModalProps) => {
	return (
		<OverlayTransparent lightOverlay={typeof lightOverlay !== "undefined" && lightOverlay !== null ? lightOverlay : true}>
			<CenterLayout>
				<OnOutsideClick blackListClassNames={["select-dropDownContainer"]} onOutsideClick={onOutsideClick}>
					<div css={[primaryModalStyle, modalStyle]} id={id} className={"relative"}>
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
	min-width: 452rem;
	min-height: 271rem;

	box-sizing: border-box;
	margin-top: -200rem;

	background: rgb(13, 14, 14);
    border: .5px solid rgba(142, 142, 142, 0.1);
	
	box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px;
    border-radius: 20px;

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
