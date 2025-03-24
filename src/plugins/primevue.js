import {defineNuxtPlugin} from '#app';
import PrimeVue from 'primevue/config';
import {ConfirmationService, ToastService} from "primevue";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue);
    nuxtApp.vueApp.use(ToastService);
    nuxtApp.vueApp.use(ConfirmationService);
});
