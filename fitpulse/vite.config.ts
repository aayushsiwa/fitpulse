import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [react()],
    // plugins: [
    //   react(),
    //   VitePWA({
    //     registerType: 'autoUpdate',
    //     includeAssets: ['favicon.svg', 'pwa-192.png', 'pwa-512.png'],
    //     manifest: {
    //       name: 'FitPulse Health Tracker',
    //       short_name: 'FitPulse',
    //       description: 'Premium AI-powered health and fitness tracking PWA.',
    //       theme_color: '#0a0a0c',
    //       background_color: '#0a0a0c',
    //       display: 'standalone',
    //       icons: [
    //         {
    //           src: 'pwa-192.png',
    //           sizes: '192x192',
    //           type: 'image/png'
    //         },
    //         {
    //           src: 'pwa-512.png',
    //           sizes: '512x512',
    //           type: 'image/png'
    //         },
    //         {
    //           src: 'pwa-512.png',
    //           sizes: '512x512',
    //           type: 'image/png',
    //           purpose: 'any maskable'
    //         }
    //       ]
    //     }
    //   })
    // ],
});
