# Missing Context & Integration Requirements

To successfully transplant the "New Map View" and advanced charts into the `old_vizy_template`, we need to supply the following missing infrastructure that existed in the "broken" but feature-rich version.

## 1. Missing Utility Libraries
The advanced components (especially from `shadcn/ui`) rely on a utility helper to merge Tailwind classes.
-   **Missing File:** `src/lib/utils.ts`
-   **Requirement:** We need to create this file with the standard `clsx` and `tailwind-merge` setup.
    ```typescript
    import { type ClassValue, clsx } from "clsx"
    import { twMerge } from "tailwind-merge"

    export function cn(...inputs: ClassValue[]) {
      return twMerge(clsx(inputs))
    }
    ```
-   **Missing Dependencies:** `npm install clsx tailwind-merge`

## 2. Missing UI Components
The "New Map View" sidebar relies on specific UI primitives that are not present in the current `src/components/ui` folder.
-   **Slider:** `src/components/ui/slider.tsx` (Required for Opacity/Data filtering)
-   **Popover:** `src/components/ui/popover.tsx` (Required for complex filter menus)
-   **Button:** `src/components/ui/button.tsx` (Standardized button styles)
-   **Label:** `src/components/ui/label.tsx` (For form inputs)

## 3. Missing Feature Components
-   **Sidebar Filters:** `src/components/SidebarFilters.tsx` (The right-hand panel for map filtering).
    -   *Status:* Missing. Must be recreated.
    -   *Dependencies:* Requires `Popover`, `Slider`, `Label` from `shadcn/ui`.
    -   *Implementation:* Adapt logic from `src/components/DataFilter.tsx` but use vertical layout and Shadcn components.

## 4. Missing Map Assets
-   **Mapbox Styles:** We need to ensure the correct Mapbox style URL is used.
-   **Token:** The `.env` file must contain `VITE_MAPBOX_TOKEN`.

## Summary
The "old" version is a stable *skeleton*, but it lacks the *muscles* (UI components) and *connective tissue* (utils) that the new features assume exist. We must add these before sticking the new features on.
