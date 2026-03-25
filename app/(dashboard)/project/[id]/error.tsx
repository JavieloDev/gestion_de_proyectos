'use client';

import ErrorBoundary from '@/components/error';

export default function ProjectDetailError({

                                               reset,
                                           }: {
    reset: () => void;
}) {
    return (
        <ErrorBoundary
            reset={reset}
            title="Error al cargar el proyecto"
            message="No pudimos cargar los detalles del proyecto. Por favor, intenta nuevamente."
        />
    );
}
