import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ILike, Repository } from 'typeorm';
import { CONSTANTS } from '../constants';
import { MailService } from '../mail/mail.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { RequestedCounsellarService } from 'src/requested-counsellar/requested-counsellar.service';
import { CreateNonDeviceOwnerDto } from './dto/create-non-device-owner.dto';
import { RequestedCounsellar } from 'src/requested-counsellar/entities/requested-counsellar.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RequestedCounsellar)
    private readonly counsellarRepository: Repository<RequestedCounsellar>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mailService: MailService,
  ) {}

  private generateRandomPassword(length = 10): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join('');
  }

  async create(createUserDto: CreateUserDto) {
    const { email, deviceId } = createUserDto;
    try {
      const existingUser = await this.userRepository.findOne({
        where: [{ email }, { deviceId }],
      });
      if (existingUser) {
        throw new BadRequestException('Email or Device Id already registered!');
      }

      const randomPassword = this.generateRandomPassword();
      const password = await bcrypt.hash(randomPassword, 10);

      const newUser = this.userRepository.create({
        ...createUserDto,
        role: CONSTANTS.ROLE.FARMER,
        password,
        createdAt: String(new Date().toISOString()),
      });

      await this.mailService
        .sendWelcomeEmail(newUser.email, newUser.firstName, password)
        .catch((err) =>
          console.error(`Error sending welcome email: ${err.message}`),
        );

      return await this.userRepository.save(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException(
        'Something went wrong while creating the user.',
      );
    }
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10, search = '' } = paginationQuery;

    try {
      const currentPage = Math.max(1, page);
      const take = Math.max(1, limit);
      const skip = (currentPage - 1) * take;

      const searchFilters = search
        ? [
            { email: ILike(`%${search}%`), role: CONSTANTS.ROLE.FARMER },
            { firstName: ILike(`%${search}%`), role: CONSTANTS.ROLE.FARMER },
            { deviceId: ILike(`%${search}%`), role: CONSTANTS.ROLE.FARMER },
          ]
        : [{ role: CONSTANTS.ROLE.FARMER }];

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
          'disabled'
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
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new InternalServerErrorException(
        'Something went wrong while fetching users.',
      );
    }
  }

  async softDeleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id: +id } });
    if (!user) throw new NotFoundException('User not found');
    user.disabled = !user.disabled;
    return this.userRepository.save(user);
  }

  findById(id: number) {
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

  async findByIdForNotification(id: number) {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async setAvatar(userId: string | number, file: Express.Multer.File) {
    try {
      const uploadedFile = await this.cloudinaryService.uploadFile(file);
      if (!uploadedFile) {
        throw new BadRequestException('File upload failed');
      }

      await this.userRepository.update(userId, { avatar: uploadedFile.url });
      return {
        message: 'Avatar successfully uploaded',
        avatarUrl: uploadedFile.url,
      };
    } catch (error) {
      throw new BadRequestException('Error uploading file to Cloudinary');
    }
  }

  findByDeviceId(id: string) {
    return this.userRepository.findOne({ where: { deviceId: id } });
  }

  async approveCounsellarById(id: number) {
    const counsellar = await this.counsellarRepository.findOne({
      where: { id },
    });

    if (!counsellar) {
      throw new BadRequestException(
        `RequestedCounsellar with ID ${id} not found.`,
      );
    }

    if (counsellar.isApproved) {
      throw new BadRequestException('Counsellar already approved.');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: counsellar.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered.');
    }

    const randomPassword = this.generateRandomPassword();
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = this.userRepository.create({
      email: counsellar.email,
      firstName: counsellar.firstName,
      lastName: counsellar.lastName,
      role: CONSTANTS.ROLE.COUNSELLAR,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });

    const savedUser = await this.userRepository.save(newUser);

    await this.mailService
      .sendCredentialsMailToRequestedCounsellar(
        savedUser.email,
        savedUser.firstName,
        savedUser.email,
        randomPassword,
      )
      .catch((err) =>
        console.error(`Error sending welcome email: ${err.message}`),
      );

    counsellar.isApproved = true;
    counsellar.user = savedUser;

    await this.counsellarRepository.save(counsellar);

    return {
      message: 'Counsellar approved & user registered successfully.',
      counsellarId: counsellar.id,
      userId: savedUser.id,
    };
  }

  async registerNonDeviceOwner(
    createNonDeviceOwnerDto: CreateNonDeviceOwnerDto,
  ) {
    const { email, password } = createNonDeviceOwnerDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...createNonDeviceOwnerDto,
      role: CONSTANTS.ROLE.FARMER,
      password: hashedPassword,
      createdAt: String(new Date().toISOString()),
    });

    await this.mailService
      .sendWelcomeEmailNonDevice(newUser.email, newUser.firstName)
      .catch((err) =>
        console.error(`Error sending welcome email: ${err.message}`),
      );

    return await this.userRepository.save(newUser);
  }

  async findUserByIds(userIds: Number[]) {
    return await this.userRepository.findByIds(userIds);
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedNewPassword });

    return { message: 'Password updated successfully' };
  }
}
