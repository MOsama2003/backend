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
import { CreateCounsellarDto } from './dto/create-counsellar.dto';
import { RequestedCounsellarService } from 'src/requested-counsellar/requested-counsellar.service';
import { CreateNonDeviceOwnerDto } from './dto/create-non-device-owner.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly requestedUserService: RequestedCounsellarService,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, deviceId, password } = createUserDto;
    try {
      const existingUser = await this.userRepository.findOne({
        where: [{ email }, { deviceId }],
      });
      if (existingUser) {
        throw new BadRequestException('Email or Device Id already registered!');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.userRepository.create({
        ...createUserDto,
        role: CONSTANTS.ROLE.FARMER,
        password: hashedPassword,
        createdAt: String(new Date().toISOString()),
      });

      await this.mailService
        .sendWelcomeEmail(newUser.email, newUser.firstName)
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
        select: ['id', 'email', 'firstName', 'deviceId', 'role', 'createdAt'],
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
    user.disabled = true;
    return this.userRepository.save(user);
  }

  findById(id: number) {
    return this.userRepository.findOne({ where: { id: id }, select: ['avatar','firstName', 'id', 'email', 'role'] });
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

  async registerCounsellar(createCounsellarDto: CreateCounsellarDto) {
    const { email, password } = createCounsellarDto;
    const existingUser = await this.userRepository.findOne({
      where: [{ email }],
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered!');
    }
    const requestedUser = await this.requestedUserService.find(email);
    if (!requestedUser) {
      throw new BadRequestException('User is not Requested!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...createCounsellarDto,
      role: CONSTANTS.ROLE.COUNSELLAR,
      password: hashedPassword,
      createdAt: String(new Date().toISOString()),
    });

    await this.mailService
      .sendCredentialsMailToRequestedCounsellar(
        newUser.email,
        newUser.firstName,
        email,
        password,
      )
      .catch((err) =>
        console.error(`Error sending welcome email: ${err.message}`),
      );

    await this.requestedUserService.removeAfterRegisteration(email);

    return await this.userRepository.save(newUser);
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
      .sendWelcomeEmail(newUser.email, newUser.firstName)
      .catch((err) =>
        console.error(`Error sending welcome email: ${err.message}`),
      );

    return await this.userRepository.save(newUser);
  }

  async findUserByIds(userIds: Number[]){
    return await this.userRepository.findByIds(userIds);
  }
}
