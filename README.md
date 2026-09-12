# NOTHING — Enterprise Software for Doing Absolutely Nothing

> **"The world's leading enterprise SaaS platform for accomplishing zero tasks, reducing productivity, and wasting time with professional excellence."**

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Productivity](https://img.shields.io/badge/Productivity-0%25-brightgreen.svg)]()
[![Uptime SLA](https://img.shields.io/badge/Inactivity_SLA-99.99%25-purple.svg)]()

---

## 🧘 Overview

**NOTHING** is a full-stack, enterprise-grade web application built around an intentionally absurd premise: treating doing absolutely nothing as a serious corporate productivity activity.

Users can register, log in, view live telemetry about their non-achievement, and press a giant **"DO NOTHING"** button to record verified moments of stillness. The system records inactivity sessions, computes levels from *Amateur Nothing* to *Grandmaster of Nothing*, triggers hilarious achievement notifications, and generates Recharts analytics confirming a mathematically proven 0% productivity index.

---

## ✨ Features

- **🧘 The "DO NOTHING" Engine**:
  - **Live Stopwatch Mode**: Real-time timer (`Currently doing nothing for: 00:00:37`) allowing users to start, pause, and stop an active inactivity session.
  - **Instant Moment Mode**: Single-click logging for quick corporate procrastination.
- **📊 Real Analytics & Telemetry (Recharts)**:
  - Daily Inactivity Frequency (Line Chart)
  - Productivity Distribution (Donut Chart: 100% Doing Nothing, 0% Actual Work)
  - Time Spent Per Day (Bar Chart in Minutes)
  - Filters: *Today*, *7 Days*, *30 Days*, *All Time*
  - Real calculations directly aggregated from the database.
- **🏆 Humorous Level Progression**:
  - **Level 1 — Amateur Nothing**: Just starting to neglect responsibilities with mild guilt.
  - **Level 2 — Casual Nothing**: Consistently ignoring productive impulses weekly.
  - **Level 3 — Professional Nothing**: Looking busy in meetings while doing strictly zero.
  - **Level 4 — Expert Nothing**: Advanced mastery of meeting evasion and calendar blocking.
  - **Level 5 — Nothing Master**: Transcended the need for deliverables.
  - **Level 6 — Grandmaster of Nothing**: A living void of corporate disengagement.
- **🔔 Real-Time Notification Center**:
  - Automated triggers for session completions, personal endurance records, milestones, and level-ups.
  - Read/unread badges, mark all as read, and delete notifications.
  - Interactive toast alerts with confetti explosions on level rank-ups.
- **🎨 Enterprise UI & Theme Engine**:
  - Modern SaaS design with glassmorphism, subtle glows, and micro-animations.
  - Full Light Mode and Dark Mode support with persistence in localStorage and database profile settings.
  - Funny avatar presets (*The Sloth*, *Couch Potato*, *Sleeping Cat*, *Empty Chair*, *Zen Pebble*, *Blank Cloud*).
  - Official printable/previewable "Certificate of Pure Inactivity".
- **🛡️ Secure JWT Authentication & Protection**:
  - Cryptographic password hashing using `bcryptjs`.
  - JSON Web Tokens (JWT) for stateless protected API access.
  - Route guards on both frontend and backend.
- **⚡ Dual-Mode Zero-Config Database Layer**:
  - Fully compatible with standard MongoDB instances and MongoDB Atlas via `MONGODB_URI`.
  - Automated embedded in-memory fallback for instant zero-config startup without external database dependencies.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS with dark mode class strategy
- **Charts**: Recharts
- **Icons**: Lucide React
- **Celebrations**: Canvas Confetti
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database ORM**: Mongoose & MongoDB
- **Security**: JWT (`jsonwebtoken`) & `bcryptjs`
- **Architecture**: Modular Controller-Service-Route pattern

---

## 📂 Project Structure

```
nothing/
│
├── client/                      # Frontend application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.tsx       # Brand header, notifications & user dropdown
│   │   │   ├── Sidebar.tsx      # Platform navigation
│   │   │   ├── Footer.tsx       # Enterprise footer
│   │   │   ├── NothingButton.tsx# Central DO NOTHING button & timer
│   │   │   ├── StatCard.tsx     # KPI metrics display
│   │   │   ├── LevelBadge.tsx   # Rank badge and progression bar
│   │   │   ├── LoadingNothing.tsx# Humorous rotating loaders
│   │   │   └── NotificationToast.tsx # Toast popups
│   │   ├── context/             # React Contexts
│   │   │   ├── AuthContext.tsx  # User state & JWT persistence
│   │   │   ├── ThemeContext.tsx # Dark/Light mode engine
│   │   │   └── NotificationContext.tsx # Notification state & toasts
│   │   ├── layouts/             # Route layouts (AppLayout, AuthLayout)
│   │   ├── pages/               # 9 Full Pages
│   │   │   ├── LandingPage.tsx  # Hero, pricing, testimonials, 0-stats
│   │   │   ├── LoginPage.tsx    # Secure sign-in
│   │   │   ├── RegisterPage.tsx # User registration
│   │   │   ├── DashboardPage.tsx# Main dashboard & live button
│   │   │   ├── ProfilePage.tsx  # User profile & certificate
│   │   │   ├── NotificationsPage.tsx # Notification inbox
│   │   │   ├── AnalyticsPage.tsx# Recharts telemetry
│   │   │   ├── SettingsPage.tsx # Appearance, alerts, delete account
│   │   │   └── NotFoundPage.tsx # 404 void page
│   │   ├── services/            # API services (api, auth, nothing, notifications, analytics)
│   │   ├── types/               # TypeScript interfaces
│   │   ├── utils/               # Formatters & humorous copy
│   │   ├── App.tsx              # Router configuration
│   │   ├── main.tsx             # DOM entry point
│   │   └── index.css            # Custom CSS & Tailwind
│   ├── vite.config.ts           # Vite bundler & API proxy config
│   ├── tailwind.config.js       # Tailwind theme colors & animations
│   └── package.json
│
├── server/                      # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/              # Database connector & memory fallback
│   │   ├── controllers/         # API controllers
│   │   ├── middleware/          # JWT auth & error handlers
│   │   ├── models/              # Mongoose models (User, Session, Notification)
│   │   ├── routes/              # Express route definitions
│   │   ├── utils/               # Level calculator & humor quotes
│   │   └── server.ts            # Main server entry point
│   ├── tsconfig.json
│   └── package.json
│
├── .env.example                 # Environment variables template
├── README.md                    # Project documentation
└── package.json                 # Root script orchestration
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory (or use `.env.example` as a template):

```env
# Server Port
PORT=5000
NODE_ENV=development

# MongoDB Connection
# Set to your MongoDB connection string (e.g., mongodb://127.0.0.1:27017/nothing or MongoDB Atlas).
# If left empty, the server automatically starts in Zero-Config In-Memory Mode!
MONGODB_URI=mongodb://127.0.0.1:27017/nothing

# Security
JWT_SECRET=nothing_super_secret_enterprise_void_jwt_key_2026
```

---

## 🚀 Installation & Running

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (v9 or higher)

### 1. Install All Dependencies
Run from the root directory:
```bash
npm run install-all
```
*Or install individually:*
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Start Both Backend and Frontend in Development Mode
From the root directory, run:
```bash
npm run dev
```
This runs both the Express backend and the Vite dev server concurrently!

*Or start them in separate terminals:*
```bash
# Terminal 1: Backend (http://localhost:5000)
cd server
npm run dev

# Terminal 2: Frontend (http://localhost:5173 or http://localhost:5175)
cd client
npm run dev
```

### 3. Build for Production
```bash
npm run build
```
- Server TypeScript will compile to `server/dist/`.
- Client will bundle to `client/dist/`.

To start the production server:
```bash
npm run start
```

---

## 📡 REST API Endpoints

### Authentication
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user & hash password | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user | Yes |

### User Profile & Account
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/users/profile` | Retrieve user profile & level info | Yes |
| `PUT` | `/api/users/profile` | Update display name, avatar, settings | Yes |
| `PUT` | `/api/users/password` | Secure password update | Yes |
| `DELETE` | `/api/users/account` | Permanently delete account and all sessions | Yes |

### Nothing Sessions
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `POST` | `/api/nothing/start` | Start live stopwatch session | Yes |
| `POST` | `/api/nothing/stop` | Commit session, update stats & check level-up | Yes |
| `GET` | `/api/nothing/sessions` | Fetch user session history | Yes |
| `GET` | `/api/nothing/stats` | Retrieve today's stats, level & productivity | Yes |

### Notifications
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/notifications` | Get user notifications & unread count | Yes |
| `PUT` | `/api/notifications/:id/read` | Mark single notification as read | Yes |
| `PUT` | `/api/notifications/read-all` | Mark all notifications as read | Yes |
| `DELETE` | `/api/notifications/:id` | Delete notification | Yes |

### Analytics
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| `GET` | `/api/analytics/daily?range=7d` | Daily aggregated sessions & minutes | Yes |
| `GET` | `/api/analytics/weekly` | Day-of-week inactivity metrics | Yes |
| `GET` | `/api/analytics/monthly` | Month-by-month inactivity history | Yes |

---

## 🖼️ Application Pages & Flow

1. **Landing Page (`/`)**: Enterprise SaaS marketing page with live meaningless statistics, feature highlights, customer testimonials, and $0 pricing matrix.
2. **Login (`/login`)**: Secure email/password authentication with JWT token storage.
3. **Registration (`/register`)**: Form validation with real password encryption.
4. **Dashboard (`/dashboard`)**: Central hub with the iconic **DO NOTHING** button, stopwatch, today's metrics, and corporate audit report.
5. **Profile (`/profile`)**: Avatar selector, Level 1–6 status, lifetime inactivity records, and certificate preview.
6. **Notifications (`/notifications`)**: Dedicated inbox with read/unread filtering, level-up badges, and personal record alerts.
7. **Analytics (`/analytics`)**: Interactive Recharts graphs with date range filters and data-backed humor insights.
8. **Settings (`/settings`)**: Theme switcher (Light/Dark/System), notification preference toggles, and account deletion danger zone.
9. **404 Page (`/404`)**: "404 — You found nothing. Exactly as intended."

---

## 📜 License

MIT License — Feel free to use this system to accomplish absolutely nothing.
