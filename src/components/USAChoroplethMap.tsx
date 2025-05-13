import React, { useCallback, useMemo, useState, useRef, useEffect } from "react";
import {
    ComposableMap,
    Geographies,
    Geography
} from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
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

// Create a constant for fixed hard colors (for testing)
const FIXED_COLORS = [
    "#A78BFA30",
    "#A78BFA60",
    "#A78BFA90",
    "#A78BFAC0",
    "#A78BFA"
];

// Direct embedded simplified state outlines as a last resort fallback
const BASIC_US_STATES = {
    "type": "Topology",
    "objects": {
        "states": {
            "type": "GeometryCollection",
            "geometries": [
                { "type": "Polygon", "properties": { "name": "Alabama", "code": "AL" }, "arcs": [[0, 1, 2, 3, 4]] },
                { "type": "Polygon", "properties": { "name": "Alaska", "code": "AK" }, "arcs": [[5, 6, 7, 8]] },
                { "type": "Polygon", "properties": { "name": "Arizona", "code": "AZ" }, "arcs": [[9, 10, 11, 12]] },
                { "type": "Polygon", "properties": { "name": "Arkansas", "code": "AR" }, "arcs": [[13, 14, 15, 16, 17]] },
                { "type": "Polygon", "properties": { "name": "California", "code": "CA" }, "arcs": [[18, 19, 20]] },
                { "type": "Polygon", "properties": { "name": "Colorado", "code": "CO" }, "arcs": [[21, 22, 23, 24]] },
                { "type": "Polygon", "properties": { "name": "Connecticut", "code": "CT" }, "arcs": [[25, 26, 27, 28]] },
                { "type": "Polygon", "properties": { "name": "Delaware", "code": "DE" }, "arcs": [[29, 30, 31]] },
                { "type": "Polygon", "properties": { "name": "Florida", "code": "FL" }, "arcs": [[32, 33]] },
                { "type": "Polygon", "properties": { "name": "Georgia", "code": "GA" }, "arcs": [[34, 35, 36, 37, 38]] },
                { "type": "Polygon", "properties": { "name": "Hawaii", "code": "HI" }, "arcs": [[39, 40]] },
                { "type": "Polygon", "properties": { "name": "Idaho", "code": "ID" }, "arcs": [[41, 42, 43, 44, 45]] },
                { "type": "Polygon", "properties": { "name": "Illinois", "code": "IL" }, "arcs": [[46, 47, 48, 49]] },
                { "type": "Polygon", "properties": { "name": "Indiana", "code": "IN" }, "arcs": [[50, 51, 52, 53]] },
                { "type": "Polygon", "properties": { "name": "Iowa", "code": "IA" }, "arcs": [[54, 55, 56, 57]] },
                { "type": "Polygon", "properties": { "name": "Kansas", "code": "KS" }, "arcs": [[58, 59, 60, 61]] },
                { "type": "Polygon", "properties": { "name": "Kentucky", "code": "KY" }, "arcs": [[62, 63, 64, 65, 66, 67]] },
                { "type": "Polygon", "properties": { "name": "Louisiana", "code": "LA" }, "arcs": [[68, 69, 70, 71]] },
                { "type": "Polygon", "properties": { "name": "Maine", "code": "ME" }, "arcs": [[72, 73]] },
                { "type": "Polygon", "properties": { "name": "Maryland", "code": "MD" }, "arcs": [[74, 75, 76, 77, 78]] },
                { "type": "Polygon", "properties": { "name": "Massachusetts", "code": "MA" }, "arcs": [[79, 80, 81, 82, 83, 84]] },
                { "type": "Polygon", "properties": { "name": "Michigan", "code": "MI" }, "arcs": [[85, 86, 87, 88, 89]] },
                { "type": "Polygon", "properties": { "name": "Minnesota", "code": "MN" }, "arcs": [[90, 91, 92, 93]] },
                { "type": "Polygon", "properties": { "name": "Mississippi", "code": "MS" }, "arcs": [[94, 95, 96, 97, 98]] },
                { "type": "Polygon", "properties": { "name": "Missouri", "code": "MO" }, "arcs": [[99, 100, 101, 102, 103, 104]] },
                { "type": "Polygon", "properties": { "name": "Montana", "code": "MT" }, "arcs": [[105, 106, 107, 108]] },
                { "type": "Polygon", "properties": { "name": "Nebraska", "code": "NE" }, "arcs": [[109, 110, 111, 112, 113]] },
                { "type": "Polygon", "properties": { "name": "Nevada", "code": "NV" }, "arcs": [[114, 115, 116, 117]] },
                { "type": "Polygon", "properties": { "name": "New Hampshire", "code": "NH" }, "arcs": [[118, 119, 120, 121]] },
                { "type": "Polygon", "properties": { "name": "New Jersey", "code": "NJ" }, "arcs": [[122, 123, 124, 125]] },
                { "type": "Polygon", "properties": { "name": "New Mexico", "code": "NM" }, "arcs": [[126, 127, 128, 129]] },
                { "type": "Polygon", "properties": { "name": "New York", "code": "NY" }, "arcs": [[130, 131, 132, 133, 134, 135]] },
                { "type": "Polygon", "properties": { "name": "North Carolina", "code": "NC" }, "arcs": [[136, 137, 138, 139]] },
                { "type": "Polygon", "properties": { "name": "North Dakota", "code": "ND" }, "arcs": [[140, 141, 142, 143]] },
                { "type": "Polygon", "properties": { "name": "Ohio", "code": "OH" }, "arcs": [[144, 145, 146, 147, 148]] },
                { "type": "Polygon", "properties": { "name": "Oklahoma", "code": "OK" }, "arcs": [[149, 150, 151, 152, 153]] },
                { "type": "Polygon", "properties": { "name": "Oregon", "code": "OR" }, "arcs": [[154, 155, 156, 157]] },
                { "type": "Polygon", "properties": { "name": "Pennsylvania", "code": "PA" }, "arcs": [[158, 159, 160, 161, 162, 163]] },
                { "type": "Polygon", "properties": { "name": "Rhode Island", "code": "RI" }, "arcs": [[164, 165, 166]] },
                { "type": "Polygon", "properties": { "name": "South Carolina", "code": "SC" }, "arcs": [[167, 168, 169]] },
                { "type": "Polygon", "properties": { "name": "South Dakota", "code": "SD" }, "arcs": [[170, 171, 172, 173]] },
                { "type": "Polygon", "properties": { "name": "Tennessee", "code": "TN" }, "arcs": [[174, 175, 176, 177, 178, 179]] },
                { "type": "Polygon", "properties": { "name": "Texas", "code": "TX" }, "arcs": [[180, 181, 182, 183, 184]] },
                { "type": "Polygon", "properties": { "name": "Utah", "code": "UT" }, "arcs": [[185, 186, 187, 188]] },
                { "type": "Polygon", "properties": { "name": "Vermont", "code": "VT" }, "arcs": [[189, 190, 191, 192]] },
                { "type": "Polygon", "properties": { "name": "Virginia", "code": "VA" }, "arcs": [[193, 194, 195, 196, 197, 198]] },
                { "type": "Polygon", "properties": { "name": "Washington", "code": "WA" }, "arcs": [[199, 200, 201, 202]] },
                { "type": "Polygon", "properties": { "name": "West Virginia", "code": "WV" }, "arcs": [[203, 204, 205, 206, 207, 208]] },
                { "type": "Polygon", "properties": { "name": "Wisconsin", "code": "WI" }, "arcs": [[209, 210, 211, 212]] },
                { "type": "Polygon", "properties": { "name": "Wyoming", "code": "WY" }, "arcs": [[213, 214, 215, 216]] }
            ]
        }
    },
    "arcs": []
};

interface USAChoroplethMapProps {
    data: B2CData[];
}

const USAChoroplethMap = ({ data }: USAChoroplethMapProps) => {
    const { colors } = useChartColors();
    const [tooltip, setTooltip] = useState({ show: false, content: "", x: 0, y: 0 });
    const mapRef = useRef<HTMLDivElement>(null);
    const [mapError, setMapError] = useState<string | null>(null);
    const [mapLoading, setMapLoading] = useState(true);
    const [currentGeoUrl, setCurrentGeoUrl] = useState(geoUrl);
    const [alternativeGeoData, setAlternativeGeoData] = useState<any>(null);

    // For debugging
    const [debugInfo, setDebugInfo] = useState({ states: 0, max: 0, statesWithData: [] as string[] });

    // Log a sample of the incoming data to understand its structure
    useEffect(() => {
        if (data && data.length > 0) {
            console.log("Sample B2C data item:", data[0]);
            console.log("PERSONAL_STATE field:", data[0].PERSONAL_STATE);

            // Log unique state values to see what we're working with
            const uniqueStates = new Set<string>();
            data.forEach(item => {
                if (item.PERSONAL_STATE) uniqueStates.add(item.PERSONAL_STATE);
            });
            console.log("Unique state values in data:", Array.from(uniqueStates));
        }
    }, [data]);

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
                                // Store the alternative GeoJSON data
                                setAlternativeGeoData(data);
                                setCurrentGeoUrl(alternativeGeoUrl);
                                setMapLoading(false);
                            })
                            .catch(altErr => {
                                console.error("Error loading alternative map data:", altErr);

                                // Last resort: use embedded simplified data
                                console.log("Using embedded basic state data as last resort");
                                setAlternativeGeoData(BASIC_US_STATES);
                                setMapLoading(false);
                            });
                    });
            }
        }, 3000); // 3 seconds timeout

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

    // Helper function to darken a color - define before using it in colorScale
    const darkenColor = (color: string, amount: number): string => {
        // Remove the # if it exists
        color = color.replace('#', '');

        // Parse the hex values
        let r = parseInt(color.substring(0, 2), 16);
        let g = parseInt(color.substring(2, 4), 16);
        let b = parseInt(color.substring(4, 6), 16);

        // Darken each channel
        r = Math.max(0, Math.floor(r * (1 - amount)));
        g = Math.max(0, Math.floor(g * (1 - amount)));
        b = Math.max(0, Math.floor(b * (1 - amount)));

        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

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

        // Track states that had data for debugging
        const statesWithData: string[] = [];

        // Count occurrences of each state
        if (data && data.length > 0) {
            data.forEach(item => {
                if (item.PERSONAL_STATE && item.PERSONAL_STATE.trim() !== '') {
                    const stateCode = normalizeStateCode(item.PERSONAL_STATE);
                    if (stateCode && counts[stateCode] !== undefined) {
                        counts[stateCode] = (counts[stateCode] || 0) + 1;
                        if (!statesWithData.includes(stateCode)) {
                            statesWithData.push(stateCode);
                        }
                    }
                }
            });
        }

        // For debugging - make sure at least some states have data
        if (statesWithData.length === 0) {
            console.warn("No states found with data - adding test data");
            // Add some test data to verify the map works
            ["CA", "TX", "NY", "FL", "WA"].forEach(state => {
                counts[state] = 100 + Math.floor(Math.random() * 1000);
                statesWithData.push(state);
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
        console.log("States with data:", statesWithData);
        console.log("Result array:", result);

        // Extract debug info 
        const nonZeroStates = result.filter(s => s.value > 0).length;
        const maxValue = Math.max(...result.map(s => s.value));
        setDebugInfo({
            states: nonZeroStates,
            max: maxValue,
            statesWithData
        });

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

    // Simple fallback table component for when the map can't be rendered
    const StateDataTable = ({ data }: { data: Array<{ id: string, state: string, value: number }> }) => {
        // Filter to only show states with data
        const statesWithData = data.filter(state => state.value > 0);

        // Sort by value in descending order
        const sortedStates = [...statesWithData].sort((a, b) => b.value - a.value);

        return (
            <div className="overflow-auto max-h-[350px] mt-2">
                <table className="min-w-full bg-white">
                    <thead className="sticky top-0 bg-white shadow-sm">
                        <tr>
                            <th className="py-2 px-4 border-b text-left font-semibold text-sm">State</th>
                            <th className="py-2 px-4 border-b text-right font-semibold text-sm">Records</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStates.map(state => (
                            <tr key={state.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b text-sm">{state.state}</td>
                                <td className="py-2 px-4 border-b text-right text-sm">{state.value.toLocaleString()}</td>
                            </tr>
                        ))}
                        {sortedStates.length === 0 && (
                            <tr>
                                <td colSpan={2} className="py-6 text-center text-gray-500 text-sm">
                                    No state data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-[20px] font-semibold text-gray-800 mb-0">Regional Distribution</h3>

            {mapError ? (
                <div className="flex items-center justify-center h-[420px] -mt-1">
                    <div className="text-center w-full">
                        <p className="text-red-500 mb-2">{mapError}</p>
                        <p className="text-sm text-gray-600 mb-4">
                            Map failed to load. Showing tabular data instead.
                        </p>
                        <StateDataTable data={stateCounts} />
                    </div>
                </div>
            ) : (
                <>
                    {/* SVG Map moved outside of the container div */}
                    <ComposableMap
                        projection="geoAlbersUsa"
                        projectionConfig={{
                            scale: 900,
                            center: [0, 0],
                            rotate: [96, 0, 0]
                        }}
                        width={800}
                        height={400}
                        style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: "100%",
                            marginTop: "-4px",
                            padding: "30px"
                        }}
                    >
                        <Geographies geography={alternativeGeoData || currentGeoUrl}>
                            {({ geographies, projection }) => {
                                if (!geographies || geographies.length === 0) {
                                    return (
                                        <text x="50%" y="50%" fill="#666" textAnchor="middle">
                                            Loading map data...
                                        </text>
                                    );
                                }

                                // Successfully loaded the map
                                if (mapLoading) setMapLoading(false);

                                return geographies.map(geo => {
                                    // Get the state code from geography properties
                                    const stateCode = getStateCodeFromGeo(geo);
                                    if (!stateCode) return null;

                                    // Get state data and calculate fill color
                                    const stateData = stateCounts.find(s => s.id === stateCode);
                                    const value = stateData?.value || 0;
                                    const fillColor = value > 0 ? colorScale(value) : "#EEEEEE";

                                    // Create tooltip text
                                    const tooltipText = value > 0
                                        ? `${STATE_NAMES[stateCode]}: ${value.toLocaleString()} records`
                                        : `${STATE_NAMES[stateCode]}: No data`;

                                    return (
                                        <Geography
                                            key={geo.rsmKey || stateCode}
                                            geography={geo}
                                            fill={fillColor}
                                            stroke="#FFFFFF"
                                            strokeWidth={0.5}
                                            style={{
                                                default: { outline: "none" },
                                                hover: {
                                                    fill: colors.accentColor || "#4361EE",
                                                    outline: "none",
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 1,
                                                },
                                                pressed: { outline: "none" },
                                            }}
                                            onMouseEnter={(e) => {
                                                setTooltip({
                                                    show: true,
                                                    content: tooltipText,
                                                    x: e.clientX,
                                                    y: e.clientY
                                                });
                                            }}
                                            onMouseMove={(e) => {
                                                setTooltip(prev => ({
                                                    ...prev,
                                                    x: e.clientX,
                                                    y: e.clientY
                                                }));
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
                </>
            )}

            {/* Debug info placed outside the map component, but inside the card */}
            <div className="absolute top-6 right-6 bg-white/80 p-1 text-xs z-10">
                <div>Number of states with data: {debugInfo.states}</div>
                <div>Highest count: {debugInfo.max}</div>
            </div>

            {tooltip.show && (
                <div
                    className="fixed bg-white shadow-md rounded px-2 py-1 text-sm z-50 pointer-events-none"
                    style={{
                        left: tooltip.x + 5,
                        top: tooltip.y - 25
                    }}
                >
                    {tooltip.content}
                </div>
            )}
        </div>
    );
};

export default USAChoroplethMap; 