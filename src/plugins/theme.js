import { defineNuxtPlugin } from '#app';
import { useLayout } from '~/layouts/composables/layout';
import { $t, updatePreset, updateSurfacePalette } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';

const presets = {
    Aura,
    Lara,
    Nora
};

// Function to get preset extension based on primary color
function getPresetExt(primaryColors, primaryColorName) {
    const color = primaryColors.find((c) => c.name === primaryColorName);

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

export default defineNuxtPlugin(() => {
    // This plugin will run on the client side only
    if (process.client) {
        const { layoutConfig, setPrimary, setSurface, setPreset, setTheme, setMenuMode, primaryColors, surfaces } = useLayout();
        
        // Apply saved layout preferences on app initialization
        const applySavedLayout = () => {
            // Get the actual values from localStorage
            const savedConfig = typeof window !== 'undefined' && typeof localStorage !== 'undefined' 
                ? JSON.parse(localStorage.getItem('layoutConfig') || '{}') 
                : {};
            
            // Apply all saved configuration values in correct order
            if (savedConfig.preset) {
                setPreset(savedConfig.preset);
            }
            
            if (savedConfig.primary) {
                setPrimary(savedConfig.primary);
            }
            
            if (savedConfig.surface) {
                setSurface(savedConfig.surface);
            }
            
            if (savedConfig.menuMode) {
                setMenuMode(savedConfig.menuMode);
            }
            
            if (savedConfig.theme) {
                setTheme(savedConfig.theme);
            }
            
            // Apply the preset configuration
            const presetName = savedConfig.preset || layoutConfig.preset || 'Aura';
            const presetValue = presets[presetName] || Aura;
            const primaryColorName = savedConfig.primary || layoutConfig.primary || 'emerald';
            const surfaceName = savedConfig.surface || layoutConfig.surface;
            
            // Apply the preset with extensions
            const presetExt = getPresetExt(primaryColors, primaryColorName);
            $t().preset(presetValue).preset(presetExt);
            
            // Apply the surface color palette if set
            if (surfaceName) {
                const surface = surfaces.find((s) => s.name === surfaceName);
                if (surface) {
                    updateSurfacePalette(surface.palette);
                }
            }
            
            // Apply dark theme class if needed
            if (savedConfig.darkTheme !== undefined ? savedConfig.darkTheme : layoutConfig.darkTheme) {
                document.documentElement.classList.add('app-dark');
            } else {
                document.documentElement.classList.remove('app-dark');
            }
        };
        
        // Apply layout on client initialization
        applySavedLayout();
    }
    
    // For SSR, we need to make sure the initial state is consistent
    if (process.server) {
        // Server-side rendering - we don't have access to localStorage
        // The default state will be light mode (sun icon)
    }
});