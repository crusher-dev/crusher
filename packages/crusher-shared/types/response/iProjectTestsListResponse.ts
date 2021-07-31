export interface IProjectTestItem {
	id: number;
	testName: string;
	createdAt: number;
	videoURL: null | string;
	imageURL: null | string;
	isPassing: boolean;
	firstRunCompleted: boolean;
}

export type IProjectTestsListResponse = Array<IProjectTestItem>;

export { IProjectTestItem, IProjectTestsListResponse };
