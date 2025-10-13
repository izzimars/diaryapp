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
exports.checkDiaryOwnership = exports.createAdmin = exports.loginAdmin = exports.requireRole = exports.authenticateToken = exports.verifyOtp = exports.loginUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const repositories_1 = __importDefault(require("../../modules/authentication/repositories"));
const repositories_2 = __importDefault(require("../../modules/diary/repositories"));
const repositories_3 = __importDefault(require("../../modules/admin/repositories"));
const errors_1 = require("../errors");
const hashing_services_1 = __importDefault(require("../../shared/services/hashing.services"));
const loginUser = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const email = req.body.email;
    const user = yield repositories_1.default.getUser(email);
    const otp = hashing_services_1.default.generateTOTP();
    if (user instanceof errors_1.NotFoundException) {
        const createdUser = yield repositories_1.default.createUser({
            email,
            role: 'user',
            verified: false,
            otp,
            otp_expiry: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        });
        req.user = {
            id: createdUser.id,
            user_id: (_a = createdUser.user_id) !== null && _a !== void 0 ? _a : createdUser.id,
            email: createdUser.email,
            verified: createdUser.verified,
            role: createdUser.role,
            otp: otp,
            created_at: createdUser.created_at,
            updated_at: createdUser.updated_at,
        };
    }
    else {
        yield repositories_1.default.updateOtp(email, otp, new Date(Date.now() + 5 * 60 * 1000).toISOString());
        user.otp = otp;
        req.user = {
            id: user.id,
            user_id: (_b = user.user_id) !== null && _b !== void 0 ? _b : user.id,
            email: user.email,
            verified: user.verified,
            role: user.role,
            otp: user.otp,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }
    next();
});
exports.loginUser = loginUser;
const verifyOtp = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, otp } = req.body;
    const user = yield repositories_1.default.getUser(email);
    if (user instanceof errors_1.NotFoundException) {
        return next(new errors_1.NotFoundException('User not found'));
    }
    if (!user.otp ||
        !hashing_services_1.default.compare(user.otp, otp) ||
        !user.otp_expiry ||
        new Date(user.otp_expiry) < new Date()) {
        return next(new errors_1.BadException('Invalid OTP'));
    }
    req.user = {
        id: user.id,
        user_id: (_a = user.user_id) !== null && _a !== void 0 ? _a : user.id,
        email: user.email,
        verified: user.verified,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
    next();
});
exports.verifyOtp = verifyOtp;
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: 'error',
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'Access token required',
        });
        return;
    }
    const decoded = hashing_services_1.default.verify(token);
    if (!decoded || !decoded.id) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: 'error',
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'Invalid token',
        });
        return;
    }
    const user = yield repositories_1.default.getUser(decoded.id);
    if (user instanceof errors_1.NotFoundException) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: 'error',
            statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'Invalid token - user not found',
        });
        return;
    }
    req.user = {
        id: user.id,
        user_id: (_a = user.user_id) !== null && _a !== void 0 ? _a : user.id,
        role: user.role,
    };
    next();
});
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        var _a;
        if (!req.user) {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: 'error',
                statusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: 'Authentication required',
            });
            return;
        }
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) || !roles.includes(req.user.role)) {
            res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                status: 'error',
                statusCode: http_status_codes_1.StatusCodes.FORBIDDEN,
                message: 'Insufficient permissions',
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
const loginAdmin = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { password, email } = req.body;
    const admin = yield repositories_3.default.getAdmin(email);
    if (admin instanceof errors_1.NotFoundException) {
        return next(new errors_1.NotFoundException('Admin not found'));
    }
    if (!admin.password || !(yield hashing_services_1.default.compare(admin.password, password))) {
        return next(new errors_1.BadException('Invalid credentials'));
    }
    req.user = {
        id: admin.id,
        user_id: (_a = admin.user_id) !== null && _a !== void 0 ? _a : admin.id,
        email: admin.email,
        verified: admin.verified,
        role: admin.role,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
    };
    next();
});
exports.loginAdmin = loginAdmin;
const createAdmin = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    const admin = yield repositories_3.default.createAdmin({
        email,
        password: yield hashing_services_1.default.hash(password),
        role: 'admin',
    });
    if (admin instanceof errors_1.NotFoundException) {
        return next(new errors_1.NotFoundException('Admin not found'));
    }
    req.user = {
        id: admin.id,
        user_id: (_a = admin.user_id) !== null && _a !== void 0 ? _a : admin.id,
        email: admin.email,
        verified: admin.verified,
        role: admin.role,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
    };
    next();
});
exports.createAdmin = createAdmin;
const checkDiaryOwnership = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!req.user || !req.user.user_id) {
        return next(new errors_1.BadException('User information missing'));
    }
    const { user_id } = req.user;
    const diary = yield repositories_2.default.getDiary(id);
    if (diary instanceof errors_1.NotFoundException) {
        return next(new errors_1.NotFoundException('Diary not found'));
    }
    if (diary.user_id !== user_id) {
        return next(new errors_1.BadException('You do not have permission to access this diary'));
    }
    next();
});
exports.checkDiaryOwnership = checkDiaryOwnership;
//# sourceMappingURL=auth.middleware.js.map