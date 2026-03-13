import { login, signup } from './actions'
import { Trophy, AlertCircle } from 'lucide-react'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
    const searchParams = await props.searchParams;

    return (
        <div className="min-h-screen bg-navy-dark flex items-center justify-center p-4 selection:bg-hoops-orange/30">
            <div className="w-full max-w-md bg-navy-light/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-500">

                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-hoops-orange rounded-2xl flex items-center justify-center shadow-lg shadow-hoops-orange/20 mb-6 group cursor-default">
                        <Trophy className="text-white w-8 h-8 group-hover:scale-110 transition-transform" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter text-center">HOOPS<span className="text-slate-500">STATS</span></h1>
                    <p className="text-slate-400 mt-2 font-medium text-center">Panel de Control para Entrenadores</p>
                </div>

                {searchParams?.error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-bold">{searchParams.error}</p>
                    </div>
                )}

                <form className="space-y-5 flex flex-col">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Correo Electrónico</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="coach@hoops.com"
                            required
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange focus:ring-1 focus:ring-hoops-orange transition-all placeholder:text-slate-600"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange focus:ring-1 focus:ring-hoops-orange transition-all placeholder:text-slate-600"
                        />
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            formAction={login}
                            className="w-full px-6 py-3.5 rounded-xl font-black bg-hoops-orange text-white shadow-lg shadow-hoops-orange/20 hover:bg-hoops-orange-hover active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            formAction={signup}
                            className="w-full px-6 py-3.5 rounded-xl font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                        >
                            Crear Cuenta Nueva
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}
