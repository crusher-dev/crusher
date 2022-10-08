module.exports = {
    "backend": "https://backend.crusher.dev/",
    "project": 2843,
    "proxy": [
        {
            "name": "frontend",
            "url": "http://localhost:3913",
            "intercept": "localhost:3913"
        }
    ]
}