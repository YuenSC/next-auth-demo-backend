import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ListQueryParams } from 'src/common/list-query.decorator';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  create(createProjectDto: CreateProjectDto, owner: User) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        owner: { connect: { id: owner.id } },
      },
    });
  }

  findAll(owner: User, { searchText, offset, page }: ListQueryParams) {
    return this.prisma.project.findMany({
      skip: offset * (page - 1),
      take: offset,
      where: {
        ownerId: owner.id,
        ...(searchText && {
          name: {
            contains: searchText,
            mode: 'insensitive',
          },
        }),
      },
      include: { owner: true },
    });
  }

  findOne(id: string, owner: User) {
    return this.prisma.project.findFirst({
      where: { id, ownerId: owner.id },
    });
  }

  update(id: string, owner: User, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id, ownerId: owner.id },
      data: updateProjectDto,
    });
  }

  remove(id: string, owner: User) {
    return this.prisma.project.delete({
      where: { id, ownerId: owner.id },
    });
  }
}
