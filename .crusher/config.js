module.exports = {
  "backend": "https://backend.crusher.dev/",
  "project": 258,
  "proxy": [{
    "name": "frontend",
    "url": "http://localhost:3000/",
    "intercept": "localhost:3000"
   },
   {
    "name": "backend",
    "url": "http://localhost:8000/",
    "intercept": "localhost:8000"
  }]
}