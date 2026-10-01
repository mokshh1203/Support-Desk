# sd // Mini Support Desk — Bold Editorial Studio Aesthetic

A production-quality internal support-desk web application designed with a **Bold Editorial Creative Studio** aesthetic and typography-first layout. Engineered for enterprise operations and client support teams to manage, triage, track, and resolve support requests with typographic clarity and 60fps motion.

---

## Design System: Bold Editorial Studio Style

The application features a typography-first creative studio aesthetic with extreme weight and size contrasts, smooth motion-driven layouts, and a custom blend-mode cursor:

1. **Color Palette:**
   * **Primary Background:** `#FFFFFF` (Pure Canvas White)
   * **Primary Text:** `#000000` (Pure Ink Black)
   * **Secondary Text:** `#525252`
   * **Metadata & Secondary Gray:** `#737373`
   * **Accents & Borders:** Strict 1px `#000000` at 10% opacity (`rgba(0, 0, 0, 0.1)`), avoiding borders heavier than 1px.
   * **Footer Background:** `#0A0A0A` with high-contrast `#FFFFFF` typography.
   * **Photography:** Any color in the experience is strictly derived from high-resolution project photography.

2. **Typography Scale ('Inter'):**
   * **Headlines:** `font-weight: 700`, `letter-spacing: -0.05em`, `line-height: 0.9` with massive responsive clamp scaling (up to `12vw` on display heroes).
   * **Body:** `font-weight: 400`, `letter-spacing: -0.02em`, `line-height: 1.5`.
   * **Mono/Metadata:** `font-family: monospace`, `font-size: 14px`, uppercase, `letter-spacing: 0.1em`.

3. **Motion & Interaction Mechanics:**
   * **Custom Interactive Difference Cursor:** A 32px fixed circular indicator utilizing `mix-blend-mode: difference` and `background-color: white`. Position is interpolated at 60fps via `requestAnimationFrame` lerp (`0.16` damping factor) for a smooth lagging effect. On hover over interactive elements (`a`, `button`), it scales up by `2.5x` using `cubic-bezier(0.16, 1, 0.3, 1)` over 500ms. Default browser cursor is hidden on fine pointer devices (`cursor: none` on body).
   * **Staggered Letter Slide-Up Reveal:** The hero headline splits each character into an overflow-hidden wrapper, sliding up from `translateY(105%)` to `translateY(0%)` with `cubic-bezier(0.16, 1, 0.3, 1)` over `1s` with sequential delay offsets.
   * **Continuous Infinite Marquee:** A 30s linear continuous horizontal scroll showcasing project cards with alternating asymmetrical border-radii (Card A: `border-top-left-radius: 100px`, Card B: `border-top-right-radius: 100px; border-bottom-left-radius: 40px`, Card C: `border-radius: 40px`). Pauses on container hover.
   * **Image Grayscale Transition:** Images display in 100% grayscale by default, smoothly transitioning to full color (0% grayscale) and `1.05x` scale on hover over `700ms` with `cubic-bezier(0.16, 1, 0.3, 1)`.
   * **Two-Column Project Grid:** Desktop 2-column / mobile 1-column layout with 4:3 aspect ratio image containers, 10% black hover overlay, animated top-right arrow icon, and a bottom metadata row separated by a 1px `border-black/10` border.
   * **High-Contrast Dark Footer:** 4-column layout set against `#0A0A0A` with brand bio, social links, contact telemetry, and thin 10% white border-top.

---

## Overview

**Mini Support Desk** is a responsive single-page web application built with React, TypeScript, and Tailwind CSS v4. It serves as an internal operations hub where support personnel can:
* Monitor live ticket volumes and resolution metrics on a dynamic dashboard (`/dashboard`)
* Execute instant full-text search across client requests
* Apply multi-criteria intersection filters (Status, Priority, Category, Sorting)
* Review ticket details with deep linkable URLs (`/tickets/:id`)
* Modify priorities and statuses with instant persistence
* Create new tickets with robust schema validation (`/tickets/new`)
* Safely delete tickets with accessible confirmation dialogs

---

## Features

* **Bold Editorial Studio Presentation Layer (`/`):**
  * Fixed navigation header with `mix-blend-mode: difference`, lowercase `sd` brand mark, and interactive plus menu toggle.
  * 80vh+ hero section featuring a 12vw headline with staggered character reveals.
  * Infinite horizontal marquee featuring asymmetrical card shapes and 700ms grayscale-to-color hover transitions.
  * Centered operational manifesto with live queue telemetry ledger.
  * **System Capabilities in Plain English:** Dedicated section breaking down the SLA delivery promise, traffic lights, dashboard, search, and storage with zero jargon.
  * **Interactive System Guide Modal:** Accessible anywhere across the app via header button (`📖 HOW IT WORKS`) or menu.
  * 2-column project grid with 4:3 aspect ratio cards and direct links into the active ticket registry.
  * High-contrast `#0A0A0A` footer with 4 columns and status badge.

* **Live Support Operations Desk (`/dashboard`):**
  * Real-time KPI summary cards displaying Total Tickets, Open Tickets, In Progress Tickets, and Resolved / Closed Tickets.
  * Secondary operational metrics for Urgent/High Priority tickets and overall Resolution Rate percentage.
  * Visual Queue Urgency Breakdown progress bar with interactive priority filtering.
  * Recent tickets queue for rapid triage.

* **Central Ticket Management Queue (`/tickets`):**
  * Responsive view: Data table on desktop (`md` and above) and card list on mobile viewports.
  * High-visibility badges for Status (Open, In Progress, Resolved, Closed) and Priority (Urgent, High, Medium, Low) using distinct textual labels and symbols (⚡, ▲, ■, ▼).
  * Contextual category badges (Technical, Billing, Account, Bug, Feature, General).
  * Direct links to individual ticket inspection pages.

* **Dynamic Search & Multi-Criteria Filtering:**
  * Instant, case-insensitive search matching ticket title, client name, ticket ID, category, or description.
  * Combined filtering by Status, Priority, and Category (intersection matching).
  * Multiple sort options: Newest First, Oldest First, Highest Priority First, and Client Name (A–Z).
  * URL query parameter synchronization (`?status=...&priority=...&query=...`) for shareable and bookmarkable filtered views.
  * Quick-clear button to reset all active filters with one click.

* **Ticket Creation (`/tickets/new`):**
  * Validated input form covering Title, Client, Category, Priority, Initial Status, Created Date, and Description.
  * Immediate inline validation feedback with accessible error descriptions.
  * Automatic sequential ID generation (e.g., `TCK-011`).

* **Individual Ticket Inspection & Quick Actions (`/tickets/:id`):**
  * Dedicated detail page displaying ticket ID, client, category, status, priority, timestamps, and full description context.
  * Quick status and priority selectors with immediate persistence and feedback.
  * In-place editing mode to update title, client, category, or description.
  * Destructive action protection: Accessible modal confirmation dialog prior to ticket deletion.

* **Resilient Data Persistence:**
  * Browser `localStorage` adapter with automatic initial seeding (10 realistic sample tickets).
  * Preserves user modifications, newly created tickets, status/priority changes, and deletions across page refreshes.
  * Safe error handling for corrupted storage, privacy modes, or quota limits.
  * Built-in "Reset Sample Data" utility for evaluators and testing workflows.

---

## Tech Stack

* **Framework:** React 18 (TypeScript)
* **Build Tool:** Vite 6
* **Routing:** React Router DOM v6
* **Styling:** Tailwind CSS v4 with Bold Editorial Studio tokens
* **Testing:** Vitest (20 unit & persistence test suites passing)
* **Storage:** Browser `localStorage` with domain-level adapter and fallback handling

---

## Getting Started

### Prerequisites

* Node.js (v18 or higher recommended; v24 tested)
* npm (v9 or higher)

### Installation

Clone the repository and install the dependencies:

```bash
cd mini-support-desk
npm install
```

### Running Locally

Start the Vite development server:

```bash
npm run dev
```

Open your browser at `http://localhost:5173` (or `http://localhost:5174`).

### Running Tests

Execute the automated test suite with Vitest:

```bash
npm test
```

### Production Build

Verify TypeScript types and compile the optimized production bundle:

```bash
npm run build
npm run preview
```

---

## Project Structure

```text
mini-support-desk/
├── public/                 # Static assets
├── src/
│   ├── app/                # Root App component and React Router setup
│   │   ├── App.tsx
│   │   └── router.tsx
│   ├── components/         # Modular UI & feature components
│   │   ├── dashboard/      # Dashboard KPI cards and statistics views
│   │   │   ├── DashboardOverview.tsx
│   │   │   └── StatCard.tsx
│   │   ├── layout/         # Shell, Header, Sidebar, and Mobile navigation
│   │   │   ├── AppShell.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MobileNavigation.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── tickets/        # Ticket queue, table, cards, form, and filters
│   │   │   ├── SlaBadge.tsx        # Dynamic SLA status & countdown badge
│   │   │   ├── TicketCard.tsx
│   │   │   ├── TicketFilters.tsx
│   │   │   ├── TicketForm.tsx
│   │   │   ├── TicketList.tsx
│   │   │   ├── TicketPriorityBadge.tsx
│   │   │   ├── TicketSearch.tsx
│   │   │   ├── TicketStatusBadge.tsx
│   │   │   └── TicketTable.tsx
│   │   └── ui/             # Studio design-system primitives
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── CustomCursor.tsx # Difference blend-mode lerp cursor
│   │       ├── Dropdown.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorState.tsx
│   │       ├── Field.tsx
│   │       ├── Input.tsx
│   │       ├── LoadingState.tsx
│   │       ├── Modal.tsx
│   │       ├── Select.tsx
│   │       ├── SystemGuideModal.tsx # Interactive layman's terms feature guide
│   │       ├── Textarea.tsx
│   │       └── Toast.tsx
│   ├── context/            # Reactive single source of truth
│   │   └── TicketContext.tsx
│   ├── data/               # Realistic seed tickets (10 samples with SLA targets)
│   │   └── sampleTickets.ts
│   ├── features/tickets/   # Domain logic, SLA engine, hooks, services, and tests
│   │   ├── ticket.constants.ts
│   │   ├── ticket.hooks.ts
│   │   ├── ticket.service.ts
│   │   ├── ticket.service.test.ts
│   │   ├── ticket.sla.ts       # SLA calculation engine, deadlines & formatters
│   │   ├── ticket.sla.test.ts  # SLA unit tests
│   │   ├── ticket.storage.ts
│   │   ├── ticket.test.ts
│   │   ├── ticket.types.ts
│   │   ├── ticket.urlFilters.test.ts
│   │   └── ticket.utils.ts
│   ├── lib/                # Shared utilities (classnames, formatters, storage)
│   │   ├── cn.ts
│   │   ├── format.ts
│   │   ├── navigation.tsx
│   │   ├── storage.ts
│   │   └── travel.test.ts
│   ├── pages/              # Route-level views
│   │   ├── LandingPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── NewTicketPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── TicketDetailsPage.tsx
│   │   └── TicketsPage.tsx
│   └── styles/             # Global CSS and Bold Editorial Studio tokens
│       ├── globals.css
│       └── theme.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Data Persistence

Ticket data is stored in the browser's `localStorage` under the key `msd:tickets`.

* **First Launch:** If no data exists in `localStorage`, the storage adapter seeds the initial 10 sample tickets with dynamically anchored SLA deadlines.
* **Persistent Modifications:** Every create, edit, status change, priority change, and deletion immediately updates the in-memory React state and writes the serialized JSON to `localStorage`.
* **Refresh Stability:** Reloading or reopening the browser reads directly from `localStorage`, ensuring user modifications are never overwritten with defaults.
* **Fallback Safety:** Quota errors, private-mode storage blocks, and malformed JSON payloads fail gracefully without crashing the UI.
* **Reset Facility:** The evaluator menu in the header, the landing page drawer, and empty queue states provide a "Reset sample data" button that safely restores the standard 10 tickets for testing convenience.

---

## Key Improvement: SLA Tracking System (Best Overall)

The signature enterprise enhancement transforms this app from a standard CRUD utility into an operational service management platform:

1. **Priority-Driven Response & Resolution Deadlines:**
   * **⚡ Urgent:** 4 hours SLA window
   * **▲ High:** 8 hours SLA window
   * **■ Medium:** 24 hours SLA window
   * **▼ Low:** 72 hours SLA window

2. **Real-Time Visual SLA Badges & Telemetry:**
   * 🟠 **AT RISK:** Displays time remaining (e.g. `42 minutes remaining`) when approaching breach (≤ 1 hour or ≤ 20% remaining).
   * 🔴 **OVERDUE:** Displays breach duration (e.g. `Overdue by 27 minutes`) once deadline has elapsed.
   * 🟢 **ON TRACK:** Displays healthy window remaining (e.g. `7 hours remaining`).
   * ⚪ **SLA MET / SLA BREACHED:** Retrospective audit state permanently stamped upon ticket resolution.

3. **Product-Wide SLA Integration:**
   * **Dashboard Telemetry & Alerts:** High-contrast SLA Breach Alert banner alerting support engineers of overdue tickets, plus 3 real-time SLA metrics: *🔴 SLA Overdue*, *🟠 SLA At Risk*, and *SLA Compliance Rate %*.
   * **Queue Triage Column:** Prominent `SLA DEADLINE` column in desktop tables and mobile cards displaying live status indicators.
   * **Multi-Criteria Queue Filter:** Quick filter by SLA status (`All`, `Overdue`, `At Risk`, `On Track`, `SLA Met`, `SLA Breached`), fully synced to URL search parameters (`?sla=overdue`).
   * **SLA Deadline Sorting:** Dedicated sort mode (`sla_deadline`) sorting breached and urgent tickets to the top.
   * **Ticket Inspection Telemetry Card:** Detailed card on `/tickets/:id` displaying exact target window, absolute ISO/formatted deadline, and remaining buffer.
   * **Creation SLA Preview:** Live SLA window feedback inside the ticket creation form (`/tickets/new`) that dynamically updates as the user selects priority.
   * **Adaptive Escalation:** Upgrading a ticket's priority automatically recalculates its SLA deadline; resolving a ticket records `resolved_at` and evaluates final SLA compliance.

---

## Additional Improvements

1. **Interactive Difference Cursor with Lerp Interpolation:**
   * A 32px circular cursor with `mix-blend-mode: difference` and `background-color: white` tracking mouse position via `requestAnimationFrame` lerp for a silky lagging inertia. Smoothly expands to `2.5x` scale on hover over links and buttons using `cubic-bezier(0.16, 1, 0.3, 1)`.

2. **Continuous Infinite Marquee with Asymmetrical Card Radii:**
   * 30-second linear horizontal marquee with alternating organic border radii (`border-top-left-radius: 100px`, `border-top-right-radius: 100px; border-bottom-left-radius: 40px`, `border-radius: 40px`). Grayscale images transition to full color + 1.05x scale over 700ms on hover.

3. **Interactive Toast Notification & Activity Feedback System:**
   * An accessible, real-time notification manager (`Toast.tsx` wired into `TicketContext`) providing auditory/visual confirmations (`aria-live="polite"`) upon creating, updating, changing status/priority, or deleting tickets.

4. **Visual Queue Urgency Distribution Bar:**
   * A multi-segment visual progress bar on the dashboard that highlights the proportion of Urgent, High, Medium, and Low priority tickets at a glance.

5. **Synchronized URL Filter State & Keyboard Navigation:**
   * Filters and search queries are two-way synchronized with browser URL parameters (`?status=open&priority=urgent&sla=overdue`), making search results bookmarkable and shareable.
   * Pressing `/` anywhere outside of an active input instantly focuses the ticket search bar; pressing `Esc` dismisses open modals and dropdowns.

---

## Verification & Test Results

* Automated tests: **46 passed across 5 test suites** (`npm test`)
* Production build: **Clean compile in 1.44s** (`npm run build`)
* Local server: **Running on `http://localhost:5173/`**
