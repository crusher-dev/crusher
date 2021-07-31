import { atom } from "jotai";
import { useRouter } from 'next/router';

export const atomWithQuery = (atomName, value) => {
	return atom(
		(get) => tabAtom,
		(get, set, value) => {

			const router = useRouter();
		},
	);
};

export const atomwithStorage;
