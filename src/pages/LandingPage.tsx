import { useState } from "react";
import { Link } from "react-router-dom";
import { useTickets } from "../features/tickets/ticket.hooks";
import { SystemGuideModal } from "../components/ui/SystemGuideModal";

interface MarqueeCardData {
  id: string;
  client: string;
  ticketId: string;
  priority: string;
  category: string;
  image: string;
}

const MARQUEE_ITEMS: MarqueeCardData[] = [
  {
    id: "m-1",
    client: "Acme Corp",
    ticketId: "TCK-1001",
    priority: "Urgent",
    category: "Infrastructure",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m-2",
    client: "Globex Inc",
    ticketId: "TCK-1002",
    priority: "High",
    category: "Payment API",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m-3",
    client: "Wayne Tech",
    ticketId: "TCK-1004",
    priority: "Medium",
    category: "Identity & SSO",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m-4",
    client: "Cyberdyne",
    ticketId: "TCK-1005",
    priority: "Urgent",
    category: "Zero-Day Incident",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m-5",
    client: "Stark Tech",
    ticketId: "TCK-1007",
    priority: "High",
    category: "Core Telemetry",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "m-6",
    client: "Umbrella Corp",
    ticketId: "TCK-1008",
    priority: "Medium",
    category: "Data Integrity",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
  },
];

interface ProjectGridItem {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  link: string;
}

const PROJECT_GRID_ITEMS: ProjectGridItem[] = [
  {
    id: "p-1",
    title: "Acme Corp High-Availability Cluster",
    category: "INFRASTRUCTURE // SEV-1",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    link: "/tickets",
  },
  {
    id: "p-2",
    title: "Globex Enterprise Billing Gateway",
    category: "PAYMENT PROCESSING",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    link: "/tickets",
  },
  {
    id: "p-3",
    title: "Starlight Multi-Tenant Auth Migration",
    category: "SECURITY & IAM",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    link: "/tickets",
  },
  {
    id: "p-4",
    title: "Initech Realtime Analytics Pipeline",
    category: "DATA ARCHITECTURE",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    link: "/tickets",
  },
];

export function LandingPage() {
  const { tickets, stats, resetToSampleData } = useTickets();
  const [menuOpen, setMenuOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  // Split headline text into characters for staggered cubic-bezier slide-up reveal
  const headlineWords = ["SUPPORT", "DESK"];

  return (
    <div className="relative min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* 01. NAVIGATION HEADER // MIX-BLEND-MODE: DIFFERENCE */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 md:px-12 flex items-center justify-between pointer-events-none">
        <div
          className="w-full flex items-center justify-between pointer-events-auto"
          style={{ mixBlendMode: "difference" }}
        >
          {/* Left: Lowercase logo 'sd' */}
          <Link
            to="/"
            className="text-white text-[24px] font-bold tracking-tighter lowercase select-none"
            aria-label="Home"
          >
            sd
          </Link>

          {/* Right: Quick link & Menu toggle button with plus icon */}
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="hidden md:inline-block text-white font-mono text-xs uppercase tracking-widest hover:opacity-70 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              📖 How It Works →
            </button>

            <Link
              to="/dashboard"
              className="hidden sm:inline-block text-white font-mono text-xs uppercase tracking-widest hover:opacity-70 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              Operations Desk →
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="size-10 flex items-center justify-center text-white text-3xl font-light select-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
              }}
              aria-label="Toggle Menu"
            >
              +
            </button>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN OVERLAY MENU (ACCESSED VIA PLUS TOGGLE) */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0A] text-white p-8 md:p-16 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-white/10 pb-6 pt-12 md:pt-8">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              SYSTEM DIRECTORY // MINI SUPPORT DESK
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              AGENT-01 ONLINE
            </span>
          </div>

          <div className="my-12 flex flex-col gap-6 max-w-3xl">
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter hover:text-neutral-400 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-baseline justify-between group"
            >
              <span>01. OPERATIONS DESK</span>
              <span className="font-mono text-sm tracking-widest text-neutral-500 group-hover:text-white">
                SLA TELEMETRY ↗
              </span>
            </Link>

            <Link
              to="/tickets"
              onClick={() => setMenuOpen(false)}
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter hover:text-neutral-400 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-baseline justify-between group"
            >
              <span>02. TICKET REGISTRY</span>
              <span className="font-mono text-sm tracking-widest text-neutral-500 group-hover:text-white">
                {tickets.length} ACTIVE ↗
              </span>
            </Link>

            <Link
              to="/tickets/new"
              onClick={() => setMenuOpen(false)}
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter hover:text-neutral-400 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-baseline justify-between group"
            >
              <span>03. DISPATCH TICKET</span>
              <span className="font-mono text-sm tracking-widest text-neutral-500 group-hover:text-white">
                NEW INTAKE ↗
              </span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setGuideOpen(true);
              }}
              className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter hover:text-neutral-400 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-baseline justify-between group text-left"
            >
              <span>04. HOW IT WORKS GUIDE</span>
              <span className="font-mono text-sm tracking-widest text-neutral-500 group-hover:text-white">
                PLAIN ENGLISH ↗
              </span>
            </button>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-400">
            <button
              type="button"
              onClick={() => {
                void resetToSampleData();
                setMenuOpen(false);
              }}
              className="hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] uppercase tracking-wider underline underline-offset-4"
            >
              Reset Repository To Default 10 Sample Tickets
            </button>
            <span>RESOLUTION SLA RATE: {stats.resolutionRate}%</span>
          </div>
        </div>
      )}

      {/* 02. HERO SECTION // 80VH MINIMUM, CENTER-ALIGNED, 12VW HEADLINE */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-6 pt-32 pb-16 relative overflow-hidden">
        {/* Top Minimal Editorial Tag */}
        <div className="mb-6 font-mono text-xs uppercase tracking-widest text-[#525252]">
          [ EDITORIAL SUPPORT DISPATCH // VERSION 2026 ]
        </div>

        {/* 12vw Headline with Staggered Letter Slide-Up Reveal */}
        <h1
          className="font-bold tracking-tighter text-black select-none"
          style={{
            fontSize: "clamp(3rem, 12vw, 11rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.05em",
          }}
        >
          {headlineWords.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-nowrap mx-[0.15em]">
              {word.split("").map((char, charIndex) => {
                const totalCharIndex = wordIndex * 8 + charIndex;
                return (
                  <span
                    key={charIndex}
                    className="inline-block overflow-hidden align-top"
                  >
                    <span
                      className="char-reveal"
                      style={{
                        animationDelay: `${totalCharIndex * 45}ms`,
                      }}
                    >
                      {char}
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        {/* Sub-headline: 24px, #525252, margin-top: 32px */}
        <p
          className="text-[#525252] max-w-2xl mx-auto font-normal leading-relaxed text-center"
          style={{
            fontSize: "24px",
            marginTop: "32px",
            letterSpacing: "-0.02em",
          }}
        >
          A typography-first operational system designed for ruthless clarity, rapid client
          resolution, and architectural rigor.
        </p>

        {/* Hero Interactive CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="h-12 px-8 bg-black text-white font-mono text-xs uppercase tracking-widest flex items-center justify-center border border-black hover:bg-neutral-800 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            ENTER OPERATIONS DESK →
          </Link>
          <Link
            to="/tickets"
            className="h-12 px-8 bg-white text-black font-mono text-xs uppercase tracking-widest flex items-center justify-center border border-black/10 hover:bg-black hover:text-white hover:border-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            VIEW REGISTRY ({tickets.length})
          </Link>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="h-12 px-6 bg-neutral-100 text-black font-mono text-xs uppercase tracking-widest flex items-center justify-center border border-black/10 hover:bg-black hover:text-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            📖 HOW IT WORKS
          </button>
        </div>
      </section>

      {/* 03. INFINITE PROJECT MARQUEE // 30S LINEAR HORIZONTAL SCROLL & ASYMMETRICAL CARDS */}
      <section className="w-full overflow-hidden py-16 border-y border-black/10 relative marquee-container bg-white">
        <div className="marquee-track">
          {/* Render two duplicated sequences for seamless 30s infinite scroll */}
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((card, idx) => {
            // Alternating asymmetrical border-radius rules:
            // Card A (idx % 3 === 0): border-top-left-radius: 100px
            // Card B (idx % 3 === 1): border-top-right-radius: 100px; border-bottom-left-radius: 40px
            // Card C (idx % 3 === 2): border-radius: 40px
            const radiusStyle =
              idx % 3 === 0
                ? { borderTopLeftRadius: "100px" }
                : idx % 3 === 1
                ? { borderTopRightRadius: "100px", borderBottomLeftRadius: "40px" }
                : { borderRadius: "40px" };

            return (
              <div
                key={`${card.id}-${idx}`}
                className="w-[280px] sm:w-[320px] aspect-[5/7] flex-shrink-0 relative overflow-hidden bg-neutral-100 mx-4 border border-black/10 group select-none"
                style={radiusStyle}
              >
                {/* 700ms Grayscale to Color & Scale 1.05x Hover Image */}
                <img
                  src={card.image}
                  alt={card.client}
                  className="w-full h-full object-cover studio-image-card"
                  loading="lazy"
                />

                {/* Subtle vignette and bottom metadata info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end text-white">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-300">
                    {card.category}
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <h3 className="font-bold text-lg tracking-tight">{card.client}</h3>
                    <span className="font-mono text-[10px] uppercase border border-white/20 px-2 py-0.5">
                      {card.priority}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 04. CENTERED INTRODUCTORY STATEMENT */}
      <section className="py-28 md:py-36 px-6 max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
        <span className="font-mono text-sm uppercase tracking-widest text-[#525252]">
          [ 01 // OPERATIONAL MANIFESTO ]
        </span>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.05em] leading-[1.05] text-black">
          We replace decorative noise with ruthless typographic hierarchy.
        </h2>

        <p className="text-lg sm:text-xl text-[#525252] leading-relaxed max-w-2xl font-normal">
          Designed for enterprise teams who refuse ambiguity. Every ticket in our queue is framed
          with mathematical precision, instant filter mechanics, and sub-millisecond local state
          persistence.
        </p>

        {/* 4-Column Metric Ledger */}
        <div className="w-full mt-6 grid grid-cols-2 md:grid-cols-4 border border-black/10 divide-x divide-y md:divide-y-0 divide-black/10 text-left">
          <div className="p-6 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-neutral-50">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#525252]">
              QUEUE TOTAL
            </span>
            <p className="text-4xl font-bold text-black tracking-tight mt-2">{stats.total}</p>
          </div>

          <div className="p-6 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-neutral-50">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#525252]">
              OPEN TRIAGE
            </span>
            <p className="text-4xl font-bold text-black tracking-tight mt-2">{stats.open}</p>
          </div>

          <div className="p-6 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-neutral-50">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#525252]">
              URGENT / HIGH
            </span>
            <p className="text-4xl font-bold text-black tracking-tight mt-2">{stats.urgentOrHigh}</p>
          </div>

          <div className="p-6 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-neutral-50">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#525252]">
              RESOLUTION SLA
            </span>
            <p className="text-4xl font-bold text-black tracking-tight mt-2">
              {stats.resolutionRate}%
            </p>
          </div>
        </div>
      </section>

      {/* 05. HOW IT WORKS // SYSTEM CAPABILITIES IN PLAIN ENGLISH */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-black/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-sm uppercase tracking-widest text-[#525252]">
              [ 02 // SYSTEM CAPABILITIES IN PLAIN ENGLISH ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mt-2">
              HOW MINI SUPPORT DESK WORKS
            </h2>
            <p className="text-base sm:text-lg text-[#525252] mt-2 max-w-2xl font-normal">
              No technical jargon. Clear delivery promises, intelligent triage, and zero lost data.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="font-mono text-xs uppercase tracking-widest text-black hover:text-[#525252] transition-colors underline underline-offset-4 self-start md:self-end"
          >
            OPEN INTERACTIVE GUIDE MODAL ↗
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: SLA Delivery Promise */}
          <div className="border border-black/10 p-6 flex flex-col justify-between hover:border-black transition-colors duration-300 bg-white">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">FEATURE 01</span>
                <span className="text-xl">⏱️</span>
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight mb-2">
                The SLA Delivery Promise
              </h3>
              <p className="text-sm text-[#525252] leading-relaxed mb-4">
                Like express delivery for customer problems. Every ticket has an automatic countdown timer based on its urgency:
              </p>
              <div className="space-y-1.5 font-mono text-xs text-[#525252] mb-4">
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-black font-bold">⚡ Urgent</span>
                  <span>4 Hours Max</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-black font-bold">▲ High</span>
                  <span>8 Hours Max</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/5">
                  <span className="text-black font-bold">■ Medium</span>
                  <span>24 Hours Max</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-black font-bold">▼ Low</span>
                  <span>72 Hours (3 Days)</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-black/10 flex flex-wrap gap-1.5 font-mono text-[10px]">
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300">🟢 On Track</span>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300">🟠 At Risk</span>
              <span className="px-2 py-0.5 bg-red-50 text-red-800 border border-red-300">🔴 Overdue</span>
            </div>
          </div>

          {/* Card 2: Operations Dashboard */}
          <div className="border border-black/10 p-6 flex flex-col justify-between hover:border-black transition-colors duration-300 bg-white">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">FEATURE 02</span>
                <span className="text-xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight mb-2">
                Operations Mission Control
              </h3>
              <p className="text-sm text-[#525252] leading-relaxed mb-4">
                A bird&apos;s-eye dashboard showing your team&apos;s real-time vitals:
              </p>
              <ul className="text-xs text-[#525252] space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">•</span>
                  <span><strong>Red-Alert Banner:</strong> Instantly warns when any ticket passes its deadline.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">•</span>
                  <span><strong>Live Metrics:</strong> Real-time counts of Open, In Progress, and Solved tickets.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">•</span>
                  <span><strong>Compliance Score:</strong> Track the percentage of issues solved on time.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-black/10">
              <Link to="/dashboard" className="font-mono text-xs uppercase tracking-wider text-black hover:underline flex items-center justify-between">
                <span>GO TO DASHBOARD</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Ticket Queue & Shopping-Style Filters */}
          <div className="border border-black/10 p-6 flex flex-col justify-between hover:border-black transition-colors duration-300 bg-white">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">FEATURE 03</span>
                <span className="text-xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight mb-2">
                Digital Inbox & Smart Search
              </h3>
              <p className="text-sm text-[#525252] leading-relaxed mb-4">
                Find any customer issue instantly, like searching on Google or filtering products on Amazon:
              </p>
              <ul className="text-xs text-[#525252] space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">•</span>
                  <span><strong>Instant Search:</strong> Type names, descriptions, or press &lsquo;/&rsquo; anytime.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">•</span>
                  <span><strong>Multi Filters:</strong> Combine Status, Urgency, Category, and SLA status.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">•</span>
                  <span><strong>Shareable URLs:</strong> Send your filtered view to any teammate with a copied link.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-black/10">
              <Link to="/tickets" className="font-mono text-xs uppercase tracking-wider text-black hover:underline flex items-center justify-between">
                <span>EXPLORE QUEUE</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Card 4: Ticket Intake & Editing */}
          <div className="border border-black/10 p-6 flex flex-col justify-between hover:border-black transition-colors duration-300 bg-white">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">FEATURE 04</span>
                <span className="text-xl">✍️</span>
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight mb-2">
                Fast Intake & Safe Lifecycle
              </h3>
              <p className="text-sm text-[#525252] leading-relaxed mb-4">
                Log client requests in seconds and manage them safely through completion:
              </p>
              <ul className="text-xs text-[#525252] space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">•</span>
                  <span><strong>Auto Ticket IDs:</strong> Sequential identifiers (e.g., TCK-011) generated automatically.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">•</span>
                  <span><strong>Live SLA Preview:</strong> See your promised deadline as you pick priority.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">•</span>
                  <span><strong>Safety Delete Checks:</strong> Confirmation dialog prevents accidental data loss.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-black/10">
              <Link to="/tickets/new" className="font-mono text-xs uppercase tracking-wider text-black hover:underline flex items-center justify-between">
                <span>CREATE A TICKET</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Card 5: Browser Memory & Demo Reset */}
          <div className="border border-black/10 p-6 flex flex-col justify-between hover:border-black transition-colors duration-300 bg-white">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-[#525252]">FEATURE 05</span>
                <span className="text-xl">💾</span>
              </div>
              <h3 className="text-xl font-bold text-black tracking-tight mb-2">
                Browser Memory & 1-Click Reset
              </h3>
              <p className="text-sm text-[#525252] leading-relaxed mb-4">
                Zero database setup required to evaluate:
              </p>
              <ul className="text-xs text-[#525252] space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">•</span>
                  <span><strong>Refresh Stability:</strong> Every edit and ticket is saved locally in your browser.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">•</span>
                  <span><strong>1-Click Reset:</strong> Restore the 10 clean sample tickets with active SLA timers at any time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-black">•</span>
                  <span><strong>Toast Alerts:</strong> Instant visual popups confirm every action.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-black/10">
              <button
                type="button"
                onClick={() => void resetToSampleData()}
                className="font-mono text-xs uppercase tracking-wider text-black hover:underline flex items-center justify-between w-full text-left"
              >
                <span>RESET TO 10 SAMPLES</span>
                <span>✕</span>
              </button>
            </div>
          </div>

          {/* Card 6: Studio Aesthetics & Micro-interactions */}
          <div className="border border-black/10 p-6 flex flex-col justify-between hover:border-black transition-colors duration-300 bg-black text-white">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">FEATURE 06</span>
                <span className="text-xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                Studio Design & Motion
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                Designed like a high-end architectural publication:
              </p>
              <ul className="text-xs text-neutral-300 space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white">•</span>
                  <span><strong>Difference Cursor:</strong> Smooth pointer tracking with expanding button hover states.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white">•</span>
                  <span><strong>Infinite Marquee:</strong> 30s ticker tape showing client dispatches.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-white">•</span>
                  <span><strong>High Contrast:</strong> Pure black-and-white palette with 1px hairline borders.</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-white/20">
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="font-mono text-xs uppercase tracking-wider text-white hover:text-neutral-300 flex items-center justify-between w-full"
              >
                <span>READ FULL GUIDE</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 06. PROJECT GRID // TWO-COLUMN DESKTOP, ONE-COLUMN MOBILE, 4:3 ASPECT RATIO */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto border-t border-black/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="font-mono text-sm uppercase tracking-widest text-[#525252]">
              [ 03 // SELECTED CLIENT DISPATCHES ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mt-2">
              ACTIVE WORKFLOW ARCHIVES
            </h2>
          </div>
          <Link
            to="/tickets"
            className="font-mono text-xs uppercase tracking-widest text-black hover:text-[#525252] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] underline underline-offset-4"
          >
            EXPLORE FULL REGISTRY ({tickets.length} CASES) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {PROJECT_GRID_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group flex flex-col select-none"
            >
              {/* 1. 4:3 aspect ratio image container with slight rounding */}
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg relative bg-neutral-100 border border-black/10">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover studio-image-card"
                  loading="lazy"
                />

                {/* 2. Hover-triggered overlay (black at 10% opacity) */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />

                {/* 3. Top-right 'arrow-up-right' icon appearing on hover */}
                <div className="absolute top-4 right-4 size-10 rounded-full bg-white text-black flex items-center justify-center shadow-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                  <svg
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </div>
              </div>

              {/* 4. Bottom metadata row separated by 1px #000000/10 border-top */}
              <div className="border-t border-black/10 pt-4 mt-4 flex items-baseline justify-between gap-4">
                {/* Title (24px) */}
                <h3
                  className="font-bold text-black tracking-tight leading-tight group-hover:text-neutral-600 transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ fontSize: "24px" }}
                >
                  {item.title}
                </h3>

                {/* Category and Year (mono font) */}
                <div className="font-mono text-sm uppercase tracking-widest text-[#525252] flex-shrink-0 text-right">
                  <span>{item.category}</span>
                  <span className="mx-2 text-neutral-400">/</span>
                  <span>{item.year}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 06. FOOTER // BACKGROUND #0A0A0A, TEXT #FFFFFF, 4-COLUMN GRID */}
      <footer className="bg-[#0A0A0A] text-[#FFFFFF] pt-24 pb-12 px-6 md:px-16 w-full mt-24">
        <div className="max-w-6xl mx-auto">
          {/* Four-Column Grid on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
            {/* Column 1-2: Large brand name and short bio */}
            <div className="md:col-span-2 flex flex-col gap-6">
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter lowercase text-white">
                sd // support desk
              </h2>
              <p className="text-base text-neutral-400 font-normal leading-relaxed max-w-md">
                A typography-first operational system engineered for modern support teams. Powered
                by extreme contrast, persistent local ledger sync, and 60fps lerp motion.
              </p>
              <div className="pt-2">
                <Link
                  to="/dashboard"
                  className="inline-flex h-11 items-center justify-center px-6 border border-white/20 text-white font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                >
                  ACCESS DISPATCH INTERFACE →
                </Link>
              </div>
            </div>

            {/* Column 3: 'Socials' list */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                SOCIALS
              </span>
              <ul className="flex flex-col gap-2.5 font-mono text-sm uppercase tracking-wider text-neutral-300">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  >
                    GITHUB ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  >
                    TWITTER / X ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://are.na"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  >
                    ARE.NA ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://read.cv"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  >
                    READCV ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  >
                    LINKEDIN ↗
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: 'Contact' list */}
            <div className="md:col-span-1 flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                CONTACT & DISPATCH
              </span>
              <ul className="flex flex-col gap-2.5 font-mono text-sm text-neutral-300">
                <li>
                  <a
                    href="mailto:dispatch@supportdesk.internal"
                    className="hover:text-white transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  >
                    dispatch@supportdesk.io
                  </a>
                </li>
                <li className="text-neutral-400">+1 (555) 019-2834</li>
                <li className="text-neutral-400">Zurich / San Francisco</li>
                <li className="pt-2 flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400">
                  <span className="size-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  <span>ALL SYSTEMS NOMINAL</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Thin border-top (white at 10% opacity) with copyright and credits in 14px text */}
          <div
            className="border-t border-white/10 pt-8 mt-16 flex flex-col sm:flex-row items-center justify-between text-neutral-400 font-mono gap-4"
            style={{ fontSize: "14px" }}
          >
            <span>© 2026 MINI SUPPORT DESK. ALL RIGHTS RESERVED.</span>
            <span className="uppercase tracking-wider">
              BOLD EDITORIAL STUDIO SYSTEM // INTER TYPOGRAPHY
            </span>
          </div>
        </div>
      </footer>

      {/* Interactive Plain-English Feature & SLA Guide */}
      <SystemGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
