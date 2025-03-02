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
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCounsellarDto } from './dto/create-counsellar.dto';
import { CreateNonDeviceOwnerDto } from './dto/create-non-device-owner.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register-counsellar')
  @UseGuards(new RoleGuard(CONSTANTS.ROLE.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins can register users',
  })
  createCounsellar(@Body(ValidationPipe) createUserDto: CreateCounsellarDto) {
    return this.userService.registerCounsellar(createUserDto);
  }

  @Post('/register-non-device-owner')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only admins can register users',
  })
  create(
    @Body(ValidationPipe) createNonDeviceOwnerDto: CreateNonDeviceOwnerDto,
  ) {
    return this.userService.registerNonDeviceOwner(createNonDeviceOwnerDto);
  }

  @Get('/listing')
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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

  @Post('avatar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set user avatar' })
  @ApiConsumes('multipart/form-data') // 🔹 Enable file upload
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Avatar successfully uploaded' })
  @ApiResponse({ status: 400, description: 'Invalid file' })
  @UseInterceptors(FileInterceptor('file'))
  async setAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.userService.setAvatar(req.user.id, file);
  }
}
