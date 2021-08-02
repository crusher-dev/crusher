export type CamelCase<S extends string> = S extends `${infer T}_${infer U}` ? `${T}${Capitalize<CamelCase<U>>}` : S;
export type KeysToCamelCase<T> = { [K in keyof T as CamelCase<K>]: T[K] };

type Upper =
	| "A"
	| "B"
	| "C"
	| "D"
	| "E"
	| "F"
	| "G"
	| "H"
	| "I"
	| "J"
	| "K"
	| "L"
	| "M"
	| "N"
	| "O"
	| "P"
	| "Q"
	| "R"
	| "S"
	| "T"
	| "U"
	| "V"
	| "W"
	| "X"
	| "Y"
	| "Z";
export type SnakeCase<S extends string> = S extends `${infer L}${Upper}${infer R}`
	? S extends `${L}${infer U}${R}`
		? `${Lowercase<L>}_${Lowercase<U>}${SnakeCase<R>}`
		: S
	: S;

export type KeysToSnakeCase<T> = { [K in keyof T as SnakeCase<K>]: T[K] };

export type Nullable<T> = { [P in keyof T]?: T[P] | null };
