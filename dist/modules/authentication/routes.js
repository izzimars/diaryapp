"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const watch_async_controller_1 = require("../../shared/utils/watch-async-controller");
const request_body_validator_middleware_1 = require("../../shared/middlewares/request-body-validator.middleware");
const validator_1 = require("./validator");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const authenticationRouter = (0, express_1.Router)();
authenticationRouter.post('/login', (0, request_body_validator_middleware_1.RequestBodyValidatorMiddleware)(validator_1.loginUserSchema), auth_middleware_1.loginUser, (0, watch_async_controller_1.WatchAsyncController)(controller_1.default.loginUser));
authenticationRouter.post('/verify-otp', (0, request_body_validator_middleware_1.RequestBodyValidatorMiddleware)(validator_1.verifyOtpSchema), auth_middleware_1.verifyOtp, (0, watch_async_controller_1.WatchAsyncController)(controller_1.default.verifyUser));
exports.default = authenticationRouter;
//# sourceMappingURL=routes.js.map