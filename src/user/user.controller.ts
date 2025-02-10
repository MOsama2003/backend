import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Query,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleGuard } from '../auth/guards/role.guard';
import { CONSTANTS } from '../constants';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('/register')
  @UseGuards(new RoleGuard(CONSTANTS.ROLE.ADMIN))
  @ApiOperation({ summary: 'Register a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins can register users',
  })
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/listing')
  @UseGuards(new RoleGuard(CONSTANTS.ROLE.ADMIN))
  @ApiOperation({ summary: 'Get paginated list of users with search' })
  @ApiResponse({ status: 200, description: 'Users fetched successfully' })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: 'Number of items per page (default: 10)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    example: 'john',
    description: 'Search users by email, name, or deviceId',
  })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.userService.findAll(paginationQuery);
  }

  @Patch('/disabled-user/:id')
  @UseGuards(new RoleGuard(CONSTANTS.ROLE.ADMIN))
  @ApiOperation({ summary: 'Disable user by deviceId (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User successfully disabled',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins can disable users',
  })
  async disableUser(@Param('id') id: string) {
    return this.userService.softDeleteUser(id);
  }

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('avatar')) // Handle file upload with 'avatar' field
  @ApiOperation({ summary: 'Set user avatar' })
  @ApiResponse({ status: 200, description: 'Avatar successfully uploaded' })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  async setAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      const uploadedFile = await this.cloudinaryService.uploadFile(file); // Upload file to Cloudinary
      if (!uploadedFile) {
        throw new BadRequestException('File upload failed');
      }

      await this.userService.setAvatar(req.user.id, uploadedFile.url); // Save the URL to the user's record
      return { message: 'Avatar successfully uploaded', avatarUrl: uploadedFile.url };
    } catch (error) {
      throw new BadRequestException('Error uploading file to Cloudinary');
    }
  }
}
