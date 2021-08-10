import { iAction } from "@crusher-shared/types/action";
import { ElementHandle } from "playwright";
import { type } from "../functions/type";
import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";

async function addInput(element: ElementHandle, actionInfo: iAction) {
    const inputKeys = actionInfo.payload.meta.value;

    await element.scrollIntoViewIfNeeded();
    await type(element, inputKeys);
}


module.exports = {
    name: ActionsInTestEnum.ADD_INPUT,
    description: "Adding input to element",
    handler: addInput,
}