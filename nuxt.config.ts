import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      channelPlaylist: process.env.NUXT_PLAYLIST_URL,
      epgUrl: process.env.NUXT_EPG_URL
    }
  },
  app: {
    head: {
      link: [{
        rel: 'stylesheet', href: 'https://unpkg.com/video.js@7/dist/video-js.min.css'
      }, {
        rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/videojs-themes@1.0.0/dist/city/index.css'
      }]
    }
  }
})