# Volta Frontend: Engineering Design Dashboard

The Volta frontend is a modern Next.js 14 application built to provide engineers with a high-fidelity, transparent interface for cable design validation.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Material UI (MUI v6)
- **Data Table**: MUI DataGrid (Pro-ready features)
- **Icons**: MUI Material Icons

## Design Principles

Volta uses a **Professional Green & White** aesthetic, designed to mimic high-end industrial software. Key UI features include:
- **Premium Themes**: Custom MUI theme with specific green highlights (`#2E7D32`) and clear elevation levels for Paper components.
- **Scannable Results**: PASS/WARN/FAIL chips with dedicated icons for immediate status recognition.
- **Deep-Dive Reasoning**: A sliding side drawer for AI justifications, keeping the main workspace clean.

## Setup & Installation

### 1. Dependencies

```bash
npm install
```

### 2. Environment Configuration
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Running the App

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

## Application Structure

```text
frontend/
├── app/
│   ├── design-validator/   # Main dashboard page
│   └── layout.tsx         # Root layout with MUI theme provider
├── components/
│   ├── design-validator/  # Domain-specific components
│   │   ├── InputPanel.tsx       # Tabbed input orchestrator
│   │   ├── ResultsTable.tsx     # MUI DataGrid implementation
│   │   └── ReasoningDrawer.tsx # AI detailed explanation view
├── services/              # API communication (Axios)
├── theme/                 # Centralized style configuration
└── types/                 # Shared TypeScript interfaces
```

## Key Features

- **Dynamic Validation**: Real-time feedback during form input.
- **Tabbed Inputs**: Switch between structured field entry and free-text analysis.
- **Confidence Meter**: Visual progress indicators for AI reliability scores.
- **Error Resilience**: Comprehensive handling for backend timeouts or model unavailability.
