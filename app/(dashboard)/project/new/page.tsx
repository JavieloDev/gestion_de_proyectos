"use client";

import {useProjects} from "@/hooks/use-project";
import ProjectForm from "@/components/project-form";
import {useRouter} from "next/navigation";
import {ProjectFormData} from "@/lib/types";

export default function NewProjectPage() {
    const {createProject, isCreating} = useProjects();
    const router = useRouter();

    /**
     * Handle form submission for creating a new project.
     * Waits for the async createProject operation to complete before redirecting.
     * @param data - The project form data
     */
    const handleSubmit = async (data: ProjectFormData) => {
        try {
            await createProject(data);
            router.push('/');
        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <ProjectForm
                onSubmit={handleSubmit}
                isLoading={isCreating}
            />
        </div>
    );
}
