import { IsOptional, IsNumber, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;
}