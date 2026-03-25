'use client';

import {useEffect} from 'react';

interface RemoveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonColor?: 'red' | 'blue' | 'green';
    isLoading?: boolean;
    itemName?: string;
}

export default function RemoveModal({
                                        isOpen,
                                        onClose,
                                        onConfirm,
                                        title,
                                        message,
                                        confirmText = "Confirmar",
                                        cancelText = "Cancelar",
                                        confirmButtonColor = "red",
                                        isLoading = false,
                                        itemName
                                    }: RemoveModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getButtonColorClass = () => {
        switch (confirmButtonColor) {
            case 'red':
                return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
            case 'blue':
                return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
            case 'green':
                return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
            default:
                return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
        }
    };

    const getIconColor = () => {
        switch (confirmButtonColor) {
            case 'red':
                return 'bg-red-100 text-red-600';
            case 'blue':
                return 'bg-blue-100 text-blue-600';
            case 'green':
                return 'bg-green-100 text-green-600';
            default:
                return 'bg-red-100 text-red-600';
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform animate-scaleIn">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconColor()}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600 mb-2">
                        {message}
                    </p>
                    {itemName && (
                        <p className="font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg break-words">
                            "{itemName}"
                        </p>
                    )}
                    <p className="text-sm text-red-600 mt-3 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                        Esta acción no se puede deshacer.
                    </p>
                </div>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 text-white rounded-lg transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${getButtonColorClass()}`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Procesando...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>

            <style jsx>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }

              @keyframes scaleIn {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }

              .animate-fadeIn {
                animation: fadeIn 0.2s ease-out;
              }

              .animate-scaleIn {
                animation: scaleIn 0.2s ease-out;
              }
            `}</style>
        </div>
    );
}
