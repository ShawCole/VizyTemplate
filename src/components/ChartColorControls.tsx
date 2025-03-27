// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
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
        accentColor: string;
    };
}

function ColorControl({
    label,
    type,
    color,
    onColorChange
}: {
    label: string;
    type: string;
    color: string;
    onColorChange: (type: string, color: string) => void;
}) {
    const [showPicker, setShowPicker] = useState(false);
    const [hexInput, setHexInput] = useState(color);

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHexInput(value);

        // Only update if it's a valid hex color
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
            onColorChange(type, value);
        }
    };

    const handleColorChange = (newColor: string) => {
        setHexInput(newColor);
        onColorChange(type, newColor);
    };

    return (
        <div className="relative">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={hexInput}
                        onChange={handleHexChange}
                        className="w-24 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="#000000"
                    />
                    <button
                        className="w-8 h-8 rounded border shadow-sm"
                        style={{ backgroundColor: color }}
                        onClick={() => setShowPicker(!showPicker)}
                    />
                </div>
            </div>
            {showPicker && (
                <div className="absolute right-0 z-10 mt-2">
                    <div
                        className="fixed inset-0"
                        onClick={() => setShowPicker(false)}
                    />
                    <div className="relative">
                        <HexColorPicker
                            color={color}
                            onChange={handleColorChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ChartColorControls({
    colors,
    onColorChange
}: ChartColorControlsProps) {
    const { updateBaseColor, updateColor, updateAccentColor } = useChartColors();

    const colorControls = [
        {
            label: 'Base Color',
            type: 'baseColor',
            color: colors.baseColor
        },
        {
            label: 'Accent Color',
            type: 'accentColor',
            color: colors.accentColor
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
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-2">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Chart Colors</h3>
            <div className="grid grid-cols-1 gap-4">
                {colorControls.map((control) => (
                    <ColorControl
                        key={control.type}
                        label={control.label}
                        type={control.type}
                        color={control.color}
                        onColorChange={(type, color) => {
                            if (type === 'baseColor') {
                                updateBaseColor(color);
                            } else if (type === 'accentColor') {
                                updateAccentColor(color);
                            } else {
                                updateColor(type, color);
                            }
                            onColorChange(type, color);
                        }}
                    />
                ))}
            </div>
        </div>
    );
} 