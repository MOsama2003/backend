import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Page number (default: 1)', example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 1)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ description: 'Items per page (default: 10)' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10) || 10)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @ApiPropertyOptional({ description: 'Only fetch upcoming appointments' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  upcoming?: boolean;
}
