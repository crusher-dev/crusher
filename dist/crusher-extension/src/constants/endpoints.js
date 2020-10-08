"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APP_ENDPOINT = exports.SERVER_ENDPOINT = void 0;
exports.SERVER_ENDPOINT = process.env.NODE_ENV === "production"
    ? "https://backend.crusher.dev/"
    : "https://backend.crusher-test.com/";
exports.APP_ENDPOINT = process.env.NODE_ENV === "production"
    ? "https://app.crusher.dev/"
    : "https://www.crusher-test.com/";
//# sourceMappingURL=endpoints.js.map