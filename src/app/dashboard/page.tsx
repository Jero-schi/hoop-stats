import React from 'react';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-neutral-900 text-white p-12">
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-5xl font-black tracking-tight text-white mb-2">COACH'S DASHBOARD</h1>
                        <p className="text-zinc-500 text-lg uppercase tracking-widest font-bold">Elite Performance & Team Logistics</p>
                    </div>
                    <button className="px-10 py-5 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black transition-all transform active:scale-95 shadow-2xl flex items-center gap-4">
                        New Session Entry
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="p-8 bg-zinc-800/80 backdrop-blur-xl rounded-3xl border border-white/5 hover:border-orange-500/50 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-orange-600/20 transition-all"></div>
                        <p className="text-zinc-500 text-sm font-black mb-1 uppercase tracking-wider">Total Active Players</p>
                        <p className="text-6xl font-black text-white">12</p>
                    </div>
                    <div className="p-8 bg-zinc-800/80 backdrop-blur-xl rounded-3xl border border-white/5">
                        <p className="text-zinc-500 text-sm font-black mb-1 uppercase tracking-wider">Current Phase</p>
                        <p className="text-4xl font-black text-orange-500">MESOCYCLE 3</p>
                        <p className="text-zinc-600 font-bold mt-2">Functional Strength</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
