import { EDITION_TYPE } from "@crusher-shared/types/common/general";

function getEdition(): EDITION_TYPE {
	return process.env.CRUSHER_MODE as EDITION_TYPE;
}

function isOpenSourceEdition(): boolean {
	return getEdition() === EDITION_TYPE.OPEN_SOURCE;
}

export { getEdition, isOpenSourceEdition };
