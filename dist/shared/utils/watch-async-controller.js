"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchAsyncController = void 0;
const env_1 = __importDefault(require("./env"));
const WatchAsyncController = (fn) => (req, res) => {
    Promise.resolve(fn(req, res)).catch((error) => {
        res.status(500).json({
            status: false,
            message: 'We encountered a problem while processing your request. Please try again',
            errors: env_1.default.get('NODE_ENV') !== 'production'
                ? error.errors || error.message
                : null,
        });
    });
};
exports.WatchAsyncController = WatchAsyncController;
//# sourceMappingURL=watch-async-controller.js.map