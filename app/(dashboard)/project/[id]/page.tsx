'use client';

import {useParams, useRouter} from 'next/navigation';
import {useProjects} from '@/hooks/use-project';
import {useCallback, useEffect, useState} from 'react';
import {Project} from "@/lib/types";
import DetailsLoading from "@/app/(dashboard)/project/[id]/loading";
import ProjectDetailError from "@/app/(dashboard)/project/[id]/error";

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const {projects, loading, getProjectById, loadProjects, operationError} = useProjects();
    const [project, setProject] = useState<Project | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRetrying, setIsRetrying] = useState(false)

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const loadProject = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

            if (!projectId) {
                setError("ID de proyecto no válido");
                return;
            }

            let foundProject;
            if (getProjectById) {
                foundProject = await getProjectById(parseInt(projectId));
            } else {
                foundProject = projects.find(p => p.id.toString() === projectId);
            }

            if (!foundProject) {
                setError("Proyecto no encontrado");
            } else {
                setProject(foundProject);
            }
        } catch (err) {
            console.error("Error loading project:", err);
            setError("Error al cargar el proyecto");
        } finally {
            setIsLoading(false);
        }
    }, [params.id, projects, getProjectById]);


    const handleRetry = useCallback(async () => {
        setIsRetrying(true);
        try {
            // Primero recargar todos los proyectos si la función existe
            if (loadProjects) {
                await loadProjects();
            }

            // Pequeño delay para asegurar que los proyectos se actualizaron
            await new Promise(resolve => setTimeout(resolve, 500));

            // Luego cargar el proyecto específico
            const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
            if (projectId) {
                let foundProject: Project | undefined;
                if (getProjectById) {
                    foundProject = await getProjectById(parseInt(projectId));
                } else {
                    foundProject = projects.find(p => p.id.toString() === projectId);
                }

                if (!foundProject) {
                    setError("Proyecto no encontrado");
                    setProject(null);
                } else {
                    setProject(foundProject);
                    setError(null);
                }
            }
        } catch (err) {
            console.error("Error retrying:", err);
            setError("Error al recargar el proyecto");
        } finally {
            setIsRetrying(false);
            setIsLoading(false);
        }
    }, [params.id, projects, getProjectById, loadProjects]);

    /**
     * Effect hook that loads and sets the project data based on the URL parameter.
     *
     * @param projects - Array of projects to search through
     * @param params.id - The project ID from the URL (can be string or string[])
     * @returns Sets the project state with the found project or null
     */
    useEffect(() => {
        loadProject();
    }, [loadProject]);

    /**
     * Returns the CSS classes for status badges based on the project status.
     *
     * @param status - The project status string (Activo, En Progreso, Completado, or default)
     * @returns A string of Tailwind CSS classes for styling the status badge
     */
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Activo":
                return "bg-green-100 text-green-800 border-green-200";
            case "En Progreso":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Completado":
                return "bg-gray-100 text-gray-800 border-gray-200";
            default:
                return "bg-blue-100 text-blue-800 border-blue-200";
        }
    };

    /**
     * Formats a date string into a localized Spanish date format.
     *
     * @param dateString - The date string to format (ISO format recommended)
     * @returns A formatted date string in "DD Month YYYY" format (e.g., "15 Enero 2024")
     *          Returns "No especificada" if the date string is empty, null, or undefined
     */
    const formatDate = (dateString: string) => {
        if (!dateString) return 'No especificada';
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };
    /**
     * Calculates the completion percentage of a project based on its status.
     *
     * @returns A number representing the completion percentage:
     *          - 100% for completed projects
     *          - 60% for projects in progress
     *          - 30% for active projects
     *          - 0% for projects with unknown or undefined status
     */

    const calculateProgress = () => {
        if (!project) return 0;
        switch (project.status) {
            case "Completado":
                return 100;
            case "En Progreso":
                return 60;
            case "Activo":
                return 30;
            default:
                return 0;
        }
    };

    const showLoading = loading || isLoading || isRetrying;
    const showError = !showLoading && (error || !project);

    if (showLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <DetailsLoading></DetailsLoading>
            </div>
        );
    }

    if (showError) {
        return (
            <ProjectDetailError
                reset={handleRetry}/>
        );
    }

    if (!project) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4 max-w-5xl">
                <button
                    onClick={() => router.push("/")}
                    className="mb-6 inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors group"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none"
                         stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Volver
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    <div className={`h-2 ${getStatusColor(project.status).split(' ')[0]}`}></div>

                    <div className="p-4 sm:p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                <div
                                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl font-bold shadow-lg flex-shrink-0">
                                    {project.title
                                        .split(" ")
                                        .map(word => word[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">
                                        {project.title}
                                    </h1>
                                    {project.assignedTo && (
                                        <div
                                            className="flex items-center gap-1.5 sm:gap-2 text-gray-500 sm:text-gray-600">
                                            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0"
                                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>
                                            <span className="text-xs sm:text-sm truncate">
                                Responsable: {project.assignedTo}
                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-start sm:justify-end">
                <span
                    className={`px-2.5 py-1 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-sm font-semibold ${getStatusColor(project.status)} border shadow-sm inline-flex items-center gap-1 sm:gap-2 whitespace-nowrap`}>
                    <span className="hidden sm:inline">{project.status}</span>
                    <span className="sm:hidden">
                        {project.status === "Activo" ? "Act" :
                            project.status === "En Progreso" ? "Prog" :
                                project.status === "Completado" ? "Comp" : project.status}
                    </span>
                </span>
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-6">
                            <div
                                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 mb-2">
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" fill="none"
                                         stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                        Progreso del proyecto
                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-sm sm:text-base font-bold text-slate-600">{calculateProgress()}%</span>
                                    <span
                                        className="text-[10px] sm:text-xs text-gray-400 hidden sm:inline">completado</span>
                                </div>
                            </div>

                            <div
                                className="relative w-full bg-gray-100 rounded-full h-1.5 sm:h-2 md:h-2.5 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-slate-600 to-slate-500 h-full rounded-full transition-all duration-700 ease-out"
                                    style={{width: `${calculateProgress()}%`}}
                                ></div>
                            </div>

                            <div className="mt-2 sm:hidden">
                                {calculateProgress() === 100 ? (
                                    <p className="text-[10px] text-green-600 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M5 13l4 4L19 7"/>
                                        </svg>
                                        Proyecto completado
                                    </p>
                                ) : calculateProgress() > 0 && (
                                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        {calculateProgress()}% completado
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 6h16M4 12h16M4 18h7"/>
                                </svg>
                                Descripción del Proyecto
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                {project.description || "No hay descripción disponible para este proyecto."}
                            </p>
                        </div>

                        {project.technologies && project.technologies.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                                    </svg>
                                    Tecnologías Utilizadas
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {project.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 rounded-xl text-sm font-medium border border-gray-200 shadow-sm"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                                Cronograma
                            </h2>
                            <div className="space-y-4">
                                <div className="border-l-4 border-green-500 pl-4">
                                    <p className="text-sm text-gray-500">Fecha de inicio</p>
                                    <p className="text-lg font-semibold text-gray-900">{formatDate(project.date)}</p>
                                </div>
                                {project.deadline && (
                                    <div className="border-l-4 border-red-500 pl-4">
                                        <p className="text-sm text-gray-500">Fecha límite</p>
                                        <p className="text-lg font-semibold text-gray-900">{formatDate(project.deadline)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>

                <div className="w-full">
                    <div className="fixed bottom-6 right-6 z-50 md:hidden">
                        <button
                            onClick={() => router.push(`/project/${project.id}/edit`)}
                            className="group flex items-center justify-center w-14 h-14 bg-slate-600 hover:bg-slate-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
                            aria-label="Editar proyecto"
                        >
                            <div className="relative z-10">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                            </div>
                        </button>
                    </div>

                    <div className="hidden md:flex md:justify-end items-center mt-4">
                        <button
                            onClick={() => router.push(`/project/${project.id}/edit`)}
                            className="group relative px-4 py-3 bg-slate-600 hover:bg-slate-500 rounded-xl transition-all duration-300 text-left flex items-center gap-3 overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <div
                                className="relative z-10 p-1.5 rounded-lg bg-white/10 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                            </div>

                            <div className="relative z-10 flex-1">
                                <span
                                    className="font-semibold text-white group-hover:text-white transition-colors duration-300">
                                    Editar proyecto
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
