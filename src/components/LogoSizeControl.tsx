import React, { useState } from 'react';

interface LogoSizeControlProps {
    size: string;
    onSizeChange: (size: string) => void;
}

export default function LogoSizeControl({ size, onSizeChange }: LogoSizeControlProps) {
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customWidth, setCustomWidth] = useState('400');

    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSize = e.target.value;
        if (selectedSize === 'custom') {
            setShowCustomInput(true);
            onSizeChange(`w-[${customWidth}px] h-auto`);
        } else {
            setShowCustomInput(false);
            switch (selectedSize) {
                case 'small':
                    onSizeChange('w-[180px] h-auto');
                    break;
                case 'medium':
                    onSizeChange('w-[240px] h-auto');
                    break;
                case 'large':
                    onSizeChange('w-[300px] h-auto');
                    break;
                default:
                    onSizeChange('w-[180px] h-auto');
            }
        }
    };

    const handleCustomWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setCustomWidth(value);
        onSizeChange(`w-[${value}px] h-auto`);
    };

    const currentSize = size === 'w-[180px] h-auto' ? 'small' :
        size === 'w-[240px] h-auto' ? 'medium' :
            size === 'w-[300px] h-auto' ? 'large' :
                'custom';

    return (
        <div className="flex flex-col">
            <select
                id="logo-size"
                value={currentSize}
                onChange={handleSizeChange}
                className="px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="custom">Custom</option>
            </select>
            {showCustomInput && (
                <div className="mt-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={customWidth}
                            onChange={handleCustomWidthChange}
                            className="w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Width"
                        />
                        <span className="text-sm text-gray-600">px</span>
                    </div>
                </div>
            )}
        </div>
    );
} 