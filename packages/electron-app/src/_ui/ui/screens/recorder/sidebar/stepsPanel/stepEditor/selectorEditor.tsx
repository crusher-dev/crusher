import { Button } from "@dyson/components/atoms";
import { HoverCardTooltipContext } from "@dyson/components/atoms/tooltip/Tooltip1";
import { css } from "@emotion/react";
import { iSelectorInfo } from "@shared/types/selectorInfo";
import { getAllSteps } from "electron-app/src/store/selectors/recorder";
import { turnOnElementSelectorInspectMode } from "electron-app/src/ipc/perform";
import { AddRoundedIcon, BackIconV3 } from "electron-app/src/_ui/constants/icons";
import React from "react";
import { useSelector } from "react-redux";
import { HoverButton } from "electron-app/src/_ui/ui/components/hoverButton";

const SelectorEditorCard = ({ stepId, goBack }) => {
	const [showAll, setShowAll] = React.useState(true);
	const steps = useSelector(getAllSteps);
	const step = steps[stepId];

    const { update } = React.useContext(HoverCardTooltipContext);

	React.useEffect(() => {
		update();
	}, []);

	const getReadbleSelectors = (selectors: iSelectorInfo[] | null) => {
		if (!selectors) return "";

		return selectors
			.map((selector) => {
				return selector.value;
			});
	};


	const selectorsComponent = React.useMemo(() => {
		let filteredSelectors = step.payload.selectors;
		if (!showAll) {
			filteredSelectors = step.payload.selectors.slice(0, 5);
		}
		requestAnimationFrame(() => {
			update();
		});
		return 	getReadbleSelectors(filteredSelectors).map((selector, index) => {
			return (
				<input type="text" defaultValue={selector} css={[selectorItemCss, index % 2 == 0 ? undefined : css`background: transparent;`]} key={index} className={"flex px-20 py-12"}/>
			);
		})
	}, [step, showAll]);
	
	const handleReselectElement = () => {
		turnOnElementSelectorInspectMode({ stepId });
	};

	const remaining = step.payload.selectors.length - selectorsComponent.length;

	return (
		<div className={"py-16 flex-column"} style={{height: showAll ? `600rem` : selectorsComponent?.length ? `${selectorsComponent * 60}rem`  : "400rem", display: "flex", flexDirection: "column"}} css={[stepMetaInfoContainerCss]}>
			<div className={" px-20 flex items-center"}>
			 <HoverButton onClick={goBack}><BackIconV3 css={backIconCss} /></HoverButton>
				<div className={"ml-6"} css={titleCss}>element selectors</div>
				<div css={addButtonCss} className={"ml-auto flex items-center"}>
					<AddRoundedIcon css={addIconCss}/>
					<div className={"ml-8"}>selector</div>
				</div>
			</div>
			<div className={"flex-column mt-12 custom-scroll"} style={{overflowY: "scroll", overflowX: "hidden", flex: 1}}>
				<div css={selectorListCss} >
					{selectorsComponent}
				</div>
			</div>
			{remaining ? (	<div className={"flex px-20 mt-4"}>
				<div className={""} onClick={setShowAll.bind(this, true)} css={moreButtonCss}>
					+{remaining} more
				</div>
			</div>) : ""}
		
			<div className={"px-20 mt-12"}>
					<div className={"flex"}>
						<div></div>
						<div className={"ml-auto"}>
							
                        <Button bgColor="tertiary-dark" onClick={handleReselectElement}>
                            reselect element
                        </Button>
						</div>
					</div>
			</div>
		</div>
	);
};

const moreButtonCss = css`
	width: fit-content:
	height: 100%;
	font-size: 13rem;
	:hover {
		opacity: 0.8;
	}
`;

const selectorListCss= css`
	color: rgba(144, 144, 144, 0.78);
`;
const selectorItemCss = css`
	background: rgba(0, 0, 0, 0.5);
	border-width: 0.5px 0px;
	border-style: solid;
	border-color: rgba(255, 255, 255, 0.06);
	border-radius: 0px;
	width: 100%;
`;
const addButtonCss = css`
	width: fit-content;
	height: 100%;
	padding: 2rem 6rem;
	:hover {
		opacity: 0.8;
	}
`;
const addIconCss = css`
	width: 16rem;
	height: 16rem;
`;
const backIconCss=  css`
	width: 12rem;
	height: 10rem;
`;
const titleCss = css`
	font-size: 14rem;
	color: #909090;
	font-weight: 500;
`;

const stepMetaInfoContainerCss = css`

	font-family: 'Gilroy';
	font-style: normal;
	font-weight: 400;
	font-size: 12rem;

	background: #070707;
	border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;


export { SelectorEditorCard };