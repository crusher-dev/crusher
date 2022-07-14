import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";
import * as archiver from "archiver";
import axios from "axios";
import { Stream } from "stream";
const { execSync } = require("child_process");

export const TEMP_PERSISTENT_CONTEXTS_DIR = "/tmp/crusher_browser";

export function createTempContextDir(): string {
	const tempDir = getTempContextDirPath();
	if (fs.existsSync(tempDir)) {
		return createTempContextDir();
	}
	fs.mkdirSync(tempDir);
	return tempDir;
}

export function getTempContextDirPath(): string {
	if (!fs.existsSync(TEMP_PERSISTENT_CONTEXTS_DIR)) {
		fs.mkdirSync(TEMP_PERSISTENT_CONTEXTS_DIR);
	}

	return path.join(TEMP_PERSISTENT_CONTEXTS_DIR, uuidv4());
}

export function deleteDirIfThere(dir: string): void {
	if (fs.existsSync(dir)) {
		fs.rmdirSync(dir, { recursive: true });
	}
}

export function deleteFileIfThere(path: string): void {
	if (fs.existsSync(path)) {
		fs.unlinkSync(path);
	}
}

export function zipDirectory(dir: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const dirName = path.basename(dir);
		const zipPath = path.join(dir, `../${dirName}.zip`);

		const output = fs.createWriteStream(zipPath);
		const archive = archiver("zip", {
			zlib: { level: 9 },
		});

		output.on("close", () => {
			const zipBuffer = fs.readFileSync(zipPath);
			deleteFileIfThere(zipPath);
			resolve(zipBuffer);
		});

		archive.on("error", (err: Error) => {
			reject(err);
		});

		archive.pipe(output);
		archive.directory(dir, false);
		archive.finalize();
	});
}

export function downloadUsingAxiosAndUnzip(url: string, zipPath: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		const file = fs.createWriteStream(zipPath);
		const request = axios.get<Stream>(url, { responseType: "stream" });

		request.then(
			(response) => {
				response.data.pipe(file);
				// Unzip stream

				file.on("finish", () => {
					file.close();
					execSync(`cd ${path.dirname(zipPath)} && unzip ${path.basename(zipPath)} -d ${path.basename(zipPath, ".zip")}`);
					deleteFileIfThere(zipPath);
					resolve(true);
				});
			},
			(error) => {
				reject(error);
			},
		);
	});
}
