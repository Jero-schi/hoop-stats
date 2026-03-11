'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { UserPlus, X, Loader2 } from 'lucide-react';

export default function AddPlayerForm({ teamId }: { teamId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        age: '',
        position: 'PG',
        height_cm: '',
        weight_kg: '',
        jersey_number: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const supabase = createClient();

        const insertData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            age: formData.age ? parseInt(formData.age) : null,
            position: formData.position,
            height_cm: formData.height_cm ? parseInt(formData.height_cm) : null,
            weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
            jersey_number: formData.jersey_number ? parseInt(formData.jersey_number) : null,
            team_id: teamId
        };

        const { error } = await supabase.from('players').insert([insertData]);

        setIsLoading(false);

        if (error) {
            alert('Error al añadir jugador: ' + error.message);
        } else {
            setIsOpen(false);
            setFormData({
                first_name: '', last_name: '', age: '', position: 'PG', height_cm: '', weight_kg: '', jersey_number: ''
            });
            router.refresh(); // Tells Next.js to re-fetch Server Components (update the list)
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

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nombre *</label>
                                    <input required name="first_name" value={formData.first_name} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange focus:ring-1 focus:ring-hoops-orange transition-all" placeholder="Michael" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Apellido *</label>
                                    <input required name="last_name" value={formData.last_name} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange focus:ring-1 focus:ring-hoops-orange transition-all" placeholder="Jordan" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posición</label>
                                    <select name="position" value={formData.position} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange transition-all appearance-none cursor-pointer">
                                        <option value="Base (PG)">Base (PG)</option>
                                        <option value="Escolta (SG)">Escolta (SG)</option>
                                        <option value="Alero (SF)">Alero (SF)</option>
                                        <option value="Ala-Pívot (PF)">Ala-Pívot (PF)</option>
                                        <option value="Pívot (C)">Pívot (C)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dorsal #</label>
                                    <input type="number" name="jersey_number" value={formData.jersey_number} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange" placeholder="23" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Edad</label>
                                    <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange" placeholder="28" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Altura (cm)</label>
                                    <input type="number" name="height_cm" value={formData.height_cm} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange" placeholder="198" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peso (kg)</label>
                                    <input type="number" step="0.1" name="weight_kg" value={formData.weight_kg} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange" placeholder="98" />
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
