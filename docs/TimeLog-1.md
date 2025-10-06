# EECS 581 – Minesweeper Project (Part 2)
**Team 1 – Project Time Log and Estimates**

This document combines the original development sessions with a breakdown of estimated vs. actual work time for each major feature in the Part 2 Minesweeper update. It serves as both a development log and a feature-level project report.

---

# Clock Log (Team Session Entries)

## 2025-09-16
After our team meeting, we finalized feature priorities for Part 2: adding an AI opponent, background music, and draggable UI elements. We also discussed code modularization and file structure improvements.

Zack: 10:30 – 12:30  
Nick: 10:30 – 12:30  
Saurav: 10:30 – 12:30  
Muhammad: 10:30 – 12:30  
Maren: 10:30 – 12:30  
Ibrahim: 10:30 – 12:30  

---

## 2025-09-23
Focused on integrating `ai.js` logic into the core game loop and refining difficulty modes (Easy, Medium, Hard). Implemented delayed AI turns, selection highlighting, and “thinking” overlay effects.

Zack: 9:30 – 11:30  
Nick: 9:30 – 12:00  
Saurav: 9:30 – 12:00  
Muhammad: 9:30 – 11:30  
Maren: 9:30 – 12:00  
Ibrahim: 9:30 – 12:00  

---

## 2025-09-30
Testing session for audio and draggable UI features. Added event listeners for background sound toggle, implemented win/loss audio, and verified drag functionality for images. Fixed minor CSS inconsistencies and ensured UI responsiveness.

Zack: 10:00 – 11:00  
Nick: 10:00 – 12:00  
Saurav: 10:00 – 12:00  
Muhammad: 10:00 – 11:00  
Maren: 10:00 – 12:00  
Ibrahim: 10:00 – 12:00  

---

## 2025-10-03
Final integration, testing, and documentation. Reviewed UML diagram, verified System Architecture.txt accuracy, and completed README + TimeLog.md submission.

Zack: 10:00 – 11:00  
Nick: 10:00 – 11:00  
Saurav: 10:00 – 11:30  
Muhammad: 10:00 – 11:30  
Maren: 10:00 – 11:00  
Ibrahim: 10:00 – 11:00  

---

# Time Estimates vs Actual Time Spent (Feature Breakdown)

## Project Overview
This section outlines the estimated vs. actual hours spent implementing each major feature for Part 2. All times are in hours.

---

## Core Game Enhancements

### 1. AI Module (`ai.js`)
**Description**: Implemented three AI difficulty modes with safe-open/flag logic and probabilistic inference (Easy, Medium, Hard). Added delay simulation and AI “thinking” overlay.  
- **Estimated Time**: 3.0 hours  
- **Actual Time Spent**: 3.5 hours  
- **Variance**: +0.5 hours (17% over estimate)  
- **Notes**: Most time spent refining visual feedback and testing difficulty logic.

---

### 2. Grid & Game Logic Updates
**Description**: Adjusted `game.js` and `map.js` to handle AI turn sequencing and status messages. Minor refactoring for consistent DOM access and bug prevention.  
- **Estimated Time**: 2.0 hours  
- **Actual Time Spent**: 1.5 hours  
- **Variance**: -0.5 hours (25% under estimate)  
- **Notes**: Integration went smoother due to existing clean architecture from Part 1.

---

## Visual & UI Features

### 3. Draggable UI Elements
**Description**: Added draggable images using mouse events for interactive visuals. Ensured boundary containment and performance across browsers.  
- **Estimated Time**: 1.5 hours  
- **Actual Time Spent**: 2.0 hours  
- **Variance**: +0.5 hours (33% over estimate)  
- **Notes**: Additional debugging required for smooth drag behavior on grid overlay.

---

### 4. Audio System Integration
**Description**: Linked multiple background tracks and sound effects (bomb, win, lose, click). Ensured autoplay compatibility with browser security rules.  
- **Estimated Time**: 1.0 hour  
- **Actual Time Spent**: 1.5 hours  
- **Variance**: +0.5 hours (50% over estimate)  
- **Notes**: Chrome autoplay restrictions required creative workaround.

---

### 5. UI & CSS Redesign
**Description**: Updated layout for status area, added AI control buttons, and improved hover/active states. Revised overall grid styling for clarity and contrast.  
- **Estimated Time**: 2.0 hours  
- **Actual Time Spent**: 2.0 hours  
- **Variance**: ±0 hours  
- **Notes**: Completed on schedule with consistent styling.

---

## Documentation & Testing

### 6. UML Diagram & Architecture Docs
**Description**: Revised UML diagram to include AI module and updated System Architecture.txt.  
- **Estimated Time**: 1.0 hour  
- **Actual Time Spent**: 1.0 hour  
- **Variance**: ±0 hours  
- **Notes**: Collaborative editing ensured accurate documentation.

---

### 7. README & Time Log
**Description**: Created detailed README.md and this TimeLog.md summarizing all features, hours, and development workflow.  
- **Estimated Time**: 1.0 hour  
- **Actual Time Spent**: 1.0 hour  
- **Variance**: ±0 hours  
- **Notes**: Finalized after successful project testing.

---

## Summary Statistics

**Total Estimated Time**: 10.5 hours  
**Total Actual Time Spent**: 11.5 hours  
**Overall Variance**: +1.0 hour (9% over estimate)

---

### Key Insights
1. The AI logic and draggable UI features took the most time due to testing and fine-tuning.  
2. Clean modular code from Part 1 significantly reduced integration time.  
3. Team collaboration during debugging made feature completion more efficient.  
4. Documentation and organization were consistent with course expectations.  
5. Overall progress remained well within projected timeline.

---

### Contributors
| Team Member         | Main Contributions                     |
|----------------------|----------------------------------------|
| Zack Corbin          | Game logic integration, testing        |
| Nick Grieco          | AI implementation, tuning difficulty   |
| Saurav Renju         | UI redesign, documentation             |
| Muhammad Abdullah    | Timer updates, bug fixes               |
| Maren Proplesch      | AI integration, UI testing             |
| Ibrahim Muhammad     | UI fixes, drag event handling          |

---

### Repository
📂 **GitHub:** [https://github.com/Bwuh21/eecs581-Group1MS](https://github.com/Bwuh21/eecs581-Group1MS)
