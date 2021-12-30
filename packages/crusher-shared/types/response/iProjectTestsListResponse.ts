export interface IProjectTestItem {
	id: number;
	testName: string;
	meta?: any | null;
	createdAt: number;
	tags: string | null;
	runAfter: number | null;
	videoURL: null | string;
	imageURL: null | string;
	isPassing: boolean;
	deleted: boolean;
	firstRunCompleted: boolean;
}

export type IProjectTestsListResponse = { list: IProjectTestItem[]; totalPages: number; currentPage: number };
