# New Map View Architecture (Historical Reconstruction)

Based on the conversation logs, the "New Map View" feature was built around two core components that are currently missing from the stable `VizyTemplate-main` branch:

1.  **MapDashboard.tsx**: This was the container component for the full-screen map experience. It handled the layout, including the sidebar filters and the toggle between the "Dashboard" and the "Map" view.
    *   *Status:* The log `Investigating MapDashboard Deletion.md` confirms this file was deleted in a previous git operation. We need to recreate it (renaming it `NewMapView.tsx` as per our new plan to avoid confusion).

2.  **USAChoroplethMapbox.tsx**: This was the advanced, Mapbox-GL-based map component. It replaced the simple SVG map (`USAChoroplethMap.tsx`) for this specific view.
    *   *Features:* It supported the "tethered" charts, pinned states, and smooth zooming that the user wants to restore.
    *   *Status:* This file is referenced heavily in `Debug App Loading and CSV.md` but is missing from the current `old_vizy_template` directory. We must reconstruct it based on the features described.

**Plan:** We will recreate these files in `Phase 3` and `Phase 4` of our implementation plan.
