import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { B2CData } from '../../types/data';

interface FamilyDynamicsChartProps {
    data: B2CData[];
}

const COLORS = {
    married: '#4F46E5', // Indigo-600
    single: '#94A3B8',  // Slate-400
    marriedWithKids: '#4338CA', // Indigo-700
    marriedNoKids: '#818CF8',   // Indigo-400
    singleWithKids: '#64748B',  // Slate-500
    singleNoKids: '#CBD5E1',    // Slate-300
};

export const FamilyDynamicsChart: React.FC<FamilyDynamicsChartProps> = ({ data }) => {
    const processedData = useMemo(() => {
        if (!data || data.length === 0) return null;

        let marriedWithKids = 0;
        let marriedNoKids = 0;
        let singleWithKids = 0;
        let singleNoKids = 0;
        let totalMarried = 0;
        let totalSingle = 0;

        data.forEach(item => {
            const isMarried = item.MARRIED === 'Y';
            const hasChildren = item.CHILDREN === 'Y';

            if (isMarried) {
                totalMarried++;
                if (hasChildren) marriedWithKids++;
                else marriedNoKids++;
            } else {
                totalSingle++;
                if (hasChildren) singleWithKids++;
                else singleNoKids++;
            }
        });

        const innerData = [
            { name: 'Married', value: totalMarried, fill: COLORS.married },
            { name: 'Single', value: totalSingle, fill: COLORS.single },
        ];

        const outerData = [
            { name: 'Kids', value: marriedWithKids, fill: COLORS.marriedWithKids },
            { name: 'No Kids', value: marriedNoKids, fill: COLORS.marriedNoKids },
            { name: 'Kids', value: singleWithKids, fill: COLORS.singleWithKids },
            { name: 'No Kids', value: singleNoKids, fill: COLORS.singleNoKids },
        ];

        return { innerData, outerData };
    }, [data]);

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: any) => {
        if (value === 0) return null;
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        const isMultiLine = name === 'No Kids';
        const isInnerRing = name === 'Married' || name === 'Single';

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                className={`${isInnerRing ? 'text-[18px]' : 'text-[16px]'} font-bold`}
            >
                {isMultiLine ? (
                    <>
                        <tspan x={x} dy="-0.6em">No</tspan>
                        <tspan x={x} dy="1.2em">Kids</tspan>
                    </>
                ) : name}
            </text>
        );
    };

    if (!processedData) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400">
                No Data Available
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Family Dynamics</h3>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {/* Outer Ring: Detailed Breakdown */}
                        <Pie
                            data={processedData.outerData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius={110}
                            outerRadius={170}
                            paddingAngle={2}
                            label={renderCustomLabel}
                            labelLine={false}
                            animationDuration={1000}
                        >
                            {processedData.outerData.map((entry, index) => (
                                <Cell key={`cell-outer-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        {/* Inner Ring: Broad Categories */}
                        <Pie
                            data={processedData.innerData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            outerRadius={105}
                            innerRadius={55}
                            paddingAngle={2}
                            label={renderCustomLabel}
                            labelLine={false}
                            animationDuration={800}
                        >
                            {processedData.innerData.map((entry, index) => (
                                <Cell key={`cell-inner-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => {
                                const total = data.length;
                                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                                return [value.toLocaleString(), `${percentage}%`];
                            }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-xs text-gray-400 text-center">
                Inner: Marital Status | Outer: Parental Status Overlap
            </div>
        </div>
    );
};
