# ROI Projection Tool

A B2B SaaS tool for projecting ROI on industrial capital equipment purchases. Built to provide defensible, conservative financial projections for CAPEX investment decisions.

## Features

- **Break-even Analysis**: Calculate project break-even month and months after commissioning
- **Monthly Cash Flow Engine**: 60-month projection with milestone-based CAPEX outflows
- **Labor Savings Calculator**: Based on burdened labor rates and headcount reduction
- **Capacity Benefit Calculator**: Throughput improvement × contribution margin
- **Interactive Chart**: Visualize cumulative benefits, costs, and net over time
- **Light/Dark Mode**: Professional appearance in both themes
- **Persistent Inputs**: Automatically saves your scenario to browser storage

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Financial Methodology

This tool follows conservative financial modeling principles:

- **Break-even is NOT discounted** — Uses cumulative undiscounted cash flows
- **Benefits begin at commissioning** — No partial month pro-rating
- **Milestone-based CAPEX** — Payments tied to project milestones
- **NPV is informational only** — Provided for reference, not used in break-even

## Technology Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts

## Project Structure

```
src/
├── calculations/     # Financial engine (mirrors Excel model)
├── components/
│   ├── chart/       # ROI projection chart
│   ├── inputs/      # Input form sections
│   ├── layout/      # App shell, header, theme toggle
│   └── outputs/     # Result displays
├── hooks/           # React hooks (theme, localStorage, calculation)
├── types/           # TypeScript type definitions
└── utils/           # Formatting utilities
```

## License

Proprietary - All rights reserved
