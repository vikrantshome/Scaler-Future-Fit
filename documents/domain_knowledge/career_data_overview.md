# Career Data System Overview

This document provides a high-level view of the career data collected and analyzed by the Scaler Future Fit system. It details the inputs (user profile) and the conceptual model used for career mapping.

## 1. User Profile Data Model

The system builds a comprehensive "Career Profile" for each student based on two primary dimensions: Personality and Academic aptitude.

### A. Personality Dimension (RAISEC Model)
The system utilizes the **RAISEC** (Holland Code) framework to categorize students into six personality types. This is the core psychological engine of the tool.

| Type | Full Name | Description | Key Attributes |
| :--- | :--- | :--- | :--- |
| **R** | **Realistic** | "The Doers" | Practical, hands-on, tool-oriented, physical. |
| **A** | **Artistic** | "The Creators" | Creative, expressive, innovative, intuitive. |
| **I** | **Investigative** | "The Thinkers" | Analytical, logical, scientific, curious. |
| **S** | **Social** | "The Helpers" | Cooperative, empathetic, teaching-oriented. |
| **E** | **Enterprising** | "The Persuaders" | Ambitious, leadership-oriented, risk-taking. |
| **C** | **Conventional** | "The Organizers" | Structured, detail-oriented, data-driven. |

**Data Collection:**
- Users answer Likert-scale questions (Strongly Disagree to Strongly Agree).
- *Example Question:* "I enjoy taking apart gadgets to see how they work." (Maps to **Realistic**)

### B. Academic & Preference Dimension
Beyond personality, the system captures hard constraints and academic reality.

*   **Favorite Subject:** (Math, Physics, CS, Chemistry, Biology) - *Directly boosts related engineering branches.*
*   **Strongest Subject:** (Math, Physics, CS, Chemistry, Biology) - *Acts as a capability check.*
*   **Exam Preparation:** (JEE, BITSAT, Olympiad, None) - *Indicates rigor and technical depth.*
*   **Learning Style:** (Practical, Theoretical, Rote) - *Differentiates between research-heavy vs. application-heavy fields.*
*   **Career Goal:** (Software, Research, Startup, Core Engg) - *Aligns branch choice with long-term aspirations.*

## 2. Data Flow & Analysis

The career data flows through three stages to produce a recommendation:

1.  **Ingestion:**
    - User completes the 2-part assessment (Personality + Academic).
    - Raw responses are stored in the application state.

2.  **Synthesis (Scoring Engine):**
    - **Normalization:** Raw RAISEC counts are converted into a standardized "Intensity Score" (0-10) for each type.
    - **Mapping:** These intensity scores are cross-referenced with the **Engineering Branch Weights** (see `engineering_branches.md`).
    - **Boosting:** Academic preferences apply multipliers. (e.g., If `Favorite Subject = Math`, all Math-heavy branches get a +15% score boost).

3.  **Output (Insights):**
    - **Top 3 Recommendations:** The highest-scoring engineering branches.
    - **Dominant Trait:** The student's primary RAISEC type (e.g., "You are primarily Investigative").
    - **AI Narrative:** A Generative AI model (Gemini) takes this structured data and writes a human-like summary explaining *why* this career path fits the specific student.

## 3. Data Storage (Simulation)

Currently, the system simulates a backend save operation. In a production environment, the following schema would be used for the `StudentProfile` collection:

```json
{
  "studentId": "uuid",
  "personalInfo": {
    "grade": "Class 12",
    "schoolName": "DPS Bangalore",
    "city": "Bangalore"
  },
  "assessment": {
    "raisecScores": { "R": 8, "I": 7, "A": 3, "S": 4, "E": 6, "C": 5 },
    "academicPreferences": { ... }
  },
  "results": {
    "recommendedBranches": ["CSE", "Robotics", "ECE"],
    "aiAnalysis": "Text string..."
  },
  "timestamp": "ISO-Date"
}
```
