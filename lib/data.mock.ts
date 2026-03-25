import {Project} from "./types";

export const mockProjects: Project[] = [
    {
        id: 1,
        title: "Dashboard Analytics",
        description: "Desarrollo de (dashboard) interactivo con métricas en tiempo real",
        status: "Activo",
        date: "2024-03-15",
        deadline: "2024-04-30",
        technologies: ["Next.js", "Tailwind", "Chart.js"],
        assignedTo: "Carlos López",
    },
    {
        id: 2,
        title: "E-commerce Platform",
        description: "Plataforma de ventas con carrito de compras",
        status: "Completado",
        date: "2024-02-10",
        deadline: "2024-03-20",
        technologies: ["React", "Node.js", "MongoDB"],
        assignedTo: "Ana Martínez",
    },
];
