# GSE Dashboard - UI/UX Interface Guidelines

> **Version**: 1.0.0  
> **Last Updated**: December 2024  
> **Purpose**: Complete UI specification for Ghana Stock Exchange Dashboard

---

## 1. Design Philosophy

### Core Principles
- **Data-First**: Financial data is the hero—clean, scannable, monospaced numbers
- **Dark Mode Native**: Optimized for dark theme with full light mode support
- **Responsive**: Mobile-first approach with progressive enhancement
- **Minimal Friction**: Real-time data updates without jarring UI changes

---

## 2. Design System Tokens

### 2.1 Color Palette

#### Primary Brand Colors (Blue)
```
Primary-50:   hsl(217, 91%, 95%)  - Lightest tint
Primary-100:  hsl(217, 91%, 90%)
Primary-200:  hsl(217, 91%, 80%)
Primary-300:  hsl(217, 91%, 70%)
Primary-400:  hsl(217, 91%, 60%)  - MAIN BRAND COLOR
Primary-500:  hsl(217, 91%, 50%)
Primary-600:  hsl(217, 91%, 40%)
Primary-700:  hsl(217, 91%, 30%)
Primary-800:  hsl(217, 91%, 20%)
Primary-900:  hsl(217, 91%, 10%)
Primary-950:  hsl(217, 91%, 5%)   - Darkest shade
```

#### Semantic Colors
| Token | Light Mode | Dark Mode | Use Case |
|-------|------------|-----------|----------|
| `success` | hsl(142, 76%, 36%) | Same | Positive change, gainers, market open |
| `destructive` | hsl(0, 84%, 60%) | hsl(0, 62.8%, 30.6%) | Negative change, losers, errors |

#### Theme-Aware Backgrounds
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `background` | hsl(0, 0%, 100%) #FFFFFF | hsl(222.2, 84%, 4.9%) #030711 |
| `foreground` | hsl(222.2, 84%, 4.9%) | hsl(210, 40%, 98%) |
| `card` | hsl(0, 0%, 100%) | hsl(222.2, 84%, 4.9%) |
| `muted` | hsl(210, 40%, 96.1%) | hsl(217.2, 32.6%, 17.5%) |
| `muted-foreground` | hsl(215.4, 16.3%, 46.9%) | hsl(215, 20.2%, 65.1%) |
| `border` | hsl(214.3, 31.8%, 91.4%) | hsl(217.2, 32.6%, 17.5%) |

#### Heatmap Color Logic (Tailwind Shades)
```
NEUTRAL (0% change):    bg-gray-600

POSITIVE (gains):
  0-1%:   bg-green-500 (#22c55e)
  1-2%:   bg-green-600 (#16a34a)
  2-3%:   bg-green-700 (#15803d)
  3-4%:   bg-green-800 (#166534)
  4%+:    bg-green-900 (#14532d)

NEGATIVE (losses):
  0-1%:   bg-red-500 (#ef4444)
  1-2%:   bg-red-600 (#dc2626)
  2-3%:   bg-red-700 (#b91c1c)
  3-4%:   bg-red-800 (#991b1b)
  4%+:    bg-red-900 (#7f1d1d)

Intensity capped at 5% change for max color depth.
All text: white.
```

### 2.2 Typography

#### Font Stack
```css
--font-sans: 'Inter', 'Roboto', sans-serif;
--font-mono: 'Roboto Mono', monospace;
```

**Google Fonts Import:**
```
Inter: 300, 400, 500, 600, 700
Roboto: 300, 400, 500, 700
Roboto Mono: 400, 500, 600, 700
```

#### Type Scale
| Element | Size | Weight | Font | Use Case |
|---------|------|--------|------|----------|
| Page Title | 20px (xl) | Bold (700) | Inter | Section headers |
| Stats Display | 30-36px (3xl-4xl) | Bold (700) | Roboto Mono | Large numbers |
| Table Header | 12px (xs) | Semibold (600) | Inter | Column labels |
| Body Text | 14px (sm) | Regular (400) | Inter | General content |
| Price Values | 14-24px | Semibold-Bold | Roboto Mono | Stock prices |
| Micro Labels | 10px | Regular (400) | Inter | "Vol", "Mkt Cap" |
| Change Badges | 12px (xs) | Medium (500) | Roboto Mono | Percentage badges |

### 2.3 Spacing System

```
Base unit: 4px (0.25rem)

--space-1:  4px   (0.25rem)
--space-2:  8px   (0.5rem)
--space-3:  12px  (0.75rem)
--space-4:  16px  (1rem)
--space-6:  24px  (1.5rem)
--space-8:  32px  (2rem)
```

### 2.4 Border Radius
```
--radius-sm: 3px   (0.1875rem)
--radius-md: 6px   (0.375rem)
--radius-lg: 9px   (0.5625rem)
--radius-full: 9999px (pill/badge)
```

### 2.5 Shadows
```css
/* Light mode card shadow */
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);

/* Hover elevation */
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
```

---

## 3. Page Layout Structure

### 3.1 Header (Sticky)
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] GSE Dashboard    [Market Status Badge]  │ [SearchBar] │ [Stats] [🌙] │
│                                                │             │              │
│ Height: 64px (h-16)                           │             │              │
│ Background: bg-background/95 with backdrop-blur              │              │
│ Border: border-b                                             │              │
└─────────────────────────────────────────────────────────────────┘
```

**Components:**
- Logo: 32×32px primary-colored square with "G" letter
- Brand name: "GSE Dashboard" (hidden on mobile sm:inline-block)
- Market Status: Pill badge with animated dot
- Search Bar: max-width 512px, centered
- Quick Stats: GSE-CI and Volume (hidden on < lg)
- Dark Mode Toggle: Icon button

### 3.2 Main Content Grid
```
┌────────────────────────────────────┬──────────────────┐
│                                    │                  │
│    Main Data View (8/12 cols)     │  Sidebar (4/12)  │
│                                    │                  │
│  • View Toggle (Table/Grid/Heatmap)│  • Top Gainers   │
│  • Stock Data                      │  • Top Losers    │
│                                    │  • Market News   │
│                                    │                  │
└────────────────────────────────────┴──────────────────┘

Breakpoint: lg (1024px)
Below lg: Single column, sidebar stacks below
```

### 3.3 Stats Grid (Above Main)
```
┌─────────┬─────────┬─────────┬─────────┐
│ GSE-CI  │ Volume  │Advancers│Decliners│
│ 3,120.45│ 430K    │   12    │    5    │
│ +12.30% │         │   ↑     │    ↓    │
└─────────┴─────────┴─────────┴─────────┘

Desktop: 4 columns (md:grid-cols-4)
Mobile: 2 columns (grid-cols-2)
```

---

## 4. Component Specifications

### 4.1 Market Status Banner

**Anatomy:**
```
┌─────────────────────────────────────┐
│ ●  MARKET OPEN                      │  OR  │ ●  MARKET CLOSED │ Opens Monday 10AM │
└─────────────────────────────────────┘
```

**Specs:**
- Container: `rounded-full`, `px-3 py-1.5`
- Background: `bg-gray-100 dark:bg-gray-800`
- Border: `border border-gray-200 dark:border-gray-700`
- Dot size: `w-2 h-2 rounded-full`
- Open state: `bg-success animate-pulse`
- Closed state: `bg-destructive` (static)
- Text: `text-xs font-bold uppercase tracking-wide`

---

### 4.2 Market Stats Card

**Anatomy:**
```
┌─────────────────────┐
│   GSE COMPOSITE     │  ← Label (xs, uppercase, muted)
│      3,120.45       │  ← Value (3xl-4xl, mono, bold)
│        ↑ +12.30%    │  ← Change indicator (sm, success/destructive)
└─────────────────────┘
```

**Specs:**
- Container: `bg-white dark:bg-gray-800`, `rounded-lg`, `p-6`
- Border: `border border-gray-200 dark:border-gray-700`
- Shadow: `shadow-sm` → `hover:shadow-md`
- Transition: `transition-shadow duration-200`
- Layout: `flex flex-col items-center justify-center text-center`

---

### 4.3 View Mode Toggle

**Anatomy:**
```
┌───────────────────────────────┐
│ [Table] [Grid]  [Heatmap]     │
└───────────────────────────────┘
```

**Specs:**
- Container: `bg-muted p-1 rounded-lg`
- Button: `px-3 py-1 text-sm font-medium rounded-md`
- Active: `bg-background text-foreground shadow-sm`
- Inactive: `text-muted-foreground hover:text-foreground`
- Transition: `transition-all`

---

### 4.4 Stock Table

**Header Row:**
- Background: `bg-gray-50 dark:bg-gray-900/50`
- Text: `text-xs font-semibold text-gray-500 uppercase tracking-wider`
- Padding: `px-6 py-3`
- Clickable for sorting with `cursor-pointer`
- Sort indicator: Primary-colored arrow ↑/↓

**Data Row:**
- Height: `h-12`
- Hover: `hover:bg-gray-50 dark:hover:bg-gray-700/50`
- Transition: `transition-colors duration-150`
- Cursor: `cursor-pointer`

**Column Data:**
| Column | Styling |
|--------|---------|
| Symbol | `font-bold text-primary-600 dark:text-primary-400` |
| Name | `font-medium truncate max-w-[200px]` |
| Price | `font-mono font-semibold` |
| Change | `font-mono`, success/destructive color |
| % Change | Badge style with background color |
| Volume | `font-mono text-gray-500` |
| Market Cap | `font-mono text-gray-500` |

**Change Badge:**
```css
/* Positive */
bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300

/* Negative */
bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300

/* Neutral */
bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300

/* Size */
text-xs font-medium px-2 py-0.5 rounded
```

---

### 4.5 Stock Card (Grid View)

**Anatomy:**
```
┌───────────────────────────────┐
│ MTNGH          [~sparkline~]  │
│ MTN Ghana                     │
│                               │
│ GHS 1.25                      │
│ ↑ +0.05 (4.17%)              │
│                               │
│ ─────────────────────         │
│ Vol        Mkt Cap            │
│ 125K       5.00B              │
└───────────────────────────────┘
```

**Specs:**
- Container: `rounded-lg p-4`
- Background: `bg-white dark:bg-gray-800`
- Border: `border border-gray-200 dark:border-gray-700`
- Shadow: `shadow-sm hover:shadow-md`
- Transition: `transition-all duration-200`

**Symbol:** `text-sm font-bold uppercase tracking-wide`  
**Name:** `text-xs text-gray-500 truncate max-w-[120px]`  
**Price:** `text-2xl font-bold font-mono tracking-tight`  
**Footer:** `border-t border-gray-100 dark:border-gray-700/50 pt-3`

---

### 4.6 Heatmap (Treemap)

**Container:**
- Size: `w-full h-[600px]`
- Background: `bg-background`
- Border: `rounded-lg overflow-hidden border`

**Cell Rendering:**
- Uses Recharts `<Treemap>` with custom content renderer
- `dataKey="marketCap"` (cell size based on market cap)
- `nameKey="symbol"`

**Cell Colors (Dynamic):**
```javascript
// Zero change
bg-gray-700 dark:bg-gray-800

// Positive (green gradient)
HSL: hsl(145, 70%, 20-45%)
Lightness decreases (darker) as % increases

// Negative (red gradient)  
HSL: hsl(0, 70%, 20-45%)
Lightness decreases (darker) as % increases
```

**Cell Content:**
- Symbol: `font-bold text-sm text-center truncate`
- Change: `text-xs font-mono` with +/- prefix
- Market Cap: `text-[10px] opacity-80` (only if cell > 80×50px)

**Cell Styling:**
- Stroke: `rgba(255,255,255,0.2)` at 1px
- All text: white (dark backgrounds only)
- Hover: `brightness-110`

---

### 4.7 Search Bar

**Anatomy:**
```
┌──────────────────────────────┐
│ 🔍  Search quote (e.g. MTNGH)│
└──────────────────────────────┘
         ↓ (dropdown)
┌──────────────────────────────┐
│ MTNGH - MTN Ghana      1.25 │
│ GCB - GCB Bank Limited 5.80 │
└──────────────────────────────┘
```

**Input Specs:**
- Width: `max-w-md` (448px)
- Padding: `pl-10 pr-3 py-2`
- Border: `border border-gray-300 dark:border-gray-600`
- Radius: `rounded-md`
- Focus: `ring-1 ring-primary-500 border-primary-500`
- Icon: `h-5 w-5 text-gray-400` positioned absolute left

**Dropdown Specs:**
- Position: `absolute z-50 mt-1 w-full`
- Background: `bg-white dark:bg-gray-800`
- Shadow: `shadow-lg`
- Border: `ring-1 ring-black ring-opacity-5 border border-gray-200 dark:border-gray-700`
- Max height: `max-h-60 overflow-auto`
- Item hover: `hover:bg-gray-100 dark:hover:bg-gray-700`

---

### 4.8 Gainer/Loser List

**Anatomy:**
```
┌─────────────────────────────┐
│ TOP GAINERS                 │  ← Header with bg
├─────────────────────────────┤
│ MTNGH          GHS 1.25     │
│ MTN Ghana      ↑ +4.17%     │
├─────────────────────────────┤
│ EGH            GHS 7.50     │
│ Ecobank Ghana  ↑ +4.17%     │
└─────────────────────────────┘
```

**Header:**
- Background: `bg-gray-50 dark:bg-gray-900/50`
- Text: `text-xs font-semibold uppercase tracking-wider`
- Padding: `px-4 py-3`

**List Items:**
- Divider: `divide-y divide-gray-100 dark:divide-gray-700/50`
- Item padding: `px-4 py-3`
- Hover: `hover:bg-gray-50 dark:hover:bg-gray-700/50`
- Cursor: `cursor-pointer`

**Data Display:**
- Symbol: `text-sm font-bold text-primary-600 dark:text-primary-400`
- Group hover: Symbol lightens on row hover
- Name: `text-xs text-gray-500 truncate max-w-[120px]`
- Price: `text-sm font-mono font-semibold`
- Change: Arrow + percentage with success/destructive color

---

### 4.9 Dark Mode Toggle

**Specs:**
- Size: `p-2`
- Radius: `rounded-md`
- Hover: `hover:bg-gray-100 dark:hover:bg-gray-800`
- Color: `text-gray-500 dark:text-gray-400`
- Focus: `focus:ring-2 focus:ring-primary-500`
- Icon size: `w-5 h-5`

**Icons:**
- Light mode: Moon icon (to switch TO dark)
- Dark mode: Sun icon (to switch TO light)

---

## 5. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Default | < 640px | Mobile: single column, stacked layout |
| `sm` | ≥ 640px | Brand name visible, 2-col stats grid |
| `md` | ≥ 768px | 4-col stats grid, Market Status in header |
| `lg` | ≥ 1024px | 12-col main grid (8+4), header quick stats |
| `xl` | ≥ 1280px | Larger container padding |

---

## 6. Animation Guidelines

### Allowed Animations
| Animation | Duration | Easing | Use Case |
|-----------|----------|--------|----------|
| Transition colors | 150-200ms | ease | Hover states |
| Transition shadow | 200ms | ease | Card elevation |
| Transition all | 200-300ms | ease | View mode changes |
| Pulse | 3s | cubic-bezier(0.4,0,0.6,1) | Market open indicator |
| Spin | Standard | Linear | Loading spinner |

### Removed Animations
- ❌ Slide-in/out transitions
- ❌ Heavy entrance animations
- ❌ Scale transforms on hover

---

## 7. Iconography

**Style:** Outline icons, 24×24 viewBox, strokeWidth 2

**Required Icons:**
| Icon | Use Case |
|------|----------|
| Search (magnifying glass) | Search bar |
| Arrow up | Price increase, gainers |
| Arrow down | Price decrease, losers |
| Sun | Switch to light mode |
| Moon | Switch to dark mode |
| Refresh/Clock | Auto-refresh indicator |

**Icon Color States:**
- Default: `text-gray-400`
- Hover: `text-gray-500 dark:text-gray-300`
- Success: `text-success`
- Error: `text-destructive`

---

## 8. Currency & Number Formatting

| Format | Pattern | Example |
|--------|---------|---------|
| Price | `GHS {value.toFixed(2)}` | GHS 1.25 |
| Percent (positive) | `+{value.toFixed(2)}%` | +4.17% |
| Percent (negative) | `{value.toFixed(2)}%` | -3.33% |
| Large numbers | K/M/B suffix | 5.00B, 125.00K |

---

## 9. Empty & Loading States

### Loading Spinner
```html
<div class="h-96 flex items-center justify-center bg-card rounded-lg border">
  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
</div>
```

### Error State
```html
<div class="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
  Error message here
</div>
```

---

## 10. Footer

**Layout:** 2-section flex with responsive direction
- Left: Data attribution with link
- Right: Auto-refresh status + last update time

**Auto-refresh Indicator:**
- Active (market open): Pulsing green dot + "Auto-refresh enabled"
- Inactive (market closed): Static red dot + "Auto-refresh disabled"

**Last Updated:** `text-sm text-muted-foreground` with border-l separator

---

## 11. Accessibility Requirements

1. **Color Contrast**: All text meets WCAG AA (4.5:1 body, 3:1 large)
2. **Focus States**: Visible `ring-2 ring-primary-500` on focus
3. **Labels**: All interactive elements have `aria-label`
4. **Keyboard Navigation**: Full tab support for all interactive elements
5. **Screen Readers**: Semantic HTML with proper headings hierarchy

---

## 12. Asset Checklist

### Fonts (Google Fonts CDN)
- [ ] Inter (300, 400, 500, 600, 700)
- [ ] Roboto (300, 400, 500, 700)
- [ ] Roboto Mono (400, 500, 600, 700)

### Icons (SVG inline)
- [ ] Search
- [ ] Arrow Up
- [ ] Arrow Down
- [ ] Sun
- [ ] Moon
- [ ] Spinner

### Logo
- [ ] 32×32px rounded square with "G" letter
- [ ] Uses `primary-400` background
- [ ] White text for letter
