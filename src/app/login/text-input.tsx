interface TextInputProps {
    id: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    label: string;
}

export function TextInput({ id, name, type = "text", placeholder, required, label }: TextInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">{label}</label>
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-hoops-orange focus:ring-1 focus:ring-hoops-orange transition-all placeholder:text-slate-600"
            />
        </div>
    )
}
