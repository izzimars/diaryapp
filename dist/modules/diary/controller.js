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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiaryController = void 0;
const dtos = __importStar(require("./dto"));
const services_1 = __importDefault(require("./services"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../../shared/errors");
class DiaryController {
    constructor(diaryServices) {
        this.diaryServices = diaryServices;
        this.createDiary = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    status: 'error',
                    statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                    message: 'User authentication required',
                });
            }
            const payload = new dtos.DiaryDto(Object.assign(Object.assign({}, req.body), { user_id: userId }));
            const result = yield this.diaryServices.createDiary(payload);
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'Diary created successfully',
                data: result,
            });
        });
        this.getDiary = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { search } = req.query;
            const result = yield this.diaryServices.getDiary(id, search);
            if (result instanceof errors_1.NotFoundException) {
                return (0, errors_1.handleCustomError)(res, result, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Diary retrieved successfully',
                data: result,
            });
        });
        this.getDiariesByUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    status: 'error',
                    statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                    message: 'User authentication required',
                });
            }
            const { search, page = 1, limit = 10 } = req.query;
            const result = yield this.diaryServices.getDiariesByUser(userId, search, parseInt(page, 10), parseInt(limit, 10));
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Diaries retrieved successfully',
                data: result.diaries,
                pagination: result.pagination,
            });
        });
        this.updateDiary = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { id } = req.params;
            if (!userId) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    status: 'error',
                    statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                    message: 'User authentication required',
                });
            }
            const result = yield this.diaryServices.updateDiary(id, userId, req.body);
            if (result instanceof errors_1.NotFoundException) {
                return (0, errors_1.handleCustomError)(res, result, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Diary updated successfully',
            });
        });
        this.deleteDiary = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { id } = req.params;
            if (!userId) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    status: 'error',
                    statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                    message: 'User authentication required',
                });
            }
            const result = yield this.diaryServices.deleteDiary(id, userId);
            if (result instanceof errors_1.NotFoundException) {
                return (0, errors_1.handleCustomError)(res, result, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Diary deleted successfully',
            });
        });
    }
}
exports.DiaryController = DiaryController;
const diaryController = new DiaryController(services_1.default);
exports.default = diaryController;
//# sourceMappingURL=controller.js.map