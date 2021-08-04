export interface IProjectTestItem {
	id: number;
	testName: string;
	meta?: any | null;
	createdAt: number;
	videoURL: null | string;
	imageURL: null | string;
	isPassing: boolean;
	deleted: boolean;
	firstRunCompleted: boolean;
}

export type IProjectTestsListResponse = Array<IProjectTestItem>;

export { IProjectTestItem, IProjectTestsListResponse };
