module.exports = {
    "backend": "https://backend.crusher.dev/",
    "project": 258,
    "selectedHost": "http://localhost:3000",
    "proxy": [
        {
            "name": "frontend",
            "url": "http://localhost:3000",
            "intercept": "localhost:3000"
        },
        {
            "name": "frontend-1-12",
            "url": "http://localhost:3913",
            "intercept": "localhost:3913"
        }
    ]
}