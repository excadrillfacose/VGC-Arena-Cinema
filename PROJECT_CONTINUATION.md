# Project Continuation Roadmap

This document outlines the phased development of the VGC Arena Cinema (Studio Edition).

## 1. Roadmap

### Phase 1: Scaffolding & Environment [COMPLETED]
*   [x] **Next.js & Headers:** Initialize project with shared memory headers (`COOP`/`COEP`).
*   [x] **Asset Management:** Create structure for strictly local assets (`public/music`, `public/logos`).
*   [x] **FFmpeg Check:** Verified dependencies (`@ffmpeg/ffmpeg`) and Headers configuration.

### Phase 2: The Player (The Engine) [COMPLETED]
*   [x] **Replay Ingestion:** Built `FileDropzone` and `replayParser` to extract Metadata.
*   [x] **Engine Integration:** Implemented `BattleViewer` using Iframe Sandbox (Blob URL) to handle visual rendering.
*   [x] **Seek Control:** Implemented basic Play/Pause/Reset controls via `contentWindow`.
*   [x] **Replay Stability:** Implemented "Twin Engine" synchronization, Anti-Freeze protocols (Visibility, Audio Manager), and "Enforcer" script for robustness.

### Phase 3: The Composer (The Studio)
*   [ ] **Overlay System:** Create React components for the "Broadcast" layout (Scoreboard, Logos).
*   [ ] **Audio Picker:** UI for selecting background music tracks.
*   [ ] **Stealth Mode UI:** Implement the "Progress Bar Overlay" designed for Element Capture.

### Phase 4: The Recorder (The Camera)
*   [ ] **Region Capture:** specific implementation of `CropTarget` or `restrictTo` (Element Capture).
*   [ ] **Sync:** Ensure recording starts/stops exactly when the battle starts/ends.

### Phase 5: The Encoder (The Lab)
*   [ ] **Transcoding:** FFmpeg pipeline to convert WebM -> MP4.
*   [ ] **Mixing:** FFmpeg command to mix the specific Audio Track with the Video.
*   [ ] **Download:** Final blob generation.

## 2. Future Concepts
*   **Template Editor:** Allow users to upload their own overlays.
*   **YouTube API:** Direct upload (Post-MVP).
