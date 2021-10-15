import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as path from "path";

const TEMP_DIR = "/tmp/crusher_browser";

export function createTempDir(): string {
	const tempDir = path.join(TEMP_DIR, uuidv4());
	if (fs.existsSync(tempDir)) {
		return createTempDir();
	}
	fs.mkdirSync(tempDir);
	return tempDir;
}

export function deleteDirIfThere(dir: string): void {
	if (fs.existsSync(dir)) {
		fs.rmdirSync(dir, { recursive: true });
	}
}
