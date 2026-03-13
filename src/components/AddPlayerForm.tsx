'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { UserPlus, X, Loader2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Zod Schema: El guardia de seguridad de tus datos
const playerSchema = z.object({
    first_name: z.string().min(2, "Debe tener al menos 2 letras").max(50, "Demasiado largo"),
    last_name: z.string().min(2, "Debe tener al menos 2 letras").max(50, "Demasiado largo"),
    position: z.string().min(1, "Requerido"),
    jersey_number: z.string()
        .refine(val => !val || (parseInt(val) >= 0 && parseInt(val) <= 99), "El dorsal debe ser entre 0 y 99"),
    age: z.string()
        .refine(val => !val || (parseInt(val) >= 10 && parseInt(val) <= 99), "Carga una edad válida (10-99)"),
    height_cm: z.string()
        .refine(val => !val || (parseInt(val) >= 100 && parseInt(val) <= 250), "Altura inválida (100-250cm)"),
    weight_kg: z.string()
        .refine(val => !val || !isNaN(parseFloat(val)) && parseFloat(val) > 20, "Peso inválido"),
});

// Tipado automático inferido de Zod
type PlayerFormValues = z.infer<typeof playerSchema>;

export default function AddPlayerForm({ teamId }: { teamId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const router = useRouter();

    // 2. React Hook Form: Reemplaza el montón de states e if/elses
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<PlayerFormValues>({
        resolver: zodResolver(playerSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            position: 'Base (PG)',
            jersey_number: '',
            age: '',
            height_cm: '',
            weight_kg: ''
        }
    });

    const onSubmit = async (data: PlayerFormValues) => {
        setIsLoading(true);
        setGlobalError(null);

        const supabase = createClient();

        // 3. Transformación Segura
        const insertData = {
            first_name: data.first_name,
            last_name: data.last_name,
            position: data.position,
            age: data.age ? parseInt(data.age) : null,
            height_cm: data.height_cm ? parseInt(data.height_cm) : null,
            weight_kg: data.weight_kg ? parseFloat(data.weight_kg) : null,
            jersey_number: data.jersey_number ? parseInt(data.jersey_number) : null,
            team_id: teamId
        };

        const { error } = await supabase.from('players').insert([insertData]);

        setIsLoading(false);

        if (error) {
            setGlobalError('Error al guardar en el servidor: ' + error.message);
        } else {
            setIsOpen(false);
            reset(); // Limpia todo mágicamente
            router.refresh();
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-hoops-orange text-white shadow-lg shadow-hoops-orange/20 hover:bg-hoops-orange-hover transition-colors flex items-center gap-2"
            >
                <UserPlus className="w-4 h-4" />
                Añadir Jugador
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/80 backdrop-blur-sm">
                    <div className="bg-navy-light border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-800">
                            <h2 className="text-xl font-black text-white">Nuevo Perfil de Jugador</h2>
                            <button disabled={isLoading} onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                            {/* Error Global (si cae Supabase) */}
                            {globalError && (
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 text-red-500 text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p>{globalError}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre *</label>
                                    <input
                                        {...register("first_name")}
                                        className={`w-full bg-slate-900 border text-white rounded-xl px-4 py-3 outline-none transition-all ${errors.first_name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-hoops-orange focus:ring-hoops-orange/20'}`}
                                        placeholder="Michael"
                                    />
                                    {errors.first_name && <p className="text-xs text-red-500 font-bold">{errors.first_name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Apellido *</label>
                                    <input
                                        {...register("last_name")}
                                        className={`w-full bg-slate-900 border text-white rounded-xl px-4 py-3 outline-none transition-all ${errors.last_name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-700 focus:border-hoops-orange focus:ring-hoops-orange/20'}`}
                                        placeholder="Jordan"
                                    />
                                    {errors.last_name && <p className="text-xs text-red-500 font-bold">{errors.last_name.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posición</label>
                                    <select
                                        {...register("position")}
                                        className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="Base (PG)">Base (PG)</option>
                                        <option value="Escolta (SG)">Escolta (SG)</option>
                                        <option value="Alero (SF)">Alero (SF)</option>
                                        <option value="Ala-Pívot (PF)">Ala-Pívot (PF)</option>
                                        <option value="Pívot (C)">Pívot (C)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dorsal #</label>
                                    <input
                                        type="number"
                                        {...register("jersey_number")}
                                        className={`w-full bg-slate-900 border text-white rounded-xl px-4 py-3 outline-none transition-all ${errors.jersey_number ? 'border-red-500' : 'border-slate-700 focus:border-hoops-orange'}`}
                                        placeholder="23"
                                    />
                                    {errors.jersey_number && <p className="text-xs text-red-500 font-bold">{errors.jersey_number.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Edad</label>
                                    <input
                                        type="number"
                                        {...register("age")}
                                        className={`w-full bg-slate-900 border text-white rounded-xl px-4 py-3 outline-none transition-all ${errors.age ? 'border-red-500' : 'border-slate-700 focus:border-hoops-orange'}`}
                                        placeholder="28"
                                    />
                                    {errors.age && <p className="text-xs text-red-500 font-bold">{errors.age.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Altura (cm)</label>
                                    <input
                                        type="number"
                                        {...register("height_cm")}
                                        className={`w-full bg-slate-900 border text-white rounded-xl px-4 py-3 outline-none transition-all ${errors.height_cm ? 'border-red-500' : 'border-slate-700 focus:border-hoops-orange'}`}
                                        placeholder="198"
                                    />
                                    {errors.height_cm && <p className="text-xs text-red-500 font-bold">{errors.height_cm.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peso (kg)</label>
                                    <input
                                        type="number" step="0.1"
                                        {...register("weight_kg")}
                                        className={`w-full bg-slate-900 border text-white rounded-xl px-4 py-3 outline-none transition-all ${errors.weight_kg ? 'border-red-500' : 'border-slate-700 focus:border-hoops-orange'}`}
                                        placeholder="98"
                                    />
                                    {errors.weight_kg && <p className="text-xs text-red-500 font-bold">{errors.weight_kg.message}</p>}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" disabled={isLoading} onClick={() => setIsOpen(false)} className="px-5 py-3 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={isLoading} className="px-6 py-3 rounded-xl text-sm font-bold bg-hoops-orange text-white shadow-lg shadow-hoops-orange/20 hover:bg-hoops-orange-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Jugador'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
