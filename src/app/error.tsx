'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // En un entorno de producción real, aquí podrías enviar el error a Sentry, LogRocket, etc.
        console.error('Error capturado por el Global Error Boundary:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-12 h-12 text-red-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">¡Ups! Algo salió mal</h2>
            <p className="text-slate-400 max-w-md mb-8">
                Ha ocurrido un error inesperado en la aplicación. No te preocupes, el error ha sido registrado.
            </p>

            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-lg"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Intentar de nuevo
                </button>
                <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-hoops-orange text-white hover:bg-hoops-orange-hover transition-colors shadow-lg shadow-hoops-orange/20"
                >
                    <Home className="w-4 h-4" />
                    Volver al Inicio
                </Link>
            </div>

            {/* Solo en Desarrollo (Opcional): Mostrar el mensaje de error técnico para facilitar el debugging */}
            {process.env.NODE_ENV === 'development' && (
                <div className="mt-12 p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-left max-w-2xl w-full overflow-auto">
                    <p className="text-red-400 text-xs font-mono">{error.message}</p>
                </div>
            )}
        </div>
    );
}
