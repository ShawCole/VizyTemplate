import React, { useState, useEffect } from 'react';

interface LogoSizeControlProps {
    size: string;
    onSizeChange: (size: string) => void;
}

export default function LogoSizeControl({ size, onSizeChange }: LogoSizeControlProps) {
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customWidth, setCustomWidth] = useState('400');

    // Extract current width from size prop when component mounts or size changes
    useEffect(() => {
        const match = size.match(/(\d+)/);
        if (match) {
            setCustomWidth(match[1]);
            // Show custom input if not a preset size
            setShowCustomInput(match[1] !== '180' && match[1] !== '240' && match[1] !== '300');
        }
    }, [size]);

    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSize = e.target.value;
        if (selectedSize === 'custom') {
            setShowCustomInput(true);
            // Use current custom width or default to 400
            const width = customWidth || '400';
            setCustomWidth(width);
            onSizeChange(width);
        } else {
            setShowCustomInput(false);
            const width = selectedSize === 'small' ? '180' :
                selectedSize === 'medium' ? '240' : '300';
            onSizeChange(width);
        }
    };

    const handleCustomWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Allow empty input for backspacing
        if (value === '') {
            setCustomWidth('');
            return;
        }

        // Only allow numbers
        if (/^\d+$/.test(value)) {
            setCustomWidth(value);
            // Immediately apply the new width
            onSizeChange(value);
        }
    };

    const match = size.match(/(\d+)/);
    const currentWidth = match ? match[1] : '180';
    const currentSize =
        currentWidth === '180' ? 'small' :
            currentWidth === '240' ? 'medium' :
                currentWidth === '300' ? 'large' : 'custom';

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
                            inputMode="numeric"
                            pattern="\d*"
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