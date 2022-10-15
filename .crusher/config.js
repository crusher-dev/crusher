module.exports = {
    "backend": "https://backend.crusher.dev/",
    "project": 258,
    "env": {
        "BASE_URL": "http://localhost:3000"
    },
    "proxy": [
        {
            "name": "frontend",
            "url": "http://localhost:3000",
            "intercept": "localhost:3000"
        },
    ]
}