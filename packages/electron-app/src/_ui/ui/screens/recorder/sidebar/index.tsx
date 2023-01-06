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
import { ShepherdTourContext } from "react-shepherd";
import { useContext } from "react";
import { shouldShowOnboardingOverlay } from "electron-app/src/store/selectors/app";
import { useStore}  from "react-redux";
import { CustomCodeModal } from "../../../containers/components/modals/page/customCodeModal";
import { useCustomModelData } from "../../../containers/components/status-bar";

interface ISidebarProps {
	className?: string;
}

const Sidebar = ({ className }: ISidebarProps) => {	
	const { currentBuild } = useLocalBuild();
	const isInRecordingSession = useSelector(getIsInRecordingSession);
	const tour = useContext(ShepherdTourContext);
	
	const topPanel = React.useMemo(() => {
		if (currentBuild) {
			return <ReplaySidebarHeader />;
		} else {
			return  <ActionsPanel />;
		}
	}, [currentBuild]);

	const {
		currentModal, 
		setCurrentModal,
		stepAction,
		closeModal
	} = useCustomModelData();


	
	if(currentModal && currentModal.type === "CUSTOM_CODE"){
		return (
			<ResizeWrapper 
			width={550}
			minWidth={400}
			maxWidth={600}
			track={"Resizable"}>
			<div id="Resizable" css={containerCss} className={`recorder-sidebar ${String(className)}`}>

				<CustomCodeModal
					stepAction={stepAction as any}
					stepIndex={currentModal.stepIndex}
					isOpen={currentModal.type === "CUSTOM_CODE"}
					handleClose={closeModal}
				/>
			</div>
		</ResizeWrapper>
		)
	}

	return (
		<ResizeWrapper track={"Resizable"}>
			<div id="Resizable" css={containerCss} className={`recorder-sidebar ${String(className)}`}>
				<Conditional showIf={isInRecordingSession}>
					<>
						{topPanel}
						<StepsPanel css={[currentBuild && `height: 100%`]} />
					</>
				</Conditional>
				<ModalManager />
				<TemplatesModal isOpen={false} handleClose={() => { }} />
			</div>
		</ResizeWrapper>
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

	border-right:  0rem solid #141414;
`;

export { Sidebar };


const ResizeWrapper = ({ children, track,
width=320, minWidth=280, maxWidth= 400 }) => {
	const [mouseOver, setMouseOver] = React.useState(false);
	const [isDragging, setIsDragging] = React.useState(false);
	const [initialMousePosition, setInitialMousePosition] = React.useState(false);


	const move = React.useCallback((e) => {
		let resizable = document.getElementById(track);

		// laster subtract initial mouse position
		let newWidth = e.clientX;
		if (newWidth < minWidth) {
			newWidth = minWidth
		}
		if (newWidth > maxWidth) {
			newWidth = maxWidth
		}
		resizable.style.width = `${newWidth}px`;
	}, [])

	const remove = React.useCallback((e) => {

		setIsDragging(false)
		document.removeEventListener("mouseup", remove)
		document.removeEventListener("mousemove", move)
		document.body.style.cursor = 'default';
	}, [])


	const dragStart = (e) => {
		setInitialMousePosition(e.clientX)
		document.addEventListener("mousemove", move)
		document.addEventListener("mouseup", remove)
		setIsDragging(true)
		document.body.style.cursor = 'ew-resize';
	}

	const dragStop = () => {
		setIsDragging(false)
		setInitialMousePosition(null)
		document.removeEventListener("mousemove", move)
	}

	return (
		<div css={wrapperCSS(width)}>
			{children}
			<div id='Draggable'
				css={[hoverCSS(mouseOver)]}
				onMouseOver={() => {
					setTimeout(() => {
						setMouseOver(true)
					}, 500)
				}}
				onMouseLeave={() => {
					setMouseOver(false)

				}}
				onMouseDown={dragStart.bind(this)}
			// onMouseUp={dragStop.bind(this)}
			/>
		</div>
	);

}


const wrapperCSS = (width) =>css`
display: flex;
align-items: center;
-webkit-touch-callout: none;
-webkit-user-select: none;
-khtml-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;	

#Resizable{
    height: 100%;
    width: ${width}px;
}
#Draggable{
    background: #09090a;


    height: 100%;
    width: 2px;
	border-right: 1px solid #141414;

	:hover{
		border-right: 1px solid #212121;
	}


	transition: all .1s ease-in;
}
`

const hoverCSS = (mouseOver) => css`
	cursor:  ew-resize;
	transition: all .5s ease-in;
	// :hover{
	// 	background:  ${mouseOver ? "#B341F9" : "#141414"} !important;
	// }	
`