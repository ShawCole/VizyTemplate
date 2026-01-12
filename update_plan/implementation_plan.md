# Project Restoration & Feature Implementation Plan

## The Full Story: Analysis & Regression

The `VizyTemplate` project began as a stable dashboard using `react-simple-maps` (SVG-based) with distinct B2B and B2C views.
Over several development iterations (as seen in the conversation logs), we attempted to "level up" the application with:
1.  **Mapbox Integration:** Moving from SVG maps to `mapbox-gl` for a "premium" feel and better performance.
2.  **Interactive Features:** "Tethered" charts that follow the mouse, click-to-pin functionality, and drag-and-drop chart positioning.
3.  **Advanced Charts:** A bi-directional "Population Pyramid" (using Chart.js) and "Family Dynamics" charts.
4.  **Full Screen Mode:** A dedicated "New Map View" with sidebar filters.

**What went wrong:**
-   **Fragmentation:** The new features were built *over* the old ones, leading to the removal of core components like `CreditRating` and `CompanySize` from the main views.
-   **Node Compatibility:** The new stack (Vite 5+) required Node 18/20, causing friction with the user's local Node 16 environment.
-   **Complexity Overload:** The complex "hover-to-pin" interactions introduced performance regressions (re-renders) and "invisible barrier" bugs.
-   **File Loss:** Critical files like `MapDashboard.tsx` and specific chart configurations were lost or deleted during refactors.

**The Solution:**
We will treat the `old_vizy_template/VizyTemplate-main` as the **Stable Core**. We will NOT modify its existing B2B/B2C logic. Instead, we will **Add Setup** for the "New Map View" as a *parallel* feature, accessed via a "Try New Map View" button. This ensures regressions do not affect the main dashboard.

---

## User Review Required

> [!IMPORTANT]
> **Dependency Upgrades:** To support the "New Map View" (Mapbox), we *must* install `mapbox-gl` and `chart.js` (v2).
> **Node Version:** We will assume Node 20 usage is acceptable since we successfully fixed the dev server with it.

---

## Step-by-Step Implementation Plan

### Phase 1: Environment & Dependencies (Stable Core)
**Goal:** Ensure `old_vizy_template` runs on the current machine.
1.  **Copy/Restore:** Use `old_vizy_template/VizyTemplate-main` as the working directory.
2.  **Install Base Deps:** `npm install` (legacy peer deps if needed).
3.  **Install New Deps:**
    -   `npm install mapbox-gl @types/mapbox-gl` (For New Map View)
    -   `npm install chart.js@^2.9.4` (For Population Pyramid)

### Phase 2: Restore Missing Standard Charts
**Goal:** Fix the "regressions" in B2B/B2C views.
1.  **Verify [CreditRating.tsx](file:///Users/ShawCole/Documents/GitHub/VizyTemplate/src/components/sections/CreditRating.tsx)**
    -   Ensure it exists and is imported in `App.tsx` for the **B2C** view.
2.  **Verify [CompanySize.tsx](file:///Users/ShawCole/Documents/GitHub/VizyTemplate/src/components/sections/CompanySize.tsx)**
    -   Ensure it exists and is imported in `App.tsx` for the **B2B** view.
    *Evaluation:* These files likely exist in the `old` backup but were removed from `App.tsx`. We will re-add them to the grid layout.

### Phase 3: "New Map View" Architecture
**Goal:** Create the sandbox for advanced features without breaking the app.
1.  **Create [NewMapView.tsx](file:///Users/ShawCole/Documents/GitHub/VizyTemplate/src/components/NewMapView.tsx)**
    -   A full-screen container component.
    -   Includes the "Sidebar Filters" (port `SidebarFilters.tsx` logic).
    -   Host for the Mapbox instance.
2.  **Update [App.tsx](file:///Users/ShawCole/Documents/GitHub/VizyTemplate/src/App.tsx)**
    -   Add state: `const [showNewMapView, setShowNewMapView] = useState(false);`
    -   Add Button: "Try New Map View" in the header.
    -   Conditional rendering: If `showNewMapView`, render `<NewMapView />`, else render standard dashboard.

### Phase 4: Advanced Feature Implementation
**Goal:** Port the complex features one by one into `NewMapView.tsx`.

#### 4A. Complex Map (Mapbox)
-   **Create [USAChoroplethMapbox.tsx](file:///Users/ShawCole/Documents/GitHub/VizyTemplate/src/components/USAChoroplethMapbox.tsx)**
    -   Port the mapbox logic from the "broken" version.
    -   **Fix:** Ensure `mapbox-gl` token is loaded from environment.
    -   **Fix:** Implement the "Centroid" calculation for tether anchors (fixing the "connector line" bug).

#### 4B. Population Pyramid
-   **Create [PopulationPyramid.tsx](file:///Users/ShawCole/Documents/GitHub/VizyTemplate/src/components/charts/PopulationPyramid.tsx)**
    -   Use Chart.js v2 `horizontalBar`.
    -   **Fix Data:** `GENDER` parsing.
        -   Old logic: checks `m` or `male`.
        -   **New logic:** Check `M`, `Male`, `m`, `male` (case insensitive).
    -   **Fix Visual:** Male data (left side) = negative values. Female (right side) = positive.

#### 4C. Interactive Features (The "Wow" Factor)
-   **Tethered Lines:**
    -   Implement `<ConnectionLine />` using SVG curves from Chart `div` to State `centroid`.
    -   Update on drag.
-   **Pinning:**
    -   Allow multiple charts (up to 4) to be pinned.
    -   Clicking a state "freezes" the current hover chart into a persistent card.

### Phase 5: Verification & Polish
1.  **Performance:**
    -   Memoize the "Hover Chart" to prevent 0.1s re-render loops.
    -   Ensure map filtering is debounced.
2.  **Invisible Barriers:**
    -   Check CSS `z-index`. Ensure the Mapbox canvas is below the UI overlay but above the background.
    -   Ensure `pointer-events: none` on overlay containers but `pointer-events: auto` on interactive buttons/cards.

## Execution Order
1.  Setup & Install Deps.
2.  Restore Standard Charts (Credit/Company).
3.  Implement "Try New Map View" Button & Container.
4.  Implement Mapbox Map & Population Pyramid.
5.  Implement Drag/Pin/Tether interactions.
