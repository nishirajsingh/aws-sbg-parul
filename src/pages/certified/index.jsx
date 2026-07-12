import React, { useState, useEffect, useMemo } from 'react';
import { Search, Award, ChevronLeft, ChevronRight, RefreshCw, Shield } from 'lucide-react';
import IDCard from '../../components/IDCard';

const SHEET_ID   = import.meta.env.VITE_GOOGLE_SHEET_ID;
const SHEET_NAME = import.meta.env.VITE_GOOGLE_SHEET_NAME || 'Certified';
const PER_PAGE   = 12;

function parseCSV(text) {
  const rows = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const row = []; let inQ = false, cell = '';
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { if (inQ && line[i+1] === '"') { cell += '"'; i++; } else inQ = !inQ; }
      else if (ch === ',' && !inQ) { row.push(cell); cell = ''; }
      else cell += ch;
    }
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

function groupByStudent(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = row.enrolment?.trim() || `__${row.name}__`;
    if (!map.has(key)) {
      map.set(key, {
        _key:       key,
        name:       row.name,
        enrolment:  row.enrolment,
        department: row.department,
        institute:  row.institute,
        linkedin:   row.linkedin_url || row.linkedin || '',
        semester:   row.semester || '',
        certs: [],
      });
    }
    map.get(key).certs.push({
      cert_title:  row.cert_title || row.certification_title || '',
      exam_date:   row.exam_date  || row.exam_date || '',
      credly_link: row.credly_link || row.credly_link || '',
    });
  }
  return Array.from(map.values());
}

export default function CertifiedPage() {
  const [students,   setStudents]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [query,      setQuery]      = useState('');
  const [certFilter, setCertFilter] = useState('all');
  const [page,       setPage]       = useState(1);

  const fetchSheet = async () => {
    setLoading(true); setError('');
    if (!SHEET_ID) {
      setError('Google Sheet not configured. Set VITE_GOOGLE_SHEET_ID in your .env file.');
      setLoading(false); return;
    }
    try {
      const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Sheet not accessible. Make sure it is set to "Anyone with the link can view".');
      const rows = parseCSV(await res.text());
      if (rows.length < 2) { setStudents([]); return; }
      const headers = rows[0].map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
      const flat = rows.slice(1)
        .filter(r => r.some(c => c.trim()))
        .map(r => {
          const obj = {};
          headers.forEach((h, idx) => { obj[h] = r[idx]?.trim() || ''; });
          return obj;
        });
      setStudents(groupByStudent(flat));
    } catch (err) {
      setError(err.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSheet(); }, []);
  useEffect(() => { setPage(1); }, [query, certFilter]);

  const certTitles = useMemo(() => {
    const s = new Set();
    students.forEach(st => st.certs.forEach(c => { if (c.cert_title) s.add(c.cert_title); }));
    return Array.from(s).sort();
  }, [students]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return students
      .filter(st => {
        const certNames = st.certs.map(c => (c.cert_title || '').toLowerCase()).join(' ');
        const matchQ = !q ||
          st.name?.toLowerCase().includes(q) ||
          st.enrolment?.toLowerCase().includes(q) ||
          st.department?.toLowerCase().includes(q) ||
          certNames.includes(q);
        const matchC = certFilter === 'all' || st.certs.some(c => c.cert_title === certFilter);
        return matchQ && matchC;
      })
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [students, query, certFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const pageNums = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
    .reduce((acc, n, i, arr) => {
      if (i > 0 && n - arr[i-1] > 1) acc.push('…');
      acc.push(n); return acc;
    }, []);

  // Total raw cert count across all students
  const totalCerts = students.reduce((sum, st) => sum + st.certs.length, 0);

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ background: 'var(--bg)' }}>

      {/* Banner */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: 'var(--border-muted)' }}>
        <div className="site-grid-pattern absolute inset-0 pointer-events-none opacity-60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(173,92,255,0.09) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 text-center space-y-3">
          <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#AD5CFF' }}>
            CERTIFIED BUILDERS :: AWS_SBG_PU
          </p>
          <h1 className="font-extrabold uppercase text-3xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>
            AWS Certified Students
          </h1>
          <p className="font-sans font-light leading-relaxed mx-auto"
            style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '500px' }}>
            Parul University students who have earned official AWS certifications.
          </p>
          {!loading && !error && (
            <div className="flex items-center justify-center gap-4 pt-1 flex-wrap">
              <div className="flex items-center gap-2">
                <Shield size={14} style={{ color: '#22C55E' }} />
                <span className="font-mono font-bold" style={{ fontSize: '11px', color: '#22C55E' }}>
                  {students.length} Certified Builders
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={14} style={{ color: '#F97316' }} />
                <span className="font-mono font-bold" style={{ fontSize: '11px', color: '#F97316' }}>
                  {totalCerts} Certifications Earned
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10 space-y-6">

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-60">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--text-subtle)' }} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, cert, department, enrolment..."
              style={{
                width: '100%', paddingLeft: '36px', paddingRight: '14px', paddingTop: '10px', paddingBottom: '10px',
                fontSize: '13px', background: 'var(--card-bg)', border: '1px solid var(--border-muted)',
                borderRadius: '8px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit'
              }}
              onFocus={e => e.target.style.borderColor = '#AD5CFF'}
              onBlur={e => e.target.style.borderColor = 'var(--border-muted)'} />
          </div>

          <select value={certFilter} onChange={e => setCertFilter(e.target.value)}
            style={{
              padding: '10px 14px', fontSize: '11px', background: 'var(--card-bg)',
              border: '1px solid var(--border-muted)', borderRadius: '8px',
              color: 'var(--text-muted)', outline: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 700, minWidth: '200px'
            }}>
            <option value="all">All Certifications</option>
            {certTitles.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <button onClick={fetchSheet} disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border font-mono font-bold uppercase"
            style={{ fontSize: '10px', background: 'transparent', borderColor: 'var(--border-muted)', color: 'var(--text-muted)', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#AD5CFF'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="flex gap-3 flex-wrap">
            {[
              { label: 'Students', value: students.length,  color: '#AD5CFF' },
              { label: 'Showing',  value: filtered.length,  color: '#06B6D4' },
              { label: 'Certs',    value: totalCerts,        color: '#F97316' },
              { label: 'Page',     value: `${page} / ${totalPages}`, color: '#22C55E' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono"
                style={{ fontSize: '10px', background: color + '10', borderColor: color + '30', color }}>
                <span className="font-black">{value}</span>
                <span className="font-bold uppercase">{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 rounded-full border-2 animate-spin"
              style={{ borderColor: '#AD5CFF', borderTopColor: 'transparent' }} />
            <p className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Fetching certified builders...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border p-8 text-center space-y-3"
            style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
            <p className="font-mono font-bold uppercase" style={{ fontSize: '11px', color: '#EF4444' }}>Failed to load</p>
            <p className="font-sans" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{error}</p>
            <button onClick={fetchSheet}
              className="px-4 py-2 rounded-lg font-mono font-bold uppercase text-white"
              style={{ fontSize: '10px', background: '#AD5CFF', border: 'none', cursor: 'pointer' }}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-xl border p-12 text-center"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
            <Award size={32} style={{ color: 'var(--text-subtle)', margin: '0 auto 12px' }} />
            <p className="font-mono font-bold uppercase" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {students.length === 0 ? 'No certified students yet' : 'No results found'}
            </p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && paginated.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ alignItems: 'stretch' }}>
            {paginated.map(st => (
              <IDCard key={st._key} student={st} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-9 h-9 rounded-lg border flex items-center justify-center"
              style={{ background: 'transparent', borderColor: 'var(--border-muted)', color: page === 1 ? 'var(--text-subtle)' : 'var(--text-muted)', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
              <ChevronLeft size={16} />
            </button>

            {pageNums.map((n, i) =>
              n === '…' ? (
                <span key={`e${i}`} className="font-mono" style={{ fontSize: '12px', color: 'var(--text-subtle)', padding: '0 2px' }}>…</span>
              ) : (
                <button key={n} onClick={() => setPage(n)}
                  className="w-9 h-9 rounded-lg border font-mono font-bold"
                  style={{
                    fontSize: '12px',
                    background: page === n ? '#AD5CFF' : 'transparent',
                    borderColor: page === n ? '#AD5CFF' : 'var(--border-muted)',
                    color: page === n ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}>
                  {n}
                </button>
              )
            )}

            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-9 h-9 rounded-lg border flex items-center justify-center"
              style={{ background: 'transparent', borderColor: 'var(--border-muted)', color: page === totalPages ? 'var(--text-subtle)' : 'var(--text-muted)', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
