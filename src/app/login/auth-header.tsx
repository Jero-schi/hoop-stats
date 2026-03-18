import { Trophy } from 'lucide-react'

export function AuthHeader({ isSignup }: { isSignup: boolean }) {
    return (
        <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-hoops-orange rounded-2xl flex items-center justify-center shadow-lg shadow-hoops-orange/20 mb-6 group cursor-default">
                <Trophy className="text-white w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter text-center">
                HOOPS<span className="text-slate-500">STATS</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium text-center">
                {isSignup ? "Bienvenido, crea tu cuenta entrenador" : "Panel de Control para Entrenadores"}
            </p>
        </div>
    )
}
