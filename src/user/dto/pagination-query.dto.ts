import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number (default: 1)',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 1)
  @IsInt()
  @Min(1)
  page: number = 1; // Current page

  @ApiPropertyOptional({
    description: 'Number of items per page (default: 10)',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 10)
  @IsInt()
  @Min(1)
  limit: number = 10; // Number of items per page

  @ApiPropertyOptional({
    description: 'Search term (email, name, or deviceId)',
  })
  @IsOptional()
  @IsString()
  search?: string; // Optional search term (email, name, deviceId)
}
