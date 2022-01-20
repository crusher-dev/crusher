(async() => {
    var path = require('path');
    require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
    var { Pool } = require('pg');
    var fs = require('fs');
    console.log('Running db migration script now...');
    
    var connectionObject = {
                host: process.env.DB_HOST || 'localhost',
                port: process.env.DB_PORT,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE || 'crusher',
                insecureAuth: true,
    };
    
    const connection = new Pool(connectionObject);
    const tests = require("../scripts/crusher_test_instance_result_sets.json");
    for(let index = 0; index < tests.length; index++) {
        console.log(`Test ${index + 1}/${tests.length} started...`);
     const test = tests[index];
     await connection.query(`INSERT INTO crusher.test_instance_result_sets (id, report_id, instance_id, target_instance_id, status, conclusion, failed_reason, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
         test.id,
         test.report_id,
         test.instance_id,
         test.target_instance_id,
         test.status,
         test.conclusion,
         test.failed_reason,
         test.created_at,
         test.updated_at
     ]);
    }
})();
