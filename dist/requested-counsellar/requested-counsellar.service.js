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
exports.RequestedCounsellarService = void 0;
const common_1 = require("@nestjs/common");
const create_requested_counsellar_dto_1 = require("./dto/create-requested-counsellar.dto");
const typeorm_1 = require("@nestjs/typeorm");
const requested_counsellar_entity_1 = require("./entities/requested-counsellar.entity");
const typeorm_2 = require("typeorm");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const mail_service_1 = require("../mail/mail.service");
let RequestedCounsellarService = class RequestedCounsellarService {
    constructor(requestedCounsellarRepository, cloudinaryService, mailService) {
        this.requestedCounsellarRepository = requestedCounsellarRepository;
        this.cloudinaryService = cloudinaryService;
        this.mailService = mailService;
    }
    async create(resume, createRequestedCounsellarDto) {
        const { email, firstName, lastName, expertise, yoe, endTime, startTime, workingDays, } = createRequestedCounsellarDto;
        const existingUser = await this.requestedCounsellarRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered!');
        }
        let resumeUrl = '';
        if (resume) {
            const uploadedResume = await this.cloudinaryService.uploadFile(resume);
            if (!uploadedResume) {
                throw new common_1.BadRequestException('Resume upload failed');
            }
            resumeUrl = uploadedResume.url;
        }
        const newUser = this.requestedCounsellarRepository.create({
            email,
            firstName,
            lastName,
            resume: resumeUrl,
            isApproved: false,
            endTime,
            expertise,
            startTime,
            workingDays,
            yoe,
        });
        await this.requestedCounsellarRepository.save(newUser);
        await this.mailService
            .sendMailToRequestedCounsellar(newUser.email, newUser.firstName)
            .catch((err) => console.error(`Error sending welcome email: ${err.message}`));
        return {
            message: 'Registration request submitted successfully',
            user: newUser,
        };
    }
    async remove(id) {
        const user = await this.requestedCounsellarRepository.findOne({
            where: { id, isApproved: false },
        });
        if (!user) {
            throw new common_1.BadRequestException(`RequestedCounsellar with ID ${id} not found.`);
        }
        const deleteResult = await this.requestedCounsellarRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new common_1.BadRequestException(`Failed to delete RequestedCounsellar with ID ${id}.`);
        }
        if (user.email) {
            await this.mailService
                .sendRejectionMailToRequestedCounsellar(user.email, user.firstName)
                .catch((err) => console.error(`Error sending rejection email: ${err.message}`));
        }
        return { message: 'RequestedCounsellar deleted successfully' };
    }
    async findCounsellarById(id) {
        try {
            const counsellor = await this.requestedCounsellarRepository.findOne({
                where: { id },
                relations: ['user']
            });
            if (!counsellor) {
                throw new common_1.NotFoundException(`Requested Counsellor with id ${id} not found.`);
            }
            return counsellor;
        }
        catch (error) {
            console.error(`Error fetching Requested Counsellor by id ${id}:`, error);
            throw new common_1.InternalServerErrorException('Something went wrong while fetching the Requested Counsellor.');
        }
    }
    async find(email) {
        return this.requestedCounsellarRepository.find({ where: { email } });
    }
    async findAll(paginationQuery) {
        const { page = 1, limit = 10, search = '' } = paginationQuery;
        try {
            const currentPage = Math.max(1, page);
            const take = Math.max(1, limit);
            const skip = (currentPage - 1) * take;
            const searchFilters = search
                ? [{ email: (0, typeorm_2.ILike)(`%${search}%`) }, { firstName: (0, typeorm_2.ILike)(`%${search}%`) }]
                : [];
            const [users, total] = await this.requestedCounsellarRepository.findAndCount({
                where: searchFilters.length ? searchFilters : undefined,
                skip,
                take,
                select: [
                    'id',
                    'email',
                    'firstName',
                    'lastName',
                    'isApproved',
                    'expertise',
                    'yoe',
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
                    itemCount: users.length,
                },
                data: users,
            };
        }
        catch (error) {
            console.error('Error fetching Requested Counsellar:', error);
            throw new common_1.InternalServerErrorException('Something went wrong while fetching Requested Counsellar.');
        }
    }
    async findAllApprovedCounsellar(paginationQuery) {
        const { page = 1, limit = 10 } = paginationQuery;
        const currentPage = Math.max(1, page);
        const take = Math.max(1, limit);
        const skip = (currentPage - 1) * take;
        try {
            const [counsellors, total] = await this.requestedCounsellarRepository.findAndCount({
                where: { isApproved: true },
                relations: ['user'],
                skip,
                take,
            });
            const result = counsellors.map((counsellor) => ({
                id: counsellor.id,
                email: counsellor.email,
                firstName: counsellor.firstName,
                lastName: counsellor.lastName,
                startTime: counsellor.startTime,
                endTime: counsellor.endTime,
                expertise: counsellor.expertise,
                workingDays: counsellor.workingDays,
                yoe: counsellor.yoe,
                avatar: counsellor.user?.avatar || null,
            }));
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
                    itemCount: result.length,
                },
                data: result,
            };
        }
        catch (error) {
            console.error('Error fetching approved counsellors:', error);
            throw new common_1.InternalServerErrorException('Something went wrong while fetching approved counsellors.');
        }
    }
};
exports.RequestedCounsellarService = RequestedCounsellarService;
__decorate([
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_requested_counsellar_dto_1.CreateRequestedCounsellarDto]),
    __metadata("design:returntype", Promise)
], RequestedCounsellarService.prototype, "create", null);
exports.RequestedCounsellarService = RequestedCounsellarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(requested_counsellar_entity_1.RequestedCounsellar)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService,
        mail_service_1.MailService])
], RequestedCounsellarService);
//# sourceMappingURL=requested-counsellar.service.js.map