# Code Protocol Documentation

## 1. Operational Hierarchy

*   **The User (Architect):** Vision holder and final approver.
*   **Gemini (Prompt Engineer):** Intermediary translating vision to prompts.
*   **Antigravity (Code Writer):** Technical execution and feasibility analyst.

## 2. Core Mission: "The Replay Studio"

We are building a **Client-Side Video Production Suite** for Pokémon VGC.
*   **Goal:** Convert HTML Replays -> MP4 Video.
*   **Key Features:**
    *   **Audio Injection:** Mixing background music.
    *   **Branding:** Overlays and Watermarks.
    *   **Stealth Mode:** Recording the battle without forcing the user to watch it (via Element Capture API).

## 3. Protocol
*   **Safety First:** Do not compromise the user's browser security or performance.
*   **Honesty:** If "Stealth Mode" fails (browser unsupported), fallback to "Obscured Mode" rather than crashing.
