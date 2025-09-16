<script setup>
import { onMounted, ref, watch } from 'vue';
import { useLayout } from "~/layouts/composables/layout.js";

// Check if we're in a browser environment
const isClient = typeof window !== 'undefined';
const isMounted = ref(false);

const lineData = ref(null);
const pieData = ref(null);
const polarData = ref(null);
const barData = ref(null);
const radarData = ref(null);
const lineOptions = ref(null);
const pieOptions = ref(null);
const polarOptions = ref(null);
const barOptions = ref(null);
const radarOptions = ref(null);

// Initialize data for server-side rendering
const initialBarData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: '#3B82F6',
            borderColor: '#3B82F6',
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: '#93C5FD',
            borderColor: '#93C5FD',
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

const initialPieData = {
    labels: ['A', 'B', 'C'],
    datasets: [
        {
            data: [540, 325, 702],
            backgroundColor: ['#6366F1', '#A855F7', '#14B8A6'],
            hoverBackgroundColor: ['#818CF8', '#C084FC', '#2DD4BF']
        }
    ]
};

const initialLineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#3B82F6',
            borderColor: '#3B82F6',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#93C5FD',
            borderColor: '#93C5FD',
            tension: 0.4
        }
    ]
};

const initialPolarData = {
    datasets: [
        {
            data: [11, 16, 7, 3],
            backgroundColor: ['#6366F1', '#A855F7', '#14B8A6', '#F97316'],
            label: 'My dataset'
        }
    ],
    labels: ['Indigo', 'Purple', 'Teal', 'Orange']
};

const initialRadarData = {
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
    datasets: [
        {
            label: 'My First dataset',
            borderColor: '#818CF8',
            pointBackgroundColor: '#818CF8',
            pointBorderColor: '#818CF8',
            pointHoverBackgroundColor: '#333333',
            pointHoverBorderColor: '#818CF8',
            data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            borderColor: '#C084FC',
            pointBackgroundColor: '#C084FC',
            pointBorderColor: '#C084FC',
            pointHoverBackgroundColor: '#333333',
            pointHoverBorderColor: '#C084FC',
            data: [28, 48, 40, 19, 96, 27, 100]
        }
    ]
};

// Initialize layout composable
const { getPrimary, getSurface, isDarkTheme } = useLayout();

onMounted(() => {
    if (isClient) {
        isMounted.value = true;
        setColorOptions();
    }
});

// Watch for theme changes and update chart colors
watch([getPrimary, isDarkTheme], () => {
    if (isMounted.value && isClient) {
        setColorOptions();
    }
});

function getComputedStyleSafe() {
    if (isClient) {
        try {
            return getComputedStyle(document.documentElement);
        } catch (error) {
            console.error('Error getting computed style:', error);
        }
    }
    // Return default values for server-side rendering
    return {
        getPropertyValue: () => '#64748B' // Default gray color
    };
}

function setColorOptions() {
    const documentStyle = getComputedStyleSafe();
    const textColor = documentStyle.getPropertyValue('--text-color') || '#333333';
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#666666';
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#e0e0e0';

    barData.value = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-500') || '#3B82F6',
                borderColor: documentStyle.getPropertyValue('--p-primary-500') || '#3B82F6',
                data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-200') || '#93C5FD',
                borderColor: documentStyle.getPropertyValue('--p-primary-200') || '#93C5FD',
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };
    barOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    pieData.value = {
        labels: ['A', 'B', 'C'],
        datasets: [
            {
                data: [540, 325, 702],
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-indigo-500') || '#6366F1',
                    documentStyle.getPropertyValue('--p-purple-500') || '#A855F7',
                    documentStyle.getPropertyValue('--p-teal-500') || '#14B8A6'
                ],
                hoverBackgroundColor: [
                    documentStyle.getPropertyValue('--p-indigo-400') || '#818CF8',
                    documentStyle.getPropertyValue('--p-purple-400') || '#C084FC',
                    documentStyle.getPropertyValue('--p-teal-400') || '#2DD4BF'
                ]
            }
        ]
    };

    pieOptions.value = {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };

    lineData.value = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-primary-500') || '#3B82F6',
                borderColor: documentStyle.getPropertyValue('--p-primary-500') || '#3B82F6',
                tension: 0.4
            },
            {
                label: 'Second Dataset',
                data: [28, 48, 40, 19, 86, 27, 90],
                fill: false,
                backgroundColor: documentStyle.getPropertyValue('--p-primary-200') || '#93C5FD',
                borderColor: documentStyle.getPropertyValue('--p-primary-200') || '#93C5FD',
                tension: 0.4
            }
        ]
    };

    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };

    polarData.value = {
        datasets: [
            {
                data: [11, 16, 7, 3],
                backgroundColor: [
                    documentStyle.getPropertyValue('--p-indigo-500') || '#6366F1',
                    documentStyle.getPropertyValue('--p-purple-500') || '#A855F7',
                    documentStyle.getPropertyValue('--p-teal-500') || '#14B8A6',
                    documentStyle.getPropertyValue('--p-orange-500') || '#F97316'
                ],
                label: 'My dataset'
            }
        ],
        labels: ['Indigo', 'Purple', 'Teal', 'Orange']
    };

    polarOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };

    radarData.value = {
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
            {
                label: 'My First dataset',
                borderColor: documentStyle.getPropertyValue('--p-indigo-400') || '#818CF8',
                pointBackgroundColor: documentStyle.getPropertyValue('--p-indigo-400') || '#818CF8',
                pointBorderColor: documentStyle.getPropertyValue('--p-indigo-400') || '#818CF8',
                pointHoverBackgroundColor: textColor,
                pointHoverBorderColor: documentStyle.getPropertyValue('--p-indigo-400') || '#818CF8',
                data: [65, 59, 90, 81, 56, 55, 40]
            },
            {
                label: 'My Second dataset',
                borderColor: documentStyle.getPropertyValue('--p-purple-400') || '#C084FC',
                pointBackgroundColor: documentStyle.getPropertyValue('--p-purple-400') || '#C084FC',
                pointBorderColor: documentStyle.getPropertyValue('--p-purple-400') || '#C084FC',
                pointHoverBackgroundColor: textColor,
                pointHoverBorderColor: documentStyle.getPropertyValue('--p-purple-400') || '#C084FC',
                data: [28, 48, 40, 19, 96, 27, 100]
            }
        ]
    };

    radarOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: textColorSecondary
                }
            }
        }
    };
}
</script>

<template>
    <Fluid class="grid grid-cols-12 gap-8">
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Linear</div>
                <Chart v-if="isMounted && lineData && lineOptions" type="line" :data="lineData" :options="lineOptions"></Chart>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Bar</div>
                <Chart v-if="isMounted && barData && barOptions" type="bar" :data="barData" :options="barOptions"></Chart>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card flex flex-col items-center">
                <div class="font-semibold text-xl mb-4">Pie</div>
                <Chart v-if="isMounted && pieData && pieOptions" type="pie" :data="pieData" :options="pieOptions"></Chart>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card flex flex-col items-center">
                <div class="font-semibold text-xl mb-4">Doughnut</div>
                <Chart v-if="isMounted && pieData && pieOptions" type="doughnut" :data="pieData" :options="pieOptions"></Chart>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card flex flex-col items-center">
                <div class="font-semibold text-xl mb-4">Polar Area</div>
                <Chart v-if="isMounted && polarData && polarOptions" type="polarArea" :data="polarData" :options="polarOptions"></Chart>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
            <div class="card flex flex-col items-center">
                <div class="font-semibold text-xl mb-4">Radar</div>
                <Chart v-if="isMounted && radarData && radarOptions" type="radar" :data="radarData" :options="radarOptions"></Chart>
            </div>
        </div>
    </Fluid>
</template>