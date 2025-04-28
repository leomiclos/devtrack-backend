export class CreateProjectDto {
    id: number;
    title: string;
    description: string;
    status: string;
    creationDate: string; // ou Date, se preferir tratar como Date no back-end
    image: string;
    lastUpdateDate: string; // ou Date
    userId: number;
}
