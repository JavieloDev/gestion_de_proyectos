"use client";

interface SearchFilterProps {
    filter: string;
    onFilterChange: (filter: string) => void;
}

export default function SearchFilter({filter, onFilterChange}: SearchFilterProps) {
    const statuses = ["all", "Activo", "En Progreso", "Completado"];

    return (
        <div className="flex gap-2 w-full">
            {statuses.map((status) => (
                <button
                    key={status}
                    onClick={() => onFilterChange(status)}
                    className={`px-4 py-2 rounded-lg hover:cursor-pointer ${
                        filter === status
                            ? "bg-slate-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    {status === "all" ? "Todos" : status}
                </button>
            ))}
        </div>
    );
}
