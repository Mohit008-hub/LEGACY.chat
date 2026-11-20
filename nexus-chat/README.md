# ⚡ Nexus Real-Time Workspace

A production-ready, high-performance real-time messaging application with an original floating Bento layout, fluid `framer-motion` micro-interactions, WhatsApp device linking via Baileys bridge, and custom real-time tracking features (**Anti-Delete Vault**, **Live Keystroke Streaming**, and **Chat Open Presence Alerts**).

---

## 🌟 Key Architectural Features

### 1. Original 3-Pane Floating Bento Workspace (No WhatsApp Green Clones)
- **Far-Left Slim Icon Rail (`w-16`)**: Houses the app logo, Chats view, WhatsApp QR pairing trigger with live ping badge, Anti-Delete Vault modal toggle with badge counters, Dark/Light Theme toggle, and Server Connection Settings gear.
- **Middle Contact Drawer (`w-[320px]`)**: Real-time search filter, live connection status indicator (`"Device Linked"` in cyan/blue or `"Sandbox Mode"` in amber), active contact accent indicator, live drafting status, and crimson warning tags on contacts with intercepted deletes.
- **Right Main Chat Card (`flex-1`)**: Solid canvas (no doodle wallpaper), rounded date pills, modern message bubbles, interactive collapsible **God Mode Lab**, and floating composer footer.
- **Dual Dynamic Theme**:
  - **Obsidian Dark Mode**: `#0B0E14` outer background, `#131722` floating cards, `#1E2433` incoming bubbles, `#6366F1` (Electric Indigo) outgoing bubbles, `#22D3EE` (Cyan) badges.
  - **Floating Light Mode**: `#EEF2F6` outer background, `#FFFFFF` floating cards with subtle border shadows, `#F1F5F9` incoming bubbles, and `#2563EB` (Royal Blue) outgoing bubbles.

### 2. WhatsApp QR Code Device-Linking State Machine (`QrLinkModal.jsx`)
- Built with `QRCodeSVG` from `qrcode.react`.
- Supports the full WhatsApp connection state machine:  
  `DISCONNECTED` ➔ `GENERATING_QR` ➔ `QR_READY` ➔ `AUTHENTICATING` ➔ `SYNCING_CHATS` ➔ `CONNECTED`.
- Real 3-step pairing instructions for mobile WhatsApp scanning.
- Instant fallback simulator with `"Simulate Phone Scan"` button when testing in sandbox.

### 3. Custom Real-Time Tracking Components
- **Anti-Delete Message Card (`MessageBubble.jsx`)**: When a remote sender attempts to delete a message for everyone (`protocolMessage type: 0`), Nexus intercepts it. The original message remains **100% visible and readable**, wrapped in a crisp crimson border (`border-2 border-rose-500 bg-rose-500/10`) with a tag at the bottom-right corner: `"🚫 Sender attempted to delete"`.
- **Floating Live Keystroke Capsule (`LiveDraftBanner.jsx`)**: Stacked directly above the pill input bar, smoothly animates into view via `framer-motion` spring physics whenever a contact is drafting (`"Contact is drafting: [live typing text...]"`).
- **Floating Chat-Open Alert Toast (`ChatOpenToast.jsx`)**: Drops down from the top center of the chat card with an eye radar indicator: `"🚨 [Contact Name] just opened your chat."` with a 4-second auto-dismiss timer.
- **Collapsible God Mode Lab Bar**: Available in the chat header with 3 one-click trigger buttons (*Simulate Chat Open*, *Simulate Live Draft*, *Mark Last Message Anti-Deleted*) to test and showcase all custom behaviors on the live deployed site.

### 4. Zero-Crash Fallback & Runtime Settings
- Works immediately out of the box in Sandbox Mode without any environment variables.
- `ConnectionSettingsModal.jsx` (accessible from the gear icon) allows configuring `VITE_BRIDGE_URL`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` directly at runtime in `localStorage` without redeploying.
- Includes `vercel.json` SPA rewrite rules for instant, error-free deployment on Vercel.

---

## 🚀 Quick Start

### 1. Install & Run Frontend
```bash
# Install dependencies
npm install

# Start local Vite development server
npm run dev

# Build for production
npm run build
```

---

## 🌐 Deployment Instructions

### Deploy Frontend to Vercel
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Framework Preset: **Vite** (Root Directory: `./`).
4. (Optional) Set Environment Variables:
   - `VITE_BRIDGE_URL`: URL of your deployed Baileys server (e.g., `https://nexus-bridge.onrender.com`).
   - `VITE_SUPABASE_URL`: (Optional) Your Supabase project URL.
   - `VITE_SUPABASE_ANON_KEY`: (Optional) Your Supabase anon key.
5. Click **Deploy**. Vercel will build and serve the app with the included `vercel.json` routing configuration.

---

### Deploy Companion Bridge Server (`/server`) to Render or Railway

The `/server` folder contains a standalone Node.js Express + Socket.IO + Baileys bridge.

#### Option A: Render.com
1. Create a new **Web Service** on [Render](https://render.com).
2. Point it to this repository with **Root Directory**: `server`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Set environment variable: `PORT = 3001`
6. Copy the generated Render URL (e.g., `https://nexus-bridge.onrender.com`) and paste it into the Nexus frontend Settings modal or `VITE_BRIDGE_URL`.

#### Option B: Railway.app
1. Create a **New Project** on Railway from GitHub.
2. Set Root Directory to `/server`.
3. Railway automatically detects Node.js and starts the server on `$PORT`.

---

## 📁 Project Architecture

```
nexus-chat/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── vercel.json               # SPA fallback routing for Vercel
├── .env.example
├── server/                   # Companion WhatsApp Baileys bridge
│   ├── package.json
│   └── index.js
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx               # Floating Bento workspace root
    ├── mock/
    │   └── initialData.js    # Preloaded sample chats & mock contacts
    ├── services/
    │   └── whatsappSocketBridge.js  # Unified Socket.IO + Supabase Realtime client
    └── components/
        ├── NavRail.jsx       # Far-left slim navigation rail
        ├── Sidebar.jsx       # Middle contact drawer & search
        ├── ChatHeader.jsx    # Chat header & God Mode Lab simulator
        ├── MessageList.jsx   # Message stage with date dividers
        ├── MessageBubble.jsx # Anti-Delete message card & indicators
        ├── LiveDraftBanner.jsx # Floating live keystroke capsule
        ├── ChatInput.jsx     # Floating pill composer & attachments
        ├── ChatOpenToast.jsx # Floating chat open toast banner
        ├── QrLinkModal.jsx   # Real WhatsApp QR pairing flow
        ├── ConnectionSettingsModal.jsx # Runtime server & Supabase config
        ├── AntiDeleteVaultModal.jsx    # Intercepted messages audit feed
        └── NewChatModal.jsx  # Start new conversation modal
```

---

## 🛡️ License
MIT License. Crafted for high-fidelity real-time messaging workflows.
