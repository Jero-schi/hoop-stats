'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Plus, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Zod Schema: El guardia de seguridad de los Partidos
const gameSchema = z.object({
    opponent: z.string().min(2, "El nombre del rival debe tener al menos 2 letras").max(50, "Nombre demasiado largo"),
    location: z.string().min(1, "Debes elegir una ubicación"),
    date: z.string().min(1, "La fecha es obligatoria"),
});

// Tipado automático inferido de Zod
type GameFormValues = z.infer<typeof gameSchema>;

export default function AddGameForm({ teamId }: { teamId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [players, setPlayers] = useState<any[]>([]);

    // Mantenemos la lógica de selección de jugadores fuera de Zod porque es muy dinámica visualmente
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

    const router = useRouter();

    // 2. React Hook Form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<GameFormValues>({
        resolver: zodResolver(gameSchema),
        defaultValues: {
            opponent: '',
            location: 'Local',
            date: new Date().toISOString().split('T')[0]
        }
    });

    const openModal = async () => {
        setIsOpen(true);
        setGlobalError(null);
        reset(); // Limpia campos anteriores
        const supabase = createClient();
        setIsLoading(true);
        const { data } = await supabase.from('players').select('*').eq('team_id', teamId).eq('active', true).order('first_name');
        if (data) {
            setPlayers(data);
            setSelectedPlayers(data.map(p => p.id));
        }
        setIsLoading(false);
    };

    const togglePlayer = (id: string) => {
        setSelectedPlayers(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    const onSubmit = async (data: GameFormValues) => {
        if (selectedPlayers.length === 0) {
            setGlobalError("Debes seleccionar al menos 1 jugador para iniciar el partido.");
            return;
        }

        setIsLoading(true);
        setGlobalError(null);
        const supabase = createClient();

        const insertData = {
            opponent: data.opponent,
            location: data.location,
            date: data.date,
            team_id: teamId
        };

        const { data: newGame, error } = await supabase
            .from('games')
            .insert([insertData])
            .select()
            .single();

        if (error) {
            setGlobalError('Error al crear el partido en la base de datos: ' + error.message);
            setIsLoading(false);
            return;
        }

        if (newGame && selectedPlayers.length > 0) {
            const initialStats = selectedPlayers.map(pid => ({
                game_id: newGame.id,
                player_id: pid,
                minutes_played: 0,
                points: 0,
                rebotes_totales: 0,
                rebotes_ofensivos: 0,
                rebotes_defensivos: 0,
                asistencias: 0,
                robos: 0,
                tapones: 0,
                perdidas: 0,
                faltas_personales: 0,
                tiros_campo_intentados: 0,
                tiros_campo_metidos: 0,
                tiros_3p_intentados: 0,
                tiros_3p_metidos: 0,
                tiros_libres_intentados: 0,
                tiros_libres_metidos: 0,
            }));
            await supabase.from('game_stats').insert(initialStats);
        }

        setIsLoading(false);
        setIsOpen(false);
        router.push(`/games/${newGame.id}`);
    };

    return (
        <>
            <button
                onClick={openModal}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-hoops-orange text-white shadow-lg shadow-hoops-orange/20 hover:bg-hoops-orange-hover transition-colors flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Nuevo Partido
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/80 backdrop-blur-sm">
                    <div className="bg-navy-light border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-800">
                            <h2 className="text-xl font-black text-white">Configuración del Partido</h2>
                            <button disabled={isLoading} onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                            {globalError && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 text-red-500 text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p>{globalError}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Equipo Rival *</label>
                                    <input
                                        {...register("opponent")}
                                        className={`w-full bg-slate-900 border text-white rounded-xl px-4 py-3 outline-none transition-all ${errors.opponent ? 'border-red-500' : 'border-slate-700 focus:border-hoops-orange'}`}
                                        placeholder="ej. Lakers"
                                    />
                                    {errors.opponent && <p className="text-xs text-red-500 font-bold">{errors.opponent.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ubicación</label>
                                    <select
                                        {...register("location")}
                                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Local">Local</option>
                                        <option value="Visitante">Visitante</option>
                                        <option value="Neutral">Neutral</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha</label>
                                    <input
                                        type="date"
                                        {...register("date")}
                                        className={`w-full bg-slate-900 border text-slate-300 rounded-xl px-4 py-3 outline-none transition-all ${errors.date ? 'border-red-500' : 'border-slate-700 focus:border-hoops-orange'}`}
                                    />
                                    {errors.date && <p className="text-xs text-red-500 font-bold">{errors.date.message}</p>}
                                </div>

                                {players.length > 0 && (
                                    <div className="space-y-2 col-span-1 md:col-span-2 pt-2">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Seleccionar Plantilla (Min. 1)</label>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-md ${selectedPlayers.length === 0 ? 'text-red-500 bg-red-500/10' : 'text-hoops-orange bg-hoops-orange/10'}`}>
                                                {selectedPlayers.length} Seleccionados
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2">
                                            {players.map(p => {
                                                const isSelected = selectedPlayers.includes(p.id);
                                                return (
                                                    <div
                                                        key={p.id}
                                                        onClick={() => togglePlayer(p.id)}
                                                        className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer border transition-all ${isSelected ? 'border-hoops-orange bg-hoops-orange/10 text-white' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600'}`}
                                                    >
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'border-hoops-orange bg-hoops-orange text-white' : 'border-slate-600 bg-transparent'}`}>
                                                            {isSelected && <Check className="w-3 h-3" strokeWidth={4} />}
                                                        </div>
                                                        <div className="truncate text-xs font-bold">
                                                            {p.jersey_number ? `${p.jersey_number} - ` : ''}{p.first_name} {p.last_name}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" disabled={isLoading} onClick={() => setIsOpen(false)} className="px-5 py-3 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={isLoading || selectedPlayers.length === 0} className="px-6 py-3 rounded-xl text-sm font-bold bg-hoops-orange text-white shadow-lg shadow-hoops-orange/20 hover:bg-hoops-orange-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Empezar Partido'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
