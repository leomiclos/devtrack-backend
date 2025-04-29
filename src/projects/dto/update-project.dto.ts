import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsOptional()  // Tornando o campo 'status' opcional
    @IsEnum(['Em andamento', 'Completo', 'Não iniciado'])
    status: string;
    lastUpdateDate: string | undefined;
    workedHours: number | undefined;
    userId?: number | undefined;
    description?: string | undefined;
}
