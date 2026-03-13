import React from 'react';

/**
 * Modal que pregunta "¿Quién hizo la jugada?" 
 * Desacoplado para mejorar la legibilidad de LiveStatsTracker.
 */
export default function WhoMadePlayModal({
    activeAction,
    game,
    players,
    onConfirmAction,
    onCancel,
    getActionColor
}: {
    activeAction: { type: string },
    game: any,
    players: any[],
    onConfirmAction: (playerId: string) => void,
    onCancel: () => void,
    getActionColor: () => string
}) {
    return (
        <div className="absolute inset-0 z-50 bg-navy-dark/95 backdrop-blur-md flex flex-col p-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-white">¿Quién hizo la jugada?</h2>
                <button onClick={onCancel} className="px-6 py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition">
                    Cancelar
                </button>
            </div>

            <div className={`mb-6 p-4 rounded-3xl border-2 flex items-center justify-center ${getActionColor()}`}>
                <span className="text-3xl font-black tracking-widest">{activeAction.type.replace('_', ' ')}</span>
            </div>

            <div className="overflow-y-auto pb-20 space-y-4">
                {/* Botón Gigante del Rival */}
                <button
                    onClick={() => onConfirmAction('OPPONENT')}
                    className="w-full flex items-center justify-center p-6 bg-red-950/40 border-2 border-red-500/50 rounded-3xl hover:bg-red-900/60 active:scale-95 transition-all shadow-lg"
                >
                    <span className="font-black text-red-500 text-2xl uppercase tracking-widest">Equipo Rival ({game.opponent})</span>
                </button>

                {/* Cuadrícula de Nuestros Jugadores */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    {players.map((p: any) => (
                        <button
                            key={p.id}
                            onClick={() => onConfirmAction(p.id)}
                            className="flex flex-col items-center justify-center p-6 bg-slate-900 border border-slate-700 rounded-3xl hover:border-hoops-orange hover:bg-hoops-orange/10 active:scale-95 transition-all shadow-lg"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl font-black text-slate-300 mb-3 shadow-inner">
                                {p.jersey_number || '#'}
                            </div>
                            <span className="font-bold text-white text-lg">{p.first_name}</span>
                            <span className="text-slate-400 text-sm">{p.last_name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
