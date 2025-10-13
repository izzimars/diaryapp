"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const watch_async_controller_1 = require("../../shared/utils/watch-async-controller");
const validators = __importStar(require("./validator"));
const request_body_validator_middleware_1 = require("../../shared/middlewares/request-body-validator.middleware");
const request_params_validator_middleware_1 = require("../../shared/middlewares/request-params-validator.middleware");
const request_query_validator_middleware_1 = require("../../shared/middlewares/request-query-validator.middleware");
const auth_middleware_1 = require("../../shared/middlewares/auth.middleware");
const diaryRouter = (0, express_1.Router)();
diaryRouter.post('/', (0, request_body_validator_middleware_1.RequestBodyValidatorMiddleware)(validators.createDiarySchema), auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(['user', 'admin']), (0, watch_async_controller_1.WatchAsyncController)(controller_1.default.createDiary));
diaryRouter.get('/:id', (0, request_params_validator_middleware_1.RequestParamsValidatorMiddleware)(validators.updateDiaryParamsSchema), (0, request_query_validator_middleware_1.RequestQueryValidatorMiddleware)(validators.getDiaryQuerySchema), auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(['user', 'admin']), auth_middleware_1.checkDiaryOwnership, (0, watch_async_controller_1.WatchAsyncController)(controller_1.default.getDiary));
diaryRouter.get('/', (0, request_query_validator_middleware_1.RequestQueryValidatorMiddleware)(validators.getDiariesQuerySchema), auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(['user', 'admin']), (0, watch_async_controller_1.WatchAsyncController)(controller_1.default.getDiariesByUser));
diaryRouter.put('/:id', (0, request_params_validator_middleware_1.RequestParamsValidatorMiddleware)(validators.updateDiaryParamsSchema), (0, request_body_validator_middleware_1.RequestBodyValidatorMiddleware)(validators.updateDiarySchema), auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(['user', 'admin']), auth_middleware_1.checkDiaryOwnership, (0, watch_async_controller_1.WatchAsyncController)(controller_1.default.updateDiary));
diaryRouter.delete('/:id', (0, request_params_validator_middleware_1.RequestParamsValidatorMiddleware)(validators.updateDiaryParamsSchema), auth_middleware_1.authenticateToken, auth_middleware_1.checkDiaryOwnership, (0, auth_middleware_1.requireRole)(['user', 'admin']), (0, watch_async_controller_1.WatchAsyncController)(controller_1.default.deleteDiary));
exports.default = diaryRouter;
//# sourceMappingURL=routes.js.map