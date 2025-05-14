import { VerticalBarChart } from '../charts/VerticalBarChart';
import { B2CData } from '../../types/data';
import { transformData } from '../../utils/dataTransformers';
import { useChartColors } from '../../contexts/ChartColorContext';

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
        <div>
            <VerticalBarChart
                data={transformData(data, CREDIT_CHART.key, undefined, showUnknowns)}
                title={CREDIT_CHART.title}
                color={colors.primaryColor3}
                showUnknowns={showUnknowns}
                height={400} /* Increased height from 370 to 400 */
            />
        </div>
    );
} 