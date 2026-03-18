import { login, signup } from './actions'
import Link from 'next/link'
import { PasswordInput } from './password-input'
import { TextInput } from './text-input'
import { AuthHeader } from './auth-header'
import { AuthError } from './auth-error'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string, mode?: string }> }) {
    const searchParams = await props.searchParams;
    const isSignup = searchParams?.mode === 'signup';

    return (
        <div className="min-h-screen bg-navy-dark flex items-center justify-center p-4 selection:bg-hoops-orange/30">
            <div className="w-full max-w-md bg-navy-light/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-500">

                <AuthHeader isSignup={isSignup} />

                <AuthError message={searchParams?.error} />

                <form className="space-y-5 flex flex-col" suppressHydrationWarning>
                    {isSignup && (
                        <TextInput
                            id="coach_name"
                            name="coach_name"
                            label="Nombre del Entrenador"
                            placeholder="Ej: Coach Carter"
                            required={isSignup}
                        />
                    )}

                    <TextInput
                        id="email"
                        name="email"
                        type="email"
                        label="Correo Electrónico"
                        placeholder="coach@hoops.com"
                        required
                    />

                    <PasswordInput
                        id="password"
                        name="password"
                        label="Contraseña"
                        required
                        minLength={6}
                    />

                    {isSignup && (
                        <PasswordInput
                            id="confirm_password"
                            name="confirm_password"
                            label="Confirmar Contraseña"
                            required={isSignup}
                            minLength={6}
                        />
                    )}

                    <div className="pt-4 flex flex-col gap-4">
                        {isSignup ? (
                            <>
                                <button
                                    formAction={signup}
                                    className="w-full px-6 py-3.5 rounded-xl font-black bg-hoops-orange text-white shadow-lg shadow-hoops-orange/20 hover:bg-hoops-orange-hover active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                                >
                                    Registrarse
                                </button>
                                <Link
                                    href="/login"
                                    className="text-center text-sm font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                    ¿Ya tienes cuenta? Inicia sesión aquí
                                </Link>
                            </>
                        ) : (
                            <>
                                <button
                                    formAction={login}
                                    className="w-full px-6 py-3.5 rounded-xl font-black bg-hoops-orange text-white shadow-lg shadow-hoops-orange/20 hover:bg-hoops-orange-hover active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                                >
                                    Iniciar Sesión
                                </button>
                                <Link
                                    href="/login?mode=signup"
                                    className="text-center text-sm font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                    ¿No tienes cuenta? Regístrate aquí
                                </Link>
                            </>
                        )}
                    </div>
                </form>

            </div>
        </div>
    )
}
