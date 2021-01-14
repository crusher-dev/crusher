/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import { Logger } from "../../utils/logger";
import { error } from "util";

const fs = require("fs");
const PNG = require("pngjs").PNG;
const pixelmatch = require("pixelmatch");
const fse = require("fs-extra");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

export interface VisualDiffComparisonResult {
	diffDelta: number;
	outputFile: string;
}

export async function visualDiffWithURI(baseFileURI: string, testFileURI: string): Promise<VisualDiffComparisonResult> {
	try {
		const fName = uuidv4();
		const baseFile = await axios({
			method: "get",
			url: baseFileURI,
			responseType: "stream",
		});

		const testFile = await axios({
			method: "get",
			url: testFileURI,
			responseType: "stream",
		});

		const time = Date.now();

		const baseScreenShotstream = fs.createWriteStream(`/tmp/${fName}_${time}_base.png`);
		baseFile.data.pipe(baseScreenShotstream);

		await new Promise((resolve, reject) => {
			baseScreenShotstream.on("error", (err) => {
				baseScreenShotstream.close();
				reject(err);
			});
			baseScreenShotstream.on("close", () => {
				if (!error) resolve(true);
			});
		});
		const testScreenshotStream = fs.createWriteStream(`/tmp/${fName}_${time}_test.png`);
		testFile.data.pipe(testScreenshotStream);
		await new Promise((resolve, reject) => {
			testScreenshotStream.on("error", (err) => {
				testScreenshotStream.close();
				reject(err);
			});
			testScreenshotStream.on("close", () => {
				if (!error) resolve(true);
			});
		});

		return await visualDiff(`/tmp/${fName}_${time}_base.png`, `/tmp/${fName}_${time}_test.png`, `/tmp/${fName}_${time}_diff.png`);
	} catch (ex) {
		console.log("Error visual diff", 2);
		console.error(ex);
		Logger.error("visualDiff::visualDiffWithURI", `Error while generating diff!!`, { err: ex });
		throw ex;
	}
}

async function visualDiff(baseFile: string, targetFile: string, diffPath: string) {
	try {
		const img1 = PNG.sync.read(fs.readFileSync(baseFile));
		let img2;

		img2 = PNG.sync.read(fs.readFileSync(targetFile));
		const { width, height } = img1;
		const diff = new PNG({ width, height });

		let diffDelta = pixelmatch(img1.data, img2.data, diff.data, width, height, {
			threshold: 0.25,
			alpha: 0.8,
		});
		diffDelta = (diffDelta * 100) / (width * height);

		await fse.outputFile(diffPath, PNG.sync.write(diff));
		try {
			fs.unlinkSync(baseFile);
			fs.unlinkSync(targetFile);
		} catch (ex) {}
		return { diffDelta: diffDelta, outputFile: diffPath };
	} catch (e) {
		try {
			fs.unlinkSync(baseFile);
			fs.unlinkSync(targetFile);
		} catch (ex) {}
		throw e;
	}
}
