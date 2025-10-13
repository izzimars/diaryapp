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
exports.UserRepositoryImpl = void 0;
const errors_1 = require("../../shared/errors");
const database_1 = require("../../config/database");
const userParams = __importStar(require("./entities"));
const query_1 = __importDefault(require("./query"));
class UserRepositoryImpl {
    createUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.db.tx((t) => __awaiter(this, void 0, void 0, function* () {
                const result = yield t.one(query_1.default.createUser, params);
                return new userParams.UserEntity({
                    id: result.id,
                    user_id: result.user_id,
                    email: result.email,
                    verified: result.verified,
                    role: result.role,
                    otp: result.otp,
                    otp_expiry: result.otp_expiry,
                    created_at: result.created_at,
                    updated_at: result.updated_at,
                });
            }));
        });
    }
    getUser(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.db.oneOrNone(query_1.default.getUser, [identifier]);
            if (!user) {
                return new errors_1.NotFoundException('User not found');
            }
            return new userParams.UserOtpEntity({
                id: user.id,
                user_id: user.user_id,
                email: user.email,
                verified: user.verified,
                role: user.role,
                otp: user.otp,
                otp_expiry: user.otp_expiry,
                created_at: user.created_at,
                updated_at: user.updated_at,
            });
        });
    }
    getUsers(searchTerm, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield database_1.db.any(query_1.default.getUsers, [
                searchTerm || null,
                limit || 10,
                offset || 0,
            ]);
            return users.map((user) => new userParams.UserEntity({
                id: user.id,
                user_id: user.user_id,
                email: user.email,
                verified: user.verified,
                role: user.role,
                otp: user.otp,
                otp_expiry: user.otp_expiry,
                created_at: user.created_at,
                updated_at: user.updated_at,
            }));
        });
    }
    getUsersCount(searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.one(query_1.default.getUsersCount, [
                searchTerm || null,
            ]);
            return { total: parseInt(result.total) };
        });
    }
    verifyUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.none(query_1.default.verifyUser, [email]);
        });
    }
    updateOtp(email, otp, expiresAt) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.none(query_1.default.updateOtp, [otp, expiresAt, email]);
        });
    }
    updateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.db.oneOrNone(query_1.default.getUser, [userId]);
            if (!user) {
                return new errors_1.NotFoundException('User not found');
            }
            const updateFields = [];
            const updateValues = [];
            let paramIndex = 1;
            if (updateData.email) {
                updateFields.push(`email = $${paramIndex++}`);
                updateValues.push(updateData.email);
            }
            if (updateData.verified !== undefined) {
                updateFields.push(`verified = $${paramIndex++}`);
                updateValues.push(updateData.verified);
            }
            if (updateData.role) {
                updateFields.push(`role = $${paramIndex++}`);
                updateValues.push(updateData.role);
            }
            updateFields.push(`updated_at = $${paramIndex++}`);
            updateValues.push(new Date().toISOString());
            updateValues.push(userId);
            const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramIndex}
      RETURNING *
    `;
            const updatedUser = yield database_1.db.one(updateQuery, updateValues);
            return new userParams.UserEntity({
                id: updatedUser.id,
                user_id: updatedUser.user_id,
                email: updatedUser.email,
                verified: updatedUser.verified,
                role: updatedUser.role,
                otp: updatedUser.otp,
                otp_expiry: updatedUser.otp_expiry,
                created_at: updatedUser.created_at,
                updated_at: updatedUser.updated_at,
            });
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.db.oneOrNone(query_1.default.getUser, [userId]);
            if (!user) {
                return new errors_1.NotFoundException('User not found');
            }
            yield database_1.db.none('DELETE FROM users WHERE id = $1', [userId]);
        });
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;
const userRepository = new UserRepositoryImpl();
exports.default = userRepository;
//# sourceMappingURL=repositories.js.map