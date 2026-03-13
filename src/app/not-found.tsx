import Link from 'next/link';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <SearchX className="w-12 h-12 text-slate-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Fuera de los límites</h2>
            <p className="text-slate-400 max-w-md mb-8">
                Parece que el balón salió de la cancha. La página que buscas no existe o fue eliminada.
            </p>
            <Link
                href="/"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-hoops-orange text-white shadow-lg shadow-hoops-orange/20 hover:bg-hoops-orange-hover transition-colors"
            >
                <Home className="w-5 h-5" />
                Regresar al Inicio
            </Link>
        </div>
    );
}
