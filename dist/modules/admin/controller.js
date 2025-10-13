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
exports.AdminController = void 0;
const repositories_1 = __importDefault(require("../authentication/repositories"));
const repositories_2 = __importDefault(require("./repositories"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../../shared/errors");
const hashing_services_1 = __importDefault(require("../../shared/services/hashing.services"));
class AdminController {
    constructor(userRepository, adminRepository) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.adminLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const token = hashing_services_1.default.sign({
                id: (_b = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.user_id) !== null && _b !== void 0 ? _b : '',
                email: (_d = (_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.email) !== null && _d !== void 0 ? _d : '',
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Admin logged in successfully',
                data: { user: req.user, token },
            });
        });
        this.createAdmin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const adminData = req.body;
            const result = yield this.adminRepository.createAdmin(adminData);
            if (result instanceof Error) {
                return (0, errors_1.handleCustomError)(res, result, http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.CREATED,
                message: 'Admin created successfully',
                data: result,
            });
        });
        this.getProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user_id;
            if (!adminId) {
                return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                    status: 'error',
                    statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                    message: 'Admin not authenticated',
                });
            }
            const result = yield this.adminRepository.getAdmin(adminId);
            if (result instanceof errors_1.NotFoundException) {
                return (0, errors_1.handleCustomError)(res, result, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Admin profile retrieved successfully',
                data: result,
            });
        });
        this.getUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const identifier = req.params.id || req.body.email || req.query.email;
            const result = yield this.userRepository.getUser(identifier);
            if (result instanceof errors_1.NotFoundException) {
                return (0, errors_1.handleCustomError)(res, result, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'User retrieved successfully',
                data: result,
            });
        });
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { search, page = 1, limit = 10 } = req.query;
            const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
            const [users, countResult] = yield Promise.all([
                this.userRepository.getUsers(search, parseInt(limit, 10), offset),
                this.userRepository.getUsersCount(search),
            ]);
            const totalUsers = countResult.total;
            const totalPages = Math.ceil(totalUsers / parseInt(limit, 10));
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'Users retrieved successfully',
                data: users,
                pagination: {
                    currentPage: parseInt(page, 10),
                    totalPages,
                    totalUsers,
                    hasNextPage: parseInt(page, 10) < totalPages,
                    hasPrevPage: parseInt(page, 10) > 1,
                },
            });
        });
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const updateData = req.body;
            const result = yield this.userRepository.updateUser(userId, updateData);
            if (result instanceof errors_1.NotFoundException) {
                return (0, errors_1.handleCustomError)(res, result, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'User updated successfully',
                data: result,
            });
        });
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            const result = yield this.userRepository.deleteUser(userId);
            if (result instanceof errors_1.NotFoundException) {
                return (0, errors_1.handleCustomError)(res, result, http_status_codes_1.StatusCodes.NOT_FOUND);
            }
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: 'success',
                statusCode: http_status_codes_1.StatusCodes.OK,
                message: 'User deleted successfully',
            });
        });
    }
}
exports.AdminController = AdminController;
const adminController = new AdminController(repositories_1.default, repositories_2.default);
exports.default = adminController;
//# sourceMappingURL=controller.js.map