 import {assertElement} from "../functions";
 import { Page } from "playwright";
 import { iAction } from "../../../crusher-shared/types/action";
 import { iSelectorInfo } from "../../../crusher-shared/types/selectorInfo";

 export default function assert(action: iAction, page: Page) {
	 return new Promise(async (success, error) => {
		 try{
			 const selectors = action.payload.selectors as iSelectorInfo[];

			 const validationRows = action.payload.meta.validationRows;
			 const output = await assertElement(page, selectors, validationRows);

			 return success({
				 message: `Successfully asserted element ${selectors[0].value}`,
				 meta: {output}
			 });
		 } catch(err){
			 return error("Some issue occurred while asserting element");
		 }
	 });
 }
