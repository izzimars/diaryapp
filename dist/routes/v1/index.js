"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("../../modules/diary/routes"));
const routes_2 = __importDefault(require("../../modules/authentication/routes"));
const routes_3 = __importDefault(require("../../modules/admin/routes"));
const appRouter = express_1.default.Router();
appRouter.use('/auth', routes_2.default);
appRouter.use('/diary', routes_1.default);
appRouter.use('/admin', routes_3.default);
exports.Router = appRouter;
//# sourceMappingURL=index.js.map