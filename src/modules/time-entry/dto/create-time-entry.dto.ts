import { IsOptional, IsString, IsISO8601, IsUUID } from 'class-validator';

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
  @IsUUID()
  projectId?: string;

  userId: string;
}
