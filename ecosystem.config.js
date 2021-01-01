// This is used by pm2
// Centralize this config file

const BACKEND = {
    PORT: 8000,
    URL: "http://localhost:8000/"
}

const FRONTEND = {
    PORT: 3000,
    URL: "http://localhost:3000/"
}

const MYSQL = {
    DB_HOST: "localhost",
    REDIS_HOST: "localhost",
    REDIS_PORT: 6379,
    REDIS_PASSWORD: "",
    DB_TYPE: "mysql",
    DB_CONNECTION_POOL: 10,
    DB_PORT: 3306,
    DB_USERNAME: "root",
    DB_PASSWORD: "password",
    DB_DATABASE: "crusher",
}

const MONGODB = {
    HOST: "localhost",
    PORT: "27017",
    CONNECTION_STRING: "mongodb://admin@localhost:27017/",
    USERNAME: "admin",
    PASSWORD: "",
}

const REDIS = {
    HOST: "localhost",
    PORT: 6379,
    PASSWORD: "",
}


const EXTERNAL = {
    GOOGLE_CLIENT_ID:
        "330490657063-1l8mgjv6pnopfmdcgecnslvnkuipbivj.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: "Iac-4EQFeqQl_t1Hnq8aCrpP",
    GITHUB_CLIENT_ID: "Iv1.b94bab70cd7aad37",
    SLACK_CLIENT_ID: "650512229650.1194885099766",
    SLACK_CLIENT_SECRET: "c8b73831d4fd48fba5be4f5c4515d6a8",
    SENDGRID_API_KEY:
        "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",
    SENDIN_BLUE_API_KEY:
        "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",
    LOGDNA_API_KEY: "c7bdd500e3cfbfe457a2ec4168b8cfaa",
}


module.exports = {
    apps: [
        {
            name: "crusher-app",
            cwd: "./packages/crusher-app",
            script: "npm",
            args: "run dev",
            env: {
                BACKEND_URL: BACKEND.URL,
                IS_DEVELOPMENT: true,
                FRONTEND_URL: FRONTEND.URL,
            },
            merge_logs: true,
            out_file: "./logs/crusher-app.out",
            log_file: "./logs/crusher-app.log.out",
            error_file: "./logs/crusher-app.error.out",
        },
        {
            name: "crusher-server",
            cwd: "./packages/crusher-server",
            script: "npm",
            args: "run dev",
            watch: ["src", "config"],
            env: {
                PORT: BACKEND.PORT,
                BACKEND_URL: BACKEND.URL,
                FRONTEND_URL: FRONTEND.URL,
                DB_HOST: MYSQL.DB_HOST,
                DB_TYPE: MYSQL.DB_TYPE,
                DB_CONNECTION_POOL: MYSQL.DB_CONNECTION_POOL,
                DB_PORT: MYSQL.DB_PORT,
                DB_USERNAME: MYSQL.DB_USERNAME,
                DB_PASSWORD: MYSQL.DB_PASSWORD,
                DB_DATABASE: MYSQL.DB_DATABASE,
                REDIS_HOST: REDIS.HOST,
                REDIS_PORT: REDIS.HOST,
                REDIS_PASSWORD: REDIS.PASSWORD,
                GOOGLE_CLIENT_ID:
                EXTERNAL.GOOGLE_CLIENT_ID,
                GOOGLE_CLIENT_SECRET: EXTERNAL.GOOGLE_CLIENT_SECRET,
                GITHUB_CLIENT_ID: EXTERNAL.GITHUB_CLIENT_ID,
                SLACK_CLIENT_ID: EXTERNAL.SLACK_CLIENT_ID,
                SLACK_CLIENT_SECRET: EXTERNAL.SLACK_CLIENT_SECRET,
                SENDGRID_API_KEY:
                EXTERNAL.SENDGRID_API_KEY,
                SENDIN_BLUE_API_KEY:
                EXTERNAL.SENDIN_BLUE_API_KEY,
                LOGDNA_API_KEY: EXTERNAL.LOGDNA_API_KEY,
                MONGODB_HOST: MONGODB.HOST,
                MONGODB_PORT: MONGODB.PORT,
                MONGODB_CONNECTION_STRING: MONGODB.CONNECTION_STRING,
                MONGODB_USERNAME: MONGODB.USERNAME,
                MONGODB_PASSWORD: MONGODB.PASSWORD,
            },
            merge_logs: true,
            out_file: "./logs/crusher-server.out",
            log_file: "./logs/crusher-server.log.out",
            error_file: "./logs/crusher-server.error.out",
        },
        {
            name: "test-runner",
            cwd: "./packages/test-runner",
            script: "npm",
            args: "run start:dev",
            watch: ["src", "config", "util"],
            env: {
                LOGDNA_API_KEY:  EXTERNAL.LOGDNA_API_KEY,
                MONGODB_HOST: MONGODB.HOST,
                MONGODB_PORT: MONGODB.PORT,
                MONGODB_CONNECTION_STRING: MONGODB.CONNECTION_STRING,
                MONGODB_USERNAME: MONGODB.USERNAME,
                MONGODB_PASSWORD: MONGODB.PASSWORD,
                REDIS_HOST: REDIS.HOST,
                REDIS_PORT: REDIS.PORT,
                REDIS_PASSWORD: REDIS.PASSWORD,
            },
        },
        {
            name: "crusher-extension",
            cwd: "./packages/crusher-extension",
            script: "npm",
            args: "run dev",
            env: {
                BACKEND_URL: BACKEND.URL,
            },
        },
        {
            name: "video-processor",
            cwd: "./packages/video-processor",
            script: "npm",
            args: "run start",
            env: {
                LOGDNA_API_KEY:  EXTERNAL.LOGDNA_API_KEY,
                MONGODB_HOST: MONGODB.HOST,
                MONGODB_PORT: MONGODB.PORT,
                MONGODB_CONNECTION_STRING: MONGODB.CONNECTION_STRING,
                MONGODB_USERNAME: MONGODB.USERNAME,
                MONGODB_PASSWORD: MONGODB.PASSWORD,
                REDIS_HOST: REDIS.HOST,
                REDIS_PORT: REDIS.PORT,
                REDIS_PASSWORD: REDIS.PASSWORD,
            },
        },
    ],
};