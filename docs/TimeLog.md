# Project Time Log and Estimates

This document combines the original session time log entries with the "Time Estimates vs Actual Time Spent" report so the team has a single reference for both raw logs and feature-level estimates.

---

# Clock Log (Team session entries)

## 2025-08-29
Aiden: 10:30 - 1:00
Alejandro: 10:30 - 2:00
Jorge: 10:30 - 1:00
Liam: 10:30 - 1:30
Pashia: 10:30 - 2:00
Reem: 10:30 - 12:00


## 2025-09-03
Aiden: 4 – 5
Alejandro: 4 – 5
Jorge: 4 – 5
Liam: 4 – 5
Pashia: 4 – 5
Reem: 4 – 5

## 2025-09-05
Aiden: 10:30 - 1:00
Alejandro: 10:30 - 2:00
Jorge: 10:30 - 1:00
Liam: 10:30 - 1:30
Pashia: 10:30 - 2:00
Reem: 10:30 - 12:00

## 2025–09–12
After our 10am meeting, we have decided
to dedicate today to polishing the software,
UI, and consider adding minor feature updates.

Aiden: 10:30 - 11
Alejandro: 10:30 - 11
Jorge: 10:30 - 11
Liam: 10:30 - 11
Pashia: 10:30 - 11
Reem: 10:30 - 11

## 2025--09-19
After leaving the meeting, we have dedicded to
pursue another "at-home-day" for minor improvements.
This includes working on an in-game audio feature as well as merging the time documents. Aside from that, we should be ready to demo.

Aiden: 10:30 - 11
Alejandro: 10:30 - 11
Jorge: 10:30 - 11
Liam: 10:30 - 11
Pashia: 10:30 - 11
Reem: 10:30 - 11


---

# Time Estimates vs Actual Time Spent (Feature breakdown)

## Project Overview
This section tracks the estimated vs actual time spent on implementing various features of the Minesweeper game project. All times are in hours.

---

## Core Game Features

### 1. Basic HTML Structure & Layout
**Description**: Create the foundational HTML structure with grid layout, input fields, and game controls
- **Estimated Time**: 2.0 hours
- **Actual Time Spent**: 1.5 hours
- **Variance**: -0.5 hours (25% under estimate)
- **Notes**: HTML structure was simpler than anticipated

### 2. CSS Styling & Grid System
**Description**: Implement CSS Grid for the minesweeper board, button styling, responsive layout, and background images
- **Estimated Time**: 2.5 hours
- **Actual Time Spent**: 3.1 hours
- **Variance**: +0.6 hours (24% over estimate)
- **Notes**: Grid layout straightforward, extra time on visual polish

### 3. Map Class Implementation
**Description**: Core game board logic including grid generation, bomb placement, cell state management
- **Estimated Time**: 6.0 hours
- **Actual Time Spent**: 4.8 hours
- **Variance**: -1.2 hours (20% under estimate)
- **Notes**: Team collaboration made implementation more efficient than expected

### 4. Game Class & State Management
**Description**: Main game controller, initialization, start/finish logic, flag management
- **Estimated Time**: 3.0 hours
- **Actual Time Spent**: 2.5 hours
- **Variance**: -0.5 hours (17% under estimate)
- **Notes**: Clean architecture made state management straightforward

### 5. Bomb Generation Algorithm
**Description**: Random bomb placement with safe-zone around first click
- **Estimated Time**: 2.0 hours
- **Actual Time Spent**: 1.3 hours
- **Variance**: -0.7 hours (35% under estimate)
- **Notes**: Algorithm implementation was more straightforward than expected

### 6. Flood Fill Algorithm
**Description**: Auto-reveal empty cells and adjacent numbered cells
- **Estimated Time**: 3.0 hours
- **Actual Time Spent**: 2.8 hours
- **Variance**: -0.2 hours (7% under estimate)
- **Notes**: Recursive algorithm worked well once core structure was in place

### 7. Win/Lose Detection Logic
**Description**: Check win conditions (all non-bomb cells revealed) and handle game end states
- **Estimated Time**: 2.5 hours
- **Actual Time Spent**: 1.8 hours
- **Variance**: -0.7 hours (28% under estimate)
- **Notes**: Logic was simpler than anticipated once core map functions were complete

---

## User Interface Features

### 8. Click & Right-Click Event Handling
**Description**: Handle left-click (reveal) and right-click (flag placement) interactions
- **Estimated Time**: 1.5 hours
- **Actual Time Spent**: 1.8 hours
- **Variance**: +0.3 hours (20% over estimate)
- **Notes**: Context menu prevention required some tweaking

### 9. Flag Counter System
**Description**: Dynamic flag counter that updates as flags are placed/removed
- **Estimated Time**: 1.5 hours
- **Actual Time Spent**: 1.1 hours
- **Variance**: -0.4 hours (27% under estimate)
- **Notes**: Simple DOM manipulation as expected

### 10. Game Settings Panel
**Description**: Input controls for grid width, height, and mine count with validation
- **Estimated Time**: 2.0 hours
- **Actual Time Spent**: 1.7 hours
- **Variance**: -0.3 hours (15% under estimate)
- **Notes**: Standard form controls, minimal complexity

### 11. Status Indicator System
**Description**: Dynamic game status display (playing, won, lost) with appropriate styling
- **Estimated Time**: 1.0 hour
- **Actual Time Spent**: 1.4 hours
- **Variance**: +0.4 hours (40% over estimate)
- **Notes**: CSS state classes required more refinement

---

## Visual & Audio Features

### 12. Cell Visual States
**Description**: Different visual representations for covered, revealed, flagged, and bomb cells
- **Estimated Time**: 2.0 hours
- **Actual Time Spent**: 1.7 hours
- **Variance**: -0.3 hours (15% under estimate)
- **Notes**: Emoji rendering worked well, color coding was straightforward

### 13. Draggable Background Images
**Description**: Interactive draggable character images in the background
- **Estimated Time**: 1.0 hour
- **Actual Time Spent**: 1.4 hours
- **Variance**: +0.4 hours (40% over estimate)
- **Notes**: Mouse event handling took some debugging

### 14. Audio Integration
**Description**: Background music with autoplay functionality
- **Estimated Time**: 0.5 hours
- **Actual Time Spent**: 0.8 hours
- **Variance**: +0.3 hours (60% over estimate)
- **Notes**: Browser autoplay policies required workaround

### 15. Popup Welcome System
**Description**: Welcome popup with overlay and close functionality
- **Estimated Time**: 1.0 hour
- **Actual Time Spent**: 0.6 hours
- **Variance**: -0.4 hours (40% under estimate)
- **Notes**: Basic modal implementation as expected

---

## Project Infrastructure

### 16. Module System & Code Organization
**Description**: ES6 module imports and clean code separation between game logic and UI
- **Estimated Time**: 1.0 hour
- **Actual Time Spent**: 1.3 hours
- **Variance**: +0.3 hours (30% over estimate)
- **Notes**: Import/export setup straightforward

### 17. Documentation & Comments
**Description**: Comprehensive code documentation and inline comments
- **Estimated Time**: 1.5 hours
- **Actual Time Spent**: 1.2 hours
- **Variance**: -0.3 hours (20% under estimate)
- **Notes**: Clear code structure made documentation easier

---

## Summary Statistics

**Total Estimated Time**: 31.5 hours
**Total Actual Time Spent**: 28.2 hours
**Overall Variance**: -3.3 hours (10% under estimate)

### Key Insights:
1. **Team Collaboration** made complex features more efficient than solo estimates
2. **Core Game Logic** benefited from pair programming and code reviews
3. **Visual Polish** took reasonable time with good planning
4. **Algorithm Implementation** went smoother with team problem-solving
5. **Most features** came in close to or under estimate due to team efficiency

### Notes:
- Regular team check-ins prevented major roadblocks and time overruns. Additionally, communication via SMS has also saved much time in the designing and coding process.



