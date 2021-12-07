import { getCollapseList } from '../helpers'


test('should ', () => {
    expect(getCollapseList([{}])).toMatchObject({"lastStep": 1, "remainingSteps": -1});
    expect(getCollapseList([
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "FAILED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
    ])).toMatchObject({ lastStep: 2, remainingSteps: 2 });
    expect(getCollapseList([
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "FAILED" },
    ])).toMatchObject({ lastStep: 4, remainingSteps: 2 });
    expect(getCollapseList([
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "FAILED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
    ])).toMatchObject({ lastStep: 4, remainingSteps: 5 });
    expect(getCollapseList([
        { status: "FAILED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
        { status: "COMPLETED" },
    ])).toMatchObject({ lastStep: 3, remainingSteps: 2 });

})
