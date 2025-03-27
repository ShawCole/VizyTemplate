import React from 'react';

interface ViewToggleProps {
    isB2BView: boolean;
    onViewChange: (isB2B: boolean) => void;
}

export default function ViewToggle({ isB2BView, onViewChange }: ViewToggleProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">View Mode</h3>
            <div className="flex justify-center">
                <div className="relative inline-flex rounded-full bg-gray-100 p-1 w-[200px]">
                    <div
                        className="absolute inset-y-1 rounded-full accent-bg transition-all duration-200 ease-in-out w-[96px]"
                        style={{
                            left: isB2BView ? '4px' : 'calc(50% + 4px)',
                        }}
                    />
                    <button
                        onClick={() => onViewChange(true)}
                        className={`relative z-10 flex-1 px-6 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${isB2BView ? 'text-white' : 'accent-text'
                            }`}
                    >
                        B2B
                    </button>
                    <button
                        onClick={() => onViewChange(false)}
                        className={`relative z-10 flex-1 px-6 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${!isB2BView ? 'text-white' : 'accent-text'
                            }`}
                    >
                        B2C
                    </button>
                </div>
            </div>
        </div>
    );
} 