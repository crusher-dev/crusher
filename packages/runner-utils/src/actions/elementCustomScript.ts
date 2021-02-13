import { ElementHandle, Page } from 'playwright';
import { iAction } from "@crusher-shared/types/action";
import { iSelectorInfo } from '../../../crusher-shared/types/selectorInfo';
import { toCrusherSelectorsFormat } from '../utils/helper';
import { waitForSelectors } from '../functions';

export const runScriptOnElement = (script: string, elHandle: ElementHandle): Promise<any> => {
	return new Function(
		'exports',
		'require',
		'module',
		'__filename',
		'__dirname',
		'script',
		'elHandle',
		`return new Promise(async function (resolve, reject) {
				    try{
				        const scriptFunction = ${script};
				        console.log(scriptFunction);
				        resolve(scriptFunction(elHandle));
				    } catch(err){
				      reject(err);
				    }
				});`,
	)(exports, require, module, __filename, __dirname, script, elHandle);
};

export default function elementCustomScript(action: iAction, page: Page) {
	return new Promise(async (success, error) => {
		try{
			const selectors = action.payload.selectors as iSelectorInfo[];
			await waitForSelectors(page, selectors);

			const elementHandle = await page.$(toCrusherSelectorsFormat(selectors));
			if (!elementHandle) {
				return error(`Attempt to capture screenshot of element with invalid selector: ${selectors[0].value}`);
			}

			const customScript = action.payload.meta.script;

			const scriptOutput = await runScriptOnElement(customScript, elementHandle);
			if(!!scriptOutput){
				return success({
					message: `Clicked on the element ${selectors[0].value}`,
				});
			} else {
				return error(`Assertion failed according to the script with output: ${JSON.stringify(scriptOutput)}`)
			}
		} catch(err){
			console.error(err);
			return error("Some issue occurred while running script on element");
		}
	});
}
