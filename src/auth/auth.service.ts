import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs-extra';
import * as path from 'path';

interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
  acceptTerms: boolean;
}

@Injectable()
export class AuthService {
  private users: User[] = [];
  private readonly usersFilePath = path.resolve(__dirname, '..', '..', 'db', 'user.json');
  private nextId: number = 1; // Gerador de ID começando de 1

  constructor() {
    this.loadUsers();
  }

  private async loadUsers() {
    try {
      const exists = await fs.pathExists(this.usersFilePath);
      if (exists) {
        const data = await fs.readJson(this.usersFilePath);
        this.users = data;

        // Verifica o último ID para atualizar o nextId
        if (this.users.length > 0) {
          this.nextId = Math.max(...this.users.map(user => user.id)) + 1;
        }
      } else {
        this.users = [];
        await fs.outputJson(this.usersFilePath, this.users);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      this.users = [];
    }
  }

  private async saveUsers() {
    try {
      await fs.outputJson(this.usersFilePath, this.users);
    } catch (error) {
      console.error('Erro ao salvar usuários:', error);
    }
  }

  async register(createAuthDto: CreateAuthDto) {
    const { nome, email, senha, acceptTerms } = createAuthDto;

    if (!nome || nome.length < 3) {
      throw new BadRequestException('Nome deve ter pelo menos 3 caracteres');
    }

    if (!email || !this.isEmailValid(email)) {
      throw new BadRequestException('Email inválido');
    }

    if (!senha || senha.length < 6) {
      throw new BadRequestException('Senha deve ter pelo menos 6 caracteres');
    }

    if (!acceptTerms) {
      throw new BadRequestException('Termos de uso devem ser aceitos');
    }

    const userExists = this.users.find((user) => user.email === email);
    if (userExists) {
      throw new BadRequestException('Usuário já cadastrado com esse email');
    }

    // Gerar senha com hash
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Atribuir o próximo ID ao novo usuário
    const newUser: User = {
      id: this.nextId,
      nome,
      email,
      senha: hashedPassword,
      acceptTerms,
    };

    // Atualiza o array de usuários
    this.users.push(newUser);

    // Atualiza o próximo ID para o próximo usuário
    this.nextId++;

    // Salva os usuários no arquivo JSON
    await this.saveUsers();

    return {
      message: 'Usuário registrado com sucesso!',
      user: {
        nome: newUser.nome,
        email: newUser.email,
      },
    };
  }

  async login(createAuthDto: CreateAuthDto) {
    const { email, senha } = createAuthDto;

    const user = this.users.find((user) => user.email === email);
    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    return {
      message: 'Login realizado com sucesso!',
      user: {
        nome: user.nome,
        email: user.email,
      },
    };
  }

  private isEmailValid(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
}
