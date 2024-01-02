import { getHead } from './utils/head'

export default defineNuxtConfig({
   modules: ['notivue/nuxt'],
   ssr: true,
   devtools: {
      enabled: false,
   },
   notivue: {
      // addPlugin: true,
      notifications: {
         global: {
            // duration: Infinity,
         },
      },
   },
   nitro: {
      preset: 'cloudflare-pages',
   },
   app: {
      head: getHead(),
   },
   vite: {
      build: {
         cssMinify: 'lightningcss',
      },
      css: {
         transformer: 'lightningcss',
         lightningcss: {
            drafts: {
               nesting: true,
            },
         },
      },
   },
   css: ['assets/style.css', 'notivue/notifications.css', 'notivue/animations.css'],
})
