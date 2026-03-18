import { AlertCircle } from 'lucide-react'

export function AuthError({ message }: { message?: string }) {
    if (!message) return null;

    return (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">{message}</p>
        </div>
    )
}
