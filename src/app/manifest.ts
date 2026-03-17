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
                sizes: 'any',
                type: 'image/x-icon',
            }
        ],
    }
}
