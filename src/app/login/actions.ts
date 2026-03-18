'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        if (error.message.includes('Email not confirmed')) {
            redirect('/login?error=Debes confirmar tu correo electrónico antes de iniciar sesión. (O desactiva "Confirm Email" en Supabase)')
        }
        redirect('/login?error=Correo o contraseña incorrectos')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: (formData.get('email') as string).trim(),
        password: formData.get('password') as string,
    }

    const confirm_password = formData.get('confirm_password') as string
    const coach_name = (formData.get('coach_name') as string).trim()

    // Validaciones Básicas
    if (data.password.length < 6) {
        redirect('/login?mode=signup&error=La contraseña debe tener al menos 6 caracteres')
    }

    if (data.password !== confirm_password) {
        redirect('/login?mode=signup&error=Las contraseñas no coinciden')
    }

    const { data: authData, error } = await supabase.auth.signUp({
        ...data,
        options: {
            data: {
                full_name: coach_name,
            }
        }
    })

    if (error) {
        // Traduciendo errores comunes de Supabase
        let errorMessage = error.message;
        if (errorMessage.includes('User already registered')) {
            errorMessage = 'Este correo electrónico ya está registrado.'
        } else if (errorMessage.includes('Password should be at least')) {
            errorMessage = 'La contraseña debe tener al menos 6 caracteres.'
        } else {
            errorMessage = 'Error al registrar: ' + errorMessage;
        }
        redirect('/login?mode=signup&error=' + encodeURIComponent(errorMessage))
    }

    if (!authData.session) {
        // Supabase requiere confirmación de email y por lo tanto no inició la sesión automáticamente.
        redirect('/login?error=Cuenta creada con éxito. Por favor, revisa tu bandeja de entrada o spam para confirmar tu correo electrónico.')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
