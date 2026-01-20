[**InnoVites**](http://www.innovites.com)**,** who are we? 

**InnoVites** is one of the world’s leading providers of software solutions for Cable and Wire manufacturing and distribution Industry, transforming cable factories into the smart factories. 

It feels great to build and deliver software solutions that exactly address customer needs. And that’s exactly what InnoVites is about. 

We have a laser sharp focus on our target market: the wire and cable industry. With our deep understanding of this vertical we love building software that creates high value for our customers. 

It has resulted in continuous growth of the company, while we are serving our customers located in over 20 countries worldwide. As our customers benefit from the global energy transition, the future at InnoVites is electrifying! 

As a team we cherish craftmanship and celebrate team results. Every day we seek opportunities to learn from each other and grow.  

Together, we can make a difference – and you can too. Dream it. Build it. Do it here. 

AI-Driven Cable Design Validation System
========================================

1\. Problem Statement
---------------------

Low-voltage (LV) cable design engineers currently enter or import cable design specifications (for example:_“IEC 60502-1, 0.6/1 kV, Cu, Class 2, 10 mm², PVC, tᵢ = 1.0 mm”_) and manually compare each parameter against the requirements of **IEC 60502-1** and **IEC 60228**.

This manual process is:

*   time-consuming,
    
*   error-prone,
    
*   heavily dependent on senior engineer experience.
    

The objective of this project is to build an **AI-driven Design Validation System** that evaluates the ability of AI to perform **engineering standards validation**, rather than relying on deterministic rule engines.

2\. Project Objective
---------------------

The system must:

*   accept cable design data from a **database-generated JSON** or **semi-free-text input**,
    
*   extract technical attributes when required,
    
*   perform **validation directly via AI reasoning**,
    
*   return **PASS / FAIL / WARN** results with explanations and confidence levels.
    

**Note:** IEC validation logic is intentionally performed by AI.IEC rules and tables must **not** be hardcoded or stored in validation databases.

3\. Input Handling
------------------

### A. Database-Sourced Structured Input

The backend may fetch an existing cable design record from a database and convert it into JSON:

{

  "standard": "IEC 60502-1",

  "voltage": "0.6/1 kV",

  "conductor\_material": "Cu",

  "conductor\_class": "Class 2",

  "csa": 10,

  "insulation\_material": "PVC",

  "insulation\_thickness": 1.0

}

### B. Semi-Free-Text Input

Example:

“IEC 60502-1 cable, 10 sqmm Cu Class 2, PVC insulation 1.0 mm, LV 0.6/1 kV”

The backend must forward this input to the AI service for interpretation.

4\. AI-Based Extraction and Validation
--------------------------------------

You must integrate with the internal/hosted LLM service.

The AI is responsible for:

*   extracting all relevant design attributes,
    
*   interpreting IEC expectations,
    
*   validating the design,
    
*   producing structured validation results.
    

### Expected AI Response Format

{

  "fields": {

    "standard": "IEC 60502-1",

    "voltage": "0.6/1 kV",

    "conductor\_material": "Cu",

    "conductor\_class": "Class 2",

    "csa": 10,

    "insulation\_material": "PVC",

    "insulation\_thickness": 1.0

  },

  "validation": \[

    {

      "field": "insulation\_thickness",

      "status": "PASS",

      "expected": "1.0 mm",

      "comment": "Consistent with IEC 60502-1 nominal insulation thickness for PVC at 10 mm²."

    }

  \],

  "confidence": {

    "overall": 0.91

  }

}

5\. Backend API (NestJS)
------------------------

Implement a DesignValidationModule with:

### Endpoint

POST /design/validate

### API Flow

1.  Accept structured JSON and/or free-text input
    
2.  If DB record ID is provided, fetch and generate JSON
    
3.  Send inputs to the AI validation service
    
4.  Receive AI-generated validation results
    
5.  Return formatted response to the frontend
    

6\. Frontend (Next.js + Material UI)
------------------------------------

Create a page:

/design-validator

### UI Requirements

*   Input panel:
    
    *   structured form fields
        
    *   free-text input
        
    *   “Validate” button
        
*   Results panel:
    
    *   table (MUI DataGrid) with:
        
        *   Attribute | Provided | Expected | Status | Comment
            
    *   color-coded status chips:
        
        *   Green → PASS
            
        *   Amber → WARN
            
        *   Red → FAIL
            
*   Side drawer displaying:
    
    *   AI reasoning
        
    *   confidence score
        

7\. Deliverables
----------------

### Backend

*   NestJS API
    
*   AI integration layer
    
*   DB-to-JSON input handling
    
*   Validation response formatting
    

### Frontend

*   Design validator page
    
*   Results table with status indicators
    
*   Backend API integration
    

8\. What This Project Evaluates
-------------------------------

This assignment is designed to assess the candidate’s ability to:

*   integrate AI services into real-world applications,
    
*   design AI-driven validation workflows,
    
*   handle semi-structured engineering data,
    
*   build clean backend and frontend architectures,
    
*   understand the limitations and responsibilities of AI-based decision-making.
    

9\. Final Outcome
-----------------

The completed system will demonstrate **AI-driven engineering validation**, where compliance decisions are produced by AI reasoning using supplied design inputs, along with transparent explanations and confidence indicators to support engineering review.

Interviewer Evaluation Pack
===========================

**AI-Driven Cable Design Validation Project**

1\. Evaluation Criteria for Interviewers
----------------------------------------

Interviewers should evaluate the candidate across **four dimensions**, not just whether the app “works”.

### A. AI Integration & Reasoning (Core Focus)

Evaluate whether the candidate:

*   Correctly integrates with the AI/LLM service
    
*   Designs prompts that are:
    
    *   clear,
        
    *   constrained,
        
    *   structured for reliable outputs
        
*   Treats AI as a **reasoning engine**, not just a text generator
    
*   Handles:
    
    *   partial confidence,
        
    *   ambiguous input,
        
    *   missing fields
        
*   Presents AI output transparently (reasoning + confidence)
    

**Key question to ask:**

_How do you ensure the AI output is reliable and reviewable by an engineer?_

### B. Backend Architecture (NestJS)

Evaluate whether the candidate:

*   Uses proper NestJS structure:
    
    *   modules
        
    *   services
        
    *   DTOs
        
    *   controllers
        
*   Separates concerns:
    
    *   input handling
        
    *   AI gateway
        
    *   response formatting
        
*   Designs clean, readable APIs
    
*   Handles invalid inputs gracefully
    

**Red flags:**

*   AI calls directly inside controllers
    
*   No DTO validation
    
*   Business logic mixed with UI logic
    

### C. Frontend Implementation (Next.js + MUI)

Evaluate whether the candidate:

*   Builds a usable, clear UI
    
*   Correctly displays:
    
    *   PASS / WARN / FAIL
        
    *   explanations
        
    *   confidence
        
*   Uses visual indicators consistently
    
*   Handles loading and error states
    

**Bonus points:**

*   Expandable AI reasoning
    
*   Clean table design
    
*   Good UX even with partial data
    

### D. Engineering Judgment & Communication

Evaluate whether the candidate:

*   Understands **limitations of AI**
    
*   Clearly documents assumptions
    
*   Can explain design choices verbally
    
*   Understands this is **AI capability testing**, not deterministic compliance
    

**Key discussion topic:**

_Would you trust this system in production? Why or why not?_

2\. Expected Architecture (Reference)
-------------------------------------

This is **not mandatory**, but represents the expected design maturity.

┌────────────────────┐

│   Database (Input) │

│  (Cable Designs)   │

└─────────┬──────────┘

          │

          ▼

┌──────────────────────────┐

│  NestJS Backend API      │

│                          │

│  - Input Parser          │

│  - DB → JSON Mapper      │

│  - AI Gateway Service    │

│                          │

└─────────┬────────────────┘

          │

          ▼

┌──────────────────────────┐

│   AI / LLM Service       │

│                          │

│  - Extraction            │

│  - IEC Reasoning         │

│  - Validation Decision   │

│  - Explanation           │

│  - Confidence            │

│                          │

└─────────┬────────────────┘

          │

          ▼

┌──────────────────────────┐

│   Frontend (Next.js)     │

│                          │

│  - Input UI              │

│  - Results Table         │

│  - AI Reasoning Panel    │

│                          │

└──────────────────────────┘

**Important:**No IEC lookup tables or deterministic rule engines are expected.

3\. Sample Test Cases (For Review & Demo)
-----------------------------------------

### Test Case 1 — Fully Correct Design

**Input**

IEC 60502-1, 0.6/1 kV, Cu, Class 2, 10 mm², PVC, insulation 1.0 mm

**Expected AI Output**

*   Insulation thickness → PASS
    
*   CSA → PASS
    
*   Material/class → PASS
    
*   High confidence (≥ 0.85)
    

### Test Case 2 — Borderline / Warning Case

**Input**

IEC 60502-1 cable, 16 sqmm Cu Class 2, PVC insulation 0.9 mm

**Expected**

*   Insulation thickness → WARN
    
*   Explanation referencing nominal vs tolerance
    
*   Medium confidence
    

### Test Case 3 — Clearly Invalid Design

**Input**

IEC 60502-1, 0.6/1 kV, Cu, Class 2, 10 mm², PVC, insulation 0.5 mm

**Expected**

*   Insulation thickness → FAIL
    
*   Clear reasoning
    
*   Low confidence not acceptable (must still decide)
    

### Test Case 4 — Ambiguous Input

**Input**

10 sqmm copper cable with PVC insulation

**Expected**

*   Missing standard → WARN
    
*   Voltage unspecified → WARN
    
*   AI explanation clearly states assumptions
    

4\. Candidate Grading Rubric (Scoring)
--------------------------------------

**Category**

**Description**

**Score**

AI Prompting & Reasoning

Prompt quality, explainability, confidence handling

0–30

Backend Design

NestJS structure, API flow, cleanliness

0–20

Frontend UX

Clarity, correctness, visualization

0–15

Error Handling

Invalid input, missing data, failures

0–10

Engineering Understanding

Awareness of AI limitations

0–15

Communication

Ability to explain decisions

0–10

**Total**

**100**

### Suggested Interpretation

*   **85–100** → Strong hire
    
*   **70–84** → Hire / fast learner
    
*   **55–69** → Borderline
    
*   **< 55** → Not ready
    

5\. Final Interviewer Guidance
------------------------------

This project is **not about IEC correctness**.

It is about:

*   AI system thinking
    
*   engineering maturity
    
*   architecture clarity
    
*   explainability
    

A candidate who clearly explains **why AI should not fully replace deterministic validation** is often stronger than one who blindly trusts AI.