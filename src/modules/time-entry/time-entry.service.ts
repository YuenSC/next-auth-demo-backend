import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ListQueryParams } from 'src/common/list-query.decorator';
import { generatePaginationResponse } from 'src/common/pagination.util';

@Injectable()
export class TimeEntryService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    projectId,
    userId,
    ...createTimeEntryDto
  }: CreateTimeEntryDto) {
    const currentTimeEntry = await this.findCurrentTimeEntry(userId);
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

  async findAll({ page, limit }: ListQueryParams, userId: string) {
    const res = await this.prisma.timeEntry.findManyAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: { userId },
      orderBy: { startTime: 'desc' },
    });

    return generatePaginationResponse(res, { page, limit });
  }

  findOne(id: string, userId: string) {
    return this.prisma.timeEntry.findFirst({
      where: { id, userId },
    });
  }

  findCurrentTimeEntry(userId: string) {
    return this.prisma.timeEntry.findFirst({
      where: { userId, endTime: null },
    });
  }

  update(id: string, { userId, ...updateTimeEntryDto }: UpdateTimeEntryDto) {
    return this.prisma.timeEntry.update({
      where: { id, userId },
      data: updateTimeEntryDto,
    });
  }

  remove(id: string, userId: string) {
    return this.prisma.timeEntry.delete({
      where: { id, userId },
    });
  }
}
