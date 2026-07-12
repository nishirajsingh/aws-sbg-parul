/**
 * Google Apps Script — AWS SBG Certified Students Sheet Writer
 *
 * HOW TO DEPLOY / REDEPLOY:
 * 1. Go to https://script.google.com → open your project (or New Project)
 * 2. Paste this entire file, replacing all existing code
 * 3. Click Deploy → New Deployment (or Manage Deployments → Edit → New Version)
 *    - Type: Web App
 *    - Execute as: Me
 *    - Who has access: Anyone (anonymous)
 * 4. Copy the Web App URL → paste into VITE_APPS_SCRIPT_URL in .env
 *
 * IMPORTANT: Every time you change this code you MUST create a New Version
 * in Manage Deployments — otherwise the old code keeps running.
 */

const SHEET_ID = '1aTgU6R6zmh5ngtZQAQE-smz0XevxiRYBdhkOyYU5ZM8';
const TAB_NAME = 'Certified';

const COLUMNS = [
  'role_type', 'name', 'email', 'parul_email', 'mobile', 'enrolment',
  'department', 'semester', 'designation', 'institute', 'linkedin_url',
  'exam_date', 'cert_title', 'credly_link', 'result_url', 'submitted_at',
];

const HEADERS = [
  'Role Type', 'Name', 'Email', 'Parul Email', 'Mobile', 'Enrolment No',
  'Department', 'Semester', 'Designation', 'Institute', 'LinkedIn URL',
  'Exam Date', 'Certification Title', 'Credly Link', 'Result URL', 'Submitted At',
];

function doGet(e) {
  try {
    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let sheet   = ss.getSheetByName(TAB_NAME);
    if (!sheet) sheet = ss.insertSheet(TAB_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
        .setFontWeight('bold')
        .setBackground('#232F3E')
        .setFontColor('#FF9900');
      sheet.setFrozenRows(1);
    }

    const p = e.parameter;
    const row = COLUMNS.map(col =>
      col === 'submitted_at'
        ? new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : (p[col] || '')
    );

    sheet.appendRow(row);
    sheet.autoResizeColumns(1, HEADERS.length);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', name: p.name || '' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Run this manually in Apps Script editor to test without deploying ──
function testWrite() {
  const e = {
    parameter: {
      role_type: 'student',
      name: 'Test Student',
      email: 'test@example.com',
      parul_email: 'test@paruluniversity.ac.in',
      mobile: '9876543210',
      enrolment: '22012345678901',
      department: 'CSE',
      semester: '5',
      designation: '',
      institute: 'PIET – Parul Institute of Engineering & Technology',
      linkedin_url: 'https://linkedin.com/in/test',
      exam_date: '2025-01-15',
      cert_title: 'AWS Certified Cloud Practitioner (CLF-C02)',
      credly_link: 'https://credly.com/badges/test',
      result_url: '',
    }
  };
  Logger.log(doGet(e).getContent());
}
