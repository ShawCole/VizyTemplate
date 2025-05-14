import { useCallback, useMemo, useState, useEffect } from "react";
import {
    ComposableMap,
    Geographies,
    Geography
} from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
                            .then(() => {
                                console.log("Alternative GeoJSON loaded successfully");
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

    // Helper to normalize state codes to ensure consistent format
    const normalizeStateCode = useCallback((rawState: string): string => {
        if (!rawState) return "";

        const trimmedState = rawState.trim();

        // If it's already a 2-letter code, return it uppercase
        if (/^[A-Za-z]{2}$/.test(trimmedState)) {
            const upperState = trimmedState.toUpperCase();

            // Skip Canadian provinces and DC for mapping purposes
            if (ADDITIONAL_REGIONS[upperState]) {
                return "";
            }

            // Verify it's a valid state code
            if (STATE_NAMES[upperState]) {
                return upperState;
            }
        }

        // If it's a full state name, try to get the code
        const stateLower = trimmedState.toLowerCase();
        if (STATE_CODES[stateLower]) {
            return STATE_CODES[stateLower];
        }

        // Try to match state names that might differ slightly from standard
        for (const [code, name] of Object.entries(STATE_NAMES)) {
            const lowerName = name.toLowerCase();
            if (stateLower.includes(lowerName) || lowerName.includes(stateLower)) {
                return code; // Return the state code (e.g., "CA"), not the full name
            }
        }

        // Don't log warnings for known non-states
        if (!Object.keys(ADDITIONAL_REGIONS).includes(trimmedState.toUpperCase())) {
            console.warn(`Unrecognized state: ${rawState}`);
        }

        return "";
    }, []);

    // Create a real quantile-based color scale with proper gradient
    const getQuantileColorScale = useCallback((values: number[], colorRange: string[]) => {
        // If no values or all zeros, return a function that returns gray
        if (values.length === 0) {
            return () => "#EEEEEE";
        }

        console.log("Creating scale with values:", values);
        console.log("Using color range:", colorRange);

        // Create the scale - use scaleQuantile from d3-scale
        const scale = scaleQuantile<string>()
            .domain(values)
            .range(colorRange);

        // Test the scale with some values
        values.forEach(v => {
            console.log(`Test value ${v} -> color ${scale(v)}`);
        });

        // Return function that applies scale
        return (value: number) => {
            if (value <= 0) return "#EEEEEE";
            return scale(value);
        };
    }, []);

    // Calculate state counts from the data
    const stateCounts = useMemo(() => {
        // Initialize counts for all states to zero
        const counts: Record<string, number> = {};
        Object.keys(STATE_NAMES).forEach(state => {
            counts[state] = 0;
        });

        console.log("Processing data of length:", data?.length);

        // Count occurrences of each state
        if (data && data.length > 0) {
            data.forEach(item => {
                if (item.PERSONAL_STATE && item.PERSONAL_STATE.trim() !== '') {
                    const stateCode = normalizeStateCode(item.PERSONAL_STATE);
                    if (stateCode && counts[stateCode] !== undefined) {
                        counts[stateCode] = (counts[stateCode] || 0) + 1;
                    }
                }
            });
        }

        // Convert to array format for the map
        const result = Object.keys(STATE_NAMES).map(id => {
            return {
                id,
                state: STATE_NAMES[id],
                value: counts[id] || 0
            };
        });

        console.log("All state counts:", counts);
        console.log("Result array:", result);

        return result;
    }, [data, normalizeStateCode]);

    // Create color scale
    const colorScale = useMemo(() => {
        // Get non-zero values for the domain
        const values = stateCounts
            .map(d => d.value)
            .filter(v => v > 0);

        console.log("Values for color scale:", values);

        // Create color range with increased contrast between light and dark
        const baseColor = colors.primaryColor3 || "#A78BFA"; // Fallback color

        // Extract RGB components for manipulation
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);

        // Create simpler gradient with better contrast
        const colorRange = [
            `rgba(${r}, ${g}, ${b}, 0.2)`,  // 20% opacity - very light
            `rgba(${r}, ${g}, ${b}, 0.4)`,  // 40% opacity
            `rgba(${r}, ${g}, ${b}, 0.6)`,  // 60% opacity
            `rgba(${r}, ${g}, ${b}, 0.8)`,  // 80% opacity
            `${baseColor}`                   // 100% opacity - base color
        ];

        console.log("Using color range:", colorRange);

        // Use a simpler approach if we're having trouble
        if (values.length === 0) {
            return () => "#EEEEEE";
        }

        // Production quantile scale
        return getQuantileColorScale(values, colorRange);
    }, [stateCounts, colors.primaryColor3, getQuantileColorScale]);

    // Get state code from geography properties
    const getStateCodeFromGeo = (geo: any): string | null => {
        // Primary source format
        if (geo.properties.postal) {
            return geo.properties.postal;
        }

        // Alternative source format may have different property names
        if (geo.properties.STATE_ABBR) {
            return geo.properties.STATE_ABBR;
        }

        // Another common format
        if (geo.properties.code) {
            return geo.properties.code;
        }

        // Try to extract from name if available
        if (geo.properties.name) {
            const stateName = geo.properties.name.toLowerCase();
            return STATE_CODES[stateName] || null;
        }

        console.warn("Could not extract state code from geography:", geo.properties);
        return null;
    };

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="text-[20px]">State Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pb-0">
                {mapLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="relative py-0 -mt-16 -mb-9">
                        <div className="w-full aspect-[4/3]">
                            <ComposableMap projection="geoAlbersUsa">
                                <Geographies geography={currentGeoUrl}>
                                    {({ geographies }) =>
                                        geographies.map(geo => {
                                            const stateCode = getStateCodeFromGeo(geo);
                                            const stateData = stateCounts.find(d => d.id === stateCode);
                                            const fillColor = stateData ? colorScale(stateData.value) : "#EEE";

                                            return (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    fill={fillColor}
                                                    stroke="#FFF"
                                                    strokeWidth={0.5}
                                                    style={{
                                                        default: {
                                                            outline: "none"
                                                        },
                                                        hover: {
                                                            fill: colors.accentColor,
                                                            outline: "none",
                                                            transition: "all 250ms"
                                                        },
                                                        pressed: {
                                                            outline: "none"
                                                        }
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        const { clientX, clientY } = e;
                                                        const stateName = STATE_NAMES[stateCode || ""] || stateCode;
                                                        const count = stateData ? stateData.value : 0;
                                                        setTooltip({
                                                            show: true,
                                                            content: `${stateName}: ${count}`,
                                                            x: clientX,
                                                            y: clientY
                                                        });
                                                    }}
                                                    onMouseLeave={() => {
                                                        setTooltip(prev => ({ ...prev, show: false }));
                                                    }}
                                                />
                                            );
                                        })
                                    }
                                </Geographies>
                            </ComposableMap>
                        </div>

                        {tooltip.show && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: `${tooltip.x}px`,
                                    top: `${tooltip.y}px`,
                                    transform: 'translate(-50%, -100%)',
                                    backgroundColor: 'white',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    zIndex: 1000,
                                }}
                            >
                                {tooltip.content}
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default USAChoroplethMap; 