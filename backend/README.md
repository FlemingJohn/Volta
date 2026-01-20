# Volta Backend: AI Orchestration & Data Layer

The Volta backend is a NestJS-based API that serves as the orchestration layer between the frontend application, the MongoDB persistence layer, and the AI reasoning engine (Firebase Genkit/Ollama).

## Core Architecture

### 1. AI Infrastructure (Genkit)
We use **Firebase Genkit** to define type-safe AI flows. This provides:
- **`extractFieldsFlow`**: Converts messy free-text descriptions into structured cable design JSON.
- **`validateDesignFlow`**: Critically evaluates designs against IEC standards.
- **Zod Enforcement**: Strict input/output contracts ensure AI hallucinations are caught before reaching the frontend.

### 2. Data Persistence (MongoDB)
All cable design records are managed via **Mongoose**.
- **Schema**: Defines standard properties (Standard, Voltage, Conductor, etc.).
- **Seeding**: Use `seed-mongo.js` to populate your local database with test records (e.g., `cable-123`).

## Project Structure

```text
backend/
├── src/
│   ├── design-validation/   # Main business logic & DTOs
│   │   ├── schemas/         # Mongoose DB schemas
│   │   └── dto/            # Class-validator request/response objects
│   ├── ai-gateway/          # AI flows and Genkit configuration
│   │   ├── flows.ts         # Logic for extraction and validation
│   │   └── schemas.ts       # Zod contracts for AI interactions
│   └── standards/           # Ground truth standards for AI reasoning
└── seed-mongo.js            # Database seeding utility
```

## Setup & Installation

### 1. Dependencies
Ensure you have **Node.js v18+**, **MongoDB**, and **Ollama** installed.

```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/volta
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=gemma3:1b
```

### 3. Database Seeding
To test the "Fetch Record ID" functionality:
```bash
node seed-mongo.js
```

### 4. Running the Server

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Documentation

### `POST /design/validate`
The primary endpoint for cable validation.

**Request Body:**
```json
{
  "recordId": "cable-123",        // Optional: Fetch from DB
  "freeTextInput": "10sqmm Cu...", // Optional: AI extraction
  "structuredInput": { ... }      // Optional: Manual overrides
}
```

**Order of Precedence:**
1. `recordId` (Highest)
2. `freeTextInput`
3. `structuredInput` (Fallback)

## LLM Grounding
The AI model is grounded using standards documents located in `src/standards/`. During validation, the relevant standard's content is injected into the prompt to ensure the AI uses authoritative data rather than internal training weights only.
