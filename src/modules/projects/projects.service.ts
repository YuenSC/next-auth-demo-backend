import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ListQueryParams } from 'src/common/list-query.decorator';
import { generatePaginationResponse } from 'src/common/pagination.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

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

  async findAll(owner: User, { searchText, page, limit }: ListQueryParams) {
    const res = await this.prisma.project.findManyAndCount({
      skip: (page - 1) * limit,
      take: limit,
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

    return generatePaginationResponse(res, { page, limit });
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
