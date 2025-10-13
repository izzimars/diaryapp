"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const request_params_validator_middleware_1 = require("../../shared/middlewares/request-params-validator.middleware");
const request_body_validator_middleware_1 = require("../../shared/middlewares/request-body-validator.middleware");
const request_query_validator_middleware_1 = require("../../shared/middlewares/request-query-validator.middleware");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const watch_async_controller_1 = require("../../shared/utils/watch-async-controller");
const validator_1 = require("./validator");
const adminRouter = (0, express_1.Router)();
adminRouter.post('/login', (0, request_body_validator_middleware_1.RequestBodyValidatorMiddleware)(validator_1.adminLoginSchema), auth_middleware_1.loginAdmin, (0, watch_async_controller_1.WatchAsyncController)(controller_1.default.adminLogin));
adminRouter.post('/create', auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(['admin']), (0, request_body_validator_middleware_1.RequestBodyValidatorMiddleware)(validator_1.createAdminSchema), auth_middleware_1.createAdmin, (0, watch_async_controller_1.WatchAsyncController)(controller_1.default.createAdmin));
adminRouter.get('/profile', auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(['admin']), (0, watch_async_controller_1.WatchAsyncController)(controller_1.default.getProfile));
adminRouter.get('/user/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(['admin']), (0, request_params_validator_middleware_1.RequestParamsValidatorMiddleware)(validator_1.adminUserIdSchema), (0, watch_async_controller_1.WatchAsyncController)(controller_1.default.getUser));
adminRouter.get('/users', auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(['admin']), (0, request_query_validator_middleware_1.RequestQueryValidatorMiddleware)(validator_1.getUsersQuerySchema), (0, watch_async_controller_1.WatchAsyncController)(controller_1.default.getUsers));
adminRouter.put('/user/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(['admin']), (0, request_params_validator_middleware_1.RequestParamsValidatorMiddleware)(validator_1.adminUserIdSchema), (0, request_body_validator_middleware_1.RequestBodyValidatorMiddleware)(validator_1.updateUserSchema), (0, watch_async_controller_1.WatchAsyncController)(controller_1.default.updateUser));
adminRouter.delete('/user/:id', auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(['admin']), (0, request_params_validator_middleware_1.RequestParamsValidatorMiddleware)(validator_1.adminUserIdSchema), (0, watch_async_controller_1.WatchAsyncController)(controller_1.default.deleteUser));
exports.default = adminRouter;
//# sourceMappingURL=routes.js.map