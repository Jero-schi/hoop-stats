import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import LiveStatsTracker from '@/components/LiveStatsTracker';

export const revalidate = 0;

export default async function GamePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    // 1. Obtener el partido
    const { data: game, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('id', id)
        .single();

    if (gameError || !game) {
        return notFound();
    }

    // 2. Obtener stats previos si ya existían (para saber qué jugadores seleccionaron)
    const { data: initialStats, error: statsError } = await supabase
        .from('game_stats')
        .select('*')
        .eq('game_id', id);

    // 3. Obtener la plantilla (roster)
    let query = supabase.from('players').select('*').eq('active', true);

    if (initialStats && initialStats.length > 0) {
        query = query.in('id', initialStats.map(s => s.player_id));
    } else if (game.team_id) {
        // Fallback for old games without initial stats
        query = query.eq('team_id', game.team_id);
    }
    const { data: players, error: playersError } = await query.order('first_name', { ascending: true });

    return (
        <LiveStatsTracker
            game={game}
            players={players || []}
            initialStats={initialStats || []}
        />
    );
}

