-- Basket Performance Schema for Supabase/PostgreSQL

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. TEAMS TABLE
create table if not exists public.teams (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default now(),
    name text not null unique,
    city text,
    logo_url text
);

-- 2. PLAYERS TABLE
create table if not exists public.players (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default now(),
    first_name text not null,
    last_name text not null,
    age integer check (age > 0 and age < 60),
    position text check (position in ('PG', 'SG', 'SF', 'PF', 'C')),
    team_id uuid references public.teams(id) on delete set null,
    height_cm integer,
    weight_kg numeric(5,2),
    jersey_number integer,
    active boolean default true
);

-- 3. GAMES TABLE
create table if not exists public.games (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default now(),
    date date not null default current_date,
    opponent text not null,
    location text check (location in ('Home', 'Away', 'Neutral')),
    outcome text check (outcome in ('W', 'L', 'TBD')),
    team_score integer,
    opponent_score integer,
    opponent_rebotes_totales integer default 0,
    opponent_rebotes_ofensivos integer default 0,
    opponent_rebotes_defensivos integer default 0,
    opponent_asistencias integer default 0,
    opponent_robos integer default 0,
    opponent_tapones integer default 0,
    opponent_perdidas integer default 0,
    opponent_faltas_personales integer default 0
);

-- 4. GAME STATS TABLE
create table if not exists public.game_stats (
    id uuid primary key default uuid_generate_v4(),
    player_id uuid references public.players(id) on delete cascade not null,
    game_id uuid references public.games(id) on delete cascade not null,
    minutes_played integer default 0,
    points integer default 0,
    rebotes_totales integer default 0,
    rebotes_ofensivos integer default 0,
    rebotes_defensivos integer default 0,
    asistencias integer default 0,
    robos integer default 0,
    tapones integer default 0,
    perdidas integer default 0,
    faltas_personales integer default 0,
    tiros_campo_intentados integer default 0,
    tiros_campo_metidos integer default 0,
    tiros_3p_intentados integer default 0,
    tiros_3p_metidos integer default 0,
    tiros_libres_intentados integer default 0,
    tiros_libres_metidos integer default 0,
    plus_minus integer default 0,
    eficiencia numeric(10,2),
    created_at timestamp with time zone default now(),
    unique(game_id, player_id)
);

-- 5. TRAINING METRIC TABLE (Athletic Performance tracking)
create table if not exists public.training_metrics (
    id uuid primary key default uuid_generate_v4(),
    player_id uuid references public.players(id) on delete cascade not null,
    date date not null default current_date,
    training_type text not null, -- 'Court', 'Strength', 'Plyometrics', 'Recovery'
    periodization_phase text, -- 'General Preparation', 'Specific preparation', 'Pre-competitive', 'Competitive', 'Transition'
    rpe integer check (rpe >= 1 and rpe <= 10), -- Rate of Perceived Exertion
    duration_minutes integer,
    jump_height_cm numeric(5,2), -- Athletic Metric
    sprint_10m_sec numeric(4,2), -- Athletic Metric
    sprint_20m_sec numeric(4,2), -- Athletic Metric
    notes text,
    created_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_game_stats_player on public.game_stats(player_id);
create index if not exists idx_training_metrics_player on public.training_metrics(player_id);
create index if not exists idx_players_team on public.players(team_id);

-- Enable RLS (Optional, can be configured later in Supabase Dashboard)
-- alter table public.players enable row level security;
