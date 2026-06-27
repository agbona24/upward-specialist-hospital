'use client';

import { useState, useEffect, useRef } from 'react';

/* ─── Scroll-reveal hook ───────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );

    Array.from(document.querySelectorAll('[data-reveal]')).forEach(el => {
      const rect = el.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (alreadyVisible) {
        // In viewport on load — reveal immediately, no animation needed
        el.classList.add('revealed');
      } else {
        // Off-screen — hide it and watch for scroll
        el.classList.add('reveal-ready');
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);
}

/* ─── Count-up component ───────────────────────────────────── */
function CountUp({ to, suffix = '', duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      obs.disconnect();
      const frames = duration / 16;
      let frame = 0;
      const tick = () => {
        frame++;
        const progress = frame / frames;
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setCount(Math.min(Math.round(ease * to), to));
        if (frame < frames) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── ECG monitor SVG ──────────────────────────────────────── */
function HeartbeatMonitorSVG() {
  return (
    <svg viewBox="0 0 520 320" className="w-full h-full" aria-hidden>
      <rect x="30" y="20" width="460" height="260" rx="24" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <rect x="50" y="40" width="420" height="200" rx="12" fill="rgba(0,0,0,0.3)" />
      {[80,120,160,200].map(y => (
        <line key={y} x1="60" y1={y} x2="460" y2={y} stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
      ))}
      {[100,150,200,250,300,350,400].map(x => (
        <line key={x} x1={x} y1="48" x2={x} y2="232" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
      ))}
      <path
        className="ecg-path"
        d="M 60 140 L 100 140 L 115 140 L 125 80 L 140 200 L 155 70 L 170 140 L 200 140 L 215 140 L 225 95 L 240 185 L 255 75 L 270 140 L 300 140 L 315 140 L 325 90 L 340 190 L 355 78 L 370 140 L 460 140"
        stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      <rect x="60" y="48" width="3" height="184" fill="rgba(16,185,129,0.4)" rx="2">
        <animateTransform attributeName="transform" type="translate" from="0 0" to="397 0" dur="3s" repeatCount="indefinite" />
      </rect>
      <circle cx="70" cy="255" r="5" fill="#10B981">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <text x="83" y="259" fill="rgba(255,255,255,0.7)" fontSize="11" fontFamily="monospace">NORMAL SINUS</text>
      <text x="370" y="259" fill="#10B981" fontSize="11" fontFamily="monospace">72 BPM</text>
      <rect x="235" y="280" width="50" height="14" rx="4" fill="rgba(255,255,255,0.12)" />
      <rect x="215" y="290" width="90" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}

function FloatingMedicalIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="float-icon-1 absolute top-[8%] right-[6%] opacity-30">
        <svg width="48" height="48" viewBox="0 0 48 48">
          <rect x="19" y="6" width="10" height="36" rx="3" fill="white" />
          <rect x="6" y="19" width="36" height="10" rx="3" fill="white" />
        </svg>
      </div>
      <div className="float-icon-2 absolute top-[55%] left-[3%] opacity-20">
        <svg width="52" height="52" viewBox="0 0 52 52">
          <path d="M 10 8 Q 8 22 16 28 Q 24 34 26 42 Q 28 50 36 50 Q 46 50 46 40 Q 46 32 38 32" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="38" cy="28" r="5" stroke="white" strokeWidth="2.5" fill="none" />
          <circle cx="10" cy="8" r="3" fill="white" /><circle cx="20" cy="6" r="3" fill="white" />
        </svg>
      </div>
      <div className="float-icon-3 absolute bottom-[12%] right-[8%] opacity-25">
        <svg width="44" height="44" viewBox="0 0 44 44" className="heart-pulse">
          <path d="M 22 38 L 5 22 Q 2 12 10 8 Q 16 5 22 14 Q 28 5 34 8 Q 42 12 39 22 Z" fill="white" />
        </svg>
      </div>
      <div className="float-icon-4 absolute top-[30%] right-[2%] opacity-20">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <rect x="4" y="14" width="32" height="12" rx="6" fill="white" />
          <line x1="20" y1="14" x2="20" y2="26" stroke="rgba(27,94,140,0.5)" strokeWidth="1.5" />
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

/* ─── Data ─────────────────────────────────────────────────── */
const serviceIcons: Record<string, React.ReactNode> = {
  "General Medicine": (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="4" y="6" width="24" height="20" rx="3" />
      <line x1="16" y1="11" x2="16" y2="21" /><line x1="11" y1="16" x2="21" y2="16" />
    </svg>
  ),
  "Surgery": (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M 8 8 L 24 24" /><path d="M 8 24 L 24 8" /><circle cx="16" cy="16" r="10" />
    </svg>
  ),
  "Maternity & Gynaecology": (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M 16 4 Q 10 4 10 10 Q 10 18 16 22 Q 22 18 22 10 Q 22 4 16 4" />
      <circle cx="16" cy="16" r="4" fill="currentColor" fillOpacity="0.2" />
      <line x1="16" y1="22" x2="16" y2="28" /><line x1="12" y1="26" x2="20" y2="26" />
    </svg>
  ),
  "Paediatrics": (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="16" cy="10" r="5" /><path d="M 9 28 Q 9 18 16 18 Q 23 18 23 28" />
      <path d="M 6 22 Q 4 18 7 16" /><path d="M 26 22 Q 28 18 25 16" />
    </svg>
  ),
  "Diagnostics & Lab": (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M 12 4 L 12 16 L 7 26 Q 6 28 8 28 L 24 28 Q 26 28 25 26 L 20 16 L 20 4" />
      <line x1="10" y1="4" x2="22" y2="4" /><line x1="10" y1="8" x2="22" y2="8" />
      <circle cx="14" cy="22" r="2" fill="currentColor" fillOpacity="0.4" />
    </svg>
  ),
  "Emergency Care": (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M 16 4 L 18 13 L 28 13 L 20 19 L 23 28 L 16 22 L 9 28 L 12 19 L 4 13 L 14 13 Z" />
    </svg>
  ),
};

const testimonials = [
  { name: "Mrs. Adebimpe O.", role: "Maternity", text: "The maternity team gave me the most reassuring experience. I felt safe and well cared for throughout my delivery.", initials: "AO" },
  { name: "Mr. Tunde F.", role: "General Medicine", text: "Very professional staff and fast diagnosis. In and out quickly with complete clarity on my treatment plan.", initials: "TF" },
  { name: "Mrs. Ngozi K.", role: "Paediatrics", text: "The paediatric unit is warm and child-friendly. My son actually looks forward to check-ups now!", initials: "NK" },
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
  { icon: "🏥", title: "Experienced Specialists", body: "Board-certified doctors in every specialty." },
  { icon: "🔬", title: "Modern Facilities", body: "Advanced equipment and private suites." },
  { icon: "⚡", title: "24-Hour Emergency", body: "Fast care anytime — day or night." },
  { icon: "🤝", title: "Community Trusted", body: "Serving Idimu and Lagos for years." },
];

const bottomNavItems = [
  { label: 'Home', href: '#home', id: 'Home', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  )},
  { label: 'Services', href: '#services', id: 'Services', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="8" y="2" width="8" height="4" rx="1" /><rect x="2" y="6" width="20" height="16" rx="2" />
      <line x1="12" y1="10" x2="12" y2="18" /><line x1="8" y1="14" x2="16" y2="14" />
    </svg>
  )},
  { label: 'Book', href: '#book', id: 'Book', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" /><line x1="12" y1="14" x2="12" y2="18" /><line x1="10" y1="16" x2="14" y2="16" />
    </svg>
  )},
  { label: 'Doctors', href: '#doctors', id: 'Doctors', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
    </svg>
  )},
  { label: 'Contact', href: '#contact', id: 'Contact', icon: (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
    </svg>
  )},
];

/* ─── Tool: BMI Calculator ─────────────────────────────────── */
function BMITool({ onBook }: { onBook: () => void }) {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<{ bmi: number; category: string; color: string; advice: string } | null>(null);

  function calculate() {
    const h = parseFloat(height), w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return;
    const bmi = Math.round((w / Math.pow(h / 100, 2)) * 10) / 10;
    let category: string, color: string, advice: string;
    if (bmi < 18.5)       { category = 'Underweight'; color = '#3B82F6'; advice = 'You may benefit from a personalised nutrition plan. Speak with our General Medicine team.'; }
    else if (bmi < 25)    { category = 'Normal Weight'; color = '#10B981'; advice = 'Great job! Maintain your healthy weight with regular exercise and a balanced diet.'; }
    else if (bmi < 30)    { category = 'Overweight'; color = '#F59E0B'; advice = 'Consider lifestyle changes. Our doctors can help you build a personalised wellness plan.'; }
    else                  { category = 'Obese'; color = '#EF4444'; advice = 'We recommend a specialist consultation. Book an appointment with our team today.'; }
    setResult({ bmi, category, color, advice });
  }

  const gaugePercent = result ? Math.min(100, Math.max(0, ((result.bmi - 10) / 30) * 100)) : 0;
  const inp = "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base outline-none focus:border-[#1B5E8C] focus:ring-2 focus:ring-[#1B5E8C]/20 transition-all";

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Height (cm)</label>
          <input type="number" placeholder="e.g. 170" value={height} min="50" max="250"
            onChange={e => { setHeight(e.target.value); setResult(null); }} className={inp} />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Weight (kg)</label>
          <input type="number" placeholder="e.g. 70" value={weight} min="10" max="300"
            onChange={e => { setWeight(e.target.value); setResult(null); }} className={inp} />
        </div>
      </div>
      <button onClick={calculate} disabled={!height || !weight}
        className="w-full rounded-2xl bg-[#1B5E8C] py-4 text-sm font-bold text-white hover:bg-[#134466] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
        Calculate BMI
      </button>
      {result && (
        <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 space-y-4">
          <div className="text-center">
            <p className="text-5xl font-black" style={{ color: result.color }}>{result.bmi}</p>
            <p className="text-base font-bold mt-1" style={{ color: result.color }}>{result.category}</p>
          </div>
          <div className="space-y-2">
            <div className="relative h-4 rounded-full overflow-hidden" style={{ background: 'linear-gradient(to right, #60a5fa 0%, #34d399 30%, #fbbf24 60%, #f87171 100%)' }}>
              <div className="absolute top-0 bottom-0 w-1 bg-white rounded-full shadow-md" style={{ left: `calc(${gaugePercent}% - 2px)` }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
              <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-6 bg-white rounded-xl p-4 border border-slate-100">{result.advice}</p>
          <button onClick={onBook} className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1B5E8C] py-3.5 text-sm font-bold text-white hover:bg-[#134466] active:scale-95 transition-all">
            Book a Consultation
          </button>
        </div>
      )}
      <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-700 leading-5">
        BMI is a screening tool, not a medical diagnosis. Please consult a healthcare professional for personalised advice.
      </div>
    </div>
  );
}

/* ─── Tool: Due Date Calculator ────────────────────────────── */
function DueDateTool({ onBook }: { onBook: () => void }) {
  const [lmp, setLmp] = useState('');

  const info = lmp ? (() => {
    const lmpDate  = new Date(lmp);
    const due      = new Date(lmpDate.getTime() + 280 * 864e5);
    const today    = new Date();
    const days     = Math.floor((today.getTime() - lmpDate.getTime()) / 864e5);
    const weeks    = Math.max(0, Math.min(42, Math.floor(days / 7)));
    const trim     = weeks < 13 ? 1 : weeks < 27 ? 2 : 3;
    return { due, weeks, days, trim };
  })() : null;

  const milestones = [
    { week: 8,  label: 'First scan / ultrasound' },
    { week: 12, label: 'End of 1st trimester' },
    { week: 20, label: 'Anomaly scan' },
    { week: 28, label: 'Start of 3rd trimester' },
    { week: 37, label: 'Full term' },
    { week: 40, label: 'Due date' },
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">First Day of Last Menstrual Period (LMP)</label>
        <input type="date" value={lmp} max={new Date().toISOString().split('T')[0]}
          onChange={e => setLmp(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base outline-none focus:border-[#1B5E8C] focus:ring-2 focus:ring-[#1B5E8C]/20 transition-all" />
      </div>

      {info && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#E7F1F8] p-5 text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1B5E8C]">Estimated Due Date</p>
            <p className="text-3xl font-black text-[#1B5E8C]">
              {info.due.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-base font-semibold text-slate-600">
              {info.weeks} weeks + {info.days % 7} days pregnant
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#1B5E8C]">
              Trimester {info.trim} of 3
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Week 0</span><span>Week 20</span><span>Week 40</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#1B5E8C] to-[#10B981] transition-all duration-700"
                style={{ width: `${Math.min(100, (info.weeks / 40) * 100)}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Key Milestones</p>
            {milestones.map(m => {
              const lmpDate = new Date(lmp);
              const mDate = new Date(lmpDate.getTime() + m.week * 7 * 864e5);
              const passed = info.weeks >= m.week;
              return (
                <div key={m.week} className={`flex items-center justify-between rounded-2xl px-4 py-3 ${passed ? 'bg-[#E7F1F8]' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${passed ? 'bg-[#1B5E8C] text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {passed ? '✓' : m.week}
                    </div>
                    <span className={`text-sm ${passed ? 'font-semibold text-slate-700' : 'text-slate-500'}`}>{m.label}</span>
                  </div>
                  <span className="text-xs text-slate-400">{mDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                </div>
              );
            })}
          </div>

          <button onClick={onBook} className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1B5E8C] py-3.5 text-sm font-bold text-white hover:bg-[#134466] active:scale-95 transition-all">
            Book Antenatal Appointment
          </button>
        </div>
      )}

      <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-700 leading-5">
        Estimate based on a 28-day cycle. Always confirm with your doctor for an accurate clinical assessment.
      </div>
    </div>
  );
}

/* ─── Tool: Vaccination Reminder ───────────────────────────── */
function VaccineTool({ onBook }: { onBook: () => void }) {
  const [dob, setDob] = useState('');

  const schedule = [
    { age: 'At Birth',   weeks: 0,  vaccines: ['BCG', 'OPV-0', 'Hepatitis B (1st dose)'] },
    { age: '6 Weeks',    weeks: 6,  vaccines: ['OPV-1', 'Pentavalent-1 (DTP+HBV+Hib)', 'PCV-1', 'Rotavirus-1'] },
    { age: '10 Weeks',   weeks: 10, vaccines: ['OPV-2', 'Pentavalent-2', 'PCV-2', 'Rotavirus-2'] },
    { age: '14 Weeks',   weeks: 14, vaccines: ['OPV-3', 'Pentavalent-3', 'PCV-3', 'IPV'] },
    { age: '9 Months',   weeks: 39, vaccines: ['Measles-1', 'Yellow Fever', 'Meningococcal A'] },
    { age: '15 Months',  weeks: 65, vaccines: ['Measles-2 / MMR'] },
  ];

  function vaccDate(dobDate: Date, weeks: number) {
    return new Date(dobDate.getTime() + weeks * 7 * 864e5);
  }
  function status(weeks: number): 'past' | 'due' | 'upcoming' {
    if (!dob) return 'upcoming';
    const diff = Math.floor((vaccDate(new Date(dob), weeks).getTime() - Date.now()) / 864e5);
    if (diff < -14) return 'past';
    if (diff <= 30)  return 'due';
    return 'upcoming';
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Child's Date of Birth</label>
        <input type="date" value={dob} max={new Date().toISOString().split('T')[0]}
          onChange={e => setDob(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-base outline-none focus:border-[#1B5E8C] focus:ring-2 focus:ring-[#1B5E8C]/20 transition-all" />
      </div>

      {dob && (
        <div className="space-y-3">
          <div className="flex gap-4 text-xs font-semibold text-slate-500 mb-1">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-300 inline-block" />Done</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />Due soon</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#1B5E8C] inline-block" />Upcoming</span>
          </div>

          {schedule.map(s => {
            const dobDate = new Date(dob);
            const vDate   = vaccDate(dobDate, s.weeks);
            const st      = status(s.weeks);
            const rowCls  = st === 'past' ? 'bg-slate-50 border-slate-100' : st === 'due' ? 'bg-amber-50 border-amber-200' : 'bg-[#E7F1F8] border-[#1B5E8C]/20';
            const dotCls  = st === 'past' ? 'bg-slate-300' : st === 'due' ? 'bg-amber-400' : 'bg-[#1B5E8C]';
            const tagCls  = st === 'past' ? 'bg-slate-200 text-slate-500' : st === 'due' ? 'bg-amber-100 text-amber-800' : 'bg-[#1B5E8C]/10 text-[#1B5E8C]';
            return (
              <div key={s.age} className={`rounded-2xl border p-4 ${rowCls}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotCls}`} />
                    <span className="text-sm font-bold text-slate-900">{s.age}</span>
                  </div>
                  <span className="text-xs text-slate-500">{vDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 ml-5">
                  {s.vaccines.map(v => (
                    <span key={v} className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${tagCls}`}>{v}</span>
                  ))}
                </div>
                {st === 'due' && (
                  <p className="ml-5 mt-2 text-xs font-bold text-amber-700">⚡ Due within 30 days — schedule now!</p>
                )}
              </div>
            );
          })}

          <button onClick={onBook} className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1B5E8C] py-3.5 text-sm font-bold text-white hover:bg-[#134466] active:scale-95 transition-all">
            Book Paediatrics Appointment
          </button>
        </div>
      )}

      <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-700 leading-5">
        Based on Nigeria's National Immunization Programme (NIP) schedule. Consult your paediatrician for personalised advice.
      </div>
    </div>
  );
}

/* ─── Tool: Health Risk Check ──────────────────────────────── */
function RiskTool({ onBook }: { onBook: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ heart: string; diabetes: string; hypertension: string } | null>(null);

  const questions = [
    { key: 'age',       label: 'What is your age group?',                          opts: ['Under 30', '30–45', '46–60', 'Over 60'] },
    { key: 'smoke',     label: 'Do you smoke or use tobacco?',                     opts: ['No', 'Former smoker', 'Occasionally', 'Yes, regularly'] },
    { key: 'exercise',  label: 'How often do you exercise?',                       opts: ['5+ times a week', '2–3 times a week', 'Rarely', 'Never'] },
    { key: 'diet',      label: 'How would you describe your diet?',                opts: ['Very healthy', 'Mostly healthy', 'Average', 'Mostly unhealthy'] },
    { key: 'family',    label: 'Family history of heart disease or diabetes?',     opts: ['None', 'Distant relatives', 'Parent or sibling', 'Multiple relatives'] },
    { key: 'existing',  label: 'Any existing diagnosed conditions?',               opts: ['None', 'Diabetes', 'Hypertension', 'Both'] },
  ];

  function calcScore(ans: Record<string, string>) {
    const ageW  = { 'Under 30': 0, '30–45': 1, '46–60': 2, 'Over 60': 3 };
    const smoW  = { 'No': 0, 'Former smoker': 1, 'Occasionally': 2, 'Yes, regularly': 3 };
    const exW   = { '5+ times a week': 0, '2–3 times a week': 0, 'Rarely': 2, 'Never': 3 };
    const dietW = { 'Very healthy': 0, 'Mostly healthy': 0, 'Average': 1, 'Mostly unhealthy': 2 };
    const famW  = { 'None': 0, 'Distant relatives': 1, 'Parent or sibling': 2, 'Multiple relatives': 3 };

    const a = (ageW as any)[ans.age] ?? 0;
    const s = (smoW as any)[ans.smoke] ?? 0;
    const e = (exW as any)[ans.exercise] ?? 0;
    const d = (dietW as any)[ans.diet] ?? 0;
    const f = (famW as any)[ans.family] ?? 0;

    let heartScore = a + s * 1.5 + e + d + f;
    let diabScore  = a + e + d * 1.5 + f;
    let bpScore    = a + s * 0.5 + e + d;

    if (ans.existing === 'Diabetes')    { diabScore += 3; }
    if (ans.existing === 'Hypertension'){ bpScore   += 3; heartScore += 1; }
    if (ans.existing === 'Both')        { diabScore += 3; bpScore += 3; heartScore += 2; }

    const level = (n: number) => n <= 2 ? 'Low' : n <= 5 ? 'Moderate' : 'High';
    return { heart: level(heartScore), diabetes: level(diabScore), hypertension: level(bpScore) };
  }

  function choose(opt: string) {
    const q = questions[step];
    const next = { ...answers, [q.key]: opt };
    setAnswers(next);
    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      setResult(calcScore(next));
    }
  }

  function reset() { setStep(0); setAnswers({}); setResult(null); }

  const riskColor = (v: string) => v === 'Low' ? '#10B981' : v === 'Moderate' ? '#F59E0B' : '#EF4444';
  const riskBg    = (v: string) => v === 'Low' ? 'bg-emerald-50 border-emerald-200' : v === 'Moderate' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

  if (result) {
    const anyHigh = Object.values(result).includes('High');
    const anyMod  = Object.values(result).includes('Moderate');
    return (
      <div className="p-6 space-y-5">
        <div className="text-center space-y-1">
          <p className="text-lg font-bold text-slate-900">Your Health Risk Summary</p>
          <p className="text-sm text-slate-500">A screening guide — not a clinical diagnosis.</p>
        </div>
        {[
          { label: 'Cardiovascular Risk', value: result.heart,        icon: '❤️' },
          { label: 'Diabetes Risk',       value: result.diabetes,     icon: '🩸' },
          { label: 'Hypertension Risk',   value: result.hypertension, icon: '💉' },
        ].map(r => (
          <div key={r.label} className={`flex items-center justify-between rounded-2xl border p-5 ${riskBg(r.value)}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{r.icon}</span>
              <span className="font-bold text-slate-800 text-sm">{r.label}</span>
            </div>
            <span className="text-lg font-black" style={{ color: riskColor(r.value) }}>{r.value}</span>
          </div>
        ))}
        <div className="rounded-2xl bg-[#E7F1F8] p-4 text-sm text-[#1B5E8C] leading-6">
          {anyHigh
            ? 'Some risk scores are elevated. We strongly recommend booking a comprehensive check-up with one of our specialists.'
            : anyMod
            ? 'Some moderate risk factors detected. A routine check-up and lifestyle adjustments are advised.'
            : 'Your risk factors appear low — great! Keep up healthy habits and schedule annual check-ups.'}
        </div>
        <div className="flex gap-3">
          <button onClick={reset} className="flex-1 rounded-2xl border-2 border-slate-200 py-3.5 text-sm font-semibold text-slate-600 active:scale-95 transition-all">Retake</button>
          <button onClick={onBook} className="flex-[2] rounded-2xl bg-[#1B5E8C] py-3.5 text-sm font-bold text-white hover:bg-[#134466] active:scale-95 transition-all">Book a Check-Up</button>
        </div>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div className="p-6 space-y-5">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>Question {step + 1} of {questions.length}</span>
          <span>{Math.round((step / questions.length) * 100)}% complete</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#1B5E8C] rounded-full transition-all duration-500"
            style={{ width: `${(step / questions.length) * 100}%` }} />
        </div>
      </div>
      <p className="text-base font-bold text-slate-900">{q.label}</p>
      <div className="space-y-2.5">
        {q.opts.map(opt => (
          <button key={opt} onClick={() => choose(opt)}
            className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-left text-sm font-semibold text-slate-700 hover:border-[#1B5E8C] hover:bg-[#E7F1F8] hover:text-[#1B5E8C] active:scale-[0.98] transition-all">
            {opt}
          </button>
        ))}
      </div>
      {step > 0 && (
        <button onClick={() => setStep(s => s - 1)} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Go back
        </button>
      )}
    </div>
  );
}

/* ─── Doctors data ─────────────────────────────────────────── */
const doctors = [
  { name: 'Dr. A. Okonkwo', specialty: 'General Medicine',       exp: '12 yrs', avail: 'Mon–Fri', initials: 'AO', today: true  },
  { name: 'Dr. F. Adeyemi', specialty: 'Surgery',                exp: '18 yrs', avail: 'Mon–Sat', initials: 'FA', today: true  },
  { name: 'Dr. N. Bello',   specialty: 'Maternity & Gynaecology',exp: '9 yrs',  avail: 'Tue–Sat', initials: 'NB', today: false },
  { name: 'Dr. K. Ibrahim', specialty: 'Paediatrics',            exp: '7 yrs',  avail: 'Mon–Fri', initials: 'KI', today: true  },
  { name: 'Dr. C. Eze',     specialty: 'Diagnostics & Lab',      exp: '10 yrs', avail: 'Mon–Sat', initials: 'CE', today: true  },
  { name: 'Dr. E. Lawal',   specialty: 'Emergency Care',         exp: '15 yrs', avail: '24 / 7',  initials: 'EL', today: true  },
];

/* ─── FAQ data ──────────────────────────────────────────────── */
const faqs = [
  { q: 'Do I need a referral to see a specialist?',
    a: 'No referral needed. You can book directly with any of our specialists online or by calling 0802 861 1472.' },
  { q: 'Does the hospital accept HMO / health insurance?',
    a: 'Yes. We accept major HMO plans and health insurance. Call us to confirm your specific plan is covered before your visit.' },
  { q: 'What should I bring to my first appointment?',
    a: "Bring a valid ID, any previous test results or medical records, and a list of your current medications. For maternity or paediatric visits, bring your health card or the baby's vaccination booklet." },
  { q: 'Is parking available at the hospital?',
    a: 'Yes, free patient parking is available on-site. Our front-desk team will direct you upon arrival.' },
  { q: 'How do I reach the emergency unit?',
    a: 'Walk in directly at any time — the emergency unit is open 24 hours, 7 days a week. You can also call 0802 861 1472 and our team will assist immediately.' },
  { q: 'How long does a consultation typically take?',
    a: 'Standard consultations run 20–40 minutes. If tests or procedures are requested, allow extra time. We space appointments carefully to minimise waiting.' },
];

/* ─── Smart Guide quiz data ─────────────────────────────────── */
type QuizOption = { label: string; emoji: string; next: string };
type QuizNode   = { question: string; sub?: string; options: QuizOption[] };

const quizNodes: Record<string, QuizNode> = {
  start: {
    question: 'What brings you here today?',
    sub: 'Tap the option that best describes you.',
    options: [
      { label: 'Book an appointment',         emoji: '📅', next: 'result:book' },
      { label: 'I want a health check',       emoji: '🩺', next: 'health' },
      { label: 'Pregnancy or child care',     emoji: '👶', next: 'family' },
      { label: 'Find a specific doctor',      emoji: '🔍', next: 'result:doctors' },
      { label: "It's urgent — emergency",     emoji: '🚨', next: 'result:emergency' },
    ],
  },
  health: {
    question: 'What kind of health check?',
    options: [
      { label: 'Calculate my BMI',            emoji: '⚖️', next: 'result:tool_bmi' },
      { label: 'Assess my health risks',      emoji: '📊', next: 'result:tool_risk' },
      { label: 'I have a general question',   emoji: '💬', next: 'result:whatsapp' },
    ],
  },
  family: {
    question: 'What do you need help with?',
    options: [
      { label: "Child's vaccination schedule", emoji: '💉', next: 'result:tool_vaccine' },
      { label: 'Pregnancy / due date',         emoji: '🤱', next: 'result:tool_duedate' },
      { label: 'Book maternity or paediatrics',emoji: '📅', next: 'result:book' },
    ],
  },
};

const quizDests: Record<string, { title: string; desc: string; cta: string; color: string; emoji: string }> = {
  book:         { title: 'Book an Appointment',    desc: 'Schedule your visit with one of our specialists in 3 easy steps.',   cta: 'Book Now',             color: '#1B5E8C', emoji: '📅' },
  doctors:      { title: 'Browse Our Doctors',     desc: 'View our full specialist team and find the right doctor for you.',   cta: 'Meet Our Doctors',     color: '#2876a8', emoji: '👨‍⚕️' },
  emergency:    { title: 'Emergency — Call Now',   desc: "Don't wait. Our emergency team is on standby 24 hours a day.",       cta: 'Call 0802 861 1472',   color: '#DC2626', emoji: '🚨' },
  whatsapp:     { title: 'Chat on WhatsApp',       desc: 'Send us a message and our patient team will reply quickly.',         cta: 'Open WhatsApp',        color: '#25D366', emoji: '💬' },
  tool_bmi:     { title: 'BMI Calculator',         desc: 'Enter your height and weight to get your BMI score instantly.',      cta: 'Open BMI Calculator',  color: '#1B5E8C', emoji: '⚖️' },
  tool_risk:    { title: 'Health Risk Check',      desc: 'Answer 6 quick questions to see your cardiovascular & diabetes risk.',cta: 'Start Risk Check',    color: '#1B5E8C', emoji: '📊' },
  tool_vaccine: { title: 'Vaccination Reminder',   desc: "Enter your child's birth date to see their full vaccine schedule.",  cta: 'Open Vaccine Planner', color: '#1B5E8C', emoji: '💉' },
  tool_duedate: { title: 'Due Date Calculator',    desc: 'Enter your last period date to find your estimated due date.',       cta: 'Open Due Date Tool',   color: '#1B5E8C', emoji: '🤱' },
};

/* ─── Smart Guide quiz component ────────────────────────────── */
function SmartGuide({ onResult }: { onResult: (dest: string) => void }) {
  const [path, setPath] = useState<string[]>(['start']);
  const current = path[path.length - 1];
  const isResult = current.startsWith('result:');
  const destKey  = isResult ? current.replace('result:', '') : null;
  const dest     = destKey ? quizDests[destKey] : null;
  const node     = !isResult ? quizNodes[current] : null;

  function choose(next: string) { setPath(p => [...p, next]); }
  function back()                { setPath(p => p.slice(0, -1)); }

  /* ── Result screen ── */
  if (dest && destKey) {
    return (
      <div className="p-6 space-y-5">
        <div className="rounded-2xl p-7 text-center space-y-3 border border-slate-100 bg-slate-50">
          <span className="text-5xl block">{dest.emoji}</span>
          <h3 className="text-xl font-bold text-slate-900">{dest.title}</h3>
          <p className="text-sm leading-7 text-slate-500">{dest.desc}</p>
        </div>
        <button
          onClick={() => onResult(destKey)}
          className="w-full rounded-2xl py-4 text-sm font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-all"
          style={{ background: dest.color }}>
          {dest.cta}
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" /></svg>
        </button>
        <button onClick={back} className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Try a different option
        </button>
      </div>
    );
  }

  if (!node) return null;

  /* ── Question screen ── */
  const stepCount = path.filter(s => !s.startsWith('result:')).length;

  return (
    <div className="p-6 space-y-5">
      {/* Step dots */}
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: stepCount + (current === 'start' ? 0 : 0) }).map((_, i) => (
          <span key={i} className={`h-2 rounded-full transition-all duration-300 ${i === stepCount - 1 ? 'w-5 bg-[#1B5E8C]' : 'w-2 bg-[#1B5E8C]/30'}`} />
        ))}
      </div>

      <div className="text-center">
        <p className="text-base font-bold text-slate-900">{node.question}</p>
        {node.sub && <p className="mt-1 text-sm text-slate-400">{node.sub}</p>}
      </div>

      <div className="space-y-2.5">
        {node.options.map(opt => (
          <button
            key={opt.next}
            onClick={() => choose(opt.next)}
            className="group w-full flex items-center gap-4 rounded-2xl border-2 border-slate-100 bg-white px-5 py-4 text-left hover:border-[#1B5E8C] hover:bg-[#E7F1F8] active:scale-[0.98] transition-all">
            <span className="text-2xl">{opt.emoji}</span>
            <span className="flex-1 text-sm font-semibold text-slate-700 group-hover:text-[#1B5E8C] transition-colors">{opt.label}</span>
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-300 group-hover:text-[#1B5E8C] transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        ))}
      </div>

      {path.length > 1 && (
        <button onClick={back} className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Go back
        </button>
      )}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */
export default function Home() {
  const [menuOpen, setMenuOpen]         = useState(false);
  const [activeTab, setActiveTab]       = useState('Home');
  const [scrolled, setScrolled]         = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [slide, setSlide]               = useState(0);
  const [paused, setPaused]             = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [bookStep, setBookStep]         = useState(1);
  const [bookDone, setBookDone]         = useState(false);
  const [bookData, setBookData]         = useState({ service: '', doctor: '', date: '', name: '', phone: '' });
  const [activeTool, setActiveTool]     = useState<string | null>(null);
  const [showGuide, setShowGuide]       = useState(false);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorSpec, setDoctorSpec]     = useState('All Specialties');
  const [openFaq, setOpenFaq]           = useState<number | null>(null);
  const [openTip, setOpenTip]           = useState<number | null>(null);

  useScrollReveal();

  /* Lock body scroll when a modal is open */
  useEffect(() => {
    document.body.style.overflow = (activeTool || showGuide) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeTool, showGuide]);

  function handleGuideResult(dest: string) {
    setShowGuide(false);
    const scroll = (id: string) => setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80);
    if (dest === 'book')         return scroll('book');
    if (dest === 'doctors')      return scroll('doctors');
    if (dest === 'emergency')    return (window.location.href = 'tel:08028611472');
    if (dest === 'whatsapp')     return window.open('https://wa.me/2348028611472', '_blank');
    if (dest.startsWith('tool_')) { setTimeout(() => setActiveTool(dest.replace('tool_', '')), 80); }
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowWhatsApp(window.scrollY > 500);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Auto-advance testimonial carousel */
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSlide(s => (s + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    setBookDone(true);
  }

  const inputCls  = "w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-800 outline-none focus:border-[#1B5E8C] focus:ring-2 focus:ring-[#1B5E8C]/20 transition-all placeholder:text-slate-400";
  const selectCls = "w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-800 outline-none focus:border-[#1B5E8C] focus:ring-2 focus:ring-[#1B5E8C]/20 transition-all appearance-none";

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-[#1a2332]">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/97 shadow-md backdrop-blur-xl' : 'bg-white/85 backdrop-blur-lg border-b border-slate-100'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
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

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            {['#home','#about','#services','#doctors','#book','#contact'].map((href, i) => (
              <a key={href} href={href} className="hover:text-[#1B5E8C] transition-colors">
                {['Home','About','Services','Doctors','Book','Contact'][i]}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="tel:08028611472" className="hidden sm:flex items-center gap-2 text-sm text-[#1B5E8C] font-semibold">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
              </svg>
              0802 861 1472
            </a>
            <a href="#book" className="hidden md:inline-flex rounded-full bg-[#1B5E8C] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#134466] transition-colors">
              Book Appointment
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white active:scale-95 transition-transform" aria-label="Menu">
              {menuOpen
                ? <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                : <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              }
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-5 py-4 space-y-1">
            {[['#home','Home'],['#services','Services'],['#doctors','Doctors'],['#book','Book Appointment'],['#contact','Contact']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-semibold text-slate-700 hover:bg-[#E7F1F8] hover:text-[#1B5E8C] active:scale-95 transition-all">
                {label}
              </a>
            ))}
            <div className="pt-2">
              <a href="#book" onClick={() => setMenuOpen(false)} className="flex w-full items-center justify-center rounded-2xl bg-[#1B5E8C] py-4 text-sm font-bold text-white active:scale-95 transition-transform">
                Book Now
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
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-3xl animate-blob" />
            <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[#10B981]/10 blur-3xl animate-blob" style={{animationDelay:'4s'}} />
          </div>
          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="space-y-7 slide-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#a8d8f0]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                  </span>
                  Specialist care · Idimu, Lagos
                </div>
                <h1 className="text-4xl font-bold leading-[1.15] sm:text-5xl lg:text-6xl gradient-text">
                  Quality Specialist Care —<br />Now Easier to Find
                </h1>
                <p className="max-w-lg text-base leading-8 text-[#cce5f5]">
                  Upward Specialist Hospital delivers advanced, compassionate healthcare to families across Idimu and Lagos — with specialists you can trust, 24 hours a day.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a href="#book" className="flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-bold text-[#1B5E8C] shadow-xl hover:bg-blue-50 active:scale-95 transition-all">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    Book an Appointment
                  </a>
                  <a href="#services" className="flex items-center justify-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 px-7 py-4 text-sm font-semibold text-white hover:bg-white/20 active:scale-95 transition-all">
                    Explore Our Services
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" /></svg>
                  </a>
                </div>

                {/* Smart guide CTA */}
                <button
                  onClick={() => setShowGuide(true)}
                  className="self-start flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 active:scale-95 transition-all">
                  {/* sparkle icon */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                  Not sure where to start? Let us guide you
                </button>

                <div className="flex flex-wrap gap-3 pt-2">
                  {['✓ Open 24/7', '✓ Specialist Doctors', '✓ Trusted by Families', '✓ Emergency Ready'].map(b => (
                    <span key={b} className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white">{b}</span>
                  ))}
                </div>
              </div>
              <div className="slide-right relative">
                <div className="glass rounded-3xl p-4 shadow-2xl">
                  <div className="aspect-[16/9] w-full"><HeartbeatMonitorSVG /></div>
                </div>
                <div className="glass absolute -left-4 top-8 rounded-2xl px-4 py-3 shadow-lg hidden sm:block">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#a8d8f0]">We Serve</p>
                  <p className="text-sm font-bold text-white">Families &amp; Communities</p>
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

        {/* ── STATS BAR (animated count-up) ─────────────────── */}
        <section className="bg-white shadow-sm border-b border-slate-100" data-reveal>
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 divide-x divide-slate-100 md:grid-cols-4">
              <div className="stat-card py-7 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-[#1B5E8C]">24/7</p>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">Emergency Care</p>
              </div>
              <div className="stat-card py-7 text-center flex flex-col items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#1B5E8C]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="7" r="4" /><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" /></svg>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold">Specialist Doctors</p>
              </div>
              <div className="stat-card py-7 text-center flex flex-col items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#1B5E8C]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold">Families Served</p>
              </div>
              <div className="stat-card py-7 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-[#1B5E8C]">
                  <CountUp to={6} suffix="+" />
                </p>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">Specialties</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BADGES ──────────────────────────────────── */}
        <div className="border-b border-slate-100 bg-white" data-reveal>
          <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {[
                { label: 'MDCN Registered',         icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9,12 11,14 15,10" /></svg>
                )},
                { label: 'NMA Member',               icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" /><line x1="12" y1="14" x2="12" y2="20" /></svg>
                )},
                { label: 'Lagos State MOH Licensed', icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="15" x2="13" y2="15" /></svg>
                )},
                { label: 'HEFAMAA Accredited',       icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="9,12 11,14 15,10" /></svg>
                )},
                { label: '24/7 Emergency Ready',     icon: (
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
                )},
              ].map(b => (
                <div key={b.label} className="flex items-center gap-2 text-slate-500">
                  <span className="text-[#1B5E8C]">{b.icon}</span>
                  <span className="text-xs font-semibold">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ABOUT ─────────────────────────────────────────── */}
        <section id="about" className="mx-auto max-w-7xl px-5 py-16 sm:px-8" data-reveal>
          <div className="rounded-3xl bg-gradient-to-r from-[#E7F1F8] to-white p-8 sm:p-12 border border-slate-100 shadow-sm">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1B5E8C]">Who We Are</p>
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl leading-tight">Passionate About Your Health &amp; Wellbeing</h2>
                <p className="text-base leading-8 text-slate-600">
                  Located in Idimu, Lagos, Upward Specialist Hospital brings world-class specialist healthcare closer to families in our community. We combine skilled professionals with modern technology to deliver personalised, dignified care.
                </p>
                <a href="#book" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1B5E8C] hover:underline">
                  Book a consultation
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" /></svg>
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {whyUs.map(w => (
                  <div key={w.title} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 hover:border-[#1B5E8C]/30 active:scale-95 transition-all">
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
        <section id="services" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
          <div className="mb-10 text-center space-y-3" data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1B5E8C]">What We Offer</p>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Our Specialist Services</h2>
            <p className="mx-auto max-w-xl text-base leading-8 text-slate-600">A coordinated team of specialists delivering premium care for every stage of health.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((s, i) => (
              <div key={s.title} data-reveal data-delay={String(i % 3)}
                className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm service-card cursor-pointer active:scale-95 transition-all">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7F1F8] text-[#1B5E8C] group-hover:bg-[#1B5E8C] group-hover:text-white transition-colors">
                  {serviceIcons[s.title]}
                </div>
                <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{s.description}</p>
                <a href="#book" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1B5E8C] hover:underline">
                  Book now <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" /></svg>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ── DOCTORS ───────────────────────────────────────── */}
        <section id="doctors" className="bg-white py-16 px-5 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center space-y-3" data-reveal>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1B5E8C]">Find a Doctor</p>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Meet Our Specialist Team</h2>
              <p className="mx-auto max-w-xl text-base leading-8 text-slate-600">Experienced, board-certified doctors committed to your health.</p>
            </div>
            <div className="mb-8 rounded-3xl bg-[#E7F1F8] p-5" data-reveal>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="search"
                    value={doctorSearch}
                    onChange={e => setDoctorSearch(e.target.value)}
                    placeholder="Search by name or specialty…"
                    className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-5 py-4 text-sm text-slate-700 outline-none focus:border-[#1B5E8C] focus:ring-2 focus:ring-[#1B5E8C]/20 transition-all"
                  />
                </div>
                <div className="relative sm:w-52">
                  <select
                    value={doctorSpec}
                    onChange={e => setDoctorSpec(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 outline-none focus:border-[#1B5E8C] focus:ring-2 focus:ring-[#1B5E8C]/20 transition-all">
                    <option>All Specialties</option>
                    {services.map(s => <option key={s.title}>{s.title}</option>)}
                  </select>
                  <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6,9 12,15 18,9" /></svg>
                </div>
              </div>
              {(doctorSearch || doctorSpec !== 'All Specialties') && (
                <button onClick={() => { setDoctorSearch(''); setDoctorSpec('All Specialties'); }}
                  className="mt-3 text-xs font-semibold text-[#1B5E8C] hover:underline">
                  ✕ Clear filters
                </button>
              )}
            </div>

            {(() => {
              const q = doctorSearch.toLowerCase();
              const filtered = doctors.filter(d =>
                (doctorSpec === 'All Specialties' || d.specialty === doctorSpec) &&
                (!q || d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q))
              );
              return filtered.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((doc, i) => (
                    <div key={doc.name} data-reveal data-delay={String(i % 3)}
                      className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm active:scale-95 transition-all">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1B5E8C] to-[#2876a8] text-white text-xl font-bold shrink-0">{doc.initials}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 truncate">{doc.name}</h3>
                          <p className="text-sm text-[#1B5E8C] font-medium">{doc.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
                            {doc.exp}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            {doc.avail}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${doc.today ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {doc.today ? '● Available today' : '○ Off today'}
                        </span>
                      </div>
                      <a href="#book" className="flex w-full items-center justify-center rounded-2xl bg-[#E7F1F8] py-3.5 text-sm font-bold text-[#1B5E8C] hover:bg-[#1B5E8C] hover:text-white active:scale-95 transition-all">
                        Book Appointment
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                  <svg viewBox="0 0 48 48" className="w-14 h-14 text-slate-200" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="22" cy="22" r="16" /><line x1="34" y1="34" x2="44" y2="44" /></svg>
                  <p className="font-bold text-slate-600">No doctors match your search</p>
                  <p className="text-sm text-slate-400">Try a different name or specialty</p>
                  <button onClick={() => { setDoctorSearch(''); setDoctorSpec('All Specialties'); }}
                    className="mt-2 rounded-2xl bg-[#E7F1F8] px-6 py-3 text-sm font-semibold text-[#1B5E8C] hover:bg-[#1B5E8C] hover:text-white transition-all">
                    Show all doctors
                  </button>
                </div>
              );
            })()}
          </div>
        </section>

        {/* ── HEALTH TOOLS ──────────────────────────────────── */}
        <section id="tools" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mb-10 text-center space-y-3" data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1B5E8C]">Self-Service</p>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Free Health Tools</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { id: 'bmi',     title: 'BMI Calculator',       desc: 'Calculate your Body Mass Index', icon: (
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="16" cy="16" r="12" /><line x1="16" y1="8" x2="16" y2="16" /><line x1="16" y1="16" x2="20" y2="20" /></svg>
              )},
              { id: 'duedate', title: 'Due Date Calculator',  desc: 'Plan your pregnancy timeline', icon: (
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="6" width="24" height="22" rx="3" /><line x1="4" y1="13" x2="28" y2="13" /><line x1="10" y1="3" x2="10" y2="9" /><line x1="22" y1="3" x2="22" y2="9" /></svg>
              )},
              { id: 'vaccine', title: 'Vaccination Reminder', desc: 'Stay on your immunisation schedule', icon: (
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M 20 6 L 26 12 L 14 24 L 8 26 L 10 20 Z" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
              )},
              { id: 'risk',    title: 'Health Risk Check',    desc: 'Assess common health risks', icon: (
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M 16 4 L 28 10 L 28 20 Q 28 28 16 30 Q 4 28 4 20 L 4 10 Z" /><line x1="16" y1="13" x2="16" y2="17" /><circle cx="16" cy="21" r="1" fill="currentColor" /></svg>
              )},
            ].map((t, i) => (
              <div key={t.title} data-reveal data-delay={String(i)}
                className="group rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm service-card active:scale-95 transition-all">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7F1F8] text-[#1B5E8C] group-hover:bg-[#1B5E8C] group-hover:text-white transition-colors">
                  {t.icon}
                </div>
                <h3 className="font-bold text-slate-900">{t.title}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{t.desc}</p>
                <button onClick={() => setActiveTool(t.id)}
                  className="mt-5 w-full rounded-2xl border-2 border-[#1B5E8C] py-3 text-sm font-bold text-[#1B5E8C] hover:bg-[#1B5E8C] hover:text-white active:scale-95 transition-all">
                  Open Tool
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── HEALTH TIPS ───────────────────────────────────── */}
        <section className="bg-white py-16 px-5 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center space-y-3" data-reveal>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1B5E8C]">Your Health</p>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Health Tips &amp; Guidance</h2>
              <p className="mx-auto max-w-xl text-sm leading-7 text-slate-500">Quick, doctor-approved health guidance to help you and your family stay well.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-3" data-reveal>
              {[
                {
                  tag: 'Emergency Signs',
                  tagColor: 'bg-red-100 text-red-700',
                  title: '5 Symptoms You Should Never Ignore',
                  preview: 'Chest pain, sudden vision changes, and severe headache are among the symptoms that demand immediate medical attention.',
                  full: 'Seek emergency care immediately if you experience: (1) Chest pain or pressure lasting more than a few minutes. (2) Sudden blurred vision or loss of vision. (3) Severe, sudden headache unlike any you\'ve had before. (4) Difficulty breathing or shortness of breath at rest. (5) Sudden numbness or weakness on one side of your body. These can be signs of a heart attack or stroke — every minute counts.',
                  icon: '🚨',
                },
                {
                  tag: 'Heart Health',
                  tagColor: 'bg-rose-100 text-rose-700',
                  title: 'Managing Hypertension Naturally',
                  preview: 'Small daily changes — less salt, more movement, better sleep — can significantly lower your blood pressure without medication alone.',
                  full: 'Lifestyle changes that help control blood pressure: (1) Reduce salt intake — aim for less than 5g per day. (2) Exercise for at least 30 minutes most days (walking counts). (3) Maintain a healthy weight — even losing 5–10 kg can make a measurable difference. (4) Limit alcohol and avoid smoking. (5) Manage stress through rest, prayer, and social support. (6) Eat more fruits, vegetables, and whole grains. Always work with your doctor — medication may still be needed.',
                  icon: '❤️',
                },
                {
                  tag: 'Child Health',
                  tagColor: 'bg-blue-100 text-blue-700',
                  title: 'When to Take Your Child to A&E',
                  preview: 'Knowing the difference between a sick child who can wait for a GP and one who needs emergency care can save a life.',
                  full: 'Take your child to A&E immediately if they have: (1) Difficulty breathing or very fast breathing. (2) A seizure (convulsion) — even if it stops quickly. (3) Persistent high fever in a baby under 3 months. (4) Severe dehydration — no wet nappy in 8+ hours, sunken eyes, very dry mouth. (5) Loss of consciousness or unusual drowsiness. (6) A severe allergic reaction (swollen face, hives, breathing difficulty). For milder illness — fever in older children, vomiting, diarrhoea — a scheduled doctor\'s visit is usually fine.',
                  icon: '👶',
                },
              ].map((tip, i) => (
                <div key={tip.title} className="rounded-3xl border border-slate-100 bg-[#F8FBFF] p-6 flex flex-col gap-4 service-card">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-3xl">{tip.icon}</span>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${tip.tagColor}`}>{tip.tag}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 leading-snug">{tip.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{tip.preview}</p>

                  <div className={`overflow-hidden transition-all duration-500 ${openTip === i ? 'max-h-[600px]' : 'max-h-0'}`}>
                    <p className="text-sm leading-7 text-slate-600 mt-1 pt-3 border-t border-slate-100">
                      {tip.full}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <button
                      onClick={() => setOpenTip(openTip === i ? null : i)}
                      className="text-sm font-bold text-[#1B5E8C] hover:underline transition-colors"
                    >
                      {openTip === i ? 'Show less ↑' : 'Read more ↓'}
                    </button>
                    <a href="#book" className="rounded-xl bg-[#E7F1F8] px-4 py-2 text-xs font-bold text-[#1B5E8C] hover:bg-[#1B5E8C] hover:text-white transition-all">
                      See a doctor
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS (auto-advancing carousel) ────────── */}
        <section className="bg-gradient-to-b from-[#E7F1F8] to-white py-16 px-5 sm:px-8" data-reveal>
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1B5E8C]">Patient Stories</p>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">What Our Patients Say</h2>
            </div>

            {/* Carousel */}
            <div
              className="relative"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Cards */}
              <div className="overflow-hidden rounded-3xl">
                {testimonials.map((t, i) => (
                  <div
                    key={t.name}
                    className={`transition-all duration-500 ${i === slide ? 'block opacity-100 translate-y-0' : 'hidden opacity-0'}`}
                  >
                    <div className="bg-white p-8 sm:p-10 shadow-sm border border-slate-100 rounded-3xl flex flex-col gap-6">
                      <div className="flex gap-1">
                        {Array.from({length:5}).map((_,j) => (
                          <svg key={j} viewBox="0 0 20 20" className="w-5 h-5 text-amber-400 fill-current">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-base leading-8 text-slate-600 italic">"{t.text}"</p>
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1B5E8C] text-sm font-bold text-white shrink-0">{t.initials}</div>
                        <div>
                          <p className="font-bold text-slate-900">{t.name}</p>
                          <p className="text-sm text-slate-500">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prev / Next arrows */}
              <button
                onClick={() => { setPaused(true); setSlide(s => (s - 1 + testimonials.length) % testimonials.length); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-slate-100 hover:bg-[#E7F1F8] active:scale-90 transition-all"
                aria-label="Previous"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15,18 9,12 15,6" /></svg>
              </button>
              <button
                onClick={() => { setPaused(true); setSlide(s => (s + 1) % testimonials.length); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-slate-100 hover:bg-[#E7F1F8] active:scale-90 transition-all"
                aria-label="Next"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9,18 15,12 9,6" /></svg>
              </button>
            </div>

            {/* Dot indicators */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setPaused(true); setSlide(i); }}
                  className={`transition-all duration-300 rounded-full ${i === slide ? 'w-6 h-2.5 bg-[#1B5E8C]' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Auto-play progress bar */}
            {!paused && (
              <div className="mt-4 h-0.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  key={slide}
                  className="h-full bg-[#1B5E8C] rounded-full"
                  style={{ animation: 'progress-bar 4s linear forwards' }}
                />
              </div>
            )}
          </div>
        </section>

        {/* ── BOOK APPOINTMENT ──────────────────────────────── */}
        <section id="book" className="px-5 py-16 sm:px-8 bg-white" data-reveal>
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1B5E8C]">Book an Appointment</p>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">See a Specialist Today</h2>
              <p className="text-sm leading-7 text-slate-500">Fill in your details and we will confirm your appointment within the hour.</p>
            </div>

            {!bookDone && (
              <div className="flex items-center gap-0 mb-8">
                {[1,2,3].map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${bookStep >= s ? 'bg-[#1B5E8C] text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {bookStep > s
                        ? <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20,6 9,17 4,12" /></svg>
                        : s}
                    </div>
                    {i < 2 && <div className={`h-1 flex-1 mx-1 rounded-full transition-all ${bookStep > s ? 'bg-[#1B5E8C]' : 'bg-slate-100'}`} />}
                  </div>
                ))}
              </div>
            )}

            {bookDone ? (
              <div className="rounded-3xl bg-[#E7F1F8] p-10 text-center space-y-5">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#10B981]">
                  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20,6 9,17 4,12" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Appointment Requested!</h3>
                <p className="text-slate-600 leading-7">Thank you, <strong>{bookData.name}</strong>. We will call <strong>{bookData.phone}</strong> within the hour to confirm your <strong>{bookData.service}</strong> appointment.</p>
                <div className="flex flex-col gap-3 pt-2">
                  <a href="tel:08028611472" className="flex items-center justify-center gap-2 rounded-2xl bg-[#1B5E8C] py-4 text-sm font-bold text-white active:scale-95 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
                    Call Us Now — 0802 861 1472
                  </a>
                  <button onClick={() => { setBookDone(false); setBookStep(1); setBookData({ service:'', doctor:'', date:'', name:'', phone:'' }); }}
                    className="rounded-2xl border-2 border-slate-200 py-4 text-sm font-semibold text-slate-600 active:scale-95 transition-transform">
                    Book Another Appointment
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submitBooking} className="rounded-3xl border border-slate-100 bg-[#F8FBFF] p-6 sm:p-8 shadow-sm space-y-5">
                {bookStep === 1 && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Select a Service *</label>
                      <div className="relative">
                        <select required value={bookData.service} onChange={e => setBookData(d => ({...d, service: e.target.value}))} className={selectCls}>
                          <option value="">Choose a department…</option>
                          {services.map(s => <option key={s.title}>{s.title}</option>)}
                        </select>
                        <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6,9 12,15 18,9" /></svg>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Preferred Doctor <span className="text-slate-400 font-normal">(optional)</span></label>
                      <div className="relative">
                        <select value={bookData.doctor} onChange={e => setBookData(d => ({...d, doctor: e.target.value}))} className={selectCls}>
                          <option value="">No preference</option>
                          <option>Dr. A. Okonkwo — General Medicine</option>
                          <option>Dr. F. Adeyemi — Surgery</option>
                          <option>Dr. N. Bello — Maternity & Gynaecology</option>
                        </select>
                        <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6,9 12,15 18,9" /></svg>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Preferred Date *</label>
                      <input type="date" required min={new Date().toISOString().split('T')[0]} value={bookData.date} onChange={e => setBookData(d => ({...d, date: e.target.value}))} className={inputCls} />
                    </div>
                    <button type="button" disabled={!bookData.service || !bookData.date} onClick={() => setBookStep(2)}
                      className="w-full rounded-2xl bg-[#1B5E8C] py-4 text-sm font-bold text-white hover:bg-[#134466] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      Continue →
                    </button>
                  </>
                )}
                {bookStep === 2 && (
                  <>
                    <div className="rounded-2xl bg-[#E7F1F8] px-5 py-4 text-sm">
                      <p className="text-[#1B5E8C] font-semibold">{bookData.service}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{bookData.date}{bookData.doctor ? ` · ${bookData.doctor}` : ''}</p>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Full Name *</label>
                      <input type="text" required placeholder="e.g. Amina Abubakar" value={bookData.name} onChange={e => setBookData(d => ({...d, name: e.target.value}))} className={inputCls} />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Phone Number *</label>
                      <input type="tel" required placeholder="e.g. 0801 234 5678" value={bookData.phone} onChange={e => setBookData(d => ({...d, phone: e.target.value}))} className={inputCls} />
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setBookStep(1)} className="flex-1 rounded-2xl border-2 border-slate-200 py-4 text-sm font-semibold text-slate-600 active:scale-95 transition-transform">← Back</button>
                      <button type="button" disabled={!bookData.name || !bookData.phone} onClick={() => setBookStep(3)}
                        className="flex-[2] rounded-2xl bg-[#1B5E8C] py-4 text-sm font-bold text-white hover:bg-[#134466] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                        Continue →
                      </button>
                    </div>
                  </>
                )}
                {bookStep === 3 && (
                  <>
                    <div className="space-y-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Confirm Your Details</p>
                      {[
                        { label: 'Service', value: bookData.service },
                        { label: 'Date', value: bookData.date },
                        { label: 'Doctor', value: bookData.doctor || 'No preference' },
                        { label: 'Name', value: bookData.name },
                        { label: 'Phone', value: bookData.phone },
                      ].map(r => (
                        <div key={r.label} className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 border border-slate-100">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{r.label}</span>
                          <span className="text-sm font-semibold text-slate-800">{r.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setBookStep(2)} className="flex-1 rounded-2xl border-2 border-slate-200 py-4 text-sm font-semibold text-slate-600 active:scale-95 transition-transform">← Back</button>
                      <button type="submit" className="flex-[2] rounded-2xl bg-[#10B981] py-4 text-sm font-bold text-white hover:bg-[#059669] active:scale-95 transition-all">Confirm Booking ✓</button>
                    </div>
                  </>
                )}
              </form>
            )}

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">or call us directly</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <a href="tel:08028611472" className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#1B5E8C] py-4 text-sm font-bold text-[#1B5E8C] hover:bg-[#E7F1F8] active:scale-95 transition-all">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
              0802 861 1472 — Available 24/7
            </a>
          </div>
        </section>

        {/* ── CONTACT ───────────────────────────────────────── */}
        <section id="contact" className="bg-[#F0F7FF] px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center space-y-3" data-reveal>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1B5E8C]">Get in Touch</p>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Contact Us</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
              <a href="tel:08028611472" className="group flex flex-col items-center gap-4 rounded-3xl bg-[#1B5E8C] p-7 text-center text-white shadow-md active:scale-95 transition-all hover:bg-[#134466]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">Call Us</p>
                  <p className="text-lg font-bold">0802 861 1472</p>
                  <p className="text-xs text-white/60 mt-1">Available 24 / 7</p>
                </div>
              </a>
              <a href="https://wa.me/2348028611472" target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-4 rounded-3xl bg-[#25D366] p-7 text-center text-white shadow-md active:scale-95 transition-all hover:bg-[#1ebe5d]">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">WhatsApp</p>
                  <p className="text-lg font-bold">Chat with Us</p>
                  <p className="text-xs text-white/60 mt-1">Quick response</p>
                </div>
              </a>
              <a href="https://maps.google.com/?q=Isheri+Olofin,+Lagos,+Nigeria" target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-4 rounded-3xl bg-white border-2 border-slate-100 p-7 text-center shadow-md active:scale-95 transition-all hover:border-[#1B5E8C]/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7F1F8]">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#1B5E8C]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Get Directions</p>
                  <p className="text-sm font-bold text-slate-900 leading-5">Waidi Ewe-Nla St,<br />Isheri Olofin, Lagos</p>
                  <p className="text-xs text-[#1B5E8C] font-semibold mt-2">Open in Maps →</p>
                </div>
              </a>
              <div className="flex flex-col items-center gap-4 rounded-3xl bg-white border-2 border-slate-100 p-7 text-center shadow-md">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7F1F8]">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#1B5E8C]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></svg>
                </div>
                <div className="space-y-2 w-full">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Opening Hours</p>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-slate-600">Mon – Sat</span><span className="font-bold text-slate-900">7am – 9pm</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Sunday</span><span className="font-bold text-slate-900">9am – 6pm</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">Emergency</span><span className="font-bold text-[#10B981]">24 / 7</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-100 shadow-lg" data-reveal>
              <iframe
                title="Upward Specialist Hospital Location"
                src="https://maps.google.com/maps?q=Isheri+Olofin,+Lagos,+Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%" height="340" style={{ border: 0, display: 'block' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────── */}
        <section className="bg-white py-16 px-5 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 text-center space-y-3" data-reveal>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#1B5E8C]">Common Questions</p>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Frequently Asked Questions</h2>
              <p className="text-sm leading-7 text-slate-500">Can't find your answer? <a href="tel:08028611472" className="text-[#1B5E8C] font-semibold hover:underline">Call us</a> or <a href="https://wa.me/2348028611472" className="text-[#1B5E8C] font-semibold hover:underline">WhatsApp us</a> directly.</p>
            </div>
            <div className="space-y-3" data-reveal>
              {faqs.map((faq, i) => (
                <div key={i} className={`rounded-2xl border transition-all ${openFaq === i ? 'border-[#1B5E8C]/30 bg-[#F0F7FF]' : 'border-slate-100 bg-white'}`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-semibold text-slate-900 text-sm leading-6">{faq.q}</span>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all ${openFaq === i ? 'bg-[#1B5E8C] text-white rotate-45' : 'bg-slate-100 text-slate-500'}`}>
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-60' : 'max-h-0'}`}>
                    <p className="px-6 pb-5 text-sm leading-7 text-slate-600">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-3xl bg-[#E7F1F8] p-6 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left" data-reveal>
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1B5E8C]">
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">Still have questions?</p>
                <p className="text-sm text-slate-500 mt-0.5">Our patient services team is available 24 hours a day to help.</p>
              </div>
              <a href="tel:08028611472" className="shrink-0 rounded-2xl bg-[#1B5E8C] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#134466] active:scale-95 transition-all">
                Call Us Now
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────── */}
        <footer className="bg-slate-900 px-5 pt-12 pb-10 text-slate-400 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <a href="tel:08028611472" className="md:hidden mb-8 flex items-center justify-between rounded-2xl bg-[#1B5E8C] px-6 py-5 active:scale-95 transition-transform">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Emergency — Available Now</p>
                <p className="text-lg font-bold text-white mt-0.5">0802 861 1472</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
              </div>
            </a>
            <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B5E8C] shrink-0">
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
                <p className="text-sm leading-7">Premium specialist care delivered with warmth, expertise, and compassion.</p>
                <div className="mt-6 flex gap-3">
                  {[{ label: 'F', href: '#' },{ label: '𝕏', href: '#' },{ label: 'IG', href: '#' }].map(s => (
                    <a key={s.label} href={s.href} className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-xs font-bold text-slate-400 hover:bg-[#1B5E8C] hover:text-white active:scale-90 transition-all">{s.label}</a>
                  ))}
                </div>
              </div>
              <div>
                <button onClick={() => setOpenAccordion(openAccordion === 'links' ? null : 'links')} className="flex w-full items-center justify-between py-1 md:cursor-default">
                  <p className="font-bold text-white">Quick Links</p>
                  <svg viewBox="0 0 24 24" className={`w-4 h-4 text-slate-500 transition-transform md:hidden ${openAccordion === 'links' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6,9 12,15 18,9" /></svg>
                </button>
                <ul className={`mt-3 space-y-1 overflow-hidden transition-all ${openAccordion === 'links' ? 'max-h-96' : 'max-h-0 md:max-h-96'}`}>
                  {[['#home','Home'],['#about','About Us'],['#services','Our Services'],['#doctors','Find a Doctor'],['#book','Book Appointment'],['#contact','Contact']].map(([href, label]) => (
                    <li key={href}><a href={href} className="flex items-center py-2.5 text-sm hover:text-white transition-colors">{label}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <button onClick={() => setOpenAccordion(openAccordion === 'services' ? null : 'services')} className="flex w-full items-center justify-between py-1 md:cursor-default">
                  <p className="font-bold text-white">Services</p>
                  <svg viewBox="0 0 24 24" className={`w-4 h-4 text-slate-500 transition-transform md:hidden ${openAccordion === 'services' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6,9 12,15 18,9" /></svg>
                </button>
                <ul className={`mt-3 space-y-1 overflow-hidden transition-all ${openAccordion === 'services' ? 'max-h-96' : 'max-h-0 md:max-h-96'}`}>
                  {services.map(s => (
                    <li key={s.title}><a href="#services" className="flex items-center py-2.5 text-sm hover:text-white transition-colors">{s.title}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-bold text-white mb-4">Contact</p>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 mt-0.5 shrink-0 text-[#1B5E8C]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span className="leading-6">Waidi Ewe-Nla Street,<br />Isheri Olofin, Lagos</span>
                  </div>
                  <a href="tel:08028611472" className="flex items-center gap-3 py-1 hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-[#1B5E8C]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.56-.56a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" /></svg>
                    0802 861 1472
                  </a>
                  <a href="https://wa.me/2348028611472" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-1 hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-[#25D366]" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                    WhatsApp Us
                  </a>
                  <div className="hidden md:block pt-2">
                    <a href="tel:08028611472" className="inline-flex items-center gap-2 rounded-xl bg-[#1B5E8C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#134466] transition-colors">
                      Call Now — 24/7
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <p>© 2025 Upward Specialist Hospital. All rights reserved.</p>
              <p>Idimu, Lagos · Open 24 Hours</p>
            </div>
          </div>
        </footer>
      </main>

      {/* ── SMART GUIDE MODAL ─────────────────────────────────── */}
      {showGuide && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
          onClick={e => { if (e.target === e.currentTarget) setShowGuide(false); }}
        >
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-[#1B5E8C] to-[#2876a8]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/60">Smart Guide</p>
                  <p className="text-sm font-bold text-white">Find the right service</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 active:scale-90 transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {/* Quiz */}
            <SmartGuide onResult={handleGuideResult} />
          </div>
        </div>
      )}

      {/* ── HEALTH TOOL MODALS ────────────────────────────────── */}
      {activeTool && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
          onClick={e => { if (e.target === e.currentTarget) setActiveTool(null); }}
        >
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Modal header */}
            <div className="sticky top-0 flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white rounded-t-3xl">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#1B5E8C] mb-0.5">Free Health Tool</p>
                <h3 className="text-base font-bold text-slate-900">
                  {{ bmi: 'BMI Calculator', duedate: 'Due Date Calculator', vaccine: 'Vaccination Reminder', risk: 'Health Risk Check' }[activeTool]}
                </h3>
              </div>
              <button onClick={() => setActiveTool(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 transition-all">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {/* Tool content */}
            {activeTool === 'bmi'     && <BMITool     onBook={() => { setActiveTool(null); document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' }); }} />}
            {activeTool === 'duedate' && <DueDateTool onBook={() => { setActiveTool(null); document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' }); }} />}
            {activeTool === 'vaccine' && <VaccineTool onBook={() => { setActiveTool(null); document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' }); }} />}
            {activeTool === 'risk'    && <RiskTool    onBook={() => { setActiveTool(null); document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' }); }} />}
          </div>
        </div>
      )}

      {/* ── FLOATING WHATSAPP BUTTON ───────────────────────────── */}
      <a
        href="https://wa.me/2348028611472"
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-28 right-5 z-50 md:bottom-8 md:right-8 flex items-center gap-3 rounded-full bg-[#25D366] shadow-xl text-white font-bold text-sm active:scale-90 transition-all duration-300 group overflow-hidden
          ${showWhatsApp ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
        aria-label="Chat on WhatsApp"
      >
        {/* Pill expands on desktop hover, stays icon-only on mobile */}
        <span className="flex h-14 w-14 shrink-0 items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:pr-5 transition-all duration-300 hidden md:block">
          Chat with us
        </span>
      </a>

      {/* ── MOBILE BOTTOM NAV ─────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] mobile-nav-safe">
        <div className="flex items-center justify-around px-1 py-2">
          {bottomNavItems.map(item => (
            <a key={item.id} href={item.href} onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-2xl transition-all min-w-[52px] active:scale-90 ${activeTab === item.id ? 'text-[#1B5E8C] bg-[#E7F1F8]' : 'text-slate-400'}`}>
              <span className={activeTab === item.id ? 'text-[#1B5E8C]' : 'text-slate-400'}>{item.icon}</span>
              <span className="text-[10px] font-bold leading-none">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
