<div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg pl-5 pr-3 py-3 border border-gray-200 w-[280px]">
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
            <label htmlFor="logo-size" className="text-sm font-medium text-gray-700">Logo Size:</label>
            <select
                id="logo-size"
                className="text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
                <option value="w-[280px] h-auto">Small</option>
                <option value="w-[400px] h-auto">Medium</option>
                <option value="w-[520px] h-auto">Large</option>
                <option value="custom">Custom</option>
            </select>
        </div>
    </div>
</div> 