import React from 'react';

/**
 * Panel Principal de Acciones de Cancha
 * Desacoplado del Tracker Principal para mejor mantenimiento y legibilidad
 */
export default function ActionGrid({ onActionClick, gameScore }: { onActionClick: (type: string) => void, gameScore: { us: number, them: number } }) {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="hidden md:flex font-bold uppercase tracking-widest text-[10px] text-slate-500 gap-4 mt-2 mb-2 sm:mb-4 px-2">
                <span>Score: {gameScore.us}</span>
                <span>Fallos y Otras Stats</span>
            </div>

            {/* Scoring Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
                {/* 3PT */}
                <div className="flex flex-col gap-2">
                    <button onClick={() => onActionClick('3PT_MAKE')} className="h-20 sm:h-28 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 hover:bg-emerald-500/20 active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg shadow-emerald-900/10">
                        <span className="text-2xl sm:text-4xl font-black text-emerald-500">+3</span>
                        <span className="text-emerald-500/80 font-bold text-[10px] sm:text-xs">3PT METIDO</span>
                    </button>
                    <button onClick={() => onActionClick('3PT_MISS')} className="h-12 sm:h-14 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 active:scale-95 transition-all flex items-center justify-center shadow-inner">
                        <span className="text-red-500/80 font-bold text-[10px] sm:text-xs uppercase tracking-wider">3PT Fallado</span>
                    </button>
                </div>

                {/* 2PT */}
                <div className="flex flex-col gap-2">
                    <button onClick={() => onActionClick('2PT_MAKE')} className="h-20 sm:h-28 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 hover:bg-emerald-500/20 active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg shadow-emerald-900/10">
                        <span className="text-2xl sm:text-4xl font-black text-emerald-500">+2</span>
                        <span className="text-emerald-500/80 font-bold text-[10px] sm:text-xs">2PT METIDO</span>
                    </button>
                    <button onClick={() => onActionClick('2PT_MISS')} className="h-12 sm:h-14 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 active:scale-95 transition-all flex items-center justify-center shadow-inner">
                        <span className="text-red-500/80 font-bold text-[10px] sm:text-xs uppercase tracking-wider">2PT Fallado</span>
                    </button>
                </div>

                {/* FT */}
                <div className="flex flex-col gap-2">
                    <button onClick={() => onActionClick('FT_MAKE')} className="h-20 sm:h-28 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 hover:bg-emerald-500/20 active:scale-95 transition-all flex flex-col items-center justify-center shadow-lg shadow-emerald-900/10">
                        <span className="text-2xl sm:text-4xl font-black text-emerald-500">+1</span>
                        <span className="text-emerald-500/80 font-bold text-[10px] sm:text-xs">TL METIDO</span>
                    </button>
                    <button onClick={() => onActionClick('FT_MISS')} className="h-12 sm:h-14 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 active:scale-95 transition-all flex items-center justify-center shadow-inner">
                        <span className="text-red-500/80 font-bold text-[10px] sm:text-xs uppercase tracking-wider">TL Fallado</span>
                    </button>
                </div>
            </div>

            {/* Other Stats Grid */}
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3">
                <button onClick={() => onActionClick('OREB')} className="col-span-2 md:col-span-1 h-16 sm:h-20 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 active:scale-95 transition-all flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-blue-400">O-REB</span>
                </button>
                <button onClick={() => onActionClick('DREB')} className="col-span-2 md:col-span-1 h-16 sm:h-20 rounded-2xl bg-slate-800 border border-slate-600 hover:bg-slate-700 active:scale-95 transition-all flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-white">D-REB</span>
                </button>
                <button onClick={() => onActionClick('AST')} className="col-span-2 md:col-span-1 h-16 sm:h-20 rounded-2xl bg-slate-800 border border-slate-600 hover:bg-slate-700 active:scale-95 transition-all flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-white">AST</span>
                </button>
                <button onClick={() => onActionClick('STL')} className="col-span-2 md:col-span-1 h-16 sm:h-20 rounded-2xl bg-slate-800 border border-slate-600 hover:bg-slate-700 active:scale-95 transition-all flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-white">STL</span>
                </button>
                <button onClick={() => onActionClick('BLK')} className="col-span-2 md:col-span-1 h-16 sm:h-20 rounded-2xl bg-slate-800 border border-slate-600 hover:bg-slate-700 active:scale-95 transition-all flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-white">BLK</span>
                </button>
                <button onClick={() => onActionClick('TOV')} className="col-span-2 md:col-span-1 h-16 sm:h-20 rounded-2xl bg-red-900/20 border border-red-500/30 hover:bg-red-900/40 active:scale-95 transition-all flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-red-500">TOV</span>
                </button>
                <button onClick={() => onActionClick('FOUL')} className="col-span-2 md:col-span-1 md:col-start-7 h-16 sm:h-20 rounded-2xl bg-yellow-900/20 border border-yellow-500/30 hover:bg-yellow-900/40 active:scale-95 transition-all flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-yellow-500">FOUL</span>
                </button>
            </div>
        </div>
    );
}
