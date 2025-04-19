import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import { CreateRequestedCounsellarDto } from './dto/create-requested-counsellar.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestedCounsellar } from './entities/requested-counsellar.entity';
import { ILike, Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MailService } from 'src/mail/mail.service';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class RequestedCounsellarService {
  constructor(
    @InjectRepository(RequestedCounsellar)
    private readonly requestedCounsellarRepository: Repository<RequestedCounsellar>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly mailService: MailService,
  ) {}

  async create(
    @UploadedFile() resume: Express.Multer.File,
    createRequestedCounsellarDto: CreateRequestedCounsellarDto,
  ) {
    const {
      email,
      firstName,
      lastName,
      expertise,
      yoe,
      endTime,
      startTime,
      workingDays,
    } = createRequestedCounsellarDto;
    const existingUser = await this.requestedCounsellarRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered!');
    }

    let resumeUrl = '';
    if (resume) {
      const uploadedResume = await this.cloudinaryService.uploadFile(resume);
      if (!uploadedResume) {
        throw new BadRequestException('Resume upload failed');
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
      .catch((err) =>
        console.error(`Error sending welcome email: ${err.message}`),
      );

    return {
      message: 'Registration request submitted successfully',
      user: newUser,
    };
  }

  async remove(id: number) {
    const user = await this.requestedCounsellarRepository.findOne({
      where: { id, isApproved: false },
    });
    if (!user) {
      throw new BadRequestException(
        `RequestedCounsellar with ID ${id} not found.`,
      );
    }

    const deleteResult = await this.requestedCounsellarRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new BadRequestException(
        `Failed to delete RequestedCounsellar with ID ${id}.`,
      );
    }
    if (user.email) {
      await this.mailService
        .sendRejectionMailToRequestedCounsellar(user.email, user.firstName)
        .catch((err) =>
          console.error(`Error sending rejection email: ${err.message}`),
        );
    }
    return { message: 'RequestedCounsellar deleted successfully' };
  }

  async findCounsellarById(id: number) {
    try {
      const counsellor = await this.requestedCounsellarRepository.findOne({
        where: { id },
        relations: ['user']
      });

      if (!counsellor) {
        throw new NotFoundException(
          `Requested Counsellor with id ${id} not found.`,
        );
      }

      return counsellor;
    } catch (error) {
      console.error(`Error fetching Requested Counsellor by id ${id}:`, error);
      throw new InternalServerErrorException(
        'Something went wrong while fetching the Requested Counsellor.',
      );
    }
  }

  async find(email: string) {
    return this.requestedCounsellarRepository.find({ where: { email } });
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10, search = '' } = paginationQuery;

    try {
      const currentPage = Math.max(1, page);
      const take = Math.max(1, limit);
      const skip = (currentPage - 1) * take;

      const searchFilters = search
        ? [{ email: ILike(`%${search}%`) }, { firstName: ILike(`%${search}%`) }]
        : [];

      const [users, total] =
        await this.requestedCounsellarRepository.findAndCount({
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
    } catch (error) {
      console.error('Error fetching Requested Counsellar:', error);
      throw new InternalServerErrorException(
        'Something went wrong while fetching Requested Counsellar.',
      );
    }
  }

  async findAllApprovedCounsellar(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10 } = paginationQuery;

    const currentPage = Math.max(1, page);
    const take = Math.max(1, limit);
    const skip = (currentPage - 1) * take;

    try {
      const [counsellors, total] =
        await this.requestedCounsellarRepository.findAndCount({
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
    } catch (error) {
      console.error('Error fetching approved counsellors:', error);
      throw new InternalServerErrorException(
        'Something went wrong while fetching approved counsellors.',
      );
    }
  }
}
