import React, { useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useChartColors } from '../contexts/ChartColorContext';

interface ChartColorControlsProps {
    onColorChange: (chartType: string, color: string) => void;
    colors: {
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
    };
    b2bData: any | null;
    b2cData: any | null;
    isB2BView: boolean;
    onViewChange: (isB2B: boolean) => void;
}

export default function ChartColorControls({
    colors,
    onColorChange,
    b2bData,
    b2cData,
    isB2BView,
    onViewChange
}: ChartColorControlsProps) {
    const { updateBaseColor, updateColor } = useChartColors();
    const [activePicker, setActivePicker] = React.useState<string | null>(null);
    const [isCustomSize, setIsCustomSize] = useState(false);

    useEffect(() => {
        const logoSizeSelect = document.querySelector('#logo-size') as HTMLSelectElement;
        const updateCustomState = () => {
            setIsCustomSize(logoSizeSelect?.value === 'custom');
        };

        updateCustomState();
        logoSizeSelect?.addEventListener('change', updateCustomState);

        return () => {
            logoSizeSelect?.removeEventListener('change', updateCustomState);
        };
    }, []);

    const colorControls = [
        {
            label: 'Base Color',
            type: 'baseColor',
            color: colors.baseColor,
            isBase: true
        },
        {
            label: 'Primary Color 1',
            type: 'primaryColor1',
            color: colors.primaryColor1
        },
        {
            label: 'Primary Color 2',
            type: 'primaryColor2',
            color: colors.primaryColor2
        },
        {
            label: 'Primary Color 3',
            type: 'primaryColor3',
            color: colors.primaryColor3
        },
        {
            label: 'Primary Color 4',
            type: 'primaryColor4',
            color: colors.primaryColor4
        },
        { label: 'Doughnut Chart Colors', type: 'doughnut', colors: colors.doughnut }
    ];

    const handleColorChange = (type: string, newColor: string, isBaseColor = false) => {
        if (isBaseColor) {
            updateBaseColor(newColor);
        } else {
            updateColor(type, newColor);
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${isCustomSize ? 'mt-28' : 'mt-20'}`}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Chart Colors</h3>
            <div className="grid grid-cols-1 gap-4">
                {colorControls.map((control) => (
                    <div key={control.type} className="relative">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setActivePicker(activePicker === control.type ? null : control.type)}
                                className="w-8 h-8 rounded border border-gray-300"
                                style={{ backgroundColor: control.color || control.colors?.[0] }}
                            />
                            <span className="text-sm text-gray-700">{control.label}</span>
                        </div>
                        {activePicker === control.type && (
                            <div className="absolute z-10 mt-2">
                                <div className="fixed inset-0" onClick={() => setActivePicker(null)} />
                                <div className="relative bg-white p-4 rounded-lg shadow-lg">
                                    {control.colors ? (
                                        <div className="space-y-2">
                                            {control.colors.map((color, index) => (
                                                <div key={index} className="flex items-center space-x-2">
                                                    <HexColorPicker
                                                        color={color}
                                                        onChange={(newColor: string) => handleColorChange(`${control.type}-${index}`, newColor)}
                                                    />
                                                    <span className="text-sm text-gray-600">Color {index + 1}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <HexColorPicker
                                            color={control.color}
                                            onChange={(newColor: string) => handleColorChange(control.type, newColor, control.isBase)}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* B2B/B2C Toggle */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-center">
                    <div className="relative inline-flex rounded-full bg-gray-100 p-1 w-[200px]">
                        <div
                            className="absolute inset-y-1 rounded-full bg-blue-600 transition-all duration-200 ease-in-out w-[96px]"
                            style={{
                                left: isB2BView ? '4px' : 'calc(50% + 4px)',
                            }}
                        />
                        <button
                            onClick={() => onViewChange(true)}
                            className={`relative z-10 flex-1 px-6 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${isB2BView ? 'text-white' : 'text-blue-600'
                                }`}
                        >
                            B2B
                        </button>
                        <button
                            onClick={() => onViewChange(false)}
                            className={`relative z-10 flex-1 px-6 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${!isB2BView ? 'text-white' : 'text-blue-600'
                                }`}
                        >
                            B2C
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 