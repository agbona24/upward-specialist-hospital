'use client';

import { useState, useEffect, useRef } from 'react';

/* ─── Inline SVG healthcare vector icons ──────────────────── */
function HeartbeatMonitorSVG() {
  return (
    <svg viewBox="0 0 520 320" className="w-full h-full" aria-hidden>
      {/* Monitor body */}
      <rect x="30" y="20" width="460" height="260" rx="24" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      {/* Screen bezel */}
      <rect x="50" y="40" width="420" height="200" rx="12" fill="rgba(0,0,0,0.3)" />
      {/* Grid lines */}
      {[80,120,160,200].map(y => (
        <line key={y} x1="60" y1={y} x2="460" y2={y} stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
      ))}
      {[100,150,200,250,300,350,400].map(x => (
        <line key={x} x1={x} y1="48" x2={x} y2="232" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
      ))}
      {/* ECG line */}
      <path
        className="ecg-path"
        d="M 60 140 L 100 140 L 115 140 L 125 80 L 140 200 L 155 70 L 170 140 L 200 140 L 215 140 L 225 95 L 240 185 L 255 75 L 270 140 L 300 140 L 315 140 L 325 90 L 340 190 L 355 78 L 370 140 L 460 140"
        stroke="#10B981"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Scan line (moving vertical) */}
      <rect x="60" y="48" width="3" height="184" fill="rgba(16,185,129,0.4)" rx="2">
        <animateTransform attributeName="transform" type="translate" from="0 0" to="397 0" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Status dots */}
      <circle cx="70" cy="255" r="5" fill="#10B981">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <text x="83" y="259" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="monospace">NORMAL SINUS</text>
      <text x="370" y="259" fill="#10B981" fontSize="11" fontFamily="monospace">72 BPM</text>
      {/* Monitor stand */}
      <rect x="235" y="280" width="50" height="14" rx="4" fill="rgba(255,255,255,0.12)" />
      <rect x="215" y="290" width="90" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}

function FloatingMedicalIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {/* Cross / Plus */}
      <div className="float-icon-1 absolute top-[8%] right-[6%] opacity-30">
        <svg width="48" height="48" viewBox="0 0 48 48">
          <rect x="19" y="6" width="10" height="36" rx="3" fill="white" />
          <rect x="6" y="19" width="36" height="10" rx="3" fill="white" />
        </svg>
      </div>
      {/* Stethoscope */}
      <div className="float-icon-2 absolute top-[55%] left-[3%] opacity-20">
        <svg width="52" height="52" viewBox="0 0 52 52">
          <path d="M 10 8 Q 8 22 16 28 Q 24 34 26 42 Q 28 50 36 50 Q 46 50 46 40 Q 46 32 38 32" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="38" cy="28" r="5" stroke="white" strokeWidth="2.5" fill="none" />
          <circle cx="10" cy="8" r="3" fill="white" />
          <circle cx="20" cy="6" r="3" fill="white" />
        </svg>
      </div>
      {/* Heart */}
      <div className="float-icon-3 absolute bottom-[12%] right-[8%] opacity-25">
        <svg width="44" height="44" viewBox="0 0 44 44" className="heart-pulse">
          <path d="M 22 38 L 5 22 Q 2 12 10 8 Q 16 5 22 14 Q 28 5 34 8 Q 42 12 39 22 Z" fill="white" />
        </svg>
      </div>
      {/* Pill / capsule */}
      <div className="float-icon-4 absolute top-[30%] right-[2%] opacity-20">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <rect x="4" y="14" width="32" height="12" rx="6" fill="white" />
          <line x1="20" y1="14" x2="20" y2="26" stroke="rgba(27,94,140,0.5)" strokeWidth="1.5" />
        </svg>
      </div>
      {/* DNA-style circles */}
      <div className="float-icon-1 absolute bottom-[25%] left-[8%] opacity-15">
        <svg width="36" height="60" viewBox="0 0 36 60">
          {[0,12,24,36,48].map((y, i) => (
            <ellipse key={i} cx="18" cy={y + 6} rx={i%2 === 0 ? 14 : 8} ry="4" fill="none" stroke="white" strokeWidth="1.5" />
          ))}
        </svg>
      </div>
    </div>
  );
}

function PulseRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
      <svg width="400" height="400" viewBox="0 0 400 400" className="opacity-10">
        <circle cx="200" cy="200" r="60" fill="none" stroke="white" strokeWidth="2" className="pulse-ring" />
        <circle cx="200" cy="200" r="60" fill="none" stroke="white" strokeWidth="2" className="pulse-ring pulse-ring-2" />
        <circle cx="200" cy="200" r="60" fill="none" stroke="white" strokeWidth="2" className="pulse-ring pulse-ring-3" />
      </svg>
    </div>
  );
}

/* ─── Service icons as inline SVG ─────────────────────────── */
const serviceIcons: Record<string, React.ReactNode> = {
  "General Medicine": (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="4" y="6" width="24" height="20" rx="3" />
      <line x1="16" y1="11" x2="16" y2="21" />
      <line x1="11" y1="16" x2="21" y2="16" />
    </svg>
  ),
  "Surgery": (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M 8 8 L 24 24" />
      <path d="M 8 24 L 24 8" />
      <circle cx="16" cy="16" r="10" />
    </svg>
  ),
  "Maternity & Gynaecology": (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M 16 4 Q 10 4 10 10 Q 10 18 16 22 Q 22 18 22 10 Q 22 4 16 4" />
      <circle cx="16" cy="16" r="4" fill="currentColor" fillOpacity="0.2" />
      <line x1="16" y1="22" x2="16" y2="28" />
      <line x1="12" y1="26" x2="20" y2="26" />
    </svg>
  ),
  "Paediatrics": (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="16" cy="10" r="5" />
      <path d="M 9 28 Q 9 18 16 18 Q 23 18 23 28" />
      <path d="M 6 22 Q 4 18 7 16" />
      <path d="M 26 22 Q 28 18 25 16" />
    </svg>
  ),
  "Diagnostics & Lab": (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M 12 4 L 12 16 L 7 26 Q 6 28 8 28 L 24 28 Q 26 28 25 26 L 20 16 L 20 4" />
      <line x1="10" y1="4" x2="22" y2="4" />
      <line x1="10" y1="8" x2="22" y2="8" />
      <circle cx="14" cy="22" r="2" fill="currentColor" fillOpacity="0.4" />
    </svg>
  ),
  "Emergency Care": (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M 16 4 L 18 13 L 28 13 L 20 19 L 23 28 L 16 22 L 9 28 L 12 19 L 4 13 L 14 13 Z" />
    </svg>
  ),
};

/* ─── Animated stat counter ───────────────────────────────── */
function StatCounter({ value, label, suffix = '' }: { value: string; label: string; suffix?: string }) {
  return (
    <div className="text-center py-6 px-4">
      <p className="text-3xl sm:text-4xl font-bold text-[#1B5E8C]">{value}<span className="text-[#10B981]">{suffix}</span></p>
      <p className="mt-1 text-sm text-slate-600 font-medium">{label}</p>
    </div>
  );
}

/* ─── Testimonial data ────────────────────────────────────── */
const testimonials = [
  { name: "Mrs. Adebimpe O.", role: "Patient – Maternity", text: "The maternity team at Upward gave me the most reassuring experience. I felt safe and well cared for throughout my delivery.", initials: "AO" },
  { name: "Mr. Tunde F.", role: "Patient – General Medicine", text: "Very professional staff and fast diagnosis. I was in and out quickly with clarity on my treatment plan. Highly recommended.", initials: "TF" },
  { name: "Mrs. Ngozi K.", role: "Patient – Paediatrics", text: "The paediatric unit is warm and child-friendly. My son actually looks forward to check-ups now!", initials: "NK" },
];

const services = [
  { title: "General Medicine", description: "Comprehensive adult care, chronic disease management and preventive wellness." },
  { title: "Surgery", description: "Expert surgical care in a modern, fully-equipped sterile theatre environment." },
  { title: "Maternity & Gynaecology", description: "Comfort-focused care for mothers — from antenatal through postnatal recovery." },
  { title: "Paediatrics", description: "Child health services with a warm, family-friendly, specialist-led approach." },
  { title: "Diagnostics & Lab", description: "Fast, accurate laboratory testing with clear, same-day results." },
  { title: "Emergency Care", description: "Rapid, compassionate emergency response available around the clock." },
];

const whyUs = [
  { icon: "🏥", title: "Experienced Specialists", body: "Board-certified doctors in every specialty for confident, evidence-based care." },
  { icon: "🔬", title: "Modern Facilities", body: "Advanced diagnostic equipment and private suites in a warm environment." },
  { icon: "⚡", title: "24-Hour Emergency", body: "Fast, compassionate emergency care anytime — day or night." },
  { icon: "🤝", title: "Community Trusted", body: "Proudly serving families in Idimu and across Lagos for years." },
];

const tools = [
  { title: "BMI Calculator", desc: "Check your body mass index" },
  { title: "Due Date Calculator", desc: "Plan your pregnancy timeline" },
  { title: "Vaccination Reminder", desc: "Stay on your immunisation schedule" },
  { title: "Health Risk Check", desc: "Assess common health risk factors" },
];

const bottomNavItems = [
  { label: 'Home', href: '#home', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  )},
  { label: 'Services', href: '#services', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="8" y="2" width="8" height="4" rx="1" /><rect x="2" y="6" width="20" height="16" rx="2" />
      <line x1="12" y1="10" x2="12" y2="18" /><line x1="8" y1="14" x2="16" y2="14" />
    </svg>
  )},
  { label: 'Book', href: '#contact', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" /><line x1="12" y1="14" x2="12" y2="18" /><line x1="10" y1="16" x2="14" y2="16" />
    </svg>
  )},
  { label: 'Doctors', href: '#doctors', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
    </svg>
  )},
  { label: 'Contact', href: '#contact', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
    </svg>
  )},
];

/* ─── Main page ───────────────────────────────────────────── */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-[#1a2332]">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 shadow-md backdrop-blur-xl' : 'bg-white/80 backdrop-blur-lg border-b border-slate-100'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B5E8C]">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <rect x="8" y="2" width="8" height="4" rx="1" fill="white" />
                <rect x="2" y="6" width="20" height="16" rx="2" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.5" />
                <line x1="12" y1="10" x2="12" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="14" x2="16" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-[#1B5E8C] leading-tight">Upward</p>
              <p className="text-[10px] font-medium text-slate-500 -mt-0.5 tracking-wide">SPECIALIST HOSPITAL</p>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            {['#home','#about','#services','#doctors','#tools','#contact'].map((href, i) => (
              <a key={href} href={href} className="hover:text-[#1B5E8C] transition-colors">
                {['Home','About','Services','Doctors','Resources','Contact'][i]}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="tel:08028611472" className="hidden sm:flex items-center gap-2 text-sm text-[#1B5E8C] font-medium">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
              </svg>
              0802 861 1472
            </a>
            <a href="#contact" className="hidden md:inline-flex rounded-full bg-[#1B5E8C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#134466] transition-colors">
              Book Appointment
            </a>
            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white" aria-label="Menu">
              {menuOpen
                ? <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                : <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              }
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-5 py-4 space-y-1">
            {['#home','#services','#doctors','#tools','#contact'].map((href, i) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#E7F1F8] hover:text-[#1B5E8C] transition-colors">
                {['Home','Services','Doctors','Health Resources','Contact'][i]}
              </a>
            ))}
            <div className="pt-3">
              <a href="#contact" className="flex w-full items-center justify-center rounded-xl bg-[#1B5E8C] py-3.5 text-sm font-semibold text-white">
                Book Appointment
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="pb-24 md:pb-0">

        {/* ── HERO ──────────────────────────────────────────── */}
        <section id="home" className="relative overflow-hidden bg-gradient-to-br from-[#0d3f66] via-[#1B5E8C] to-[#2876a8] px-5 py-16 text-white sm:px-8 sm:py-24">
          <PulseRings />
          <FloatingMedicalIcons />

          {/* Blob backgrounds */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl animate-blob" />
            <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#10B981]/10 blur-3xl animate-blob" style={{animationDelay:'4s'}} />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

              {/* Left content */}
              <div className="space-y-7 slide-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#a8d8f0]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#10B981]">
                    <span className="block h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
                  </span>
                  Specialist care · Idimu, Lagos
                </div>

                <h1 className="text-4xl font-bold leading-[1.15] sm:text-5xl lg:text-6xl gradient-text">
                  World-Class Care,<br />Close to Home
                </h1>

                <p className="max-w-lg text-base leading-8 text-[#cce5f5]">
                  Upward Specialist Hospital delivers advanced, compassionate healthcare to families across Idimu and Lagos — with specialists you can trust, 24 hours a day.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a href="#contact" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-bold text-[#1B5E8C] shadow-xl hover:bg-blue-50 transition-all active:scale-95">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    Book an Appointment
                  </a>
                  <a href="#services" className="flex items-center justify-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 px-7 py-4 text-sm font-semibold text-white hover:bg-white/20 transition-all active:scale-95">
                    Explore Our Services
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" /></svg>
                  </a>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {['✓ Open 24/7', '✓ 35+ Specialists', '✓ Trusted by Families', '✓ Emergency Ready'].map(b => (
                    <span key={b} className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white">{b}</span>
                  ))}
                </div>
              </div>

              {/* Right — animated healthcare monitor */}
              <div className="slide-right relative">
                {/* Main monitor card */}
                <div className="glass rounded-3xl p-4 shadow-2xl">
                  <div className="mb-3 flex items-center justify-between px-2">
                    <span className="text-xs font-semibold text-[#a8d8f0] uppercase tracking-widest">Live ECG Monitor</span>
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                    </div>
                  </div>
                  <div className="aspect-[16/9] w-full">
                    <HeartbeatMonitorSVG />
                  </div>
                </div>

                {/* Floating stat pills */}
                <div className="glass absolute -left-4 top-8 rounded-2xl px-4 py-3 shadow-lg hidden sm:block">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a8d8f0]">Patients Served</p>
                  <p className="text-2xl font-bold text-white">1,200+</p>
                </div>

                <div className="glass absolute -right-4 bottom-8 rounded-2xl px-4 py-3 shadow-lg hidden sm:block">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#10B981]" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a8d8f0]">Emergency</p>
                      <p className="text-sm font-bold text-white">24 / 7 Ready</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ─────────────────────────────────────── */}
        <section className="bg-white shadow-sm border-b border-slate-100">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 divide-x divide-slate-100 md:grid-cols-4">
              {[
                { value: '24/7', label: 'Emergency Care' },
                { value: '35+', label: 'Specialist Doctors' },
                { value: '1,200+', label: 'Patients Served' },
                { value: '6+', label: 'Specialties' },
              ].map((s, i) => (
                <div key={i} className="stat-card py-6 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-[#1B5E8C]">{s.value}</p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT STRIP ───────────────────────────────────── */}
        <section id="about" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#E7F1F8] to-white p-8 sm:p-12 border border-slate-100 shadow-sm">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1B5E8C]">Who We Are</p>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl leading-tight">Passionate About Your Health &amp; Wellbeing</h2>
                <p className="text-base leading-8 text-slate-600">
                  Located in the heart of Idimu, Lagos, Upward Specialist Hospital was founded to bring world-class specialist healthcare closer to families in our community. We combine skilled professionals with modern technology to deliver personalised, dignified care.
                </p>
                <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B5E8C] hover:underline">
                  Learn more about us
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" /></svg>
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {whyUs.map(w => (
                  <div key={w.title} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 hover:border-[#1B5E8C]/30 transition-colors">
                    <span className="text-2xl">{w.icon}</span>
                    <h3 className="mt-3 text-sm font-bold text-slate-900">{w.title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{w.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ──────────────────────────────────────── */}
        <section id="services" className="mx-auto max-w-7xl px-5 py-4 sm:px-8 pb-16">
          <div className="mb-10 text-center space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1B5E8C]">What We Offer</p>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Our Specialist Services</h2>
            <p className="mx-auto max-w-xl text-base leading-8 text-slate-600">A coordinated team of specialists delivering premium care for every stage of health.</p>
          </div>

          {/* Mobile horizontal scroll */}
          <div className="md:hidden -mx-5 px-5 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {services.map(s => (
              <div key={s.title} className="snap-start shrink-0 w-72 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm service-card">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7F1F8] text-[#1B5E8C]">
                  {serviceIcons[s.title]}
                </div>
                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{s.description}</p>
                <a href="#contact" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#1B5E8C] hover:underline">
                  Book now <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" /></svg>
                </a>
              </div>
            ))}
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map(s => (
              <div key={s.title} className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-sm service-card cursor-pointer">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7F1F8] text-[#1B5E8C] group-hover:bg-[#1B5E8C] group-hover:text-white transition-colors">
                  {serviceIcons[s.title]}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{s.description}</p>
                <a href="#contact" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#1B5E8C] hover:underline">
                  Book now <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" /></svg>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── FIND A DOCTOR ─────────────────────────────────── */}
        <section id="doctors" className="bg-white py-16 px-5 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1B5E8C]">Find a Doctor</p>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Meet Our Specialist Team</h2>
              <p className="mx-auto max-w-xl text-base leading-8 text-slate-600">Experienced, board-certified doctors committed to your health.</p>
            </div>

            {/* Search */}
            <div className="mb-10 rounded-3xl bg-[#E7F1F8] p-6">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <input type="search" placeholder="Search by name or specialty..." className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm text-slate-700 outline-none focus:border-[#1B5E8C] focus:ring-2 focus:ring-[#1B5E8C]/20 w-full" />
                <select className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none focus:border-[#1B5E8C]">
                  <option>All Specialties</option>
                  {services.map(s => <option key={s.title}>{s.title}</option>)}
                </select>
                <button className="rounded-2xl bg-[#1B5E8C] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#134466] transition-colors">Search</button>
              </div>
            </div>

            {/* Doctor cards */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[
                { name: 'Dr. A. Okonkwo', specialty: 'General Medicine', exp: '12 yrs', avail: 'Mon–Fri', initials: 'AO' },
                { name: 'Dr. F. Adeyemi', specialty: 'Surgery', exp: '18 yrs', avail: 'Mon–Sat', initials: 'FA' },
                { name: 'Dr. N. Bello', specialty: 'Maternity & Gynaecology', exp: '9 yrs', avail: 'Tue–Sat', initials: 'NB' },
              ].map(doc => (
                <div key={doc.name} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow service-card">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E8C] to-[#2876a8] text-white text-xl font-bold shrink-0">
                      {doc.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{doc.name}</h3>
                      <p className="text-sm text-[#1B5E8C] font-medium">{doc.specialty}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-500 mb-5">
                    <span className="flex items-center gap-1">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
                      {doc.exp} experience
                    </span>
                    <span className="flex items-center gap-1">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      {doc.avail}
                    </span>
                  </div>
                  <a href="#contact" className="flex w-full items-center justify-center rounded-2xl bg-[#E7F1F8] py-3 text-sm font-semibold text-[#1B5E8C] hover:bg-[#1B5E8C] hover:text-white transition-colors">
                    Book Appointment
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HEALTH TOOLS ──────────────────────────────────── */}
        <section id="tools" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-10 text-center space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1B5E8C]">Self-Service Tools</p>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Free Health Resources</h2>
            <p className="mx-auto max-w-xl text-sm leading-7 text-slate-500">Quick tools to help you track, calculate, and plan your health journey.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'BMI Calculator', desc: 'Calculate your Body Mass Index', icon: (
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="16" cy="16" r="12" /><line x1="16" y1="8" x2="16" y2="16" /><line x1="16" y1="16" x2="20" y2="20" /></svg>
              )},
              { title: 'Due Date Calculator', desc: 'Plan your pregnancy timeline', icon: (
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="6" width="24" height="22" rx="3" /><line x1="4" y1="13" x2="28" y2="13" /><line x1="10" y1="3" x2="10" y2="9" /><line x1="22" y1="3" x2="22" y2="9" /></svg>
              )},
              { title: 'Vaccination Reminder', desc: 'Stay on schedule for immunisations', icon: (
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M 20 6 L 26 12 L 14 24 L 8 26 L 10 20 Z" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
              )},
              { title: 'Health Risk Check', desc: 'Assess common health risks', icon: (
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M 16 4 L 28 10 L 28 20 Q 28 28 16 30 Q 4 28 4 20 L 4 10 Z" /><line x1="16" y1="13" x2="16" y2="17" /><circle cx="16" cy="21" r="1" fill="currentColor" /></svg>
              )},
            ].map(t => (
              <div key={t.title} className="group rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm service-card">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7F1F8] text-[#1B5E8C] group-hover:bg-[#1B5E8C] group-hover:text-white transition-colors">
                  {t.icon}
                </div>
                <h3 className="font-bold text-slate-900">{t.title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{t.desc}</p>
                <button className="mt-5 w-full rounded-2xl border-2 border-[#1B5E8C] py-2.5 text-sm font-semibold text-[#1B5E8C] hover:bg-[#1B5E8C] hover:text-white transition-colors">
                  Use Tool
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────── */}
        <section className="bg-gradient-to-b from-[#E7F1F8] to-white py-16 px-5 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1B5E8C]">Patient Stories</p>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">What Our Patients Say</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map(t => (
                <div key={t.name} className="rounded-3xl bg-white p-7 shadow-sm border border-slate-100 flex flex-col gap-5">
                  <div className="flex gap-1">
                    {Array.from({length:5}).map((_,i) => (
                      <svg key={i} viewBox="0 0 20 20" className="w-4 h-4 text-amber-400 fill-current"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-sm leading-7 text-slate-600 flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1B5E8C] text-xs font-bold text-white">{t.initials}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#0d3f66] to-[#1B5E8C] px-5 py-16 text-white sm:px-8">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -right-10 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute left-0 bottom-0 h-40 w-40 rounded-full bg-[#10B981]/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-4xl text-center space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a8d8f0]">Ready to get started?</p>
            <h2 className="text-3xl font-bold sm:text-4xl leading-tight">Your Health Is Worth the Best Care</h2>
            <p className="mx-auto max-w-xl text-base leading-8 text-[#cce5f5]">
              Book an appointment online or call us directly — our specialists are ready to see you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#contact" className="flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-[#1B5E8C] shadow-xl hover:bg-blue-50 transition-colors w-full sm:w-auto justify-center">
                Book an Appointment
              </a>
              <a href="tel:08028611472" className="flex items-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 px-8 py-4 text-sm font-semibold text-white hover:bg-white/20 transition-colors w-full sm:w-auto justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
                0802 861 1472
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────── */}
        <footer id="contact" className="bg-slate-900 py-16 px-5 text-slate-400 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 xl:grid-cols-[1.5fr_1fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B5E8C]">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                      <rect x="8" y="2" width="8" height="4" rx="1" fill="white" />
                      <rect x="2" y="6" width="20" height="16" rx="2" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.5" />
                      <line x1="12" y1="10" x2="12" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <line x1="8" y1="14" x2="16" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-bold text-white leading-tight">Upward Specialist Hospital</p>
                    <p className="text-[10px] font-medium text-slate-500 tracking-wide">IDIMU, LAGOS</p>
                  </div>
                </div>
                <p className="text-sm leading-7">Premium specialist care delivered with warmth, expertise, and compassion for every patient and family.</p>
                <div className="mt-6 flex gap-3">
                  {['Facebook','Twitter','Instagram'].map(s => (
                    <div key={s} className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-xs font-bold text-slate-400 hover:bg-[#1B5E8C] hover:text-white transition-colors cursor-pointer">
                      {s[0]}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-bold text-white mb-4">Quick Links</p>
                <ul className="space-y-3 text-sm">
                  {['Home','About Us','Our Services','Find a Doctor','Health Resources','Contact'].map(l => (
                    <li key={l}><a href="#home" className="hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-bold text-white mb-4">Services</p>
                <ul className="space-y-3 text-sm">
                  {services.map(s => <li key={s.title}>{s.title}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-bold text-white mb-4">Contact Us</p>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 mt-0.5 shrink-0 text-[#1B5E8C]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span>Waidi Ewe-Nla Street, Isheri Olofin, Lagos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-[#1B5E8C]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
                    <a href="tel:08028611472" className="hover:text-white transition-colors">0802 861 1472</a>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#1B5E8C] mb-2">Emergency</p>
                    <a href="tel:08028611472" className="inline-flex items-center gap-2 rounded-xl bg-[#1B5E8C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#134466] transition-colors">
                      Call Now — 24/7
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <p>© 2025 Upward Specialist Hospital. All rights reserved.</p>
              <p>Idimu, Lagos · Open 24 Hours</p>
            </div>
          </div>
        </footer>
      </main>

      {/* ── MOBILE BOTTOM NAV (native app feel) ───────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] mobile-nav-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map(item => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setActiveTab(item.label)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all min-w-[52px] ${
                activeTab === item.label
                  ? 'text-[#1B5E8C] bg-[#E7F1F8]'
                  : 'text-slate-400'
              }`}
            >
              <span className={activeTab === item.label ? 'text-[#1B5E8C]' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span className="text-[10px] font-semibold leading-none">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
