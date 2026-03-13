import React from 'react';
import Link from 'next/link';
import { Home, Users, Calendar, Activity, Dumbbell, Trophy } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { logout } from '@/app/login/actions';

const navItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Plantilla', href: '/players', icon: Users },
    { name: 'Partidos', href: '/games', icon: Calendar },
    { name: 'Prep. Física', href: '/training', icon: Dumbbell },
    { name: 'Estadísticas', href: '/stats', icon: Activity },
];

export default async function Sidebar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userEmail = user?.email || 'coach@hoops.com';
    const init = userEmail.charAt(0).toUpperCase();

    return (
        <aside className="w-64 bg-navy-dark border-r border-slate-800 flex flex-col hidden md:flex h-screen sticky top-0 overflow-hidden print:hidden">
            {/* Brand logo */}
            <div className="h-20 flex items-center px-6 border-b border-slate-800">
                <Link href="/" className="flex items-center gap-3 w-full group cursor-pointer">
                    <div className="w-10 h-10 bg-hoops-orange rounded-xl flex items-center justify-center shadow-lg shadow-hoops-orange/20 transition-transform group-hover:scale-110">
                        <Trophy className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter">
                        HOOPS<span className="text-slate-500">STATS</span>
                    </span>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
                <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Menú Principal</p>
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 font-medium hover:text-white hover:bg-slate-800/50 transition-all group"
                    >
                        <item.icon className="w-5 h-5 text-slate-500 group-hover:text-hoops-orange transition-colors" />
                        <span className="tracking-wide">{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* Bottom Profile / Settings placeholder */}
            <div className="p-4 border-t border-slate-800">
                <form action={logout} className="w-full">
                    <button type="submit" className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer text-left">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-sm font-bold border border-slate-500 text-white">
                            {init}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-white truncate max-w-[150px]">{userEmail}</p>
                            <p className="text-xs text-rose-500 font-bold hover:text-rose-400 transition-colors">Cerrar Sesión</p>
                        </div>
                    </button>
                </form>
            </div>
        </aside>
    );
}
