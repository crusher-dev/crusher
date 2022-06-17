import * as shell from "shelljs";
import * as path from "path";
import { EditionTypeEnum } from "../types/common/general";

function generateUid() {
	return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function isOpenSource(): boolean {
	return process.env.CRUSHER_MODE === EditionTypeEnum.OPEN_SOURCE;
}

function createTmpAssetsDirectoriesIfNotThere(identifer: string): void {
	shell.mkdir("-p", path.join("/tmp/crusher", identifer, "videos"));
}

function deleteTmpAssetsDirectoriesIfThere(identifer: string): void {
	shell.rm("-rf", path.join("/tmp/crusher", identifer));
}

export { generateUid, isOpenSource, createTmpAssetsDirectoriesIfNotThere, deleteTmpAssetsDirectoriesIfThere };
