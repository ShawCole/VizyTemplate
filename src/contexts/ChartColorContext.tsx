import React, { createContext, useContext, useState } from 'react';

interface ChartColors {
    baseColor: string;
    primaryColor1: string;
    primaryColor2: string;
    primaryColor3: string;
    primaryColor4: string;
    doughnut: string[];
    bar: string;
    industries: string;
    jobTitles: string;
    departments: string;
    seniority: string;
    gender: string;
    age: string;
    income: string;
    netWorth: string;
    companySize: string;
    companyRevenue: string;
    [key: string]: string | string[]; // Add index signature
}

interface ChartColorContextType {
    colors: ChartColors;
    updateBaseColor: (color: string) => void;
    updateColor: (chartType: string, color: string) => void;
}

// Function to adjust color based on base color
function adjustColor(baseColor: string, redOffset: number, blueOffset: number): string {
    // Parse the base color
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    // Apply offsets and ensure values stay within 0-255 range
    const newR = Math.min(255, Math.max(0, r + redOffset));
    const newB = Math.min(255, Math.max(0, b + blueOffset));

    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// Function to generate related colors from base color
function generateRelatedColors(baseColor: string): string[] {
    return [
        baseColor,
        adjustColor(baseColor, 30, -4),   // Second color (was 21, -2)
        adjustColor(baseColor, 65, -15),  // Third color (was 47, -10)
        adjustColor(baseColor, 85, -12)   // Fourth color (was 60, -8)
    ];
}

const defaultBaseColor = '#60A5FA';
const defaultColors: ChartColors = {
    baseColor: defaultBaseColor,
    primaryColor1: '#60A5FA',
    primaryColor2: '#818CF8',
    primaryColor3: '#A78BFA',
    primaryColor4: '#C084FC',
    doughnut: ['#60A5FA', '#818CF8', '#A78BFA', '#C084FC'],
    bar: '#4F46E5',
    industries: '#60A5FA',
    jobTitles: '#818CF8',
    departments: '#A78BFA',
    seniority: '#C084FC',
    gender: '#60A5FA',
    age: '#818CF8',
    income: '#60A5FA',
    netWorth: '#818CF8',
    companySize: '#60A5FA',
    companyRevenue: '#818CF8',
};

const ChartColorContext = createContext<ChartColorContextType | undefined>(undefined);

export function ChartColorProvider({ children }: { children: React.ReactNode }) {
    const [colors, setColors] = useState<ChartColors>(defaultColors);

    const updateBaseColor = (newBaseColor: string) => {
        setColors(prevColors => ({
            ...prevColors,
            baseColor: newBaseColor,
            doughnut: [
                prevColors.primaryColor1,
                prevColors.primaryColor2,
                prevColors.primaryColor3,
                prevColors.primaryColor4
            ],
            industries: prevColors.primaryColor1,
            jobTitles: prevColors.primaryColor2,
            departments: prevColors.primaryColor3,
            seniority: prevColors.primaryColor4,
            gender: prevColors.primaryColor1,
            age: prevColors.primaryColor2,
            income: prevColors.primaryColor1,
            netWorth: prevColors.primaryColor2,
            companySize: prevColors.primaryColor1,
            companyRevenue: prevColors.primaryColor2
        }));
    };

    const updateColor = (chartType: string, color: string) => {
        setColors(prevColors => {
            if (chartType === 'primaryColor1') {
                const newDoughnutColors = [...prevColors.doughnut];
                newDoughnutColors[0] = color;
                return {
                    ...prevColors,
                    primaryColor1: color,
                    industries: color,
                    gender: color,
                    income: color,
                    companySize: color,
                    doughnut: newDoughnutColors
                };
            }

            if (chartType === 'primaryColor2') {
                const newDoughnutColors = [...prevColors.doughnut];
                newDoughnutColors[1] = color;
                return {
                    ...prevColors,
                    primaryColor2: color,
                    jobTitles: color,
                    age: color,
                    netWorth: color,
                    companyRevenue: color,
                    doughnut: newDoughnutColors
                };
            }

            if (chartType === 'primaryColor3') {
                const newDoughnutColors = [...prevColors.doughnut];
                newDoughnutColors[2] = color;
                return {
                    ...prevColors,
                    primaryColor3: color,
                    departments: color,
                    doughnut: newDoughnutColors
                };
            }

            if (chartType === 'primaryColor4') {
                const newDoughnutColors = [...prevColors.doughnut];
                newDoughnutColors[3] = color;
                return {
                    ...prevColors,
                    primaryColor4: color,
                    seniority: color,
                    doughnut: newDoughnutColors
                };
            }

            // Handle array colors (doughnut)
            if (chartType.startsWith('doughnut-')) {
                const [type, index] = chartType.split('-');
                const newColors = [...prevColors[type]];
                newColors[parseInt(index)] = color;

                // Update corresponding primary color
                const primaryColorKey = `primaryColor${parseInt(index) + 1}`;
                return {
                    ...prevColors,
                    [type]: newColors,
                    [primaryColorKey]: color
                };
            }

            // Handle single colors
            return { ...prevColors, [chartType]: color };
        });
    };

    return (
        <ChartColorContext.Provider value={{ colors, updateBaseColor, updateColor }}>
            {children}
        </ChartColorContext.Provider>
    );
}

export function useChartColors() {
    const context = useContext(ChartColorContext);
    if (context === undefined) {
        throw new Error('useChartColors must be used within a ChartColorProvider');
    }
    return context;
} 