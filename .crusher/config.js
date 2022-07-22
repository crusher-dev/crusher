module.exports = {
  "backend": "http://localhost:8000/",
  "project": 859,
  "proxy": [{
    "name": "backend",
    "url": "http://localhost:8000/",
    "intercept": "localhost:8000"
   }]
}