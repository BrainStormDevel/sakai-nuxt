// https://nuxt.com/docs/api/configuration/nuxt-config
import Theme from '@primeuix/themes/aura';

export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    modules: ['@primevue/nuxt-module', '@nuxtjs/tailwindcss'],
    srcDir: 'src/',
    css: [
        '/assets/styles.scss',
    ],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {}
        }
    },
    primevue: {
        options: {
            ripple: true,
            theme: {
                preset: Theme,
                options: {
                    darkModeSelector: '.app-dark'
                }
            }
        },
        components: {
            include: [
                'Button', 'Menu', 'Timeline', 'Message', 'Panel', 'Tree',
                'Dialog', 'Popover', 'DataTable', 'Column', 'InputText',
                'Drawer', 'ConfirmPopup', 'Toast', 'FileUpload', 'Tooltip',
                'ConfirmDialog', 'Tag', 'Carousel', 'Image', 'Galleria',
                'ButtonGroup', 'SplitButton', 'Toolbar', 'PickList', 'OrderList',
                'DataView', 'Rating', 'Badge', 'OverlayBadge', 'Chip', 'IconField',
                'InputIcon', 'FloatLabel', 'Textarea', 'AutoComplete', 'DatePicker',
                'TieredMenu', 'ContextMenu', 'MegaMenu', 'SelectButton'
            ]
        }
    },
    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'Sakai PrimeVue - Nuxt'
        },
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    silenceDeprecations: ['legacy-js-api'],
                },
            }
        }
    },
})