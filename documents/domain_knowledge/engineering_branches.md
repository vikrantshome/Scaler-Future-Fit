# Engineering Branch Data Documentation

This document outlines the engineering branch data and logic used in the Scaler Future Fit system to match students with their ideal career paths.

## 1. Data Structure

The system uses a weighted scoring model to calculate the compatibility between a student's profile (RAISEC score + Academic strengths) and various engineering branches.

Each branch is defined by:
- **ID:** Unique identifier (e.g., `cse`, `mech`).
- **Name:** The official name of the branch.
- **Description:** A brief summary of what the branch entails and who it fits.
- **Weights:** A set of coefficients (0.0 to 1.0) indicating the importance of specific traits and subjects for that branch.
  - **RAISEC Traits:** Realistic (R), Investigative (I), Artistic (A), Social (S), Enterprising (E), Conventional (C).
  - **Academic Subjects:** Math, Physics, Chemistry, Computer Science (CS), Logic.

## 2. Supported Engineering Branches

The system currently evaluates the following 9 branches:

### 1. Computer Science & Engineering (CSE)
*   **Description:** The backbone of the digital world. Includes Full Stack Development, App Dev, and System Design. Ideal for logical builders.
*   **Key Traits:** Investigative, Conventional, Enterprising.
*   **Key Subjects:** Computer Science (1.0), Logic (0.9), Math (0.8).

### 2. AI & Data Science
*   **Description:** The future of intelligence. Requires strong math, pattern recognition, and problem-solving skills.
*   **Key Traits:** Investigative, Conventional.
*   **Key Subjects:** Math (1.0), Logic (1.0), Computer Science (0.9).

### 3. Algorithmic Trading & FinTech
*   **Description:** Where finance meets high-speed coding. For math wizards who want to build automated trading systems.
*   **Key Traits:** Investigative, Enterprising, Conventional.
*   **Key Subjects:** Math (1.0), Logic (1.0), Computer Science (0.7).

### 4. Electronics & Communication (ECE)
*   **Description:** The bridge between hardware and software. Great for those who like physics and circuits.
*   **Key Traits:** Realistic, Investigative.
*   **Key Subjects:** Physics (0.9), Math (0.7).

### 5. Mechanical Engineering
*   **Description:** For those who want to design machines, engines, and physical systems. Hands-on and physics-heavy.
*   **Key Traits:** Realistic (1.0), Investigative.
*   **Key Subjects:** Physics (1.0), Math (0.6).

### 6. Electrical Engineering
*   **Description:** Powering the world. Deals with electricity, electromagnetism, and power grids.
*   **Key Traits:** Realistic, Investigative.
*   **Key Subjects:** Physics (0.9), Math (0.8).

### 7. Civil Engineering
*   **Description:** Building the infrastructure of civilization. Roads, bridges, and skyscrapers.
*   **Key Traits:** Realistic, Conventional.
*   **Key Subjects:** Physics (0.8), Math (0.6).

### 8. Robotics & Mechatronics
*   **Description:** The perfect blend of Mechanical, Electrical, and CS. For creators of autonomous systems.
*   **Key Traits:** Realistic (1.0), Investigative.
*   **Key Subjects:** Physics (0.8), Computer Science (0.8), Math (0.7).

### 9. Chemical Engineering
*   **Description:** Transforming raw materials into useful products. Requires love for chemistry and process logic.
*   **Key Traits:** Investigative, Conventional.
*   **Key Subjects:** Chemistry (1.0), Physics (0.6).

## 3. Scoring Logic Overview

The matching algorithm works as follows:
1.  **Normalization:** Student's RAISEC scores are normalized to a 0-10 scale.
2.  **Weighted Sum:** For each branch, the system calculates a score by multiplying the student's trait/subject score by the branch's defined weight.
    *   *Example for CSE:* `(Student_I_Score * 0.9) + (Student_Math_Score * 0.8) + ...`
3.  **Bonus Points:** Additional points are awarded for specific career goals (e.g., wanting to be a "Founder" boosts CSE scores).
4.  **Ranking:** Branches are sorted by total score, and the top 3 are presented to the user.
