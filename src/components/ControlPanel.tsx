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
    clientLogoVisible: boolean;
    setClientLogoVisible: (visible: boolean) => void;
    ourLogoVisible: boolean;
    setOurLogoVisible: (visible: boolean) => void;
}

export default function ControlPanel({
    isB2BView,
    onViewChange,
    logoSize,
    setLogoSize,
    secondaryLogoSize,
    setSecondaryLogoSize,
    colors,
    updateColor,
    clientLogoVisible,
    setClientLogoVisible,
    ourLogoVisible,
    setOurLogoVisible
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
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setClientLogoVisible(!clientLogoVisible)}
                                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                                    aria-label={clientLogoVisible ? "Hide client logo" : "Show client logo"}
                                >
                                    <svg
                                        className="w-5 h-5 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {clientLogoVisible ? (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        ) : (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        )}
                                    </svg>
                                </button>
                                <h3 className="text-xl font-semibold text-gray-800">Client Logo</h3>
                            </div>
                            <div className="min-h-[32px]">
                                <LogoSizeControl size={logoSize} onSizeChange={setLogoSize} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setOurLogoVisible(!ourLogoVisible)}
                                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                                    aria-label={ourLogoVisible ? "Hide our logo" : "Show our logo"}
                                >
                                    <svg
                                        className="w-5 h-5 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        {ourLogoVisible ? (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        ) : (
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        )}
                                    </svg>
                                </button>
                                <h3 className="text-xl font-semibold text-gray-800">Our Logo</h3>
                            </div>
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