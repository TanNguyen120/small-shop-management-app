# GEMINI.md - AI Context Anchor

This file provides the structural and behavioral "anchor" for AI agents collaborating on the **Small Shop Management App**.

## 🏗 Project Identity
- **Repository:** https://github.com/TanNguyen120/small-shop-management-app
- **Domain:** Retail, Inventory Management, and Resale Analysis.

## 🛠 Tech Stack & Patterns
- **Runtime:** Node.js
- **SDK:** `@google/genai` (Latest)
- **AI Strategy:** Context Caching for System Instructions to optimize performance/cost.
- **Data Format:** JSON-first communication between AI and Backend.

## 🧠 Strategic Instructions (The Anchor)
When working on this project, Gemini must:
1. **Use Modern Syntax:** Always implement the `@google/genai` classes (`GoogleGenerativeAI`, `GoogleAICacheManager`).
2. **Implement Caching:** All "Resale Analysis" scripts must use `cacheManager.create()` for system instructions.
3. **Business Logic:** - Default depreciation: 10% monthly.
    - Risk levels: Low, Medium, High based on market demand.
4. **Architectural Style:** - Decouple AI logic into `services/aiService.js`.
    - Use ES Modules (`import/export`).

---
*Created by Gemini Architect for TanNguyen120*
