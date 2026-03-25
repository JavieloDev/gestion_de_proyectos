'use client';

import {useParams, useRouter} from 'next/navigation';
import {useProjects} from '@/hooks/use-project';
import {useEffect, useState} from 'react';
import ProjectForm from '@/components/project-form';
import {Project} from '@/lib/types';

export default function EditProjectPage() {
    const params = useParams();
    const router = useRouter();
    const {getProjectById, updateProject, isUpdating, loading: projectsLoading, allProjects} = useProjects();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProject = async () => {
            if (projectsLoading) {
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

                if (!projectId) {
                    setError("ID de proyecto no válido");
                    setIsLoading(false);
                    return;
                }

                const foundProject = await getProjectById(parseInt(projectId));

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
        };

        loadProject();
    }, [params.id, getProjectById, projectsLoading, allProjects]);

    const handleUpdate = async (data: Partial<Project>) => {
        try {
            const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
            if (projectId) {
                await updateProject(parseInt(projectId), data);
                router.push(`/projects/${projectId}`);
            }
        } catch (err) {
            console.error("Error updating project:", err);
            setError("Error al actualizar el proyecto");
        }
    };

    if (projectsLoading || isLoading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        {projectsLoading ? "Cargando proyectos..." : "Cargando proyecto..."}
                    </p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen bg-slate-100 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="bg-red-100 rounded-full p-6 mb-4">
                                <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {error || "Proyecto no encontrado"}
                            </h3>
                            <p className="text-gray-500 mb-6">
                                El proyecto que intentas editar no existe o ha sido eliminado
                            </p>
                            <button
                                onClick={() => router.push('/')}
                                className="px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors"
                            >
                                Volver al Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <ProjectForm
                onSubmit={handleUpdate}
                initialData={project}
                isEditing={true}
                isLoading={isUpdating}
            />
        </div>
    );
}
