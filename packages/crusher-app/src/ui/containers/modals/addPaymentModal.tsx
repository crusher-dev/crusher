import { Modal } from "@ui/containers/modals/modal";
import React from "react";

import { css } from "@emotion/core";

import { StripePaymentBox } from "@ui/components/common/payment.tsx";

interface iProps {
	onClose: any;
}

const AddPaymentModel = (props: iProps) => {
	const { onClose } = props;

	return (
		<Modal
			heading={"Add payment method"}
			subHeading={"Add a credit card"}
			illustrationSVG={"/assets/img/illustration/women_running.png"}
			onClose={onClose}
			topAreaCSS={topAreaCSS}
			illustrationContainerCSS={illustrationContainerCss}
		>
			<div css={bodyContainerCss}>
				<div css={modalMoto}>You will be charged on 20Nov.</div>
				<StripePaymentBox />
			</div>
		</Modal>
	);
};

const illustrationContainerCss = css`
	top: 1.2rem;
	right: -0.5rem;
`;

const topAreaCSS = css`
	background: linear-gradient(356.01deg, #57e5f9 -20.93%, #8bceff 51.33%);
	background: #e8ecff;
	color: #2b2b39;
	// border-bottom: 2px solid #E8ECFF;
`;

const modalMoto = css`
	font-size: 1rem;
	margin-bottom: 0.75rem;
`;

const bodyContainerCss = css`
	display: flex;
	flex-direction: column;
	label {
		font-family: Gilroy;
		font-weight: bold;
		color: #2b2b39;
		font-size: 1rem;
	}
	min-height: 25rem;
`;

export { AddPaymentModel };
