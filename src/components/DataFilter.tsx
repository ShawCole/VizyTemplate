// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState, useEffect } from 'react';
import { Download, Eye, EyeOff } from 'lucide-react';
import { DatasetType } from '../types/data';
import { exportToCSV } from '../utils/exportUtils';
import { NET_WORTH_ORDER } from '../utils/dataTransformers';

interface DataFilterProps {
  availableColumns: string[];
  activeColumns: Set<string>;
  onColumnSelect: (column: string) => void;
  type: DatasetType;
  data: any[];
  fileName: string;
  onDataFiltered: (filteredData: any[], showUnknowns: boolean) => void;
  showUnknowns: boolean;
  externalStateFilter?: Set<string>;
  onStateFilterChange?: (states: Set<string>) => void;
}

interface SubFilterState {
  [column: string]: Set<string>;
}

const B2B_SUB_FILTERABLE_COLUMNS = [
  'COMPANY_INDUSTRY',
  'JOB_TITLE',
  'COMPANY_EMPLOYEE_COUNT',
  'COMPANY_REVENUE',
  'SENIORITY_LEVEL',
  'EMAIL'
];

const B2C_SUB_FILTERABLE_COLUMNS = [
  'AGE_RANGE',
  'GENDER',
  'MARRIED',
  'CHILDREN',
  'INCOME_RANGE',
  'NET_WORTH',
  'STATE',
  'EMAIL'
];

const EMAIL_TYPES = {
  'PERSONAL_EMAIL': 'Personal Email',
  'BUSINESS_EMAIL': 'Business Email'
};

const INCOME_RANGE_MAPPING: Record<string, string> = {
  'less than $20,000': '< $20k',
  '$20,000 to $44,999': '$20k - $45k',
  '$45,000 to $59,999': '$45k - $60k',
  '$60,000 to $74,999': '$60k - $75k',
  '$75,000 to $99,999': '$75k - $100k',
  '$100,000 to $149,999': '$100k - $150k',
  '$150,000 to $199,999': '$150k - $200k',
  '$200,000 to $249,999': '$200k - $250k',
  '$250,000+': '> $250k'
};

const NET_WORTH_MAPPING: Record<string, string> = {
  '-$20,000 to -$2,500': '< -$2.5k',
  '-$2,499 to $2,499': '-$2.5k - $2.5k',
  '$2,500 to $24,999': '$2.5k - $25k',
  '$25,000 to $49,999': '$25k - $50k',
  '$50,000 to $74,999': '$50k - $75k',
  '$75,000 to $99,999': '$75k - $100k',
  '$100,000 to $149,999': '$100k - $150k',
  '$150,000 to $249,999': '$150k - $250k',
  '$250,000 to $374,999': '$250k - $375k',
  '$375,000 to $499,999': '$375k - $500k',
  '$500,000 to $749,999': '$500k - $750k',
  '$750,000 to $999,999': '$750k - $1M',
  'More than $1,000,000': '> $1M'
};

const DISPLAY_NAME_MAPPINGS: Record<string, Record<string, string>> = {
  'GENDER': {
    'F': 'Female',
    'M': 'Male',
    'U': 'Unknown'
  },
  'MARRIED': {
    'Y': 'Yes',
    'N': 'No'
  },
  'CHILDREN': {
    'Y': 'Yes',
    'N': 'No'
  }
};

const SORT_ORDER: Record<string, string[]> = {
  'GENDER': ['Female', 'Male', 'Unknown'],
  'MARRIED': ['Yes', 'No'],
  'CHILDREN': ['Yes', 'No'],
  'EMAIL': ['Personal Email', 'Business Email'],
  'STATE': [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ],
  'COMPANY_EMPLOYEE_COUNT': [
    '1 to 10',
    '11 to 25',
    '26 to 50',
    '51 to 100',
    '101 to 250',
    '251 to 500',
    '501 to 1000',
    '1001 to 5000',
    '5001 to 10000',
    '10000+'
  ],
  'COMPANY_REVENUE': [
    'Under 1 Million',
    '1 Million to 5 Million',
    '5 Million to 10 Million',
    '10 Million to 25 Million',
    '25 Million to 50 Million',
    '50 Million to 100 Million',
    '100 Million to 250 Million',
    '250 Million to 500 Million',
    '500 Million to 1 Billion',
    '1 Billion and Over'
  ],
  'INCOME_RANGE': [
    '< $20k',
    '$20k - $45k',
    '$45k - $60k',
    '$60k - $75k',
    '$75k - $100k',
    '$100k - $150k',
    '$150k - $200k',
    '$200k - $250k',
    '> $250k'
  ],
  'NET_WORTH': [
    '< -$2.5k',
    '-$2.5k - $2.5k',
    '$2.5k - $25k',
    '$25k - $50k',
    '$50k - $75k',
    '$75k - $100k',
    '$100k - $150k',
    '$150k - $250k',
    '$250k - $375k',
    '$375k - $500k',
    '$500k - $750k',
    '$750k - $1M',
    '> $1M'
  ]
};

const COLUMN_DISPLAY_NAMES: Record<string, string> = {
  'PERSONAL_EMAIL': 'EMAIL',
  'BUSINESS_EMAIL': 'EMAIL',
  'PERSONAL_STATE': 'STATE'
};

export default function DataFilter({
  availableColumns,
  activeColumns,
  onColumnSelect,
  type,
  data,
  fileName,
  onDataFiltered,
  showUnknowns,
  externalStateFilter,
  onStateFilterChange
}: DataFilterProps) {
  const [selectedSubFilters, setSelectedSubFilters] = useState<SubFilterState>({});

  const handleExport = () => {
    const baseFileName = `${fileName} - ${type.toUpperCase()}`;
    const columnNames = Array.from(activeColumns).map(col => col.replace(/_/g, ' ')).join(' - ');
    const exportFileName = columnNames ? `${baseFileName} - ${columnNames}` : baseFileName;

    const filteredData = filterDataByAllFilters(data);
    exportToCSV(filteredData, exportFileName, type);
  };

  const getDisplayValue = (column: string, value: string): string => {
    if (column === 'EMAIL') {
      return EMAIL_TYPES[value as keyof typeof EMAIL_TYPES] || value;
    }
    if (column === 'INCOME_RANGE') {
      return INCOME_RANGE_MAPPING[value] || value;
    }
    if (column === 'NET_WORTH') {
      return NET_WORTH_MAPPING[value] || value;
    }
    if (DISPLAY_NAME_MAPPINGS[column]) {
      return DISPLAY_NAME_MAPPINGS[column][value] || value;
    }
    return value;
  };

  const getRawValue = (column: string, displayValue: string): string => {
    if (column === 'EMAIL') {
      const entry = Object.entries(EMAIL_TYPES).find(([_, display]) => display === displayValue);
      return entry ? entry[0] : displayValue;
    }
    if (column === 'INCOME_RANGE') {
      const entry = Object.entries(INCOME_RANGE_MAPPING).find(([_, display]) => display === displayValue);
      return entry ? entry[0] : displayValue;
    }
    if (column === 'NET_WORTH') {
      const entry = Object.entries(NET_WORTH_MAPPING).find(([_, display]) => display === displayValue);
      return entry ? entry[0] : displayValue;
    }
    if (DISPLAY_NAME_MAPPINGS[column]) {
      const mapping = DISPLAY_NAME_MAPPINGS[column];
      const entry = Object.entries(mapping).find(([_, display]) => display === displayValue);
      return entry ? entry[0] : displayValue;
    }
    return displayValue;
  };

  const handleSubFilterClick = (column: string, value: string) => {
    // STATE filter: update via parent callback only (no local state)
    if (column === 'STATE' && onStateFilterChange) {
      const currentStates = externalStateFilter || new Set<string>();
      const newSet = new Set(currentStates);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      onStateFilterChange(newSet);
      return;
    }

    // Other filters: update local state
    setSelectedSubFilters(prev => {
      const newState = { ...prev };
      if (!newState[column]) {
        newState[column] = new Set([value]);
      } else {
        const newSet = new Set(newState[column]);
        if (newSet.has(value)) {
          newSet.delete(value);
          if (newSet.size === 0) {
            delete newState[column];
          } else {
            newState[column] = newSet;
          }
        } else {
          newSet.add(value);
          newState[column] = newSet;
        }
      }
      return newState;
    });
  };

  const handleColumnSelect = (column: string) => {
    onColumnSelect(column);

    if (!activeColumns.has(column)) {
      const values = getUniqueValues(column);
      if (column === 'STATE') {
        setSelectedSubFilters(prev => ({
          ...prev,
          [column]: new Set(values)
        }));
      } else {
        setSelectedSubFilters(prev => ({
          ...prev,
          [column]: new Set(values)
        }));
      }
    } else {
      setSelectedSubFilters(prev => {
        const newState = { ...prev };
        delete newState[column];
        return newState;
      });
    }
  };

  const handleSelectAll = (column: string) => {
    const values = getUniqueValues(column);
    const newSet = new Set(values);

    // STATE filter: update via parent callback only
    if (column === 'STATE' && onStateFilterChange) {
      onStateFilterChange(newSet);
      return;
    }

    setSelectedSubFilters(prev => ({
      ...prev,
      [column]: newSet
    }));
  };

  const handleSelectNone = (column: string) => {
    // STATE filter: update via parent callback only
    if (column === 'STATE' && onStateFilterChange) {
      onStateFilterChange(new Set());
      return;
    }

    setSelectedSubFilters(prev => {
      const newState = { ...prev };
      delete newState[column];
      return newState;
    });
  };

  const filterDataByAllFilters = (data: any[]): any[] => {
    return data.filter(item => {
      // Check STATE filter from externalStateFilter (not local state)
      if (externalStateFilter && externalStateFilter.size > 0) {
        if (!externalStateFilter.has(item['PERSONAL_STATE'])) {
          return false;
        }
      }

      // Check other filters from local selectedSubFilters
      return Object.entries(selectedSubFilters).every(([column, values]) => {
        // Skip STATE - handled above via externalStateFilter
        if (column === 'STATE') {
          return true;
        }
        if (column === 'EMAIL') {
          return Array.from(values).some(value => {
            const field = value === 'Personal Email' ? 'PERSONAL_EMAIL' : 'BUSINESS_EMAIL';
            return item[field] && item[field].length > 0;
          });
        }
        const rawValues = Array.from(values).map(v => getRawValue(column, v));
        return rawValues.includes(item[column]);
      });
    });
  };

  useEffect(() => {
    const filteredData = filterDataByAllFilters(data);
    onDataFiltered(filteredData, showUnknowns);
  }, [data, selectedSubFilters, externalStateFilter, showUnknowns, onDataFiltered]);

  const getUniqueValues = (column: string) => {
    if (column === 'EMAIL') {
      return ['Personal Email', 'Business Email'];
    }

    if (column === 'STATE') {
      return [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
      ];
    }

    const values = new Set<string>();
    const valueMap = new Map<string, string>();

    data.forEach(item => {
      if (item[column] && typeof item[column] === 'string') {
        const displayValue = getDisplayValue(column, item[column]);
        values.add(displayValue);
        valueMap.set(displayValue, item[column]);
      }
    });

    const valuesArray = Array.from(values);

    if (SORT_ORDER[column]) {
      return valuesArray.sort((a, b) => {
        if (column === 'NET_WORTH') {
          const aOriginal = valueMap.get(a) || a;
          const bOriginal = valueMap.get(b) || b;
          const aIndex = NET_WORTH_ORDER.indexOf(aOriginal);
          const bIndex = NET_WORTH_ORDER.indexOf(bOriginal);
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        }
        const aIndex = SORT_ORDER[column].indexOf(a);
        const bIndex = SORT_ORDER[column].indexOf(b);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }

    return valuesArray.sort();
  };

  const filteredData = filterDataByAllFilters(data);

  const isSubFilterable = (column: string): boolean => {
    const subFilterableColumns = type === 'b2b'
      ? B2B_SUB_FILTERABLE_COLUMNS
      : B2C_SUB_FILTERABLE_COLUMNS;
    return subFilterableColumns.includes(normalizeColumn(column));
  };

  const getColumnDisplayName = (column: string): string => {
    return COLUMN_DISPLAY_NAMES[column] || column.replace(/_/g, ' ');
  };

  const normalizeColumn = (column: string): string => {
    if (column === 'PERSONAL_EMAIL' || column === 'BUSINESS_EMAIL') return 'EMAIL';
    if (column === 'PERSONAL_STATE') return 'STATE';
    return column;
  };

  const sortedColumns = useMemo(() => {
    if (type === 'b2c') {
      const columnOrder = [
        'AGE_RANGE',
        'GENDER',
        'MARRIED',
        'CHILDREN',
        'INCOME_RANGE',
        'NET_WORTH',
        'PERSONAL_STATE',
        'EMAIL'
      ];
      return availableColumns.sort((a, b) => {
        const aIndex = columnOrder.indexOf(normalizeColumn(a));
        const bIndex = columnOrder.indexOf(normalizeColumn(b));
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }
    return availableColumns;
  }, [availableColumns, type]);

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Filter {type.toUpperCase()} Data by Available Fields
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => onDataFiltered(filteredData, !showUnknowns)}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${showUnknowns
              ? 'accent-bg text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {showUnknowns ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                HIDE UNKNOWNS
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                SHOW UNKNOWNS
              </>
            )}
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 accent-bg accent-bg-hover text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Filtered Data ({filteredData.length.toLocaleString()} records)
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {sortedColumns.map((column) => (
            <button
              key={column}
              onClick={() => handleColumnSelect(normalizeColumn(column))}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${activeColumns.has(normalizeColumn(column))
                  ? 'accent-bg text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {getColumnDisplayName(column)}
            </button>
          ))}
        </div>

        {Array.from(activeColumns).map(column => (
          isSubFilterable(column) && (
            <div key={column} className="mt-4 border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Filter by {column.toLowerCase()}:
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectAll(column)}
                    className="px-3 py-1 text-xs font-medium accent-text bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleSelectNone(column)}
                    className="px-3 py-1 text-xs font-medium accent-text bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    None
                  </button>
                </div>
              </div>
              <div className={`${column === 'STATE'
                ? 'grid grid-rows-2 auto-rows-fr gap-2 py-2'
                : 'flex flex-wrap gap-2 max-h-40 overflow-y-auto'
                }`}
                style={column === 'STATE' ? { gridTemplateColumns: 'repeat(25, minmax(0, 1fr))' } : undefined}>
                {getUniqueValues(column).map((value) => {
                  // Use externalStateFilter for STATE, local state for others
                  const isSelected = column === 'STATE'
                    ? externalStateFilter?.has(value)
                    : selectedSubFilters[column]?.has(value);
                  return (
                    <button
                      key={value}
                      onClick={() => handleSubFilterClick(column, value)}
                      className={`${column === 'STATE'
                        ? 'text-xs h-8 w-8 flex items-center justify-center rounded'
                        : 'px-3 py-1 rounded-full'
                        } transition-colors ${isSelected
                          ? 'accent-bg text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {getDisplayValue(column, value)}
                    </button>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}