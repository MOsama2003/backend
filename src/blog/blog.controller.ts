import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  Req,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { CONSTANTS } from 'src/constants';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(new RoleGuard(CONSTANTS.ROLE.COUNSELLAR))
  @ApiOperation({ summary: 'Write Article ( Counsellar only )' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        articleContent: { type: 'string' },
        articleTitle: { type: 'string' },
        articleKeyword: { type: 'string[]' },
        articleImage: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  @UseInterceptors(FileInterceptor('articleImage'))
  create(
    @Req() req,
    @UploadedFile() articleImage: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!body || Object.keys(body).length === 0) {
      throw new Error(
        'Body is undefined, ensure you are sending form-data correctly.',
      );
    }

    const createBlogDto: CreateBlogDto = {
      articleContent: body.articleContent,
      articleTitle: body.articleTitle,
      articleKeyword: body.articleKeyword,
    };
    return this.blogService.create(articleImage, createBlogDto, req);
  }

  @Get('/listing')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of Articles' })
  @ApiResponse({ status: 200, description: 'List of Articles' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.blogService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(new RoleGuard(CONSTANTS.ROLE.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an Article (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Article deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Article with ID not found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
