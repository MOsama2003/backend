"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleGuard = void 0;
class RoleGuard {
    constructor(role) {
        this.role = role;
    }
    canActivate(context) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        if (!request.user) {
            return false;
        }
        return this.role === request.user.role;
    }
}
exports.RoleGuard = RoleGuard;
//# sourceMappingURL=role.guard.js.map