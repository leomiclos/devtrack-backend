import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class ProjectsService {

  private readonly projectsFilePath = path.resolve(__dirname, '..', '..', 'db', 'projects.json');
  

  create(createProjectDto: CreateProjectDto) {
    return 'This action adds a new project';
  }

  async findAll() {
      const projects = await fs.readJson(this.projectsFilePath);
      try{
        return projects.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          status: project.status,
          creationDate: project.creationDate,
          image: project.image,
          lastUpdateDate: project.lastUpdateDate,
          userId: project.userId,
        }));
      } catch (error) {
        throw new Error('Não foi possível ler o arquivo de usuários');
      }
  }

  async findOne(id: number) {
    try {
      const projects = await fs.readJson(this.projectsFilePath);
      const project = projects.find((project) => project.id === id);
      if (!project) {
      throw new Error(`Projeto com id ${id} não encontrado`);
      }
      return project;
    } catch (error) {
      throw new Error('Não foi possível ler o arquivo de usuários');
    }
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      const projects = fs.readJson(this.projectsFilePath);
      const projectIndex = projects.findIndex((project) => project.id === id);
      if (projectIndex === -1) {
        throw new Error(`Projeto com id ${id} não encontrado`);
      }
      projects[projectIndex] = { ...projects[projectIndex], ...updateProjectDto };
      fs.writeJson(this.projectsFilePath, projects);
    } catch (error) {
      throw new Error('Não foi possível ler o arquivo de usuários');
    }
  }

  remove(id: number) {
    try {
      const projects = fs.readJson(this.projectsFilePath);
      const projectIndex = projects.findIndex((project) => project.id === id);
      if (projectIndex === -1) {
        throw new Error(`Projeto com id ${id} não encontrado`);
      }
      projects.splice(projectIndex, 1);
      fs.writeJson(this.projectsFilePath, projects);
    } 
    catch (error) {
      throw new Error('Não foi possível ler o arquivo de usuários');
    }
  }
}
