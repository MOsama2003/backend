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

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
