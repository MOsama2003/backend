import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ILike, Repository } from 'typeorm';
import { CONSTANTS } from '../constants';
import { MailService } from '../mail/mail.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, deviceId, password } = createUserDto;
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: [{ email }, { deviceId }],
      });
      if (existingUser) {
        throw new BadRequestException('Email or Device Id already registered!');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user object
      const newUser = this.userRepository.create({
        ...createUserDto,
        role: CONSTANTS.ROLE.FARMER,
        password: hashedPassword,
        createdAt: String(new Date),
      });

      // Send a welcome email asynchronously, without blocking the response
      this.mailService.sendWelcomeEmail(newUser.email, newUser.firstName)
        .catch(err => console.error(`Error sending welcome email: ${err.message}`)); // log the error without crashing the server

      // Save the new user to the database
      return await this.userRepository.save(newUser);

    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Something went wrong while creating the user.');
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
      throw new InternalServerErrorException('Something went wrong while fetching users.');
    }
  }

  async softDeleteUser(id : string){
    const user = await this.userRepository.findOne({ where: { id : +id}})
    if (!user) throw new NotFoundException('User not found');
    user.disabled = true;
    return this.userRepository.save(user);
  }

  findById(id : number){
    return this.userRepository.findOne({where: {id:id}});
  }

  async setAvatar(userId: number, avatarUrl: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.avatar = avatarUrl;  // Save the avatar URL
    return this.userRepository.save(user);  // Save user with updated avatar
  }

}
