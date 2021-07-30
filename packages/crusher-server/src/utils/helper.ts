import { EDITION_TYPE } from "@crusher-shared/types/common/general";

function getEdition(): EDITION_TYPE {
	return process.env.CRUSHER_MODE as EDITION_TYPE;
}

function isOpenSourceEdition(): boolean {
	return getEdition() === EDITION_TYPE.OPEN_SOURCE;
}

function isUsingLocalStorage(): boolean {
	return process.env.STORAGE_MODE === "local";
}

function getFullName(firstName: string | null, lastName: string | null) {
	return [firstName, lastName].filter((name) => !!name).join(" ");
}

export { getEdition, isOpenSourceEdition, isUsingLocalStorage, getFullName };
