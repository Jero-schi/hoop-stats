'use client';

import React, { useState } from 'react';
import { Search, Bell, Menu, X, Home, Users, Calendar, Activity, Dumbbell, Trophy } from 'lucide-react';
import Link from 'next/link';
import TeamSelector from './TeamSelector';

const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Roster', href: '/players', icon: Users },
    { name: 'Games', href: '/games', icon: Calendar },
    { name: 'Athletic Dept', href: '/training', icon: Dumbbell },
    { name: 'Analytics', href: '/stats', icon: Activity },
];

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 bg-navy-dark/90 backdrop-blur-xl border-b border-slate-800 h-20 px-4 md:px-8 flex items-center justify-between w-full print:hidden">
            <div className="flex items-center gap-4">
                <div className="hidden md:flex relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-hoops-orange transition-colors" />
                    <input
                        type="text"
                        placeholder="Search players, games, stats..."
                        className="bg-navy-light text-sm text-white placeholder-slate-500 rounded-full pl-10 pr-6 py-2.5 w-80 outline-none focus:ring-2 focus:ring-hoops-orange/50 transition-all shadow-inner shadow-black/20"
                    />
                </div>
                {/* Team Selector para Cambiar Contexto Global de Categorías */}
                <TeamSelector />
            </div>

            <div className="md:hidden flex items-center">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-hoops-orange rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)] border-2 border-navy-dark"></span>
                </button>
            </div>
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-navy-dark/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-navy-light shadow-2xl border-l border-slate-800 flex flex-col slide-in-from-right-1/2 animate-in duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 flex-shrink-0 bg-hoops-orange rounded-lg flex items-center justify-center shadow-lg shadow-hoops-orange/20">
                                    <Trophy className="text-white w-4 h-4" />
                                </div>
                                <span className="text-lg font-black text-white tracking-tighter">
                                    HOOPS<span className="text-slate-500">STATS</span>
                                </span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <nav className="flex-1 py-6 px-4 flex flex-col gap-3 overflow-y-auto">
                            <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Main Menu</p>
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-300 font-medium hover:text-white hover:bg-hoops-orange/10 border border-transparent hover:border-hoops-orange/30 transition-all group"
                                >
                                    <item.icon className="w-5 h-5 text-slate-500 group-hover:text-hoops-orange transition-colors" />
                                    <span className="tracking-wide text-lg">{item.name}</span>
                                </Link>
                            ))}
                        </nav>
                        <div className="p-6 border-t border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-sm font-bold border border-slate-500 text-white">
                                    C
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Coach Jero</p>
                                    <p className="text-xs text-slate-500">Head Coach</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </header >
    );
};

export default Navbar;
