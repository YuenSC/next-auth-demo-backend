import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreateTimeEntryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsISO8601()
  startTime: string;

  @IsOptional()
  @IsISO8601()
  endTime?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  userId: string;
}
