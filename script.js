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

function dragStart(e, windowId) {
    e.preventDefault();
    focusAppWindow(windowId);
    dragElementTarget = document.getElementById(windowId);
    if (!dragElementTarget) return;
    offX = e.clientX - dragElementTarget.offsetLeft;
    offY = e.clientY - dragElementTarget.offsetTop;
    document.addEventListener('mousemove', dragPerform);
    document.addEventListener('mouseup', dragEnd);
}

function dragPerform(e) {
    if (!dragElementTarget) return;
    requestAnimationFrame(() => {
        if (dragElementTarget) {
            dragElementTarget.style.left = `${e.clientX - offX}px`;
            dragElementTarget.style.top = `${e.clientY - offY}px`;
        }
    });
}

function dragEnd() {
    dragElementTarget = null;
    document.removeEventListener('mousemove', dragPerform);
    document.removeEventListener('mouseup', dragEnd);
}

// 📝 INDEPENDENT FLOATING APP ARCHITECTURE MANAGEMENT LOGIC
function openApp(windowId) {
    const winEl = document.getElementById(windowId);
    if (!winEl) return;
    winEl.classList.remove('hidden');
    winEl.classList.remove('minimized');
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

function restoreApp(windowId) {
    const winEl = document.getElementById(windowId);
    if (!winEl) return;
    playSound('clear');
    winEl.classList.remove('minimized');
    focusAppWindow(windowId);
    renderTaskbarTrays();
}

// ============================================================================
// 📁 EXTENDED FILESYSTEM MATRIX ENGINE TRACKER WITH LOCALSTORAGE PERSISTENCE
// ============================================================================
let currentActiveDirectoryKey = 'my-space'; 
let activeNotepadFileRef = null; // Tracks the name of the file open in Notepad

let somaFileSystem = JSON.parse(localStorage.getItem('soma_vfs')) || {
    'my-space': {
        title: 'My Space',
        items: [
            { icon: '📁', name: 'Documents', type: 'folder', target: 'my-space/documents', meta: 'User written records' }
        ]
    },
    'my-space/documents': {
        title: 'Documents',
        items: [
            { icon: '📝', name: 'Soma Architecture.txt', type: 'file', content: 'Soma OS Framework has uncoupled individual applications natively from file navigation trees successfully.', meta: 'Plain Text' }
        ]
    },
    'computer': {
        title: 'Computer Disk Root',
        items: [
            { icon: '💽', name: 'System Partition C:', type: 'folder', target: 'my-space', meta: 'Active OS System Drive' }
        ]
    },
    'recycle-bin': { title: 'Recycle Bin', items: [] }
};

// Helper function to save file modifications safely
function commitFileSystem() {
    localStorage.setItem('soma_vfs', JSON.stringify(somaFileSystem));
}

/**
 * 🪟 REWRITTEN OPEN WINDOW CONTROLLER
 */
function openWindow(spaceKey) {
    currentActiveDirectoryKey = spaceKey; 
    playSound('click')
    
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
        // Direct safe lookup approach prevents backtick quote error breakage entirely
        let action = item.type === 'folder' 
            ? `openWindow('${item.target}')` 
            : `launchAppTextContent('${item.name}')`;

        // Right click context registration helper attributes mapping
        gridEl.insertAdjacentHTML('beforeend', `
            <div class="file-card" data-name="${item.name}" data-index="${index}" onclick="${action}">
                <div class="card-icon">${item.icon}</div>
                <div class="card-name">${item.name}</div>
                <div class="card-meta">${item.meta || 'System Data Document'}</div>
            </div>
        `);
    });

    renderExplorerGuiActionButtons();

    document.querySelectorAll('.explorer-sidebar .sidebar-item').forEach(el => el.classList.remove('active'));
    if (spaceKey === 'my-space') document.getElementById('sb-my-space')?.classList.add('active');
    if (spaceKey === 'computer' || spaceKey === 'computer/disk-d') document.getElementById('sb-computer')?.classList.add('active');
    if (spaceKey === 'recycle-bin') document.getElementById('sb-recycle-bin')?.classList.add('active');

    activeRunningApps['system-window'] = `Files: ${activeData.title}`;
    renderTaskbarTrays();
}

/**
 * 🛠️ CONTEXTUAL BUTTON GENERATOR FOR FILE MANAGER ACTION BAR
 */
function renderExplorerGuiActionButtons() {
    const actionBtnBox = document.getElementById('explorer-action-buttons');
    if (!actionBtnBox) return;

    actionBtnBox.innerHTML = ''; 

    if (currentActiveDirectoryKey === 'computer') {
        if (!somaFileSystem['computer/disk-d']) {
            actionBtnBox.innerHTML = `<button class="gui-action-pill" onclick="guiCreateLocalDiskD()">➕ Create Local Disk D</button>`;
        } else {
            actionBtnBox.innerHTML = `<span style="font-size:0.78rem; color:var(--text-muted); font-style:italic;">All partitions active</span>`;
        }
    } 
    else if (currentActiveDirectoryKey !== 'recycle-bin') {
        actionBtnBox.innerHTML = `
            <button class="gui-action-pill" onclick="guiCreateNewElement('folder')">📁 + New Folder</button>
            <button class="gui-action-pill" onclick="guiCreateNewElement('file')">📝 + New File</button>
        `;
    }
}

/**
 * FILE CREATION HANDLER
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
        const finalName = sanitizedName.endsWith('.txt') ? sanitizedName : `${sanitizedName}.txt`;
        somaFileSystem[currentActiveDirectoryKey].items.push({
            icon: '📝',
            name: finalName,
            type: 'file',
            content: `This text content was generated inside the new file named: ${sanitizedName}`,
            meta: 'Plain Text Document'
        });
    }

    commitFileSystem();
    openWindow(currentActiveDirectoryKey);
}

/**
 * VIRTUAL DISK PARTITION PROVISIONER HANDLER
 */
function guiCreateLocalDiskD() {
    somaFileSystem['computer/disk-d'] = {
        title: 'Local Disk D:',
        items: []
    };

    somaFileSystem['computer'].items.push({
        icon: '💽',
        name: 'Local Disk D:',
        type: 'folder',
        target: 'computer/disk-d',
        meta: '150GB Storage Volume'
    });

    const sidebar = document.querySelector('.explorer-sidebar');
    if (sidebar) {
        const rbNode = document.getElementById('sb-recycle-bin');
        const newSidebarItem = document.createElement('div');
        newSidebarItem.className = 'sidebar-item';
        newSidebarItem.id = 'sb-disk-d';
        newSidebarItem.innerHTML = `💽 Local Disk D`;
        newSidebarItem.onclick = function() { openWindow('computer/disk-d'); };
        sidebar.insertBefore(newSidebarItem, rbNode);
    }

    alert("GUI Partition Mount Success: Created and mounted Local Disk D: into Soma system trees securely.");
    commitFileSystem();
    openWindow('computer');
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
        'app-calendar' : '📅'
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
function updateTerminalSuggestions(currentValue) {
    const suggBox = document.getElementById('term-suggestions');
    if (!suggBox) return;
    const query = currentValue.trim().toLowerCase();

    if (!query) {
        suggBox.innerHTML = "💡 Tip: Start typing a command like 'files', 'create folder', 'mem', or 'disk'...";
        return;
    }

    if (query.startsWith('crea') || query.startsWith('mkdir')) {
        suggBox.innerHTML = "📝 <b>VFS Guide:</b> Type <code>create folder [name]</code> or <code>create file [name]</code> to add items.";
    } else if (query.startsWith('fil') || query.startsWith('ls')) {
        suggBox.innerHTML = "📂 <b>VFS Guide:</b> Type <code>files</code> to reveal everything inside the active GUI window path.";
    } else {
        suggBox.innerHTML = "🎯 Press <code>Enter</code> to execute the command script.";
    }
}

function handleTerminalCommand(e) {
    if (e.key !== 'Enter') return;
    
    const inputEl = e.target;
    const rawInput = inputEl.value.trim();
    const args = rawInput.split(' ');
    const cmd = args[0].toLowerCase();
    const out = document.getElementById('term-out');
    
    let res = `\nCommand '${cmd}' unrecognized. Type 'help' to review basic operators.`;

    const activeDirectory = somaFileSystem[currentActiveDirectoryKey];

    if (cmd === 'help') {
        res = `\n=== SOMA OPERATOR SCHEMATICS ===
 -> 'create folder [name]' : Creates a new folder directory in active GUI window path
 -> 'create file [name]'   : Generates a plain text file asset in active GUI window path
 -> 'files'                : Lists directory structure entries inside current active folder path
 -> 'mem'                  : Examines system RAM volatile heap tracking values
 -> 'disk'                 : Inspect status fields for active device partitions
 -> 'clear'                : Flushes the console buffer clean`;
    } 
    else if (cmd === 'clear') { 
        out.innerText = ''; 
        inputEl.value = ''; 
        updateTerminalSuggestions('');
        return; 
    } 
    // Synchronized File/Folder Creation
    else if (cmd === 'create' || cmd === 'mkdir') {
        const subType = args[1] ? args[1].toLowerCase() : '';
        const nameParam = args.slice(2).join(' ');

        if (!nameParam) {
            res = `\nAllocation Error: Please specify a name parameter. Example: 'create folder ProjectWorkspace'`;
        } else if (subType === 'folder') {
            const targetPath = `${currentActiveDirectoryKey}/${nameParam.toLowerCase().replace(/\s+/g, '-')}`;
            activeDirectory.items.push({
                icon: '📁', name: nameParam, type: 'folder', target: targetPath, meta: 'Terminal Provisioned Folder'
            });
            somaFileSystem[targetPath] = { title: nameParam, items: [] };
            commitFileSystem();
            res = `\nSuccess: Folder directory '${nameParam}' created in current location context maps.`;
        } else if (subType === 'file') {
            const finalTxtName = nameParam.endsWith('.txt') ? nameParam : `${nameParam}.txt`;
            activeDirectory.items.push({
                icon: '📝', name: finalTxtName, type: 'file', content: `Created using Soma Terminal line utilities on ${new Date().toLocaleDateString()}`, meta: 'Plain Text'
            });
            commitFileSystem();
            res = `\nSuccess: Plain text file '${finalTxtName}' written onto active cluster index records.`;
        }
    }
    // Synchronized Directory File Listing
    else if (cmd === 'files' || cmd === 'ls' || cmd === 'dir') {
        res = `\n=== CONTENTS FOR ACTIVE DIRECTORY: (${activeDirectory.title}) ===`;
        if (activeDirectory.items.length === 0) {
            res += `\n  (Directory is completely empty)`;
        } else {
            activeDirectory.items.forEach(item => {
                res += `\n  ${item.icon}  [${item.type.toUpperCase()}]  ${item.name}`;
            });
        }
    }
    else if (cmd === 'mem') {
        let openWindowsCount = document.querySelectorAll('.window:not(.hidden)').length;
        let dynamicAppUsage = openWindowsCount * 512; 
        let currentFree = 16384 - (4112 + dynamicAppUsage);
        let percentage = Math.round(((16384 - currentFree) / 16384) * 100);

        res = `\n=== VOLATILE MEMORY REGISTERS ENGINE ===
 Allocation Profile  : 16384 MB Virtual RAM
 Core Os Framework   : 4112 MB Reserved Heap Space
 Active App Overheads: ${dynamicAppUsage} MB Layered Allocations
 Current Free Sector : ${currentFree} MB Free space registers remaining
 Execution State     : ${percentage}% Loaded.`;
    }
    else if (cmd === 'disk') {
        res = `\n=== VIRTUAL DISK ARRANGEMENT CONTROLLER ===
[Volume C:] Label: SomaSystem | 42GB / 100GB Allocation Clusters Used`;
        if (somaFileSystem['computer/disk-d']) {
            res += `\n[Volume D:] Label: Local Disk D | 0GB / 150GB Allocation Clusters Used`;
        } else {
            res += `\n[Unallocated Space Register] Found 150GB raw block clusters.`;
        }
    }

    out.innerText += `\nsoma ~ $ ${rawInput}${res}\n\n`;
    out.scrollTop = out.scrollHeight;
    inputEl.value = '';
    updateTerminalSuggestions('');
    
    // Instantly trigger open window GUI visual synchronization re-render loop
    openWindow(currentActiveDirectoryKey);
}
/**
 * Simplified Human Manual GUI trigger to create folders without confusing loops
 */
function triggerCreateFolderGUI() {
    const name = prompt("Enter a human operational name for your new folder:", "New Folder");
    if (!name || !name.trim()) return;

    const safeName = name.trim();
    
    // Inject the new configuration array entry directly into the filesystem structures
    if (somaFileSystem[activeSpaceKey]) {
        somaFileSystem[activeSpaceKey].items.push({
            icon: '📁',
            name: safeName,
            type: 'folder',
            target: `${activeSpaceKey}/${safeName.toLowerCase().replace(/\s+/g, '-')}`,
            meta: 'User Created Workspace'
        });
        
        // Refresh the folder layout instantly
        refreshExplorerWorkspaceView();
    }
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
    document.body.classList.toggle('dark-theme');
}
// ==========================================
// 🎵 AUDIO PLAYER BUSINESS LOGIC 
// ==========================================
let musicTracksData = [
    { title: "Lo-Fi Chill Focus Beats", icon: "🌌" },
    { title: "Neo-Soma Vapor Pipeline", icon: "🎆" },
    { title: "Hridaya Heartbeat Core Ambient", icon: "✨" }
];
let currentMusicIndex = 0;
let isMusicPlaying = false;
let musicTickerInterval = null;
let musicPercentComplete = 35;

function toggleMusicPlayback() {
    const playBtn = document.getElementById('music-play-trigger');
    const vinyl = document.getElementById('music-vinyl');
    isMusicPlaying = !isMusicPlaying;

    if (isMusicPlaying) {
        playBtn.innerText = "⏸";
        vinyl.classList.add('vinyl-spin-animation');
        
        musicTickerInterval = setInterval(() => {
            musicPercentComplete += 1;
            if (musicPercentComplete > 100) musicPercentComplete = 0;
            document.getElementById('music-progress-fill').style.width = `${musicPercentComplete}%`;
        }, 800);
    } else {
        playBtn.innerText = "▶";
        vinyl.classList.remove('vinyl-spin-animation');
        clearInterval(musicTickerInterval);
    }
}

function changeMusicTrack(dir) {
    currentMusicIndex += dir;
    if (currentMusicIndex >= musicTracksData.length) currentMusicIndex = 0;
    if (currentMusicIndex < 0) currentMusicIndex = musicTracksData.length - 1;
    
    document.getElementById('music-track-name').innerText = musicTracksData[currentMusicIndex].title;
    document.getElementById('music-vinyl').innerText = musicTracksData[currentMusicIndex].icon;
    
    musicPercentComplete = 0;
    document.getElementById('music-progress-fill').style.width = '0%';
    
    if (!isMusicPlaying) toggleMusicPlayback();
}

// ==========================================
// 🎬 VIDEO PLAYER BUSINESS LOGIC
// ==========================================
let isVideoPlaying = false;
let videoFrameInterval = null;
let videoPercentComplete = 0;
let videoSymbols = ["🌌", "🪐", "🌟", "☄️", "🚀", "🛸"];
let videoSymbolCounter = 0;

function toggleVideoPlayback() {
    const btn = document.getElementById('video-play-btn');
    const screenMsg = document.getElementById('video-status-msg');
    const graphic = document.getElementById('video-graphic');
    
    isVideoPlaying = !isVideoPlaying;
    
    if(isVideoPlaying) {
        btn.innerText = "⏸ Pause";
        screenMsg.style.display = 'none';
        graphic.style.display = 'block';
        
        videoFrameInterval = setInterval(() => {
            videoPercentComplete += 2;
            if (videoPercentComplete > 100) {
                videoPercentComplete = 0;
                resetVideoPlayer();
                return;
            }
            document.getElementById('video-progress-fill').style.width = `${videoPercentComplete}%`;
            
            // Frame symbol changer to simulate movement
            if(videoPercentComplete % 10 === 0) {
                videoSymbolCounter = (videoSymbolCounter + 1) % videoSymbols.length;
                graphic.innerText = videoSymbols[videoSymbolCounter];
            }
        }, 150);
    } else {
        btn.innerText = "▶ Play";
        clearInterval(videoFrameInterval);
    }
}

function resetVideoPlayer() {
    clearInterval(videoFrameInterval);
    isVideoPlaying = false;
    videoPercentComplete = 0;
    document.getElementById('video-progress-fill').style.width = '0%';
    document.getElementById('video-play-btn').innerText = "▶ Play";
    document.getElementById('video-status-msg').style.display = 'block';
    document.getElementById('video-graphic').style.display = 'none';
}

// ==========================================
// 🕹️ RETRO SNAKE ARCADE GAME ENGINE LOGIC
// ==========================================
let snakeCanvas, snakeCtx;
let snakeGameTimer = null;
let snakeGridSize = 15;
let snakeBody = [];
let snakeDirection = { x: 0, y: 0 };
let snakeTargetFood = { x: 0, y: 0 };
let snakeCurrentScore = 0;
let snakeHighScore = 0;
let isSnakeGameActive = false;

function initializeSnakeGame() {
    snakeCanvas = document.getElementById('snakeCanvas');
    snakeCtx = snakeCanvas.getContext('2d');
    
    // Reset state mechanics
    clearInterval(snakeGameTimer);
    snakeBody = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    snakeDirection = { x: 0, y: -1 }; // Move upward natively at execution start
    snakeCurrentScore = 0;
    document.getElementById('snake-score').innerText = snakeCurrentScore;
    isSnakeGameActive = true;
    
    spawnSnakeFood();
    
    // Bind Keyboard interception drivers explicitly inside the canvas application framework
    document.removeEventListener('keydown', captureSnakeKeyControls);
    document.addEventListener('keydown', captureSnakeKeyControls);
    
    document.getElementById('snake-start-btn').innerText = "🔄 Reboot Simulation";
    
    // Frame cycle tick runner (runs engine update rules at 100ms step bounds)
    snakeGameTimer = setInterval(processSnakeEngineTick, 110);
}

function captureSnakeKeyControls(e) {
    if (!isSnakeGameActive) return;
    
    // Intercept arrow events securely, blocking native window view scrolls
    switch(e.key) {
        case 'ArrowUp':
            if (snakeDirection.y === 0) snakeDirection = { x: 0, y: -1 };
            e.preventDefault();
            break;
        case 'ArrowDown':
            if (snakeDirection.y === 0) snakeDirection = { x: 0, y: 1 };
            e.preventDefault();
            break;
        case 'ArrowLeft':
            if (snakeDirection.x === 0) snakeDirection = { x: -1, y: 0 };
            e.preventDefault();
            break;
        case 'ArrowRight':
            if (snakeDirection.x === 0) snakeDirection = { x: 1, y: 0 };
            e.preventDefault();
            break;
    }
}

function spawnSnakeFood() {
    const cellsInRow = snakeCanvas.width / snakeGridSize;
    snakeTargetFood = {
        x: Math.floor(Math.random() * cellsInRow),
        y: Math.floor(Math.random() * cellsInRow)
    };
    
    // Prevent spawning food on top of the snake body
    for (let segment of snakeBody) {
        if (segment.x === snakeTargetFood.x && segment.y === snakeTargetFood.y) {
            spawnSnakeFood();
            break;
        }
    }
}

function processSnakeEngineTick() {
    // 1. Compute upcoming Head coordinates based on trajectory vectors
    const newHead = {
        x: snakeBody[0].x + snakeDirection.x,
        y: snakeBody[0].y + snakeDirection.y
    };
    
    const maxIndex = snakeCanvas.width / snakeGridSize;
    
    // 2. Validate bounds collision rules
    if (newHead.x < 0 || newHead.x >= maxIndex || newHead.y < 0 || newHead.y >= maxIndex) {
        triggerSnakeGameOver();
        return;
    }
    
    // 3. Validate self-cannibalization collision rules
    for (let cell of snakeBody) {
        if (newHead.x === cell.x && newHead.y === cell.y) {
            triggerSnakeGameOver();
            return;
        }
    }
    
    // Add new node down onto the head index position
    snakeBody.unshift(newHead);
    
    // 4. Validate food capture consumption rules
    if (newHead.x === snakeTargetFood.x && newHead.y === snakeTargetFood.y) {
        snakeCurrentScore += 10;
        document.getElementById('snake-score').innerText = snakeCurrentScore;
        if (snakeCurrentScore > snakeHighScore) {
            snakeHighScore = snakeCurrentScore;
            document.getElementById('snake-highscore').innerText = snakeHighScore;
        }
        spawnSnakeFood();
    } else {
        // Pop off trailing tail cell elements if no food consumption sequence ran
        snakeBody.pop();
    }
    
    // 5. Render clear step sweeps onto canvas graphics space
    snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
    // Draw Food Node Target
    snakeCtx.fillStyle = '#ff7675';
    snakeCtx.beginPath();
    let radius = snakeGridSize / 2;
    snakeCtx.arc(snakeTargetFood.x * snakeGridSize + radius, snakeTargetFood.y * snakeGridSize + radius, radius - 1, 0, Math.PI * 2);
    snakeCtx.fill();
    
    // Draw Snake Array
    snakeBody.forEach((cell, idx) => {
        snakeCtx.fillStyle = idx === 0 ? '#00cec9' : '#00b894';
        snakeCtx.fillRect(cell.x * snakeGridSize + 1, cell.y * snakeGridSize + 1, snakeGridSize - 2, snakeGridSize - 2);
    });
}

function triggerSnakeGameOver() {
    clearInterval(snakeGameTimer);
    isSnakeGameActive = false;
    document.removeEventListener('keydown', captureSnakeKeyControls);
    
    // Flash game-over screens directly over the vector map array context
    snakeCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
    snakeCtx.fillStyle = '#ff7675';
    snakeCtx.font = 'bold 20px Courier New';
    snakeCtx.textAlign = 'center';
    snakeCtx.fillText('SIMULATION COLLAPSED', snakeCanvas.width / 2, snakeCanvas.height / 2 - 10);
    
    snakeCtx.fillStyle = '#ffffff';
    snakeCtx.font = '12px Courier New';
    snakeCtx.fillText('Press Start to Initialize', snakeCanvas.width / 2, snakeCanvas.height / 2 + 15);
    
    document.getElementById('snake-start-btn').innerText = "🎮 Restart Matrix";
}

// ==========================================
// ⚙️ SETTINGS WINDOW TAB & HARDWARE HARDLINK DRIVERS
// ==========================================
function switchSettingsTab(tabName) {
    // Toggle active state buttons visual design
    document.querySelectorAll('.settings-nav-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // Switch panels visibility grids
    document.querySelectorAll('.settings-pane').forEach(pane => pane.style.display = 'none');
    document.getElementById(`set-tab-${tabName}`).style.display = 'block';
}

function changeWallpaper(cssBackgroundValue) {
    // Dynamically re-paint desktop backdrop layout
    document.getElementById('desktop').style.background = cssBackgroundValue;
}

function toggleHardwareState(type) {
    if (type === 'wifi') {
        const isConnected = document.getElementById('settings-wifi-toggle').checked;
        const taskbarWifi = document.getElementById('sys-wifi');
        const lockWifi = document.getElementById('lock-wifi-icon');
        
        if (isConnected) {
            taskbarWifi.className = "fas fa-wifi";
            taskbarWifi.title = "Wi-Fi: Connected";
            if (lockWifi) lockWifi.className = "fas fa-wifi";
        } else {
            taskbarWifi.className = "fas fa-wifi-slash";
            taskbarWifi.title = "Wi-Fi: Disconnected";
            if (lockWifi) lockWifi.className = "fas fa-wifi-slash";
        }
    } else if (type === 'battery') {
        const isSavingMode = document.getElementById('settings-battery-toggle').checked;
        const taskbarBattery = document.getElementById('sys-battery');
        const lockBattery = document.getElementById('lock-battery-icon');
        
        if (isSavingMode) {
            taskbarBattery.className = "fas fa-battery-quarter";
            taskbarBattery.style.color = "#ff7675"; // Turns orange/red on eco low-power status
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
        "Initializing CPU Core Matrices... OK",
        "Checking RAM Stack Allocation [16384 MB Allocated]... OK",
        "Mounting Storage Drives: VFS /dev/sda1 [SomaCore Drive]... OK",
        "Loading Hardware Interlink Buses... OK",
        "Checking Network Adapters (Wi-Fi Engine status)... Handshake Established",
        "Launching OS Environment Bootloader Matrix Entry Point...",
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
function selectWizardAvatar(element, avatarSymbol) {
    document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    chosenSetupAvatar = avatarSymbol;
}

function commitUserAccountSetup() {
    const userNameInput = document.getElementById('setup-username-input').value.trim();
    const finalUserName = userNameInput !== "" ? userNameInput : "Creator";
    
    // Cache configuration items into browser local memory spaces safely
    localStorage.setItem('soma_profile_established', 'true');
    localStorage.setItem('soma_username', finalUserName);
    localStorage.setItem('soma_avatar', chosenSetupAvatar);
    
    // Sync active system tokens immediately across the global environment
    applySavedProfileCredentials();
    
    // Transition cleanly from Identity Setup over onto Stage 3 Operating Boot loader
    document.getElementById('setup-wizard-screen').classList.add('wizard-hidden');
    setTimeout(() => {
        document.getElementById('setup-wizard-screen').style.display = 'none';
        executeOsBootLoaderAnimation();
    }, 600);
}

function applySavedProfileCredentials() {
    const user = localStorage.getItem('soma_username') || "Creator";
    const avatar = localStorage.getItem('soma_avatar') || "🌸";
    
    // 1. Sync structures on Login Lock viewscreen card
    const loginAvatar = document.getElementById('login-display-avatar');
    const loginWelcome = document.getElementById('login-display-welcome');
    if (loginAvatar) loginAvatar.innerText = avatar;
    if (loginWelcome) loginWelcome.innerText = `Welcome back, ${user}`;
    
    // 2. Sync inside internal operating system Desktop drawers
    const startAvatar = document.getElementById('start-display-avatar') || document.querySelector('.start-avatar');
    const startUser = document.getElementById('start-display-username') || document.querySelector('.start-username');
    if (startAvatar) startAvatar.innerText = avatar;
    if (startUser) startUser.innerText = user;
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
            <div class="${specializedCssClasses}" onclick="alert('Viewing operational index calendar ledger for date record: ${month+1}/${dayNum}/${year}')">
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
