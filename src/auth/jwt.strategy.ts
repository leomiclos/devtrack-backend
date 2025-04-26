import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // Certifique-se de importar o UsersService
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService, // Injetando o UsersService
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'),
      
    });
  }

  async validate(payload: any) {
    console.log(this.configService.get<string>('JWT_SECRET'));

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    return user;
  }
}
