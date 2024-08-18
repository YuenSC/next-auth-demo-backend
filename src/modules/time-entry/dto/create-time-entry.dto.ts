import { IsOptional, IsString, IsISO8601 } from 'class-validator';

export class CreateTimeEntryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsISO8601()
  startTime: string;

  @IsOptional()
  @IsISO8601()
  endTime?: string;

  userId: string;
  projectId: string;
}
