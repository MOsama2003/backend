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
exports.BlogController = void 0;
const common_1 = require("@nestjs/common");
const blog_service_1 = require("./blog.service");
const pagination_query_dto_1 = require("./dto/pagination-query.dto");
const role_guard_1 = require("../auth/guards/role.guard");
const constants_1 = require("../constants");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
let BlogController = class BlogController {
    constructor(blogService) {
        this.blogService = blogService;
    }
    create(req, articleImage, body) {
        if (!body || Object.keys(body).length === 0) {
            throw new Error('Body is undefined, ensure you are sending form-data correctly.');
        }
        const createBlogDto = {
            articleContent: body.articleContent,
            articleTitle: body.articleTitle,
        };
        return this.blogService.create(articleImage, createBlogDto, req);
    }
    async update(id, req, articleImage, body) {
        if (!body || Object.keys(body).length === 0) {
            throw new Error('Body is undefined, ensure you are sending form-data correctly.');
        }
        const updateBlogDto = {
            articleContent: body.articleContent,
            articleTitle: body.articleTitle,
        };
        return this.blogService.update(id, updateBlogDto, articleImage, req);
    }
    findAll(paginationQuery) {
        return this.blogService.findAll(paginationQuery);
    }
    findOne(id) {
        return this.blogService.findOne(+id);
    }
    remove(id) {
        return this.blogService.remove(+id);
    }
};
exports.BlogController = BlogController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Write Article ( Counsellar only )' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                articleContent: { type: 'string' },
                articleTitle: { type: 'string' },
                articleImage: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Article created successfully' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('articleImage')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Edit Article (Counsellar only)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                articleContent: { type: 'string' },
                articleTitle: { type: 'string' },
                articleImage: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article updated successfully' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('articleImage')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], BlogController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('/listing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of Articles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of Articles' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_query_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(new role_guard_1.RoleGuard(constants_1.CONSTANTS.ROLE.ADMIN)),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an Article (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Article deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Article with ID not found',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogController.prototype, "remove", null);
exports.BlogController = BlogController = __decorate([
    (0, common_1.Controller)('blog'),
    __metadata("design:paramtypes", [blog_service_1.BlogService])
], BlogController);
//# sourceMappingURL=blog.controller.js.map