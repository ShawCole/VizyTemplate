import React from 'react';
import { Button } from './ui/button';
import { PopulationPyramid } from './charts/PopulationPyramid';
import { FamilyDynamicsChart } from './charts/FamilyDynamicsChart';
import { VerticalBarChart } from './charts/VerticalBarChart';
import { DoughnutChart } from './charts/DoughnutChart';
import { HorizontalBarChart } from './charts/HorizontalBarChart';
import { transformData } from '../utils/dataTransformers';
import { B2BData, B2CData } from '../types/data';
import { useChartColors } from '../contexts/ChartColorContext';

interface NewDashboardProps {
  onBack: () => void;
  b2bData: B2BData[] | null;
  b2cData: B2CData[] | null;
  showB2BUnknowns: boolean;
  showB2CUnknowns: boolean;
}

const NewDashboard: React.FC<NewDashboardProps> = ({
  onBack,
  b2bData,
  b2cData,
  showB2BUnknowns,
  showB2CUnknowns
}) => {
  const { colors } = useChartColors();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Customizable Dashboard</h1>
          <Button onClick={onBack} variant="outline">
            Back to Classic View
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Population Pyramid (Top Left) */}
          <div className="col-span-12 lg:col-span-6 bg-white rounded-lg shadow-md h-[500px] p-6 relative">
            {b2cData ? (
              <PopulationPyramid data={b2cData} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Population Pyramid (No B2C Data)
              </div>
            )}
          </div>

          {/* Family Dynamics (Top Right) */}
          <div className="col-span-12 lg:col-span-6 bg-white rounded-lg shadow-md h-[500px] p-6 relative">
            {b2cData ? (
              <FamilyDynamicsChart data={b2cData} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Family Dynamics (No B2C Data)
              </div>
            )}
          </div>

          {/* Map Widget (spans full width) */}
          <div className="col-span-12 bg-white rounded-lg shadow-md h-[600px] flex flex-col items-center justify-center relative p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Interactive Map Widget</h2>
            <div className="flex-grow w-full bg-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
              <span className="text-blue-500">Map Component Will Go Here</span>
            </div>
            <Button className="mt-4 absolute top-4 right-4">
              Expand to Full Screen
            </Button>
          </div>

          {/* Credit Rating Chart (spans 6 cols) */}
          <div className="col-span-12 lg:col-span-6 h-[500px]">
            {b2cData && b2cData.length > 0 ? (
              <VerticalBarChart
                data={transformData(b2cData, 'SKIPTRACE_CREDIT_RATING', undefined, showB2CUnknowns)}
                title="Credit Rating Distribution"
                color={colors.primaryColor3}
                showUnknowns={showB2CUnknowns}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center text-gray-400">
                No B2C Data Available
              </div>
            )}
          </div>

          {/* Company Size Chart (spans 6 cols) */}
          <div className="col-span-12 lg:col-span-6 h-[500px]">
            {b2bData && b2bData.length > 0 ? (
              <VerticalBarChart
                data={transformData(b2bData, 'COMPANY_EMPLOYEE_COUNT', undefined, showB2BUnknowns)}
                title="Company Size Distribution"
                color="#60A5FA"
                showUnknowns={showB2BUnknowns}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center text-gray-400">
                No B2B Data Available
              </div>
            )}
          </div>

          {/* Additional Demographics (Remaining items) */}
          <div className="col-span-12 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Remaining Demographics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[400px]">
                {b2cData && b2cData.length > 0 ? (
                  <DoughnutChart
                    data={transformData(b2cData, 'MARRIED', undefined, showB2CUnknowns)}
                    title="Marital Status"
                    isSemi={true}
                    showUnknowns={showB2CUnknowns}
                    tooltipOnly={true}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center text-gray-400">
                    No Marital Data Available
                  </div>
                )}
              </div>
              <div className="h-[400px]">
                {b2cData && b2cData.length > 0 ? (
                  <DoughnutChart
                    data={transformData(b2cData, 'CHILDREN', undefined, showB2CUnknowns)}
                    title="Children"
                    isSemi={true}
                    showUnknowns={showB2CUnknowns}
                    tooltipOnly={true}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center text-gray-400">
                    No Children Data Available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Financial Details (spans 12 cols, grid inside) */}
          <div className="col-span-12 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Financial Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[500px]">
                {b2cData && b2cData.length > 0 ? (
                  <VerticalBarChart
                    data={transformData(b2cData, 'INCOME_RANGE', undefined, showB2CUnknowns)}
                    title="Income Distribution"
                    color="#60A5FA"
                    showUnknowns={showB2CUnknowns}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center text-gray-400">
                    No Income Data Available
                  </div>
                )}
              </div>
              <div className="h-[500px]">
                {b2cData && b2cData.length > 0 ? (
                  <VerticalBarChart
                    data={transformData(b2cData, 'NET_WORTH', undefined, showB2CUnknowns)}
                    title="Net Worth Distribution"
                    color="#818CF8"
                    showUnknowns={showB2CUnknowns}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center text-gray-400">
                    No Net Worth Data Available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Highlights (spans 12 cols, grid inside) */}
          <div className="col-span-12 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Top Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-auto">
                {b2bData && b2bData.length > 0 ? (
                  <HorizontalBarChart
                    data={transformData(b2bData, 'COMPANY_INDUSTRY', 15, showB2BUnknowns)}
                    title="Industries"
                    color="#60A5FA"
                    initialDisplay={5}
                    showUnknowns={showB2BUnknowns}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 h-[300px] flex items-center justify-center text-gray-400">
                    No Industry Data Available
                  </div>
                )}
              </div>
              <div className="h-auto">
                {b2bData && b2bData.length > 0 ? (
                  <HorizontalBarChart
                    data={transformData(b2bData, 'JOB_TITLE', 15, showB2BUnknowns)}
                    title="Job Titles"
                    color="#818CF8"
                    initialDisplay={5}
                    showUnknowns={showB2BUnknowns}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 h-[300px] flex items-center justify-center text-gray-400">
                    No Job Title Data Available
                  </div>
                )}
              </div>
              <div className="h-auto">
                {b2bData && b2bData.length > 0 ? (
                  <HorizontalBarChart
                    data={transformData(b2bData, 'DEPARTMENT', 15, showB2BUnknowns)}
                    title="Departments"
                    color="#A78BFA"
                    initialDisplay={5}
                    showUnknowns={showB2BUnknowns}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 h-[300px] flex items-center justify-center text-gray-400">
                    No Department Data Available
                  </div>
                )}
              </div>
              <div className="h-auto">
                {b2bData && b2bData.length > 0 ? (
                  <HorizontalBarChart
                    data={transformData(b2bData, 'SENIORITY_LEVEL', undefined, showB2BUnknowns)}
                    title="Seniority Levels"
                    color="#C084FC"
                    initialDisplay={5}
                    showUnknowns={showB2BUnknowns}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 h-[300px] flex items-center justify-center text-gray-400">
                    No Seniority Data Available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Company Revenue (spans 12 cols, single chart) */}
          <div className="col-span-12 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Company Revenue</h2>
            <div className="h-[500px]">
              {b2bData && b2bData.length > 0 ? (
                <VerticalBarChart
                  data={transformData(b2bData, 'COMPANY_REVENUE', undefined, showB2BUnknowns)}
                  title="Company Revenue Distribution"
                  color="#818CF8"
                  showUnknowns={showB2BUnknowns}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center text-gray-400">
                  No Company Revenue Data Available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDashboard;
