import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { TrendingUp, Users, Activity, Flame, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { calculateAverage, calculatePercentage } from '@/utils/math';

export const revalidate = 0; // Para que muestre siempre los datos actualizados

export default async function DashboardPage() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  const activeTeamId = cookieStore.get('active_team_id')?.value;

  let games: any[] = [];
  let players: any[] = [];
  let stats: any[] = [];

  if (activeTeamId) {
    const { data: g } = await supabase.from('games').select('*').eq('team_id', activeTeamId).order('date', { ascending: false });
    const { data: p } = await supabase.from('players').select('*').eq('team_id', activeTeamId);

    if (g) games = g;
    if (p) {
      players = p;
      const playerIds = p.map(pl => pl.id);
      if (playerIds.length > 0) {
        const { data: s } = await supabase.from('game_stats').select('*').in('player_id', playerIds);
        if (s) stats = s;
      }
    }
  }

  // Basic Stats Calculation
  const totalGames = games?.filter(g => g.outcome !== 'TBD').length || 0;
  const wins = games?.filter(g => g.outcome === 'W').length || 0;
  const losses = games?.filter(g => g.outcome === 'L').length || 0;
  const winRate = `${calculatePercentage(wins, totalGames)}%`;

  const totalPoints = games?.filter(g => g.outcome !== 'TBD').reduce((acc, g) => acc + (g.team_score || 0), 0) || 0;
  const avgPoints = calculateAverage(totalPoints, totalGames);

  const activeRoster = players?.filter(p => p.active !== false).length || 0;

  // Calculate Top Performers based on PPG
  const playerStatsMap: any = {};
  if (players && stats) {
    players.forEach(p => {
      playerStatsMap[p.id] = { ...p, pts: 0, ast: 0, gp: 0 };
    });
    stats.forEach(s => {
      if (playerStatsMap[s.player_id]) {
        playerStatsMap[s.player_id].pts += s.points;
        playerStatsMap[s.player_id].ast += s.asistencias;
        playerStatsMap[s.player_id].gp += 1;
      }
    });
  }

  const processedPlayers = Object.values(playerStatsMap)
    .filter((p: any) => p.gp > 0)
    .map((p: any) => ({
      ...p,
      ppg: calculateAverage(p.pts, p.gp),
      apg: calculateAverage(p.ast, p.gp)
    }))
    .sort((a, b) => parseFloat(b.ppg) - parseFloat(a.ppg))
    .slice(0, 3); // Top 3

  const recentGames = games?.filter(g => g.outcome !== 'TBD').slice(0, 3) || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Resumen del Equipo</h1>
          <p className="text-slate-400 mt-2">¡Bienvenido de nuevo! Aquí tienes las últimas estadísticas de la plantilla.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/stats" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-navy-light text-white border border-slate-700 hover:bg-slate-800 transition-colors">
            Analítica Completa
          </Link>
          <Link href="/games" className="px-5 py-2.5 rounded-xl text-sm font-bold bg-hoops-orange text-white shadow-lg shadow-hoops-orange/20 hover:bg-hoops-orange-hover transition-colors">
            Nuevo Partido
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Porc. Victorias", value: winRate, trend: `${wins}V - ${losses}D`, icon: TrophyIcon, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          { label: "Pts. Promedio", value: avgPoints, trend: "Por Partido", icon: Flame, color: "text-hoops-orange", bg: "bg-hoops-orange/10" },
          { label: "Jugadores Activos", value: activeRoster.toString(), trend: "En Plantilla", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Partidos Totales", value: totalGames.toString(), trend: "Jugados", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-navy-light/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-6 hover:bg-navy-light transition-all cursor-default group">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-sm font-bold text-slate-500 flex items-center`}>
                {stat.trend}
              </span>
            </div>
            <div className="mt-6">
              <p className="text-slate-400 text-sm font-semibold">{stat.label}</p>
              <h3 className="text-3xl font-black text-white mt-1 group-hover:scale-105 origin-left transition-transform">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Top Performers */}
        <div className="lg:col-span-2 bg-navy-light/30 border border-slate-800 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Mejores Rendimientos</h2>
            <Link href="/players" className="text-sm font-bold text-hoops-orange flex items-center hover:text-hoops-orange-hover">
              Ver Plantilla <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {processedPlayers.length === 0 ? (
              <div className="text-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                <p className="text-slate-500 font-bold">Aún no hay estadísticas registradas.</p>
              </div>
            ) : processedPlayers.map((player: any, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-xl font-black text-slate-400 ring-2 ring-slate-800">
                    {player.jersey_number || '#'}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{player.first_name} {player.last_name}</h4>
                    <p className="text-xs font-semibold text-slate-500">{player.position || 'Jugador'}</p>
                  </div>
                </div>
                <div className="flex gap-8 text-right">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">PPG</p>
                    <p className="font-black text-white text-lg">{player.ppg}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">APG</p>
                    <p className="font-black text-white text-lg">{player.apg}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">GP</p>
                    <div className="flex items-center justify-end">
                      <p className="font-black text-emerald-500 text-lg">{player.gp}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Games */}
        <div className="bg-navy-light/30 border border-slate-800 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-8">Partidos Recientes</h2>
          <div className="space-y-6">
            {recentGames.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-slate-500 font-bold text-sm">Ningún partido procesado aún.</p>
              </div>
            ) : recentGames.map((game, i) => {
              // Formatear fecha simple (Ej: Oct 24)
              const dateObj = new Date(game.date);
              const dateStr = dateObj.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });

              return (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-inner ${game.outcome === 'W' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                      {game.outcome}
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-hoops-orange transition-colors cursor-pointer">vs {game.opponent}</h4>
                      <p className="text-xs font-medium text-slate-500">{dateStr}</p>
                    </div>
                  </div>
                  <div className="font-black text-slate-300">
                    {game.team_score} - {game.opponent_score}
                  </div>
                </div>
              )
            })}
          </div>

          <Link href="/games" className="mt-8 block text-center w-full py-3 rounded-xl border border-slate-700 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
            Ver Todos los Partidos
          </Link>
        </div>

      </div>
    </div>
  );
}

function TrophyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
