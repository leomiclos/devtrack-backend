import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module'; // Importe o módulo Auth aqui
import { UsersModule } from './users/users.module'; // Importe outros módulos necessários
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',  
      isGlobal: true,       
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
  ],
  providers: [],
})
export class AppModule {}
