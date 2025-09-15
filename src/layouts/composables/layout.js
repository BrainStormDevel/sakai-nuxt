import { computed, reactive, readonly } from 'vue';

const layoutConfig = reactive({
    preset: 'Lara',
    primary: 'emerald',
    surface: null,
    darkTheme: false,
    menuMode: 'static',
    theme: 'lara-light-blue' // Add theme property
});

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null
});

export function useLayout() {
    const setPrimary = (value) => {
        layoutConfig.primary = value;
    };

    const setSurface = (value) => {
        layoutConfig.surface = value;
    };

    const setPreset = (value) => {
        layoutConfig.preset = value;
    };

    const setTheme = (value) => {
        layoutConfig.theme = value;
    };

    const setActiveMenuItem = (item) => {
        layoutState.activeMenuItem = item.value || item;
    };

    const setMenuMode = (mode) => {
        layoutConfig.menuMode = mode;
    };

    const toggleDarkMode = () => {
        if (!document.startViewTransition) {
            executeDarkModeToggle();

            return;
        }

        document.startViewTransition(() => executeDarkModeToggle(event));
    };

    const executeDarkModeToggle = () => {
        layoutConfig.darkTheme = !layoutConfig.darkTheme;
        document.documentElement.classList.toggle('app-dark');
        
        // Update theme based on dark mode
        if (layoutConfig.theme.includes('light')) {
            const darkTheme = layoutConfig.theme.replace('light', 'dark');
            setTheme(darkTheme);
            updateTheme(darkTheme);
        } else if (layoutConfig.theme.includes('dark')) {
            const lightTheme = layoutConfig.theme.replace('dark', 'light');
            setTheme(lightTheme);
            updateTheme(lightTheme);
        }
    };

    // Function to update theme dynamically
    const updateTheme = (theme) => {
        // Remove existing theme styles
        const themeLinks = document.querySelectorAll('[data-primevue-theme]');
        themeLinks.forEach(link => link.remove());
        
        // Add new theme
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://unpkg.com/primevue@latest/resources/themes/${theme}/theme.css`;
        link.setAttribute('data-primevue-theme', 'true');
        document.head.appendChild(link);
    };

    const onMenuToggle = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const resetMenu = () => {
        layoutState.overlayMenuActive = false;
        layoutState.staticMenuMobileActive = false;
        layoutState.menuHoverActive = false;
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    const getPrimary = computed(() => layoutConfig.primary);

    const getSurface = computed(() => layoutConfig.surface);

    const getTheme = computed(() => layoutConfig.theme);

    return { 
        layoutConfig: readonly(layoutConfig), 
        layoutState: readonly(layoutState), 
        onMenuToggle, 
        isSidebarActive, 
        isDarkTheme, 
        getPrimary, 
        getSurface, 
        getTheme,
        setActiveMenuItem, 
        toggleDarkMode, 
        setPrimary, 
        setSurface, 
        setPreset, 
        setTheme,
        resetMenu, 
        setMenuMode,
        updateTheme
    };
}