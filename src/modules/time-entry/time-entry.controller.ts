import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TimeEntryService } from './time-entry.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ListQuery, ListQueryParams } from 'src/common/list-query.decorator';

@Controller(':projectId/time-entry')
export class TimeEntryController {
  constructor(private readonly timeEntryService: TimeEntryService) {}

  @Post()
  create(
    @Param('projectId') projectId: string,
    @CurrentUser() user,
    @Body() createTimeEntryDto: CreateTimeEntryDto,
  ) {
    return this.timeEntryService.create({
      ...createTimeEntryDto,
      projectId,
      userId: user.id,
    });
  }

  @Get()
  findAll(
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
    @ListQuery() query: ListQueryParams,
  ) {
    return this.timeEntryService.findAll(query, user.id, projectId);
  }

  @Get('current')
  findCurrentTimeEntry(
    @CurrentUser() user: User,
    @Param('projectId') projectId: string,
  ) {
    return this.timeEntryService.findCurrentTimeEntry(user.id, projectId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    return this.timeEntryService.findOne(id, user.id, projectId);
  }

  @Patch(':id')
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateTimeEntryDto: UpdateTimeEntryDto,
  ) {
    return this.timeEntryService.update(id, {
      ...updateTimeEntryDto,
      projectId,
      userId: user.id,
    });
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Param('projectId') projectId: string,
    @CurrentUser() user: User,
  ) {
    return this.timeEntryService.remove(id, user.id, projectId);
  }
}
