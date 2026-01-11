# Figr Brand Performance Dashboard

A brand analytics dashboard that transforms shopper interaction data into actionable insights for fashion brands.

Deployed site preview: https://figr-dashboard-mock.vercel.app/

## Quick Start

### Prerequisites

- Node.js 18+
- npm

### Run Locally

**1. Start the Backend**

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:3001`

**2. Start the Frontend**

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`

### Deploy

**Backend → Railway**
1. Connect your GitHub repo to Railway
2. Set root directory: `backend`
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add env variable: `SIMULATE_DELAY=false` (disables mock delay in production)

**Frontend → Vercel**
1. Connect same GitHub repo to Vercel
2. Set root directory: `frontend`
3. Framework preset: Vite
4. Add env variable: `VITE_API_URL` = your Railway backend URL

---

## What Was Built

### Pages

**1. Overview**
- KPI cards showing: Total Avatars, Try-ons, Completion Rate, Conversion Rate, SKU Coverage, Latency
- **Real trend indicators** - Dynamically calculated by comparing current vs previous period
- Color-coded status (green/yellow/red) for quick health assessment
- **Full conversion funnel** (5 stages: Onboarding → Photo → Avatar → Try-on → Purchase)
- **Period Comparison Mode** - Toggle to see side-by-side metrics vs previous period
- Helpful tooltips explaining each metric

**2. Analytics**
- Try-ons over time (line chart)
- Category breakdown (donut chart: Tops, Bottoms, One-pieces)
- Top products by try-ons (horizontal bar)
- Height distribution (histogram)
- Size recommendation distribution
- Latency trends over time with legend
- Demographics breakdowns (age, gender, country)

**3. Recommendations**
- Data-driven actionable insights
- Prioritized by severity (High/Medium/Low)
- Each recommendation includes:
  - Problem description
  - Supporting metric with current value
  - Specific action to take
- Categories: Engagement, Catalog, Technical, Sizing

### Features

- **Date range filtering** - Presets (7d, 14d, 30d, All) + custom date picker
- **📊 Period Comparison** - Compare current period vs previous period side-by-side
- **CSV Export** - Download metrics report with one click
- **Dark/Light mode** - Theme toggle in sidebar
- **Mobile responsive** - Collapsible sidebar, adapted layouts
- **Loading states** - Skeleton loaders for each component
- **Error handling** - Error states with retry buttons
- **Empty states** - Friendly messaging when no data
- **Metric tooltips** - Hover to understand what each KPI means

### Testing

The backend includes comprehensive unit tests covering:
- Date filtering and period calculations
- All metrics service functions
- Recommendations engine logic

```bash
cd backend
npm test           # Run all tests
npm test:coverage  # Run with coverage report
```

---

## Technical Decisions

### Why Express.js for Backend?

The task prioritized "Technical implementation and orchestration of backend" as #1. A proper Express server demonstrates:
- Clear separation of concerns (routes → controllers → services)
- Middleware patterns (error handling, CORS)
- API design skills
- Real-world backend architecture

### Why These Metrics?

**Core metrics** (what brands track):
- Avatar completion rate → Onboarding funnel health
- Try-on conversion → Product engagement
- SKU coverage → Catalog optimization opportunity

**Advanced metrics** (decision drivers):
- Category performance → Where to focus inventory
- Size distribution → Sizing availability gaps
- Drop-off funnel → Where users abandon

### Recommendations Engine

Instead of just showing data, the dashboard generates actionable insights:
- Compares metrics against thresholds
- Identifies underperforming areas
- Suggests specific actions
- Prioritizes by business impact
- Context-aware (different time periods show different issues)

### UI/UX Choices

- **Clean, professional design** - Not flashy, but clear hierarchy
- **Status indicators** - Color-coding helps non-technical users
- **Plain language** - Tooltips and labels avoid jargon
- **Progressive disclosure** - Overview first, details in Analytics
- **Dark mode support** - Reduces eye strain, modern preference

---

## What I'd Add Next

**With more time:**

1. **Real database** - PostgreSQL with Prisma ORM for proper data persistence
2. **Authentication** - Brand-specific dashboards with login
3. **Alerts/notifications** - Email when metrics cross thresholds
4. **More visualizations** - Heatmaps, cohort analysis, retention curves
5. **PDF Export** - Formatted reports for stakeholders
6. **E2E tests** - Playwright tests for critical user flows
7. **Anomaly detection** - Auto-highlight unusual metric changes

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Express.js, TypeScript |
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn-inspired components |
| Charts | Recharts |
| State | TanStack Query |
| Deployment | Railway (backend), Vercel (frontend) |

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── __tests__/      # Unit tests (Jest)
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── data/           # Mock JSON data
│   │   ├── middleware/     # Error handling
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Helpers (delay, date filters, trends)
│   ├── jest.config.js      # Test configuration
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Data fetching + theme hooks
│   │   ├── lib/            # Utils, API client, export
│   │   └── types/          # TypeScript types
│   └── package.json
│
└── README.md
```

---

## Time Spent

5-6 hours approx.

---

## API Reference

| Endpoint | Description |
|----------|-------------|
| `GET /api/metrics/summary` | Top-level KPIs with real trend calculations |
| `GET /api/metrics/avatars` | Avatar creation stats |
| `GET /api/metrics/tryons` | Try-on metrics by category |
| `GET /api/metrics/products` | Product performance |
| `GET /api/metrics/shoppers` | Demographics, distributions |
| `GET /api/metrics/performance` | Latency, error rates |
| `GET /api/metrics/funnel` | Full 5-stage conversion funnel |
| `GET /api/comparison` | Side-by-side period comparison |
| `GET /api/recommendations` | Actionable insights |

All endpoints support `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` query params.

---

## Environment Variables

### Backend
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `SIMULATE_DELAY` | true | Enable fake API delay for demo |
| `DELAY_MS` | 1500 | Delay duration in ms |

### Frontend
| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes (prod) | Backend API URL |
