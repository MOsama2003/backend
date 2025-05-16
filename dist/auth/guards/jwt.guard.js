"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const passport_1 = require("@nestjs/passport");
const constants_1 = require("../../constants");
class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    canActivate(context) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        for (let x = 0; x < constants_1.CONSTANTS.BY_PASS_ROLE.length; x++) {
            if (request.url == constants_1.CONSTANTS.BY_PASS_ROLE[x])
                return true;
        }
        return super.canActivate(context);
    }
}
exports.JwtAuthGuard = JwtAuthGuard;
//# sourceMappingURL=jwt.guard.js.map