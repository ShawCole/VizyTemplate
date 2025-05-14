import { useCallback, useMemo, useState, useEffect } from "react";
import {
    ComposableMap,
    Geographies,
    Geography
} from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import { B2CData } from "../types/data";
import { useChartColors } from "../contexts/ChartColorContext";

// USA GeoJSON
const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";
// Alternative source if the primary one fails
const alternativeGeoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-states/us-states.json";

// State name mapping
const STATE_NAMES: Record<string, string> = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas",
    "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware",
    "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho",
    "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas",
    "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
    "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi",
    "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada",
    "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York",
    "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma",
    "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
    "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah",
    "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia",
    "WI": "Wisconsin", "WY": "Wyoming"
};

// Create a reverse mapping from full names to state codes
const STATE_CODES: Record<string, string> = Object.entries(STATE_NAMES).reduce(
    (acc, [code, name]) => {
        acc[name.toLowerCase()] = code;
        return acc;
    },
    {} as Record<string, string>
);

// Add support for DC and Canadian provinces that might appear in the data
const ADDITIONAL_REGIONS: Record<string, string> = {
    'DC': 'District of Columbia',
    'QC': 'Quebec',
    'BC': 'British Columbia',
    'MB': 'Manitoba',
    'PB': 'Prince Edward Island',
    'ON': 'Ontario',
    'AB': 'Alberta',
    'SK': 'Saskatchewan',
    'NB': 'New Brunswick',
    'NS': 'Nova Scotia',
    'NL': 'Newfoundland and Labrador'
};

interface USAChoroplethMapProps {
    data: B2CData[];
}

const USAChoroplethMap = ({ data }: USAChoroplethMapProps) => {
    const { colors } = useChartColors();
    const [tooltip, setTooltip] = useState({ show: false, content: "", x: 0, y: 0 });
    const [mapLoading, setMapLoading] = useState(true);
    const [currentGeoUrl, setCurrentGeoUrl] = useState(geoUrl);
    const [alternativeGeoData, setAlternativeGeoData] = useState<any>(null);

    // Effect to check if the map loads correctly
    useEffect(() => {
        const checkMapLoading = setTimeout(() => {
            if (mapLoading) {
                console.warn("Map is taking too long to load, checking for issues");

                // Check if the geoUrl is accessible
                fetch(geoUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to load GeoJSON: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (!data || !data.objects || !data.objects.states) {
                            throw new Error("Invalid GeoJSON data structure");
                        }
                        setMapLoading(false);
                    })
                    .catch(err => {
                        console.error("Error loading primary map data:", err);

                        // Try the alternative source
                        console.log("Trying alternative GeoJSON source...");
                        fetch(alternativeGeoUrl)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Failed to load alternative GeoJSON: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log("Alternative GeoJSON loaded successfully");
                                setAlternativeGeoData(data);
                                setCurrentGeoUrl(alternativeGeoUrl);
                                setMapLoading(false);
                            })
                            .catch(altErr => {
                                console.error("Error loading alternative map data:", altErr);
                                setMapLoading(false);
                            });
                    });
            }
        }, 5000);

        return () => clearTimeout(checkMapLoading);
    }, [mapLoading]);

    // Process data to get state counts
    const stateCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        let maxCount = 0;

        data.forEach(record => {
            if (!record.PERSONAL_STATE) return;

            // Normalize state name/code
            let stateCode = record.PERSONAL_STATE.trim().toUpperCase();

            // If it's a full state name, try to get its code
            if (stateCode.length > 2) {
                const normalizedStateName = record.PERSONAL_STATE.trim().toLowerCase();
                stateCode = STATE_CODES[normalizedStateName] || stateCode;
            }

            // Skip if we don't recognize this state code
            if (!STATE_NAMES[stateCode] && !ADDITIONAL_REGIONS[stateCode]) return;

            counts[stateCode] = (counts[stateCode] || 0) + 1;
            maxCount = Math.max(maxCount, counts[stateCode]);
        });

        return Object.entries(counts).map(([id, value]) => ({
            id,
            state: STATE_NAMES[id] || ADDITIONAL_REGIONS[id] || id,
            value
        }));
    }, [data]);

    // Create color scale
    const colorScale = useMemo(() => {
        const domain = stateCounts.map(d => d.value);
        return scaleQuantile<string>()
            .domain(domain)
            .range([
                `${colors.accentColor}30`,
                `${colors.accentColor}60`,
                `${colors.accentColor}90`,
                `${colors.accentColor}C0`,
                colors.accentColor
            ]);
    }, [stateCounts, colors.accentColor]);

    // Get state value
    const getStateValue = useCallback((stateId: string): number => {
        const state = stateCounts.find(s => s.id === stateId);
        return state ? state.value : 0;
    }, [stateCounts]);

    // Get state color
    const getStateColor = useCallback((stateId: string): string => {
        const value = getStateValue(stateId);
        return value > 0 ? colorScale(value) : "#F3F4F6";
    }, [getStateValue, colorScale]);

    // Get state name
    const getStateName = useCallback((stateId: string): string => {
        return STATE_NAMES[stateId] || ADDITIONAL_REGIONS[stateId] || stateId;
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[20px] font-semibold text-gray-800 mb-0">Regional Distribution</h3>
            </div>

            {mapLoading ? (
                <div className="flex items-center justify-center h-[420px] -mt-1">
                    <div className="text-center w-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading map data...</p>
                    </div>
                </div>
            ) : (
                <div className="relative" style={{ height: '420px' }}>
                    {tooltip.show && (
                        <div
                            className="absolute z-10 bg-white p-2 rounded shadow-lg text-sm pointer-events-none"
                            style={{
                                left: `${tooltip.x}px`,
                                top: `${tooltip.y}px`,
                                transform: 'translate(-50%, -100%)',
                                marginTop: '-8px'
                            }}
                        >
                            {tooltip.content}
                        </div>
                    )}
                    <ComposableMap
                        projection="geoAlbersUsa"
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                    >
                        <Geographies geography={alternativeGeoData || currentGeoUrl}>
                            {({ geographies }) => {
                                if (!geographies || geographies.length === 0) {
                                    return null;
                                }

                                return geographies.map(geo => {
                                    const stateId = geo.properties.code || geo.id;
                                    const value = getStateValue(stateId);
                                    const stateName = getStateName(stateId);

                                    return (
                                        <Geography
                                            key={geo.rsmKey || geo.id}
                                            geography={geo}
                                            fill={getStateColor(stateId)}
                                            stroke="#FFFFFF"
                                            strokeWidth={0.5}
                                            style={{
                                                default: {
                                                    outline: "none"
                                                },
                                                hover: {
                                                    outline: "none",
                                                    fill: colors.accentColor
                                                },
                                                pressed: {
                                                    outline: "none"
                                                }
                                            }}
                                            onMouseEnter={(evt) => {
                                                const bounds = evt.currentTarget.getBoundingClientRect();
                                                setTooltip({
                                                    show: true,
                                                    content: `${stateName}: ${value.toLocaleString()} records`,
                                                    x: bounds.x + bounds.width / 2,
                                                    y: bounds.y
                                                });
                                            }}
                                            onMouseLeave={() => {
                                                setTooltip(prev => ({ ...prev, show: false }));
                                            }}
                                        />
                                    );
                                });
                            }}
                        </Geographies>
                    </ComposableMap>
                </div>
            )}
        </div>
    );
};

export default USAChoroplethMap; 