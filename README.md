# Volta: AI-Driven Cable Design Validation System

Volta is a sophisticated validation platform designed to ensure low-voltage cable designs comply with international engineering standards, specifically IEC 60502-1 and IEC 60228. Utilizing the Gemma Large Language Model via Ollama, the system provides intelligent, reasoning-based validation for both structured technical inputs and semi-structured natural language descriptions.

## System Overview

The application is architected as a decoupled full-stack system comprising a NestJS backend and a Next.js frontend. The core validation logic is offloaded to a locally hosted AI model, allowing for flexible interpretation of standards without the need for rigid, hardcoded rule engines.

### Key Capabilities

*   **Standard Compliance Validation**: Automated checking against IEC 60502-1 (construction) and IEC 60228 (conductor) requirements.
*   **Dual Input Modes**: Support for structured JSON payloads and free-text design specifications.
*   **AI reasoning Extraction**: Intelligent parsing of natural language to extract core technical parameters (Voltage, Material, CSA, etc.).
*   **Transparent Validation results**: Detailed PASS/WARN/FAIL status for each design attribute.
*   **Engineering Insights**: AI-generated explanations for validation decisions and confidence scoring to assist human review.

## Architecture and Technology Stack

### Backend
*   **Framework**: NestJS (TypeScript)
*   **API Pattern**: RESTful API with global validation pipes and modular dependency injection.
*   **AI Integration**: Custom Ollama integration service for high-performance inference.

### Frontend
*   **Framework**: Next.js 14 (App Router)
*   **UI Library**: Material UI (MUI v6)
*   **Design Language**: Professional Green and White aesthetic, optimized for clarity and focus.
*   **Data Visualization**: MUI DataGrid for structured results management.

### AI Engine
*   **Host**: Ollama (Local)
*   **Model**: Gemma 3 (1B/8B variants)
*   **Prompting Strategy**: Role-based engineering prompts optimized for structured JSON output.

## Project Structure

```text
Volta/
├── backend/            # NestJS Application
│   ├── src/
│   │   ├── ai-gateway/     # Ollama communication and prompt engineering
│   │   ├── design-validation/ # Core domain logic and API endpoints
│   │   └── main.ts         # Application entry point
├── frontend/           # Next.js Application
│   ├── app/                # App router pages and layouts
│   ├── components/         # Modular Material UI components
│   ├── services/           # Backend API communication layer
│   └── theme/              # Centralized MUI theme configuration
└── Guides/             # Technical documentation and PRD
```

## Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm or yarn
*   Ollama (installed and running on Windows/Mac/Linux)

### AI Model Preparation

1.  Start the Ollama service.
2.  Pull the required model:
    ```bash
    ollama pull gemma3:1b
    ```

### Backend Installation

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables by creating a `.env` file from `.env.example`:
    ```env
    PORT=3001
    OLLAMA_API_URL=http://localhost:11434
    OLLAMA_MODEL=gemma3:1b
    ```
4.  Start the development server:
    ```bash
    npm run start:dev
    ```

### Frontend Installation

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables by creating a `.env` file:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## Usage

1.  Access the web interface at `http://localhost:3000/design-validator`.
2.  Select between Structured Input or Free Text.
3.  Provide the cable design specifications (Standard, Voltage, Material, CSA, etc.).
4.  Click Validate to initiate the AI-driven analysis.
5.  Review the Validation Results table and use the AI Reasoning drawer for deeper insights.

## Code Standards

This project adheres to strict code quality guidelines:
*   **Modularity**: Concise files focused on single responsibilities.
*   **Verbose Naming**: Descriptive variable and function names to eliminate the need for comments.
*   **Maintainability**: Adherence to the standards defined in `Guides/CODE_Quality.md`.

## Disclaimer

This system is intended for technical evaluation and decision support. AI-generated validations should verify technical standards but do not replace final engineering stamps or professional reviews for safety-critical applications.
