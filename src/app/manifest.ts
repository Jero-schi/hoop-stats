import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Hoops Stats',
        short_name: 'Hoops Stats',
        description: 'Gestión y analítica en tiempo real para básquet.',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0F172A', // Navy Dark
        theme_color: '#F97316', // Hoops Orange
        icons: [
            {
                src: '/favicon.ico',
                sizes: '16x16 32x32 64x64',
                type: 'image/x-icon',
            },
            {
                src: '/favicon.ico',
                sizes: '192x192',
                type: 'image/x-icon',
            },
            {
                src: '/favicon.ico',
                sizes: '512x512',
                type: 'image/x-icon',
            }
        ],
    }
}
