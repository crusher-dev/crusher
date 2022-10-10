import React from "react";
import { getIsCustomCodeOn, getIsInRecordingSession } from "electron-app/src/store/selectors/recorder";
import { useSelector } from "react-redux";
import { css } from "@emotion/react";
import { ActionsPanel } from "./actionsPanel";
import { CustomCodeBanner } from "./customCodeBanner";
import { StepsPanel } from "./stepsPanel";
import { ModalManager } from "electron-app/src/_ui/ui/containers/components/modals";
import { TemplatesModal } from "electron-app/src/_ui/ui/containers/components/sidebar/steps/templatesModal";
import { useLocalBuild } from "electron-app/src/_ui/hooks/tests";
import { ReplaySidebarHeader } from "./replay/header";
import { Conditional } from "@dyson/components/layouts";

interface ISidebarProps {
	className?: string;
}

const Sidebar = ({ className }: ISidebarProps) => {
	const { currentBuild } = useLocalBuild();
	const isInRecordingSession = useSelector(getIsInRecordingSession);
	const isCustomCodeOn = useSelector(getIsCustomCodeOn);

	const topPanel = React.useMemo(() => {
		if (currentBuild) {
			return <ReplaySidebarHeader />;
		} else {
			return !isCustomCodeOn ? <ActionsPanel /> : <CustomCodeBanner />;
		}
	}, [currentBuild]);

	return (
		<div css={containerCss} className={String(className)}>
			<Conditional showIf={isInRecordingSession}>
				<>
					{topPanel}
					<StepsPanel css={[currentBuild && `height: 100%`]} />
				</>
			</Conditional>
			<ModalManager />
			<TemplatesModal isOpen={false} handleClose={() => { }} />
		</div>
	);
};

const containerCss = css`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	overflow: hidden;
	position: relative;
	z-index: 1000;
	background-color: #09090a;

	border-right:  3rem solid #141414;
`;

export { Sidebar };
