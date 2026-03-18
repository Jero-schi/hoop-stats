'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps {
    id: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    minLength?: number;
    label: string;
}

export function PasswordInput({ id, name, placeholder = "••••••••", required, minLength, label }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">{label}</label>
            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    required={required}
                    minLength={minLength}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange focus:ring-1 focus:ring-hoops-orange transition-all placeholder:text-slate-600 pr-12"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
        </div>
    )
}
