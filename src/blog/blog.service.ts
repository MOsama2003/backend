import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Req,
  UploadedFile,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { ILike, Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly userService: UserService
  ) {}

  async create(
    @UploadedFile() articleImage: Express.Multer.File,
    createBlogDto: CreateBlogDto,
    @Req() req,
  ) {
    const { articleContent, articleKeyword, articleTitle } = createBlogDto;
    let Image = '';
    if (articleImage) {
      const articleImageURL =
        await this.cloudinaryService.uploadFile(articleImage);
      if (!articleImageURL) {
        throw new BadRequestException('Resume upload failed');
      }
      Image = articleImageURL.url;
    }
    const user = await this.userService.findById(req.user.id)
    const article = await this.blogRepository.create({
      articleContent,
      articleImage: Image,
      articleKeyword,
      articlePublishDate: String(new Date()),
      user: user ? user : req.user,
      articleTitle,
    });

    await this.blogRepository.save(article);
    return {
      message: 'Article created successfully!',
      article,
    };
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { page = 1, limit = 10, search = '' } = paginationQuery;

    try {
      const currentPage = Math.max(1, page);
      const take = Math.max(1, limit);
      const skip = (currentPage - 1) * take;

      const searchFilters = search
        ? [
            { articleTitle: ILike(`%${search}%`) },
            { articleKeyword: ILike(`%${search}%`) },
          ]
        : [];

      const [article, total] = await this.blogRepository.findAndCount({
        where: searchFilters.length ? searchFilters : undefined,
        skip,
        take,
        relations: ['user'],
        select: [
          'id',
          'articleTitle',
          'articleContent',
          'articleImage',
          'articleKeyword',
          'user',
          'articlePublishDate',
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
    } catch (error) {
      console.error('Error fetching Requested Counsellar:', error);
      throw new InternalServerErrorException(
        'Something went wrong while fetching Requested Counsellar.',
      );
    }
  }

  findOne(id: number) {
    return this.blogRepository.findOne({where : {id}});
  }

  remove(id: number) {
    return this.blogRepository.delete(id);
  }
}
