"use strict";
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
exports.AuthController = void 0;
const http_status_codes_1 = require("http-status-codes");
const hashing_services_1 = __importDefault(require("../../shared/services/hashing.services"));
class AuthController {
    constructor() {
        this.loginUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'OTP sent to email successfully',
                data: req.user,
            });
        });
        this.verifyUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const token = hashing_services_1.default.sign({
                id: (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.user_id) !== null && _b !== void 0 ? _b : '',
                email: (_d = (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.email) !== null && _d !== void 0 ? _d : '',
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'User verified successfully',
                data: { token, user: req === null || req === void 0 ? void 0 : req.user },
            });
        });
        this.AdminLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'OTP sent to email successfully',
                data: req.user,
            });
        });
    }
}
exports.AuthController = AuthController;
const authController = new AuthController();
exports.default = authController;
//# sourceMappingURL=controller.js.map