import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useChartColors } from '../../contexts/ChartColorContext';

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

const RADIAN = Math.PI / 180;

export function DoughnutChart({
  data,
  title,
  isSemi = false,
  showUnknowns = false
}: DoughnutChartProps) {
  const { colors } = useChartColors();
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

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, name, fill } = props;
    // Reduce the radius multiplier to bring labels closer to the chart
    const radius = outerRadius * 1.15;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // For semi-doughnut charts, adjust Y position to ensure labels stay above the chart
    const adjustedY = isSemi ? Math.min(y, cy - 20) : y;

    // Calculate text anchor based on position relative to center
    const textAnchor = x > cx ? 'start' : 'end';

    return (
      <text
        x={x}
        y={adjustedY}
        fill={fill}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fontSize="18px"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

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
              paddingAngle={2}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={true}
              animationBegin={0}
              animationDuration={600}
              animationEasing="ease"
              isAnimationActive={true}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors.doughnut[index % colors.doughnut.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}