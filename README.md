# Volta: AI-Driven Cable Design Validation System

Volta is a sophisticated validation platform designed to ensure low-voltage cable designs comply with international engineering standards, specifically **IEC 60502-1** and **IEC 60228**. Leveraging **Firebase Genkit** and the **Gemma 3:1B** model, the system provides intelligent, reasoning-based validation for both structured technical inputs and natural language descriptions.

## System Overview

Volta is built as a production-ready, decoupled full-stack system. Unlike rigid rule-based engines, Volta utilizes a **grounded reasoning engine** where an AI model interprets design parameters against real-world technical standards provided as context.

### Key Capabilities

*   **Standards-Grounded Validation**: Real-time checking against IEC 60502-1 (Construction) and IEC 60228 (Conductors).
*   **Multi-Input Support**: Accept structured JSON, raw technical descriptions (Free-text), or fetch existing records by **Record ID**.
*   **AI Extraction Flow**: Intelligent parsing of natural language to extract core parameters (Voltage, Material, CSA, etc.) using Genkit Flows.
*   **Transparent Engineering Results**: Field-by-field PASS/WARN/FAIL status with technical justifications.
*   **Decision Support**: High-level AI reasoning summaries and confidence scoring for engineering review.

## Architecture and Technology Stack

### Backend (NestJS)
*   **Orchestration**: NestJS with a modular service-based architecture.
*   **Data Persistence**: **MongoDB** (via Mongoose) for cable design records.
*   **AI Gateway**: **Firebase Genkit** providing type-safe AI flows and Zod-based contract enforcement.

### Frontend (Next.js)
*   **Framework**: Next.js 14 (App Router).
*   **Component Library**: Material UI (MUI v6) with a premium engineering aesthetic.
*   **Data Management**: MUI DataGrid for professional results management.

### AI Reasoning Engine
*   **Host**: Ollama (Local).
*   **Model**: Gemma 3:1B (815MB variant).
*   **Grounding**: Standards-based prompting for authoritative validation decisions.

## Project Structure

```text
Volta/
├── backend/            # NestJS Application
│   ├── src/
│   │   ├── ai-gateway/     # Genkit flows, Zod schemas, and AI orchestration
│   │   ├── design-validation/ # Core domain logic and MongoDB schemas
│   │   └── main.ts         # Server entry point
│   ├── standards/      # Technical IEC standards used for AI grounding
├── frontend/           # Next.js Application
│   ├── app/            # App router pages and layouts
│   ├── components/     # Modular Material UI components (Input, Results, Drawer)
│   ├── services/       # Type-safe API communication layer
│   └── theme/          # Centralized MUI theme configuration
└── Guides/             # Documentation, PRD, and Code Quality guidelines
```

## Getting Started

### Prerequisites

*   **Node.js**: v18 or higher.
*   **MongoDB**: Local instance running on port 27017.
*   **Ollama**: Installed and running locally.

### AI Model Preparation

1.  Start the Ollama service.
2.  Install the validation model:
    ```bash
    ollama pull gemma3:1b
    ```

### Backend Installation

1.  Navigate to `/backend` and install dependencies:
    ```bash
    npm install
    ```
2.  Create a `.env` file based on `.env.example`:
    ```env
    PORT=3001
    OLLAMA_API_URL=http://localhost:11434
    OLLAMA_MODEL=gemma3:1b
    MONGODB_URI=mongodb://localhost:27017/volta
    ```
3.  Seed the database (Optional but recommended for testing):
    ```bash
    node seed-mongo.js
    ```
4.  Start the server:
    ```bash
    npm run start:dev
    ```

### Frontend Installation

1.  Navigate to `/frontend` and install dependencies:
    ```bash
    npm install
    ```
2.  Configure your local environment:
    ```bash
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
    ```
3.  Start the development application:
    ```bash
    npm run dev
    ```

## Usage

1.  Visit `http://localhost:3000/design-validator`.
2.  **Input**: Enter parameters manually, paste a technical description, or use a provided ID (e.g., `cable-123`).
3.  **Validate**: Click "Validate Design" to trigger the Genkit validation flow.
4.  **Analyze**: View the results in the table and open the **AI Reasoning** drawer for detailed engineering justification.

## Disclaimer

This system is an AI-assisted validation tool. While it uses grounded technical standards for reasoning, validation results should be used as decision-support tools and do not replace professional engineering certification for safety-critical hardware.
