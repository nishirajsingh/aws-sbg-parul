import { useState } from 'react';
import { Download, Loader } from 'lucide-react';

// Map cert title keywords → frame PNG in /public/certifications/
const CERT_FRAMES = {
  'cloud practitioner': '/certifications/AWS-Cloud-Practitioner.png',
};

function getFrame(certTitle = '') {
  const t = certTitle.toLowerCase();
  for (const [k, v] of Object.entries(CERT_FRAMES)) {
    if (t.includes(k)) return v;
  }
  return null;
}

// Canvas fixed coords (1080 × 1350)
const W = 1080, H = 1350;
const PHOTO  = { x: 639, y: 483, w: 410, h: 410  };
const NAME   = { x: 22,  y: 315, w: 730, h: 90  };
const DETAIL = { x: 36,  y: 480, w: 450, h: 150  };

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load: ${src}`));
    img.src = src;
  });
}

function drawFitText(ctx, text, x, y, maxW, maxH, baseSize, style = '') {
  let size = baseSize;
  ctx.font = `${style} ${size}px Arial, sans-serif`;
  while (ctx.measureText(text).width > maxW && size > 10) {
    size -= 1;
    ctx.font = `${style} ${size}px Arial, sans-serif`;
  }
  // Vertically center within maxH
  ctx.fillText(text, x + maxW / 2, y + maxH / 2 + size * 0.35);
}

async function generateCertificate({ frameSrc, photoSrc, name, department, semester, institute }) {
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // 1. Draw frame
  const frame = await loadImage(frameSrc);
  ctx.drawImage(frame, 0, 0, W, H);

  // 2. Draw circular photo
  if (photoSrc) {
    try {
      const photo = await loadImage(photoSrc);
      const cx = PHOTO.x + PHOTO.w / 2;
      const cy = PHOTO.y + PHOTO.h / 2;
      const r  = Math.min(PHOTO.w, PHOTO.h) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      // object-fit: cover
      const scale = Math.max(PHOTO.w / photo.width, PHOTO.h / photo.height);
      const sw = photo.width  * scale;
      const sh = photo.height * scale;
      ctx.drawImage(photo, cx - sw / 2, cy - sh / 2, sw, sh);
      ctx.restore();
    } catch {
      // photo failed — skip, frame placeholder stays
    }
  }

  // 3. Student name — white, bold, auto-shrink, centered
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  drawFitText(ctx, (name || '').toUpperCase(), NAME.x, NAME.y, NAME.w, NAME.h, 52, 'bold');

  // 4. Student details — white, three lines
  const lines = [
    'Student,',
    `${department || ''} - Sem ${semester || ''},`,
    institute || '',
  ];
  const lineH = DETAIL.h / lines.length;
  ctx.font = 'bold 28px Arial, sans-serif';
  ctx.textAlign = 'left';
  lines.forEach((line, i) => {
    ctx.fillText(line, DETAIL.x, DETAIL.y + lineH * i + lineH * 0.72);
  });

  return canvas.toDataURL('image/png', 1.0);
}

export default function CertificateGenerator({ student, cert }) {
  const [generating, setGenerating] = useState(false);

  const frameSrc = getFrame(cert?.cert_title);
  const photoSrc = (() => {
    const m = student?.linkedin?.match(/linkedin\.com\/in\/([^/?#]+)/);
    return m ? `https://unavatar.io/linkedin/${m[1]}` : null;
  })();

  // All hooks above — safe to early-return now
  if (!frameSrc || !student?.linkedin) return null;

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const dataUrl = await generateCertificate({
        frameSrc,
        photoSrc,
        name:       student.name,
        department: student.department,
        semester:   student.semester,
        institute:  student.institute,
      });
      const a = document.createElement('a');
      a.href     = dataUrl;
      a.download = `${(student.name || 'certificate').replace(/\s+/g, '-')}-AWS-Post.png`;
      a.click();
    } catch (err) {
      console.error('Certificate generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="flex items-center gap-1 font-mono font-bold uppercase no-underline flex-shrink-0"
      style={{
        fontSize: '8px',
        color: generating ? '#888' : '#22C55E',
        background: 'none',
        border: 'none',
        cursor: generating ? 'not-allowed' : 'pointer',
        padding: 0,
      }}
      onMouseEnter={e => { if (!generating) e.currentTarget.style.opacity = '0.6'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
    >
      {generating
        ? <><Loader size={9} className="animate-spin" /> Generating...</>
        : <><Download size={9} /> Post</>
      }
    </button>
  );
}
