# Migration & Implementation Guide: VizyTemplate

This document outlines the step-by-step process to "pull" the old VizyTemplate into the current environment, **update its backend tech stack** (build configurations), and implement the requested features.

## Step 1: "Pull" & Restore (Completed)
We have successfully reset the workspace to the `old_vizy_template/VizyTemplate-main` state.
-   **Current State:** Clean "Old" Version.
-   **Node Version:** 20.19.4 (Verified compatible).

## Step 2: Tech Stack Update (The "Backend" Upgrade)
To accept the new features (specifically Shadcn UI and modern component patterns), we must update the build configuration to support **Path Aliases** (`@/`). The "Old" version lacks this.

### 2.1 Dependencies
Install the muscles (libraries) and the connective tissue (utils).
```bash
npm install mapbox-gl chart.js@^2.9.4 clsx tailwind-merge @radix-ui/react-slider @radix-ui/react-popover @radix-ui/react-label @radix-ui/react-slot
npm install -D @types/mapbox-gl @types/node
```

### 2.2 Configure Path Aliases
The new components expect to import utils from `@/lib/utils`. We must teach Vite and TypeScript how to resolve this.

#### Update `tsconfig.json`
Add `baseUrl` and `paths`:
```json
{
  "compilerOptions": {
    // ... existing options ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Update `vite.config.ts`
Add `path` resolution:
```typescript
import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ... existing optimizeDeps ...
})
```

### 2.3 Create Infrastructure
Create the utility file that the new components rely on.
-   **Create:** `src/lib/utils.ts` (Standard Shadcn `cn` helper).

## Step 3: Feature Implementation
With the "Tech Stack" updated, we can now safely paste in the advanced features.

### 3.1 Restore Standard Charts (Phase 2)
-   **Credit Rating:** Re-integrate `CreditRating.tsx` into `B2CView`.
-   **Company Size:** Re-integrate `CompanySize.tsx` into `B2BView`.

### 3.2 New Map View Architecture (Phase 3)
-   **Create:** `src/components/NewMapView.tsx` (Use this as the fresh name for the deleted `MapDashboard`).
    -   *Why:* A fresh start avoids legacy cruft.
-   **Sidebar:** Implement `SidebarFilters.tsx` inside `NewMapView`, using the now-supported Shadcn primitives (`Slider`, `Popover`).

### 3.3 Advanced Components (Phase 4)
-   **Mapbox:** Recreate `USAChoroplethMapbox.tsx`.
    -   *Critical:* Use the `mapbox-gl` token from environment variables.
-   **Population Pyramid:** Implement `PopulationPyramid.tsx` using `chart.js` (v2).
    -   *Critical:* Fix the Male/Female data parsing.

## Step 4: Verification
-   Run `npm run dev`.
-   Verify "Try New Map View" button works.
-   Verify Mapbox loads (requires Token).
-   Verify Charts appear.
