"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtSignOptions = void 0;
const production_1 = __importDefault(require("./production"));
const staging_1 = __importDefault(require("./staging"));
const development_1 = __importDefault(require("./development"));
const test_1 = __importDefault(require("./test"));
exports.JwtSignOptions = {
    issuer: 'DiaryApp',
    subject: 'Authentication Token',
    audience: 'https://template.com',
};
exports.default = {
    production: production_1.default,
    staging: staging_1.default,
    development: development_1.default,
    test: test_1.default,
}[process.env.DIARY_NODE_ENV || 'development'];
//# sourceMappingURL=index.js.map