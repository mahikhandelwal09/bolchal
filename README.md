# BolChal — Impromptu Speech Practice & Fluency Trainer

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **BolChal** is a minimalist, distraction-free speech practice application engineered for public speakers, debaters, interviewees, and communicators who want to master thinking on their feet and speaking impromptu with structure.

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Project Objectives](#-project-objectives)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture & Design System](#-architecture--design-system)
- [Project Folder Structure](#-project-folder-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Local Development](#local-development)
  - [Production Build](#production-build)
- [Environment Configuration](#-environment-configuration)
- [Deployment Guide](#-deployment-guide)
- [Contributing](#-contributing)
- [License & Author](#-license--author)

---

## 🌟 Project Overview

**BolChal** (Hindi/Urdu for *"conversational speech"* or *"parlance"*) transforms spontaneous public speaking training into an elegant, daily practice. Inspired by impromptu speaking exercises, BolChal spins random thoughtful topics across multiple niches, presents clean time-boxed speaking phases, integrates real-time webcam feedback, and offers audio chimes with seamless offline-first local storage.

Whether preparing for an impromptu table topics speech, a rapid-fire behavioral job interview, or developing structured impromptu articulation, BolChal provides the ideal environment to hone your delivery.

---

## 🎯 Problem Statement

Most people struggle with impromptu speaking not due to a lack of ideas, but because of:
1. **Cognitive Overload & Stage Anxiety**: Freezing up when put on the spot without structured preparation.
2. **Lack of Visual Feedback**: Practicing without observing one's facial expressions, eye contact, and body language.
3. **Pacing and Structure Disorganization**: Rambling past the time limit or losing the thread between introduction, body, and conclusion.
4. **Distracting Practice Interfaces**: Overly complex productivity apps that induce cognitive fatigue rather than calm focus.
5. **Screen Reflections During Self-Recording**: Bright white computer screens casting harsh glare into phone camera lenses when recording speech videos.

---

## 🚀 Project Objectives

- **Frictionless Practice**: Start a topic spin and timed practice in a single click.
- **Cognitive Clarity**: Provide a calming, biophilic design language that lowers sympathetic nervous system arousal.
- **Dual Training Modes**:
  - **Off the Cuff**: Instant 60-second speech without prep to train fast instinctual articulation.
  - **Deep Research**: 10-minute research/ideation phase followed by focused speech delivery.
- **Real-Time Visuals**: Integrated webcam monitor with a horizontal mirror mode that matches mirror reflection physics.
- **Anti-Glare Recording**: A dedicated **Low Glare** matte theme designed specifically for recording speeches with a mobile phone without screen reflections.
- **Habit Tracking**: An integrated Day Counter streak display (`DAY 04 / 30`) to build consistent daily discipline.

---

## ✨ Key Features

### 1. Dual Speaking Modes
- **Off the Cuff**: Spin a topic, read the 3-stage speech arc (Introduction, Core Idea, Conclusion), and deliver a spontaneous speech.
- **Deep Research**: Set a dedicated research timer to read, brainstorm, and take notes before delivering your speech.

### 2. Category Niches & Topic Randomizer
- Mechanical rolling slot reel animation with authentic sound synthesis ticks.
- Diverse categories including **General**, **Philosophy & Ethics**, **Society & Culture**, **Technology & Future**, **Personal Growth**, and **Deep Research**.

### 3. Integrated Top Controls Toolbar
- Compact, pill-shaped control bar situated in the top-right corner.
- **Theme Selector**: One-click dropdown to quickly preview and switch palettes.
- **Camera Toggle**: Activate/deactivate webcam video stream with active visual indicators.
- **Mirror Mode**: Horizontally flips the practice stage and camera preview like a real mirror while keeping navigation controls perfectly upright and readable.

### 4. Six Adaptive Color Themes
- **Sage Studio** *(Default Recommended)*: Calming botanical jade and desaturated forest greens (12.8:1 AAA contrast).
- **Low Glare** *(Recording Mode)*: Deep matte charcoal and soft warm bone typography to eliminate phone camera reflections.
- **Original Minimal**: Authentic obsidian and warm terracotta.
- **Warm Ivory**: Clean parchment editorial styling for daylight environments.
- **Midnight**: Deep abyssal navy with electric cobalt accents for nocturnal focus.
- **Lavender Mist**: Dusky amethyst and pale lilac for creative introspection.

### 5. Video Recording, Playback & Download
- Record speaking sessions in real-time via the browser's native `MediaRecorder` API.
- Instant review modal with playback controls and `.webm` file downloads (`bolchal-practice-<topic>.webm`).

### 6. Inline Habit Day Counter
- Clean streak counter (`DAY 04 / 30`) placed in the visual space above the action buttons.
- Fully customizable in Settings with input validation, real-time preview, and persistent `localStorage` synchronization.

### 7. Synthesized Web Audio
- High-fidelity synthetic mechanical reel clicks and landing chimes built natively with the Web Audio API without heavy external audio files.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Latest React version with optimized DOM rendering |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type-safety across all components and models |
| **Bundler & Dev Server** | [Vite 8](https://vite.dev/) | Lightning-fast HMR and optimized asset bundling |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent, lightweight SVG icons |
| **Styling** | Pure CSS3 & Custom Properties | 100% themeable token system with zero CSS runtime overhead |
| **Media APIs** | WebRTC & MediaStream | Camera video streaming and in-browser WebM recording |
| **Sound Synthesis** | Web Audio API | Pure programmatic oscillators and buffer filters |
| **Linter** | Oxlint | High-performance Rust-based JavaScript/TypeScript linter |

---

## 🏛️ Architecture & Design System

BolChal follows a modular, component-driven client architecture:

```
┌────────────────────────────────────────────────────────┐
│                        App Shell                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │                     Top Bar                      │  │
│  │   [Speech Practice Badge]   [Theme|Camera|Mirror] │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Mirror Content Wrapper (scaleX)        │  │
│  │  ┌────────────────────────────────────────────┐  │  │
│  │  │              BolChal Heading               │  │  │
│  │  ├────────────────────────────────────────────┤  │  │
│  │  │  Stage: ModeSwitch + Reel + CameraView     │  │  │
│  │  ├────────────────────────────────────────────┤  │  │
│  │  │       Day Counter: DAY 04 / 30             │  │  │
│  │  ├────────────────────────────────────────────┤  │  │
│  │  │   Actions: [Spin] [Start Timer] [Settings] │  │  │
│  │  └────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │    Modals & Overlays (TimerOverlay, Playback)    │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

- **Theme Engine**: Dynamic CSS custom property injection on `:root` with automatic persistence in `localStorage`.
- **Mirroring Isolation**: Horizontal transformation is scoped to the presentation stage, ensuring control text and buttons remain unmirrored and easy to click.

---

## 📂 Project Folder Structure

```
bolchal/
├── public/
│   ├── favicon.svg            # BolChal brand favicon
│   └── icons.svg              # SVG symbol definitions
├── src/
│   ├── assets/                # Static image assets
│   ├── components/            # Reusable React components
│   │   ├── CameraView.tsx     # Webcam video display card & mirror view
│   │   ├── ModeSwitch.tsx     # Off the Cuff vs Deep Research toggle
│   │   ├── NicheSelect.tsx    # Topic category dropdown selector
│   │   ├── PlaybackModal.tsx  # Post-recording playback & WebM download
│   │   ├── Reel.tsx           # Slot reel rolling topic animation
│   │   ├── SettingsModal.tsx  # Timers, audio mute & Day Counter settings
│   │   ├── ThemeSelector.tsx  # Visual color palette grid switcher
│   │   └── TimerOverlay.tsx   # Fullscreen time-boxed speaking practice overlay
│   ├── data/
│   │   └── topics.ts          # Curated topic database across all niches
│   ├── utils/
│   │   └── audio.ts           # Web Audio API sound synthesizer
│   ├── App.css                # Base layout styles
│   ├── App.tsx                # Main application orchestrator
│   ├── index.css              # Global design system & theme definitions
│   ├── main.tsx               # React application entrypoint
│   └── themes.ts              # Six adaptive theme palette configurations
├── .env.example               # Example environment configuration
├── .gitignore                 # Git ignore rules for node_modules, build & secrets
├── .oxlintrc.json             # Oxlint configuration
├── CONTRIBUTING.md            # Contribution guidelines
├── LICENSE                    # MIT open-source license
├── package.json               # Project dependencies and npm scripts
├── tsconfig.json              # TypeScript root configuration
└── vite.config.ts             # Vite configuration with React plugin
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.0.0` or higher)
- [npm](https://www.npmjs.com/) (version `9.0.0` or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mahikhandelwal09/bolchal.git
   cd bolchal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Local Development

Run the Vite development server:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173/
```

### Production Build

Compile TypeScript and build the production-ready static assets:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## ⚙️ Environment Configuration

BolChal operates entirely client-side using browser-native APIs and requires zero external credentials or API keys. 

For custom hosting port or host configuration, refer to `.env.example`:
```bash
VITE_PORT=5173
VITE_HOST=localhost
```

---

## 🌐 Deployment Guide

Because BolChal is a pure static single-page application (SPA), it can be deployed instantly to any modern hosting platform:

### Deploy to Vercel
1. Install the Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root.
3. Build Command: `npm run build`
4. Output Directory: `dist`

### Deploy to Netlify
1. Connect your GitHub repository to Netlify.
2. Set Build Command: `npm run build`
3. Set Publish directory: `dist`

### Deploy to GitHub Pages
1. Install `gh-pages`: `npm install -D gh-pages`
2. Add `"deploy": "gh-pages -d dist"` to `package.json`.
3. Set `base: '/bolchal/'` in `vite.config.ts`.
4. Run `npm run build && npm run deploy`.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on code style, linting, and the pull request process.

---

## 📄 License & Author

- **Author**: Mahi Khandelwal ([@mahikhandelwal09](https://github.com/mahikhandelwal09))
- **License**: Released under the [MIT License](LICENSE).
