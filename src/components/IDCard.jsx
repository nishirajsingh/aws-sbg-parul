import { useState } from 'react';
import { ExternalLink, Award, BookOpen, Building2, Hash } from 'lucide-react';
import CertificateGenerator from './CertificateGenerator';

const CERT_COLORS = {
  'cloud practitioner': '#F97316',
  'ai practitioner':    '#EC4899',
  'solutions architect':'#06B6D4',
  'developer':          '#AD5CFF',
  'cloudops':           '#22C55E',
  'data engineer':      '#F59E0B',
  'machine learning':   '#8B5CF6',
  'devops':             '#F97316',
  'generative ai':      '#EC4899',
  'advanced networking':'#06B6D4',
  'security':           '#EF4444',
};

export function certColor(title = '') {
  const t = title.toLowerCase();
  for (const [k, c] of Object.entries(CERT_COLORS)) if (t.includes(k)) return c;
  return '#AD5CFF';
}

function linkedinPhoto(url = '') {
  const match = url.match(/linkedin\.com\/in\/([^/?#]+)/);
  if (!match) return null;
  return `https://unavatar.io/linkedin/${match[1]}`;
}

function Avatar({ name, linkedin }) {
  const [err, setErr] = useState(false);
  const src = !err && linkedinPhoto(linkedin);
  const SIZE = 72;
  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE, flexShrink: 0 }}>
      {/* Static purple glow ring */}
      <div style={{
        position: 'absolute', inset: -2,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #AD5CFF 0%, #7C3AED 50%, #AD5CFF80 100%)',
        opacity: 0.8,
      }} />
      <div style={{ position: 'absolute', inset: 1, borderRadius: '50%', background: '#0B0F19' }} />
      {src ? (
        <img
          src={src}
          alt={name}
          onError={() => setErr(true)}
          style={{
            position: 'absolute', inset: 3,
            width: `calc(100% - 6px)`, height: `calc(100% - 6px)`,
            borderRadius: '50%', objectFit: 'cover',
          }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 3,
          width: `calc(100% - 6px)`, height: `calc(100% - 6px)`,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #AD5CFF, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 900, color: '#fff',
        }}>
          {name?.[0]?.toUpperCase() || '?'}
        </div>
      )}
    </div>
  );
}

function MetaItem({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <Icon size={10} style={{ color: '#64748B', flexShrink: 0 }} />
      <span style={{ fontSize: 10.5, color: '#94A3B8', fontFamily: 'system-ui, sans-serif' }}>
        {label && <span style={{ color: '#475569', marginRight: 3 }}>{label}</span>}
        {value}
      </span>
    </div>
  );
}

function CertRow({ cert, student }) {
  const color = certColor(cert.cert_title);
  return (
    <div style={{
      borderRadius: 10,
      border: `1px solid rgba(255,255,255,0.06)`,
      background: 'rgba(255,255,255,0.025)',
      overflow: 'hidden',
    }}>
      {/* Cert label row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '9px 12px 8px',
      }}>
        {/* Color dot */}
        <div style={{
          width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
          background: color,
          boxShadow: `0 0 6px ${color}80`,
        }} />
        {/* Section label */}
        <span style={{
          fontSize: 8.5, fontWeight: 700, color: '#475569',
          letterSpacing: '0.1em', textTransform: 'uppercase',
          fontFamily: 'monospace',
        }}>
          Certifications
        </span>
      </div>

      {/* Cert name */}
      <div style={{ padding: '0 12px 10px' }}>
        <p style={{
          fontSize: 12, fontWeight: 600, color: '#E2E8F0',
          lineHeight: 1.35, fontFamily: 'system-ui, sans-serif',
          margin: 0,
        }}>
          {cert.cert_title || '—'}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 12px' }} />

      {/* Action buttons */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 12px',
      }}>
        {cert.credly_link && (
          <a
            href={cert.credly_link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 9.5, fontWeight: 700, color: color,
              textDecoration: 'none', letterSpacing: '0.05em',
              padding: '4px 10px', borderRadius: 6,
              background: `${color}12`,
              border: `1px solid ${color}30`,
              fontFamily: 'monospace',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${color}25`}
            onMouseLeave={e => e.currentTarget.style.background = `${color}12`}
          >
            <ExternalLink size={9} />
            BADGE
          </a>
        )}
        <CertificateGenerator student={student} cert={cert} />
      </div>
    </div>
  );
}

export default function IDCard({ student }) {
  const isStudent = !student.designation;

  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #0F1420 0%, #0B0F19 55%, #0D1128 100%)',
        border: '1px solid rgba(173,92,255,0.15)',
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
        boxShadow: '0 2px 20px rgba(0,0,0,0.45)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 10px 36px rgba(173,92,255,0.16), 0 2px 12px rgba(0,0,0,0.5)';
        e.currentTarget.style.borderColor = 'rgba(173,92,255,0.4)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 20px rgba(0,0,0,0.45)';
        e.currentTarget.style.borderColor = 'rgba(173,92,255,0.15)';
      }}
    >
      {/* Subtle ambient glow */}
      <div style={{
        position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
        width: 180, height: 80, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(173,92,255,0.08) 0%, transparent 70%)',
      }} />

      {/* ── HEADER: logos + role pill ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px 9px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(255,255,255,0.015)',
      }}>
        <img src="/SBGLOGO.png" alt="AWS SBG" style={{ height: 20, objectFit: 'contain', opacity: 0.85 }} />
        <span style={{
          fontSize: 7.5, fontWeight: 700, letterSpacing: '0.12em',
          color: isStudent ? '#AD5CFF' : '#06B6D4',
          background: isStudent ? 'rgba(173,92,255,0.1)' : 'rgba(6,182,212,0.1)',
          border: `1px solid ${isStudent ? 'rgba(173,92,255,0.22)' : 'rgba(6,182,212,0.22)'}`,
          borderRadius: 20, padding: '2px 8px',
          textTransform: 'uppercase', fontFamily: 'monospace',
        }}>
          {isStudent ? 'Student' : 'Faculty'}
        </span>
        <img src="/aws.png" alt="AWS logo" style={{ height: 20, objectFit: 'contain', opacity: 0.85 }} />
      </div>

      {/* ── PROFILE: photo left · info right ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: '16px 16px 14px',
        background: 'linear-gradient(180deg, rgba(173,92,255,0.03) 0%, transparent 100%)',
      }}>
        <Avatar name={student.name} linkedin={student.linkedin} />

        {/* Right side info */}
        <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
          {/* Name */}
          <h3 style={{
            fontSize: 14, fontWeight: 700, color: '#F1F5F9',
            margin: '0 0 3px', lineHeight: 1.25,
            letterSpacing: '-0.01em',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {student.name || '—'}
          </h3>

          {/* Enrolment */}
          {student.enrolment && (
            <p style={{
              fontSize: 9, color: '#475569', margin: '0 0 8px',
              fontFamily: 'monospace', letterSpacing: '0.06em',
            }}>
              {student.enrolment}
            </p>
          )}

          {/* Designation (faculty) */}
          {student.designation && (
            <p style={{ fontSize: 10, color: '#94A3B8', margin: '0 0 8px', fontStyle: 'italic' }}>
              {student.designation}
            </p>
          )}

          {/* Meta info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {isStudent && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <MetaItem icon={BookOpen} value={student.department} />
                {student.semester && (
                  <MetaItem icon={Hash} value={`Sem ${student.semester}`} />
                )}
              </div>
            )}
            {!isStudent && <MetaItem icon={BookOpen} value={student.department} />}
            <MetaItem icon={Building2} value={student.institute} />
          </div>

          {/* Cert count pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            marginTop: 10,
            background: 'rgba(173,92,255,0.08)',
            border: '1px solid rgba(173,92,255,0.2)',
            borderRadius: 20, padding: '3px 9px',
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#AD5CFF', boxShadow: '0 0 5px #AD5CFF',
            }} />
            <span style={{
              fontSize: 8.5, fontWeight: 700, color: '#AD5CFF',
              fontFamily: 'monospace', letterSpacing: '0.05em',
            }}>
              {student.certs?.length || 0} AWS {student.certs?.length === 1 ? 'CERT' : 'CERTS'}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(173,92,255,0.18), transparent)', margin: '0 14px' }} />

      {/* ── CERTIFICATIONS ── */}
      <div style={{ padding: '12px 14px 14px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {student.certs?.map((cert, i) => (
          <CertRow key={i} cert={cert} student={student} />
        ))}
      </div>

      {/* ── FOOTER watermark — always pinned to bottom ── */}
      <div style={{
        padding: '7px 14px 10px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        background: 'rgba(0,0,0,0.18)',
        marginTop: 'auto',
      }}>
        <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#AD5CFF', opacity: 0.5 }} />
        <span style={{
          fontSize: 7.5, color: '#2D3748', fontWeight: 600,
          letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'monospace',
        }}>
          AWS Student Builder Group · Parul University
        </span>
        <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#AD5CFF', opacity: 0.5 }} />
      </div>
    </div>
  );
}
