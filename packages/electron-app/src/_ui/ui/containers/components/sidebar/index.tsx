import React, { memo } from "react";
import { css } from "@emotion/react";
import { useSelector } from "react-redux";
import { getRecorderInfo, getRecorderState } from "../../../../../store/selectors/recorder";
import { Conditional } from "@dyson/components/layouts";
import { ActionsPanel } from "../../../screens/recorder/components/sidebar/actionsPanel";
import { StepsPanel } from "./steps";
import { TemplatesModal } from "./steps/templatesModal";
import { ModalManager } from "../modals";
import { TRecorderState } from "electron-app/src/store/reducers/recorder";

const Sidebar = ({
    className
}: any) => {
	const recorderInfo = useSelector(getRecorderInfo);
	const recorderState = useSelector(getRecorderState);
	const IS_GETTING_STARTED = false;

	return (
        (<div css={[containerStyle, IS_GETTING_STARTED ? gettingStartedContainerStyle : null]} className={String(className)}>
            <Conditional showIf={recorderInfo.device}>
				<>
					{recorderState.type !== TRecorderState.CUSTOM_CODE_ON ? (
						<ActionsPanel />
					) : (
						<div
							css={css`
								display: flex;
								flex: 1;
								flex-direction: column;
								padding: 30rem 24rem;
							`}
						>
							<div>
								<div
									css={css`
										font-family: Gilroy;
										font-style: normal;
										font-weight: 700;
										font-size: 15rem;
									`}
								>
									Coding mode enabled
								</div>
								<div
									css={css`
										margin-top: 4rem;
										font-family: Gilroy;
										font-style: normal;
										font-weight: 400;
										font-size: 12rem;
										color: rgba(255, 255, 255, 0.9);
									`}
								>
									No manual actions are allowed.
								</div>
							</div>
						</div>
					)}

					<StepsPanel />
				</>
			</Conditional>
            <ModalManager />
            <TemplatesModal isOpen={false} handleClose={() => { }} />
        </div>)
    );
};
const containerStyle = css`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	overflow: hidden;
	position: relative;
	z-index: 1000;
	background-color: #09090A;
`;
const gettingStartedContainerStyle = css`
	background-color: #070709;
`;

export { Sidebar };
export default memo(Sidebar);
