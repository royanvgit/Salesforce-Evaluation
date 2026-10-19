/* Provisional rubric scoring for written answers (short answer, coding, scenario).
   Each rubric point is matched against the candidate's answer; marks are summed,
   capped at the question's maximum and rounded to the nearest 0.5.
   These marks are PROVISIONAL – the report lists matched / missed points and the
   model answer so the organizer can review them. */
(function (root) {
  "use strict";
  function norm(s) { return String(s || "").replace(/\r/g, "").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').toLowerCase(); }
  function hit(re, text) { const r = new RegExp(re.source, re.flags.includes("i") ? re.flags : re.flags + "i"); return r.test(text); }
  function inOrder(list, text) {
    let pos = 0;
    for (const re of list) {
      const r = new RegExp(re.source, "gi"); r.lastIndex = pos; const m = r.exec(text);
      if (!m) return false; pos = m.index + 1;
    }
    return true;
  }
  function pointMatched(p, text) {
    if (p.any) return p.any.some(re => hit(re, text));
    if (p.all) return p.all.every(re => hit(re, text));
    if (p.order) return inOrder(p.order, text);
    return false;
  }
  /** opts: { max, minForAttempt } */
  function scoreAnswer(answer, points, opts) {
    const max = opts.max; const text = norm(answer); const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    if (!trimmed || trimmed.length < 12 || words < 3) return { marks: 0, matched: [], missed: points.map(p => p.k), note: trimmed ? "too short to evaluate" : "not answered", blank: !trimmed };
    const total = points.reduce((s, p) => s + p.w, 0) || 1;
    let got = 0; const matched = [], missed = [];
    points.forEach(p => { if (pointMatched(p, text)) { got += p.w; matched.push(p.k); } else missed.push(p.k); });
    let marks = Math.round((got / total * max) * 2) / 2;
    if (opts.minForAttempt && marks < opts.minForAttempt && /[{};]|\bclass\b|\btrigger\b|<template/.test(text)) marks = opts.minForAttempt;
    marks = Math.min(max, marks);
    return { marks, matched, missed, note: `${matched.length}/${points.length} key points found` };
  }
  root.Grader = { scoreAnswer };
  if (typeof module !== "undefined") module.exports = root.Grader;
})(typeof window !== "undefined" ? window : globalThis);
