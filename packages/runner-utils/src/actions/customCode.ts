import { ActionsInTestEnum } from "@crusher-shared/constants/recordedActions";
import { iAction } from "@crusher-shared/types/action";
import { Page } from "playwright";
import { CrusherSdk } from "../sdk/sdk";

async function executeCustomCode(page: Page, action: iAction) {
  const customScriptFunction = action.payload.meta.script;

  const crusherSdk = new CrusherSdk(page);

  await new Function("exports", "require", "module", "__filename", "__dirname", "crusherSdk", `${customScriptFunction} return validate(crusherSdk);`)(
    exports,
    typeof __webpack_require__ === "function" ? __non_webpack_require__ : require,
    module,
    __filename,
    __dirname,
    crusherSdk,
  );
}

module.exports = {
	name: ActionsInTestEnum.CUSTOM_CODE,
	description: "Executing custom code",
	handler: executeCustomCode,
};
