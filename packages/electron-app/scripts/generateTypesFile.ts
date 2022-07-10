import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

export const readFile = (relativePath: string): string => {
	return readFileSync(resolve(__dirname, relativePath)).toString();
};

const generateTypesFile = () => {
	const playwrightProtocol = readFile("../../../node_modules/playwright/types/protocol.d.ts");
	const playwrightTypes = readFile("../../../node_modules/playwright/types/types.d.ts");

	const expectMain = readFile("../../../node_modules/expect/build/index.d.ts");
	const expectTypes = readFile("../../../node_modules/expect/build/types.d.ts");

	const nodeFetchTypes = readFile("../../../node_modules/@types/node-fetch/index.d.ts");

	const assertTypes = readFile("../../../node_modules/@types/node/assert.d.ts");
	const axiosTypes = readFile("../../../node_modules/axios/index.d.ts");
	const globalTypes = readFile("../../../node_modules/@types/node/globals.d.ts");

	const types = `${globalTypes}
${assertTypes}
declare module 'axios' {
  ${axiosTypes}
}
declare module 'playwright' {
    ${playwrightProtocol}
    ${playwrightTypes}
}
declare module 'jestMatcherUtils' {

}
declare module '@jest/types'{

}
declare module 'expect' {
  ${expectTypes}
}

declare module 'node-fetch' {
  ${nodeFetchTypes}
};
declare module 'crusherSdk' {
  import { Page } from "playwright";
  declare class CrusherSdk {
    page: Page;
    sleep(time: number): Promise<unknown>;
    stallTest(message: string): void;
    spawnTests(testsArr: Array<{testId: number | string; groupId: string; context: any}>): void;
  }

  export {CrusherSdk};
}

declare const expect: import("expect").Expect;

declare const modules: {
  nodeFetch: typeof import("node-fetch").default;
};

declare const crusherSdk: import("crusherSdk").CrusherSdk;
`;

	writeFileSync(resolve(__dirname, "../static/types.txt"), types);
};

generateTypesFile();
