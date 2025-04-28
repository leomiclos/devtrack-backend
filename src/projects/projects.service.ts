import { Body, Injectable, Param, Patch } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import * as fs from 'fs-extra';
import * as path from 'path';
import { log } from 'console';

@Injectable()
export class ProjectsService {

  private readonly projectsFilePath = path.resolve(__dirname, '..', '..', 'db', 'projects.json');


  create(createProjectDto: CreateProjectDto) {
    return 'This action adds a new project';
  }

  async findAll() {
    const projects = await fs.readJson(this.projectsFilePath);
    try {
      return projects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        status: project.status,
        creationDate: project.creationDate,
        image: project.image,
        lastUpdateDate: project.lastUpdateDate,
        hoursWorked: project.hoursWorked,
        userId: project.userId,
      }));
    } catch (error) {
      throw new Error('Não foi possível ler o arquivo de usuários');
    }
  }

  findOne(id: number) {
    try {
      const projects = fs.readJson(this.projectsFilePath);
      const project = projects.find((project) => project.id === id);
      if (!project) {
        throw new Error(`Projeto com id ${id} não encontrado`);
      }
      return project;
    } catch (error) {
      throw new Error('Não foi possível ler o arquivo de usuários');
    }
  }

  async findAllById(id: number) {
    try {
      // Lê o arquivo JSON
      const projects = await fs.readJson(this.projectsFilePath);

      // Filtra todos os projetos com o mesmo userId
      const userProjects = projects.filter((project) => project.userId === id);

      // Se nenhum projeto for encontrado, lança um erro
      if (userProjects.length === 0) {
        throw new Error(`Nenhum projeto encontrado para o id do usuário ${id}`);
      }

      // Retorna todos os projetos encontrados
      return userProjects;
    } catch (error) {
      // Lança erro com mais detalhes
      throw new Error(`Erro ao buscar projetos para o id ${id}: ${error.message}`);
    }
  }

  updateStatus(id: number, updateProjectDto: { status: string }) {
    try {
      const projects = fs.readJsonSync(this.projectsFilePath);
      const projectIndex = projects.findIndex((project) => project.id === id);
  
      if (projectIndex === -1) {
        throw new Error(`Projeto com id ${id} não encontrado`);
      }
  
      // Atualiza apenas o status do projeto, mantendo os outros campos intactos
      projects[projectIndex] = {
        ...projects[projectIndex],
        status: updateProjectDto.status, // Atualiza apenas o status
      };
  
      fs.writeJsonSync(this.projectsFilePath, projects);
  
    } catch (error) {
      throw new Error(`Não foi possível ler ou atualizar o arquivo de projetos: ${error.message}`);
    }
  }
  
  @Patch('update-hours/:id')
  updateHours(@Param('id') id: number, @Body() body: Record<string, any>) { // Recebe diretamente o corpo como um objeto genérico  
    try {
      // Verifica se o arquivo de projetos existe
      if (!fs.existsSync(this.projectsFilePath)) {
        throw new Error(`Arquivo de projetos não encontrado em ${this.projectsFilePath}`);
      }
  
      const projects = fs.readJsonSync(this.projectsFilePath);
      const projectIndex = projects.findIndex((project) => project.id === +id); // Garantir que o id seja um número
  
      if (projectIndex === -1) {
        throw new Error(`Projeto com id ${id} não encontrado`);
      }
  
      // Verifica se o projeto já tem horas registradas. Se não tiver, inicializa com 0.
      const currentWorkedHours = projects[projectIndex].workedHours ?? 0; // Usa 0 se workedHours não estiver definido
      const receivedWorkedHours = body.workedHours ?? 0; // Horas recebidas da requisição diretamente
      const newWorkedHours = currentWorkedHours + receivedWorkedHours; // Soma as horas
  
      // Atualiza as horas trabalhadas
      projects[projectIndex] = {
        ...projects[projectIndex],
        workedHours: newWorkedHours, // Atualiza apenas o workedHours com o valor somado
      };
  
      // Grava as alterações no arquivo
      fs.writeJsonSync(this.projectsFilePath, projects);
  
      return { message: 'Horas atualizadas com sucesso' }; // Resposta de sucesso
  
    } catch (error) {
      console.error('Erro ao ler ou atualizar o arquivo de projetos:', error);
      throw new Error(`Não foi possível ler ou atualizar o arquivo de projetos: ${error.message}`);
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
