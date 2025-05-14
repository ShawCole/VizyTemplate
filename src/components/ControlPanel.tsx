import { useState } from 'react';
import ViewToggle from './ViewToggle';
import LogoSizeControl from './LogoSizeControl';
import ChartColorControls from './ChartColorControls';

interface ControlPanelProps {
    isB2BView: boolean;
    onViewChange: (isB2B: boolean) => void;
    logoSize: string;
    setLogoSize: (size: string) => void;
    secondaryLogoSize: string;
    setSecondaryLogoSize: (size: string) => void;
    colors: any;
    updateColor: (key: string, value: string) => void;
}

export default function ControlPanel({
    isB2BView,
    onViewChange,
    logoSize,
    setLogoSize,
    secondaryLogoSize,
    setSecondaryLogoSize,
    colors,
    updateColor
}: ControlPanelProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-4 right-4 z-50">
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white p-3 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Toggle settings menu"
            >
                <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={isOpen
                            ? "M6 18L18 6M6 6l12 12" // X icon when open
                            : "M4 6h16M4 12h16M4 18h16" // Hamburger icon when closed
                        }
                    />
                </svg>
            </button>

            {/* Control Panel */}
            {isOpen && (
                <div className="absolute top-16 right-0 flex flex-col gap-4 w-[320px] max-h-[calc(100vh-5rem)] overflow-y-auto">
                    <ViewToggle
                        isB2BView={isB2BView}
                        onViewChange={onViewChange}
                    />

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-800">Logo Size</h3>
                            <div className="min-h-[32px]">
                                <LogoSizeControl size={logoSize} onSizeChange={setLogoSize} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-800">Secondary Logo Size</h3>
                            <div className="min-h-[32px]">
                                <LogoSizeControl size={secondaryLogoSize} onSizeChange={setSecondaryLogoSize} />
                            </div>
                        </div>
                    </div>

                    <ChartColorControls
                        colors={colors}
                        onColorChange={updateColor}
                    />
                </div>
            )}
        </div>
    );
} 