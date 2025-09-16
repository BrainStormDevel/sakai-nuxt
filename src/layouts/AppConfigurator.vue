<script setup>
import { useLayout } from '@/layouts/composables/layout';
import { $t, updatePreset, updateSurfacePalette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';
import { ref, watch, onMounted } from 'vue';

const { layoutConfig, isDarkTheme, setPrimary, setSurface, setPreset, setMenuMode, primaryColors, surfaces } = useLayout();

const presets = {
    Aura,
    Lara,
    Nora
};
const preset = ref(layoutConfig.preset);
const presetOptions = ref(Object.keys(presets));

const menuMode = ref(layoutConfig.menuMode);
const menuModeOptions = ref([
    { label: 'Static', value: 'static' },
    { label: 'Overlay', value: 'overlay' }
]);

// Client-only refs to avoid hydration issues
const isMounted = ref(false);
const clientPrimary = ref(null);
const clientSurface = ref(null);

// Watch for changes in layoutConfig and update local refs
watch(() => layoutConfig.preset, (newPreset) => {
    preset.value = newPreset;
});

watch(() => layoutConfig.menuMode, (newMenuMode) => {
    menuMode.value = newMenuMode;
});

// Update client refs when layoutConfig changes
watch(() => layoutConfig.primary, (newPrimary) => {
    clientPrimary.value = newPrimary;
});

watch(() => layoutConfig.surface, (newSurface) => {
    clientSurface.value = newSurface;
});

function getPresetExt() {
    const color = primaryColors.find((c) => c.name === layoutConfig.primary);

    if (color.name === 'noir') {
        return {
            semantic: {
                primary: {
                    50: '{surface.50}',
                    100: '{surface.100}',
                    200: '{surface.200}',
                    300: '{surface.300}',
                    400: '{surface.400}',
                    500: '{surface.500}',
                    600: '{surface.600}',
                    700: '{surface.700}',
                    800: '{surface.800}',
                    900: '{surface.900}',
                    950: '{surface.950}'
                },
                colorScheme: {
                    light: {
                        primary: {
                            color: '{primary.950}',
                            contrastColor: '#ffffff',
                            hoverColor: '{primary.800}',
                            activeColor: '{primary.700}'
                        },
                        highlight: {
                            background: '{primary.950}',
                            focusBackground: '{primary.700}',
                            color: '#ffffff',
                            focusColor: '#ffffff'
                        }
                    },
                    dark: {
                        primary: {
                            color: '{primary.50}',
                            contrastColor: '{primary.950}',
                            hoverColor: '{primary.200}',
                            activeColor: '{primary.300}'
                        },
                        highlight: {
                            background: '{primary.50}',
                            focusBackground: '{primary.300}',
                            color: '{primary.950}',
                            focusColor: '{primary.950}'
                        }
                    }
                }
            }
        };
    } else {
        return {
            semantic: {
                primary: color.palette,
                colorScheme: {
                    light: {
                        primary: {
                            color: '{primary.500}',
                            contrastColor: '#ffffff',
                            hoverColor: '{primary.600}',
                            activeColor: '{primary.700}'
                        },
                        highlight: {
                            background: '{primary.50}',
                            focusBackground: '{primary.100}',
                            color: '{primary.700}',
                            focusColor: '{primary.800}'
                        }
                    },
                    dark: {
                        primary: {
                            color: '{primary.400}',
                            contrastColor: '{surface.900}',
                            hoverColor: '{primary.300}',
                            activeColor: '{primary.200}'
                        },
                        highlight: {
                            background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                            focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                            color: 'rgba(255,255,255,.87)',
                            focusColor: 'rgba(255,255,255,.87)'
                        }
                    }
                }
            }
        };
    }
}

function updateColors(type, color) {
    if (type === 'primary') {
        setPrimary(color.name);
    } else if (type === 'surface') {
        setSurface(color.name);
    }

    applyTheme(type, color);
}

function applyTheme(type, color) {
    if (type === 'primary') {
        updatePreset(getPresetExt());
    } else if (type === 'surface') {
        updateSurfacePalette(color.palette);
    }
}

function onPresetChange() {
    setPreset(preset.value);
    const presetValue = presets[preset.value];
    const surfacePalette = surfaces.find((s) => s.name === layoutConfig.surface)?.palette;

    $t().preset(presetValue).preset(getPresetExt()).surfacePalette(surfacePalette).use({ useDefaultOptions: true });
}

function onMenuModeChange() {
    setMenuMode(menuMode.value);
}

// Only update after mounting to avoid hydration issues
onMounted(() => {
    isMounted.value = true;
    
    // Get the actual values from localStorage to match what the server rendered
    const savedConfig = typeof window !== 'undefined' && typeof localStorage !== 'undefined' 
        ? JSON.parse(localStorage.getItem('layoutConfig') || '{}') 
        : {};
    
    // Set client refs to match what's in localStorage or use defaults
    clientPrimary.value = savedConfig.primary || 'emerald';
    clientSurface.value = savedConfig.surface || null;
    
    // Also update local refs to match saved config
    if (savedConfig.preset) {
        preset.value = savedConfig.preset;
    }
    
    // Update menuMode ref to match saved config
    if (savedConfig.menuMode) {
        menuMode.value = savedConfig.menuMode;
        // Ensure the layoutConfig is also updated
        setMenuMode(savedConfig.menuMode);
    }
    
    // Apply the preset configuration on mount
    if (savedConfig.preset) {
        const presetValue = presets[savedConfig.preset] || Aura;
        const presetExt = getPresetExt();
        const surfacePalette = surfaces.find((s) => s.name === (savedConfig.surface || layoutConfig.surface))?.palette;
        
        $t().preset(presetValue).preset(presetExt).surfacePalette(surfacePalette).use({ useDefaultOptions: true });
    }
});
</script>

<template>
    <div v-if="isMounted" class="config-panel-inner">
        <div class="flex flex-col gap-4">
            <div>
                <span class="text-sm text-muted-color font-semibold">Primary</span>
                <div class="pt-2 flex gap-2 flex-wrap justify-between">
                    <button
                        v-for="primaryColor of primaryColors"
                        :key="primaryColor.name"
                        type="button"
                        :title="primaryColor.name"
                        @click="updateColors('primary', primaryColor)"
                        :class="['border-none w-5 h-5 rounded-full p-0 cursor-pointer outline-none outline-offset-1', { 'outline-primary': clientPrimary && clientPrimary === primaryColor.name }]"
                        :style="{ backgroundColor: `${primaryColor.name === 'noir' ? 'var(--text-color)' : primaryColor.palette['500']}` }"
                    ></button>
                </div>
            </div>
            <div>
                <span class="text-sm text-muted-color font-semibold">Surface</span>
                <div class="pt-2 flex gap-2 flex-wrap justify-between">
                    <button
                        v-for="surface of surfaces"
                        :key="surface.name"
                        type="button"
                        :title="surface.name"
                        @click="updateColors('surface', surface)"
                        :class="[
                            'border-none w-5 h-5 rounded-full p-0 cursor-pointer outline-none outline-offset-1',
                            { 'outline-primary': clientSurface ? clientSurface === surface.name : isDarkTheme ? surface.name === 'zinc' : surface.name === 'slate' }
                        ]"
                        :style="{ backgroundColor: `${surface.palette['500']}` }"
                    ></button>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <span class="text-sm text-muted-color font-semibold">Presets</span>
                <SelectButton v-model="preset" @change="onPresetChange" :options="presetOptions" :allowEmpty="false" />
            </div>
            <div class="flex flex-col gap-2">
                <span class="text-sm text-muted-color font-semibold">Menu Mode</span>
                <SelectButton v-model="menuMode" @change="onMenuModeChange" :options="menuModeOptions" :allowEmpty="false" optionLabel="label" optionValue="value" />
            </div>
        </div>
    </div>
</template>