// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      USPlaylist: process.env.NUXT_US_PLAYLIST_URL,
      UKPlaylist: process.env.NUXT_UK_PLAYLIST_URL,
      CAPlaylist: process.env.NUXT_CA_PLAYLIST_URL,
      EPGUrl: process.env.NUXT_EPG_URL
    }
  },
})