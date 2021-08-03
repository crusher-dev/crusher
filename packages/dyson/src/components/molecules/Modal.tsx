import { OverlayTransparent } from "../layouts/OverlayTransparent/OverlayTransparent";
import { CenterLayout, Conditional } from "../layouts";
import { css } from "@emotion/react";
import { OnOutsideClick } from "../layouts/onOutsideClick/onOutsideClick";
import { CloseSVG } from "../icons/CloseSVG";

export const Modal = ({ modalStyle, children, onClose, onOutsideClick }) => {
	return (
		<OverlayTransparent lightOverlay={true}>
			<CenterLayout
				css={css`
					padding-bottom: 100px;
				`}
			>
				<OnOutsideClick onOutsideClick={onOutsideClick}>
					<div css={[primaryModalStyle, modalStyle]} className={"relative"}>
						{children}

						<Conditional showIf={true}>
							<div css={closeIcon}>
								<CloseSVG onClick={onClose && onClose} height={13} width={13} />
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
	border-radius: 6px;
	margin-top: -300rem;

	/*
	Horizontal modal style
	*/
	padding: 28rem 40rem 44rem;
`;

const closeIcon = css`
	position: absolute;
	top: 28rem;
	right: 32rem;
`;
