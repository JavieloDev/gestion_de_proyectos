"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {Project, ProjectFormData} from "@/lib/types";
import {mockProjects} from "@/lib/data.mock";

const STORAGE_KEY = "(dashboard)-projects";
const SIMULATED_DELAY = 1500

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [operationError, setOperationError] = useState<string | null>(null);


    const simulateAsyncOperation = async <T, >(
        operation: () => T,
        setLoadingState: (loading: boolean) => void
    ): Promise<T> => {
        setLoadingState(true);
        setOperationError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
            const result = operation();
            return result;
        } catch (error) {
            setOperationError(error instanceof Error ? error.message : "Error en la operación");
            throw error;
        } finally {
            setLoadingState(false);
        }
    };

    const loadProjects = useCallback(async () => {
        setLoading(true);
        setOperationError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));

            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setProjects(JSON.parse(stored));
            } else {
                setProjects(mockProjects);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProjects));
            }
        } catch (error) {
            setOperationError(error instanceof Error ? error.message : "Error al cargar proyectos");
            console.error("Error loading projects:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);


    const saveProjects = useCallback((newProjects: Project[]) => {
        setProjects(newProjects);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    }, []);


    const createProject = useCallback(
        async (formData: ProjectFormData) => {
            return simulateAsyncOperation(() => {
                const newProject: Project = {
                    ...formData,
                    id: Date.now(),
                };
                const updatedProjects = [...projects, newProject];
                saveProjects(updatedProjects);
                return newProject;
            }, setIsCreating);
        },
        [projects, saveProjects]
    );


    const updateProject = useCallback(
        async (id: number | string, data: Partial<ProjectFormData>) => {
            return simulateAsyncOperation(() => {
                const updatedProjects = projects.map(project =>
                    project.id.toString() === id.toString()
                        ? {...project, ...data}
                        : project
                );
                saveProjects(updatedProjects);
                return updatedProjects.find(p => p.id.toString() === id.toString());
            }, setIsUpdating);
        },
        [projects, saveProjects]
    );


    const deleteProject = useCallback(
        async (id: number | string) => {
            return simulateAsyncOperation(() => {
                const updatedProjects = projects.filter(project => project.id.toString() !== id.toString());
                saveProjects(updatedProjects);
            }, setIsDeleting);
        },
        [projects, saveProjects]
    );


    const getProjectById = useCallback(
        async (id: number | string) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return projects.find((project) => project.id.toString() === id.toString());
        },
        [projects]
    );


    const filteredProjects = useMemo(() => {
        if (filter === "all") return projects;
        return projects.filter((project) => project.status === filter);
    }, [projects, filter]);

    return {
        projects: filteredProjects,
        allProjects: projects,
        loading,
        filter,
        setFilter,
        createProject,
        updateProject,
        deleteProject,
        getProjectById,
        isCreating,
        isUpdating,
        isDeleting,
        operationError,
        loadProjects
    };
}
