import React, { useState } from 'react';
import { Award, CheckCircle, Loader, X, GraduationCap, Briefcase, Link, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AWS_CERTS = [
  // Foundational
  'AWS Certified Cloud Practitioner (CLF-C02)',
  'AWS Certified AI Practitioner (AIF-C01)',
  // Associate
  'AWS Certified Solutions Architect - Associate (SAA-C03)',
  'AWS Certified Developer - Associate (DVA-C02)',
  'AWS Certified CloudOps Engineer - Associate (SOA-C03)',
  'AWS Certified Data Engineer - Associate (DEA-C01)',
  'AWS Certified Machine Learning Engineer - Associate (MLA-C01)',
  // Professional
  'AWS Certified Solutions Architect - Professional (SAP-C02)',
  'AWS Certified DevOps Engineer - Professional (DOP-C02)',
  'AWS Certified Generative AI Developer - Professional (AIP-C01)',
  // Specialty
  'AWS Certified Advanced Networking - Specialty (ANS-C01)',
  'AWS Certified Security - Specialty (SCS-C03)',
];

const INSTITUTES = [
  'PIET – Parul Institute of Engineering & Technology',
  'PIT – Parul Institute of Technology',
  'PICA – Parul Institute of Computer Applications',
];

const DEPARTMENTS = [
  'CSE', 'CSE - BDA', 'CSE - Cyber', 'CSE - Cloud',
  'AI', 'AIML', 'AIDS', 'IT',
  'BCA', 'MCA', 'B.Sc. (IT)', 'M.Sc. (IT)',
];

const steps = [
  { n: '01', label: 'Pass your exam', desc: 'Complete any official AWS certification exam.' },
  { n: '02', label: 'Fill this form', desc: 'Submit your details, certification name, and badge link below.' },
  { n: '03', label: 'Get recognised', desc: 'We verify and feature you in our certified builders directory.' },
];

const inputStyle = {
  fontSize: '13px',
  background: 'var(--surface-low)',
  borderColor: 'var(--border-muted)',
  color: 'var(--text-primary)',
};

const labelStyle = { fontSize: '10px', color: 'var(--text-muted)' };

function Field({ label, required, children }) {
  return (
    <div className="space-y-2">
      <label className="font-mono font-bold uppercase block" style={labelStyle}>
        {label} {required && <span style={{ color: '#EF4444' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ style, ...props }) {
  return (
    <input
      className="w-full px-4 py-2.5 rounded-lg border font-sans"
      style={{ ...inputStyle, ...style }}
      {...props}
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      className="w-full px-4 py-2.5 rounded-lg border font-sans"
      style={{ ...inputStyle, cursor: 'pointer' }}
      {...props}
    >
      {children}
    </select>
  );
}

const BLANK_STUDENT = {
  role_type: 'student',
  email: '', name: '', parul_email: '', mobile: '',
  enrolment: '', department: '', semester: '', institute: '',
  exam_date: '', cert_title: '', credly_link: '', linkedin_url: '',
};

const BLANK_FACULTY = {
  role_type: 'faculty',
  email: '', name: '', mobile: '', department: '',
  designation: '', institute: '', linkedin_url: '',
  exam_date: '', cert_title: '', credly_link: '',
};

function LinkedInField({ value, onChange }) {
  return (
    <Field label="LinkedIn Profile URL" required>
      <div className="space-y-2">
        <div className="relative">
          <Link size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: '#0A66C2' }} />
          <input
            type="url"
            name="linkedin_url"
            required
            value={value}
            onChange={onChange}
            placeholder="https://www.linkedin.com/in/your-profile"
            className="w-full py-2.5 rounded-lg border font-sans"
            style={{ ...inputStyle, paddingLeft: '36px', paddingRight: '14px', borderColor: '#0A66C240' }}
            onFocus={e => e.target.style.borderColor = '#0A66C2'}
            onBlur={e => e.target.style.borderColor = '#0A66C240'}
          />
        </div>
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
          style={{ background: 'rgba(10,102,194,0.08)', border: '1px solid rgba(10,102,194,0.25)' }}>
          <Info size={13} style={{ color: '#0A66C2', flexShrink: 0, marginTop: '1px' }} />
          <p className="font-sans leading-relaxed" style={{ fontSize: '11px', color: '#0A66C2' }}>
            <strong>Your photo will be fetched from LinkedIn</strong> — keep your profile photo updated and profile set to public.
          </p>
        </div>
      </div>
    </Field>
  );
}

export default function CertifyPage() {
  const [roleType, setRoleType]     = useState(null);
  const [formData, setFormData]     = useState({});
  const [resultFile, setResultFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState('');

  const selectRole = (type) => {
    setRoleType(type);
    setFormData(type === 'student' ? { ...BLANK_STUDENT } : { ...BLANK_FACULTY });
    setResultFile(null);
    setError('');
  };

  const handleChange = (e) => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleResultFile = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 1024 * 1024) { setError('Result file must be less than 1MB'); return; }
    setResultFile(file);
    setError('');
  };

  const uploadFile = async (file, path) => {
    const { error: upErr } = await supabase.storage.from('certifications').upload(path, file, { upsert: true });
    if (upErr) throw upErr;
    const { data: { publicUrl } } = supabase.storage.from('certifications').getPublicUrl(path);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      let result_url = null;
      if (resultFile) result_url = await uploadFile(resultFile, `results/${Date.now()}_${resultFile.name}`);
      const { error: insertError } = await supabase
        .from('certifications')
        .insert([{ ...formData, result_url, status: 'pending' }]);
      if (insertError) throw insertError;
      setSuccess(true);
      setFormData(roleType === 'student' ? { ...BLANK_STUDENT } : { ...BLANK_FACULTY });
      setResultFile(null);
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetRole = () => { setRoleType(null); setFormData({}); setError(''); };

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ background: 'var(--bg)' }}>

      {/* Banner */}
      <div className="relative overflow-hidden border-b" style={{ borderColor: 'var(--border-muted)' }}>
        <div className="site-grid-pattern absolute inset-0 pointer-events-none opacity-60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(173,92,255,0.09) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center space-y-3">
          <p className="font-mono font-bold uppercase tracking-widest" style={{ fontSize: '10px', color: '#AD5CFF' }}>
            CERTIFIED BUILDERS :: AWS_SBG_PU
          </p>
          <h1 className="font-extrabold uppercase text-3xl md:text-4xl" style={{ color: 'var(--text-primary)' }}>
            Submit Your Certification
          </h1>
          <p className="font-sans font-light leading-relaxed mx-auto"
            style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '500px' }}>
            Passed an AWS exam? Submit your details and get recognised as a certified builder in our community.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-12 space-y-12">

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map(({ n, label, desc }) => (
            <div key={n} className="rounded-xl border p-5 flex gap-4 items-start transition-all"
              style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(173,92,255,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-muted)'}>
              <span className="font-mono font-black flex-shrink-0 leading-none mt-0.5"
                style={{ fontSize: '22px', color: '#AD5CFF', opacity: 0.4 }}>{n}</span>
              <div>
                <p className="font-mono font-bold uppercase mb-1" style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{label}</p>
                <p className="font-sans font-light leading-relaxed" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Eligible certs */}
        <div className="rounded-xl border p-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>
          <h2 className="font-mono font-bold uppercase tracking-widest mb-4" style={{ fontSize: '10px', color: 'var(--text-primary)' }}>
            <Award size={12} style={{ display: 'inline', color: '#F97316', marginRight: '6px' }} />
            ELIGIBLE CERTIFICATIONS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AWS_CERTS.map(c => (
              <div key={c} className="flex items-center gap-2" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                <CheckCircle size={13} style={{ color: '#22C55E', flexShrink: 0 }} />
                <span className="font-sans">{c}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Role Selector */}
        {!roleType && (
          <div className="space-y-4">
            <p className="font-mono font-bold uppercase text-center" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              I am submitting as a...
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { type: 'student', icon: GraduationCap, label: 'Student', desc: 'Currently enrolled at Parul University', color: '#AD5CFF' },
                { type: 'faculty', icon: Briefcase,     label: 'Faculty', desc: 'Faculty or staff member at Parul University', color: '#06B6D4' },
              ].map(({ type, icon: Icon, label, desc, color }) => (
                <button key={type} onClick={() => selectRole(type)}
                  className="rounded-xl border p-6 flex flex-col items-center gap-3 transition-all text-center"
                  style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-muted)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: color + '18' }}>
                    <Icon size={26} style={{ color }} />
                  </div>
                  <div>
                    <p className="font-mono font-bold uppercase" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{label}</p>
                    <p className="font-sans font-light mt-1" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        {roleType && (
          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--border-muted)' }}>

            {/* Form header */}
            <div className="flex items-center justify-between px-5 py-3 border-b"
              style={{ background: 'var(--surface-low)', borderColor: 'var(--border-muted)' }}>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
                    <span key={c} className="w-3 h-3 rounded-full inline-block" style={{ background: c }} />
                  ))}
                </div>
                <span className="font-mono font-bold uppercase ml-2" style={{ fontSize: '9px', color: 'var(--text-subtle)' }}>
                  aws-sbg-pu — {roleType}-certification-submission
                </span>
              </div>
              <button onClick={resetRole}
                className="font-mono font-bold uppercase flex items-center gap-1"
                style={{ fontSize: '9px', color: 'var(--text-subtle)', background: 'none', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}>
                <X size={11} /> Change
              </button>
            </div>

            {/* Role pill */}
            <div className="px-6 pt-5">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono font-bold uppercase"
                style={{
                  fontSize: '9px',
                  background: roleType === 'student' ? '#AD5CFF18' : '#06B6D418',
                  color: roleType === 'student' ? '#AD5CFF' : '#06B6D4',
                  border: `1px solid ${roleType === 'student' ? '#AD5CFF30' : '#06B6D430'}`,
                }}>
                {roleType === 'student' ? <GraduationCap size={11} /> : <Briefcase size={11} />}
                {roleType === 'student' ? 'Student Submission' : 'Faculty Submission'}
              </span>
            </div>

            {error && (
              <div className="mx-6 mt-4 px-4 py-3 rounded-lg border"
                style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444' }}>
                <p className="font-sans text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* ── STUDENT FIELDS ── */}
              {roleType === 'student' && (
                <>
                  <Field label="Email" required>
                    <Input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                  </Field>

                  <Field label="Your Full Name" required>
                    <Input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
                  </Field>

                  <Field label="Parul Email Address" required>
                    <Input type="email" name="parul_email" required value={formData.parul_email} onChange={handleChange} placeholder="your@paruluniversity.ac.in" />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Mobile No" required>
                      <Input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange} placeholder="9876543210" />
                    </Field>
                    <Field label="Enrolment No" required>
                      <Input type="text" name="enrolment" required value={formData.enrolment} onChange={handleChange} placeholder="22012345678901" />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Department / Course" required>
                      <Select name="department" required value={formData.department} onChange={handleChange}>
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </Select>
                    </Field>
                    <Field label="Semester" required>
                      <Select name="semester" required value={formData.semester} onChange={handleChange}>
                        <option value="">Select Semester</option>
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                      </Select>
                    </Field>
                  </div>

                  <Field label="Institute" required>
                    <Select name="institute" required value={formData.institute} onChange={handleChange}>
                      <option value="">Select Institute</option>
                      {INSTITUTES.map(i => <option key={i} value={i}>{i}</option>)}
                    </Select>
                  </Field>

                  <LinkedInField value={formData.linkedin_url} onChange={handleChange} />
                </>
              )}

              {/* ── FACULTY FIELDS ── */}
              {roleType === 'faculty' && (
                <>
                  <Field label="Email" required>
                    <Input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                  </Field>

                  <Field label="Full Name" required>
                    <Input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Dr. Jane Smith" />
                  </Field>

                  <Field label="Mobile No" required>
                    <Input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange} placeholder="9876543210" />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Department" required>
                      <Select name="department" required value={formData.department} onChange={handleChange}>
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </Select>
                    </Field>
                    <Field label="Designation" required>
                      <Input type="text" name="designation" required value={formData.designation} onChange={handleChange} placeholder="Assistant Professor" />
                    </Field>
                  </div>

                  <Field label="Institute" required>
                    <Select name="institute" required value={formData.institute} onChange={handleChange}>
                      <option value="">Select Institute</option>
                      {INSTITUTES.map(i => <option key={i} value={i}>{i}</option>)}
                    </Select>
                  </Field>

                  <LinkedInField value={formData.linkedin_url} onChange={handleChange} />
                </>
              )}

              {/* ── SHARED FIELDS ── */}
              <div className="pt-1 border-t" style={{ borderColor: 'var(--border-muted)' }} />

              <Field label="Date of Exam" required>
                <Input type="date" name="exam_date" required value={formData.exam_date} onChange={handleChange} />
              </Field>

              <Field label="Certification Title" required>
                <Select name="cert_title" required value={formData.cert_title} onChange={handleChange}>
                  <option value="">Select Certification</option>
                  {AWS_CERTS.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>

              <Field label="Your Result (Contains Marks)" required>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  onChange={handleResultFile}
                  className="w-full px-4 py-2.5 rounded-lg border font-sans"
                  style={inputStyle}
                />
                <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>Max 1 MB. PDF, JPG, or PNG</p>
              </Field>

              <Field label="Credly Badge Link" required>
                <Input type="url" name="credly_link" required value={formData.credly_link} onChange={handleChange} placeholder="https://www.credly.com/badges/..." />
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-lg font-mono font-bold uppercase text-white transition-all flex items-center justify-center gap-2"
                style={{
                  fontSize: '11px',
                  background: submitting ? '#9C47FF' : '#AD5CFF',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 0 24px rgba(173,92,255,0.2)',
                  opacity: submitting ? 0.7 : 1,
                }}>
                {submitting ? <><Loader size={14} className="animate-spin" /> Submitting...</> : 'Submit Certification'}
              </button>
            </form>
          </div>
        )}

        <p className="text-center font-sans font-light" style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
          Your submission will be reviewed by our social media team. We'll reach out once it's approved!
        </p>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSuccess(false)}>
          <div className="relative rounded-2xl border max-w-md w-full p-8 text-center space-y-4"
            style={{ background: 'var(--card-bg)', borderColor: 'rgba(34,197,94,0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setSuccess(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--surface-low)', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>
              <X size={16} />
            </button>
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
              <CheckCircle size={32} style={{ color: '#22C55E' }} />
            </div>
            <div className="space-y-2">
              <h3 className="font-mono font-bold uppercase" style={{ fontSize: '14px', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
                Submission Successful!
              </h3>
              <p className="font-sans font-light leading-relaxed" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Your certification has been submitted. Our social media team will review it and reach out to you soon.
              </p>
            </div>
            <button onClick={() => setSuccess(false)}
              className="w-full py-3 rounded-lg font-mono font-bold uppercase text-white"
              style={{ fontSize: '11px', background: '#22C55E', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.background = '#16A34A'}
              onMouseLeave={e => e.currentTarget.style.background = '#22C55E'}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
