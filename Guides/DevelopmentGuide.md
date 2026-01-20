# Volta Development Guide

This guide provides a technical overview of the Volta Cable Design Validation System and instructions for extending its capabilities.

## Architecture Overview

Volta uses a modern, modular architecture that separates concerns between AI reasoning, data persistence, and user interface.

### Backend (NestJS + Genkit)
- **AI Gateway**: Orchestrates interactions with Ollama using Firebase Genkit.
- **Genkit Flows**: Implements type-safe AI workflows (`extractFieldsFlow`, `validateDesignFlow`).
- **MongoDB**: Stores cable design records for persistence and retrieval.
- **Grounding Standards**: Utilizes markdown-based standards in the `standards/` directory to provide context to the AI model.

### Frontend (Next.js + Material UI)
- **Design Validator**: A unified interface for structured and free-text input.
- **Reasoning Viewer**: Displays AI's decision-making process and confidence scores.

## Extending the System

### Adding New Standards
1. Add a new markdown file to `standards/` (e.g., `standards/NEW_STD.md`).
2. Update `ai-gateway/flows.ts` to include the new standard in the grounding logic.

### Modifying AI Logic
- Edit `backend/src/ai-gateway/flows.ts` to update prompts or validation logic.
- Use `genkit start` (if tools are installed) to test flows in isolation.

## Troubleshooting
- **Ollama Connection**: Ensure Ollama is running (`ollama serve`) and the `gemma3:1b` model is loaded.
- **MongoDB**: Check `MONGODB_URI` in `.env`.
