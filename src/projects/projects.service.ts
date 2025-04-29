import { Body, Injectable, Param, Patch } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import * as fs from 'fs-extra';
import * as path from 'path';
import { log } from 'console';

@Injectable()
export class ProjectsService {

  private readonly projectsFilePath = path.resolve(__dirname, '..', '..', 'db', 'projects.json');
  private readonly apontamentosFilePath = path.resolve(__dirname, '..', '..', 'db', 'hours.json');


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
  
  updateHours(@Param('id') id: number, @Body() body: Record<string, any>) {
    try {
      // === 1. Atualiza workedHours em projects.json ===
      if (!fs.existsSync(this.projectsFilePath)) {
        throw new Error(`Arquivo de projetos não encontrado em ${this.projectsFilePath}`);
      }
  
      const projects = fs.readJsonSync(this.projectsFilePath);
      const projectIndex = projects.findIndex((project) => project.id === +id);
  
      if (projectIndex === -1) {
        throw new Error(`Projeto com id ${id} não encontrado`);
      }
  
      const currentWorkedHours = projects[projectIndex].workedHours ?? 0;
      const receivedWorkedHours = body.workedHours ?? 0;
      const newWorkedHours = currentWorkedHours + receivedWorkedHours;
  
      projects[projectIndex] = {
        ...projects[projectIndex],
        workedHours: newWorkedHours,
      };
  
      fs.writeJsonSync(this.projectsFilePath, projects);
  
      // === 2. Registra apontamento em apontamentos.json ===
      const apontamentosFilePath = this.apontamentosFilePath // <-- ajuste aqui
  
      let apontamentos: {
        id: number;
        descricao: string;
        horas: number;
        data: string;
        projetoId: number;
        userId: number | null;
      }[] = [];

      if (fs.existsSync(apontamentosFilePath)) {
        apontamentos = fs.readJsonSync(apontamentosFilePath);
      }
  
      const novoApontamento = {
        id: apontamentos.length > 0 ? apontamentos[apontamentos.length - 1].id + 1 : 1,
        descricao: body.description ?? '',
        horas: receivedWorkedHours,
        data: body.data ?? new Date().toISOString().split('T')[0], // usa data de hoje se não enviada
        projetoId: +id,
        userId: body.userId ?? null
      };
  
      apontamentos.push(novoApontamento);
      fs.writeJsonSync(apontamentosFilePath, apontamentos);
  
      return { message: 'Horas atualizadas e apontamento registrado com sucesso' };
  
    } catch (error) {
      console.error('Erro ao atualizar horas/apontamento:', error);
      throw new Error(`Erro ao processar requisição: ${error.message}`);
    }
  }

  findDescription(id: number) {
    try {
      // Lê o arquivo JSON contendo os dados
      const infos = fs.readJsonSync(this.apontamentosFilePath);
  
      // Filtra os registros de horas com base no projetoId
      const projectHours = infos.filter((project) => project.projetoId === id);
  
      // Se não encontrar nenhum projeto com esse id
      if (projectHours.length === 0) {
        throw new Error(`Nenhuma descrição de horas encontrada para o projeto com id ${id}`);
      }
  
      return projectHours;
    } catch (error) {
      throw new Error(`Erro ao buscar descrições de horas do projeto: ${error.message}`);
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
