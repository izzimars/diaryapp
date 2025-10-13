"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCustomError = exports.NotFoundException = exports.UnAuthorizedException = exports.ForbiddenException = exports.BadException = exports.ConflictException = exports.InternalServerErrorException = exports.HttpException = void 0;
class HttpException extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
exports.HttpException = HttpException;
class InternalServerErrorException extends HttpException {
    constructor(customMessage) {
        super(500, customMessage !== null && customMessage !== void 0 ? customMessage : 'Internal Server Error');
    }
}
exports.InternalServerErrorException = InternalServerErrorException;
class ConflictException extends HttpException {
    constructor(customMessage) {
        super(409, customMessage !== null && customMessage !== void 0 ? customMessage : 'conflict');
    }
}
exports.ConflictException = ConflictException;
class BadException extends HttpException {
    constructor(customMessage) {
        super(400, customMessage !== null && customMessage !== void 0 ? customMessage : 'Bad Request');
    }
}
exports.BadException = BadException;
class ForbiddenException extends HttpException {
    constructor(customMessage) {
        super(403, customMessage !== null && customMessage !== void 0 ? customMessage : 'Forbidden');
    }
}
exports.ForbiddenException = ForbiddenException;
class UnAuthorizedException extends HttpException {
    constructor(customMessage) {
        super(401, customMessage !== null && customMessage !== void 0 ? customMessage : 'UNAUTHORIZED');
    }
}
exports.UnAuthorizedException = UnAuthorizedException;
class NotFoundException extends HttpException {
    constructor(customMessage) {
        super(404, customMessage !== null && customMessage !== void 0 ? customMessage : 'Not Found');
    }
}
exports.NotFoundException = NotFoundException;
const handleCustomError = (res, error, statusCode) => {
    return res.status(statusCode).json({
        status: 'error',
        statusCode: statusCode,
        message: error.message,
    });
};
exports.handleCustomError = handleCustomError;
//# sourceMappingURL=index.js.map