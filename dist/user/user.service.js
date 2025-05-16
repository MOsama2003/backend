"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt = __importStar(require("bcrypt"));
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const requested_counsellar_entity_1 = require("../requested-counsellar/entities/requested-counsellar.entity");
const typeorm_2 = require("typeorm");
const constants_1 = require("../constants");
const mail_service_1 = require("../mail/mail.service");
const user_entity_1 = require("./entities/user.entity");
const stream_service_1 = require("../stream/stream.service");
let UserService = class UserService {
    constructor(userRepository, counsellarRepository, cloudinaryService, mailService, streamService) {
        this.userRepository = userRepository;
        this.counsellarRepository = counsellarRepository;
        this.cloudinaryService = cloudinaryService;
        this.mailService = mailService;
        this.streamService = streamService;
    }
    generateRandomPassword(length = 10) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
    }
    async create(createUserDto) {
        const { email, deviceId } = createUserDto;
        try {
            const existingUser = await this.userRepository.findOne({
                where: [{ email }, { deviceId }],
            });
            if (existingUser) {
                throw new common_1.BadRequestException('Email or Device Id already registered!');
            }
            const randomPassword = this.generateRandomPassword();
            const password = await bcrypt.hash(randomPassword, 10);
            const newUser = this.userRepository.create({
                ...createUserDto,
                role: constants_1.CONSTANTS.ROLE.FARMER,
                password,
                createdAt: String(new Date().toISOString()),
            });
            await this.mailService
                .sendWelcomeEmail(newUser.email, newUser.firstName, password)
                .catch((err) => console.error(`Error sending welcome email: ${err.message}`));
            await this.streamService.createStreamUser({
                id: newUser.id,
                name: newUser.firstName,
                email: newUser.email,
            });
            return await this.userRepository.save(newUser);
        }
        catch (error) {
            console.error('Error creating user:', error);
            throw new common_1.InternalServerErrorException('Something went wrong while creating the user.');
        }
    }
    findByEmail(email) {
        return this.userRepository.findOne({
            where: { email },
        });
    }
    async findAll(paginationQuery) {
        const { page = 1, limit = 10, search = '' } = paginationQuery;
        try {
            const currentPage = Math.max(1, page);
            const take = Math.max(1, limit);
            const skip = (currentPage - 1) * take;
            const searchFilters = search
                ? [
                    { email: (0, typeorm_2.ILike)(`%${search}%`), role: constants_1.CONSTANTS.ROLE.FARMER },
                    { firstName: (0, typeorm_2.ILike)(`%${search}%`), role: constants_1.CONSTANTS.ROLE.FARMER },
                    { deviceId: (0, typeorm_2.ILike)(`%${search}%`), role: constants_1.CONSTANTS.ROLE.FARMER },
                ]
                : [{ role: constants_1.CONSTANTS.ROLE.FARMER }];
            const [users, total] = await this.userRepository.findAndCount({
                where: searchFilters.length ? searchFilters : undefined,
                skip,
                take,
                select: [
                    'id',
                    'email',
                    'firstName',
                    'deviceId',
                    'role',
                    'createdAt',
                    'lastName',
                    'disabled',
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
            console.error('Error fetching users:', error);
            throw new common_1.InternalServerErrorException('Something went wrong while fetching users.');
        }
    }
    async softDeleteUser(id) {
        const user = await this.userRepository.findOne({ where: { id: +id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.disabled = !user.disabled;
        return this.userRepository.save(user);
    }
    findById(id) {
        return this.userRepository.findOne({
            where: { id: id },
            select: [
                'avatar',
                'firstName',
                'id',
                'email',
                'role',
                'deviceId',
                'lastName',
            ],
        });
    }
    async findByIdForNotification(id) {
        return await this.userRepository.findOne({ where: { id: id } });
    }
    async setAvatar(userId, file) {
        try {
            const uploadedFile = await this.cloudinaryService.uploadFile(file);
            if (!uploadedFile) {
                throw new common_1.BadRequestException('File upload failed');
            }
            await this.userRepository.update(userId, { avatar: uploadedFile.url });
            return {
                message: 'Avatar successfully uploaded',
                avatarUrl: uploadedFile.url,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Error uploading file to Cloudinary');
        }
    }
    findByDeviceId(id) {
        return this.userRepository.findOne({ where: { deviceId: id } });
    }
    async approveCounsellarById(id) {
        const counsellar = await this.counsellarRepository.findOne({
            where: { id },
        });
        if (!counsellar) {
            throw new common_1.BadRequestException(`RequestedCounsellar with ID ${id} not found.`);
        }
        if (counsellar.isApproved) {
            throw new common_1.BadRequestException('Counsellar already approved.');
        }
        const existingUser = await this.userRepository.findOne({
            where: { email: counsellar.email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered.');
        }
        const randomPassword = this.generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        const newUser = this.userRepository.create({
            email: counsellar.email,
            firstName: counsellar.firstName,
            lastName: counsellar.lastName,
            role: constants_1.CONSTANTS.ROLE.COUNSELLAR,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        });
        const savedUser = await this.userRepository.save(newUser);
        await this.streamService.createStreamUser({
            id: savedUser.id,
            name: savedUser.firstName,
            email: savedUser.email,
        });
        await this.mailService
            .sendCredentialsMailToRequestedCounsellar(savedUser.email, savedUser.firstName, savedUser.email, randomPassword)
            .catch((err) => console.error(`Error sending welcome email: ${err.message}`));
        counsellar.isApproved = true;
        counsellar.user = savedUser;
        await this.counsellarRepository.save(counsellar);
        return {
            message: 'Counsellar approved & user registered successfully.',
            counsellarId: counsellar.id,
            userId: savedUser.id,
        };
    }
    async registerNonDeviceOwner(createNonDeviceOwnerDto) {
        const { email, password } = createNonDeviceOwnerDto;
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered!');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({
            ...createNonDeviceOwnerDto,
            role: constants_1.CONSTANTS.ROLE.FARMER,
            password: hashedPassword,
            createdAt: String(new Date().toISOString()),
        });
        await this.mailService
            .sendWelcomeEmailNonDevice(newUser.email, newUser.firstName)
            .catch((err) => console.error(`Error sending welcome email: ${err.message}`));
        const userr = await this.userRepository.save(newUser);
        await this.streamService.createStreamUser({
            id: userr.id,
            name: userr.firstName,
            email: userr.email,
        });
        return userr;
    }
    async findUserByIds(userIds) {
        return await this.userRepository.findByIds(userIds);
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ['id', 'password'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new common_1.BadRequestException('Old password is incorrect');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.userRepository.update(userId, { password: hashedNewPassword });
        return { message: 'Password updated successfully' };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(requested_counsellar_entity_1.RequestedCounsellar)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService,
        mail_service_1.MailService,
        stream_service_1.StreamService])
], UserService);
//# sourceMappingURL=user.service.js.map