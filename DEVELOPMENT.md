# GSE Dashboard - Development Guide

> **Version**: 1.0.0  
> **Last Updated**: December 2024  
> **Purpose**: Complete architecture, API, and implementation guide

---

## 1. Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Framework |
| TypeScript | 5.3.3 | Type safety |
| Vite | 7.2.4 | Build tool & dev server |
| Tailwind CSS | 3.4.0 | Styling |
| TanStack Query | 5.90.10 | Data fetching & caching |
| Recharts | 3.5.0 | Charts (Treemap heatmap) |
| next-themes | 0.4.6 | Theme management |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Express | 4.18.2 | HTTP server |
| tsx | 4.7.0 | TypeScript execution |
| @vercel/node | 5.5.10 | Serverless deployment |

### Build Tools
| Tool | Purpose |
|------|---------|
| esbuild | Server bundling |
| PostCSS | CSS processing |
| Autoprefixer | CSS vendor prefixes |

---

## 2. Project Structure

```
gse-dashboard-antigravity/
├── api/
│   └── index.ts              # Vercel serverless function
├── client/
│   ├── index.html            # Entry HTML
│   └── src/
│       ├── App.tsx           # Main application component
│       ├── main.tsx          # React entry point
│       ├── index.css         # Global styles & theme variables
│       ├── components/
│       │   ├── DarkModeToggle.tsx
│       │   ├── GainerLoserList.tsx
│       │   ├── Heatmap.tsx
│       │   ├── MarketStatsCard.tsx
│       │   ├── MarketStatusBanner.tsx
│       │   ├── SearchBar.tsx
│       │   ├── StockCard.tsx
│       │   └── StockTable.tsx
│       ├── hooks/
│       │   ├── useDarkMode.ts
│       │   ├── useSort.ts
│       │   └── useViewMode.ts
│       ├── lib/
│       │   └── utils.ts      # Utility functions
│       └── types/
│           └── index.ts      # TypeScript interfaces
├── server/
│   ├── index.ts              # Express server entry
│   └── routes.ts             # API route handlers
├── dist/                     # Build output
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── vercel.json               # Deployment config
```

---

## 3. API Architecture

### 3.1 Base Configuration

```typescript
// Environment Variables
GSE_API_BASE = 'https://dev.kwayisi.org/apis/gse'  // External GSE API
USE_MOCK_DATA = 'true' | 'false'                   // Enable mock fallback
```

### 3.2 API Endpoints

#### `GET /api/market-status`

Returns current market open/close status based on Ghana time.

**Response:**
```typescript
interface MarketStatus {
  isOpen: boolean;
  message: string;           // "Market is currently open/closed"
  hours: string;            // "10:00 AM - 3:00 PM GMT (Monday - Friday)"
  currentTime: string;      // ISO timestamp
}
```

**Market Hours Logic:**
```typescript
// Ghana operates on GMT (UTC+0)
const marketOpenTime = 10 * 60;   // 10:00 AM in minutes
const marketCloseTime = 15 * 60;  // 3:00 PM in minutes
const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;  // Mon-Fri

const isOpen = isWeekday && 
  currentTimeInMinutes >= marketOpenTime && 
  currentTimeInMinutes < marketCloseTime;
```

---

#### `GET /api/stocks/live`

Returns all live stock data.

**Response:**
```typescript
interface Stock {
  symbol: string;        // e.g., "MTNGH"
  name: string;         // e.g., "MTN Ghana"
  price: number;        // Current price in GHS
  change: number;       // Absolute change from previous close
  changePercent: number; // Percentage change
  volume: number;       // Trading volume
  marketCap: number;    // Market capitalization
}
```

**Example Response:**
```json
[
  {
    "symbol": "MTNGH",
    "name": "MTN Ghana",
    "price": 1.25,
    "change": 0.05,
    "changePercent": 4.17,
    "volume": 125000,
    "marketCap": 5000000000
  }
]
```

**Error Handling:**
- Falls back to mock data if external API fails
- Always returns 200 with data (mock or real)

---

#### `GET /api/stocks/live/:symbol`

Returns single stock data by symbol.

**Params:** `symbol` - Stock ticker (case-insensitive)

**Response:** Single `Stock` object

**Error Response (404):**
```json
{ "error": "Stock not found" }
```

---

#### `GET /api/equities`

Returns simplified equity list (symbol, name, price only).

**Response:**
```typescript
interface Equity {
  symbol: string;
  name: string;
  price: number;
}
```

---

#### `GET /api/equities/:symbol`

Returns detailed equity info by symbol.

---

### 3.3 External API Integration

**Ghana Stock Exchange API:**
- Base URL: `https://dev.kwayisi.org/apis/gse`
- Documentation: https://dev.kwayisi.org/apis/gse/

**Endpoints Used:**
| Our Endpoint | External Endpoint |
|--------------|-------------------|
| `/api/stocks/live` | `/live` |
| `/api/stocks/live/:symbol` | `/live/:symbol` |
| `/api/equities` | `/equities` |
| `/api/equities/:symbol` | `/equities/:symbol` |

---

### 3.4 Mock Data

For development and fallback:

```typescript
const MOCK_LIVE_DATA = [
  {
    symbol: 'MTNGH',
    name: 'MTN Ghana',
    price: 1.25,
    change: 0.05,
    changePercent: 4.17,
    volume: 125000,
    marketCap: 5000000000,
  },
  {
    symbol: 'GCB',
    name: 'GCB Bank Limited',
    price: 5.80,
    change: -0.20,
    changePercent: -3.33,
    volume: 45000,
    marketCap: 2500000000,
  },
  // ... more stocks
];
```

---

## 4. TypeScript Interfaces

### 4.1 Core Types

```typescript
// types/index.ts

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  priceHistory?: number[];  // Optional: for sparklines
}

export interface MarketStatus {
  isOpen: boolean;
  message: string;
  hours: string;
  currentTime: string;
}

export interface Equity {
  symbol: string;
  name: string;
  price: number;
}

export type ViewMode = 'table' | 'grid' | 'heatmap';

export interface MarketStats {
  gseIndex: number;
  gseIndexChange: number;
  volume: number;
  volumeChange: number;
  advancers: number;
  decliners: number;
  unchanged: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof Stock;
  direction: SortDirection;
}
```

---

## 5. Custom Hooks

### 5.1 useViewMode

Persists view mode selection to localStorage.

```typescript
// hooks/useViewMode.ts
import { useState, useEffect } from 'react';
import { ViewMode } from '../types';

const VIEW_MODE_KEY = 'gse_dashboard_view_mode';

export function useViewMode() {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const stored = localStorage.getItem(VIEW_MODE_KEY);
    return (stored as ViewMode) || 'table';
  });

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  return { viewMode, setViewMode };
}
```

### 5.2 useSort

Generic sorting hook for stock tables.

```typescript
// hooks/useSort.ts
import { useState, useMemo } from 'react';
import { Stock, SortConfig, SortDirection } from '../types';

export function useSort(items: Stock[], defaultConfig: SortConfig) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(defaultConfig);

  const sortedItems = useMemo(() => {
    const sortableItems = [...items];
    sortableItems.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: keyof Stock) => {
    let direction: SortDirection = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
}
```

### 5.3 useDarkMode

Theme toggling with next-themes integration.

```typescript
// hooks/useDarkMode.ts
import { useTheme } from 'next-themes';

export function useDarkMode() {
  const { theme, setTheme, systemTheme } = useTheme();
  
  const isDark = theme === 'dark' || 
    (theme === 'system' && systemTheme === 'dark');

  const toggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return { isDark, toggle };
}
```

---

## 6. Utility Functions

```typescript
// lib/utils.ts
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format large numbers with K/M/B suffix
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0.00';
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

// Format price with GHS currency
export function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) return 'GHS 0.00';
  return `GHS ${price.toFixed(2)}`;
}

// Format percentage with +/- sign
export function formatPercent(percent: number | undefined | null): string {
  if (percent === undefined || percent === null || isNaN(percent)) return '0.00%';
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}

// Get change direction
export function getChangeIndicator(change: number | undefined | null): 'up' | 'down' | 'neutral' {
  if (change === undefined || change === null || isNaN(change)) return 'neutral';
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
}

// Check if market is currently open
export function isMarketOpen(): boolean {
  const now = new Date();
  const day = now.getUTCDay();
  const hour = now.getUTCHours();
  
  if (day === 0 || day === 6) return false;  // Weekend
  return hour >= 10 && hour < 15;  // 10AM-3PM GMT
}

// Get next opening time message
export function getNextOpeningTime(): string {
  const now = new Date();
  const day = now.getUTCDay();
  const hour = now.getUTCHours();

  if (day === 5 && hour >= 15) return "Monday at 10:00 AM GMT";
  if (day === 6) return "Monday at 10:00 AM GMT";
  if (day === 0) return "Monday at 10:00 AM GMT";
  if (hour < 10) return "Today at 10:00 AM GMT";
  return "Tomorrow at 10:00 AM GMT";
}
```

---

## 7. Data Fetching Pattern

### 7.1 TanStack Query Setup

```typescript
// App.tsx
import { useQuery } from '@tanstack/react-query';

// Fetch functions
async function fetchMarketStatus(): Promise<MarketStatus> {
  const res = await fetch('/api/market-status');
  if (!res.ok) throw new Error('Failed to fetch market status');
  return res.json();
}

async function fetchStocks(): Promise<Stock[]> {
  const res = await fetch('/api/stocks/live');
  if (!res.ok) throw new Error('Failed to fetch stock data');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// Usage in component
function App() {
  const { data: marketStatus } = useQuery({
    queryKey: ['marketStatus'],
    queryFn: fetchMarketStatus,
    refetchInterval: 60000,  // Refresh every minute
  });

  const marketOpen = marketStatus?.isOpen ?? false;

  const { 
    data: stocks = [], 
    isLoading, 
    isError, 
    error,
    dataUpdatedAt 
  } = useQuery<Stock[]>({
    queryKey: ['stocks'],
    queryFn: fetchStocks,
    refetchInterval: marketOpen ? 30000 : false,  // Only refresh if open
  });
}
```

### 7.2 Auto-Refresh Logic

- Market status: Every 60 seconds
- Stock data: Every 30 seconds **only when market is open**
- When market closes: Auto-refresh stops, shows "last available data"

---

## 8. Tailwind Configuration

```javascript
// tailwind.config.js
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',  // Class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'hsl(217 91% 95%)',
          // ... full scale
          400: 'hsl(217 91% 60%)',  // Main brand
          // ...
        },
        success: {
          DEFAULT: 'hsl(142 76% 36%)',
          foreground: 'hsl(355.7 100% 97.3%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 84% 60%)',
          foreground: 'hsl(0 0% 98%)',
        },
        border: "hsl(214.3 31.8% 91.4%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(222.2 84% 4.9%)",
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      borderRadius: {
        'lg': '0.5625rem',
        'md': '0.375rem',
        'sm': '0.1875rem',
      },
    },
  },
  plugins: [],
}
```

---

## 9. CSS Theme Variables

```css
/* client/src/index.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 217 91% 60%;
    --primary-foreground: 210 40% 98%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --destructive: 0 84.2% 60.2%;
    --border: 214.3 31.8% 91.4%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --destructive: 0 62.8% 30.6%;
    --border: 217.2 32.6% 17.5%;
  }
}
```

---

## 10. Component Implementation

### 10.1 Heatmap Color Algorithm

```typescript
const getCellColors = (changePercent: number) => {
  // Neutral (no change)
  if (changePercent === 0) {
    return { bg: 'bg-gray-600', text: 'text-white' };
  }

  // Intensity 0-1 based on change percentage (capped at 5%)
  const intensity = Math.min(Math.abs(changePercent) / 5, 1);

  if (changePercent > 0) {
    // Green shades: from lighter green to darker green
    if (intensity < 0.2) return { bg: 'bg-green-500', text: 'text-white' };
    if (intensity < 0.4) return { bg: 'bg-green-600', text: 'text-white' };
    if (intensity < 0.6) return { bg: 'bg-green-700', text: 'text-white' };
    if (intensity < 0.8) return { bg: 'bg-green-800', text: 'text-white' };
    return { bg: 'bg-green-900', text: 'text-white' };
  } else {
    // Red shades: from lighter red to darker red
    if (intensity < 0.2) return { bg: 'bg-red-500', text: 'text-white' };
    if (intensity < 0.4) return { bg: 'bg-red-600', text: 'text-white' };
    if (intensity < 0.6) return { bg: 'bg-red-700', text: 'text-white' };
    if (intensity < 0.8) return { bg: 'bg-red-800', text: 'text-white' };
    return { bg: 'bg-red-900', text: 'text-white' };
  }
};
```

### 10.2 Market Stats Calculation

```typescript
const marketStats = useMemo<MarketStats>(() => {
  const volume = stocks.reduce((acc, stock) => acc + stock.volume, 0);
  const advancers = stocks.filter(s => s.change > 0).length;
  const decliners = stocks.filter(s => s.change < 0).length;
  const unchanged = stocks.filter(s => s.change === 0).length;

  return {
    gseIndex: 3120.45,      // TODO: Fetch from API
    gseIndexChange: 12.30,  // TODO: Fetch from API
    volume,
    volumeChange: 0,
    advancers,
    decliners,
    unchanged
  };
}, [stocks]);
```

---

## 11. Server Configuration

### 11.1 Express Server

```typescript
// server/index.ts
import express from 'express';
import { registerRoutes } from './routes';

const app = express();
const PORT = process.env.PORT || 8080;

registerRoutes(app);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist/public'));
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 11.2 CORS Configuration

```typescript
// In routes.ts
import cors from 'cors';

app.use(cors());  // Allow all origins for API

// For Vercel serverless, set headers manually:
res.setHeader('Access-Control-Allow-Credentials', 'true');
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
```

---

## 12. Deployment

### 12.1 Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "functions": {
    "api/index.ts": {
      "runtime": "@vercel/node"
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/index.ts" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 12.2 Build Commands

```bash
# Development
npm run dev        # Starts Express server with tsx

# Production build
npm run build      # Vite + esbuild

# Preview production
npm run preview    # Serve built files
```

---

## 13. Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `GSE_API_BASE` | `https://dev.kwayisi.org/apis/gse` | External API URL |
| `USE_MOCK_DATA` | `false` | Enable mock data |
| `PORT` | `8080` | Server port |
| `NODE_ENV` | `development` | Environment mode |

---

## 14. Testing Checklist

### API Endpoints
- [ ] `/api/market-status` returns correct open/close status
- [ ] `/api/stocks/live` returns array of stocks
- [ ] `/api/stocks/live/:symbol` returns single stock
- [ ] API falls back to mock data on error

### Components
- [ ] Table sorting works for all columns
- [ ] Heatmap colors match change percentages
- [ ] Search filters stocks correctly
- [ ] View mode persists across refreshes
- [ ] Dark mode toggle works

### Responsiveness
- [ ] Mobile layout (< 640px)
- [ ] Tablet layout (768-1024px)
- [ ] Desktop layout (> 1024px)

### Data Refresh
- [ ] Auto-refresh activates when market opens
- [ ] Auto-refresh stops when market closes
- [ ] Last update time displays correctly

---

## 15. Dependencies Reference

```json
{
  "dependencies": {
    "@radix-ui/react-slot": "^1.2.4",
    "@tanstack/react-query": "^5.90.10",
    "clsx": "^2.1.1",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "next-themes": "^0.4.6",
    "recharts": "^3.5.0",
    "tailwind-merge": "^3.4.0",
    "wouter": "^3.7.1",
    "zod": "^4.1.13"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/react": "^18.2.45",
    "@vercel/node": "^5.5.10",
    "@vitejs/plugin-react": "^4.2.1",
    "tailwindcss": "^3.4.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "vite": "^7.2.4"
  }
}
```

---

## 16. Quick Start for New Developers

```bash
# 1. Clone and install
git clone <repo>
cd gse-dashboard-antigravity
npm install

# 2. Start development server
npm run dev

# 3. Open browser
open http://localhost:8080

# 4. Build for production
npm run build

# 5. Deploy to Vercel
vercel --prod
```
