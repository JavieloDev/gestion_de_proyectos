"use client";

interface SearchFilterProps {
    filter: string;
    onFilterChange: (filter: string) => void;
}

export default function SearchFilter({filter, onFilterChange}: SearchFilterProps) {
    const statuses = ["all", "Activo", "En Progreso", "Completado"];

    return (
        <div className="flex flex-wrap gap-2 w-full">
            {statuses.map((status) => (
                <button
                    key={status}
                    onClick={() => onFilterChange(status)}
                    className={`
                        px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg 
                        text-sm sm:text-base
                        transition-all duration-200
                        hover:cursor-pointer hover:scale-105 active:scale-95
                        flex-1 sm:flex-none
                        ${filter === status
                        ? "bg-slate-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }
                    `}
                >
                    {status === "all" ? "Todos" : status}
                </button>
            ))}
        </div>
    );
}
