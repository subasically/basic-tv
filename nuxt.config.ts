import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      timezone: process.env.NUXT_TIMEZONE,
      tv_regions: process.env.NUXT_TV_REGIONS,
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
  },
  hooks: {
    "build:done": () => {
      console.log('Build done!')
      // Print the runtime config values
      console.log(`Timezone: ${process.env.NUXT_TIMEZONE}`)
      console.log(`TV Regions: ${process.env.NUXT_TV_REGIONS}`)
    }
  }
})