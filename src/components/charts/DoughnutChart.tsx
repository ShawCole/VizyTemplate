import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface DoughnutChartProps {
  data: ChartData[];
  title: string;
  isSemi?: boolean;
  showUnknowns?: boolean;
}

const COLORS = ['#60A5FA', '#818CF8', '#A78BFA', '#C084FC'];

export function DoughnutChart({
  data,
  title,
  isSemi = false,
  showUnknowns = false
}: DoughnutChartProps) {
  const isMaritalOrChildren = title === 'Marital Status' || title === 'Children';

  // Filter out Unknown data when showUnknowns is false
  const filteredData = showUnknowns
    ? data
    : data.filter(item => item.name !== 'Unknown');

  // Sort data to put 'Unknown' between 'Yes' and 'No'
  const sortedData = [...filteredData].sort((a, b) => {
    if (a.name === 'Yes') return -1;
    if (b.name === 'Yes') return 1;
    if (a.name === 'Unknown') return -1;
    if (b.name === 'Unknown') return 1;
    return 0;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-[20px] font-semibold text-gray-800 mb-0">
        {title}
      </h3>
      <div className="h-[350px] -mt-[36px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: -75, bottom: -75 }}>
            <Pie
              key={`pie-${title}`}
              data={sortedData}
              cx="50%"
              cy={isSemi ? "80%" : "60%"}
              startAngle={isSemi ? 180 : 0}
              endAngle={isSemi ? 0 : 360}
              innerRadius="50%"
              outerRadius={isSemi ? "80%" : "100%"}
              paddingAngle={0}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine
              animationBegin={0}
              animationDuration={600}
              animationEasing="ease"
              isAnimationActive={true}
              labelStyle={{
                fontSize: '18px',
                fill: '#374151'
              }}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}