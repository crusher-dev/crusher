import {getCollapseList} from './helpers'


test('should ', () => {
    expect(getCollapseList([{}])).toBe(undefined);
    expect(getCollapseList([
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "FAILED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
    ])).toBe({ lastStep: 2, remainingSteps: 2 });
    expect(getCollapseList([
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "FAILED" },
    ])).toBe({ lastStep: 4, remainingSteps: 2 });
    expect(getCollapseList([
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "FAILED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
    ])).toBe({ lastStep: 4, remainingSteps: 5 });
    expect(getCollapseList([
        { status: "FAILED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
    ])).toBe({ lastStep: 0, remainingSteps: 1 });

})
