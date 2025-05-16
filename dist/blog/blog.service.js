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
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const create_blog_dto_1 = require("./dto/create-blog.dto");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const typeorm_1 = require("@nestjs/typeorm");
const blog_entity_1 = require("./entities/blog.entity");
const typeorm_2 = require("typeorm");
const firebase_service_1 = require("../notifications/firebase.service");
let BlogService = class BlogService {
    constructor(blogRepository, cloudinaryService, notificationService) {
        this.blogRepository = blogRepository;
        this.cloudinaryService = cloudinaryService;
        this.notificationService = notificationService;
    }
    async update(id, updateBlogDto, newImage, req) {
        const blog = await this.blogRepository.findOne({ where: { id } });
        if (!blog) {
            throw new common_1.BadRequestException('Blog not found.');
        }
        const { articleContent, articleTitle } = updateBlogDto;
        let updatedImage = blog.articleImage;
        if (newImage) {
            const uploaded = await this.cloudinaryService.uploadFile(newImage);
            if (!uploaded || !uploaded.url) {
                throw new common_1.BadRequestException('Image upload failed');
            }
            updatedImage = uploaded.url;
        }
        const updatedArticle = {
            ...blog,
            articleContent: articleContent ?? blog.articleContent,
            articleTitle: articleTitle ?? blog.articleTitle,
            articleImage: updatedImage,
            user: req?.user ?? blog.user,
        };
        await this.blogRepository.save(updatedArticle);
        return {
            message: 'Blog updated successfully!',
            article: updatedArticle,
        };
    }
    async create(articleImage, createBlogDto, req) {
        const { articleContent, articleTitle } = createBlogDto;
        let Image = '';
        if (articleImage) {
            const articleImageURL = await this.cloudinaryService.uploadFile(articleImage);
            if (!articleImageURL) {
                throw new common_1.BadRequestException('Resume upload failed');
            }
            Image = articleImageURL.url;
        }
        const article = await this.blogRepository.create({
            articleContent,
            articleImage: Image,
            articlePublishDate: String(new Date().toISOString()),
            user: req.user,
            articleTitle,
            isUrdu: true
        });
        await this.blogRepository.save(article);
        await this.notificationService.sendGlobalNotification({
            title: 'New Article Added',
            body: `${articleTitle} is added`,
            data: { articleId: String(article.id) },
        });
        return {
            message: 'Article created successfully!',
            article,
        };
    }
    async findAll(paginationQuery) {
        const { page = 1, limit = 10, search = '', isUrdu } = paginationQuery;
        try {
            const currentPage = Math.max(1, page);
            const take = Math.max(1, limit);
            const skip = (currentPage - 1) * take;
            const searchFilters = search
                ? [
                    { articleTitle: (0, typeorm_2.ILike)(`%${search}%`) },
                ]
                : [];
            const urduFilter = isUrdu
                ? { isUrdu: true }
                : {};
            const whereConditions = [
                ...(searchFilters.length ? searchFilters : []),
                ...(isUrdu ? [urduFilter] : [])
            ];
            const [article, total] = await this.blogRepository.findAndCount({
                where: whereConditions.length ? whereConditions : undefined,
                skip,
                take,
                relations: ['user'],
                select: [
                    'id',
                    'articleTitle',
                    'articleContent',
                    'articleImage',
                    'user',
                    'articlePublishDate',
                    'isUrdu'
                ],
            });
            const pageCount = Math.ceil(total / take);
            const hasNextPage = currentPage < pageCount;
            const hasPrevPage = currentPage > 1;
            return {
                metaData: {
                    totalCount: total,
                    pageCount,
                    page: currentPage,
                    take,
                    hasNextPage,
                    hasPrevPage,
                    itemCount: article.length,
                },
                data: article,
            };
        }
        catch (error) {
            console.error('Error fetching articles:', error);
            throw new common_1.InternalServerErrorException('Something went wrong while fetching articles.');
        }
    }
    findOne(id) {
        return this.blogRepository.findOne({ where: { id }, relations: ['user'] });
    }
    remove(id) {
        return this.blogRepository.delete(id);
    }
};
exports.BlogService = BlogService;
__decorate([
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_blog_dto_1.CreateBlogDto, Object, Object]),
    __metadata("design:returntype", Promise)
], BlogService.prototype, "update", null);
__decorate([
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_blog_dto_1.CreateBlogDto, Object]),
    __metadata("design:returntype", Promise)
], BlogService.prototype, "create", null);
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(blog_entity_1.Blog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService,
        firebase_service_1.FirebaseService])
], BlogService);
//# sourceMappingURL=blog.service.js.map