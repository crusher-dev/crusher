const removeEmptyLines = (lines: Array<string>) => {
    return lines.map((line) => line.trim()).filter((line) => line !== "");
}

/*
    Processes the result log of `npx crusher.dev tunnel` and returns info object

    Sample input:
    ┌──────────┬──────────────────────────────────────────────────────┬─────────────────────────┐
    │ (index)  │                        tunnel                        │        intercept        │
    ├──────────┼──────────────────────────────────────────────────────┼─────────────────────────┤
    │ frontend │ 'https://crusher-tunnel-frontend-1.crushercloud.com' │ 'http://localhost:3000' │
    │ backend  │ 'https://crusher-tunnel-backend-1.crushercloud.com'  │ 'http://localhost:3001' │
    └──────────┴──────────────────────────────────────────────────────┴─────────────────────────┘
    Output:
    {
        frontend: {
            tunnel: 'https://crusher-tunnel-frontend-1.crushercloud.com',
            intercept: 'http://localhost:3000'
        },
        backend: {
            tunnel: 'https://crusher-tunnel-backend-1.crushercloud.com',
            intercept: 'http://localhost:3001'
        }
    }

    Reference: https://github.com/nodejs/node/blob/01e673c7f6f85edfb81c135895380dfd7d70e02c/lib/internal/cli_table.js
*/
export const processTunnelTableLog = (logText: string): {
    [key: string]: {
        tunnel: string;
        intercept: string;
    };
} => {
    const lines: Array<any> = removeEmptyLines(logText.split("\n"));
    lines.shift(); // Remove first line (top-boundary of table)
    lines.pop(); // Remove last line (bottom-boundary of table)

    const processsRow = (line: string) => {
        const values = line.split("│").map((value) => value.trim());
        // Remove first and last element (left and right boundary of table)
        values.shift();
        values.pop();
        return values;
    };
    const getKeyIndexMap = () => {
        const headerLine = lines.shift();
        const headersArr = processsRow(headerLine);
        return headersArr.reduce((prev, current, index) => {
            return {
                ...prev,
                [index]: current.trim(),
            };
        }, {});
    };

    const columns = getKeyIndexMap();
    lines.splice(0, 1); // Remove the separator line

    const output = {};
    lines.forEach((line) => {
        const values = processsRow(line);

        let rowKey: string | null = null;
        const row = values.reduce((prev, current, index) => {
            if(columns[index] === "(index)"){
                rowKey = current;
                return prev;
            }
            return {
                ...prev,
                [columns[index]]: current.slice(1, -1), // Remove quotes
            }
        }, {});

        if(rowKey) {
            output[rowKey] = row;
        }
    });


    return output;
};