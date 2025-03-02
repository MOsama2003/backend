import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
    const { email, firstName, lastName } = createRequestedCounsellarDto;
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
      });

      await this.requestedCounsellarRepository.save(newUser);

      this.mailService
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
      where: { id },
    });
    if (!user) {
      throw new BadRequestException(`RequestedCounsellar with ID ${id} not found.`);
    }

    const deleteResult = await this.requestedCounsellarRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new BadRequestException(`Failed to delete RequestedCounsellar with ID ${id}.`);
    }
    if (user.email) {
      this.mailService
        .sendRejectionMailToRequestedCounsellar(user.email, user.firstName)
        .catch((err) =>
          console.error(`Error sending rejection email: ${err.message}`),
        );
    }  
    return { message: 'RequestedCounsellar deleted successfully' };
  }
  

  async removeAfterRegisteration(email: string) {
    const user = await this.requestedCounsellarRepository.findOne({
      where: { email },
    });
  
    if (!user) {
      throw new BadRequestException(`RequestedCounsellar with email ${email} not found.`);
    }
  
    const deleteResult = await this.requestedCounsellarRepository.delete(user.id);
  
    if (deleteResult.affected === 0) {
      throw new BadRequestException(`Failed to delete RequestedCounsellar with email ${email}.`);
    }
    return { message: 'RequestedCounsellar deleted successfully' };
  }
  

  async find(email: string){
    return this.requestedCounsellarRepository.find({ where: {email} })
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10, search = '' } = paginationQuery;

    try {
      const currentPage = Math.max(1, page);
      const take = Math.max(1, limit);
      const skip = (currentPage - 1) * take;

      const searchFilters = search
        ? [
            { email: ILike(`%${search}%`) },
            { firstName: ILike(`%${search}%`) },
            { deviceId: ILike(`%${search}%`) },
          ]
        : [];

      const [users, total] =
        await this.requestedCounsellarRepository.findAndCount({
          where: searchFilters.length ? searchFilters : undefined,
          skip,
          take,
          select: [ 'id' ,'email', 'firstName', 'lastName', 'resume'],
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
}
