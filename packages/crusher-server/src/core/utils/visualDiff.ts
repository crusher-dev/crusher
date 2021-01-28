/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { Logger } from "../../utils/logger";
import { error } from "util";

const PNG = require("pngjs").PNG;
const pixelmatch = require("pixelmatch");
const axios = require("axios");

export interface VisualDiffComparisonResult {
	diffDelta: number;
	outputBuffer: string;
}

export async function visualDiffWithURI(baseFileURI: string, testFileURI: string): Promise<VisualDiffComparisonResult> {
	try {
		const baseImage = await axios({
			method: "get",
			url: baseFileURI,
			responseType: "arraybuffer",
		});

		const testImage = await axios({
			method: "get",
			url: testFileURI,
			responseType: "arraybuffer",
		});

		return await visualDiff(baseImage.data, testImage.data);
	} catch (ex) {
		console.log("Error visual diff", 2);
		console.error(ex);
		Logger.error("visualDiff::visualDiffWithURI", `Error while generating diff!!`, { err: ex });
		throw ex;
	}
}

async function visualDiff(baseFile: Buffer, targetFile: Buffer) {
	try {
		const img1 = PNG.sync.read(baseFile);
		let img2;

		img2 = PNG.sync.read(targetFile);
		const { width, height } = img1;
		const diff = new PNG({ width, height });

		let diffDelta = pixelmatch(img1.data, img2.data, diff.data, width, height, {
			threshold: 0.25,
			alpha: 0.8,
		});
		diffDelta = (diffDelta * 100) / (width * height);

		return { diffDelta: diffDelta, outputBuffer: PNG.sync.write(diff) };
	} catch (e) {
		throw e;
	}
}
