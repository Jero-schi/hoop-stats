import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 animate-in fade-in duration-300">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center shadow-inner mb-6 relative">
                <Loader2 className="w-10 h-10 text-hoops-orange animate-spin absolute" />
            </div>
            <h2 className="text-xl font-bold text-slate-300 mb-2">Cargando datos...</h2>
            <p className="text-slate-500 text-sm">Preparando la cancha para el partido.</p>
        </div>
    );
}
