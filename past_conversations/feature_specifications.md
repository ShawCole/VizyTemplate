# Feature Specifications & Intent

This document details the specific features aimed for the `VizyTemplate` restoration, the user's intent behind them, and their technical home within the codebase.

## 1. New Map View (Full Screen Mode)
**Intent:**
To provide an immersive, high-performance geographic analysis tool. Unlike the standard "dashboard" map, this view is designed for deep dives, allowing the user to view the entire US at once or zoom into specific regions without the clutter of the main page. It is the "Premium" experience that differentiates the app.

**Key Capabilities:**
- Full-screen Mapbox integration (smooth zoom/pan).
- Sidebar filters for quick data slicing.
- "Try New Map View" entry point from the main dashboard.

**Location:**
- **Container:** `src/components/NewMapView.tsx` (New file)
- **Entry Button:** `src/components/Header.tsx`
- **Map Component:** `src/components/USAChoroplethMapbox.tsx`

---

## 2. Tethered "Magnetic" Charts
**Intent:**
To solve the "context loss" problem when viewing details. When a user clicks a state, they want to compare its data with others. Fixed popups hide the map, and floating tooltips disappear. "Tethered" charts allow the user to "pin" significantly important data points (up to 4) and move them around to organize their view, while a curved line always visually links the chart back to its source state.

**Key Capabilities:**
- Click state to "pin" the current hover chart.
- Drag charts to rearrange.
- Smooth SVG curve connecting the chart card to the state's centroid.
- Maps "snap" or "magnetize" the line to the nearest border point.

**Location:**
- **Logic & Render Loop:** `src/components/USAChoroplethMapbox.tsx`
- **Visual Component:** `src/components/ConnectionLine.tsx`

---

## 3. Population Pyramid Chart
**Intent:**
To provide a standard, recognizable demographic breakdown. The previous simple bar charts failed to capture the gender/age comparison effectively. The intent is to replicate the industry-standard "Pyramid" visualization where Male (Blue) bars extend left and Female (Red) bars extend right.

**Key Capabilities:**
- Bi-directional horizontal bars.
- Proper gender formatting checks (handling 'M', 'Male', 'F', 'Female').
- Absolute value tooltips (showing "500" instead of "-500" for males).

**Location:**
- **Component:** `src/components/charts/PopulationPyramid.tsx`
- **Integration:** Inside the `StateChartsPopup` or overlay within `NewMapView`.

---

## 4. Credit Rating Distribution (B2C Restoration)
**Intent:**
To restore a critical financial insight metric that was lost during previous iterations. Users analyzing B2C data need to gauge the creditworthiness of their audience segments to determine lead quality.

**Key Capabilities:**
- Stacked or grouped bar chart showing credit score ranges.
- Visible only in "B2C" mode.

**Location:**
- **Component:** `src/components/sections/CreditRating.tsx`
- **Parent Layout:** `src/components/sections/FinancialDetails.tsx` (or direct grid placement in `App.tsx`).

---

## 5. Company Size Distribution (B2B Restoration)
**Intent:**
Similar to Credit Rating, this provides the "scale" dimension for B2B data. Users need to know if they are looking at small businesses or enterprises.

**Key Capabilities:**
- Vertical bar chart distribution of employee counts.
- Visible only in "B2B" mode.

**Location:**
- **Component:** `src/components/sections/CompanySize.tsx`
- **Parent Layout:** `src/components/sections/TopHighlights.tsx` (or direct grid placement in `App.tsx`).

---

## 6. Drag-and-Drop Interface
**Intent:**
To give users agency over their workspace. Static dashboards are rigid; the intent here is to allow the user to "curate" their own comparison view by dragging interesting state charts into a cluster for side-by-side analysis.

**Key Capabilities:**
- Draggable chart cards.
- "Freezing" the data state upon pin (so it doesn't update on hover).

**Location:**
- **Interaction Logic:** `src/components/ChartOverlay.tsx` (or integrated into `NewMapView.tsx`).
