module.exports = {
  "apps": [
    {
      "name": "crusher-app",
      "cwd": "./packages/crusher-app",
      "script": "npm",
      "args": "run dev",
      "env": {
        "BACKEND_URL": "http://localhost:8000/",
        "IS_DEVELOPMENT": true,
        "FRONTEND_URL": "http://localhost:3000/"
      },
      "merge_logs": true,
      "out_file": "./logs/crusher-app.out",
      "log_file": "./logs/crusher-app.log.out",
      "error_file": "./logs/crusher-app.error.out",
    },
    {
      "name": "crusher-server",
      "cwd": "./packages/crusher-server",
      "script": "npm",
      "args": "run dev",
      "env": {
        "PORT": 8000,
        "BACKEND_URL": "http://localhost:8000",
        "FRONTEND_URL": "http://localhost:3000",
        "DB_HOST": "localhost",
        "REDIS_HOST": "localhost",
        "REDIS_PORT": 6379,
        "REDIS_PASSWORD": "",
        "DB_TYPE": "mysql",
        "DB_CONNECTION_POOL": 10,
        "DB_PORT": 3306,
        "DB_USERNAME": "root",
        "DB_PASSWORD": "password",
        "DB_DATABASE": "crusher",
        "MONGODB_CONNECTION_STRING": "mongodb://root:password@localhost:27017/",
        "GOOGLE_CLIENT_ID": "330490657063-1l8mgjv6pnopfmdcgecnslvnkuipbivj.apps.googleusercontent.com",
        "GOOGLE_CLIENT_SECRET": "Iac-4EQFeqQl_t1Hnq8aCrpP",
        "GITHUB_CLIENT_ID": "Iv1.b94bab70cd7aad37",
        "SLACK_CLIENT_ID": "650512229650.1194885099766",
        "SLACK_CLIENT_SECRET": "c8b73831d4fd48fba5be4f5c4515d6a8",
        "SENDGRID_API_KEY": "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",
        "SENDIN_BLUE_API_KEY": "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",
        "CODE_RUNNER_URL": "http://test_runner:3000",
        "LOGDNA_API_KEY": "c7bdd500e3cfbfe457a2ec4168b8cfaa",
        "MONGODB_HOST": "localhost",
        "MONGODB_PORT": "27017",
        "MONGODB_USERNAME": "root",
        "MONGODB_PASSWORD": "password"
      },
      "merge_logs": true,
      "out_file": "./logs/crusher-server.out",
      "log_file": "./logs/crusher-server.log.out",
      "error_file": "./logs/crusher-server.error.out"
    },
    {
      "name": "test-runner",
      "cwd": "./packages/test-runner",
      "script": "npm",
      "args": "run start:dev",
      "env": {
        "LOGDNA_API_KEY": "c7bdd500e3cfbfe457a2ec4168b8cfaa",
        "MONGODB_HOST": "localhost",
        "MONGODB_PORT": "27017",
        "MONGODB_CONNECTION_STRING": "mongodb://root:password@localhost:27017/",
        "MONGODB_USERNAME": "root",
        "MONGODB_PASSWORD": "password",
        "REDIS_HOST": "localhost",
        "REDIS_PORT": 6379,
        "REDIS_PASSWORD": ""
      },
    },
    {
      "name": "crusher-extension",
      "cwd": "./packages/crusher-extension",
      "script": "npm",
      "args": "run dev",
      "env": {
        "BACKEND_URL": "http://localhost:8000/"
      }
    },
    {
      "name": "video-processor",
      "cwd": "./packages/video-processor",
      "script": "npm",
      "args": "run start",
      "env": {
        "LOGDNA_API_KEY": "c7bdd500e3cfbfe457a2ec4168b8cfaa",
        "MONGODB_HOST": "localhost",
        "MONGODB_PORT": "27017",
        "MONGODB_CONNECTION_STRING": "mongodb://root:password@localhost:27017/",
        "MONGODB_USERNAME": "root",
        "MONGODB_PASSWORD": "password",
        "REDIS_HOST": "localhost",
        "REDIS_PORT": 6379,
        "REDIS_PASSWORD": ""
      },
    }
  ]
}
