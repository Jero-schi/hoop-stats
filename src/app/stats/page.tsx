import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { BarChart3, TrendingUp, Activity, Award } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PrintButton from '@/components/PrintButton';
import { calculateAverage, calculatePercentage } from '@/utils/math';

export const revalidate = 0;

export default async function StatsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const cookieStore = await cookies();
    const activeTeamId = cookieStore.get('active_team_id')?.value;

    let players: any[] = [];
    let stats: any[] = [];

    if (activeTeamId) {
        // Obtener jugadores del equipo activo
        const { data: p } = await supabase.from('players').select('*').eq('team_id', activeTeamId);
        if (p) {
            players = p;
            const playerIds = p.map(pl => pl.id);
            if (playerIds.length > 0) {
                const { data: s } = await supabase.from('game_stats').select('*').in('player_id', playerIds);
                if (s) stats = s;
            }
        }
    }

    // Procesar estadisticas agregadas por jugador
    const playerStatsMap: Record<string, any> = {};

    if (players && stats) {
        players.forEach(p => {
            playerStatsMap[p.id] = {
                ...p,
                gp: 0,
                pts: 0,
                reb: 0,
                oreb: 0,
                dreb: 0,
                ast: 0,
                stl: 0,
                blk: 0,
                tov: 0,
                pf: 0,
                fgm: 0, fga: 0,
                tpm: 0, tpa: 0,
                ftm: 0, fta: 0
            };
        });

        stats.forEach(s => {
            if (playerStatsMap[s.player_id]) {
                const p = playerStatsMap[s.player_id];
                p.gp += 1;
                p.pts += s.points;
                p.reb += s.rebotes_totales;
                p.oreb += s.rebotes_ofensivos;
                p.dreb += s.rebotes_defensivos;
                p.ast += s.asistencias;
                p.stl += s.robos;
                p.blk += s.tapones;
                p.tov += s.perdidas;
                p.pf += s.faltas_personales;
                p.fgm += s.tiros_campo_metidos;
                p.fga += s.tiros_campo_intentados;
                p.tpm += s.tiros_3p_metidos;
                p.tpa += s.tiros_3p_intentados;
                p.ftm += s.tiros_libres_metidos;
                p.fta += s.tiros_libres_intentados;
            }
        });
    }

    // Calcular promedios y porcentajes
    const processedStats = Object.values(playerStatsMap).filter(p => p.gp > 0).map(p => {
        return {
            ...p,
            ppg: calculateAverage(p.pts, p.gp),
            rpg: calculateAverage(p.reb, p.gp),
            orpg: calculateAverage(p.oreb, p.gp),
            drpg: calculateAverage(p.dreb, p.gp),
            apg: calculateAverage(p.ast, p.gp),
            spg: calculateAverage(p.stl, p.gp),
            bpg: calculateAverage(p.blk, p.gp),
            topg: calculateAverage(p.tov, p.gp),
            pfpg: calculateAverage(p.pf, p.gp),
            fgAverages: `${calculateAverage(p.fgm, p.gp)} - ${calculateAverage(p.fga, p.gp)}`,
            tpAverages: `${calculateAverage(p.tpm, p.gp)} - ${calculateAverage(p.tpa, p.gp)}`,
            ftAverages: `${calculateAverage(p.ftm, p.gp)} - ${calculateAverage(p.fta, p.gp)}`,
            fgPct: calculatePercentage(p.fgm, p.fga),
            tpPct: calculatePercentage(p.tpm, p.tpa),
            ftPct: calculatePercentage(p.ftm, p.fta),
        };
    });

    // Ordenar de mayor a menor PPG
    const sortedStats = [...processedStats].sort((a, b) => parseFloat(b.ppg) - parseFloat(a.ppg));

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-hoops-orange/10 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-hoops-orange" />
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Analítica y Estadísticas</h1>
                    </div>
                    <p className="text-slate-400 mt-2">Líderes del equipo y promedios de temporada.</p>
                </div>
                {sortedStats.length > 0 && <PrintButton />}
            </div>

            {sortedStats.length === 0 ? (
                <div className="bg-navy-light/30 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center">
                    <Activity className="w-12 h-12 text-slate-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Aún sin datos</h3>
                    <p className="text-slate-400">Juega algunos partidos y guarda las estadísticas para ver este panel.</p>
                </div>
            ) : (
                <>
                    {/* Top Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Scoring Leader */}
                        <div className="bg-gradient-to-br from-hoops-orange/20 to-transparent border border-hoops-orange/30 rounded-3xl p-6 relative overflow-hidden group">
                            <Award className="absolute -right-4 -top-4 w-24 h-24 text-hoops-orange/10 transform group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                            <p className="text-hoops-orange font-bold text-sm tracking-widest uppercase mb-4">Líder de Anotación</p>
                            <div className="flex gap-4 items-center">
                                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-hoops-orange/20 flex items-center justify-center text-2xl font-black text-slate-300">
                                    {sortedStats[0].jersey_number}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white">{sortedStats[0].first_name} {sortedStats[0].last_name}</h3>
                                    <p className="text-4xl font-black text-hoops-orange mt-1">{sortedStats[0].ppg} <span className="text-sm text-hoops-orange/60">PPG</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Rebounds Leader */}
                        <div className="bg-gradient-to-br from-blue-500/20 to-transparent border border-blue-500/30 rounded-3xl p-6 relative overflow-hidden group">
                            <Activity className="absolute -right-4 -top-4 w-24 h-24 text-blue-500/10 transform group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                            <p className="text-blue-500 font-bold text-sm tracking-widest uppercase mb-4">Líder de Rebotes</p>
                            <div className="flex gap-4 items-center">

                                <div>
                                    <h3 className="text-xl font-black text-white">{[...sortedStats].sort((a, b) => parseFloat(b.rpg) - parseFloat(a.rpg))[0].last_name}</h3>
                                    <p className="text-3xl font-black text-blue-500 mt-1">{[...sortedStats].sort((a, b) => parseFloat(b.rpg) - parseFloat(a.rpg))[0].rpg} <span className="text-sm text-blue-500/60">RPG</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Assists Leader */}
                        <div className="bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden group">
                            <TrendingUp className="absolute -right-4 -top-4 w-24 h-24 text-emerald-500/10 transform group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                            <p className="text-emerald-500 font-bold text-sm tracking-widest uppercase mb-4">Líder de Asistencias</p>
                            <div className="flex gap-4 items-center">
                                <div>
                                    <h3 className="text-xl font-black text-white">{[...sortedStats].sort((a, b) => parseFloat(b.apg) - parseFloat(a.apg))[0].last_name}</h3>
                                    <p className="text-3xl font-black text-emerald-500 mt-1">{[...sortedStats].sort((a, b) => parseFloat(b.apg) - parseFloat(a.apg))[0].apg} <span className="text-sm text-emerald-500/60">APG</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Master Data Table */}
                    <div className="bg-navy-light/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl mt-8">
                        <div className="p-6 border-b border-slate-800/50 bg-slate-900/40">
                            <h3 className="text-lg font-bold text-white">Promedios de Temporada</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead>
                                    <tr className="bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-widest">
                                        <th className="p-4 font-bold pl-6 sticky left-0 bg-slate-900 z-10 w-48">Jugador</th>
                                        <th className="p-4 font-bold text-center">GP</th>
                                        <th className="p-4 font-bold text-center text-white">PTS</th>
                                        <th className="p-4 px-6 font-bold text-center whitespace-nowrap">FGM-A</th>
                                        <th className="p-4 px-6 font-bold text-center whitespace-nowrap">3PM-A</th>
                                        <th className="p-4 px-6 font-bold text-center whitespace-nowrap">FTM-A</th>
                                        <th className="p-4 font-bold text-center border-x border-slate-800">FG%</th>
                                        <th className="p-4 font-bold text-center border-r border-slate-800">3PT%</th>
                                        <th className="p-4 font-bold text-center border-r border-slate-800">FT%</th>
                                        <th className="p-4 font-bold text-center text-blue-400/80">OREB</th>
                                        <th className="p-4 font-bold text-center text-slate-400">DREB</th>
                                        <th className="p-4 font-bold text-center text-blue-400">REB</th>
                                        <th className="p-4 font-bold text-center text-emerald-500">AST</th>
                                        <th className="p-4 font-bold text-center">STL</th>
                                        <th className="p-4 font-bold text-center">BLK</th>
                                        <th className="p-4 font-bold text-center text-red-500">TOV</th>
                                        <th className="p-4 font-bold text-center text-yellow-500">PF</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedStats.map((p, idx) => (
                                        <tr key={p.id} className="border-b border-slate-800/30 hover:bg-slate-800/50 transition-colors text-white text-sm">
                                            <td className="p-4 pl-6 flex items-center gap-3 sticky left-0 bg-slate-900/90 z-10 w-48">
                                                <div className="flex-shrink-0 w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                    {p.jersey_number || '#'}
                                                </div>
                                                <span className="font-bold truncate text-sm">{p.first_name} {p.last_name}</span>
                                            </td>
                                            <td className="p-4 text-center font-medium text-slate-400">{p.gp}</td>
                                            <td className="p-4 text-center font-black text-hoops-orange text-lg shadow-[inset_-10px_0_10px_-10px_rgba(0,0,0,0.5)]">{p.ppg}</td>
                                            <td className="p-4 px-6 text-center font-medium text-slate-300 whitespace-nowrap">{p.fgAverages}</td>
                                            <td className="p-4 px-6 text-center font-medium text-slate-300 whitespace-nowrap">{p.tpAverages}</td>
                                            <td className="p-4 px-6 text-center font-medium text-slate-300 whitespace-nowrap">{p.ftAverages}</td>
                                            <td className="p-4 text-center font-bold text-white border-x border-slate-800/30">{p.fgPct}%</td>
                                            <td className="p-4 text-center font-bold text-white border-r border-slate-800/30">{p.tpPct}%</td>
                                            <td className="p-4 text-center font-bold text-white border-r border-slate-800/30">{p.ftPct}%</td>
                                            <td className="p-4 text-center font-medium text-blue-400/80">{p.orpg}</td>
                                            <td className="p-4 text-center font-medium text-slate-400">{p.drpg}</td>
                                            <td className="p-4 text-center font-bold text-blue-400">{p.rpg}</td>
                                            <td className="p-4 text-center font-bold text-emerald-500">{p.apg}</td>
                                            <td className="p-4 text-center text-slate-400">{p.spg}</td>
                                            <td className="p-4 text-center text-slate-400">{p.bpg}</td>
                                            <td className="p-4 text-center font-medium text-red-400/80">{p.topg}</td>
                                            <td className="p-4 text-center font-medium text-yellow-500">{p.pfpg}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )
            }
        </div >
    );
}
