const http = require("http");
const path = require("path");
const handler = require("serve-handler");

const assetsServer = http.createServer((request, response) => {
    // You pass two more arguments for config and middleware
    // More details here: https://github.com/vercel/serve-handler#options
    return handler(request, response, { public: path.resolve(__dirname, "../__tests__/assets") });
});

assetsServer.listen(3913);

console.log("Listening to port 3913");