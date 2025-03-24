import React, { useState } from 'react';

interface LogoSizeControlProps {
    size: string;
    onSizeChange: (size: string) => void;
}

const LogoSizeControl: React.FC<LogoSizeControlProps> = ({ size, onSizeChange }) => {
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customWidth, setCustomWidth] = useState('400');

    const sizes = [
        { label: 'Small', value: 'w-[280px] h-auto' },
        { label: 'Medium', value: 'w-[400px] h-auto' },
        { label: 'Large', value: 'w-[520px] h-auto' },
        { label: 'Custom', value: 'custom' },
    ];

    const handleSizeChange = (value: string) => {
        if (value === 'custom') {
            setShowCustomInput(true);
            onSizeChange(`w-[${customWidth}px] h-auto`);
        } else {
            setShowCustomInput(false);
            onSizeChange(value);
        }
    };

    const handleCustomWidthChange = (width: string) => {
        const numericWidth = width.replace(/\D/g, '');
        setCustomWidth(numericWidth);
        onSizeChange(`w-[${numericWidth}px] h-auto`);
    };

    return (
        <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <label htmlFor="logo-size" className="text-sm font-medium text-gray-700">
                        Logo Size:
                    </label>
                    <select
                        id="logo-size"
                        value={showCustomInput ? 'custom' : size}
                        onChange={(e) => handleSizeChange(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        {sizes.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                {showCustomInput && (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={customWidth}
                            onChange={(e) => handleCustomWidthChange(e.target.value)}
                            className="w-20 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Width"
                        />
                        <span className="text-sm text-gray-600">px</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogoSizeControl; 