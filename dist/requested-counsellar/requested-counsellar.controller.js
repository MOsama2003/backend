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
exports.RequestedCounsellarController = void 0;
const common_1 = require("@nestjs/common");
const requested_counsellar_service_1 = require("./requested-counsellar.service");
const pagination_query_dto_1 = require("./dto/pagination-query.dto");
const constants_1 = require("../constants");
const role_guard_1 = require("../auth/guards/role.guard");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
let RequestedCounsellarController = class RequestedCounsellarController {
    constructor(requestedCounsellarService) {
        this.requestedCounsellarService = requestedCounsellarService;
    }
    create(resume, body) {
        if (!body || Object.keys(body).length === 0) {
            throw new Error('Body is undefined, ensure you are sending form-data correctly.');
        }
        const createRequestedCounsellarDto = {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            endTime: body.endTime,
            expertise: body.expertise,
            startTime: body.startTime,
            workingDays: body.workingDays,
            yoe: body.yoe,
        };
        return this.requestedCounsellarService.create(resume, createRequestedCounsellarDto);
    }
    remove(id) {
        return this.requestedCounsellarService.remove(+id);
    }
    findAll(paginationQuery) {
        return this.requestedCounsellarService.findAll(paginationQuery);
    }
    findAllApprovedCounsellars(paginationQuery) {
        return this.requestedCounsellarService.findAllApprovedCounsellar(paginationQuery);
    }
    findCounsellar(id) {
        return this.requestedCounsellarService.findCounsellarById(+id);
    }
};
exports.RequestedCounsellarController = RequestedCounsellarController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a counsellor request' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
                endTime: { type: 'string', example: '12:00' },
                expertise: { type: 'string', example: 'Agriculture specialist' },
                startTime: { type: 'string', example: '10:00' },
                workingDays: { type: 'string', example: '1,2,3,4' },
                yoe: { type: 'string', example: '11' },
                email: { type: 'string', example: 'john@example.com' },
                resume: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Registration request submitted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Email already registered or Resume upload failed',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('resume')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RequestedCounsellarController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(new role_guard_1.RoleGuard(constants_1.CONSTANTS.ROLE.ADMIN)),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a requested counsellor (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'RequestedCounsellar deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'RequestedCounsellar with ID not found',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequestedCounsellarController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('/listing'),
    (0, common_1.UseGuards)(new role_guard_1.RoleGuard(constants_1.CONSTANTS.ROLE.ADMIN)),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of requested counsellors' }),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of requested counsellors (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of requested counsellors' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], RequestedCounsellarController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/approved-counsellar-listing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of requested counsellors' }),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of requested counsellors (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of requested counsellors' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], RequestedCounsellarController.prototype, "findAllApprovedCounsellars", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RequestedCounsellarController.prototype, "findCounsellar", null);
exports.RequestedCounsellarController = RequestedCounsellarController = __decorate([
    (0, swagger_1.ApiTags)('Requested Counsellar'),
    (0, common_1.Controller)('requested-counsellar'),
    __metadata("design:paramtypes", [requested_counsellar_service_1.RequestedCounsellarService])
], RequestedCounsellarController);
//# sourceMappingURL=requested-counsellar.controller.js.map