import { iAction } from "crusher-shared/types/action";
import { BROWSER, BrowserEnum } from "crusher-shared/types/browser";
import { option } from "yargs";
import { ParserChecks } from "./preChecks";

interface IParserOptions {
	shouldRecordVideo?: boolean;
	shouldUsePlaywrightChromium?: boolean;
	browser: BrowserEnum;
	actions: Array<iAction>;
	assetsDir: string;
}

class Parser {
	shouldRecordVideo: boolean;
	shouldUsePlaywrightChromium: boolean;
	actionsList: iAction[];
	browser: BrowserEnum;
	assetsDir: string;

	constructor(options: IParserOptions) {
		this.shouldRecordVideo = !!options.shouldRecordVideo;
		this.shouldUsePlaywrightChromium = !!options.shouldUsePlaywrightChromium;
		this.actionsList = options.actions;
		this.browser = options.browser;
		this.assetsDir = options.assetsDir;

		ParserChecks.validateActions(this.actionsList);
  }

  getCodeBody() {

  }
}

export { Parser };
