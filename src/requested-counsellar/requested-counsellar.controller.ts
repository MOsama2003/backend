import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RequestedCounsellarService } from './requested-counsellar.service';
import { CreateRequestedCounsellarDto } from './dto/create-requested-counsellar.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { CONSTANTS } from 'src/constants';
import { RoleGuard } from 'src/auth/guards/role.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Requested Counsellar')
@Controller('requested-counsellar')
export class RequestedCounsellarController {
  constructor(
    private readonly requestedCounsellarService: RequestedCounsellarService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Submit a counsellor request' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', example: 'john@example.com' },
        resume: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Registration request submitted successfully' })
  @ApiResponse({ status: 400, description: 'Email already registered or Resume upload failed' })
  @UseInterceptors(FileInterceptor('resume'))
  create(
    @UploadedFile() resume: Express.Multer.File,
    @Body() body: any, 
  ) {
    if (!body || Object.keys(body).length === 0) {
      throw new Error('Body is undefined, ensure you are sending form-data correctly.');
    }

    const createRequestedCounsellarDto: CreateRequestedCounsellarDto = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
    };

    return this.requestedCounsellarService.create(resume, createRequestedCounsellarDto);
  }

  @Delete(':id')
  @UseGuards(new RoleGuard(CONSTANTS.ROLE.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a requested counsellor (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'RequestedCounsellar deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'RequestedCounsellar with ID not found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.requestedCounsellarService.remove(+id);
  }

  @Get('/listing')
  @UseGuards(new RoleGuard(CONSTANTS.ROLE.ADMIN))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of requested counsellors (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of requested counsellors' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.requestedCounsellarService.findAll(paginationQuery);
  }
}
