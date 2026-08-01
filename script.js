// ⏳ GLOBAL OPERATING SYSTEM INITIALIZATION DATA STRUCTURES
let activeRunningApps = {};
let topZIndexCounter = 100;
let dragElementTarget = null;
let offX = 0, offY = 0;
let explorerPreMaximizeBounds = { top: '', left: '', width: '', height: '' };

// mock placeholder sound engine tool to prevent script failure checks
function playSound(type) {
    console.log(`[Audio Event Triggered]: ${type}`);
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // ✨ FIX: If the browser suspended the audio, wake it up immediately
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    switch (type) {
        case 'click':
            const clickOsc = ctx.createOscillator();
            clickOsc.type = 'sine';
            clickOsc.frequency.setValueAtTime(800, ctx.currentTime);
            clickOsc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.04);
            
            gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            
            clickOsc.connect(gainNode);
            clickOsc.start();
            clickOsc.stop(ctx.currentTime + 0.05);
            break;

        case 'clear':
            [440, 554].forEach((freq, index) => {
                const osc = ctx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + (index * 0.03));
                
                gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                
                osc.connect(gainNode);
                osc.start(ctx.currentTime + (index * 0.03));
                osc.stop(ctx.currentTime + 0.15);
            });
            break;

        case 'startup':
            const now = ctx.currentTime;
            const chords = [261.63, 329.63, 392.00, 523.25];
            
            chords.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                
                const lfo = ctx.createOscillator();
                const lfoGain = ctx.createGain();
                lfo.frequency.value = 5;
                lfoGain.gain.value = 2;
                lfo.connect(lfoGain);
                lfoGain.connect(osc.frequency);
                
                gainNode.gain.setValueAtTime(0, now);
                gainNode.gain.linearRampToValueAtTime(0.04, now + 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
                
                osc.connect(gainNode);
                lfo.start(now);
                osc.start(now);
                lfo.stop(now + 1.2);
                osc.stop(now + 1.2);
            });
            break;
    }
}

const bootScreen = document.getElementById('boot-screen');
const authLayer = document.getElementById('system-auth-layer');

// Step 1: Initialize BIOS Loader Sequences
setTimeout(() => {
    if (bootScreen) bootScreen.style.opacity = '0';
    if (authLayer) authLayer.classList.remove('hidden-auth');
    
    setTimeout(() => {
        if (bootScreen) bootScreen.style.visibility = 'hidden';
    }, 800);
}, 2500);

// Step 2: Kick off Core Interface Chronometer
updateSystemClocks();
setInterval(updateSystemClocks, 1000);

// Step 3: Global System Authentication Workspace Interceptors
document.addEventListener('keydown', (e) => {
    const lockScreen = document.getElementById('lock-screen');
    if (lockScreen && !lockScreen.classList.contains('screen-hidden')) {
        liftLockScreen();
    }
});

const lockScreenEl = document.getElementById('lock-screen');
if (lockScreenEl) {
    lockScreenEl.addEventListener('click', () => {
        liftLockScreen();
    });
}

// ⏱️ HIGH FREQUENCY HARDWARE SYNC ENGINES
function updateSystemClocks() {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    
    const digitalClock = document.getElementById('digital-clock');
    if (digitalClock) digitalClock.innerText = timeString;
    
    const lockTimeEl = document.getElementById('lock-time');
    if (lockTimeEl) lockTimeEl.innerText = timeString;

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const lockDateEl = document.getElementById('lock-date');
    if (lockDateEl) lockDateEl.innerText = now.toLocaleDateString('en-US', options);

    // Clock App Synchronizers
    const appClockDisp = document.getElementById('app-clock-display');
    if (appClockDisp) {
        appClockDisp.innerText = `${hours}:${minutes}:${seconds}`;
        document.getElementById('app-clock-date').innerText = now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    }
}

// 🔒 SECURITY GATE AND SESSION CONTROLLERS
function liftLockScreen() {
    const lockScreen = document.getElementById('lock-screen');
    const loginScreen = document.getElementById('login-screen');
    
    if (lockScreen && loginScreen) {
        lockScreen.style.transform = 'translateY(-100%)';
        lockScreen.style.opacity = '0';
        
        setTimeout(() => {
            lockScreen.classList.add('screen-hidden');
            loginScreen.classList.remove('screen-hidden');
            const inputField = document.getElementById('user-pass-input');
            if (inputField) inputField.focus();
        }, 400);
    }
}

function handleLoginKeyPress(event) {
    if (event.key === 'Enter') authenticateUser();
}

function authenticateUser() {
    const authLayer = document.getElementById('system-auth-layer');
    playSound('startup'); 
    
    if (authLayer) {
        authLayer.style.opacity = '0';
        authLayer.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            authLayer.classList.add('hidden-auth');
        }, 600);
    }
}

// 🎛️ UNIVERSAL WORKSPACE DRAG MANAGER ARCHITECTURE
function focusAppWindow(windowId) {
    topZIndexCounter++;
    const targetWin = document.getElementById(windowId);
    if(targetWin) targetWin.style.zIndex = topZIndexCounter;
}

// ============================================================================
// 🪐 SOMA 2.0 ADVANCED GPU-ACCELERATED TRANSFORMATION ENGINE
// ============================================================================

let somaDragMatrix = {
    targetElement: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false
};

/**
 * 🛰️ Universal Hardware Intercept Hook
 * Use exactly as before: onmousedown="dragStart(event, 'app-calendar')"
 */
function dragStart(e, windowId) {
    // Elevate layer context focus stack instantly
    if (typeof focusAppWindow === 'function') {
        focusAppWindow(windowId);
    }

    const targetWin = document.getElementById(windowId);
    if (!targetWin) return;

    somaDragMatrix.targetElement = targetWin;
    somaDragMatrix.isDragging = true;

    // Fetch existing position translation coordinates from memory properties if they exist
    const storedX = parseFloat(targetWin.getAttribute('data-soma-x')) || 0;
    const storedY = parseFloat(targetWin.getAttribute('data-soma-y')) || 0;

    // Calibrate start tracking baselines
    somaDragMatrix.startX = e.clientX - storedX;
    somaDragMatrix.startY = e.clientY - storedY;

    // Suppress hardware highlight text selections completely during tracking phase
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // Establish dynamic event tracking loops directly on global document scope
    document.addEventListener('mousemove', dragPerform, { passive: true });
    document.addEventListener('mouseup', dragEnd);
}

/**
 * 🏎️ Ultra-Smooth GPU Compositor Delta Translation
 */
function dragPerform(e) {
    if (!somaDragMatrix.isDragging || !somaDragMatrix.targetElement) return;

    // Calculate precision vector movement
    somaDragMatrix.currentX = e.clientX - somaDragMatrix.startX;
    somaDragMatrix.currentY = e.clientY - somaDragMatrix.startY;

    // Store attributes onto the DOM node as a fast persistent state cache
    somaDragMatrix.targetElement.setAttribute('data-soma-x', somaDragMatrix.currentX);
    somaDragMatrix.targetElement.setAttribute('data-soma-y', somaDragMatrix.currentY);

    // Force hardware execution layer via translate3d
    requestAnimationFrame(() => {
        if (somaDragMatrix.isDragging && somaDragMatrix.targetElement) {
            somaDragMatrix.targetElement.style.transform = 
                `translate3d(${somaDragMatrix.currentX}px, ${somaDragMatrix.currentY}px, 0px)`;
        }
    });
}

/**
 * 🛑 Structural Vector Disconnect Route
 */
function dragEnd() {
    if (!somaDragMatrix.isDragging) return;

    somaDragMatrix.isDragging = false;
    somaDragMatrix.targetElement = null;

    // Restore text and selection parameters seamlessly
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';

    document.removeEventListener('mousemove', dragPerform);
    document.removeEventListener('mouseup', dragEnd);
}

// 📝 INDEPENDENT FLOATING APP ARCHITECTURE MANAGEMENT LOGIC
function openApp(windowId) {
    const winEl = document.getElementById(windowId);
    if (!winEl) return;
    winEl.classList.remove('hidden');
    winEl.classList.remove('minimized');
    winEl.classList.remove('maximized');
    focusAppWindow(windowId);
    playSound('click');
    
    activeRunningApps[windowId] = winEl.querySelector('.window-header span:nth-child(2)').innerText;
    renderTaskbarTrays();
}

function closeApp(windowId) {
    const winEl = document.getElementById(windowId);
    if (!winEl) return;
    playSound('click');
    winEl.classList.add('hidden');
    delete activeRunningApps[windowId];
    
    renderTaskbarTrays();
}

function minimizeApp(windowId) {
    const winEl = document.getElementById(windowId);
    if (!winEl) return;
    playSound('click');
    winEl.classList.add('minimized');
    renderTaskbarTrays();
}

function maximizeApp(windowId){
    const winEl = document.getElementById(windowId);
    if (!winEl) return;
    playSound('click');
    if (winEl.classList.contains('maximized')) {
    winEl.classList.remove('maximized');
    }
    else{
       winEl.classList.add('maximized');  
    }
    renderTaskbarTrays();
}

function restoreApp(windowId) {
    const winEl = document.getElementById(windowId);
    if (!winEl) return;
    playSound('clear');
    winEl.classList.remove('minimized');
    focusAppWindow(windowId);
    renderTaskbarTrays();
}

function restoreItem(index) {
    const bin = somaFileSystem['recycle-bin'];
    const item = bin.items.splice(index, 1)[0];
    
    // Logic: Restore to 'my-space/home'
    somaFileSystem['my-space/home'].items.push(item);
    commitFileSystem();
    openWindow('recycle-bin'); // Refresh view
}

function permanentDelete(index) {
    const bin = somaFileSystem['recycle-bin'];
    bin.items.splice(index, 1); // Permanently remove from array
    commitFileSystem();
    openWindow('recycle-bin'); // Refresh view
}

const SYSTEM_PATHS = {
    RECYCLE_BIN: 'recycle-bin',
    ROOT: 'root'
};


// ============================================================================
// 📁 EXTENDED FILESYSTEM MATRIX ENGINE TRACKER WITH LOCALSTORAGE PERSISTENCE
// ============================================================================
let currentActiveDirectoryKey = 'my-space'; 
let activeNotepadFileRef = null; // Tracks the name of the file open in Notepad

let somaFileSystem = JSON.parse(localStorage.getItem('soma_vfs')) || {
    'my-space': {
        title: 'My Space',
        items: [
            { icon: '📁', name: 'Documents', type: 'folder', target: 'my-space/documents', meta: 'User written records' },
            { icon: '🖼️', name: 'Pictures', type: 'folder', target: 'my-space/pictures', meta: 'Photos and wallpapers' },
            { icon: '🎵', name: 'Music', type: 'folder', target: 'my-space/music', meta: 'Audio recordings and tracks' },
            { icon: '🎬', name: 'Videos', type: 'folder', target: 'my-space/videos', meta: 'Saved video files' }
        ]
    },
    'my-space/documents': {
        title: 'Documents',
        items: [
            { icon: '📝', name: 'Soma Architecture.txt', type: 'file', content: 'Soma OS Framework has uncoupled individual applications natively from file navigation trees successfully.', meta: 'Plain Text' }
        ]
    },
    'my-space/pictures': {
        title: 'Pictures',
        items: [
            { icon: '🖼️', name: 'Soma Nebula.jpg', type: 'image', content: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800', meta: 'JPEG Image Workspace File' }
        ]
    },
    'my-space/music': {
        title: 'Music',
        items: [
            { icon: '🎵', name: 'Ambient Chill.mp3', type: 'audio', content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', meta: 'MPEG Layer-3 Audio Track' }
        ]
    },
    'my-space/videos': {
        title: 'Videos',
        items: [
            { icon: '🎬', name: 'Cosmic Wormhole.mp4', type: 'video', content: 'https://vjs.zencdn.net/v/oceans.mp4', meta: 'MPEG-4 Digital Cinema Stream' }
        ]
    },
    'computer': {
    title: 'Computer Disk Root',
    items: [
        { icon: '💽', name: 'System Partition C:', type: 'folder', target: 'my-space', meta: 'Active OS System Drive' },
        { icon: '⚙️', name: 'System Core & Notes', type: 'folder', target: 'computer/system-files', meta: 'OS Configuration & Dev Notes' }
    ]
},
'computer/system-files': {
    title: 'System Core & Notes',
    items: [
        { 
            icon: '📝', 
            name: 'soma_version_log.txt', 
            type: 'file', 
            content: 'Soma OS v2.1 (Build 2026)\n\nDeveloper Notes:\n- Added GPU-accelerated drawing canvas.\n- Updated glassmorphic UI components.\n- System state: Clean & Stable.', 
            meta: 'Release Notes' 
        },
        { 
            icon: '🎵', 
            name: 'audio_setup_guide.txt', 
            type: 'file', 
            content: 'Web Audio Engine Settings:\n- Output: Web Audio API Synthesizer\n- Default Volume: 80%\n- Status: Active\n\nIf sound stops working, restart the browser audio context.', 
            meta: 'User Configuration' 
        },
        { 
            icon: '💡', 
            name: 'about_soma_os.txt', 
            type: 'file', 
            content: 'Welcome to Soma OS 2.1!\n\nDesigned to be a simple, fast, and calm web desktop environment. Focus on your work without complex toolbars or clutter.', 
            meta: 'System Info' 
        }
    ]
},
    'recycle-bin': { title: 'Recycle Bin', items: [] }
};

// Helper function to save file modifications safely
function commitFileSystem() {
    localStorage.setItem('soma_vfs', JSON.stringify(somaFileSystem));
}


/**
 * 🪟 REWRITTEN OPEN WINDOW CONTROLLER (WITH MULTI-MEDIA ROUTING SUPPORT)
 */
function openWindow(spaceKey) {
    currentActiveDirectoryKey = spaceKey; 
    playSound('click');
    
    const windowEl = document.getElementById('system-window');
    if (!windowEl) return;
    windowEl.classList.remove('hidden');
    windowEl.classList.remove('minimized-state');
    
    const activeData = somaFileSystem[spaceKey];
    if (!activeData) return;

    document.getElementById('window-title').innerText = activeData.title;
    document.getElementById('window-breadcrumbs').innerText = `Root → ${activeData.title.replace('Disk Root', 'Computer')}`;
    
    const gridEl = document.getElementById('explorer-grid');
    gridEl.innerHTML = '';

    if (activeData.items.length === 0) {
        gridEl.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted); font-size:0.9rem;">✨ This directory workspace folder is empty.</div>`;
    }

    activeData.items.forEach((item, index) => {
        // ✨ FIXED: Check item format descriptor type instead of defaulting blindly to launchAppTextContent
        let action = item.type === 'folder' 
            ? `openWindow('${item.target}')` 
            : `handleFileDoubleClick('${item.name}')`;

        gridEl.insertAdjacentHTML('beforeend', `
            <div class="file-card" data-name="${item.name}" data-index="${index}" onclick="${action}">
                <div class="card-icon">${item.icon}</div>
                <div class="card-name">${item.name}</div>
                <div class="card-meta">${item.meta || 'System Data Document'}</div>
            </div>
        `);
    });

    document.querySelectorAll('.explorer-sidebar .sidebar-item').forEach(el => el.classList.remove('active'));
    if (spaceKey === 'my-space') document.getElementById('sb-my-space')?.classList.add('active');
    if (spaceKey === 'computer' || spaceKey === 'computer/disk-d') document.getElementById('sb-computer')?.classList.add('active');
    if (spaceKey === 'recycle-bin') document.getElementById('sb-recycle-bin')?.classList.add('active');

    activeRunningApps['system-window'] = `Files: ${activeData.title}`;
    renderTaskbarTrays();
}

/**
 * SMART FILE AND MEDIA TYPE ALLOCATOR
 */
function guiCreateNewElement(type) {
    const elementName = prompt(`Enter new ${type} name:`, `New ${type === 'folder' ? 'Folder' : 'Document'}`);
    if (!elementName || !elementName.trim()) return;

    const sanitizedName = elementName.trim();

    if (type === 'folder') {
        const targetPathKey = `${currentActiveDirectoryKey}/${sanitizedName.toLowerCase().replace(/\s+/g, '-')}`;
        
        somaFileSystem[currentActiveDirectoryKey].items.push({
            icon: '📁',
            name: sanitizedName,
            type: 'folder',
            target: targetPathKey,
            meta: 'User Workspace Folder'
        });

        somaFileSystem[targetPathKey] = {
            title: sanitizedName,
            items: []
        };
    } 
    else {
        // ✨ FIXED: Look for specific extension rules inside string bounds
        let finalName = sanitizedName;
        let fileType = 'file';
        let iconMarker = '📝';
        let metaLabel = 'Plain Text Document';
        let contentPayload = `This text content was generated inside the new file named: ${sanitizedName}`;

        if (sanitizedName.endsWith('.jpg') || sanitizedName.endsWith('.png') || sanitizedName.endsWith('.jpeg')) {
            fileType = 'image';
            iconMarker = '🖼️';
            metaLabel = 'System Image Workspace File';
            // Ask for an alternative web image target url or provide an epic space default stream path
            const imgUrl = prompt("Enter Image URL link stream path:", "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800");
            contentPayload = imgUrl ? imgUrl.trim() : "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800";
        } 
        else if (sanitizedName.endsWith('.mp3') || sanitizedName.endsWith('.wav')) {
            fileType = 'audio';
            iconMarker = '🎵';
            metaLabel = 'MPEG Layer-3 Audio Track';
            const audioUrl = prompt("Enter Audio URL link track stream path:", "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3");
            contentPayload = audioUrl ? audioUrl.trim() : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";
        } 
        else if (sanitizedName.endsWith('.mp4')) {
            fileType = 'video';
            iconMarker = '🎬';
            metaLabel = 'MPEG-4 Digital Cinema Stream';
            const videoUrl = prompt("Enter Video URL link cinema stream path:", "https://vjs.zencdn.net/v/oceans.mp4");
            contentPayload = videoUrl ? videoUrl.trim() : "https://vjs.zencdn.net/v/oceans.mp4";
        } 
        else {
            if (!finalName.endsWith('.txt')) finalName = `${finalName}.txt`;
        }

        somaFileSystem[currentActiveDirectoryKey].items.push({
            icon: iconMarker,
            name: finalName,
            type: fileType,
            content: contentPayload,
            meta: metaLabel
        });
    }

    commitFileSystem();
    openWindow(currentActiveDirectoryKey);
}


// ==========================================
// 📝 NOTEPAD CONTROLLERS WITH STORAGE CONFIRMATIONS
// ==========================================
function launchAppTextContent(fileName) {
    activeNotepadFileRef = fileName; 
    openApp('app-notepad');
    
    const notepadHeader = document.querySelector('#app-notepad .window-header span:nth-child(2)');
    if (notepadHeader) notepadHeader.innerText = `Notepad - ${fileName}`;

    const notepadTextBox = document.querySelector('#app-notepad textarea');
    if (notepadTextBox) {
        const activeItems = somaFileSystem[currentActiveDirectoryKey]?.items || [];
        const currentFile = activeItems.find(i => i.name === fileName);
        notepadTextBox.value = currentFile ? currentFile.content : '';
    }
}

function updateNotepadMetrics() {
    const notepadTextBox = document.getElementById('notepad-text-editor');
    const charCounter = document.getElementById('notepad-char-count');
    const statusLabel = document.getElementById('notepad-file-status');

    if (notepadTextBox && charCounter) {
        const chars = notepadTextBox.value.length;
        const words = notepadTextBox.value.trim() ? notepadTextBox.value.trim().split(/\s+/).length : 0;
        charCounter.innerText = `${chars} chars | ${words} words`;
    }

    if (statusLabel) {
        statusLabel.innerText = activeNotepadFileRef ? `File: ${activeNotepadFileRef}` : 'Unsaved Draft';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const notepadTextBox = document.getElementById('notepad-text-editor');
    if (notepadTextBox) {
        notepadTextBox.addEventListener('input', updateNotepadMetrics);
    }
});
// ============================================================================
// 🔀 MULTI-APP INTELLIGENT FILE ROUTER
// ============================================================================
function handleFileDoubleClick(fileName) {
    const activeItems = somaFileSystem[currentActiveDirectoryKey]?.items || [];
    const targetFile = activeItems.find(item => item.name === fileName);
    
    if (!targetFile) return;

    switch (targetFile.type) {
        case 'file':
            activeNotepadFileRef = fileName;
            openApp('app-notepad');
            const notepadHeader = document.querySelector('#app-notepad .window-header .header-title');
            if (notepadHeader) notepadHeader.innerHTML = `Notepad - ${fileName}`;
            const notepadTextBox = document.querySelector('#app-notepad textarea');
            if (notepadTextBox) notepadTextBox.value = targetFile.content || '';
            break;

      case 'image':
    // 1. Initialize and bring the Photos application into the foreground workspace
    openApp('app-pictures');
    
    // 2. Dynamically update the window header title based on the opened file name
    const picHeader = document.querySelector('#app-pictures .window-header #window-title') || 
                      document.querySelector('#app-pictures .window-header .header-title');
    if (picHeader) {
        picHeader.innerText = `Photos - ${fileName}`; // Shows: Photos - sunset.png
    }
    
    // 3. Select workspace view nodes
    const picViewerDisplay = document.getElementById('pic-viewer-render-target');
    const photoGalleryGrid = document.getElementById('photo-gallery-grid');
    const photoToolbarMatrix = document.getElementById('photo-toolbar-matrix');
    
    if (picViewerDisplay) {
        // Reset transformation tracking parameters
        photoScaleFactor = 1.0;
        photoRotationDegrees = 0;
        picViewerDisplay.style.transform = "scale(1) rotate(0deg)";
        
        // Hide the default Recent Photos Grid
        if (photoGalleryGrid) {
            photoGalleryGrid.style.display = 'none';
        }
        
        // Load the file content
        picViewerDisplay.src = targetFile.content;
        picViewerDisplay.style.display = 'block';
        
        // Slide up the dynamic editor controls bar
        if (photoToolbarMatrix) {
            photoToolbarMatrix.style.display = 'flex';
        }
    }
    
    break;

        case 'audio':
            openApp('app-music');
            const audioHeader = document.querySelector('#app-music .window-header .header-title');
            if (audioHeader) audioHeader.innerHTML = `Music Player - ${fileName}`;
            
            const trackLabel = document.getElementById('audio-track-title');
            if (trackLabel) trackLabel.textContent = fileName;
            
            const audioPlayer = document.getElementById('audio-player-render-target');
            if (audioPlayer) {
                audioPlayer.src = targetFile.content;
                audioPlayer.play().catch(e => console.log("Playback error:", e));
            }
            break; // Fixed: Closed audio case here

        case 'video': // Fixed: Now it's a top-level case
            openApp('app-video');
            const videoHeader = document.querySelector('#app-video .window-header .header-title');
            if (videoHeader) videoHeader.innerHTML = `Soma Cinema - ${fileName}`;
            
            const targetVideoNode = document.getElementById('video-player-render-target');
            const targetStatusMsg = document.getElementById('video-status-msg');
            
            if (targetVideoNode) {
                targetVideoNode.src = targetFile.content;
                targetVideoNode.style.display = 'block';
                if (targetStatusMsg) targetStatusMsg.style.display = 'none';
                
                if (typeof attachVideoProgressTracker === 'function') {
                    attachVideoProgressTracker(targetVideoNode);
                }
                
                // Logic: If already playing, stop first, then play new file
                targetVideoNode.play().catch(e => console.log("Video playback error:", e));
            }
            break; // Fixed: Closed video case
            
        default:
            console.log("Unknown file type:", targetFile.type);
            break;
    }
}

/**
 * ✕ CLICK INTERCEPTOR: Asks to save changes inside localStorage or discards
 */
function closeNotepadWithSaveCheck() {
    const notepadTextBox = document.querySelector('#app-notepad textarea');
    const updatedContent = notepadTextBox ? notepadTextBox.value : '';

    if (activeNotepadFileRef) {
        const activeItems = somaFileSystem[currentActiveDirectoryKey]?.items || [];
        const currentFile = activeItems.find(i => i.name === activeNotepadFileRef);

        if (currentFile && currentFile.content !== updatedContent) {
            const saveConfirm = confirm(`Do you want to save changes to "${activeNotepadFileRef}" before closing?`);
            if (saveConfirm) {
                currentFile.content = updatedContent;
                commitFileSystem();
                openWindow(currentActiveDirectoryKey);
            }
        }
    }
    
    activeNotepadFileRef = null;
    closeApp('app-notepad');
}

// FIXED FUNCTION MAPPING: This now processes individual document logs into the external Notepad frame

function minimizeFileExplorerWindow() {
    const windowEl = document.getElementById('system-window');
    windowEl.classList.add('minimized-state');
    minimizeApp('system-window');
    playSound('click');
    renderTaskbarTrays();
}


function restoreFileExplorerFromTray() {
    const windowEl = document.getElementById('system-window');
    windowEl.classList.remove('minimized-state');
    restoreApp('system-window');
    playSound('click');
    renderTaskbarTrays();
}

function closeFileExplorerWindow() {
    document.getElementById('system-window').classList.add('hidden');
    document.getElementById('system-window').classList.remove('minimized-state');
    delete activeRunningApps['system-window'];
    renderTaskbarTrays();
    closeApp('system-window');
    playSound('clear');
}

function maximizeFileExplorerWindow() {
    const windowEl = document.getElementById('system-window');
    playSound('click');
    if (!windowEl) return;

    if (windowEl.classList.contains('maximized')) {
        windowEl.classList.remove('maximized');
        windowEl.style.top = explorerPreMaximizeBounds.top;
        windowEl.style.left = explorerPreMaximizeBounds.left;
        windowEl.style.width = explorerPreMaximizeBounds.width;
        windowEl.style.height = explorerPreMaximizeBounds.height;
    } else {
        explorerPreMaximizeBounds.top = windowEl.style.top;
        explorerPreMaximizeBounds.left = windowEl.style.left;
        explorerPreMaximizeBounds.width = windowEl.style.width;
        explorerPreMaximizeBounds.height = windowEl.style.height;
        
        windowEl.style.top = '';
        windowEl.style.left = '';
        windowEl.style.width = '';
        windowEl.style.height = '';
        windowEl.classList.add('maximized');
    }
}



// 🎛️ CROSS SYSTEM MULTITASKING APPMANAGER TRAY RENDERING ENGINE
function renderTaskbarTrays() {
    const container = document.getElementById('taskbar-apps');
    container.innerHTML = '';
    
    // Explicit dictionary mapping application window IDs to unique visual icons
    const appIconMap = {
        'system-window': '📂',
        'app-notepad': '📝',
        'app-terminal': '🕊️',
        'app-calculator': '🧮',
        'app-clock': '⏱️',
        'app-music': '🎵',
        'app-video': '🎬',
        'app-game': '🕹️',
        'app-calendar' : '📅',
        'app-pictures' : '🖼️',
        'app-camera' : '📸',
        'app-paint'  : '🎨'
    };
    
    Object.keys(activeRunningApps).forEach(id => {
        const winEl = document.getElementById(id);
        if (!winEl) return;
        
        const isMin = winEl.classList.contains('minimized') || winEl.classList.contains('minimized-state');
        
        // Fallback to generic gear icon if an unrecognized app ID gets created
        const appIcon = appIconMap[id] || '⚙️';
        
        // Replaced structural label text layout entirely with clean visual icon pills
        container.insertAdjacentHTML('beforeend', `
            <div class="app-pill ${isMin ? 'pill-is-minimized' : ''}" 
                 onclick="toggleWindowFromTray('${id}')" 
                 title="${activeRunningApps[id]}">
                <span class="pill-icon">${appIcon}</span>
            </div>
        `);
    });
}

function loadPhotoIntoViewer(src) {
    const img = document.getElementById('pic-viewer-render-target');
    const msg = document.getElementById('photo-status-msg');
    
    img.src = src;
    img.style.display = 'block'; // Show the image
    msg.style.display = 'none';  // Hide the attraction message
}

function toggleWindowFromTray(windowId) {
    const winEl = document.getElementById(windowId);
    if (!winEl) return;

    // Standardized window visibility state inspector bounds checks
    const isCurrentlyMin = winEl.classList.contains('minimized');

    if (isCurrentlyMin) {
        restoreApp(windowId);
    } else {
        minimizeApp(windowId);
    }
}


// 🧮 CALCULATOR DRIVER ENGINE UTILITIES
let calcCurrentValue = '0';
function calcInput(char) {
    if (calcCurrentValue === '0' && char !== '.') calcCurrentValue = '';
    calcCurrentValue += char;
    document.getElementById('calc-screen').value = calcCurrentValue;
}
function calcClear() {
    calcCurrentValue = '0';
    document.getElementById('calc-screen').value = '0';
}
function calcEvaluate() {
    try {
        calcCurrentValue = eval(calcCurrentValue).toString();
    } catch {
        calcCurrentValue = 'Error';
    }
    document.getElementById('calc-screen').value = calcCurrentValue;
}

// 🕊️ CORE HRIYADA INTERACTIVE TERMINAL EMULATION
// Virtual runtime memory mapping parameters tracking
let openVfsDirectories = ["documents", "downloads", "desktop", "system32"];

/**
 * 💡 Real-time input listener updating interactive guide hints
 */
function updateTerminalSuggestions(currentValue) {
    const suggBox = document.getElementById('term-suggestions');
    const query = currentValue.trim().toLowerCase();

    if (!query) {
        suggBox.innerHTML = "💡 Tip: Start typing a parameter like 'disk', 'mem', 'create', or 'npm' to see human guide shortcuts...";
        return;
    }

    if (query.startsWith('crea') || query.startsWith('mkdir') || query.startsWith('fold')) {
        suggBox.innerHTML = "📝 <b>Human Command Guide:</b> Type <code>create folder [name]</code> to provision directories in your current environment path.";
    } 
    else if (query.startsWith('me') || query.startsWith('ram')) {
        // Compute active RAM allocation usage values
        let visibleWindows = document.querySelectorAll('.window:not(.hidden)').length;
        let activeRamUsage = 4112 + (visibleWindows * 512);
        let usagePercentage = Math.round((activeRamUsage / 16384) * 100);

        if (usagePercentage >= 80) {
            suggBox.innerHTML = `⚠️ <b>SYSTEM CRITICAL WARNING:</b> RAM usage is at <b>${usagePercentage}%</b>! Close background panels to prevent application pipeline termination down-cycles.`;
        } else {
            suggBox.innerHTML = `🧠 <b>Memory Matrix Tip:</b> Type <code>mem</code> to inspect volatile execution stacks. (Current Footprint: ${usagePercentage}% loaded).`;
        }
    } 
    else if (query.startsWith('dis') || query.startsWith('part')) {
        suggBox.innerHTML = "💽 <b>Storage Utility Guide:</b> Type <code>disk</code> to examine mounts, or <code>disk-create</code> to allocate unallocated sectors into Local Disk D.";
    } 
    else if (query.startsWith('fil') || query.startsWith('ls') || query.startsWith('dir')) {
        suggBox.innerHTML = "📂 <b>VFS Directory Trees Explorer:</b> Type <code>files</code> to reveal all folder indices inside mapped mounting points.";
    } 
    else if (query.startsWith('npm') || query.startsWith('hrid')) {
        suggBox.innerHTML = "📦 <b>NPM Interface Matrix:</b> Type <code>npm install hridaya-os</code> to bind core cross-thread operating dependencies into active project builds.";
    } 
    else {
        suggBox.innerHTML = "🎯 Press <code>Enter</code> to push execution codes directly to the active Soma Kernel module registers.";
    }
}

/**
 * Updated Terminal Commands processing routing tree core
 */
/**
 * 💡 Real-time input listener updating interactive guide hints using Hridaya CLI Format
 */
function updateTerminalSuggestions(currentValue) {
    const suggBox = document.getElementById('term-suggestions');
    if (!suggBox) return;
    const query = currentValue.trim().toLowerCase();

    if (!query) {
        suggBox.innerHTML = "💡 <b>Soma Core:</b> Type a manual command rule or use <code>help</code> to inspect schema schematics...";
        return;
    }

    if (query.startsWith('crea') || query.startsWith('mk')) {
        suggBox.innerHTML = "📝 <b>VFS Provisioner:</b> Type <code>create folder [name]</code> or <code>create file [name.ext]</code>";
    } else if (query.startsWith('del') || query.startsWith('rm')) {
        suggBox.innerHTML = "🗑️ <b>Destructive Clean:</b> Type <code>delete folder [name]</code> or <code>delete file [name.ext]</code>";
    } else if (query.startsWith('ren') || query.startsWith('mv')) {
        suggBox.innerHTML = "✏️ <b>Cluster Mod:</b> Type <code>rename folder [old] to [new]</code> or <code>rename file [old.ext] to [new.ext]</code>";
    } else if (query.startsWith('read') || query.startsWith('cat')) {
        suggBox.innerHTML = "📖 <b>Buffer Reader:</b> Type <code>read file [name.txt]</code> to print text sequences.";
    } else if (query.startsWith('writ')) {
        suggBox.innerHTML = "✍️ <b>Buffer Writer:</b> Type <code>write [text] to [name.txt]</code> to commit records.";
    } else if (query.startsWith('bulk')) {
        suggBox.innerHTML = "📦 <b>Bulk Stack:</b> Type <code>bulk create</code> to provision work, study, and games segments.";
    } else if (query.startsWith('cop')) {
        suggBox.innerHTML = "📋 <b>Replication:</b> Type <code>copy file [src.txt] to [dest.txt]</code> or <code>copy folder [src] to [dest]</code>";
    } else if (query.startsWith('mov')) {
        suggBox.innerHTML = "🚚 <b>Relocation:</b> Type <code>move file [src.txt] to [folder/src.txt]</code>";
    } else if (query.startsWith('aut') || query.startsWith('arr') || query.startsWith('sor')) {
        suggBox.innerHTML = "🧹 <b>Auto-Arrange:</b> Type <code>arrange my files</code> or <code>auto sort files</code> to organize types.";
    } else if (query.startsWith('dis') || query.startsWith('part')) {
        suggBox.innerHTML = "💽 <b>Storage Controller:</b> Type <code>disk-create</code> or <code>disk-delete</code> to map sectors.";
    } else {
        suggBox.innerHTML = "🎯 Press <code>Enter</code> to push operations directly to the active Soma Kernel.";
    }
}

function handleTerminalCommand(e) {
    if (e.key !== 'Enter') return;
    
    const inputEl = e.target;
    const rawInput = inputEl.value.trim();
    const out = document.getElementById('term-out');
    
    if (!rawInput) return;

    const args = rawInput.split(' ');
    const cmd = args[0].toLowerCase();
    
    let res = `\nCommand '${cmd}' unrecognized. Type 'help' to review configuration schema guidelines.`;
    const activeDirectory = somaFileSystem[currentActiveDirectoryKey];

    

    // ==========================================
    // 📖 HELP ROUTING SYSTEM
    // ==========================================
    if (cmd === 'help') {
        res = `\n=== SOMA OS 1.3/1.4 HRIDAYA CLI OPERATOR SCHEMATICS ===
 📁 create folder [name]       -> Provision new workspace node
 📄 create file [name.ext]     -> Write an asset document string
 🗑️ delete folder [name]       -> Strip target directory entry
 🗑️ delete file [name.ext]     -> Erase targeted text track index
 ✏️ rename folder [old] to [new]-> Morph directory descriptor metadata
 ✏️ rename file [old] to [new] -> Change target document layout name
 👁️ files / show me everything -> List directory cluster elements
 📖 read file [name.txt]       -> Print volatile file sequence strings
 ✍️ write [text] to [name.txt] -> Force overwrite context values
 📦 bulk create                -> Batch allocate 'work', 'study', and 'games'
 📋 copy file/folder [S] to [D]-> Replicate structural asset clusters
 🚚 move file/folder [S] to [D]-> Reallocate paths into foreign workspaces
 🧹 arrange my files / auto sort files -> Group entries by media definitions
 💽 disk / disk-create / disk-delete  -> Drive cluster array provisioning
 🧹 clear                      -> Flush visual console stream logs`;
    } 
    // ==========================================
    // 🧹 CLEAR TERMINAL VIEWSTREAM
    // ==========================================
    else if (cmd === 'clear') { 
        out.innerText = ''; 
        inputEl.value = ''; 
        updateTerminalSuggestions('');
        return; 
    } 
    // ==========================================
    // 👁️ LIST FILES & DISCOVERY PIPELINES
    // ==========================================
    else if (cmd === 'files' || cmd === 'ls' || cmd === 'dir' || rawInput.toLowerCase() === 'show me everything') {
        res = `\n=== INDEX PATH DIRECTORY: (${activeDirectory.title}) ===`;
        if (!activeDirectory.items || activeDirectory.items.length === 0) {
            res += `\n  (Target cluster workspace is completely empty)`;
        } else {
            activeDirectory.items.forEach(item => {
                res += `\n  ${item.icon}  [${item.type.toUpperCase()}]  ${item.name} (${item.meta || 'System Resource'})`;
            });
        }
    }
    // ==========================================
    // 📁 📄 ITEM PROVISIONING DRIVERS (CREATE)
    // ==========================================
    else if (cmd === 'create' || cmd === 'mkdir') {
        const subType = args[1] ? args[1].toLowerCase() : '';
        const nameParam = args.slice(2).join(' ');

        if (!nameParam) {
            res = `\nAllocation Error: Undefined name modifier array target parameters.`;
        } else if (subType === 'folder') {
            const targetPath = `${currentActiveDirectoryKey}/${nameParam.toLowerCase().replace(/\s+/g, '-')}`;
            activeDirectory.items.push({
                icon: '📁', name: nameParam, type: 'folder', target: targetPath, meta: 'File Folder'
            });
            somaFileSystem[targetPath] = { title: nameParam, items: [] };
            commitFileSystem();
            res = `\n📁 Success: Allocated folder workspace entry '${nameParam}'.`;
        } else if (subType === 'file') {
            const finalTxtName = nameParam.includes('.') ? nameParam : `${nameParam}.txt`;
            activeDirectory.items.push({
                icon: '📝', name: finalTxtName, type: 'file', content: `Initialized via Hridaya CLI parameters on ${new Date().toLocaleDateString()}`, meta: 'Plain Text'
            });
            commitFileSystem();
            res = `\n📄 Success: Allocated file sector map entry '${finalTxtName}'.`;
        }
    }
    // ==========================================
    // 🗑️ DESTRUCTIVE SCRUB OPERATORS (DELETE)
    // ==========================================
   // ==========================================
// 🗑️ DESTRUCTIVE SCRUB OPERATORS (DELETE / MOVE TO BIN)
// ==========================================
// Replace your existing DELETE block with this hardened version
else if (cmd === 'delete' || cmd === 'rm') {
    const isForce = args.includes('-f');
    // Get the name by removing 'delete', 'rm', and '-f'
    const nameParam = args.filter(a => a !== 'delete' && a !== 'rm' && a !== '-f').join(' ');
    
    const targetIndex = activeDirectory.items.findIndex(i => i.name.toLowerCase() === nameParam.toLowerCase());

    if (targetIndex === -1) {
        res = `\nSearch Error: Target entity '${nameParam}' not found.`;
    } else {
        const removedItem = activeDirectory.items.splice(targetIndex, 1)[0];

        if (isForce) {
            // PERMANENT WIPE: Do not push to bin, just kill it
            res = `\n💥 PERMANENT DELETE: Scoured ${removedItem.type} '${nameParam}' from registers.`;
        } else {
            // MOVE TO BIN
            const binKey = 'recycle-bin'; // Ensure this matches exactly
            if (somaFileSystem[binKey]) {
                somaFileSystem[binKey].items.push(removedItem);
                res = `\n🗑️ RECYCLE BIN: Relocated '${nameParam}'.`;
            }
        }
        commitFileSystem();
    }
}
    // ==========================================
    // ✏️ METADATA MUTATION ENGINES (RENAME)
    // ==========================================
    else if (cmd === 'rename') {
        const subType = args[1] ? args[1].toLowerCase() : '';
        const remainingStr = args.slice(2).join(' ');
        const cleanParts = remainingStr.split(/\s+to\s+/i);

        if (cleanParts.length < 2) {
            res = `\nSyntax Error: Expected schema template configuration sequence 'rename [type] [old] to [new]'`;
        } else {
            const oldName = cleanParts[0].trim();
            const newName = cleanParts[1].trim();
            const item = activeDirectory.items.find(i => i.name.toLowerCase() === oldName.toLowerCase());

            if (!item) {
                res = `\nSearch Error: File/Folder resource entry tracking token '${oldName}' is missing.`;
            } else {
                item.name = newName;
                if (subType === 'folder' && somaFileSystem[item.target]) {
                    somaFileSystem[item.target].title = newName;
                }
                commitFileSystem();
                res = `\n✏️ Success: Remapped configuration descriptor key '${oldName}' into context record values '${newName}'.`;
            }
        }
    }
    // ==========================================
    // 📖 STREAM CONTENT ACCESSORS (READ FILE)
    // ==========================================
    else if (cmd === 'read') {
        const nameParam = args[1] === 'file' ? args.slice(2).join(' ') : args.slice(1).join(' ');
        const item = activeDirectory.items.find(i => i.name.toLowerCase() === nameParam.toLowerCase() && i.type === 'file');

        if (!item) {
            res = `\nRead Error: Target document context stack tracking map reference '${nameParam}' missing or unreadable.`;
        } else {
            res = `\n=== READ TRANSLATION BUFFER OUTPUT [${item.name}] ===\n${item.content || '(File has no internal buffer tracks)'}`;
        }
    }
    // ==========================================
    // ✍️ MATRIX CONTENT WRITERS (WRITE TO FILE)
    // ==========================================
    else if (cmd === 'write') {
        const rawStr = args.slice(1).join(' ');
        const matchPattern = rawStr.match(/(.*)\s+to\s+(.*)/i);

        if (!matchPattern) {
            res = `\nSyntax Error: Correct usage parameters state: 'write [Text Strings] to [TargetFile.txt]'`;
        } else {
            const textContent = matchPattern[1].trim();
            const filename = matchPattern[2].trim();
            const item = activeDirectory.items.find(i => i.name.toLowerCase() === filename.toLowerCase() && i.type === 'file');

            if (!item) {
                res = `\nBuffer Write Failure: Mapped index token targets match definitions missing for file name '${filename}'.`;
            } else {
                item.content = textContent;
                commitFileSystem();
                res = `\n✍️ Success: Flushed update string contents directly onto target disk space indices allocation blocks.`;
            }
        }
    }
    // ==========================================
    // 📦 MASSIVE PIPELINE OPERATIONS (BULK CREATE)
    // ==========================================
    else if (cmd === 'bulk' && args[1]?.toLowerCase() === 'create') {
        const batchAllocations = ['work', 'study', 'games'];
        batchAllocations.forEach(name => {
            if (!activeDirectory.items.some(i => i.name.toLowerCase() === name)) {
                const newPath = `${currentActiveDirectoryKey}/${name}`;
                activeDirectory.items.push({ icon: '📁', name: name, type: 'folder', target: newPath, meta: 'Bulk Generated Folder' });
                somaFileSystem[newPath] = { title: name, items: [] };
            }
        });
        commitFileSystem();
        res = `\n📦 Bulk Success: Bulk provisioned clusters ['work', 'study', 'games'] safely within active space pathways.`;
    }
    // ==========================================
    // 📋 CLUSTER REPLICATION SYSTEMS (COPY)
    // ==========================================
    else if (cmd === 'copy') {
        const type = args[1]?.toLowerCase();
        const rem = args.slice(2).join(' ').split(/\s+to\s+/i);
        
        if (rem.length < 2) {
            res = `\nSyntax Error: Parameters format template error. Specify: 'copy [file/folder] [src] to [dest]'`;
        } else {
            const src = rem[0].trim();
            const dest = rem[1].trim();
            const sourceItem = activeDirectory.items.find(i => i.name.toLowerCase() === src.toLowerCase());

            if (!sourceItem) {
                res = `\nReplication Failure: Source identifier '${src}' not resolved.`;
            } else {
                // Perform copy clone parsing operations natively
                const duplicateItem = JSON.parse(JSON.stringify(sourceItem));
                duplicateItem.name = dest;
                if (type === 'folder') {
                    duplicateItem.target = `${currentActiveDirectoryKey}/${dest.toLowerCase().replace(/\s+/g, '-')}`;
                    somaFileSystem[duplicateItem.target] = { title: dest, items: [] };
                }
                activeDirectory.items.push(duplicateItem);
                commitFileSystem();
                res = `\n📋 Copy Success: Replicated resource data into destination descriptor frame '${dest}'.`;
            }
        }
    }
    // ==========================================
    // 🚚 VECTOR RELOCATION SYSTEMS (MOVE)
    // ==========================================
    else if (cmd === 'move') {
        const type = args[1]?.toLowerCase();
        const rem = args.slice(2).join(' ').split(/\s+to\s+/i);

        if (rem.length < 2) {
            res = `\nSyntax Error: Expected parameters mapping format structural query: 'move [file/folder] [src] to [destFolder]'`;
        } else {
            const srcName = rem[0].trim();
            const destFolder = rem[1].trim();
            
            const srcIndex = activeDirectory.items.findIndex(i => i.name.toLowerCase() === srcName.toLowerCase());
            // Lookup matching target folder structural objects in storage keys
            const targetDirKey = Object.keys(somaFileSystem).find(k => somaFileSystem[k].title.toLowerCase() === destFolder.toLowerCase());

            if (srcIndex === -1 || !targetDirKey) {
                res = `\nTransport Error: Handshake structural match failed. Verify file components exist before operation execution.`;
            } else {
                const pulledItem = activeDirectory.items.splice(srcIndex, 1)[0];
                somaFileSystem[targetDirKey].items.push(pulledItem);
                commitFileSystem();
                res = `\n🚚 Move Success: Relocated element data frame references successfully over to directory tree parameter path [${destFolder}].`;
            }
        }
    }
    // ==========================================
    // 🧹 AUTO SORT CLASSIFIER MATRIX (ARRANGE)
    // ==========================================
    else if (cmd === 'arrange' || cmd === 'auto' || cmd === 'sort') {
        if (rawInput.toLowerCase().includes('arrange') || rawInput.toLowerCase().includes('sort')) {
            activeDirectory.items.sort((a, b) => {
                if (a.type === b.type) return a.name.localeCompare(b.name);
                return a.type === 'folder' ? -1 : 1; // Bubble directory sets to top index rows always
            });
            commitFileSystem();
            res = `\n🧹 Auto Sort Matrix Complete: Structured content trees mapped optimally inside memory blocks.`;
        }
    }
    // ==========================================
    // 💽 SYSTEM MEMORY VOLATILE HARDWARE METRICS
    // ==========================================
    else if (cmd === 'mem') {
        let openWindowsCount = document.querySelectorAll('.window:not(.hidden)').length;
        let dynamicAppUsage = openWindowsCount * 512; 
        let currentFree = 16384 - (4112 + dynamicAppUsage);
        let percentage = Math.round(((16384 - currentFree) / 16384) * 100);

        res = `\n=== VOLATILE MEMORY REGISTERS ENGINE ===
 Allocation Profile   : 16384 MB Virtual RAM
 Core OS Framework    : 4112 MB Reserved Heap Space
 Active App Overheads : ${dynamicAppUsage} MB Layered Allocations
 Current Free Sector  : ${currentFree} MB Free space registers remaining
 Execution State      : ${percentage}% Loaded.`;
    }
    // ==========================================
    // 💽 PARTITION DRIVE CONTROLLERS (DISK MANAGEMENT)
    // ==========================================
    else if (cmd === 'disk') {
        res = `\n=== VIRTUAL DISK ARRANGEMENT CONTROLLER ===
 [Volume C:] Label: SomaSystem  | 42GB / 100GB Allocation Clusters Used`;
        if (somaFileSystem['computer/disk-d']) {
            res += `\n [Volume D:] Label: Local Disk D | 0GB / 150GB Allocation Clusters Used`;
        } else {
            res += `\n [Unallocated Space Register] Found 150GB raw block clusters available for allocation.`;
        }
    } 
    else if (cmd === 'disk-create') {
        if (somaFileSystem['computer/disk-d']) {
            res = `\nDisk Allocation Aborted: Partition configuration volume tracker block [Volume D:] already mounted.`;
        } else {
            somaFileSystem['computer/disk-d'] = { title: 'Local Disk D', items: [] };
            // Append mount link tracking directly onto the local root Computer node structure
            if (somaFileSystem['computer']) {
                somaFileSystem['computer'].items.push({
                    icon: '💽', name: 'Local Disk D:', type: 'folder', target: 'computer/disk-d', meta: 'User Allocated Storage Volume Partition Space'
                });
            }
            commitFileSystem();
            res = `\n💽 Success: Partition block allocated! mapped raw cluster blocks safely to volume root mount path 'Local Disk D:'.`;
        }
    } 
    else if (cmd === 'disk-delete') {
        if (!somaFileSystem['computer/disk-d']) {
            res = `\nPartition Error: No secondary storage tracks discovered matching volume structure keys.`;
        } else {
            delete somaFileSystem['computer/disk-d'];
            if (somaFileSystem['computer']) {
                somaFileSystem['computer'].items = somaFileSystem['computer'].items.filter(i => i.target !== 'computer/disk-d');
            }
            commitFileSystem();
            res = `\n💥 Partition Wiped: Scoured Volume D sectors! Reverted target data tracks into unallocated RAW layout spaces.`;
        }
    }

     if (typeof openWindow === 'function') {
        openWindow(currentActiveDirectoryKey);
    }

    const line = document.createElement('div');
    line.innerHTML = `<span style="color:#ffb3c6">soma ~ $</span> ${rawInput}\n${res.replace(/\n/g, '<br>')}`;
    out.appendChild(line);

    inputEl.value = '';
    updateTerminalSuggestions('');
    
    // Instantly force GUI visual re-renders to sync changes seamlessly across window layers
   

    requestAnimationFrame(() => {
        out.scrollTop = out.scrollHeight;
    });
}

function renderFileItem(item) {
    const isBin = currentActiveDirectoryKey === 'recycle-bin';
    
    // Create the item element
    const el = document.createElement('div');
    el.className = 'file-item';
    
    // 🟢 CRITICAL: Only allow opening if NOT in the bin
    if (!isBin) {
        el.onclick = () => openFile(item); 
    } else {
        el.style.cursor = 'default'; // Visual hint that it's not "openable"
    }
    
    el.innerHTML = `<span>${item.icon} ${item.name}</span>`;
    return el;
}

const savedTheme = localStorage.getItem('soma-theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
} else {
    document.body.classList.remove('dark-theme');
}

// 🌙 RUNTIME CORE UTILITY SYSTEMS
function toggleStartMenu() {
    document.getElementById('start-menu').classList.toggle('hidden');
}

document.addEventListener('click', (e) => {
    const startMenu = document.getElementById('start-menu');
    const startBtn = document.querySelector('.start-menu-btn');
    if (startMenu && !startMenu.classList.contains('hidden') && !startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.classList.add('hidden');
    }
});

function lockSystemAuth() {
    toggleStartMenu();
    const authLayer = document.getElementById('system-auth-layer');
    const lockScreen = document.getElementById('lock-screen');
    const loginScreen = document.getElementById('login-screen');
    
    
    authLayer.classList.remove('hidden-auth');
    authLayer.style.opacity = '1';
    authLayer.style.transform = 'scale(1)';
    
    lockScreen.classList.remove('screen-hidden');
    lockScreen.style.transform = 'translateY(0)';
    lockScreen.style.opacity = '1';
    
    loginScreen.classList.add('screen-hidden');
}

function toggleTheme() {
    // Toggle the class on the body
    const isDark = document.body.classList.toggle('dark-theme');
    
    // Save the current state to localStorage based on the toggle result
    if (isDark) {
        localStorage.setItem('soma-theme', 'dark');
    } else {
        localStorage.setItem('soma-theme', 'light');
    }
}
// ==========================================
// 🎵 AUDIO PLAYER BUSINESS LOGIC 
// ==========================================
let musicTracksData = [
    { title: "Ambient Chill", icon: "🌙", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { title: "Lo-Fi Chill Focus Beats", icon: "🌌", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { title: "Neo-Soma Vapor Pipeline", icon: "🎆", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { title: "Hridaya Heartbeat Core Ambient", icon: "✨", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    
];
let currentMusicIndex = 0;
let isMusicPlaying = false;

// Create a single real hidden audio element engine dynamically in memory
const globalAudioPlayerElement = new Audio();;
let musicTickerInterval = null;
let musicPercentComplete = 35;

function toggleMusicPlayback() {
    const playBtn = document.getElementById('music-play-trigger');
    const vinyl = document.getElementById('music-vinyl');
    
    // Safety check to ensure a source file link is loaded into the engine
    if (!globalAudioPlayerElement.src) {
        globalAudioPlayerElement.src = musicTracksData[currentMusicIndex].url;
        document.getElementById('music-track-name').innerText = musicTracksData[currentMusicIndex].title;
        document.getElementById('music-vinyl').innerText = musicTracksData[currentMusicIndex].icon;
    }

    if (!isMusicPlaying) {
        // Start real sound streaming playback
        globalAudioPlayerElement.play()
            .then(() => {
                isMusicPlaying = true;
                if (playBtn) playBtn.innerText = "⏸";
                if (vinyl) vinyl.classList.add('vinyl-spin-animation');
                startMusicTimelineTracker();
            })
            .catch(error => console.log("Browser user audio blocker intercepted playback trigger:", error));
    } else {
        // Pause real audio track streams safely
        globalAudioPlayerElement.pause();
        isMusicPlaying = false;
        if (playBtn) playBtn.innerText = "▶";
        if (vinyl) vinyl.classList.remove('vinyl-spin-animation');
    }
}

function changeMusicTrack(dir) {
    // Locate these lines inside changeMusicTrack() and update them:
// Add or replace these lines inside your changeMusicTrack function:
const musicSlider = document.getElementById('music-progress-slider');
const timeCurrent = document.getElementById('music-time-current');
const timeDuration = document.getElementById('music-time-duration');

if (musicSlider) musicSlider.value = 0;
if (timeCurrent) timeCurrent.innerText = "00:00";
if (timeDuration) timeDuration.innerText = "00:00";
    currentMusicIndex += dir;
    if (currentMusicIndex >= musicTracksData.length) currentMusicIndex = 0;
    if (currentMusicIndex < 0) currentMusicIndex = musicTracksData.length - 1;
    
    // Load new stream details instantly
    globalAudioPlayerElement.src = musicTracksData[currentMusicIndex].url;
    
    document.getElementById('music-track-name').innerText = musicTracksData[currentMusicIndex].title;
    document.getElementById('music-vinyl').innerText = musicTracksData[currentMusicIndex].icon;
    
    // Force active reset on view progress bars
    document.getElementById('music-progress-fill').style.width = '0%';
    
    // Automatically trigger real playing pipeline if context is ready
    isMusicPlaying = false; 
    toggleMusicPlayback();
}
/**
 * 📈 LIVE TIMELINE SYNC FOR THE MUSIC PROGRESS SLIDER & SPLIT TIMERS
 */
function startMusicTimelineTracker() {
    const musicSlider = document.getElementById('music-progress-slider');
    const timeCurrent = document.getElementById('music-time-current');
    const timeDuration = document.getElementById('music-time-duration');

    globalAudioPlayerElement.ontimeupdate = () => {
        if (!globalAudioPlayerElement.duration) return;
        
        // 1. Calculate and update slider track position handle
        const percentage = (globalAudioPlayerElement.currentTime / globalAudioPlayerElement.duration) * 100;
        if (musicSlider) musicSlider.value = percentage;

        // 2. Break down and update independent timestamps
        if (timeCurrent) timeCurrent.innerText = formatMusicTime(globalAudioPlayerElement.currentTime);
        if (timeDuration) timeDuration.innerText = formatMusicTime(globalAudioPlayerElement.duration);
    };

    globalAudioPlayerElement.onended = () => {
        changeMusicTrack(1);
    };
}

function musicSliderUserSeek(sliderValue) {
    if (!globalAudioPlayerElement || !globalAudioPlayerElement.duration) return;

    // Convert slider position percentage cleanly back into seconds
    const targetSeconds = (sliderValue / 100) * globalAudioPlayerElement.duration;
    globalAudioPlayerElement.currentTime = targetSeconds;
}

function formatMusicTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
/**
 * Call this when an audio track file item is clicked inside your File Explorer windows
 */
function launchMusicTrackFromExplorer(trackTitle) {
    // Check if the file clicked matches one of our 4 tracks
    const targetIdx = musicTracksData.findIndex(t => t.title.toLowerCase().includes(trackTitle.toLowerCase()) || trackTitle.toLowerCase().includes(t.title.toLowerCase()));
    
    if (targetIdx !== -1) {
        currentMusicIndex = targetIdx;
    }
    
    // Open the music player app layout container frame
    openApp('app-music'); 
    
    // Force a fresh reload of the track file stream and start playing!
    isMusicPlaying = false;
    if (globalAudioPlayerElement.src !== musicTracksData[currentMusicIndex].url) {
        globalAudioPlayerElement.src = musicTracksData[currentMusicIndex].url;
    }
    toggleMusicPlayback();
}
// ==========================================
// 🎬 VIDEO PLAYER BUSINESS LOGIC (UPDATED STABLE STREAM LINKS)
// ==========================================
let isVideoPlaying = false;
let sampleVideoTracks = [
    { 
        name: "Cosmic Matrix Wormhole.mp4", 
        url: "https://vjs.zencdn.net/v/oceans.mp4" 
    },
    { 
        name: "Soma Core Cyber Loop.mp4", 
        url: "https://html5demos.com/assets/dizzy.mp4" 
    }
];
let currentVideoUrl = sampleVideoTracks[0].url;

function toggleVideoPlayback() {
    const videoEl = document.getElementById('video-player-render-target');
    const playIcon = document.getElementById('video-play-icon');
    const screenMsg = document.getElementById('video-status-msg');

    if (!videoEl) return;

    // Load initial source link if nothing is buffered yet
    if (!videoEl.src) {
        videoEl.src = currentVideoUrl;
        videoEl.style.display = 'block';
        if (screenMsg) screenMsg.style.display = 'none';
        attachVideoProgressTracker(videoEl);
    }

    if (!isVideoPlaying) {
        videoEl.play()
            .then(() => {
                isVideoPlaying = true;
                if (playIcon) playIcon.className = "fas fa-pause";
                if (screenMsg) screenMsg.style.display = 'none';
                videoEl.style.display = 'block';
            })
            .catch(err => console.log("Video block stream warning context intercept:", err));
    } else {
        videoEl.pause();
        isVideoPlaying = false;
        if (playIcon) playIcon.className = "fas fa-play";
    }
}

function resetVideoPlayer() {
    // Add these two execution steps inside your existing resetVideoPlayer() block:
// Ensure these lines clear out the video clock elements inside resetVideoPlayer():
const slider = document.getElementById('video-progress-slider');
const timeCurrent = document.getElementById('video-time-current');
const timeDuration = document.getElementById('video-time-duration');
if (slider) slider.value = 0;
if (timeCurrent) timeCurrent.innerText = "00:00";
if (timeDuration) timeDuration.innerText = "00:00";
    const videoEl = document.getElementById('video-player-render-target');
    if (!videoEl) return;
 
    videoEl.pause();
    videoEl.currentTime = 0;
    isVideoPlaying = false;
    const screenMsg = document.getElementById('video-status-msg');
    screenMsg.style.display = 'block';
    if (document.getElementById('video-play-icon')) document.getElementById('video-play-icon').className = "fas fa-play";
    if (document.getElementById('video-play-text')) document.getElementById('video-play-text').innerText = "Play";
    
    videoEl.style.display = 'none';
    
}

/**
 * ⚡ REAL TIME TIMELINE TRACKER FOR VIDEO LAYOUT
 */
function attachVideoProgressTracker(videoEl) {
    const slider = document.getElementById('video-progress-slider');
    const timeCurrent = document.getElementById('video-time-current');
    const timeDuration = document.getElementById('video-time-duration');

    videoEl.ontimeupdate = () => {
        if (!videoEl.duration) return;
        
        // 1. Calculate live mathematical percentage completed for slider knob position
        const pct = (videoEl.currentTime / videoEl.duration) * 100;
        if (slider) slider.value = pct;

        // 2. Format running time numbers (MM:SS) into independent containers
        if (timeCurrent) timeCurrent.innerText = formatTimeSeconds(videoEl.currentTime);
        if (timeDuration) timeDuration.innerText = formatTimeSeconds(videoEl.duration);
    };

    videoEl.onended = () => {
        resetVideoPlayer();
    };
}

function videoSliderUserSeek(sliderValue) {
    const videoEl = document.getElementById('video-player-render-target');
    if (!videoEl || !videoEl.duration) return;

    // Convert percentage slider value directly back into track seconds
    const targetSeconds = (sliderValue / 100) * videoEl.duration;
    videoEl.currentTime = targetSeconds;
}


function formatTimeSeconds(seconds) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ==========================================
// 🕹️ RETRO SNAKE ARCADE GAME ENGINE V1.3 (DOPAMINE UPDATE)
// ==========================================
let snakeCanvas, snakeCtx;
let snakeGameTimer = null;
let snakeGridSize = 15;
let snakeBody = [];
let snakeDirection = { x: 0, y: 0 };
let snakeTargetFood = { x: 0, y: 0 };
let snakeCurrentScore = 0;
let isSnakeGameActive = false;

// New Dopamine Engine Variables
let snakeBaseSpeed = 130;        // Start speed (ms per tick)
let snakeCurrentSpeed = 130;     // Active tracking speed
let foodEatenCount = 0;          // Tracks combos for speed steps
let specialFood = null;          // Holds coordinates for Golden Food
let specialFoodTimer = 0;        // Countdown lifetime ticks for critical items
let screenShakeTicks = 0;        // Screen rumble offset frame ticker

// Load Highscore immediately on system startup
let snakeHighScore = parseInt(localStorage.getItem('soma-snake-highscore')) || 0;

function updateHighScoreDisplay() {
    document.getElementById('snake-highscore').innerText = snakeHighScore;
}

// Run this during window boot configuration to display saved scores
setTimeout(updateHighScoreDisplay, 100);

function initializeSnakeGame() {
    snakeCanvas = document.getElementById('snakeCanvas');
    snakeCtx = snakeCanvas.getContext('2d');
    
    // Reset core states
    clearInterval(snakeGameTimer);
    snakeBody = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    snakeDirection = { x: 0, y: -1 }; 
    snakeCurrentScore = 0;
    foodEatenCount = 0;
    snakeCurrentSpeed = snakeBaseSpeed;
    specialFood = null;
    specialFoodTimer = 0;
    screenShakeTicks = 0;
    
    document.getElementById('snake-score').innerText = snakeCurrentScore;
    updateHighScoreDisplay();
    isSnakeGameActive = true;
    
    spawnSnakeFood();
    
    document.removeEventListener('keydown', captureSnakeKeyControls);
    document.addEventListener('keydown', captureSnakeKeyControls);
    
    document.getElementById('snake-start-btn').innerText = "🔄 Reboot Simulation";
    
    // Start standard engine loop
    runNextEngineTick();
}

function runNextEngineTick() {
    if (!isSnakeGameActive) return;
    clearInterval(snakeGameTimer);
    snakeGameTimer = setTimeout(() => {
        processSnakeEngineTick();
        runNextEngineTick();
    }, snakeCurrentSpeed);
}

function captureSnakeKeyControls(e) {
    if (!isSnakeGameActive) return;
    switch(e.key) {
        case 'ArrowUp':    if (snakeDirection.y === 0) snakeDirection = { x: 0, y: -1 };  e.preventDefault(); break;
        case 'ArrowDown':  if (snakeDirection.y === 0) snakeDirection = { x: 0, y: 1 };   e.preventDefault(); break;
        case 'ArrowLeft':  if (snakeDirection.x === 0) snakeDirection = { x: -1, y: 0 };  e.preventDefault(); break;
        case 'ArrowRight': if (snakeDirection.x === 0) snakeDirection = { x: 1, y: 0 };   e.preventDefault(); break;
    }
}

function spawnSnakeFood() {
    const cellsInRow = snakeCanvas.width / snakeGridSize;
    snakeTargetFood = {
        x: Math.floor(Math.random() * cellsInRow),
        y: Math.floor(Math.random() * cellsInRow)
    };
    
    // Safety check against spawning inside snake body
    for (let segment of snakeBody) {
        if (segment.x === snakeTargetFood.x && segment.y === snakeTargetFood.y) {
            spawnSnakeFood();
            return;
        }
    }

    // Dopamine Rule: 25% chance to trigger a Golden Critical Item drop
    if (Math.random() < 0.25 && !specialFood) {
        triggerGoldenDrop(cellsInRow);
    }
}

function triggerGoldenDrop(maxCells) {
    specialFood = {
        x: Math.floor(Math.random() * maxCells),
        y: Math.floor(Math.random() * maxCells)
    };
    specialFoodTimer = 40; // Spawns with 40 frame ticks to catch it
}

function processSnakeEngineTick() {
    const newHead = { x: snakeBody[0].x + snakeDirection.x, y: snakeBody[0].y + snakeDirection.y };
    const maxIndex = snakeCanvas.width / snakeGridSize;
    
    // Check boundaries & self-collision
    if (newHead.x < 0 || newHead.x >= maxIndex || newHead.y < 0 || newHead.y >= maxIndex) {
        triggerSnakeGameOver(); return;
    }
    for (let cell of snakeBody) {
        if (newHead.x === cell.x && newHead.y === cell.y) {
            triggerSnakeGameOver(); return;
        }
    }
    
    snakeBody.unshift(newHead);
    let scoreGained = 0;

    // Check Special Golden Food collision
    if (specialFood && newHead.x === specialFood.x && newHead.y === specialFood.y) {
        scoreGained = 50; // Big point payout!
        specialFood = null;
        screenShakeTicks = 10; // Intense screen shake
    } 
    // Check normal food collision
    else if (newHead.x === snakeTargetFood.x && newHead.y === snakeTargetFood.y) {
        scoreGained = 10;
        foodEatenCount++;
        screenShakeTicks = 4; // Mini pop bounce shake
        spawnSnakeFood();

        // Speed ramp logic: Make it harder every 3 points
        if (foodEatenCount % 3 === 0 && snakeCurrentSpeed > 50) {
            snakeCurrentSpeed -= 12; 
        }
    } else {
        snakeBody.pop();
    }

    if (scoreGained > 0) {
        snakeCurrentScore += scoreGained;
        document.getElementById('snake-score').innerText = snakeCurrentScore;
        
        if (snakeCurrentScore > snakeHighScore) {
            snakeHighScore = snakeCurrentScore;
            localStorage.setItem('soma-snake-highscore', snakeHighScore);
            updateHighScoreDisplay();
        }
    }

    // Tick down special item expiration timers
    if (specialFood) {
        specialFoodTimer--;
        if (specialFoodTimer <= 0) specialFood = null;
    }

    renderCanvasGraphics();
}

function renderCanvasGraphics() {
    snakeCtx.save();
    
    // Apply screen rumble offsets if active
    if (screenShakeTicks > 0) {
        let dx = (Math.random() - 0.5) * 4;
        let dy = (Math.random() - 0.5) * 4;
        snakeCtx.translate(dx, dy);
        screenShakeTicks--;
    }

    snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
    // Draw Base Grid Background lines for clean retro visual structure
    snakeCtx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    for(let i=0; i<snakeCanvas.width; i+=snakeGridSize) {
        snakeCtx.beginPath(); snakeCtx.moveTo(i, 0); snakeCtx.lineTo(i, snakeCanvas.height); snakeCtx.stroke();
        snakeCtx.beginPath(); snakeCtx.moveTo(0, i); snakeCtx.lineTo(snakeCanvas.width, i); snakeCtx.stroke();
    }

    // Draw Special Golden Critical Target
    if (specialFood) {
        let pulseFactor = Math.abs(Math.sin(Date.now() / 100)) * 4;
        snakeCtx.fillStyle = '#f1c40f';
        snakeCtx.shadowColor = '#f1c40f';
        snakeCtx.shadowBlur = 12;
        snakeCtx.beginPath();
        let r = (snakeGridSize / 2) + (pulseFactor / 2);
        snakeCtx.arc(specialFood.x * snakeGridSize + (snakeGridSize/2), specialFood.y * snakeGridSize + (snakeGridSize/2), Math.max(2, r - 1), 0, Math.PI * 2);
        snakeCtx.fill();
        snakeCtx.shadowBlur = 0; // Clear blur layer
    }
    
    // Draw Normal Apple Core
    snakeCtx.fillStyle = '#ff7675';
    snakeCtx.beginPath();
    let radius = snakeGridSize / 2;
    snakeCtx.arc(snakeTargetFood.x * snakeGridSize + radius, snakeTargetFood.y * snakeGridSize + radius, radius - 1, 0, Math.PI * 2);
    snakeCtx.fill();
    
    // Draw Neon Matrix Snake
    snakeBody.forEach((cell, idx) => {
        if (idx === 0) {
            snakeCtx.fillStyle = '#00cec9'; // Head glow
            snakeCtx.shadowColor = '#00cec9';
            snakeCtx.shadowBlur = 6;
        } else {
            snakeCtx.fillStyle = '#00b894'; // Tail segment
            snakeCtx.shadowBlur = 0;
        }
        snakeCtx.fillRect(cell.x * snakeGridSize + 1, cell.y * snakeGridSize + 1, snakeGridSize - 2, snakeGridSize - 2);
    });
    
    snakeCtx.restore();
}

function triggerSnakeGameOver() {
    clearInterval(snakeGameTimer);
    isSnakeGameActive = false;
    document.removeEventListener('keydown', captureSnakeKeyControls);
    
    snakeCtx.fillStyle = 'rgba(10, 10, 14, 0.85)';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
    snakeCtx.shadowColor = '#ff7675';
    snakeCtx.shadowBlur = 15;
    snakeCtx.fillStyle = '#ff7675';
    snakeCtx.font = 'bold 18px Courier New';
    snakeCtx.textAlign = 'center';
    snakeCtx.fillText('CORE SYSTEM CRASH', snakeCanvas.width / 2, snakeCanvas.height / 2 - 10);
    
    snakeCtx.shadowBlur = 0;
    snakeCtx.fillStyle = '#ffffff';
    snakeCtx.font = '11px Courier New';
    snakeCtx.fillText(`Final Score Matrix: ${snakeCurrentScore}`, snakeCanvas.width / 2, snakeCanvas.height / 2 + 15);
    snakeCtx.fillText('Click Below to Patch System', snakeCanvas.width / 2, snakeCanvas.height / 2 + 35);
    
    document.getElementById('snake-start-btn').innerText = "🎮 Boot Next Cycle";
}
// ==========================================
// ⚙️ SETTINGS WINDOW TAB & HARDWARE HARDLINK DRIVERS
// ==========================================
function loadSavedSettings() {
    // Restore Saved Wallpaper
    const savedBg = localStorage.getItem('soma-wallpaper');
    if (savedBg) {
        const desktopEl = document.getElementById('desktop');
        if (desktopEl) desktopEl.style.background = savedBg;
    }

    // Restore Wi-Fi State
    const savedWifi = localStorage.getItem('soma-hardware-wifi');
    const wifiCheckbox = document.getElementById('settings-wifi-toggle');
    if (savedWifi === 'false') {
        if (wifiCheckbox) wifiCheckbox.checked = false;
        applyWifiDOMState(false);
    } else {
        if (wifiCheckbox) wifiCheckbox.checked = true;
        applyWifiDOMState(true);
    }

    // Restore Battery State
    const savedBattery = localStorage.getItem('soma-hardware-battery');
    const batteryCheckbox = document.getElementById('settings-battery-toggle');
    if (savedBattery === 'true') {
        if (batteryCheckbox) batteryCheckbox.checked = true;
        applyBatteryDOMState(true);
    } else {
        if (batteryCheckbox) batteryCheckbox.checked = false;
        applyBatteryDOMState(false);
    }
}

// Automatically schedule setting hydration
setTimeout(loadSavedSettings, 50);


// 2. SAFE TAB NAVIGATION (Accepts explicit event target argument)
function switchSettingsTab(tabName, element) {
    // Toggle active state buttons visual design cleanly
    document.querySelectorAll('.settings-nav-btn').forEach(btn => btn.classList.remove('active'));
    
    if (element) {
        element.classList.add('active');
    } else if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
    
    // Switch panels visibility grids securely
    document.querySelectorAll('.settings-pane').forEach(pane => pane.style.display = 'none');
    
    const targetPane = document.getElementById(`set-tab-${tabName}`);
    if (targetPane) targetPane.style.display = 'block';
}


// 3. WALLPAPER SELECTION DRIVER (With persistence layer)
function changeWallpaper(cssBackgroundValue) {
    const desktopEl = document.getElementById('desktop');
    if (desktopEl) {
        desktopEl.style.background = cssBackgroundValue;
        localStorage.setItem('soma-wallpaper', cssBackgroundValue);
    }
}

function switchSettingsTab(tabName, element) {
    // 1. Remove active state safely from all navigation buttons
    document.querySelectorAll('.settings-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 2. Attach active highlight to the clicked target element securely
    if (element) {
        element.classList.add('active');
    }
    
    // 3. Hide all settings panes instantly
    document.querySelectorAll('.settings-pane').forEach(pane => {
        pane.style.display = 'none';
    });
    
    // 4. Reveal the selected target option pane area
    const targetPane = document.getElementById(`set-tab-${tabName}`);
    if (targetPane) {
        targetPane.style.display = 'block';
    }
}


// 4. HARDWARE STATE DRIVERS (Decoupled logic for storage loops)
function toggleHardwareState(type) {
    if (type === 'wifi') {
        const isConnected = document.getElementById('settings-wifi-toggle').checked;
        localStorage.setItem('soma-hardware-wifi', isConnected);
        applyWifiDOMState(isConnected);
    } else if (type === 'battery') {
        const isSavingMode = document.getElementById('settings-battery-toggle').checked;
        localStorage.setItem('soma-hardware-battery', isSavingMode);
        applyBatteryDOMState(isSavingMode);
    }
}

// Independent DOM sync for Wi-Fi
function applyWifiDOMState(isConnected) {
    const taskbarWifi = document.getElementById('sys-wifi');
    const lockWifi = document.getElementById('lock-wifi-icon');
    
    if (!taskbarWifi) return; // Prevent breaking if elements aren't rendered yet
    
    if (isConnected) {
        taskbarWifi.className = "fas fa-wifi";
        taskbarWifi.title = "Wi-Fi: Connected";
        if (lockWifi) lockWifi.className = "fas fa-wifi";
    } else {
        taskbarWifi.className = "fas fa-wifi-slash";
        taskbarWifi.title = "Wi-Fi: Disconnected";
        if (lockWifi) lockWifi.className = "fas fa-wifi-slash";
    }
}

// Independent DOM sync for Battery
function applyBatteryDOMState(isSavingMode) {
    const taskbarBattery = document.getElementById('sys-battery');
    const lockBattery = document.getElementById('lock-battery-icon');
    
    if (!taskbarBattery) return;
    
    if (isSavingMode) {
        taskbarBattery.className = "fas fa-battery-quarter";
        taskbarBattery.style.color = "#ff7675"; 
        taskbarBattery.title = "Battery: 20% (Eco-Saving Mode)";
        if (lockBattery) {
            lockBattery.className = "fas fa-battery-quarter";
            lockBattery.style.color = "#ff7675";
        }
    } else {
        taskbarBattery.className = "fas fa-battery-three-quarters";
        taskbarBattery.style.color = "";
        taskbarBattery.title = "Battery: 85% Remaining";
        if (lockBattery) {
            lockBattery.className = "fas fa-battery-three-quarters";
            lockBattery.style.color = "";
        }
    }
}

// Global memory state tracking variables
let chosenSetupAvatar = "🌸";
    updateSystemClocks();
    setInterval(updateSystemClocks, 1000);

    // Read local cache to discover if this system container is initialized
    const profileSaved = localStorage.getItem('soma_profile_established');
    
    if (profileSaved === 'true') {
        // User has already set up their profile: Skip BIOS and Setup, go to Lock Screen
        document.getElementById('bios-screen').style.display = 'none';
        applySavedProfileCredentials();
        
        const authLayer = document.getElementById('system-auth-layer');
        authLayer.classList.remove('hidden-auth');
    } else {
        // Fresh execution: Boot into the fully automated BIOS Terminal Pipeline Sequence
        executeBiosSequencePipeline();
    }
    
    // Bind click/press triggers securely onto the lock screen
    document.addEventListener('keydown', (e) => {
        const lockScreen = document.getElementById('lock-screen');
        if (lockScreen && !lockScreen.classList.contains('screen-hidden')) {
            liftLockScreen();
        }
    });

// ==========================================
// 💻 STAGE 1: SYSTEM BIOS LOG INTERFACES
// ==========================================
function executeBiosSequencePipeline() {
    const logOut = document.getElementById('bios-log-output');
    const biosLines = [
        "Checking volatile core registers... OK [16384MB RAM loaded]",
    "Mapping Virtual File System nodes (VFS)...",
    "Binding kernel event hooks to 'hridaya-os CLI' module...",
    "Synchronizing hardware environment parameters...",
    "Identity status mismatch: Unregistered User Node discovered.",
    "Redirecting pipeline stream to System Setup Wizard..."
    ];
    
    let currentLine = 0;
    
    function printNextBiosLine() {
        if (currentLine < biosLines.length) {
            logOut.insertAdjacentHTML('beforeend', `<div>${biosLines[currentLine]}</div>`);
            currentLine++;
            setTimeout(printNextBiosLine, 400); // Speed line tickers
        } else {
            // BIOS cycle successfully finished. Shift display layers over onto Stage 2 Setup Wizard
            setTimeout(() => {
                document.getElementById('bios-screen').style.opacity = '0';
                setTimeout(() => {
                    document.getElementById('bios-screen').style.display = 'none';
                    document.getElementById('setup-wizard-screen').classList.remove('wizard-hidden');
                }, 600);
            }, 800);
        }
    }
    
    setTimeout(printNextBiosLine, 500);
}

// ==========================================
// 🌸 STAGE 2: IDENTITY SIGNUP CONTROLS (OOBE)
// ==========================================
// ============================================================================
// 🪐 SOMA 2.0 HUMAN-CENTRIC STATE ENGINE LOGIC
// ============================================================================

let activeWizardPanelIndex = 1;

/**
 * Handles sliding focus across step panels with responsive safety boundaries
 */
function navigateSoma2Wizard(targetIndexIndex) {
    if (typeof playSound === 'function') playSound('click');
    
    // De-allocate active layout display vectors safely
    document.querySelectorAll('.wizard-panel').forEach(p => p.classList.remove('active-panel'));
    document.querySelectorAll('.wizard-progress-dots .dot').forEach(d => d.classList.remove('active'));

    activeWizardPanelIndex = targetIndexIndex;
    let computedPanelTargetId = 'panel-location';
    
    if (targetIndexIndex === 2) computedPanelTargetId = 'panel-keyboard';
    if (targetIndexIndex === 3) computedPanelTargetId = 'panel-wifi';
    if (targetIndexIndex === 4) computedPanelTargetId = 'panel-user';

    const structuralActivePanel = document.getElementById(computedPanelTargetId);
    if (structuralActivePanel) structuralActivePanel.classList.add('active-panel');

    // Illuminate navigation milestone trackers up to current active layer index limit
    for (let i = 1; i <= targetIndexIndex; i++) {
        const dotInstanceElement = document.getElementById(`dot-step-${i}`);
        if (dotInstanceElement) dotInstanceElement.classList.add('active');
    }
}

/**
 * Evaluates visibility parameters of the secret network key configuration inputs
 */
function evaluateNetworkInterfaceView() {
    const netMenuSelector = document.getElementById('setup-wifi-input');
    const secureKeyInputBox = document.getElementById('setup-wifi-password');
    if (!netMenuSelector || !secureKeyInputBox) return;

    secureKeyInputBox.style.display = (netMenuSelector.value === 'Bypass_Offline') ? 'none' : 'block';
}

/**
 * Commits configuration array tokens and launches the core desktop system boot framework loop
 */
function provisionSoma2IdentityNode() {
    const extractedHandle = document.getElementById('setup-username-input').value.trim() || 'Creator';
    const localizedRegionField = document.getElementById('setup-location-input').value;
    const verifiedNetworkSSID = document.getElementById('setup-wifi-input').value;

    // Secure custom environment settings into local persistent structures
    localStorage.setItem('soma_username', extractedHandle);
    localStorage.setItem('soma_region', localizedRegionField);
    localStorage.setItem('soma_network', verifiedNetworkSSID);
    localStorage.setItem('soma_identity_configured', 'true'); // 🌟 The "Never Show Again" Lock Token

    // Update system presentation wrappers instantly across layouts
    updateSystemInterfaceIdentityLabels(extractedHandle);

    // Minimize wizard interface setup window smoothly using transitional timelines
    const currentSetupWizardFrame = document.getElementById('setup-wizard-screen');
    if (currentSetupWizardFrame) {
        currentSetupWizardFrame.style.opacity = '0';
        setTimeout(() => {
            currentSetupWizardFrame.style.display = 'none';
            currentSetupWizardFrame.classList.add('wizard-hidden');
            initializeSoma2BootSequencerAnimation();
        }, 500);
    }
}

/**
 * Triggers a premium animated compilation pipeline layout representation
 */
function initializeSoma2BootSequencerAnimation() {
    const systemBootOverlayContainer = document.getElementById('boot-screen');
    const progressiveProgressFillerElement = document.getElementById('boot-progress-fill');
    const operatingSystemAuthOverlay = document.getElementById('system-auth-layer');

    if (systemBootOverlayContainer) systemBootOverlayContainer.style.display = 'flex';
    if (typeof playSound === 'function') playSound('startup');

    let processingTickValue = 0;
    const visualTickTimerInstance = setInterval(() => {
        processingTickValue += 4;
        if (progressiveProgressFillerElement) {
            progressiveProgressFillerElement.style.width = `${processingTickValue}%`;
        }

        if (processingTickValue >= 100) {
            clearInterval(visualTickTimerInstance);
            setTimeout(() => {
                if (systemBootOverlayContainer) systemBootOverlayContainer.style.opacity = '0';
                setTimeout(() => {
                    if (systemBootOverlayContainer) systemBootOverlayContainer.style.display = 'none';
                    
                    // Route user profile smoothly directly inside operating shell workspace gates
                    if (operatingSystemAuthOverlay) {
                        operatingSystemAuthOverlay.classList.remove('hidden-auth');
                        operatingSystemAuthOverlay.style.display = 'flex'; // Ensure visibility
                        if (typeof liftLockScreen === 'function') liftLockScreen();
                    }
                }, 500);
            }, 300);
        }
    }, 90);
}

/**
 * Synchronizes local user metadata parameters across existing interface DOM structural nodes
 */
function updateSystemInterfaceIdentityLabels(targetNameString) {
    const welcomeLockScreenField = document.getElementById('login-display-welcome');
    const structuralStartMenuFooterName = document.querySelector('.start-username');

    if (welcomeLockScreenField) welcomeLockScreenField.innerText = `Welcome back, ${targetNameString}`;
    if (structuralStartMenuFooterName) structuralStartMenuFooterName.innerText = targetNameString;
}

// ============================================================================
// 🔒 SECURE BOOT ROUTER (PREVENTS SETUP SHOWING AGAIN)
// ============================================================================
    // Structural Guard: Keep old legacy BIOS screens completely disabled
    const archaicLegacyBiosView = document.getElementById('bios-screen');
    if (archaicLegacyBiosView) archaicLegacyBiosView.style.display = 'none';

    const currentProfileSystemConfigurationCheck = localStorage.getItem('soma_identity_configured');
    const operatingSystemWizardContainer = document.getElementById('setup-wizard-screen');
    const operatingSystemAuthOverlay = document.getElementById('system-auth-layer');

    if (currentProfileSystemConfigurationCheck === 'true') {
        // 🛑 STEP OVERRIDE: User setup is already complete. Burn the wizard display.
        if (operatingSystemWizardContainer) {
            operatingSystemWizardContainer.style.display = 'none';
            operatingSystemWizardContainer.classList.add('wizard-hidden');
        }
        
        // Fetch cached preferences and populate the UI shell
        const structuralNameCache = localStorage.getItem('soma_username') || 'Creator';
        updateSystemInterfaceIdentityLabels(structuralNameCache);
        
        // Send user straight to the authenticated lock screen environment
        if (operatingSystemAuthOverlay) {
            operatingSystemAuthOverlay.classList.remove('hidden-auth');
            operatingSystemAuthOverlay.style.display = 'flex'; 
        }
    } else {
        // 🟢 FRESH SYSTEM RUN: Bring up the premium interactive setup loop wizard
        if (operatingSystemWizardContainer) {
            operatingSystemWizardContainer.style.display = 'flex';
            setTimeout(() => {
                operatingSystemWizardContainer.classList.remove('wizard-hidden');
                operatingSystemWizardContainer.style.opacity = '1';
            }, 50);
        }
        
        // Ensure standard UI layers remain hidden until authorization sequence initiates
        if (operatingSystemAuthOverlay) {
            operatingSystemAuthOverlay.classList.add('hidden-auth');
            operatingSystemAuthOverlay.style.display = 'none';
        }
    }



// ==========================================
// ⏳ STAGE 3: RUNTIME LOADING DECK MATRIX
// ==========================================
function executeOsBootLoaderAnimation() {
    const bootScreen = document.getElementById('boot-screen');
    const authLayer = document.getElementById('system-auth-layer');
    
    bootScreen.style.display = 'flex';
    bootScreen.style.opacity = '1';
    
    // Force reset progress loading filled values to start tracking cleanly
    const progressFill = bootScreen.querySelector('.progress-fill');
    if(progressFill) progressFill.style.width = '100%'; 

    setTimeout(() => {
        bootScreen.style.opacity = '0';
        authLayer.classList.remove('hidden-auth');
        setTimeout(() => { 
            bootScreen.style.visibility = 'hidden'; 
            bootScreen.style.display = 'none';
        }, 800);
    }, 2800);
}

// Re-inject updated lockSystemAuth code to carry forward synchronization fixes
function lockSystemAuth() {
    if (typeof toggleStartMenu === 'function') {
        const startMenu = document.getElementById('start-menu');
        if (startMenu && !startMenu.classList.contains('hidden')) {
            toggleStartMenu();
        }
    }
    
    const authLayer = document.getElementById('system-auth-layer');
    const lockScreen = document.getElementById('lock-screen');
    const loginScreen = document.getElementById('login-screen');
    
    authLayer.classList.remove('hidden-auth');
    authLayer.style.opacity = '1';
    authLayer.style.transform = 'scale(1)';
    authLayer.style.visibility = 'visible';
    
    lockScreen.classList.remove('screen-hidden');
    lockScreen.style.transform = 'translateY(0)';
    lockScreen.style.opacity = '1';
    
    loginScreen.classList.add('screen-hidden');
    loginScreen.style.transform = '';
    
    // Auto sync icon displays 
    const sysWifi = document.getElementById('sys-wifi');
    const sysBattery = document.getElementById('sys-battery');
    const lockWifi = document.getElementById('lock-wifi-icon');
    const lockBattery = document.getElementById('lock-battery-icon');
    
    if (sysWifi && lockWifi) lockWifi.className = sysWifi.className;
    if (sysBattery && lockBattery) {
        lockBattery.className = sysBattery.className;
        lockBattery.style.color = sysBattery.style.color;
    }
}
// 📑 ADAPTIVE CONTEXT MENU EVENT MECHANICS
let currentSelectedTargetAction = null;
    const desktop = document.getElementById('desktop');
    const contextMenu = document.getElementById('desktop-context-menu');
    const itemActionsGroup = document.getElementById('menu-group-item-actions');

    // Handle Right-Click
    desktop.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        // 1. Remove previous active items selections highlights
        clearActiveContextSelections();
        currentSelectedTargetAction = null;

        // 2. Identify if an item was right-clicked or empty wallpaper space
        const targetElement = e.target.closest('.desktop-icon, .file-card');

        if (targetElement) {
            // An item was targeted! Show Open/Pin options and highlight it
            itemActionsGroup.classList.remove('hidden');
            targetElement.classList.add('active-selected');
            currentSelectedTargetAction = targetElement.getAttribute('onclick');
        } else {
            // Empty desktop space targeted! Hide file actions
            itemActionsGroup.classList.add('hidden');
        }

        // 3. Keep menu layout safely inside browser window viewing coordinates
        let posX = e.clientX;
        let posY = e.clientY;
        const menuWidth = 230;
        const menuHeight = targetElement ? 210 : 130; // Adaptive height boundary check

        if (posX + menuWidth > window.innerWidth) posX -= menuWidth;
        if (posY + menuHeight > window.innerHeight) posY -= menuHeight;

        contextMenu.style.left = `${posX}px`;
        contextMenu.style.top = `${posY}px`;
        contextMenu.classList.remove('hidden');
    });

    // Close the menu when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target)) {
            contextMenu.classList.add('hidden');
            clearActiveContextSelections();
        }
    });

function clearActiveContextSelections() {
    document.querySelectorAll('.active-selected').forEach(element => {
        element.classList.remove('active-selected');
    });
}

/**
 * Custom Context Menu Command Routing Engine
 */
function handleMenuAction(action) {
    const menu = document.getElementById('desktop-context-menu');
    if (menu) menu.classList.add('hidden');

    const activeItems = somaFileSystem[currentActiveDirectoryKey]?.items || [];

    if (action === 'open' && targetedItemName) {
        const itemObj = activeItems.find(i => i.name === targetedItemName);
        if (itemObj) {
            if (itemObj.type === 'folder') openWindow(itemObj.target);
            else launchAppTextContent(itemObj.name);
        }
    } 
    // 🗑️ WORKING GLOBAL DELETE PIPELINE FOR FOLDERS AND FILES
    else if (action === 'delete' && targetedItemIndex !== null && targetedItemIndex !== undefined) {
        const itemToDelete = activeItems[targetedItemIndex];
        
        if (itemToDelete) {
            if (confirm(`Are you sure you want to delete "${itemToDelete.name}"?`)) {
                // If it is a folder container, delete its child tree records out of storage maps
                if (itemToDelete.type === 'folder' && somaFileSystem[itemToDelete.target]) {
                    delete somaFileSystem[itemToDelete.target];
                }
                
                // Remove the targeted item slice index records record cleanly
                activeItems.splice(targetedItemIndex, 1);
                
                commitFileSystem();
                openWindow(currentActiveDirectoryKey); // Refresh visual layout
            }
        }
    }
    else if (action === 'refresh') {
        const desktop = document.getElementById('desktop');
            desktop.style.opacity = '0.4';
            setTimeout(() => { desktop.style.opacity = '1'; }, 150);
    }
    else if (action === 'theme') {
        toggleTheme();
    }
    else if (action === 'terminal') {
        openApp('app-terminal');
    }

    targetedItemName = null;
    targetedItemIndex = null;
}

// 📅 SOMA CALENDAR APPLICATION MATRIX OBJECTS
let calendarActiveDateInstance = new Date();

/**
 * Initializes and builds out the custom date calendar system grid layer
 */
function initSomaCalendar() {
    const monthTitle = document.getElementById('cal-month-title');
    const daysGrid = document.getElementById('cal-days-grid');
    if (!daysGrid || !monthTitle) return;

    daysGrid.innerHTML = ''; // Wipe grid structure clean

    const year = calendarActiveDateInstance.getFullYear();
    const month = calendarActiveDateInstance.getMonth();

    // 1. Render Current Month Header String Title Text
    const monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthTitle.innerText = `${monthsArray[month]} ${year}`;

    // 2. Discover First Weekday Column Offset Index and Max Days Total Range Counts
    const firstDayIndexOffset = new Date(year, month, 1).getDay();
    const totalDaysInMonthCount = new Date(year, month + 1, 0).getDate();

    // 3. Render Empty Padding Cells for preceding calendar week column rows
    for (let i = 0; i < firstDayIndexOffset; i++) {
        daysGrid.insertAdjacentHTML('beforeend', `<div class="calendar-day-node empty-slot"></div>`);
    }

    // 4. Populate Live Day Block Cards Element Cells
    const systemRealDateToday = new Date();
    
    for (let dayNum = 1; dayNum <= totalDaysInMonthCount; dayNum++) {
        let specializedCssClasses = "calendar-day-node";
        
        // Match validation logic flags highlighting today's absolute calendar spot
        if (dayNum === systemRealDateToday.getDate() && 
            month === systemRealDateToday.getMonth() && 
            year === systemRealDateToday.getFullYear()) {
            specializedCssClasses += " current-today";
        }

        daysGrid.insertAdjacentHTML('beforeend', `
            <div class="${specializedCssClasses}" onclick="somaAlert('Viewing operational index calendar ledger for date record: ${month+1}/${dayNum}/${year}')">
                ${dayNum}
            </div>
        `);
    }
}

/**
 * Shifts the month window back or forward across timeline registers
 */
function shiftSomaMonth(directionModifier) {
    calendarActiveDateInstance.setMonth(calendarActiveDateInstance.getMonth() + directionModifier);
    initSomaCalendar(); // Re-render target parameters
}

// ==========================================
// 🖼️ PHOTOS VIEW CONTROL ENGINE BUSINESS LOGIC
// ==========================================
// Local memory tracking variables for scale and rotational transforms
let photoScaleFactor = 1.0;
let photoRotationDegrees = 0;

/**
 * 🖼️ Loads any clicked or input gallery image asset into focus and updates view layers
 */
function loadSelectedPhotoAsset(imgUrlPath) {
    if (typeof playSound === 'function') playSound('click');
    
    const imageWorkspaceGrid = document.getElementById('photo-gallery-grid');
    const targetRenderElement = document.getElementById('pic-viewer-render-target');
    const imageToolbarMatrix = document.getElementById('photo-toolbar-matrix');
    

    if (!targetRenderElement || !imageWorkspaceGrid) return;

    // Zero-out active transforms
    photoScaleFactor = 1.0;
    photoRotationDegrees = 0;
    targetRenderElement.style.transform = `scale(1) rotate(0deg)`;

    // Inject Image and swap layout blocks
    targetRenderElement.src = imgUrlPath;
    targetRenderElement.style.display = 'block';
    imageWorkspaceGrid.style.display = 'none';

    // Slide up active manipulation controls
    if (imageToolbarMatrix) {
        imageToolbarMatrix.style.display = 'flex';
    }
}

/**
 * Manual stream link trigger hook
 */
function triggerManualPhotoLoad() {
    if (typeof playSound === 'function') playSound('click');
    const userImageStreamInput = prompt("Enter secure image resource URL:", "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800");

    if (userImageStreamInput && userImageStreamInput.trim().startsWith('https://')) {
        loadSelectedPhotoAsset(userImageStreamInput.trim());
    } else if (userImageStreamInput) {
        somaAlert("Security Alert: Invalid secure resource link path.");
    }
}

/**
 * 🧹 Clears active photo states and restores view back to the horizontal Matrix Grid workspace
 */
/**
 * 🧹 Clears active photo states and restores view back to the horizontal Matrix Grid workspace
 */
function resetPhotoViewer() {
    if (typeof playSound === 'function') playSound('click');

    const imageWorkspaceGrid = document.getElementById('photo-gallery-grid');
    const targetRenderElement = document.getElementById('pic-viewer-render-target');
    const imageToolbarMatrix = document.getElementById('photo-toolbar-matrix');

    // 🌟 RESET HEADER TITLE TO DEFAULT (No file name)
    const picHeader = document.querySelector('#app-pictures .window-header #window-title') || 
                      document.querySelector('#app-pictures .window-header .header-title');
    if (picHeader) {
        picHeader.innerText = "Photos"; // Reverts back to clean default
    }

    // Tear down active transformation tracking properties
    photoScaleFactor = 1.0;
    photoRotationDegrees = 0;

    if (targetRenderElement) {
        targetRenderElement.style.transform = `scale(1) rotate(0deg)`;
        targetRenderElement.style.display = 'none';
        targetRenderElement.src = ''; 
    }

    // Return to default Horizontal Grid view
    if (imageWorkspaceGrid) {
        imageWorkspaceGrid.style.display = 'flex';
    }

    // Hide processing adjustments bar
    if (imageToolbarMatrix) {
        imageToolbarMatrix.style.display = 'none';
    }
}

// Example desktop shortcut trigger:
function triggerPhotosShortcut() {
    openApp('app-pictures');
    
    // Reset to default on normal manual app opening
    const picHeader = document.querySelector('#app-pictures .window-header #window-title') || 
                      document.querySelector('#app-pictures .window-header .header-title');
    if (picHeader) {
        picHeader.innerText = "Photos"; 
    }
    
    // Also ensure the gallery grid is displayed and the image is cleared
    resetPhotoViewer(); 
}
/**
 * Zoom operations
 */
function adjustPhotoScale(incrementValue) {
    const targetRenderElement = document.getElementById('pic-viewer-render-target');
    if (!targetRenderElement) return;

    photoScaleFactor = Math.max(0.2, Math.min(3.0, photoScaleFactor + incrementValue));
    targetRenderElement.style.transform = `scale(${photoScaleFactor}) rotate(${photoRotationDegrees}deg)`;
}

/**
 * Rotate operations
 */
function rotatePhotoDeg() {
    const targetRenderElement = document.getElementById('pic-viewer-render-target');
    if (!targetRenderElement) return;

    photoRotationDegrees = (photoRotationDegrees + 90) % 360;
    targetRenderElement.style.transform = `scale(${photoScaleFactor}) rotate(${photoRotationDegrees}deg)`;
}
/**
 * 📄 UTILITY STRUCTURAL MATRIX CALCULATOR
 */
function applyPhotoTransformations(imgEl) {
    imgEl.style.transform = `scale(${currentPhotoZoomScale}) rotate(${currentPhotoRotationAngle}deg)`;
}

// ==========================================
// 📸 SOMA CORE CAMERA HARDWARE DRIVER ENGINE
// ==========================================
let mediaStreamTrackerInstance = null; // Caches hardware driver states

/**
 * Open Application and bind active webcam tracking devices
 */
function openCameraApp(windowId) {
    const winEl = document.getElementById(windowId);
    if (!winEl) return;
    winEl.classList.remove('hidden');
    winEl.classList.remove('minimized');
    focusAppWindow(windowId);
    activeRunningApps[windowId] = winEl.querySelector('.window-header span:nth-child(2)').innerText;
    renderTaskbarTrays();
    const camWin = document.getElementById('app-camera');
    if (!camWin) return;

    camWin.classList.remove('hidden');
    if (typeof playSound === 'function') playSound('click');

    const videoElement = document.getElementById('camera-stream-preview');

    // Request active video streams via Navigator browser interfaces
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false })
            // Inside your .then() block in openCameraApp():
.then(function (stream) {
    mediaStreamTrackerInstance = stream;
    videoElement.srcObject = stream;
    videoElement.play();
    
    // ✨ ADD THIS LINE: Hide the status message when the stream is active
    document.getElementById('camera-status-msg').style.display = 'none';
})
            .catch(function (err) {
                somaAlert("Soma Hardware Interface Error: Unable to access system video input stream hardware devices.");
            });
    } else {
        somaAlert("Soma Feature Fault: Video hardware input interfaces are not supported on this browser host environment platform.");
    }
    
}

/**
 * Snap photo image and record data values instantly to filesystem database nodes
 */
function takeCameraSnapshot() {
    const video = document.getElementById('camera-stream-preview');
    const canvas = document.getElementById('camera-capture-canvas');
    
    if (!video || !canvas || !mediaStreamTrackerInstance) return;

    const ctx = canvas.getContext('2d');
    
    // Draw the active image frame from the video track onto the hidden canvas sector
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Transform layout content maps into base64 Data URL frames
    const snapshotDataUrl = canvas.toDataURL('image/jpeg');
    const imageTimestampName = `Capture_${Date.now()}.jpg`;

    // Inject direct file record structures down onto the standard target directory array paths
    if (somaFileSystem['my-space/pictures']) {
        somaFileSystem['my-space/pictures'].items.push({
            icon: '🖼️',
            name: imageTimestampName,
            type: 'image',
            content: snapshotDataUrl,
            meta: 'Camera Capture Snapshot File'
        });

        // Save modifications into LocalStorage via existing systems
        if (typeof commitFileSystem === 'function') {
            commitFileSystem();
        }

        // Notify User
        if (typeof playSound === 'function') playSound('click');
        somaAlert(`📸 Snapshot Saved! Saved securely inside your "Pictures" directory registry as: ${imageTimestampName}`);

        // If the active File Explorer is viewing Pictures folder right now, force clear and redraw
        if (currentActiveDirectoryKey === 'my-space/pictures' && typeof openWindow === 'function') {
            openWindow('my-space/pictures');
        }
    }
}

/**
 * Shut down webcam device tracks properly to save client memory heaps
 */
function closeCameraApp(windowId) {
    const winEl = document.getElementById(windowId);
    if (!winEl) return;
    playSound('click');
    winEl.classList.add('hidden');
    delete activeRunningApps[windowId];
    renderTaskbarTrays();
    const camWin = document.getElementById('app-camera');
    if (camWin) camWin.classList.add('hidden');

    const videoElement = document.getElementById('camera-stream-preview');

    if (mediaStreamTrackerInstance) {
        // Kill tracks safely
        mediaStreamTrackerInstance.getTracks().forEach(track => track.stop());
        mediaStreamTrackerInstance = null;
    }

    if (videoElement) {
        videoElement.srcObject = null;
    }
}


/**
 * 🪐 SOMA 2.0 IMMERSIVE SYSTEM DIALOG CONTROLLER
 * Replaces default alert() natively
 * * @param {string} title - The dialog box header
 * @param {string} message - The system alert context
 * @param {string} icon - Optional custom emoji parameter (default: ⚠️)
 */
function somaAlert(title, message, icon = '⚠️') {
    // Play system notification sound if exist
    if (typeof playSound === 'function') playSound('notification');

    const alertOverlay = document.getElementById('soma-alert-overlay');
    const alertTitle = document.getElementById('soma-alert-title');
    const alertMessage = document.getElementById('soma-alert-message');
    const alertIcon = document.getElementById('soma-alert-icon-target');

    if (!alertOverlay || !alertTitle || !alertMessage) {
        // Fallback safety in case DOM fails to load the alert element
        alert(message);
        return;
    }

    // Assign parameters dynamically
    alertTitle.innerText = title;
    alertMessage.innerText = message;
    if (alertIcon) alertIcon.innerText = icon;

    // Trigger visual opening transition
    alertOverlay.style.display = 'flex';
    setTimeout(() => {
        alertOverlay.classList.add('soma-alert-active');
    }, 10);
}

/**
 * Closes the active Soma system alert window cleanly
 */
function closeSomaAlert() {
    if (typeof playSound === 'function') playSound('click');

    const alertOverlay = document.getElementById('soma-alert-overlay');
    if (!alertOverlay) return;

    alertOverlay.classList.remove('soma-alert-active');
    
    // Completely hide after transition finishes
    setTimeout(() => {
        if (!alertOverlay.classList.contains('soma-alert-active')) {
            alertOverlay.style.display = 'none';
        }
    }, 300);
}
const canvas = document.getElementById('soma-canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

/**
 * 🎨 1. Initialize canvas size and brush settings
 */
function initPaint() {
    if (!canvas) return;
    
    // Ensure canvas matches its container dimensions
    const container = canvas.parentElement;
    canvas.width = container.clientWidth || canvas.offsetWidth || 700;
    canvas.height = container.clientHeight || canvas.offsetHeight || 460;
    
    // Configure default brush join qualities
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

/**
 * 🖌️ 2. Core Drawing Engine (Single, Cleaned Definition)
 */
function draw(e) {
    if (!drawing) return;

    const colorPicker = document.getElementById('paint-color');
    const sizePicker = document.getElementById('paint-size');

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Apply exact current input styles
    ctx.strokeStyle = colorPicker ? colorPicker.value : '#a29bfe';
    ctx.lineWidth = sizePicker ? sizePicker.value : 4;

    // Render path segment
    ctx.lineTo(x, y);
    ctx.stroke();

    // Advance path anchor to current cursor position
    ctx.beginPath();
    ctx.moveTo(x, y);
}

/**
 * 🕹️ 3. Precision Mouse Event Listeners
 */
if (canvas) {
    canvas.addEventListener('mousedown', (e) => {
        drawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set explicit starting point before drawing
        ctx.beginPath();
        ctx.moveTo(x, y);
        draw(e);
    });

    canvas.addEventListener('mouseup', () => {
        drawing = false;
        ctx.beginPath();
    });

    canvas.addEventListener('mouseleave', () => {
        drawing = false;
        ctx.beginPath();
    });

    canvas.addEventListener('mousemove', draw);
}

/**
 * 🧹 4. Utility Actions
 */
function clearCanvas() {
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function saveCanvas() {
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'Soma-Masterpiece.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Initial Call
initPaint();


// ── SERVICE WORKER ──
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
