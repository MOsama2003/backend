import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

interface AuthenticatedRequest extends Request {
    user?: { role: string }; // ✅ Define the user property
}

export class RoleGuard implements CanActivate {
    private role: string;

    constructor(role: string) {
        this.role = role;
    }

    canActivate(context: ExecutionContext): boolean {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<AuthenticatedRequest>();
        if (!request.user) {
            return false;
        }
        return this.role === request.user.role;
    }
}
