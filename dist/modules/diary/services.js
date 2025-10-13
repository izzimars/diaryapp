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
exports.DiaryServiceImpl = void 0;
const repositories_1 = __importDefault(require("./repositories"));
const errors_1 = require("../../shared/errors");
class DiaryServiceImpl {
    constructor(diaryRepository) {
        this.diaryRepository = diaryRepository;
    }
    createDiary(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.diaryRepository.createDiary(params);
        });
    }
    getDiary(id, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.diaryRepository.getDiary(id, searchTerm);
            if (result instanceof errors_1.NotFoundException) {
                return result;
            }
            return result;
        });
    }
    getDiariesByUser(userId_1, searchTerm_1) {
        return __awaiter(this, arguments, void 0, function* (userId, searchTerm, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const [diaries, countResult] = yield Promise.all([
                this.diaryRepository.getDiariesByUser(userId, searchTerm, limit, offset),
                this.diaryRepository.getDiariesByUserCount(userId, searchTerm),
            ]);
            const totalItems = countResult.total;
            const totalPages = Math.ceil(totalItems / limit);
            return {
                diaries,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            };
        });
    }
    updateDiary(id, userId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingDiary = yield this.diaryRepository.getDiary(id);
            if (existingDiary instanceof errors_1.NotFoundException) {
                return existingDiary;
            }
            if (existingDiary.user_id !== userId) {
                return new errors_1.NotFoundException('Diary not found or access denied');
            }
            yield this.diaryRepository.updateDiary(id, params);
        });
    }
    deleteDiary(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingDiary = yield this.diaryRepository.getDiary(id);
            if (existingDiary instanceof errors_1.NotFoundException) {
                return existingDiary;
            }
            if (existingDiary.user_id !== userId) {
                return new errors_1.NotFoundException('Diary not found or access denied');
            }
            yield this.diaryRepository.deleteDiary(id);
        });
    }
}
exports.DiaryServiceImpl = DiaryServiceImpl;
const diaryServices = new DiaryServiceImpl(repositories_1.default);
exports.default = diaryServices;
//# sourceMappingURL=services.js.map