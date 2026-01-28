# VGC Arena Cinema - Technical Documentation

## Project Overview
**VGC Arena Cinema** is a specialized tool for recording high-fidelity Pokémon Showdown replays. It uses a "Twin Engine" architecture to capture the Battle and Chat Log effectively as separate video streams, allowing content creators to re-composite them freely.

### Core Tech
*   **Next.js 15:** Framework & Routing.
*   **Showdown Replay Parser:** Custom regex-based parser to extract battle logs.
*   **Twin-Engine Recorder:** Runs two synchronized iframes to render clean battle and chat views.
*   **FFmpeg WASM:** Client-side video conversion (WebM -> MP4 Remuxing).

### Features
*   **1080p @ 24fps Recording:** Optimized "Cinema Standard" capture pipeline.
*   **Twin Engine Output:** Exports a ZIP file containing `battle_replay.mp4` and `chat_log.mp4`.
*   **Client-Side Conversion:** Remuxes WebM to H.264 MP4 locally for compatibility.
*   **Smart Filenames:** Automatically names files based on Player Names (e.g., `PlayerA_vs_PlayerB.zip`).
*   **Privacy:** GDPR Compliant. Zero server-side processing; everything stays on your machine.

### Known Limitations
*   **Mobile Experimental:** The recorder is heavyweight and optimized for Desktop Chrome/Edge. Mobile devices may overheat or produce low-framerate video.
*   **Background Throttling:** You **MUST** keep the tab active while recording. Switching tabs will cause modern browsers to throttle the rendering loop, freezing the video.

---

## Technical File Analysis

This document provides a comprehensive technical analysis of every file in the project `vgc-arena-cinema`.

## Root Configuration Files

### `package.json`
**1) What it does:**
Defines the project metadata, scripts, and dependencies. It serves as the manifest for the Node.js project.

**2) How it does it:**
- **Scripts:** `dev`, `build`, `start`, `lint` run Next.js and ESLint commands.
- **Dependencies:** Key dependencies include `next` (v16.1.5), `react` (v19.2.3), `@pkmn/*` packages (for Pokemon logic), `@ffmpeg/ffmpeg` & `@ffmpeg/util` (for client-side video conversion), and `jszip` (for packaging).

**3) Weird Mechanics:**
- Uses `@tailwindcss/postcss` and `tailwindcss` v4.
- Includes `@ffmpeg/ffmpeg` and `@ffmpeg/util`, enabling the client-side conversion pipeline (WebM -> MP4).

**4) Shared Variables/Functions:**
- **Scripts:** `npm run dev`, `npm run build` are the primary entry points for developers.

### `tsconfig.json`
**1) What it does:**
Configures the TypeScript compiler options for the project.

**2) How it does it:**
- **Target:** `ES2017`.
- **Paths:** Sets up path alias `@/*` mapping to `./src/*`.
- **Plugins:** parameters for the Next.js TypeScript plugin.
- **Includes:** `**/*.ts`, `**/*.tsx`, `.next/types/**/*.ts` etc.

**3) Weird Mechanics:**
- `skipLibCheck`: true (standard for Next.js to avoid type errors in node_modules).
- `noEmit`: true (Next.js handles the build/emit process).

**4) Shared Variables/Functions:**
- **Path Alias:** `@/` is used throughout the project to import from `src`.

### `next.config.mjs`
**1) What it does:**
Configures Next.js build and runtime behavior.

**2) How it does it:**
- **Rewrites:** Proxies requests for `.png`, `.jpg` in root (specifically particle/weather effects) and `/sprites/trainers/*` to `https://play.pokemonshowdown.com`.
- **Build Config:** explicitly disables `typescript` and `eslint` checks during production builds (`ignoreBuildErrors: true`). This ensures deployment on Vercel succeeds even with minor strict-mode type violations.

**3) Weird Mechanics:**
- **Phase 2 Note:** Contains commented-out `headers` configuration for `Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy` (COOP/COEP). These are typically required for `SharedArrayBuffer` used by FFmpeg wasm, but they are currently disabled ("Temporarily disabled for Phase 2").
- **Proxying:** Instead of hosting assets locally, it proxies specific asset paths to Pokemon Showdown's servers.

**4) Shared Variables/Functions:**
- None directly exposed, but affects how assets are loaded via URL rewrites.

### `eslint.config.mjs`
**1) What it does:**
Configures ESLint for code linting.

**2) How it does it:**
Uses the new "flat config" format (`eslint.config.mjs` instead of `.eslintrc`).
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.
- Ignores `.next`, `out`, `build`.

**3) Weird Mechanics:**
- None, relatively standard flat config setup for Next.js 15+.

**4) Shared Variables/Functions:**
- None.

### `next.config.ts`
**1) What it does:**
An alternative/redundant configuration file for Next.js.

**2) How it does it:**
Exports an empty `nextConfig` object type-checked with TypeScript.

**3) Weird Mechanics:**
- **Duplicate Config:** The project has both `next.config.mjs` (which contains the actual rewrites) and `next.config.ts` (which is empty). Next.js typically prioritizes one, likely `mjs` or warns. This is likely an artifact of initialization or migration.

**4) Shared Variables/Functions:**
- None.

### `postcss.config.mjs`
**1) What it does:**
Configures PostCSS for Tailwind CSS processing.

**2) How it does it:**
- Uses `@tailwindcss/postcss` plugin.

**3) Weird Mechanics:**
- **Tailwind v4:** This confirms the project is using Tailwind CSS v4 alpha/beta structure where tailwind is a PostCSS plugin rather than having a separate `tailwind.config.js`.

**4) Shared Variables/Functions:**
- None.

### `next-env.d.ts`
**1) What it does:**
TypeScript declaration file for Next.js types.

**2) How it does it:**
- References `next` and `next/image-types/global`.

**3) Weird Mechanics:**
- Auto-generated by Next.js. Should not be edited.

**4) Shared Variables/Functions:**
- None.

---

## App Directory (`src/app`)

### `src/app/layout.tsx`
**1) What it does:**
Defines the root layout of the application, including fonts (Geist) and global styles.

**2) How it does it:**
- **Fonts:** Imports Google Fonts `Geist` and `Geist_Mono` and injects them as CSS variables.
- **Metadata:** Sets basic metadata "Create Next App" (seems default/unset).
- **Structure:** Wraps `{children}` in `<html>` and `<body>` tags with `antialiased` class.

**3) Weird Mechanics:**
- `suppressHydrationWarning`: Added to the `<body>` tag. This is often used when hydration mismatches are expected (e.g., from browser extensions or specific dynamic content), though it silences potential real issues.

**4) Shared Variables/Functions:**
- **RootLayout:** The default export used by Next.js for wrapping all pages.

### `src/app/page.tsx`
**1) What it does:**
The main entry point of the VGC Arena Cinema application. It orchestrates the UI, state, and layout for watching replays.

**2) How it does it:**
- **State:** Manages `replay` state (the parsed replay data).
- **Hooks:** Uses `useReplayController` to get the `controller` object.
- **Components:**
    - If no replay is loaded: Shows `FileDropzone`.
    - If replay is loaded: Shows the "Twin Engine" view (Battle + Chat) and `ReplayControls`.
- **Layout:**
    - Split screen: Left (BattleViewer, 66%) and Right (BattleViewer in Chat Mode, 33%).
    - "Twin Engine" concept: Two instances of `BattleViewer` running the same replay data but in different modes.

**3) Weird Mechanics:**
- **Twin Engine:** It renders TWO `BattleViewer` components (which are iframes) for the *same* content. One is configured for `mode="BATTLE"` and one for `mode="CHAT"`. This is a unique approach to separate the battle visuals from the chat log while keeping them synchronized (since they share the same underlying replay HTML/data logic).
- **Hardcoded Styles:** heavily relies on Tailwind utility classes for layout (e.g., `flex-grow basis-2/3`).
- **Global Overlay:** Renders a full-screen "ENCODING VIDEO" overlay when `recorder.isFinishing` is true, blocking user interaction during critical file operations.

**4) Shared Variables/Functions:**
- **Props:** Passes `ReplayData` and `ReplayController` to child components.

### `src/app/globals.css`
**1) What it does:**
Global CSS styles.

**2) How it does it:**
- Imports `tailwindcss`.
- Sets default body background to `#020617` (slate-950) and color to `slate-200`.

**3) Weird Mechanics:**
- Minimalist. Relies almost entirely on Tailwind.

**4) Shared Variables/Functions:**
- None.

---

## Components (`src/components`)

### `src/components/AppInfo.tsx` (NEW)
**1) What it does:**
Renders the "User Manual" at the bottom of the page.
**2) How it does it:**
- **Structure:** Split into "Premium Viewer Experience" (Features) and "Studio Recorder" (Instructions).
- **Content:** Explains critical constraints like "Do Not Switch Tabs" and "Hide Mouse Cursor".
- **Visuals:** Uses card-based layout with Lucide icons.

### `src/components/BattleViewer.tsx`
**1) What it does:**
A wrapper component that renders the Pokémon Showdown replay format inside an `<iframe>`.

**2) How it does it:**
- **Input:** Receives `data` (ReplayData) and `mode` ('BATTLE' or 'CHAT').
- **Processing:** Uses `createCinemaHtml` to generate the HTML content for the iframe. This injects the custom "Enforcer" script.
- **Rendering:** Renders an `<iframe>` with `srcDoc={htmlContent}`.
- **Loading State:** Shows a loading spinner ("BOOTING BATTLE...") until the controller reports `isReady`.

**3) Weird Mechanics:**
- **srcDoc Injection:** Instead of loading a URL, it injects the *entire* modified HTML (which can be large) directly into the `srcDoc` attribute. Bypasses some CORS issues but relies on `allow-same-origin` in sandbox.
- **Sandbox:** `allow-scripts allow-same-origin allow-popups allow-forms allow-presentation`. This is a very permissive sandbox, necessary for the Showdown engine to run.

**4) Shared Variables/Functions:**
- Expert default component.

### `src/components/FileDropzone.tsx` (UPDATED)
**1) What it does:**
Provides a drag-and-drop OR click-to-upload interface for `.html` replay files.

**2) How it does it:**
- **Event Handling:** Listens for `onDrop` event.
- **Validation:** Checks for `file.type === 'text/html'` or extension `.html`.
- **Processing:** Reads file via `FileReader` and calls `parseReplayHtml` from lib.
- **Callback:** Calls `onReplayLoaded` with the parsed data.
- **Native Impl:** Uses native HTML5 Drag & Drop API and a hidden `<input type="file">` element for clicking. Removed `react-dropzone` dependency for lighter footprint.

**3) Weird Mechanics:**
- Basic HTML5 Drag & Drop API usage.

**4) Shared Variables/Functions:**
- None.

### `src/components/ReplayControls.tsx`
**1) What it does:**
Provides the UI buttons (Play, Pause, Reset, Step Back/Fwd, Switch Sides) to control the replay.

**2) How it does it:**
- **Display:** Renders buttons with Lucide icons.
- **Interaction:** Calls methods on the `controller` prop (e.g., `controller.play()`).
- **Feedback:** Shows connection status "ENGINE CONNECTED" based on `controller.isBattleReady`.
- **Debug:** Includes a hidden/toggleable debug log console (`showLog` state).

**3) Weird Mechanics:**
- **Group/Btn Hover:** Uses `group-hover/btn:-rotate-180` for a specific animation on the Reset button icon.

**4) Shared Variables/Functions:**
- None.

### `src/components/RecorderControls.tsx` (UPDATED)
**1) What it does:**
Provides the UI for the "Dual Recorder" feature (Phase 3). Checks for recording status, encoding state, and allows the user to Start/Stop the capture.

**2) How it does it:**
- **States:**
    - **Idle:** Shows "START RECORDING" (Optimal 25FPS).
    - **Recording:** Shows "STOP (Time)".
    - **Finishing/Encoding:** Shows "ENCODING... (WAIT)" in Orange. This is a critical state where interaction is blocked.
- **Feedback:** Uses pulse animations to indicate active recording.

**3) Weird Mechanics:**
- **Blocking UI:** During the `isFinishing` state, the UI explicitly blocks interaction to prevent the user from closing the tab while the heavy "Flush to Disk" operation is happening.

**4) Shared Variables/Functions:**
- Props: `onStart`, `onStop`, `isRecording`, `isFinishing`.

---

## Hooks (`src/hooks`)

### `src/hooks/useVideoConverter.ts` (NEW)
**1) What it does:**
Manages the FFmpeg WASM instance for client-side video conversion (WebM -> MP4).

**2) How it does it:**
- **Lazy Loading:** Loads `@ffmpeg/core` from CDN (`unpkg.com`) only when needed.
- **Core Logic:** `convertToMp4(blob, filename)`:
    - Writes the WebM Blob to FFmpeg's virtual filesystem (MEMFS).
    - Runs `ffmpeg -i input.webm -c copy output.mp4`. This is a **Remux** operation (changing container), which is extremely fast and preserves original quality without re-encoding.
    - Reads the MP4 file back into a Blob.
- **Survivor Logic:** Handles false-positive `Aborted()` errors (common in FFmpeg WASM) by checking if the output file exists anyway.
- **Cleanup:** Rigorously deletes files from MEMFS to prevent memory leaks.

### `src/hooks/useRecordingGuard.ts`
**1) What it does:**
Prevents the playback/recording from being interrupted by system events (screen sleep, tab switching, navigation).

**2) How it does it:**
- **Wake Lock:** Requests `navigator.wakeLock.request('screen')` to keep the screen on.
- **Navigation Guard:** Listens to `beforeunload` to warn the user if they try to close the tab while playing.
- **Visibility Auto-Pause:** Listens to `document.hidden`. If the tab goes background, it calls `onAutoPause()`. This is because browsers throttle background tabs, which desyncs the replay engine.

**3) Weird Mechanics:**
- **Background Throttling Defense:** Explicitly pauses the replay if the tab is hidden to avoid "desync" or "frame skip" issues common in JS-based animations in background tabs.

**4) Shared Variables/Functions:**
- Exported hook `useRecordingGuard`.

### `src/hooks/useReplayController.ts`
**1) What it does:**
The central nervous system for controlling the iframe "twin engines". It manages the communication *to* and *from* the iframes.

**2) How it does it:**
- **State:** Tracks `isBattleReady`, `isChatReady`, `isPlaying`.
- **Broadcasting:** `broadcast(cmd)` function iterates over ALL `<iframe>` elements in the document and sends `postMessage(cmd, '*')`. This allows it to control both the Battle view and Chat view simultaneously with one command.
- **Listening:** Listens to `window.message` events for:
    - `ENGINE_READY`: The iframe signaled it's alive.
    - `ACK`: The iframe confirmed a command.
    - `LOG`/`ERROR`: Debug info from the iframe.

**3) Weird Mechanics:**
- **Blind Broadcast:** It grabs *all* iframes (`document.getElementsByTagName('iframe')`). If the app grew to have other iframes (e.g. ads, embeds), this would send control commands to them too.
- **Logs:** Keeps an internal log history (last 20 entries) for the debug console.

**4) Shared Variables/Functions:**
- `useReplayController`: The hook consumed by `page.tsx`.
- `CinemaCommand`: Type definition for the cross-window protocol.

### `src/hooks/useDualRecorder.ts` (UPDATED)
**1) What it does:**
The Core Engine of Phase 3. It captures the screen, intelligently crops it into two separate video feeds ("Battle" and "Chat"), encodes them simultaneously, and zips them for download.

**2) How it does it:**
- **Capture:** uses `getDisplayMedia` to capture the current tab. Matches constraints `cursor: "never"` to hide mouse.
- **Twin Canvas System:** created two offscreen canvases.
    - **Battle Canvas:** Crops the left 2/3rds of the screen.
    - **Chat Canvas:** Crops the right 1/3rd.
- **The "Render Loop" (Optimized):**
    - **Throttling:** Uses a Delta-Time check to lock rendering to **24 FPS** (Cinema Standard). This massive optimization prevents Main Thread Starvation.
    - **Resolution Cap:** If the source is 4K (2160p), it automatically downscales the canvas to 1080p height. This prevents "Encoder Crash" on consumer hardware.
    - **Ref-Based Logic:** Uses `stateRef` instead of React State for the inner loop to avoid closure staleness (fixing the 0-byte video bug).
- **Encoding:**
    - **Codec:** Prioritizes **H.264** (`video/webm;codecs=h264`) for Hardware Acceleration. Falls back to VP9/VP8.
    - **Bitrate:** 8 Mbps (High Quality 1080p).
    - **Audio:** DISABLED to save CPU cycles.
- **Finalization (The Promise Gate):**
    - When stopping, it triggers `recorder.requestData()` to force a flexible buffer flush.
    - Wraps the `onstop` events of both recorders in a `Promise.all()`. This ensures we wait for the browser to confirm "File Written" before generating the ZIP.
    - **Clean Stop:** Freezes the render loop *before* updating React state to "Encoding", ensuring the overlay doesn't appear in the video.
    - **Conversion:** Calls `useVideoConverter` to remux WebM -> MP4 sequentially.
    - **Zipping:** Packages files as `Player1_vs_Player2_Date.zip`.

**3) Weird Mechanics:**
- **"Retina" Calculation:** It calculates `video.videoWidth / window.innerWidth` to map DOM Client Rects (CSS pixels) to actual Video Source Pixels.
- **Bitwise Floor:** Uses `val & ~1` to ensure all Canvas dimensions are **Even Numbers**, as many video encoders crash with odd-pixel dimensions.

**4) Shared Variables/Functions:**
- Returns `startRecording`, `stopRecording`, status flags.

---

## Lib (`src/lib`)

### `src/lib/replayParser.ts`
**1) What it does:**
Parses the uploaded HTML replay file and generates the modified "Cinema" HTML with injected control scripts.

**2) How it does it:**
- **Parsing (`parseReplayHtml`):**
    - Regex searches for `<script type="text/plain" class="battle-log-data">`. This contains the raw protocol log of the battle.
    - Extracts player names from the log.
- **Injection (`createCinemaHtml`):**
    - Takes the original HTML.
    - Injects a massive `<script>...Enforcer Script...</script>` block before `</body>`.

**3) Weird Mechanics:**
- **The "Enforcer" Script:** This is the heart of the "Cinema" logic. It runs *inside* the iframe context.
    - **jQuery Injection:** [REMOVED] Previously injected jQuery, but it caused version conflicts (`ce.easing` crash). Now relies on native/existing scripts.
    - **Global Debug Hooks (`window.__CINEMA_DEBUG`):** Exposes internal engine state (`turn`, `paused`, `ended`) and logs to the parent window for the Twin Engine Controls panel.
    - **Freeze Watchdog:** A background interval that monitors the turn number. If the turn doesn't change for >5s while playing, it sends a "Freeze Detected" warning to the parent.
    - **Anti-Freeze Protocols:**
        - **Visibility Override:** Overwrites `document.hidden` and `visibilityState` to trick the engine into thinking the tab is always active (preventing browser throttling).
        - **Smart Mute (Audio Manager):** Instead of a hard "Nuke", it now selectively mutes the *Chat* engine (via `BattleSound.setMute(true)`) while allowing the *Battle* engine to play audio. This prevents the "Double Soundtrack" issue while preserving native playback controls.
    - **CSS Override:** Injects `<style>` blocks to hide UI elements based on mode (`BATTLE` hides log/controls, `CHAT` hides battle canvas).
        - **Custom Background:** Forces the `.battle` element to use `bg-forest.jpg` with `background-size: cover`.
        - **Chat Optimization:** Chat Log contrast is enforced via global CSS injection (`background: #111`) rather than DOM iteration.
    - **The Geometry Engine (`resizeBattle`):**
        - **Centering:** Uses absolute/fixed centering.
        - **Aspect-Fill Scaling:** Calculates scale based on `Math.min(widthScale, heightScale)` to ensure the battle fits completely within the view (Contain). Max scale increased to 5x.
    - **The Loop:** A `setInterval` loop (200ms) that primarily ensures the Engine Handshake occurs.
    - **DOM Automation:** The script *programmatically clicks DOM buttons* (e.g. `tryDomClick(['button[name="play"]'])`) if the API method fails.

**4) Shared Variables/Functions:**
- `parseReplayHtml`: Helper to extract data.
- `createCinemaHtml`: Core logic for generating the interactive view.