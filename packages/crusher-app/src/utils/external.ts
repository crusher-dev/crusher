var Airtable = require('airtable');

export const sendDataToAirtable = (data: any, baseName = "appxweFi3rTf0jZUd", tableName = 'API') => {
    const base = new Airtable({ apiKey: 'key04vQVynqzBeori' }).base(baseName);
    return new Promise((res, rej) => {

        base(tableName).create(data, function (err: any, records: any) {
            if (err) {
                rej(err)
            }
            res(records)
        });

    })
}