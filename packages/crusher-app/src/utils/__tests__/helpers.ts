import { getCollapsedTestSteps } from "../helpers";

test("groupTestResults ", () => {
	// Check first and last steps are visible.
	// Combination of common test
	// Large test
	expect(
		getCollapsedTestSteps([
			{ status: "COMPLETE" },
			{ status: "COMPLETE" },
			{ status: "FAILED" },
			{ status: "COMPLETE" },
			{ status: "REVIEW" },
			{ status: "COMPLETE" },
			{ status: "COMPLETE" },
			{ status: "COMPLETE" },
			{ status: "FAILED" },
			{ status: "COMPLETE" },
			{ status: "COMPLETE" },
			{ status: "COMPLETE" },
		]),
	).toMatchObject([
		{ type: "show", from: 0, to: 2, count: 3 },
		{ type: "hide", from: 3, to: 3, count: 1 },
		{ type: "show", from: 4, to: 4, count: 1 },
		{ type: "hide", from: 5, to: 7, count: 3 },
		{ type: "show", from: 8, to: 8, count: 1 },
		{ type: "hide", from: 9, to: 11, count: 3 },
	]);
});
