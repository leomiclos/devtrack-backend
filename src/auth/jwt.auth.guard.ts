import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Usando o guard do passport

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
