import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaginationQueryDto } from './dto/pagination-feed.dto';
import { CreateReactionDto } from './dto/reaction-feed.dto';
import { CommentListingDto, CreateCommentDto } from './dto/comment-feed.dto';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  @ApiOperation({ summary: 'Write Post' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        caption: { type: 'string' },
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() body: any,
    @UploadedFiles() images: Express.Multer.File[],
    @Req() req,
  ) {
    if (!body || Object.keys(body).length === 0) {
      throw new Error(
        'Body is undefined, ensure you are sending form-data correctly.',
      );
    }

    const createFeedDto: CreateFeedDto = {
      caption: body.caption,
    };
    return this.feedService.create(createFeedDto, images, req);
  }

  @Get('/listing')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of Posts' })
  @ApiResponse({ status: 200, description: 'List of Posts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() paginationQuery: PaginationQueryDto, @Req() req) {
    return this.feedService.feedListing(paginationQuery, req)
  }

  @Post('/reaction')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Post Reaction' })
  @ApiResponse({ status: 200, description: 'React to the Post' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  react(@Body() createReactionDto: CreateReactionDto, @Req() req ) {
    return this.feedService.reaction(createReactionDto, req)
  }

  @Get('/comment-listing')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of Comments' })
  @ApiResponse({ status: 200, description: 'List of Comments' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  commentLisitng(@Query() commentListing: CommentListingDto) {
    return this.feedService.commentListing(commentListing)
  }

  @Post('/comment')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Comment on Post' })
  @ApiResponse({ status: 200, description: 'Comment to the Post' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  comment(@Body() createCommentDto: CreateCommentDto, @Req() req ) {
    return this.feedService.createComment(createCommentDto, req)
  }
}
