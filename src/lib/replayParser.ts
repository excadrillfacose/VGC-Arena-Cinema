export interface ReplayData {
    log: string[];
    p1: string;
    p2: string;
    originalHtml: string;
}

export type CinemaMode = 'BATTLE' | 'CHAT';

export function parseReplayHtml(htmlContent: string): ReplayData {
    const logRegex = /<script type="text\/plain" class="battle-log-data">([\s\S]*?)<\/script>/;
    const match = htmlContent.match(logRegex);

    if (!match || !match[1]) {
        throw new Error("Could not find battle-log-data in HTML file.");
    }

    const rawLog = match[1];
    const lines = rawLog.split('\n');

    let p1 = 'Player 1';
    let p2 = 'Player 2';

    for (const line of lines) {
        if (line.startsWith('|player|p1|')) {
            const parts = line.split('|');
            // Format: |player|p1|Name|Avatar|
            if (parts[3]) p1 = parts[3].trim();
        }
        if (line.startsWith('|player|p2|')) {
            const parts = line.split('|');
            if (parts[3]) p2 = parts[3].trim();
        }
    }

    return {
        log: lines,
        p1,
        p2,
        originalHtml: htmlContent,
    };
}

export function createCinemaHtml(originalHtml: string, mode: CinemaMode): string {
    // THE ENFORCER LOOP INJECTION (Fixed Scaling, Positioning, & Safety)
    const activationScript = `
    <script>
      try {
          (function() {
            const MODE = "${mode}";
            console.log("!!! ENFORCER SCRIPT ACTIVE !!! mode:", MODE);
            
            // 0. PRE-FLIGHT: No jQuery Injection (User reported crash due to conflicts)
            // if (!window.jQuery) { ... } REMOVED
            
            // ANTI-FREEZE 1: Visibility Override (Prevent Background Throttling)
            try {
                Object.defineProperty(document, 'hidden', { get: () => false });
                Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
            } catch (e) { }

            // ANTI-FREEZE 2: Audio Nuke REMOVED (Replaced by Smart Mute in Enforcer Loop)
            // We need the Audio Engine intact for the Battle window to play music.
            // window.BattleSound = nullSound; -> REMOVED
            
            // --- DEBUG & TELEMETRY INJECTION (User Request) ---
            window.__CINEMA_DEBUG = {
                getBattle: () => getBattleController(),
                status: () => {
                    const b = getBattleController();
                    if (!b) return "No Battle Engine Found";
                    return {
                        turn: b.turn,
                        paused: b.paused,
                        ended: b.ended,
                        messageLog: window.__CINEMA_DEBUG.logs
                    };
                },
                logs: [],
                forceResize: () => resizeBattle(),
                nukeAudio: () => {
                    try {
                        window.BattleSound = nullSound;
                        window.Sound = nullSound;
                        if (window.battle) window.battle.sound = nullSound;
                        console.log("[DEBUG] Audio Nuked Manually");
                    } catch(e) { console.error(e); }
                }
            };

            // Watchdog Loop (Freeze Detector)
            let lastTurn = -1;
            let lastTurnTime = Date.now();
            let freezeWarned = false;

            setInterval(() => {
                const b = getBattleController();
                if (b && !b.paused && !b.ended) {
                    if (b.turn === lastTurn) {
                        const delta = Date.now() - lastTurnTime;
                        if (delta > 5000 && !freezeWarned) {
                            console.warn("[CINEMA] Freeze Detected? Turn stuck for 5s");
                            window.parent.postMessage({ type: 'LOG', msg: 'WARNING: Turn Stuck > 5s' }, '*');
                            freezeWarned = true;
                        }
                    } else {
                        lastTurn = b.turn;
                        lastTurnTime = Date.now();
                        freezeWarned = false;
                    }
                }
            }, 1000);
            
            // Visibility Logger
            document.addEventListener("visibilitychange", () => {
                 window.parent.postMessage({ type: 'LOG', msg: \`Visibility Changed: \${document.visibilityState}\` }, '*');
            });
            // --------------------------------------------------

            let handshakeSent = false;

            // 1. BASE CSS
            const bgOptions = [
                '/bg-forest.jpg',
                '/bg-darkmeadow.jpg',
                '/bg-leaderwallace.jpg',
                '/bg-meadow.jpg'
            ];
            const randomBg = bgOptions[Math.floor(Math.random() * bgOptions.length)];
            console.log("[CINEMA] Selected BG:", randomBg);

            const style = document.createElement('style');
            style.innerHTML = \`
              html, body { 
                  margin: 0; padding: 0; overflow: hidden; 
                  background: transparent !important; 
                  width: 100%; height: 100%; 
              }
              .battle { 
                  z-index: 100 !important; 
                  display: block !important;
                  opacity: 1 !important;
                  background: url('\${randomBg}') no-repeat center center !important; 
                  background-size: cover !important;
              }
              canvas { 
                  display: block !important; 
                  visibility: visible !important; 
                  opacity: 1 !important;
              }
              /* In BATTLE mode, we MUST hide the log via CSS to prevent twitching. */
              /* In CHAT mode, we leave it alone as requested. */
              
              /* CHAT CONTRAST (Global) */
              .battle-log { background: #111 !important; }
              .battle-log * { color: #eee !important; border-color: #333 !important; }

              ${mode === 'BATTLE' ? `
                /* STATIC HIDING (Anti-Crash: Visibility vs Display) */
                .battle-log { display: none !important; } 
                
                /* Graphics that must exist but be invisible (Prevent Crashes) */
                .backdrop, .roomlist, .header, .ps-room-opaque,
                .broadcast-blue, .broadcast-red, .message-bar { 
                    visibility: hidden !important; 
                    opacity: 0 !important;
                    pointer-events: none !important;
                    position: absolute !important;
                    width: 0 !important; height: 0 !important;
                    z-index: -1000 !important;
                }
                .broadcast-blue *, .broadcast-red *, .message-bar * {
                    visibility: hidden !important;
                }

                /* Controls can be display: none (No engine impact) */
                .debug, .replay-controls, .battle-controls, .battle-options, 
                button[name="parse"], .controls, .select, 
                p.speed, p.music, p.color-scheme, 
                .tooltip, #tooltipwrapper, div[role="contentinfo"] { 
                    display: none !important; 
                }
                
                /* Visual Polish */
                .leftbar, .rightbar { background: #000 !important; border: none !important; } 
                .battle { 
                    background: url('\${randomBg}') no-repeat center center !important; 
                    background-size: cover !important;
                }
                
              ` : ''}
            \`;
            document.head.appendChild(style);

            // 2. THE ENFORCER LOOP (Runs every 200ms)
            setInterval(() => {
                try {
                    // A. THE NUKE (Reduced Scope - Text Scan Only)
                    // Class-based hiding is now handled by CSS to prevent twitching.
                    
                    // Legacy cleanup just in case (but rely on CSS)
                    

                    // Hide Battle Log in Battle Mode, but keep in DOM for engine
                    if (MODE === 'BATTLE') {
                        const log = document.querySelector('.battle-log');
                        if (log && log.style.display !== 'none') {
                             log.style.setProperty('display', 'none', 'important');
                        }
                    }
                    
                    // Hide Battle in Chat Mode, but keep in DOM
                    if (MODE === 'CHAT') {
                         const battle = document.querySelector('.battle');
                         if (battle) battle.style.setProperty('display', 'none', 'important');
                         
                         const logEl = document.querySelector('.battle-log');
                         if (logEl) {
                             logEl.style.display = 'block';
                             logEl.style.position = 'absolute';
                             logEl.style.top = '0';
                             logEl.style.left = '0';
                             logEl.style.width = '100vw';
                             logEl.style.height = '100vh';
                             logEl.style.background = '#111'; 
                             logEl.style.color = '#fff';
                             logEl.style.overflowY = 'scroll';
                             logEl.style.zIndex = '1000';
                             

                             
                             if (logEl.parentElement === null) document.body.appendChild(logEl);
                         }
                    }

                    // B. THE SCALER (Battle Mode) - Handled by resizeBattle() (Event + 2s Interval) to prevent lag.

                    // D. AUDIO MANAGER (Solution 3: Global CPU Save)
                    // We force MUTE on the internal Showdown Engine to prevent it from decoding audio logic.
                    // This saves significant Main Thread resources.
                    try {
                        if (window.BattleSound && typeof window.BattleSound.setMute === 'function') {
                            // Ensure it stays muted
                            if (!window.BattleSound.muted) {
                                window.BattleSound.setMute(true);
                                console.log("[CINEMA] Engine Globally Muted for Performance");
                            }
                        }
                    } catch (err) { }

                    // C. THE HANDSHAKE
                    if (!handshakeSent) {
                        const battleObj = window.battle || window.Battle || window.app?.battle;
                        if (battleObj) {
                            console.log("[CINEMA] Engine Found & Ready");
                            window.parent.postMessage({ type: 'ENGINE_READY', mode: MODE }, '*');
                            handshakeSent = true;
                            
                            // DEBUG: Status Logger (1s interval)
                            setInterval(() => {
                                try {
                                    if (window.battle) {
                                        console.log('[CINEMA:' + MODE + '] Turn: ' + window.battle.turn + ' | Paused: ' + window.battle.paused);
                                    }
                                } catch(e) {}
                            }, 1000);
                        }
                    }

                } catch (e) {
                     // Supress errors in loop
                }
            }, 200);

            // HELPER: Robust Finder (Unified)
            function getBattleController() {
                // Candidates to check
                const candidates = [
                    window.battle,
                    window.app?.room?.battle,
                    window.app?.battle,
                    window.replay,
                    window.Battle // Be careful, might be class
                ];

                for (const c of candidates) {
                    if (c && typeof c.play === 'function') {
                        return c;
                    }
                }
                 return null;
            }

            // 2. GEOMETRY ENGINE (Stabilized & Aggressive)
            let resizeTimeout;
            function resizeBattle() {
                 if (MODE !== 'BATTLE') return;
                 const battleEl = document.querySelector('.battle');
                 if (battleEl) {
                     // 1. Force container to full size
                     document.body.style.margin = '0';
                     document.body.style.padding = '0';
                     document.body.style.width = '100vw';
                     document.body.style.height = '100vh';
                     document.body.style.overflow = 'hidden';
                     document.body.style.background = 'black';

                     // 2. Absolute Center
                     battleEl.style.position = 'fixed';
                     battleEl.style.top = '50%';
                     battleEl.style.left = '50%';
                     battleEl.style.margin = '0';

                     // 3. Calculate Scale (Maximize Width)
                     // Showdown native is ~1180x700.
                     const targetW = 640;
                     const containerW = window.innerWidth;
                     
                     // We prioritize Width fit.
                     let scale = containerW / targetW;
                     
                     // Safety Cap
                     if (scale > 2) scale = 2; 

                     // 4. Transform
                     battleEl.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
                     battleEl.style.transformOrigin = 'center center';
                     
                     // 5. Hide Backgrounds (The Backdrop)
                     // 5. Hide Backgrounds (The Backdrop) safely
                     const backdrop = document.querySelector('.backdrop');
                     if (backdrop) {
                         backdrop.style.visibility = 'hidden';
                         backdrop.style.opacity = '0';
                         backdrop.style.pointerEvents = 'none';
                     }

                     // Ensure visible
                     battleEl.style.display = 'block'; 
                     battleEl.style.opacity = '1';
                 }
            }
            
            // Debounce Resize
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(resizeBattle, 100);
            });
            window.addEventListener('load', resizeBattle);
            setTimeout(resizeBattle, 500);
            setTimeout(resizeBattle, 1500); 
            setInterval(resizeBattle, 2000); // Periodic forced resize to keep it alive

            // 3. THE POLLING LOOP
            function checkReady() {
                const battleObj = getBattleController();
                if (battleObj) {
                    if (!handshakeSent) {
                        try {
                            const foundType = battleObj.constructor ? battleObj.constructor.name : 'Unknown';
                            console.log("[CINEMA] Engine Found:", foundType);
                            window.parent.postMessage({ type: 'ENGINE_READY', mode: MODE }, '*');
                            handshakeSent = true;
                            // startNuker(); // LEGACY: REMOVED (Handled by Top-Level Enforcer Loop)
                            resizeBattle();
                        } catch(e) {}
                    }
                    return;
                }
                requestAnimationFrame(checkReady);
            }
            requestAnimationFrame(checkReady);

            // 4. THE DOM NUKER (LEGACY - REMOVED)
            // Functionality moved to Top-Level Enforcer Loop + CSS to prevent twitching.
            

            // 5. CONTROL ENGINE
            window.addEventListener('message', (event) => {
               const cmd = event.data;
               let battleObj = getBattleController();

               const tryDomClick = (selectorList) => {
                   for (const sel of selectorList) {
                       const btn = document.querySelector(sel);
                       if (btn) {
                           btn.click();
                           return true;
                       }
                   }
                   return false;
               };

               try {
                   // SWITCH SIDES
                   if (cmd.type === 'SWITCH_SIDES') {
                       if (battleObj && battleObj.switchSides) {
                           battleObj.switchSides();
                           window.parent.postMessage({ type: 'ACK', cmd: 'SWITCH_SIDES' }, '*');
                       } else if (tryDomClick(['button[name="switchSides"]', 'button[data-action="switchSides"]'])) {
                           window.parent.postMessage({ type: 'ACK', cmd: 'SWITCH_SIDES (DOM)' }, '*');
                       } else {
                           // Try finding ANY button with "Switch sides" text?
                           let found = false;
                           const buttons = document.querySelectorAll('button');
                           buttons.forEach(b => {
                               if (b.innerText.includes('Switch sides')) {
                                   b.click();
                                   found = true;
                               }
                           });
                           if (found) {
                               window.parent.postMessage({ type: 'ACK', cmd: 'SWITCH_SIDES (TextScan)' }, '*');
                           } else {
                               window.parent.postMessage({ type: 'LOG', msg: 'SwitchSides Missing' }, '*');
                           }
                       }
                   }

                   if (cmd.type === 'PLAY') {
                       if (battleObj && battleObj.play) {
                           battleObj.play();
                           window.parent.postMessage({ type: 'ACK', cmd: 'PLAY' }, '*');
                       } else if (tryDomClick(['button[name="play"]', 'button[data-action="play"]'])) {
                           window.parent.postMessage({ type: 'ACK', cmd: 'PLAY (DOM)' }, '*');
                       }
                   }
                   if (cmd.type === 'PAUSE') {
                       if (battleObj && battleObj.pause) {
                           battleObj.pause();
                           window.parent.postMessage({ type: 'ACK', cmd: 'PAUSE' }, '*');
                       } else if (tryDomClick(['button[name="pause"]', 'button[data-action="pause"]'])) {
                           window.parent.postMessage({ type: 'ACK', cmd: 'PAUSE (DOM)' }, '*');
                       }
                   }
                   if (cmd.type === 'RESET') {
                       if (battleObj && battleObj.reset) {
                           battleObj.reset();
                           if(battleObj.pause) battleObj.pause();
                           window.parent.postMessage({ type: 'ACK', cmd: 'RESET' }, '*');
                       } else if (tryDomClick(['button[name="reset"]', 'button[data-action="reset"]'])) {
                           window.parent.postMessage({ type: 'ACK', cmd: 'RESET (DOM)' }, '*');
                       }
                   }
                   // BETTER SKIP SELECTORS
                   if (cmd.type === 'STEP_BACK') {
                       if (battleObj && battleObj.seekTurn) {
                            const current = battleObj.turn || 0;
                            const target = Math.max(0, current - 1);
                            battleObj.seekTurn(target);
                            window.parent.postMessage({ type: 'ACK', cmd: 'STEP_BACK', turn: target }, '*');
                       } else if (tryDomClick(['button[name="rewindTurn"]', 'button[aria-label="Previous Turn"]', '.fa-step-backward'])) { 
                            window.parent.postMessage({ type: 'ACK', cmd: 'STEP_BACK (DOM)' }, '*');
                       }
                   }
                   if (cmd.type === 'STEP_FWD') {
                       if (battleObj && battleObj.seekTurn) {
                            const current = battleObj.turn || 0;
                            battleObj.seekTurn(current + 1);
                            window.parent.postMessage({ type: 'ACK', cmd: 'STEP_FWD', turn: current + 1 }, '*');
                       } else if (tryDomClick(['button[name="fastForwardTurn"]', 'button[aria-label="Next Turn"]', '.fa-step-forward'])) { 
                            window.parent.postMessage({ type: 'ACK', cmd: 'STEP_FWD (DOM)' }, '*');
                       }
                   }
               } catch(e) {
                   window.parent.postMessage({ type: 'ERROR', msg: e.toString() }, '*');
               }
            }, false);

          })();
      } catch (err) {
          console.error("!!! INJECTION CRASHED !!!", err);
      }
    </script>
  `;

    if (originalHtml.includes('</body>')) {
        return originalHtml.replace('</body>', `${activationScript}</body>`);
    } else if (originalHtml.includes('</html>')) {
        return originalHtml.replace('</html>', `${activationScript}</html>`);
    } else {
        return originalHtml + activationScript;
    }
}
