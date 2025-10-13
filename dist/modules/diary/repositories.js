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
exports.DiaryRepositoryImpl = void 0;
const errors_1 = require("../../shared/errors");
const database_1 = require("../../config/database");
const diaryParams = __importStar(require("./entities"));
const query_1 = __importDefault(require("./query"));
class DiaryRepositoryImpl {
    createDiary(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_1.db.tx((t) => __awaiter(this, void 0, void 0, function* () {
                const result = yield t.one(query_1.default.createDiary, params);
                return { id: result.id };
            }));
        });
    }
    getDiary(id, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const diary = yield database_1.db.oneOrNone(query_1.default.getDiary, [
                id,
                searchTerm || null,
            ]);
            if (!diary) {
                return new errors_1.NotFoundException('Diary not found');
            }
            return new diaryParams.DiaryEntity({
                id: diary.id,
                name: diary.name,
                content: diary.content,
                user_id: diary.user_id,
                description: diary.description,
                image_url: diary.image_url,
                created_at: diary.created_at,
                updated_at: diary.updated_at,
            });
        });
    }
    getDiariesByUser(userId, searchTerm, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const diaries = yield database_1.db.any(query_1.default.getDiariesByUser, [
                userId,
                searchTerm || null,
                limit || 10,
                offset || 0,
            ]);
            return diaries.map((diary) => new diaryParams.DiaryEntity({
                id: diary.id,
                name: diary.name,
                content: diary.content,
                user_id: diary.user_id,
                description: diary.description,
                image_url: diary.image_url,
                created_at: diary.created_at,
                updated_at: diary.updated_at,
            }));
        });
    }
    getDiariesByUserCount(userId, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.db.one(query_1.default.getDiariesByUserCount, [
                userId,
                searchTerm || null,
            ]);
            return { total: parseInt(result.total) };
        });
    }
    updateDiary(id, params) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.none(query_1.default.updateDiary, [
                params.name,
                params.content,
                params.image_url,
                params.description,
                id,
            ]);
        });
    }
    deleteDiary(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.none(query_1.default.deleteDiary, [id]);
        });
    }
}
exports.DiaryRepositoryImpl = DiaryRepositoryImpl;
const authRepository = new DiaryRepositoryImpl();
exports.default = authRepository;
//# sourceMappingURL=repositories.js.map