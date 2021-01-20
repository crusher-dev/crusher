import React, { RefObject, useMemo, useRef, useState } from "react";

import { ModalButton } from "@ui/components/modal/button";
import { BaseModal } from "./baseModal";
import { css } from "@emotion/core";
import CrossIcon from "../../../../public/svg/modals/cross.svg";
import { checkIfExtensionPresent } from "@utils/extension";
import { Conditional } from "@ui/components/common/Conditional";

interface iProps {
	isOpen: boolean;
	onClose: any;
	onExtensionDownloaded: any;
}

const InstallExtensionModal = (props: iProps) => {
	const { isOpen, onClose, onExtensionDownloaded } = props;

	const [shouldStartWaiting, setShouldStartWaiting] = useState(false);
	const _waitingInterval: RefObject<NodeJS.Timeout> = useRef(null);

	const stopWaitingInterval = () => {
		clearInterval(_waitingInterval.current!);
		setShouldStartWaiting(false);
		(_waitingInterval as any).current = null;
	};

	useMemo(() => {
		if (isOpen) {
			(_waitingInterval as any).current = setInterval(async () => {
				const isExtensionThere = await checkIfExtensionPresent();
				if (isExtensionThere) {
					stopWaitingInterval();
					onExtensionDownloaded();
				}
			}, 500);
		}
	}, [isOpen]);

	const downloadExtension = () => {
		setShouldStartWaiting(true);
	};

	const handleCloseModal = () => {
		if (shouldStartWaiting) {
			stopWaitingInterval();
		}
		onClose();
	};

	return (
		<BaseModal
			isOpen={isOpen}
			heading={"Install extension"}
			subHeading={"to create test"}
			closeIcon={CrossIcon}
			illustration={"/assets/img/illustration/orange_bouncy.png"}
			onClose={handleCloseModal}
			css={{
				topArea: topAreaCSS,
				backgroundIllustrationContainer: illustrationContainerCss,
			}}
		>
			<div css={bodyContainerCss}>
				<div css={modalHeading}>Install extension on chrome browser</div>
				<ModalButton
					title={"Download & Install"}
					onClick={downloadExtension}
					containerCss={buttonCss}
				/>
				<div css={skipDiv}>skip & browse project</div>

				<Conditional If={shouldStartWaiting}>
					<div>
						<div css={loading}>
							<img src={"/svg/modals/extension_loading.svg"} />
						</div>
						<div css={loadingLabel}>
							Waiting for extension installlation. <br />
							This page will refresh automatically.
						</div>
					</div>
				</Conditional>
			</div>
		</BaseModal>
	);
};

const buttonCss = css`
	padding: 0.9rem;
	margin-bottom: 1rem;
`;

const modalHeading = css`
	margin-top: 5.25rem;
	color: #2e2e2e;
	font-weight: 700;
	font-size: 1.25rem;
	text-align: center;
	margin-bottom: 1rem;
`;
const skipDiv = css`
	text-decoration-line: underline;
	text-align: center;
	font-size: 1rem;
	margin-bottom: 0.75rem;
	color: #2e2e2e;
	cursor: pointer;
`;
const loading = css`
	text-align: center;
	img {
		height: 5.575rem;
	}
`;
const loadingLabel = css`
	font-family: Gilroy;
	font-weight: 500;
	text-align: center;

	color: #2e2e2e;
	font-size: 1rem;
	margin-bottom: 2rem;
`;

const illustrationContainerCss = css`
	top: -0.7rem;
	right: -0.5rem;
`;

const topAreaCSS = css`
	background: linear-gradient(356.01deg, #57e5f9 -20.93%, #8bceff 51.33%);
	background: #edf8ff;
	color: #2b2b39;
	// border-bottom: 2px solid #E8ECFF;
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
	min-height: 26rem;
`;

export { InstallExtensionModal };
