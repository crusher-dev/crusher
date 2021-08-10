import { EditionTypeEnum } from "@shared/types/common/general";
import * as shell from "shelljs";
import * as path from "path";

function isOpenSource(): boolean {
	return process.env.CRUSHER_MODE === EditionTypeEnum.OPEN_SOURCE;
}

function createTmpAssetsDirectoriesIfNotThere(identifer: string): void {
	shell.mkdir("-p", path.join("/tmp/crusher", identifer, "videos"));
}

function deleteTmpAssetsDirectoriesIfThere(identifer: string): void {
	shell.rm("-rf", path.join("/tmp/crusher", identifer));
}

export { isOpenSource, createTmpAssetsDirectoriesIfNotThere, deleteTmpAssetsDirectoriesIfThere };
