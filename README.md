# 🌸 SomaOS

An ultra-sleek, interactive **AI-Native Operating System web ecosystem simulation layer** built with highly responsive glassmorphic aesthetics. SomaOS creates an adaptive environment where files, disks, and terminal parameters communicate with an in-memory Virtual File System (VFS) across both Graphical User Interfaces (GUI) and Command Line Interfaces (CLI).

---

## ✨ Core Features

### 🎛️ Adaptive OS Context Menu Layers

* **Contextual Selection Awareness:** Right-clicking anywhere over the blank workspace background presents global configuration wrappers like *Refresh*, *Personalize Theme*, or *Open in Terminal*.
* **Visual Object Target Tracking:** Right-clicking targeted file elements or workspace icons dynamically alters the context options on the fly, offering *Open Item*, *Rename / Update*, and *Delete Item*.
* **Active-Selected Spotlights:** Elements gain a smooth glow outline upon right-click execution, clearly signifying exactly which item is focused.

### 📁 Unified Hybrid CRUD VFS Architecture

* **Full CRUD Support:** Perform *Create, Read, Update, and Delete* commands smoothly across both visual folders and plain text file elements.
* **Dual-Modality Synchronization Engine:** The JavaScript file system state seamlessly updates in real time. Actions performed visually inside the GUI File Explorer reflect instantly inside the CLI Terminal logs, and vice versa!
* **Dynamic Virtual Storage Allocators:** Provision local storage volume boundaries via the graphical action pill system or the `disk-create` command line loop to expand into custom mounts.

### 🖳 Soma CMD Intelligent Terminal Subsystem

* **Live Interactive Guide Hints:** Displays a dynamic suggestion overlay banner directly within the input prompt frame based on what you are actively typing.
* **Predictive Diagnostics & Safe Boundaries:** Analyzes virtual operational configurations at runtime, providing real-time warnings when simulated processes or open panel thresholds push RAM overhead past 80%.

### 📅 Native Calendar App Suite

* **Interactive Month Calendars:** A built-in graphical calendar application that dynamically parses dates, grids active day nodes, highlights the current calendar date, and supports full temporal stepping step parameters (`◀` / `▶`).

---

## 🛠️ Human Operational Guide & Command Syntaxes

The underlying CLI engine accepts human-centric, readable operational commands. Type `help` inside **Soma CMD** at any time to review active operators:

| Command | Category | Purpose / Description |
| --- | --- | --- |
| `help` | System | Audits and prints all active operator schematics. |
| `clear` | System | Wipes terminal console view traces and screen layout lines. |
| `disk` | Storage | Inspects active system device partitioning and mounting paths. |
| `disk-create` | **CREATE** | Formats raw block space and provisions the `Local Disk D:` layout link. |
| `create folder [name]` | **CREATE** | Allocates structural directory trees sequence lines into active VFS roots. |
| `create file [name]` | **CREATE** | Generates raw text data record nodes mapping specified extensions. |
| `files` / `ls` / `dir` | **READ** | Scans and prints directory paths layout strings on active partitions. |
| `read [filename]` | **READ** | Streams internal document buffers out into console display text. |
| `rename [old] to [new]` | **UPDATE** | Rewrites directory reference identity label strings inside active schemas. |
| `delete [item_name]` | **DELETE** | Purges target workspace paths and sweeps matching storage registers. |

---

## 📂 Project Architecture Blueprint

```bash
├── index.html            # Core DOM Layout Workspace Containers, System App Windows & Context Menus
├── style.css             # Glassmorphism Layout Stylesheet Rules & Dynamic Adaptive Themes
└── script.js             # VFS Data Store Engine, Core Window Drag/Drop, and CRUD Command Processors

```

---

## 🚀 Getting Started

1. **Clone the Repository:**
```bash
git clone https://github.com/Mohith933/SomaOS.git
cd SomaOS

```
2. **Launch Environment:**
Simply open `index.html` inside any standard web browser, or launch using an editor preview extension like *Live Server*.
3. **Usage Experimentation Flow:**
* **GUI Mode:** Right-click blank space to add folders or documents. Right-click any created element to edit or drop them in the recycle bin.
* **Terminal Mirroring:** Launch **Soma CMD**, type `create file human_notes.txt`, then head over to the visual file layout to verify your newly provisioned node rendered perfectly!
