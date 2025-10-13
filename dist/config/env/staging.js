"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const staging = {
    NODE_ENV: process.env.DIARY_NODE_ENV,
    PORT: process.env.DIARY_PORT,
    DATABASE_URL: process.env.DIARY_DEV_DATABASE_URL,
    PAPERTRAIL_HOST: process.env.DIARY_DEV_PAPERTRAIL_HOST,
    PAPERTRAIL_PORT: process.env.DIARY_DEV_PAPERTRAIL_PORT,
    AUTH_SECRET: process.env.DIARY_JWT_SECRET,
    CRYPTO_SECRET: process.env.DIARY_CRYPTO_SECRET,
    CRYPTO_TIME_STEP: process.env.DIARY_CRYPTO_TIME_STEP,
    CRYPTO_OTP_LENGTH: process.env.DIARY_CRYPTO_OTP_LENGTH,
    CRYPTO_HASH_ALGO: process.env.DIARY_CRYPTO_HASH_ALGO,
    SALT_ROUND: process.env.DIARY_SALT_ROUND,
    REFRESH_SECRET: process.env.DIARY_JWT_SECRET,
    RESET_SECRET: process.env.DIARY_JWT_SECRET,
    CLOUDINARY_NAME: process.env.DIARY_CLOUDINARY_NAME,
    CLOUDINARY_KEY: process.env.DIARY_CLOUDINARY_KEY,
    CLOUDINARY_SECRET: process.env.DIARY_CLOUDINARY_SECRET,
};
exports.default = staging;
//# sourceMappingURL=staging.js.map