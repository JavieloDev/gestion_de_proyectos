"use client";

import {useProjects} from "@/hooks/use-project";
import ProjectCard from "@/components/project-card";
import SearchFilter from "@/components/search-filter";
import {useCallback, useState} from "react";
import {useRouter} from "next/navigation";
import RemoveModal from "@/components/remove-modal";
import DashboardError from "@/components/error";
import DashboardLoading from "@/components/loading";


export default function DashboardPage() {
    const {projects, loading, filter, setFilter, deleteProject, operationError, loadProjects} = useProjects();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<number | string | null>(null);
    const [projectTitle, setProjectTitle] = useState<string>("");

    const handleEdit = (id: number | string) => {
        router.push(`/project/${id}/edit`);
    };


    const handleDeleteClick = (id: number | string, title: string) => {
        setProjectToDelete(id);
        setProjectTitle(title);
    };

    const confirmDelete = async () => {
        if (projectToDelete) {
            setIsDeleting(true);
            try {
                await deleteProject(projectToDelete);
                setProjectToDelete(null);
                setProjectTitle("");
            } catch (error) {
                console.error("Error deleting project:", error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const cancelDelete = () => {
        setProjectToDelete(null);
        setProjectTitle("");
    };

    const handleRetry = useCallback(async () => {
        if (loadProjects) {
            await loadProjects();
        } else {
            window.location.reload();
        }
    }, [loadProjects])

    if (operationError && !loading) {
        return (
            <DashboardError
                reset={handleRetry}
                title="Error al cargar proyectos"
                message="Ocurrió un problema al cargar tus proyectos. Por favor, intenta nuevamente."
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 w-full">
            <div
                className="relative overflow-hidden bg-slate-800/80 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="container px-4 py-12 relative">
                        <div className="max-w-4xl">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                                Mis Proyectos
                            </h1>
                            <p className="text-xl text-white/80">
                                Gestiona y da seguimiento a tus proyectos de manera eficiente
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 my-4 px-4 sm:px-6 w-full">
                        <div
                            className="bg-white/10 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center justify-between gap-1 sm:gap-2">
                                <div className="flex flex-row justify-center items-center gap-1 sm:gap-2">
                                    <div className="bg-blue-100 rounded-full p-1.5 sm:p-2">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none"
                                             stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                        </svg>
                                    </div>
                                    <p className="hidden md:block text-blue-100 text-xs sm:text-sm font-medium">Total
                                        Proyectos</p>
                                    <p className="md:hidden text-blue-100 text-xs sm:text-sm font-medium">Total</p>
                                </div>
                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-100">{projects.length}</p>
                            </div>
                        </div>

                        <div
                            className="bg-white/10 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center justify-between gap-1 sm:gap-2">
                                <div className="flex flex-row justify-center items-center gap-1 sm:gap-2">
                                    <div className="bg-green-100 rounded-full p-1.5 sm:p-2">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none"
                                             stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                                  d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                        </svg>
                                    </div>
                                    <p className="hidden md:block text-green-100 text-xs sm:text-sm font-medium">Activos</p>
                                    <p className="md:hidden text-green-100 text-xs sm:text-sm font-medium">Act</p>
                                </div>
                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-100">
                                    {projects.filter(p => p.status === "Activo").length}
                                </p>
                            </div>
                        </div>

                        <div
                            className="bg-white/10 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center justify-between gap-1 sm:gap-2">
                                <div className="flex flex-row justify-center items-center gap-1 sm:gap-2">
                                    <div className="bg-yellow-100 rounded-full p-1.5 sm:p-2">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none"
                                             stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <p className="hidden md:block text-yellow-100 text-xs sm:text-sm font-medium">En
                                        Progreso</p>
                                    <p className="md:hidden text-yellow-100 text-xs sm:text-sm font-medium">Prog</p>
                                </div>
                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-100">
                                    {projects.filter(p => p.status === "En Progreso").length}
                                </p>
                            </div>
                        </div>

                        <div
                            className="bg-white/10 rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 transform hover:scale-105 transition-all duration-300">
                            <div className="flex items-center justify-between gap-1 sm:gap-2">
                                <div className="flex flex-row justify-center items-center gap-1 sm:gap-2">
                                    <div className="bg-purple-100 rounded-full p-1.5 sm:p-2">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none"
                                             stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <p className="hidden md:block text-purple-100 text-xs sm:text-sm font-medium">Completados</p>
                                    <p className="md:hidden text-purple-100 text-xs sm:text-sm font-medium">Comp</p>
                                </div>
                                <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-100">
                                    {projects.filter(p => p.status === "Completado").length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-12">
                <div className="bg-white w-full rounded-2xl shadow-lg p-6 mb-8 flex justify-between items-center">
                    <div className="flex flex-col justify-between items-start gap-4 w-full">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Filtrar por estado</h2>
                            <p className="text-sm text-gray-500">Selecciona el estado de los proyectos que deseas
                                ver</p>
                        </div>
                        <SearchFilter filter={filter} onFilterChange={setFilter}/>
                    </div>

                    <button
                        onClick={() => router.push("/project/new")}
                        className=" fixed right-4 bottom-4 z-50 md:relative inline-flex items-center gap-2 px-6 py-3 bg-slate-600 text-slate-50 rounded-xl font-medium hover:bg-slate-500 hover:cursor-pointer transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                        </svg>
                        <span className="hidden md:block">Nuevo Proyecto</span>
                    </button>
                </div>

                {loading ? (
                    <div>
                        <DashboardLoading></DashboardLoading>
                    </div>

                ) : projects.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="bg-gray-100 rounded-full p-6 mb-4">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay proyectos</h3>
                            <p className="text-gray-500">Comienza creando tu primer proyecto</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <div
                                key={project.id}
                                className="transform hover:-translate-y-2 transition-all duration-300"
                                style={{animationDelay: `${index * 100}ms`}}
                            >
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onEdit={handleEdit}
                                    onDelete={(id) => handleDeleteClick(id, project.title)}></ProjectCard>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <RemoveModal
                isOpen={projectToDelete !== null}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title="Eliminar Proyecto"
                message="¿Estás seguro de que deseas eliminar este proyecto?"
                confirmText="Sí, eliminar"
                cancelText="Cancelar"
                confirmButtonColor="red"
                isLoading={isDeleting}
                itemName={projectTitle}
            />
        </div>
    );
}
