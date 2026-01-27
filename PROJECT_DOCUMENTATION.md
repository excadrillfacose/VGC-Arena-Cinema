# Project Documentation: VGC Arena Cinema (The Studio)

## 1. Project Overview
**VGC Arena Cinema** is a client-side video production suite designed to convert Pokémon Showdown `.html` replays into broadcast-quality `.mp4` video files. Unlike a simple screen recorder, "The Studio" allows users to customize the output with branded overlays, background music, and specific visual layouts.

## 2. Architecture

The application functions as a linear production pipeline:

### Stage 1: Ingestion
*   **Input:** User uploads a `.html` replay file or pastes a Showdown URL.
*   **Parsing:** The app extracts the "Battle Log" (protocol) and Metadata (Players, Teams, Ratings).

### Stage 2: Configuration (The Studio Layer)
*   **Layout Selection:** User chooses a visual style:
    *   *Clean:* Pure game board.
    *   *Broadcast:* Adds "VGC Arena" overlays, scoreboard branding, and logos.
*   **Audio Injection:** User selects background music (MP3) from a preset library or upload.
*   **Stealth Mode:** Option to "Hide" the playback during recording (using Element Capture API if available).

### Stage 3: The Engine (Simulation & Hydration)
*   **Core:** **Iframe Sandbox**. The application loads the original Replay HTML into a Blob URL Iframe.
*   **Rationale:** Showdown Replays are self-contained engines. Rewriting the renderer using `@pkmn/view` (which is text-only) or porting the full client is excessive.
*   **Control:** We inject commands into the iframe `contentWindow` to Pause/Play/Reset.
*   **Overlay System:** React components render frame-perfect overlays (Watermarks, Scoreboards) *on top* of the iframe.

### Stage 4: Capture (The Camera)
*   **Method:** `getDisplayMedia` (Screen Capture).
*   **Refinement:** **Region Capture / Element Capture API** is used to crop the video stream specifically to the Battle Container, excluding the user's browser UI and the "Progress Bar" overlay.

### Stage 5: Encoding (The Lab)
*   **Engine:** `ffmpeg.wasm` (WebAssembly).
*   **Pipeline:**
    1.  Ingest WebM stream from MediaRecorder.
    2.  Transcode video to H.264 (MP4).
    3.  Mix/Mux the selected MP3 Audio track.
    4.  Apply final filters (if needed).
*   **Output:** Downloadable `.mp4` file.

## 3. User Experience (UX)

*   **Isolation:** The app runs in a separate window/tab to support `COOP`/`COEP` headers.
*   **Workflow:**
    1.  **Setup:** Upload & Customize.
    2.  **Recording:** The user clicks "Start". The browser asks effectively to "Share This Tab".
    3.  **Process:** The battle plays out (perhaps at 2x speed if capturing allows). A Progress Bar overlays the screen (invisible to the recording via Element Capture).
    4.  **Download:** The video is processed and saved.

## 4. Technical Constraints
*   **Performance:** Encoding 1080p in WASM is CPU intensive. The user's fans will spin.
*   **Focus:** The browser tab MUST remain valid/active. Background throttling is a major risk.
