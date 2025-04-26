import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity'; // Você pode criar esse arquivo ou usar um DTO como Entity

@Injectable()
export class UsersService {
  private readonly usersFilePath = path.resolve(__dirname, '..', '..', 'db', 'user.json');

  // Função para pegar todos os usuários
  async findAll(): Promise<User[]> {
    try {
      const users = await fs.readJson(this.usersFilePath);
      return users.map((user) => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        acceptTerms: user.acceptTerms,
        createdAt: user.createdAt, // Exemplo, se você quiser mostrar data
      }));
    } catch (error) {
      throw new Error('Não foi possível ler o arquivo de usuários');
    }
  }


}
