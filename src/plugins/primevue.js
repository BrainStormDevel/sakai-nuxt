import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    theme: 'none', // We'll manage themes through CSS imports
    ripple: true
  })
})