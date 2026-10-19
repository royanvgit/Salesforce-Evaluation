/* =====================================================================
   ORGANIZER CONFIGURATION  –  edit this file only
   ===================================================================== */
const CONFIG = {
  organizerName: "Simpliigence",
  organizerEmail: "vinod@simpliigence.com",   // result is emailed here

  // Passcode to open results on the candidate's machine (change before sharing!)
  organizerPasscode: "simpli2026",

  testTitle: "Salesforce Developer Evaluation",
  passPercentage: 60,          // pass mark in % (source paper: 60 / 100)
  timeLimitMinutes: 150,       // auto-submits when time runs out

  // Marks per question and number of questions per section (per paper)
  sections: {
    mcq:      { label: "Multiple choice",           count: 15, marks: 2 },  // 30
    short:    { label: "Short answer (3–5 lines)",   count: 5,  marks: 4 },  // 20
    coding:   { label: "Coding",                    count: 5,  marks: 6 },  // 30
    scenario: { label: "Scenario based",            count: 5,  marks: 4 }   // 20
  },

  // Show the candidate their score after submitting? (organizer always gets it)
  showScoreToCandidate: false,

  // ---- Proctoring ----
  proctoring: {
    requireFullscreen: true,   // test only runs in full screen
    maxPageSwaps: 2,           // leaving the test page is allowed this many times (with a warning);
                               // one more time and the test is TERMINATED and submitted
    blockCopyPaste: true,      // no copy / cut / paste / drag-drop / right-click / print
    countReloadAsSwap: true    // reloading or reopening the test page counts as leaving it
  },

  // ---- EmailJS (same account as the C/C++/Python/Java evaluation) ----
  emailjs: {
    enabled: true,
    publicKey:  "2P-n5WgpeOAt3jGCw",
    serviceId:  "service_geq1mcj",
    templateId: "template_uezb0nf",
    attachPdf:  false          // free plan: no attachments; the email body carries the full breakdown + answers
  }
};
