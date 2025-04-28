import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Get(':userId/user')
  findByUserId(@Param('userId') id: string) {
    return this.projectsService.findAllById(+id);
  }

  @Get('conclude/:id')
  updateStatus(@Param('id') id: number) {
    const statusProject = 'Completo'; // Defina o status como "Completo" diretamente
    return this.projectsService.updateStatus(id, { status: statusProject });
  }

  @Patch('update-hours/:id') // Usando o verbo PATCH aqui
  updateHours(@Param('id') id: number, @Body() body: Record<string, any>) {
    return this.projectsService.updateHours(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
