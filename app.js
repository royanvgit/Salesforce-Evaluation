/* =====================================================================
   Salesforce Developer Evaluation – application logic
   Proctoring: full screen required · max N page swaps then TERMINATE ·
   copy / paste blocked · reload counts as a swap · auto-submit on timeout
   ===================================================================== */
(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const S = CONFIG.sections, P = CONFIG.proctoring;
  const SECTION_ORDER = ["mcq", "short", "coding", "scenario"];
  const SECTION_LETTER = { mcq: "A", short: "B", coding: "C", scenario: "D" };
  const BANK = { short: SHORT_BANK, coding: CODING_BANK, scenario: SCENARIO_BANK };
  const maxTotal = () => SECTION_ORDER.reduce((s, k) => s + S[k].count * S[k].marks, 0);
  const fmtDur = (ms) => { const t = Math.max(0, Math.round(ms / 1000)); const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60; return (h ? h + " h " : "") + `${m} min ${String(s).padStart(2, "0")} sec`; };

  /* ------------------------------------------------ state + persistence */
  let A = null;   // the attempt (persisted while the test is running)
  const state = { paperId: null, paper: null, section: "mcq", timerId: null, result: null, pdfBlob: null, pdfName: "" };
  const keyFor = (id) => "sfeval-attempt-" + id;
  function save() { if (!A) return; try { localStorage.setItem(keyFor(state.paperId), JSON.stringify(A)); } catch (e) { } }
  function load(id) { try { return JSON.parse(localStorage.getItem(keyFor(id)) || "null"); } catch (e) { return null; } }
  function clearAttempt() { try { localStorage.removeItem(keyFor(state.paperId)); } catch (e) { } }

  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffled(arr, rnd) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function randomSeed() { try { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] || 1; } catch (e) { return (Date.now() >>> 0) || 1; } }

  // MCQ order and option order are shuffled per candidate (seeded, so a reload keeps the same layout)
  function mcqLayout() {
    const rnd = mulberry32(A.seed);
    return shuffled(state.paper.mcq, rnd).map(id => ({ id, opts: shuffled(MCQ_BANK[id].options.map((t, i) => i), rnd) }));
  }

  /* ------------------------------------------------ screens */
  function show(id) { document.querySelectorAll(".screen").forEach(s => s.hidden = true); $(id).hidden = false; window.scrollTo(0, 0); }
  function flash(msg) { const f = $("#flash"); f.textContent = msg; f.hidden = false; clearTimeout(f._t); f._t = setTimeout(() => f.hidden = true, 2200); }
  function overlay(html, danger) { $("#overlay-card").innerHTML = html; $("#overlay-card").classList.toggle("danger", !!danger); $("#overlay").hidden = false; }
  function hideOverlay() { $("#overlay").hidden = true; }
  // In-page confirm (native dialogs would steal focus and look like a page swap)
  function confirmBox(html, okLabel) {
    return new Promise(res => {
      overlay(`${html}<div class="row-actions" style="justify-content:center;margin-top:14px"><button class="btn btn-ghost" id="cb-no">Cancel</button><button class="btn btn-primary" id="cb-yes">${esc(okLabel || "OK")}</button></div>`);
      $("#cb-no").onclick = () => { hideOverlay(); res(false); };
      $("#cb-yes").onclick = () => { hideOverlay(); res(true); };
    });
  }

  function summaryRows() {
    return SECTION_ORDER.map(k => `<tr><td>Section ${SECTION_LETTER[k]} – ${esc(S[k].label)}</td><td>${S[k].count} × ${S[k].marks}</td><td>${S[k].count * S[k].marks}</td></tr>`).join("") +
      `<tr><th>Total · ${CONFIG.timeLimitMinutes} minutes · pass mark ${CONFIG.passPercentage}%</th><th></th><th>${maxTotal()}</th></tr>`;
  }

  function init() {
    $("#brand").textContent = CONFIG.testTitle;
    document.querySelectorAll(".max-swaps").forEach(e => e.textContent = P.maxPageSwaps);
    const params = new URLSearchParams(location.search);
    const paperId = (params.get("paper") || "").toLowerCase();
    if (params.get("organizer") === "1") { renderOrganizerHome(); return; }
    if (!paperId || !PAPERS[paperId]) { renderLanding(); return; }
    state.paperId = paperId; state.paper = PAPERS[paperId];
    const saved = load(paperId);
    if (saved && saved.startedAt) { A = saved; return handleResume(); }
    renderStart();
  }

  function renderLanding() {
    $("#landing-meta").textContent = `Each paper: ${SECTION_ORDER.map(k => `${S[k].count} ${S[k].label.toLowerCase()} (${S[k].count * S[k].marks})`).join(" + ")} = ${maxTotal()} marks · ${CONFIG.timeLimitMinutes} minutes · pass mark ${CONFIG.passPercentage}%. Runs in full screen, copy/paste disabled, terminated after more than ${P.maxPageSwaps} page swaps.`;
    const list = $("#paper-list"); list.innerHTML = "";
    Object.entries(PAPERS).forEach(([id, p]) => {
      const url = location.origin + location.pathname + "?paper=" + id;
      const row = document.createElement("div"); row.className = "paper-row";
      row.innerHTML = `<div><strong>${esc(p.label)}</strong><div class="muted small">${esc(url)}</div></div>
        <div class="row-actions"><a class="btn btn-secondary" href="?paper=${id}">Open</a><button class="btn btn-ghost" data-copy="${esc(url)}">Copy link</button></div>`;
      list.appendChild(row);
    });
    list.addEventListener("click", e => { const b = e.target.closest("[data-copy]"); if (b) { navigator.clipboard?.writeText(b.dataset.copy); b.textContent = "Copied!"; setTimeout(() => b.textContent = "Copy link", 1500); } });
    show("#screen-landing");
  }

  function renderStart() {
    $("#start-paper-label").textContent = state.paper.label;
    $("#start-table").innerHTML = summaryRows();
    $("#rules-list").innerHTML = [
      "The test opens in <strong>full screen</strong> and must stay in full screen until you submit. Use a laptop or desktop (Chrome, Edge or Firefox).",
      `Leaving the test page – switching tab or window, minimising, pressing Esc to exit full screen, or reloading – is recorded. You get a warning the first ${P.maxPageSwaps} time(s). <strong>The ${ordinal(P.maxPageSwaps + 1)} time the test is terminated</strong> and submitted as it stands.`,
      "Copy, cut, paste, drag-and-drop, right-click and printing are disabled. Type every answer yourself.",
      "Answers save automatically. The timer starts when you click Start, and the test is submitted automatically when time runs out.",
      "Written and coding answers: write in plain English / Apex / LWC as you would explain to an interview panel. No autocomplete is available."
    ].map(r => `<li>${r}</li>`).join("");
    if (P.requireFullscreen && !fsSupported()) { $("#start-error").textContent = "This browser cannot run the test in full screen. Please open the link in Chrome, Edge or Firefox on a laptop or desktop."; $("#start-error").hidden = false; $("#start-form button").disabled = true; }
    show("#screen-start");
    fullscreenGate();
  }

  // Browsers only allow full screen after a click or key press, so the page opens
  // with a full-page prompt: the candidate's first click puts it in full screen,
  // and it stays in full screen from the details form through the whole test.
  function fullscreenGate() {
    if (!P.requireFullscreen || !fsSupported()) return;
    const onStart = () => !$("#screen-start").hidden;
    const showGate = () => {
      if (!onStart() || isFs()) return;
      overlay(`<h2>${esc(state.paper.label)}</h2><p>This test runs in <strong>full screen</strong>.</p>
        <button class="btn btn-primary" id="btn-fs-go">Enter full screen</button><p class="muted small" style="margin-top:12px">Click anywhere to continue.</p>`);
    };
    $("#overlay").addEventListener("click", async () => {
      if (!onStart()) return;
      if (await enterFullscreen()) hideOverlay(); else flash("Full screen was blocked. Allow full screen for this site and click again.");
    });
    document.addEventListener("keydown", async (e) => { if (onStart() && !$("#overlay").hidden && !isFs() && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); if (await enterFullscreen()) hideOverlay(); } });
    const onFsChange = () => { if (!isFs()) showGate(); };
    document.addEventListener("fullscreenchange", onFsChange); document.addEventListener("webkitfullscreenchange", onFsChange);
    showGate();
  }
  const ordinal = (n) => n + (["th", "st", "nd", "rd"][(n % 100 > 10 && n % 100 < 14) ? 0 : n % 10] || "th");

  /* ------------------------------------------------ start / resume */
  $("#start-form").addEventListener("submit", async e => {
    e.preventDefault();
    const name = $("#cand-name").value.trim(); if (!name) return;
    if (P.requireFullscreen) { const ok = await enterFullscreen(); if (!ok) { $("#start-error").textContent = "Full screen was blocked. Allow full screen for this site and try again (Chrome, Edge or Firefox on a laptop/desktop)."; $("#start-error").hidden = false; return; } }
    A = { candidate: { name, email: $("#cand-email").value.trim(), batch: $("#cand-batch").value.trim() }, paperId: state.paperId, seed: randomSeed(),
      startedAt: Date.now(), mcq: {}, text: {}, swaps: [], events: [] };
    save(); beginExam();
  });

  function handleResume() {
    const left = A.startedAt + CONFIG.timeLimitMinutes * 60000 - Date.now();
    if (A.submitting || left <= 0) { submitTest(A.terminated ? "terminated" : left <= 0 ? "time" : (A.submitReason || "candidate")); return; }
    if (P.countReloadAsSwap && !A.resumeCounted) {
      A.swaps.push({ at: new Date().toISOString(), reason: "Reloaded or reopened the test page" }); A.resumeCounted = true; save();
      if (A.swaps.length > P.maxPageSwaps) { terminate(); return; }
    }
    $("#resume-msg").innerHTML = `<strong>${esc(A.candidate.name)}</strong>, your test was interrupted. ${P.countReloadAsSwap ? `This counted as leaving the test page (<strong>${A.swaps.length} of ${P.maxPageSwaps}</strong> allowed). ` : ""}Time remaining: <strong>${fmtDur(left)}</strong>.`;
    show("#screen-resume");
  }
  $("#btn-resume").addEventListener("click", async () => {
    if (P.requireFullscreen && !(await enterFullscreen())) { flash("Full screen is required to continue."); return; }
    A.resumeCounted = false; save(); beginExam();
  });
  $("#btn-discard").addEventListener("click", () => {
    const p = prompt("Organizer passcode:"); if (p !== CONFIG.organizerPasscode) { if (p !== null) alert("Incorrect passcode."); return; }
    clearAttempt(); location.reload();
  });

  function beginExam() {
    state.section = A.section || "mcq";
    renderExam(); startTimer(); startProctoring();
    window.onbeforeunload = (e) => { e.preventDefault(); return "Your test is in progress."; };
  }

  /* ------------------------------------------------ exam rendering */
  function renderExam() {
    const body = $("#exam-body"); body.innerHTML = "";
    const lay = mcqLayout();
    // Section A
    let html = secIntro("mcq", "Choose one option per question.");
    lay.forEach((m, i) => {
      const q = MCQ_BANK[m.id];
      html += `<div class="card q" data-sec="mcq"><div class="q-head"><span><span class="q-num">A${i + 1}.</span> <span class="q-topic">${esc(q.topic)}</span></span><span class="q-marks">${S.mcq.marks} marks</span></div>
        <p class="q-text">${esc(q.q)}</p><div class="options">${m.opts.map((oi, j) => `<label class="opt"><input type="radio" name="mcq-${m.id}" value="${oi}" ${A.mcq[m.id] === oi ? "checked" : ""}><span class="opt-letter">${"abcd"[j]})</span><span>${esc(q.options[oi])}</span></label>`).join("")}</div></div>`;
    });
    // Sections B, C, D
    const blocks = { short: "Answer each in 3–5 lines.", coding: "Write complete Apex / LWC code. Marks are given for correctness, bulkification and limits, security and best practice, and the test or explanation asked for.", scenario: "Answer as you would speak to an interview panel." };
    ["short", "coding", "scenario"].forEach(sec => {
      html += secIntro(sec, blocks[sec]);
      state.paper[sec].forEach((id, i) => {
        const q = BANK[sec][id]; const L = SECTION_LETTER[sec] + (i + 1);
        html += `<div class="card q" data-sec="${sec}"><div class="q-head"><span><span class="q-num">${L}.</span> <span class="q-topic">${esc(q.title || q.topic)}</span></span><span class="q-marks">${S[sec].marks} marks</span></div>
          <p class="q-text">${esc(q.q)}</p>
          <textarea class="answer-box ${sec === "coding" ? "code-editor" : ""}" data-id="${id}" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" placeholder="${sec === "coding" ? "" : "Type your answer here…"}">${esc(A.text[id] || "")}</textarea>
          <div class="wc" data-wc="${id}"></div></div>`;
      });
    });
    body.innerHTML = html;
    body.querySelectorAll("input[type=radio]").forEach(r => r.addEventListener("change", () => { A.mcq[+r.name.slice(4)] = +r.value; save(); updateTabs(); }));
    body.querySelectorAll("textarea").forEach(t => {
      const upd = () => { const w = t.value.trim() ? t.value.trim().split(/\s+/).length : 0; body.querySelector(`[data-wc="${t.dataset.id}"]`).textContent = `${w} words`; };
      upd();
      t.addEventListener("input", () => { A.text[t.dataset.id] = t.value; upd(); saveSoon(); updateTabs(); });
      t.addEventListener("keydown", e => {
        if (e.key === "Tab" && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); const s = t.selectionStart, en = t.selectionEnd; t.setRangeText("    ", s, en, "end"); t.dispatchEvent(new Event("input")); }
      });
    });
    renderTabs(); showSection(state.section);
    show("#screen-exam");
  }
  let saveT = null; function saveSoon() { clearTimeout(saveT); saveT = setTimeout(save, 400); }
  function secIntro(sec, text) { return `<div class="sec-intro" data-sec="${sec}"><h2>Section ${SECTION_LETTER[sec]} – ${esc(S[sec].label)} <span class="muted small">(${S[sec].count} × ${S[sec].marks} = ${S[sec].count * S[sec].marks} marks)</span></h2><p class="muted small">${esc(text)}</p></div>`; }
  function answeredCount(sec) { return sec === "mcq" ? state.paper.mcq.filter(id => A.mcq[id] != null).length : state.paper[sec].filter(id => (A.text[id] || "").trim()).length; }
  function renderTabs() {
    $("#tabs").innerHTML = SECTION_ORDER.map(k => `<button class="tab" data-tab="${k}">${SECTION_LETTER[k]} · ${esc(S[k].label.replace(/ \(.*\)/, ""))}<span class="cnt" data-cnt="${k}"></span></button>`).join("");
    $("#tabs").onclick = e => { const b = e.target.closest("[data-tab]"); if (b) showSection(b.dataset.tab); };
    updateTabs();
  }
  function updateTabs() { SECTION_ORDER.forEach(k => { const c = document.querySelector(`[data-cnt="${k}"]`); if (c) c.textContent = `${answeredCount(k)}/${state.paper[k].length}`; }); }
  function showSection(sec) {
    state.section = sec; A.section = sec; save();
    document.querySelectorAll("#exam-body [data-sec]").forEach(el => el.hidden = el.dataset.sec !== sec);
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.tab === sec));
    const i = SECTION_ORDER.indexOf(sec);
    $("#btn-prev").style.visibility = i > 0 ? "visible" : "hidden";
    $("#btn-next").style.visibility = i < SECTION_ORDER.length - 1 ? "visible" : "hidden";
    window.scrollTo(0, 0);
  }
  $("#btn-prev").onclick = () => showSection(SECTION_ORDER[Math.max(0, SECTION_ORDER.indexOf(state.section) - 1)]);
  $("#btn-next").onclick = () => showSection(SECTION_ORDER[Math.min(3, SECTION_ORDER.indexOf(state.section) + 1)]);
  $("#btn-submit").onclick = async () => {
    const un = SECTION_ORDER.map(k => [k, state.paper[k].length - answeredCount(k)]).filter(x => x[1] > 0);
    const ok = await confirmBox(`<h2>Submit the test?</h2>${un.length ? `<p>Unanswered: ${un.map(([k, n]) => `Section ${SECTION_LETTER[k]}: ${n}`).join(", ")}</p>` : "<p>All questions answered.</p>"}<p class="muted small">You cannot change your answers after submitting.</p>`, "Submit");
    if (ok) submitTest("candidate");
  };

  /* ------------------------------------------------ timer */
  function startTimer() {
    clearInterval(state.timerId);
    const end = A.startedAt + CONFIG.timeLimitMinutes * 60000;
    const tick = () => {
      const left = Math.max(0, end - Date.now());
      const h = Math.floor(left / 3600000), m = Math.floor(left % 3600000 / 60000), s = Math.floor(left % 60000 / 1000);
      document.querySelectorAll(".timer").forEach(el => { el.textContent = (h ? h + ":" + String(m).padStart(2, "0") : m) + ":" + String(s).padStart(2, "0"); el.classList.toggle("warn", left < 10 * 60000); });
      if (left <= 0) { clearInterval(state.timerId); submitTest("time"); }
    };
    tick(); state.timerId = setInterval(tick, 1000);
  }

  /* ------------------------------------------------ proctoring */
  const proctor = { active: false, away: false, handlers: [] };
  const fsSupported = () => !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);
  const isFs = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
  async function enterFullscreen() {
    if (!P.requireFullscreen) return true;
    if (isFs()) return true;
    const el = document.documentElement;
    try { if (el.requestFullscreen) await el.requestFullscreen({ navigationUI: "hide" }); else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen(); } catch (e) { return false; }
    await new Promise(r => setTimeout(r, 120));
    return isFs();
  }
  function on(t, ev, fn, opts) { t.addEventListener(ev, fn, opts); proctor.handlers.push([t, ev, fn, opts]); }
  function inExam() { return proctor.active; }

  function startProctoring() {
    proctor.active = true; proctor.away = false; updateSwapPill();
    on(document, "visibilitychange", () => { if (document.hidden) leave("Switched tab or minimised the window"); else checkReturn(); });
    on(window, "blur", () => setTimeout(() => { if (proctor.active && !document.hasFocus()) leave(document.hidden ? "Switched tab or minimised the window" : "Switched to another window or application"); }, 200));
    on(window, "focus", () => checkReturn());
    if (P.requireFullscreen) {
      const fsChange = () => { if (!isFs()) leave("Exited full screen"); else checkReturn(); };
      on(document, "fullscreenchange", fsChange); on(document, "webkitfullscreenchange", fsChange);
      if (!isFs()) leave("Not in full screen");
    }
    if (P.blockCopyPaste) {
      const block = (what) => (e) => { if (!inExam()) return; e.preventDefault(); e.stopPropagation(); flash(`${what} is disabled during the test.`); logEvent(what + " blocked"); };
      on(document, "copy", block("Copy"), true); on(document, "cut", block("Cut"), true); on(document, "paste", block("Paste"), true);
      on(document, "drop", block("Drag and drop"), true); on(document, "dragstart", e => { if (inExam()) e.preventDefault(); }, true);
      on(document, "contextmenu", e => { if (inExam()) e.preventDefault(); }, true);
      on(document, "beforeinput", e => { if (inExam() && /^insertFrom(Paste|Drop|Yank|PasteAsQuotation)$/.test(e.inputType)) { e.preventDefault(); flash("Paste is disabled during the test."); logEvent("Paste blocked"); } }, true);
      on(document, "keydown", e => {
        if (!inExam()) return;
        const k = (e.key || "").toLowerCase(), mod = e.ctrlKey || e.metaKey;
        const bad = (mod && ["c", "x", "v", "p", "s", "u"].includes(k)) || (e.shiftKey && k === "insert") || (mod && k === "insert") ||
          k === "f12" || (mod && e.shiftKey && ["i", "j", "c", "k"].includes(k)) || k === "printscreen";
        if (bad) { e.preventDefault(); e.stopPropagation(); flash("This shortcut is disabled during the test."); logEvent("Blocked shortcut " + (mod ? "Ctrl+" : "") + (e.shiftKey ? "Shift+" : "") + e.key); }
      }, true);
      on(window, "beforeprint", () => { if (inExam()) document.body.style.visibility = "hidden"; });
      on(window, "afterprint", () => { document.body.style.visibility = ""; });
    }
  }
  function stopProctoring() {
    proctor.active = false;
    proctor.handlers.forEach(([t, ev, fn, o]) => t.removeEventListener(ev, fn, o)); proctor.handlers = [];
    if (isFs() && document.exitFullscreen) document.exitFullscreen().catch(() => { });
    $("#swap-indicator").hidden = true;
  }
  function logEvent(what) { if (!A) return; A.events.push({ at: new Date().toISOString(), what }); if (A.events.length > 200) A.events.shift(); saveSoon(); }
  function updateSwapPill() { const p = $("#swap-indicator"); p.hidden = false; p.textContent = `Page swaps: ${A.swaps.length} / ${P.maxPageSwaps}`; p.classList.toggle("ok", A.swaps.length === 0); }

  // One "leave" = one swap. It is counted once and cleared only when the
  // candidate is back: page visible + focused + in full screen.
  function leave(reason) {
    if (!proctor.active || proctor.away) { if (proctor.active) showAwayOverlay(); return; }
    proctor.away = true;
    A.swaps.push({ at: new Date().toISOString(), reason }); save(); updateSwapPill();
    if (A.swaps.length > P.maxPageSwaps) { terminate(); return; }
    showAwayOverlay();
  }
  function showAwayOverlay() {
    const n = A.swaps.length, left = P.maxPageSwaps - n;
    overlay(`<h2>⚠ Warning ${n} of ${P.maxPageSwaps}</h2><p>You left the test page: <strong>${esc(A.swaps[n - 1]?.reason || "")}</strong>.</p>
      <p>${left > 0 ? `You may leave the page <strong>${left}</strong> more time${left > 1 ? "s" : ""}.` : "<strong>This was your last warning.</strong>"} If you leave again after that, <strong>the test will be terminated</strong> and submitted as it is.</p>
      <button class="btn btn-primary" id="btn-back">Return to the test${P.requireFullscreen ? " in full screen" : ""}</button>`, true);
    $("#btn-back").onclick = async () => {
      if (P.requireFullscreen && !(await enterFullscreen())) { flash("Full screen is required to continue."); return; }
      checkReturn(); if (!proctor.away) hideOverlay();
    };
  }
  // Candidate is back on the page: the next departure counts as a new swap.
  // The warning stays on screen until they acknowledge it (and are in full screen).
  function checkReturn() {
    if (!proctor.active || !proctor.away) return;
    if (!document.hidden && document.hasFocus() && (!P.requireFullscreen || isFs())) proctor.away = false;
  }
  function terminate() {
    proctor.active = false; A.terminated = true; save();
    submitTest("terminated");
  }

  /* ------------------------------------------------ submit + grade */
  async function submitTest(why) {
    if (state.submitting) return; state.submitting = true;
    A.submitting = true; A.submitReason = why; if (why === "terminated") A.terminated = true; save();
    clearInterval(state.timerId); window.onbeforeunload = null; stopProctoring(); hideOverlay();
    document.querySelectorAll(".timer").forEach(el => el.textContent = "");
    show("#screen-grading");
    const log = (m) => { $("#grading-log").textContent += m + "\n"; };
    log(why === "terminated" ? `Test terminated: left the test page ${A.swaps.length} times (limit ${P.maxPageSwaps}).` : why === "time" ? "Time is up – submitting automatically." : "Submitting…");

    const now = Date.now(); const lay = mcqLayout();
    const r = { candidate: A.candidate, paperId: state.paperId, paper: state.paper.label, seed: A.seed,
      startedAt: new Date(A.startedAt).toISOString(), submittedAt: new Date(now).toISOString(),
      timeTaken: fmtDur(Math.min(now - A.startedAt, CONFIG.timeLimitMinutes * 60000)), timeLimit: CONFIG.timeLimitMinutes + " min",
      submitReason: why === "terminated" ? `TERMINATED – left the test page ${A.swaps.length} times (limit ${P.maxPageSwaps})` : why === "time" ? "Time expired (auto-submitted)" : "Submitted by candidate",
      terminated: !!A.terminated, swaps: A.swaps.slice(), events: A.events.slice(-50), sections: {} };

    r.sections.mcq = lay.map((m, i) => {
      const q = MCQ_BANK[m.id], chosen = A.mcq[m.id], letter = (oi) => "abcd"[m.opts.indexOf(oi)];
      const ok = chosen === q.answer;
      return { n: "A" + (i + 1), id: m.id, topic: q.topic, q: q.q, chosen: chosen == null ? null : `${letter(chosen)}) ${q.options[chosen]}`, correct: `${letter(q.answer)}) ${q.options[q.answer]}`, marks: ok ? S.mcq.marks : 0, max: S.mcq.marks, why: q.why };
    });
    ["short", "coding", "scenario"].forEach(sec => {
      r.sections[sec] = state.paper[sec].map((id, i) => {
        const q = BANK[sec][id], ans = A.text[id] || "";
        const g = Grader.scoreAnswer(ans, q.points, { max: S[sec].marks, minForAttempt: sec === "coding" ? 1 : 0 });
        return { n: SECTION_LETTER[sec] + (i + 1), id, title: q.title || q.topic, q: q.q, answer: ans, model: q.model, marks: g.marks, max: S[sec].marks, matched: g.matched, missed: g.missed, note: g.note };
      });
    });
    r.totals = {}; SECTION_ORDER.forEach(k => r.totals[k] = r.sections[k].reduce((s, x) => s + x.marks, 0));
    r.total = SECTION_ORDER.reduce((s, k) => s + r.totals[k], 0);
    r.maxTotal = maxTotal();
    r.percentage = Math.round(r.total / r.maxTotal * 1000) / 10;
    r.status = r.terminated ? "TERMINATED" : r.percentage >= CONFIG.passPercentage ? "PASS" : "FAIL";
    r.pass = r.status === "PASS";
    state.result = r;
    log(`Scored: ${r.total} / ${r.maxTotal} (${r.percentage}%) – ${r.status}`);
    try { localStorage.setItem("sfeval-result-" + now, JSON.stringify(r)); } catch (e) { }

    try { makePdf(r); log("Report ready."); } catch (e) { log("PDF failed: " + e.message); }
    log(`Sending result to ${CONFIG.organizerName}…`);
    const mail = await sendEmail(r);
    r.emailStatus = mail.ok ? "sent" : "failed: " + mail.error;
    log(mail.ok ? "Email sent." : "Email not sent: " + mail.error);
    try { localStorage.setItem("sfeval-result-" + now, JSON.stringify(r)); } catch (e) { }
    clearAttempt(); A = null;
    setTimeout(() => showDone(r, mail.ok), 600);
  }

  function showDone(r, mailed) {
    const icon = $("#done-icon");
    if (r.terminated) {
      icon.textContent = "✕"; icon.classList.add("bad");
      $("#done-title").textContent = "Test terminated";
      $("#done-body").innerHTML = `<p><strong>${esc(r.candidate.name)}</strong>, your test was terminated because you left the test page <strong>${r.swaps.length} times</strong>. Only ${P.maxPageSwaps} were allowed.</p>
        <table class="mini-table">${r.swaps.map((s, i) => `<tr><td>${i + 1}. ${esc(s.reason)}</td><td>${new Date(s.at).toLocaleTimeString()}</td></tr>`).join("")}</table>
        <p><strong>Result: TERMINATED</strong> – not eligible to pass.${CONFIG.showScoreToCandidate ? ` Score at termination: ${r.total} / ${r.maxTotal} (${r.percentage}%).` : ""}</p>
        <p class="muted small">Your answers up to this point ${mailed ? `have been sent to ${esc(CONFIG.organizerName)}` : "have been recorded"} with the termination report.</p>`;
    } else {
      icon.textContent = "✓"; icon.classList.remove("bad");
      $("#done-title").textContent = `Thank you, ${r.candidate.name}!`;
      $("#done-body").innerHTML = (CONFIG.showScoreToCandidate ? `<p class="big">${r.total} / ${r.maxTotal}</p><p>${r.percentage}% · <strong>${r.status}</strong> (provisional)</p>` : "") +
        `<p class="muted">${r.submitReason}. ${mailed ? `Your answers have been sent to ${esc(CONFIG.organizerName)} for evaluation.` : "Your answers have been recorded. The organizer can download the report from this screen."}</p>` +
        (r.swaps.length ? `<p class="viol small">Page swaps recorded: ${r.swaps.length}</p>` : "");
    }
    show("#screen-done");
  }

  /* ------------------------------------------------ PDF */
  function makePdf(r) {
    const doc = new MiniPDF({ margin: 40 });
    const GREEN = [0.1, 0.5, 0.25], RED = [0.75, 0.15, 0.1], AMBER = [0.7, 0.45, 0], GREY = [0.4, 0.42, 0.46];
    const T = (t, size, style, color) => doc.text(t, size, style, color);
    T(`${CONFIG.organizerName} - ${CONFIG.testTitle} - Result`, 17, "bold"); doc.gap(4);
    T(`Candidate: ${r.candidate.name}   ${r.candidate.email ? "(" + r.candidate.email + ")" : ""}`, 11);
    T(`Batch / Class: ${r.candidate.batch || "-"}`, 11);
    T(`Paper: ${r.paper}   (layout seed ${r.seed})`, 11);
    T(`Started: ${new Date(r.startedAt).toLocaleString()}    Submitted: ${new Date(r.submittedAt).toLocaleString()}`, 10);
    T(`Time used: ${r.timeTaken} (limit ${r.timeLimit})`, 10); doc.rule();
    T("SUMMARY", 13, "bold");
    SECTION_ORDER.forEach(k => T(`Section ${SECTION_LETTER[k]} - ${S[k].label}: ${r.totals[k]} / ${S[k].count * S[k].marks}`, 11));
    T(`TOTAL: ${r.total} / ${r.maxTotal}  =  ${r.percentage}%`, 12, "bold");
    T(`RESULT: ${r.status}  (pass mark ${CONFIG.passPercentage}%)`, 13, "bold", r.status === "PASS" ? GREEN : RED);
    T(`Submission: ${r.submitReason}`, 10, "normal", r.terminated ? RED : GREY);
    T(`Page swaps: ${r.swaps.length} (allowed ${P.maxPageSwaps})`, 10, r.swaps.length ? "bold" : "normal", r.swaps.length ? RED : GREY);
    r.swaps.forEach(s => T(`  - ${new Date(s.at).toLocaleTimeString()}  ${s.reason}`, 9, "normal", GREY));
    const blocked = r.events.filter(e => /blocked/i.test(e.what)).length;
    if (blocked) T(`Blocked copy/paste/shortcut attempts: ${blocked}`, 10, "bold", RED);
    T("Sections B-D are scored provisionally by matching key points from the answer key. Review the answers below.", 9, "italic", GREY);
    doc.gap(8);

    T(`SECTION A - MULTIPLE CHOICE (${S.mcq.marks} marks each)`, 13, "bold");
    r.sections.mcq.forEach(m => {
      doc.ensure(50);
      T(`${m.n}. [${m.topic}] ${m.q}`, 10, "bold");
      T(`Answer: ${m.chosen || "(not answered)"}`, 10, "normal", m.marks ? GREEN : RED);
      T(`Correct: ${m.correct}   Marks: ${m.marks}/${m.max}  - ${m.why}`, 9, "italic", GREY); doc.gap(3);
    });
    ["short", "coding", "scenario"].forEach(sec => {
      doc.gap(8); T(`SECTION ${SECTION_LETTER[sec]} - ${S[sec].label.toUpperCase()} (${S[sec].marks} marks each)`, 13, "bold");
      r.sections[sec].forEach(x => {
        doc.ensure(80);
        T(`${x.n}. ${x.title}`, 11, "bold");
        T(x.q, 9, "normal", GREY);
        T(`Marks: ${x.marks} / ${x.max}  (provisional - ${x.note})`, 10, "bold", x.marks >= x.max * 0.75 ? GREEN : x.marks >= x.max * 0.4 ? AMBER : RED);
        if (x.matched.length) T("Found: " + x.matched.join("; "), 9, "normal", GREEN);
        if (x.missed.length) T("Missing: " + x.missed.join("; "), 9, "normal", RED);
        T("Candidate's answer:", 9, "bold");
        if (sec === "coding") doc.mono(x.answer.trim() || "(blank)", 8, 70); else T(x.answer.trim() || "(blank)", 9);
        T("Model answer:", 9, "bold");
        if (sec === "coding") doc.mono(x.model, 7.5, 60); else T(x.model, 9, "italic", GREY);
        doc.gap(6);
      });
    });
    state.pdfBlob = doc.blob();
    state.pdfName = `Result_${r.candidate.name.replace(/[^\w]+/g, "_")}_Paper${r.paperId.toUpperCase()}.pdf`;
    state.pdfBase64 = E_attach() ? doc.base64() : null;
  }
  const E_attach = () => CONFIG.emailjs && CONFIG.emailjs.attachPdf;
  function downloadPdf() { if (!state.pdfBlob) return; const a = document.createElement("a"); a.href = URL.createObjectURL(state.pdfBlob); a.download = state.pdfName; a.click(); }

  /* ------------------------------------------------ Email */
  function clip(s, n) { s = String(s || "").trim(); return s.length > n ? s.slice(0, n) + " …[truncated]" : s; }
  async function sendEmail(r) {
    const E = CONFIG.emailjs;
    if (!E.enabled || !window.emailjs || !E.publicKey || E.publicKey.startsWith("YOUR_")) return { ok: false, error: "EmailJS not configured (see config.js)" };
    try {
      emailjs.init({ publicKey: E.publicKey });
      const head = [
        `Candidate: ${r.candidate.name}`, `Email: ${r.candidate.email || "-"}`, `Batch / Class: ${r.candidate.batch || "-"}`,
        `Paper: ${r.paper}`, `Started: ${new Date(r.startedAt).toLocaleString()}`, `Submitted: ${new Date(r.submittedAt).toLocaleString()}`,
        `Time used: ${r.timeTaken} (limit ${r.timeLimit})`, "",
        ...SECTION_ORDER.map(k => `Section ${SECTION_LETTER[k]} ${S[k].label}: ${r.totals[k]}/${S[k].count * S[k].marks}`),
        `TOTAL SCORE: ${r.total}/${r.maxTotal} = ${r.percentage}%`,
        `RESULT: ${r.status} (pass mark ${CONFIG.passPercentage}%)`, "",
        `Submission: ${r.submitReason}`,
        `Page swaps: ${r.swaps.length} (allowed ${P.maxPageSwaps})${r.swaps.length ? " – " + r.swaps.map(s => new Date(s.at).toLocaleTimeString() + " " + s.reason).join("; ") : ""}`,
        `Blocked copy/paste/shortcut attempts: ${r.events.filter(e => /blocked/i.test(e.what)).length}`,
        "Sections B–D are provisional (key-point matching) – please review the answers below.", ""
      ].join("\n");
      let rows = "SECTION A – MULTIPLE CHOICE\n" + r.sections.mcq.map(m => `${m.n}: ${m.marks}/${m.max}  (chosen: ${m.chosen || "-"} | correct: ${m.correct})`).join("\n");
      ["short", "coding", "scenario"].forEach(sec => {
        rows += `\n\nSECTION ${SECTION_LETTER[sec]} – ${S[sec].label.toUpperCase()}\n` + r.sections[sec].map(x =>
          `${x.n} ${x.title}: ${x.marks}/${x.max} (${x.note})${x.missed.length ? "\n  Missing: " + x.missed.join("; ") : ""}\n  Answer:\n${clip(x.answer, sec === "coding" ? 2500 : 900) || "(blank)"}\n`).join("\n");
      });
      if (rows.length > 42000) rows = rows.slice(0, 42000) + "\n…[truncated – download the PDF from the organizer view]";
      const params = {
        to_email: CONFIG.organizerEmail, candidate_name: r.candidate.name, candidate_email: r.candidate.email || "-",
        candidate_batch: r.candidate.batch || "-", batch: r.candidate.batch || "-",
        time_taken: r.timeTaken, time_limit: r.timeLimit, started_at: new Date(r.startedAt).toLocaleString(),
        score: `${r.total}/${r.maxTotal}`, name: r.candidate.name, email: r.candidate.email || "-",
        to_name: CONFIG.organizerName, from_name: r.candidate.name, user_name: r.candidate.name,
        student_name: r.candidate.name, full_name: r.candidate.name, candidate: r.candidate.name,
        title: `${r.candidate.name} - ${r.paper} - ${r.status} (${r.percentage}%)`,
        subject: `${CONFIG.testTitle}: ${r.candidate.name} - ${r.paper} - ${r.status}`,
        reply_to: r.candidate.email || CONFIG.organizerEmail, time: new Date(r.submittedAt).toLocaleString(),
        message: head + "\n" + rows,
        paper: r.paper, language: "Salesforce (Apex / LWC)", submitted_at: new Date(r.submittedAt).toLocaleString(),
        mcq_total: `${r.totals.mcq}/${S.mcq.count * S.mcq.marks}`, coding_total: `${r.totals.coding}/${S.coding.count * S.coding.marks}`,
        total: `${r.total}/${r.maxTotal}`, percentage: r.percentage + "%", status: r.status,
        breakdown: rows, pdf_name: state.pdfName
      };
      if (E.attachPdf && state.pdfBase64) params.pdf_base64 = "data:application/pdf;base64," + state.pdfBase64;
      await emailjs.send(E.serviceId, E.templateId, params);
      return { ok: true };
    } catch (e) { return { ok: false, error: (e && (e.text || e.message)) || String(e) }; }
  }

  /* ------------------------------------------------ Organizer views */
  $("#btn-organizer").addEventListener("click", () => {
    const pass = prompt("Organizer passcode:"); if (pass !== CONFIG.organizerPasscode) { if (pass !== null) alert("Incorrect passcode."); return; }
    renderResult(state.result); show("#screen-result");
  });
  $("#btn-download-pdf").addEventListener("click", downloadPdf);
  $("#btn-resend").addEventListener("click", async () => { $("#btn-resend").disabled = true; const m = await sendEmail(state.result); alert(m.ok ? "Email sent to " + CONFIG.organizerEmail : "Email failed: " + m.error); $("#btn-resend").disabled = false; });
  $("#btn-print").addEventListener("click", () => window.print());

  function renderResult(r) {
    const cls = (x) => x.marks >= x.max * 0.75 ? "ok" : x.marks >= x.max * 0.4 ? "mid" : "bad";
    $("#result-body").innerHTML = `
      <div class="summary ${r.status === "PASS" ? "pass" : "fail"}">
        <div><div class="big">${r.total} <span class="muted">/ ${r.maxTotal}</span></div><div>${r.percentage}% · <strong>${r.status}</strong> (pass mark ${CONFIG.passPercentage}%)</div>
          <div class="small">${SECTION_ORDER.map(k => `${SECTION_LETTER[k]}: ${r.totals[k]}/${S[k].count * S[k].marks}`).join(" · ")}</div></div>
        <div class="small"><div><strong>${esc(r.candidate.name)}</strong> ${esc(r.candidate.email || "")}</div><div>Batch / Class: <strong>${esc(r.candidate.batch || "-")}</strong></div>
          <div>${esc(r.paper)}</div><div>Submitted ${new Date(r.submittedAt).toLocaleString()} · time used ${esc(r.timeTaken)}</div>
          <div>Email: ${esc(r.emailStatus || "")}</div><div class="${r.terminated ? "viol" : ""}">Submission: ${esc(r.submitReason)}</div>
          <div class="${r.swaps.length ? "viol" : ""}">Page swaps: ${r.swaps.length}${r.swaps.length ? " – " + r.swaps.map(s => new Date(s.at).toLocaleTimeString() + " " + esc(s.reason)).join("; ") : ""}</div></div>
      </div>
      <p class="muted small">Sections B–D are provisional (key-point matching against the answer key). Review each answer below.</p>
      <h3>Section A – Multiple choice</h3>
      <table class="res-table"><thead><tr><th>#</th><th>Question</th><th>Candidate</th><th>Correct</th><th>Marks</th></tr></thead><tbody>
      ${r.sections.mcq.map(m => `<tr class="${m.marks ? "ok" : "bad"}"><td>${m.n}<div class="muted small">${esc(m.topic)}</div></td><td>${esc(m.q)}</td><td>${esc(m.chosen || "—")}</td><td>${esc(m.correct)}<div class="muted small">${esc(m.why)}</div></td><td>${m.marks}/${m.max}</td></tr>`).join("")}
      </tbody></table>
      ${["short", "coding", "scenario"].map(sec => `<h3>Section ${SECTION_LETTER[sec]} – ${esc(S[sec].label)}</h3>` + r.sections[sec].map(x => `
        <div class="card res-item ${cls(x)}"><div class="q-head"><strong>${x.n}. ${esc(x.title)}</strong><span class="q-marks">${x.marks}/${x.max}</span></div>
        <p class="small muted">${esc(x.q)}</p>
        <div class="kp">${x.matched.map(k => `<div class="y">✓ ${esc(k)}</div>`).join("")}${x.missed.map(k => `<div class="n">✕ ${esc(k)}</div>`).join("")}</div>
        <details open><summary>Candidate's answer</summary><pre class="codeblock">${esc(x.answer.trim() || "(blank)")}</pre></details>
        <details><summary>Model answer</summary><pre class="codeblock">${esc(x.model)}</pre></details></div>`).join("")).join("")}`;
  }

  function renderOrganizerHome() {
    const pass = prompt("Organizer passcode:"); if (pass !== CONFIG.organizerPasscode) { location.search = ""; return; }
    const keys = Object.keys(localStorage).filter(k => k.startsWith("sfeval-result-")).sort().reverse();
    const list = $("#stored-list"); list.innerHTML = keys.length ? "" : "<p class='muted'>No results stored on this device yet.</p>";
    keys.forEach(k => {
      const r = JSON.parse(localStorage.getItem(k)); const row = document.createElement("div"); row.className = "paper-row";
      const tag = r.status === "PASS" ? "tag-pass" : r.status === "TERMINATED" ? "tag-term" : "tag-fail";
      row.innerHTML = `<div><strong>${esc(r.candidate.name)}</strong> · ${esc(r.paper)} · ${r.total}/${r.maxTotal} (${r.percentage}%) <span class="${tag}">${r.status}</span><div class="muted small">${new Date(r.submittedAt).toLocaleString()}</div></div><div class="row-actions"><button class="btn btn-secondary">View</button></div>`;
      row.querySelector("button").onclick = () => { state.result = r; state.paperId = r.paperId; try { makePdf(r); } catch (e) { } renderResult(r); show("#screen-result"); };
      list.appendChild(row);
    });
    show("#screen-organizer");
  }

  init();
})();
