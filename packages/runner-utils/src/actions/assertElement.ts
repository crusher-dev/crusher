 import {assertElement} from "../functions";
 import { waitForSelectors } from "../functions";
 import { Page } from "playwright";
 import { iAction } from "../../../crusher-shared/types/action";
 import { iSelectorInfo } from "../../../crusher-shared/types/selectorInfo";

 export default function assert(action: iAction, page: Page) {
	 return new Promise(async (success, error) => {
		 try{
			 const selectors = action.payload.selectors as iSelectorInfo[];
			 const selector = await waitForSelectors(page, selectors);

			 if(!selector || typeof selector !== "string"){
				 return error(`Invalid selector`);
			 }

			 const validationRows = action.payload.meta.validationRows;
			 const output = await assertElement(page, selector, validationRows);

			 return success({
				 message: `Successfully asserted element ${selector}`,
				 meta: {output}
			 });
		 } catch(err){
			 return error("Some issue occurred while asserting element");
		 }
	 });
 }
