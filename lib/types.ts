export type ProjectStatus = "Activo" | "Completado" | "En Progreso";

export interface Project {
    id: number;
    title: string;
    description: string;
    status: ProjectStatus;
    date: string;
    deadline?: string;
    technologies?: string[];
    assignedTo?: string;
}

export interface ProjectFormData {
    title: string;
    description: string;
    status: ProjectStatus;
    date: string;
    deadline?: string;
    technologies?: string[];
}
