const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

export async function exportToSheet(cert) {
  if (!APPS_SCRIPT_URL) throw new Error('VITE_APPS_SCRIPT_URL is not set in .env');

  const params = new URLSearchParams({
    role_type:    cert.role_type    || 'student',
    name:         cert.name         || '',
    email:        cert.email        || '',
    parul_email:  cert.parul_email  || '',
    mobile:       cert.mobile       || '',
    enrolment:    cert.enrolment    || '',
    department:   cert.department   || '',
    semester:     cert.semester     || '',
    designation:  cert.designation  || '',
    institute:    cert.institute    || '',
    linkedin_url: cert.linkedin_url || '',
    exam_date:    cert.exam_date    || '',
    cert_title:   cert.cert_title   || '',
    credly_link:  cert.credly_link  || '',
    result_url:   cert.result_url   || '',
  });

  await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
    method: 'GET',
    mode: 'no-cors',
  });
}
