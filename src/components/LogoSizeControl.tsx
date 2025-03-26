import React from 'react';

interface LogoSizeControlProps {
    size: string;
    onSizeChange: (size: string) => void;
}

export default function LogoSizeControl({ size, onSizeChange }: LogoSizeControlProps) {
    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSize = e.target.value;
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
            case 'custom':
                onSizeChange('w-full h-auto max-w-[400px]');
                break;
            default:
                onSizeChange('w-[180px] h-auto');
        }
    };

    const currentSize = size === 'w-[180px] h-auto' ? 'small' :
        size === 'w-[240px] h-auto' ? 'medium' :
            size === 'w-[300px] h-auto' ? 'large' :
                size === 'w-full h-auto max-w-[400px]' ? 'custom' : 'small';

    return (
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
    );
} 