<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';
import {useLayout} from "~/layouts/composables/layout.js";

const { layoutConfig, layoutState, isSidebarActive, resetMenu } = useLayout();

const outsideClickListener = ref(null);
const isClient = typeof window !== 'undefined';
const isMounted = ref(false);

// Update the mounted state after mounting
onMounted(() => {
    isMounted.value = true;
});

const containerClass = computed(() => {
    // Only apply the full class set after mounting to avoid hydration mismatch
    if (!isMounted.value) {
        // During SSR and initial hydration, use a minimal set of classes
        return 'layout-wrapper';
    }
    
    // After mounting, apply the full set of classes
    const classes = ['layout-wrapper'];
    
    if (layoutConfig.menuMode === 'overlay') {
        classes.push('layout-overlay');
    } else if (layoutConfig.menuMode === 'static') {
        classes.push('layout-static');
    }
    
    if (layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static') {
        classes.push('layout-static-inactive');
    }
    
    if (layoutState.overlayMenuActive) {
        classes.push('layout-overlay-active');
    }
    
    if (layoutState.staticMenuMobileActive) {
        classes.push('layout-mobile-active');
    }
    
    return classes.join(' ');
});

watch(isSidebarActive, (newVal) => {
    if (newVal && isClient) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

function bindOutsideClickListener() {
    if (!outsideClickListener.value && isClient) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                resetMenu();
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value && isClient) {
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event) {
    // Only run in browser environment
    if (!isClient) return false;
    
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');
    
    // Check if elements exist before accessing them
    if (!sidebarEl || !topbarEl) return false;

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}
</script>

<template>
    <div :class="containerClass">
        <app-topbar></app-topbar>
        <div class="layout-sidebar">
            <app-sidebar></app-sidebar>
        </div>
        <div class="layout-main-container">
            <div class="layout-main">
                <nuxt-page></nuxt-page>
            </div>
            <app-footer></app-footer>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
    <Toast />
</template>