"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const role_guard_1 = require("../auth/guards/role.guard");
const constants_1 = require("../constants");
const swagger_1 = require("@nestjs/swagger");
const pagination_query_dto_1 = require("./dto/pagination-query.dto");
const platform_express_1 = require("@nestjs/platform-express");
const create_non_device_owner_dto_1 = require("./dto/create-non-device-owner.dto");
const changePasswordDto_1 = require("./dto/changePasswordDto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    createCounsellar(id) {
        return this.userService.approveCounsellarById(+id);
    }
    createDeviceOwner(createUserDto) {
        return this.userService.create(createUserDto);
    }
    create(createNonDeviceOwnerDto) {
        return this.userService.registerNonDeviceOwner(createNonDeviceOwnerDto);
    }
    async findAll(paginationQuery) {
        return this.userService.findAll(paginationQuery);
    }
    async findUserById(req) {
        return this.userService.findById(+req.user.id);
    }
    async disableUser(id) {
        return this.userService.softDeleteUser(id);
    }
    async setAvatar(file, req) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        return this.userService.setAvatar(req.user.id, file);
    }
    async changePassword(req, body) {
        return this.userService.changePassword(req.user.id, body.oldPassword, body.newPassword);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('/register-counsellar/:id'),
    (0, common_1.UseGuards)(new role_guard_1.RoleGuard(constants_1.CONSTANTS.ROLE.ADMIN)),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully registered' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden: Only admins can register users',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "createCounsellar", null);
__decorate([
    (0, common_1.Post)('/register-device-owner'),
    (0, common_1.UseGuards)(new role_guard_1.RoleGuard(constants_1.CONSTANTS.ROLE.ADMIN)),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new device owner (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully registered' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden: Only admins can register users',
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "createDeviceOwner", null);
__decorate([
    (0, common_1.Post)('/register-non-device-owner'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully registered' }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden: Only admins can register users',
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_non_device_owner_dto_1.CreateNonDeviceOwnerDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/listing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(new role_guard_1.RoleGuard(constants_1.CONSTANTS.ROLE.ADMIN)),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated list of users with search' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users fetched successfully' }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        example: 1,
        description: 'Page number (default: 1)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        example: 10,
        description: 'Number of items per page (default: 10)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        example: 'john',
        description: 'Search users by email, name, or deviceId',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/profile'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get any user using Id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users fetched successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserById", null);
__decorate([
    (0, common_1.Patch)('/change-status-user/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(new role_guard_1.RoleGuard(constants_1.CONSTANTS.ROLE.ADMIN)),
    (0, swagger_1.ApiOperation)({ summary: 'Disable user by deviceId (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User successfully disabled',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden: Only admins can disable users',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "disableUser", null);
__decorate([
    (0, common_1.Patch)('avatar'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Set user avatar' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Avatar successfully uploaded' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid file' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setAvatar", null);
__decorate([
    (0, common_1.Put)('change-password'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Change user password' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Old password is incorrect' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, changePasswordDto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map