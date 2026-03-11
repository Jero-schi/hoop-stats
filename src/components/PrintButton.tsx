'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 hover:text-white transition-all print:hidden"
        >
            <Printer className="w-4 h-4" />
            <span>Exportar a PDF</span>
        </button>
    );
}
