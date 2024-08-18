import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ListQueryParams } from 'src/common/list-query.decorator';
import { generatePaginationResponse } from 'src/common/pagination.util';

@Injectable()
export class TimeEntryService {
  constructor(private readonly prisma: PrismaService) {}

  create({ projectId, userId, ...createTimeEntryDto }: CreateTimeEntryDto) {
    const currentTimeEntry = this.findCurrentTimeEntry(userId, projectId);
    if (currentTimeEntry) {
      throw new BadRequestException(
        'User already has a time entry for this project. Please stop the current time entry before starting a new one.',
      );
    }

    return this.prisma.timeEntry.create({
      data: {
        ...createTimeEntryDto,
        ...(userId && {
          user: { connect: { id: userId } },
        }),
        ...(projectId && {
          project: { connect: { id: projectId } },
        }),
      },
    });
  }

  async findAll(
    { page, limit }: ListQueryParams,
    userId: string,
    projectId: string,
  ) {
    const res = await this.prisma.timeEntry.findManyAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: { userId, projectId },
    });

    return generatePaginationResponse(res, { page, limit });
  }

  findOne(id: string, userId: string, projectId: string) {
    return this.prisma.timeEntry.findFirst({
      where: { id, userId, projectId },
    });
  }

  findCurrentTimeEntry(userId: string, projectId: string) {
    return this.prisma.timeEntry.findFirst({
      where: { userId, projectId, endTime: null },
    });
  }

  update(
    id: string,
    { userId, projectId, ...updateTimeEntryDto }: UpdateTimeEntryDto,
  ) {
    return this.prisma.timeEntry.update({
      where: { id, userId, projectId },
      data: updateTimeEntryDto,
    });
  }

  remove(id: string, userId: string, projectId: string) {
    return this.prisma.timeEntry.delete({
      where: { id, userId, projectId },
    });
  }
}
