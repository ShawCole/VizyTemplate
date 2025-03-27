import React, { useState, useRef } from 'react';

interface LogoUploadProps {
    className?: string;
    onLogoChange: (logoUrl: string) => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ className, onLogoChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (file.type === 'image/png' || file.type === 'image/svg+xml' || file.type === 'image/webp' || file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const url = reader.result as string;
                setPreviewUrl(url);
                onLogoChange(url);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a PNG, SVG, or WebP file for best transparency support.');
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    return (
        <div
            className={`relative ${className || ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/png,image/svg+xml,image/webp"
                onChange={handleFileInput}
            />
            <div className={`
                flex flex-col items-center justify-center p-6
                transition-colors duration-200 cursor-pointer
                ${!previewUrl && 'border-2 border-dashed rounded-lg'}
                ${isDragging ? 'border-blue-500 bg-blue-50' : !previewUrl && 'border-gray-300 hover:border-gray-400'}
                ${previewUrl ? 'bg-transparent' : 'bg-gray-50'}
            `}>
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Uploaded logo"
                        className={`${className} object-contain`}
                        style={{ imageRendering: 'crisp-edges' }}
                    />
                ) : (
                    <>
                        <div className="text-4xl text-gray-400 mb-2">
                            ⬆️
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                            Upload Logo Here<br />
                            <span className="text-gray-400">
                                Upload PNG, SVG, or WebP for transparency
                            </span>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default LogoUpload; 