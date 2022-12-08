import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { IGlobalManager } from "@crusher-shared/lib/globals/interface";
import { iAction } from "@crusher-shared/types/action";
import { Locator, Page } from "playwright";
import { CrusherSdk } from "../sdk/sdk";
import { ExportsManager } from "../functions/exports";
import { StepErrorTypeEnum } from "src/error.types";
import React from "react";
import { css } from "@emotion/react";

async function clickOnElement(
	element: Locator,
	workingSelector: any,
	action: iAction,
	globals: IGlobalManager,
	storageManager: StorageManager,
	exportsManager: ExportsManager,
) {
	try {
		let pos = undefined;
		await element.waitFor({state: "visible"});

		if (action.payload.meta.value?.mousePos) {
			const posObj = action.payload.meta.value.mousePos;
			if (posObj.x >= 0 && posObj.y >= 0) {
				const boundingBox = await element.boundingBox();
				if(!boundingBox) throw new Error("selector resolved to hidden. Can't get bounding box");
				pos = { x: boundingBox.width * posObj.x, y: boundingBox.height * posObj.y };
			}
		}
		await element.click({ timeout: action.payload.timeout ? action.payload.timeout * 1000 : undefined, position: pos });
	} catch (e) {
		if (!e.message.includes("selector resolved to hidden")) throw e;
		console.error("Error while clicking", e);
		await element.dispatchEvent("click");
	}
}


const ClickError = ({ }) => {
	return (
		<div className={"flex items-center"} style={actionsContainerStyle}>
			<div className={"flex items-center"} onClick={() =>{}} syle={actionStyle}>
				<div className="px-12 flex items-center" style={{color: "red", fontSize: 14}}>
					{/* <EditIconV4 css={editIcoNCss} /> */}
					{"Navigation failed"}
				</div>
			</div>


		<div className={"px-12 pl-10"}>
			{/* <HoverButton onClick={setOpen.bind(this, false)}>
				<CloseIcon css={css`width: 8rem; height: 8rem;`} />
			</HoverButton> */}
		</div>
	</div>
	);
};

const actionsContainerStyle = {
	height: "100%",
};
const actionStyle = {
	height: "100%",
	borderWidth: "0px 0.5px",
	borderStyle: "solid",
	borderColor: "rgba(255, 255, 255, 0.05)",
	borderRadius: "0px",
};



module.exports = {
	name: ActionsInTestEnum.CLICK,
	description: "Click on element",
	error: ({ActionsToast, page}: any) => {
		const handleClick = async () => {
			const pageRes: Page = await page();
			const res = await pageRes.goto("https://google.com");
			alert("URL IS: " + await res.url());
		};
		return (
			<ActionsToast
            duration={1000 * 60 * 60 * 60}
            open={true}
            setOpen={()=>{}}
            actions={<ClickError />}
            message={<div onClick={handleClick}>Goto google.com</div>}
        />
		)
	},
	actionDescriber: (action: iAction) => {
		if (!action.payload.meta || !action.payload.meta.elementDescription) {
			return `Click element`;
		}
		return `Click [${action.payload.meta.elementDescription}]`;
	},
	handler: clickOnElement,
};

