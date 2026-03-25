'use client';

interface LoadingProps {
    text?: string;
    type?: 'dashboard' | 'form' | 'details';
}

export default function Loading({
                                            text = "Cargando...",
                                            type = 'dashboard'
                                        }: LoadingProps) {

    if (type === 'dashboard') {
        return (
            <div>
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="text-center">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">
                            {text}
                        </p>
                    </div>
                </div>
                <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="container mx-auto px-4 py-8">
                        <div className="animate-pulse">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="bg-white rounded-xl shadow-lg h-64"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'details') {
        return (
            <div className="min-h-screen bg-slate-100 py-8">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="animate-pulse">
                        <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                            <div className="h-2 bg-gray-200"></div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                                        <div>
                                            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                                        </div>
                                    </div>
                                    <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
                                </div>
                                <div className="mb-8">
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                    <div className="h-2 bg-gray-200 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
