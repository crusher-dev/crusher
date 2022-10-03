module.exports = {
    "backend": "https://backend.crusher.dev/",
    "project": 28143,
    "proxy": [
        {
            "name": "frontend",
            "url": "http://localhost:8080",
            "intercept": "localhost:8080"
        },
        {
            "name": "frontend-1-78",
            "url": "http://localhost:8080",
            "intercept": "localhost:8080"
        },
        {
            "name": "frontend-2-38",
            "url": "http://localhost:8080",
            "intercept": "localhost:8080"
        }
    ]
}