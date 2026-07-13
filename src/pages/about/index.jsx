import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Users, Award, Cpu, History } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const milestones = [
  { phase: 'Phase 1', title: 'Starting Out', desc: 'We created a dedicated space at Parul University for students to start learning cloud computing basics through practical, hands-on labs.', size: 'md:col-span-2' },
  { phase: 'Phase 2', title: 'Growing the Community', desc: 'We expanded across campus, hosted major hackathons, and secured official AWS resources and cloud credits for members.', size: 'md:col-span-1' },
  { phase: 'Phase 3', title: 'Active Tech Hub', desc: 'Now with over 3,000 active student builders, we focus on deploying live production applications and driving core certification readiness tracks.', size: 'md:col-span-3' },
];

const activeLeaders = [
  {
    name: 'Dr. Vaibhav Gandhi',
    role: 'Faculty Mentor & Founder',
    desc: 'Guides our student group with strategic academic governance, industry connections, and institutional support.',
    gradient: 'linear-gradient(135deg, #a855f7, #6366f1)',
    initial: 'VG',
    photo: '/about-us/vaibhav-gandhi-sir.png',
    color: '#a855f7',
  },
  {
    name: 'Manish Kudtarkar',
    role: 'Chapter Lead',
    desc: 'Manages core daily operations, leads developer bootcamps, and directs campus-wide cloud training initiatives.',
    gradient: 'linear-gradient(135deg, #a855f7, #d946ef)',
    initial: 'MK',
    photo: '/about-us/manish-kudtarkar.png',
    color: '#d946ef',
  },
];

const pastLeaders = [
  {
    name: 'Rishabh Tanwar',
    role: 'Core Architect Emeritus',
    desc: 'Helped engineer the initial workshops, structured learning modules, and built the highly collaborative peer learning culture that established our foundation.',
    gradient: 'linear-gradient(135deg, #475569, #3b0764)',
    initial: 'RT',
    photo: '/about-us/rishabh-tanwar.png',
    color: '#64748b',
  },
];

const values = [
  { icon: Cpu, title: "Learn by Building", desc: 'We skip the long slide decks. Every workshop cycle finishes with real infrastructure deployed on authentic cloud environments.' },
  { icon: Users, title: 'Peer Network Matrix', desc: 'We grow through direct collaboration, code reviews, open-source contributions, and mutual problem solving.' },
  { icon: Award, title: 'Exam Alignment', desc: 'Our architectural training pathways map out directly with the official AWS Cloud Practitioner specifications.' },
];

function LeaderPhoto({ photo, initial, gradient, dark }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden flex items-center justify-center border border-slate-800"
      style={{ background: dark ? '#0D1117' : '#F1F5F9' }}>
      {!imgFailed ? (
        <img 
          src={photo} 
          alt={initial}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgFailed(true)} 
        />
      ) : (
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-white text-2xl"
          style={{ background: gradient }}>
          {initial}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
    </div>
  );
}

export default function AboutPage() {
  const { dark } = useTheme();

  return (
    <div className="min-h-screen pt-20 pb-20 selection:bg-purple-500/20 selection:text-purple-300" style={{ background: 'var(--bg)' }}>

      {/* ── YOUR TOP HEADER (UNCHANGED) ── */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: 'var(--border-muted)' }}>
        <div className="site-grid-pattern absolute inset-0 pointer-events-none opacity-60" />
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(173,92,255,0.07) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center space-y-4">
          <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#AD5CFF' }}>
            OUR STORY :: AWS_SBG_PU
          </p>
          <h1 className="font-extrabold uppercase text-3xl md:text-5xl leading-tight" style={{ color: 'var(--text-primary)' }}>
            From Cloud Club<br />
            <span className="text-shimmer">to Student Builder Group</span>
          </h1>
          <p className="font-sans font-light leading-relaxed mx-auto"
            style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '580px' }}>
            What started as a small faculty-led initiative in 2022 has grown into Parul University's
            most active cloud engineering community — now officially part of the AWS Student Builder Group programme.
          </p>
        </div>
      </div>

      {/* ── REMAINDER OF MODERN LAYOUT (PURPLE MODIFIED) ── */}
      <div className="max-w-5xl mx-auto px-6 space-y-32 pt-16">

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border backdrop-blur-sm text-center"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          {[
            { label: 'Ecosystem Node', value: 'AWS SBG PU' },
            { label: 'Active Builders', value: '3000+' },
            { label: 'Cloud Projects', value: '12+ Core' },
            { label: 'Target Track', value: 'CLF-C02' },
          ].map(({ label, value }) => (
            <div key={label} className="p-2">
              <p className="text-2xl font-bold font-mono bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">{value}</p>
              <p className="mt-1 text-[10px] font-mono font-semibold uppercase tracking-wider style-muted" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── LEADERSHIP NODES (CURRENT & PAST) ── */}
        <div className="space-y-16">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-purple-400">MANAGEMENT MATRIX</span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>Our Leadership</h2>
          </div>
          
          {/* Active Leaders Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {activeLeaders.map((person) => (
              <div
                key={person.name}
                className="group rounded-2xl border p-5 flex flex-col gap-4 transition-all duration-300 hover:bg-slate-900/10"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#AD5CFF60'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}
              >
                <LeaderPhoto photo={person.photo} initial={person.initial} gradient={person.gradient} dark={dark} />
                <div className="flex flex-col flex-1 gap-2">
                  <span className="inline-block self-start font-mono font-bold uppercase tracking-wider text-[9px] px-2.5 py-0.5 rounded-full text-purple-400 bg-purple-500/10">
                    {person.role}
                  </span>
                  <h3 className="text-lg font-bold group-hover:text-purple-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {person.name}
                  </h3>
                  <p className="text-sm font-normal leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {person.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Past Leadership Separator */}
          <div className="pt-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-muted)' }} />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                <History size={12} /> Past Leadership
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: 'var(--border-muted)' }} />
            </div>

            {/* Past Leaders Layout */}
            <div className="grid grid-cols-1 max-w-md mx-auto">
              {pastLeaders.map((person) => (
                <div
                  key={person.name}
                  className="group rounded-2xl border p-5 flex flex-col gap-4 transition-all duration-300 hover:bg-slate-900/10"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#64748b60'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}
                >
                  <LeaderPhoto photo={person.photo} initial={person.initial} gradient={person.gradient} dark={dark} />
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="inline-block self-start font-mono font-medium uppercase tracking-wider text-[9px] px-2.5 py-0.5 rounded-full text-slate-400 bg-slate-900/30 border border-slate-800">
                      {person.role}
                    </span>
                    <h3 className="text-base font-bold group-hover:text-purple-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {person.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-normal leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {person.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CORE VALUES SECTION ── */}
        <div className="space-y-12">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-purple-400">OPERATIONAL AXIS</span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>Our Values</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div 
                key={title}
                className="rounded-2xl border p-6 space-y-4 transition-colors group text-center md:text-left"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#AD5CFF40'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-slate-800 text-purple-400 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors mx-auto md:mx-0">
                  <Icon size={20} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold font-mono uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                    {title}
                  </h3>
                  <p className="text-sm font-normal leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MODERN BENTO GRID MILESTONES ── */}
        <div className="space-y-12">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-purple-400">HISTORICAL PIPELINE</span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>Club Milestones</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {milestones.map((m) => (
              <div 
                key={m.title} 
                className={`rounded-2xl border p-6 transition-all duration-300 group flex flex-col justify-between ${m.size}`}
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#AD5CFF40'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}
              >
                <div className="space-y-3">
                  <span className="font-mono text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2.5 py-0.5 rounded-full inline-block">
                    {m.phase}
                  </span>
                  <h3 className="text-lg font-bold group-hover:text-purple-300 transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {m.title}
                  </h3>
                </div>
                <p className="text-sm font-normal leading-relaxed mt-4" style={{ color: 'var(--text-muted)' }}>
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CALL TO ACTION ── */}
        <div className="rounded-2xl border border-t-purple-500/30 p-8 sm:p-12 text-center space-y-6 max-w-3xl mx-auto"
          style={{ background: 'linear-gradient(to bottom, var(--card-bg), transparent)', borderColor: 'var(--border-muted)' }}>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Ready to Build with Us?
          </h2>
          <p className="max-w-md mx-auto text-sm font-normal leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Synchronize with our development schedule. Join live sessions, review open architectures, and step onto the cloud infrastructure pipeline.
          </p>
          <div className="flex flex-wrap justify-center gap-4 font-mono">
            <Link 
              to="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase text-xs text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-250 shadow-md shadow-purple-650/10"
            >
              See Our Builds <ArrowUpRight size={14} />
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase text-xs bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors duration-250"
            >
              Access Gateway
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}