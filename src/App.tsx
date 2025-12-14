/// <reference types="react" />
import { useState, useCallback, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import DataFilter from './components/DataFilter';
import FileInfo from './components/FileInfo';
import FilterNotes from './components/FilterNotes';
import LogoUpload from './components/LogoUpload';
import ContactData from './components/sections/ContactData';
import TopHighlights from './components/sections/TopHighlights';
import AudienceDemographics from './components/sections/AudienceDemographics';
import FinancialDetails from './components/sections/FinancialDetails';
import USAChoroplethMap from './components/USAChoroplethMap';
import CreditRating from './components/sections/CreditRating';
import { B2BData, B2CData } from './types/data';
import { getAvailableColumns } from './utils/validation';
import { VerticalBarChart } from './components/charts/VerticalBarChart';
import { transformData } from './utils/dataTransformers';
import { ChartColorProvider, useChartColors } from './contexts/ChartColorContext';
import ControlPanel from './components/ControlPanel';

interface DataState {
  data: B2BData[] | B2CData[] | null;
  fileName: string;
}

function AppContent() {
  const { colors, updateColor } = useChartColors();
  const [b2bData, setB2BData] = useState<DataState>({ data: null, fileName: '' });
  const [b2cData, setB2CData] = useState<DataState>({ data: null, fileName: '' });
  const [activeB2BColumns, setActiveB2BColumns] = useState<Set<string>>(new Set());
  const [activeB2CColumns, setActiveB2CColumns] = useState<Set<string>>(new Set());
  const [b2bFilteredData, setB2BFilteredData] = useState<B2BData[] | null>(null);
  const [b2cFilteredData, setB2CFilteredData] = useState<B2CData[] | null>(null);
  const [showB2BUnknowns, setShowB2BUnknowns] = useState(false);
  const [showB2CUnknowns, setShowB2CUnknowns] = useState(false);
  const [showUploadSection, setShowUploadSection] = useState(true);
  const [logoSize, setLogoSize] = useState('180');
  const [secondaryLogoSize, setSecondaryLogoSize] = useState('100');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [secondaryLogoUrl, setSecondaryLogoUrl] = useState<string | null>(null);
  const [isB2BView, setIsB2BView] = useState(true);
  const [clientLogoVisible, setClientLogoVisible] = useState(true);
  const [ourLogoVisible, setOurLogoVisible] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent-color', colors.accentColor);
    root.style.setProperty('--accent-color-hover', adjustColor(colors.accentColor, -20, -20));
  }, [colors.accentColor]);

  // Function to darken a color
  const adjustColor = (color: string, amount: number, blueAmount: number) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + blueAmount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const handleB2BDataLoaded = useCallback((data: any, fileName: string) => {
    // Set B2B data
    setB2BData({ data, fileName });
    setB2BFilteredData(data);
    setActiveB2BColumns(new Set());

    // Also set B2C data with the same content
    setB2CData({ data, fileName });
    setB2CFilteredData(data);
    setActiveB2CColumns(new Set());

    setShowUploadSection(false);
    setIsB2BView(true);
  }, []);

  const handleB2CDataLoaded = useCallback((data: any, fileName: string) => {
    // Set B2C data
    setB2CData({ data, fileName });
    setB2CFilteredData(data);
    setActiveB2CColumns(new Set());

    // Also set B2B data with the same content
    setB2BData({ data, fileName });
    setB2BFilteredData(data);
    setActiveB2BColumns(new Set());

    setShowUploadSection(false);
    setIsB2BView(false);
  }, []);

  const handleB2BFiltered = useCallback((filteredData: B2BData[], showUnknowns: boolean) => {
    setB2BFilteredData(filteredData);
    setShowB2BUnknowns(showUnknowns);
  }, []);

  const handleB2CFiltered = useCallback((filteredData: B2CData[], showUnknowns: boolean) => {
    setB2CFilteredData(filteredData);
    setShowB2CUnknowns(showUnknowns);
  }, []);

  const handleB2BColumnSelect = useCallback((column: string) => {
    setActiveB2BColumns((prev: Set<string>) => {
      const newColumns = new Set(prev);
      if (newColumns.has(column)) {
        newColumns.delete(column);
      } else {
        newColumns.add(column);
      }
      return newColumns;
    });
  }, []);

  const handleB2CColumnSelect = useCallback((column: string) => {
    setActiveB2CColumns((prev: Set<string>) => {
      const newColumns = new Set(prev);
      if (newColumns.has(column)) {
        newColumns.delete(column);
      } else {
        newColumns.add(column);
      }
      return newColumns;
    });
  }, []);

  const handleViewChange = (isB2B: boolean) => {
    setIsB2BView(isB2B);
  };

  const currentData = isB2BView ? b2bData.data : b2cData.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <ControlPanel
        isB2BView={isB2BView}
        onViewChange={handleViewChange}
        logoSize={logoSize}
        setLogoSize={setLogoSize}
        secondaryLogoSize={secondaryLogoSize}
        setSecondaryLogoSize={setSecondaryLogoSize}
        colors={colors}
        updateColor={updateColor}
        clientLogoVisible={clientLogoVisible}
        setClientLogoVisible={setClientLogoVisible}
        ourLogoVisible={ourLogoVisible}
        setOurLogoVisible={setOurLogoVisible}
      />
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          {showUploadSection && (
            <>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
              </h1>

              {clientLogoVisible && (
                <div className="flex justify-center mb-16">
                  <LogoUpload
                    style={{ width: `${logoSize}px`, height: 'auto' }}
                    onLogoChange={setLogoUrl}
                  />
                </div>
              )}

              {ourLogoVisible && (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h1 className="text-2xl font-semibold text-gray-800">Presented by:</h1>
                  <LogoUpload
                    style={{ width: `${secondaryLogoSize}px`, height: 'auto' }}
                    onLogoChange={setSecondaryLogoUrl}
                  />
                </div>
              )}
              <p className="text-lg text-gray-600">Upload your B2B or B2C data to get started</p>
            </>
          )}

          {!showUploadSection && (
            <div className="flex flex-col items-center">
              {clientLogoVisible && (
                <div className="flex justify-center mb-10">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Company Logo"
                      style={{ width: `${logoSize}px`, height: 'auto' }}
                    />
                  ) : (
                    <LogoUpload
                      style={{ width: `${logoSize}px`, height: 'auto' }}
                      onLogoChange={setLogoUrl}
                    />
                  )}
                </div>
              )}
              {ourLogoVisible && (
                <div className="flex items-center justify-center gap-4 mb-4">
                  <h1 className="text-2xl font-semibold text-gray-800">Presented by:</h1>
                  {secondaryLogoUrl ? (
                    <img
                      src={secondaryLogoUrl}
                      alt="Secondary Logo"
                      style={{ width: `${secondaryLogoSize}px`, height: 'auto' }}
                    />
                  ) : (
                    <LogoUpload
                      style={{ width: `${secondaryLogoSize}px`, height: 'auto' }}
                      onLogoChange={setSecondaryLogoUrl}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </header>

        {showUploadSection && (
          <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch mb-8">
            <FileUpload type="b2b" onDataLoaded={handleB2BDataLoaded as (data: B2BData[] | B2CData[], fileName: string) => void} />
            <FileUpload type="b2c" onDataLoaded={handleB2CDataLoaded as (data: B2BData[] | B2CData[], fileName: string) => void} />
          </div>
        )}

        {(b2bData.data || b2cData.data) && showUploadSection && (
          <div className="space-y-8">
            <FileInfo
              b2bFileName={b2bData.fileName}
              b2cFileName={b2cData.fileName}
              b2bRecords={b2bData.data?.length}
              b2cRecords={b2cData.data?.length}
            />
          </div>
        )}

        {(b2bData.data || b2cData.data) && (
          <div className="space-y-8 mb-8">
            <FilterNotes initialTitle="Edit Title" />
          </div>
        )}

        {currentData && (
          <div className="space-y-6 mt-12">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {isB2BView ? 'B2B Dataset' : 'B2C Dataset'}
              </h2>
              <DataFilter
                type={isB2BView ? 'b2b' : 'b2c'}
                availableColumns={getAvailableColumns(currentData, isB2BView ? 'b2b' : 'b2c')}
                activeColumns={isB2BView ? activeB2BColumns : activeB2CColumns}
                onColumnSelect={isB2BView ? handleB2BColumnSelect : handleB2CColumnSelect}
                data={currentData}
                fileName={isB2BView ? b2bData.fileName : b2cData.fileName}
                onDataFiltered={isB2BView ? handleB2BFiltered : handleB2CFiltered}
                showUnknowns={isB2BView ? showB2BUnknowns : showB2CUnknowns}
              />
              {isB2BView && b2bFilteredData && (
                <div className="space-y-6">
                  <ContactData data={b2bFilteredData} />
                  <div className="space-y-6">
                    <TopHighlights data={b2bFilteredData} showUnknowns={showB2BUnknowns} />
                  </div>
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[392px] lg:items-stretch xl:h-[444px] xl:items-stretch 2xl:h-[500px]">
                    <VerticalBarChart
                      data={transformData(b2bFilteredData, 'COMPANY_EMPLOYEE_COUNT' as keyof B2BData, undefined, showB2BUnknowns)}
                      title="Company Size Distribution"
                      color="#60A5FA"
                      showUnknowns={showB2BUnknowns}
                    />
                    <USAChoroplethMap data={b2bFilteredData} />
                  </div>
                </div>
              )}
              {!isB2BView && b2cFilteredData && (
                <div className="space-y-6">
                  <ContactData data={b2cFilteredData} />
                  <div className="space-y-6">
                    <AudienceDemographics data={b2cFilteredData} showUnknowns={showB2CUnknowns} />
                    <FinancialDetails data={b2cFilteredData} showUnknowns={showB2CUnknowns} />
                  </div>
                  <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[392px] lg:items-stretch xl:h-[444px] xl:items-stretch 2xl:h-[500px]">
                    <CreditRating data={b2cFilteredData} showUnknowns={showB2CUnknowns} />
                    <USAChoroplethMap data={b2cFilteredData} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ChartColorProvider>
      <AppContent />
    </ChartColorProvider>
  );
}

export default App;