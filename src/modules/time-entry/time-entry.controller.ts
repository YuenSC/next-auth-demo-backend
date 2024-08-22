import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { ListQuery, ListQueryParams } from 'src/common/list-query.decorator';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { TimeEntryService } from './time-entry.service';

@Controller('time-entries')
@UseGuards(AuthGuardJwt, RolesGuard)
export class TimeEntryController {
  constructor(private readonly timeEntryService: TimeEntryService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createTimeEntryDto: CreateTimeEntryDto,
  ) {
    return this.timeEntryService.create({
      ...createTimeEntryDto,
      userId: user.id,
    });
  }

  @Get()
  findAll(
    @CurrentUser() user: User,
    @ListQuery({ defaultLimit: 50 }) query: ListQueryParams,
  ) {
    return this.timeEntryService.findAll(query, user.id);
  }

  @Get('current')
  findCurrentTimeEntry(@CurrentUser() user: User) {
    return this.timeEntryService.findCurrentTimeEntry(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.timeEntryService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() updateTimeEntryDto: UpdateTimeEntryDto,
  ) {
    return this.timeEntryService.update(id, {
      ...updateTimeEntryDto,
      userId: user.id,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.timeEntryService.remove(id, user.id);
  }
}
