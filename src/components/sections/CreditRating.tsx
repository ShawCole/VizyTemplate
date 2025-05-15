import { VerticalBarChart } from '../charts/VerticalBarChart';
import { B2CData } from '../../types/data';
import { transformData } from '../../utils/dataTransformers';
import { useChartColors } from '../../contexts/ChartColorContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface CreditRatingProps {
    data: B2CData[];
    showUnknowns: boolean;
}

const CREDIT_CHART = {
    key: 'SKIPTRACE_CREDIT_RATING' as keyof B2CData,
    title: 'Credit Rating Distribution'
};

export default function CreditRating({ data, showUnknowns }: CreditRatingProps) {
    const { colors } = useChartColors();

    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader className="flex-none">
                <CardTitle className="text-[20px]">{CREDIT_CHART.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <div className="h-full">
                    <VerticalBarChart
                        data={transformData(data, CREDIT_CHART.key, undefined, showUnknowns)}
                        title=""
                        color={colors.primaryColor3}
                        showUnknowns={showUnknowns}
                        height={350}
                    />
                </div>
            </CardContent>
        </Card>
    );
} 