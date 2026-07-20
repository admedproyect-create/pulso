import React, { useState, useEffect } from "react";

// ============================================================
//  PULSO v2 — Inteligencia de contenido para agencias
//  Interactivo + CTAs completos:
//  · Landing con planes, pasos y captura de leads
//  · Calendario editable (clic en cada publicación) + export CSV
//  · Ideas con IA real + copiar caption con un clic + programar
//  · WhatsApp flotante y auditoría gratis en todo el recorrido
// ============================================================

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;450;500;600&family=Space+Mono:wght@400;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

.pulso {
  --ink: #16161C;
  --paper: #FBFAF7;
  --card: #FFFFFF;
  --line: #E8E5DE;
  --muted: #6E6B78;
  --violet: #5B3DF5;
  --violet-soft: #EFEBFF;
  --coral: #FF4D6D;
  --teal: #00B596;
  --amber: #FFB02E;
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--ink);
  background: var(--paper);
  min-height: 100vh;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
.pulso *::selection { background: var(--violet); color: #fff; }

.wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; }

/* ---------- top bar ---------- */
.topbar { display:flex; align-items:center; justify-content:space-between; padding: 22px 0; border-bottom: 1px solid var(--line); gap:12px; }
.brand { display:flex; align-items:center; gap:11px; }
.brand-mark {
  width: 30px; height: 30px; border-radius: 9px; background: var(--ink);
  display:flex; align-items:center; justify-content:center; position:relative;
}
.brand-mark span { display:block; width:10px; height:10px; border-radius:50%; background: var(--violet); box-shadow: 0 0 0 3px rgba(91,61,245,.25); }
.brand-name { font-family:'Space Grotesk'; font-weight:700; font-size:19px; letter-spacing:-.02em; }
.brand-name b { color: var(--violet); }
.nav { display:flex; gap:4px; background:#F1EFEA; padding:4px; border-radius:11px; }
.nav button {
  font:inherit; font-size:13.5px; font-weight:500; border:0; cursor:pointer;
  padding:8px 15px; border-radius:8px; background:transparent; color:var(--muted);
}
.nav button.on { background:#fff; color:var(--ink); box-shadow:0 1px 3px rgba(0,0,0,.07); }
.top-cta { font:inherit; font-weight:600; font-size:13.5px; border:0; cursor:pointer; padding:10px 16px; border-radius:10px; background:var(--violet); color:#fff; white-space:nowrap; }
.top-cta:hover { background:#4b30d8; }

/* ---------- connect screen ---------- */
.hero { padding: 70px 0 40px; }
.hero h1 { font-family:'Space Grotesk'; font-weight:700; font-size: clamp(34px, 6vw, 56px); line-height:1.02; letter-spacing:-.035em; max-width:15ch; }
.hero h1 em { font-style:normal; color:var(--violet); }
.hero p { color:var(--muted); font-size:17px; max-width:46ch; margin-top:20px; }

.pillars { display:flex; gap:14px; margin-top:30px; flex-wrap:wrap; }
.pillar { display:flex; gap:11px; align-items:flex-start; background:var(--card); border:1px solid var(--line); border-radius:13px; padding:14px 16px; flex:1; min-width:200px; }
.pillar .pdot { width:10px; height:10px; border-radius:50%; margin-top:5px; flex-shrink:0; }
.pillar b { display:block; font-family:'Space Grotesk'; font-weight:600; font-size:14.5px; letter-spacing:-.01em; }
.pillar span { font-size:12.5px; color:var(--muted); }

.connect-box { margin-top:34px; max-width:520px; }
.field { display:flex; align-items:center; background:#fff; border:1.5px solid var(--line); border-radius:13px; padding:5px 5px 5px 16px; transition:border-color .15s; }
.field:focus-within { border-color:var(--violet); }
.field .at { font-family:'Space Mono'; color:var(--muted); font-size:16px; }
.field input { flex:1; border:0; outline:0; font:inherit; font-size:16px; padding:13px 8px; background:transparent; min-width:0; }
.field button {
  font:inherit; font-weight:600; font-size:14.5px; border:0; cursor:pointer; white-space:nowrap;
  padding:12px 20px; border-radius:9px; background:var(--ink); color:#fff;
}
.field button:hover { background:#000; }
.hint { font-size:13px; color:var(--muted); margin-top:14px; display:flex; gap:7px; align-items:flex-start; }
.hint svg { flex-shrink:0; margin-top:1px; }
.demo-link { font:inherit; background:none; border:0; color:var(--violet); font-weight:600; font-size:14px; cursor:pointer; margin-top:14px; padding:0; }
.demo-link:hover { text-decoration:underline; }

.trust { display:flex; gap:30px; margin-top:48px; flex-wrap:wrap; }
.trust .n { font-family:'Space Grotesk'; font-weight:700; font-size:24px; letter-spacing:-.02em; }
.trust .l { font-size:13px; color:var(--muted); }

/* ---------- how it works ---------- */
.steps { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-top:56px; }
.step { background:var(--card); border:1px solid var(--line); border-radius:15px; padding:20px; }
.step .sn { font-family:'Space Mono'; font-size:11.5px; letter-spacing:.12em; color:var(--violet); }
.step h4 { font-family:'Space Grotesk'; font-weight:600; font-size:16px; margin-top:9px; letter-spacing:-.01em; }
.step p { font-size:13.5px; color:var(--muted); margin-top:6px; }

/* ---------- pricing ---------- */
.pricing { margin-top:70px; }
.pricing-h { text-align:center; }
.pricing-h h2 { font-family:'Space Grotesk'; font-weight:700; font-size:32px; letter-spacing:-.03em; }
.pricing-h p { color:var(--muted); margin-top:8px; font-size:15px; }
.plans { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:32px; }
.plan { background:var(--card); border:1px solid var(--line); border-radius:18px; padding:24px; display:flex; flex-direction:column; position:relative; }
.plan.featured { border-color:var(--violet); box-shadow:0 8px 30px rgba(91,61,245,.12); }
.plan .badge { position:absolute; top:-11px; left:50%; transform:translateX(-50%); background:var(--violet); color:#fff; font-size:10.5px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; padding:4px 12px; border-radius:20px; white-space:nowrap; }
.plan h3 { font-family:'Space Grotesk'; font-weight:600; font-size:18px; }
.plan .price { font-family:'Space Grotesk'; font-weight:700; font-size:34px; letter-spacing:-.03em; margin-top:10px; }
.plan .price em { font-style:normal; font-size:14px; color:var(--muted); font-weight:500; }
.plan ul { list-style:none; margin:18px 0 22px; display:flex; flex-direction:column; gap:9px; flex:1; }
.plan li { font-size:13.5px; color:#3a3845; display:flex; gap:8px; }
.plan li::before { content:"✓"; color:var(--teal); font-weight:700; flex-shrink:0; }
.plan > button { font:inherit; font-weight:600; font-size:14.5px; cursor:pointer; border:1.5px solid var(--ink); background:transparent; color:var(--ink); border-radius:11px; padding:12px; }
.plan > button:hover { background:var(--ink); color:#fff; }
.plan.featured > button { background:var(--violet); border-color:var(--violet); color:#fff; }
.plan.featured > button:hover { background:#4b30d8; }

/* ---------- CTA band ---------- */
.ctaband { margin-top:64px; background:var(--ink); border-radius:22px; padding:38px; color:#fff; display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap; }
.ctaband h2 { font-family:'Space Grotesk'; font-weight:700; font-size:27px; letter-spacing:-.02em; max-width:22ch; }
.ctaband h2 em { font-style:normal; color:#A892FA; }
.ctaband p { color:rgba(255,255,255,.65); font-size:14.5px; margin-top:8px; max-width:46ch; }
.ctaband .big { font:inherit; font-weight:700; font-size:15.5px; cursor:pointer; border:0; background:var(--violet); color:#fff; border-radius:13px; padding:16px 26px; white-space:nowrap; }
.ctaband .big:hover { background:#6d51ff; }

/* ---------- lead / edit modal ---------- */
.overlay { position:fixed; inset:0; background:rgba(22,22,28,.55); display:flex; align-items:center; justify-content:center; z-index:50; padding:20px; }
.modal { background:#fff; border-radius:20px; padding:28px; width:100%; max-width:440px; position:relative; max-height:90vh; overflow-y:auto; }
.modal .close { position:absolute; top:14px; right:16px; border:0; background:transparent; font-size:20px; cursor:pointer; color:var(--muted); line-height:1; }
.modal .close:hover { color:var(--ink); }
.modal h3 { font-family:'Space Grotesk'; font-weight:700; font-size:22px; letter-spacing:-.02em; padding-right:22px; }
.modal .sub { font-size:13.5px; color:var(--muted); margin-top:6px; }
.modal .plan-tag { display:inline-block; font-size:12px; font-weight:600; background:var(--violet-soft); color:var(--violet); padding:5px 11px; border-radius:8px; margin-top:12px; }
.modal .form { margin-top:18px; display:flex; flex-direction:column; gap:12px; }
.modal label { font-size:13px; font-weight:600; display:block; }
.modal label span { color:var(--muted); font-weight:400; }
.modal input, .modal select { width:100%; font:inherit; font-size:15px; padding:12px 13px; border:1.5px solid var(--line); border-radius:10px; outline:0; margin-top:6px; background:#fff; }
.modal input:focus, .modal select:focus { border-color:var(--violet); }
.row2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.modal .send { font:inherit; font-weight:600; font-size:15px; cursor:pointer; border:0; background:var(--violet); color:#fff; border-radius:11px; padding:14px; margin-top:6px; }
.modal .send:hover { background:#4b30d8; }
.modal .send:disabled { opacity:.5; cursor:default; }
.modal .danger { font:inherit; font-weight:600; font-size:13.5px; cursor:pointer; border:0; background:transparent; color:var(--coral); padding:8px; }
.modal .danger:hover { text-decoration:underline; }
.sent { text-align:center; padding:18px 0 6px; }
.sent .big-check { width:54px; height:54px; border-radius:50%; background:#E5F8F4; color:var(--teal); font-size:26px; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; }
.sent h4 { font-family:'Space Grotesk'; font-weight:700; font-size:19px; }
.sent p { font-size:13.5px; color:var(--muted); margin-top:8px; }

/* ---------- WhatsApp float ---------- */
.wa-float { position:fixed; bottom:22px; right:22px; z-index:40; width:56px; height:56px; border-radius:50%; background:#25D366; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 20px rgba(37,211,102,.4); text-decoration:none; transition:transform .12s; }
.wa-float:hover { transform:scale(1.07); }
.wa-float svg { width:28px; height:28px; fill:#fff; }

/* ---------- dashboard ---------- */
.demo-flag { display:inline-flex; align-items:center; gap:7px; background:var(--amber); color:#3a2600; font-size:12px; font-weight:600; padding:5px 11px; border-radius:20px; margin: 26px 0 4px; }
.demo-flag b { font-weight:700; }

.profile { display:flex; align-items:center; gap:16px; padding: 14px 0 30px; }
.avatar { width:58px; height:58px; border-radius:50%; background:linear-gradient(135deg,var(--violet),var(--coral)); flex-shrink:0; display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Space Grotesk';font-weight:700;font-size:22px; }
.profile h2 { font-family:'Space Grotesk'; font-weight:600; font-size:22px; letter-spacing:-.02em; }
.profile .handle { color:var(--muted); font-size:14px; font-family:'Space Mono'; }

.section-h { font-family:'Space Grotesk'; font-weight:600; font-size:13px; letter-spacing:.06em; text-transform:uppercase; color:var(--muted); margin: 34px 0 14px; }

.kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
.kpi { background:var(--card); border:1px solid var(--line); border-radius:15px; padding:18px; }
.kpi .lab { font-size:12.5px; color:var(--muted); font-weight:500; }
.kpi .val { font-family:'Space Grotesk'; font-weight:700; font-size:30px; letter-spacing:-.03em; margin-top:8px; }
.kpi .chg { font-size:12.5px; font-weight:600; margin-top:5px; display:inline-flex; gap:4px; align-items:center; }
.up { color:var(--teal); } .down { color:var(--coral); }

.grid-2 { display:grid; grid-template-columns: 1.05fr .95fr; gap:18px; align-items:start; }
.panel { background:var(--card); border:1px solid var(--line); border-radius:18px; padding:22px; }
.panel-h { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px; }
.panel-h h3 { font-family:'Space Grotesk'; font-weight:600; font-size:17px; letter-spacing:-.01em; }
.panel-h .tag { font-size:12px; color:var(--muted); font-family:'Space Mono'; }
.panel-sub { font-size:13px; color:var(--muted); margin-bottom:18px; }

.clock-wrap { display:flex; justify-content:center; padding:6px 0 4px; }
.windows { margin-top:10px; display:flex; flex-direction:column; gap:9px; }
.window { display:flex; align-items:center; gap:12px; padding:11px 13px; border-radius:11px; background:var(--violet-soft); }
.window .rank { font-family:'Space Grotesk'; font-weight:700; font-size:13px; color:var(--violet); width:18px; }
.window .time { font-family:'Space Mono'; font-weight:700; font-size:14px; }
.window .meta { font-size:12.5px; color:var(--muted); margin-left:auto; }

.daybars { display:flex; flex-direction:column; gap:11px; margin-top:2px; }
.daybar { display:flex; align-items:center; gap:12px; }
.daybar .d { width:38px; font-size:12.5px; color:var(--muted); font-family:'Space Mono'; }
.daybar .track { flex:1; height:9px; background:#F0EEE9; border-radius:6px; overflow:hidden; }
.daybar .fill { height:100%; border-radius:6px; background:var(--violet); }
.daybar .pct { width:34px; text-align:right; font-size:12px; font-family:'Space Mono'; color:var(--ink); }

.posts { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
.post { border:1px solid var(--line); border-radius:13px; overflow:hidden; background:#fff; }
.post .thumb { height:78px; display:flex;align-items:flex-end; padding:8px; }
.post .type { font-size:10px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; background:rgba(0,0,0,.55); color:#fff; padding:3px 7px; border-radius:5px; }
.post .body { padding:11px 12px 13px; }
.post .eng { font-family:'Space Grotesk'; font-weight:700; font-size:17px; }
.post .sub { font-size:11.5px; color:var(--muted); margin-top:2px; }

.score-ring { display:flex; align-items:center; gap:22px; }
.audit-list { margin-top:20px; display:flex; flex-direction:column; gap:13px; }
.audit-item { display:flex; gap:13px; align-items:flex-start; }
.audit-dot { width:9px;height:9px;border-radius:50%; margin-top:6px; flex-shrink:0; }
.audit-item h4 { font-size:14.5px; font-weight:600; }
.audit-item p { font-size:13px; color:var(--muted); margin-top:2px; }

/* ---------- content generator ---------- */
.gen-head { padding: 38px 0 8px; max-width:60ch; }
.gen-head h1 { font-family:'Space Grotesk'; font-weight:700; font-size:34px; letter-spacing:-.03em; }
.gen-head p { color:var(--muted); font-size:16px; margin-top:12px; }

.niche-row { display:flex; flex-wrap:wrap; gap:9px; margin:22px 0 16px; }
.chip { font:inherit; font-size:13.5px; font-weight:500; border:1.5px solid var(--line); background:#fff; cursor:pointer; padding:9px 15px; border-radius:30px; color:var(--ink); transition:all .12s; }
.chip:hover { border-color:var(--violet); }
.chip.on { background:var(--ink); color:#fff; border-color:var(--ink); }

.gen-controls { display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end; }
.gen-controls .grp { flex:1; min-width:220px; }
.gen-controls label { display:block; font-size:13px; font-weight:600; margin-bottom:7px; }
.gen-controls input, .gen-controls select { width:100%; font:inherit; font-size:15px; padding:13px 14px; border:1.5px solid var(--line); border-radius:11px; background:#fff; outline:0; }
.gen-controls input:focus, .gen-controls select:focus { border-color:var(--violet); }
.gen-btn { font:inherit; font-weight:600; font-size:15px; border:0; cursor:pointer; padding:14px 26px; border-radius:11px; background:var(--violet); color:#fff; white-space:nowrap; }
.gen-btn:hover { background:#4b30d8; }
.gen-btn:disabled { opacity:.5; cursor:default; }

.err { background:#FFE9ED; color:#a11231; font-size:13.5px; padding:13px 16px; border-radius:11px; margin-top:18px; }

.ideas { display:flex; flex-direction:column; gap:16px; margin-top:26px; }
.idea { background:var(--card); border:1px solid var(--line); border-radius:18px; padding:22px; }
.idea-top { display:flex; gap:12px; align-items:flex-start; }
.idea-num { font-family:'Space Grotesk'; font-weight:700; font-size:14px; color:#fff; background:var(--violet); width:30px; height:30px; border-radius:9px; display:flex;align-items:center;justify-content:center; flex-shrink:0; }
.idea h3 { font-family:'Space Grotesk'; font-weight:600; font-size:19px; letter-spacing:-.015em; }
.fmt-badge { display:inline-block; font-size:11px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; padding:4px 9px; border-radius:6px; background:var(--violet-soft); color:var(--violet); margin-top:5px; }
.idea .hook { font-size:15px; margin-top:14px; font-weight:500; }
.idea .hook-lab, .idea .cap-lab { font-family:'Space Mono'; font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); }
.idea .cap { font-size:14px; color:#3a3845; margin-top:6px; white-space:pre-wrap; }
.cap-block { margin-top:16px; padding:14px; background:#FAF9F6; border-radius:11px; border:1px solid var(--line); }
.tags { margin-top:13px; display:flex; flex-wrap:wrap; gap:6px; }
.tag-pill { font-size:12px; font-family:'Space Mono'; color:var(--violet); background:var(--violet-soft); padding:4px 9px; border-radius:6px; }
.cap-actions { display:flex; gap:8px; margin-top:13px; flex-wrap:wrap; }
.copy-btn { font:inherit; font-weight:600; font-size:13px; cursor:pointer; border:1.5px solid var(--line); background:#fff; color:var(--ink); border-radius:9px; padding:8px 14px; }
.copy-btn:hover { border-color:var(--violet); color:var(--violet); }
.copy-btn.ok { border-color:var(--teal); color:var(--teal); background:#E5F8F4; }
.platforms { display:flex; gap:7px; margin-top:14px; flex-wrap:wrap; }
.plat { font-size:11.5px; font-weight:600; padding:5px 11px; border-radius:7px; border:1px solid var(--line); color:var(--muted); }
.why { margin-top:14px; padding-top:14px; border-top:1px dashed var(--line); font-size:13px; color:var(--muted); display:flex; gap:8px; }
.why b { color:var(--ink); font-weight:600; }
.idea-actions { margin-top:16px; }
.sched-btn { font:inherit; font-weight:600; font-size:14px; cursor:pointer; border:1.5px solid var(--violet); background:var(--violet-soft); color:var(--violet); border-radius:11px; padding:11px 18px; }
.sched-btn:hover { background:var(--violet); color:#fff; }
.sched-ok { display:flex; align-items:center; gap:14px; flex-wrap:wrap; background:#E5F8F4; border-radius:11px; padding:12px 16px; font-size:14px; color:#04695a; }
.sched-ok b { color:var(--teal); font-weight:700; }
.sched-ok button { font:inherit; font-weight:600; font-size:13.5px; cursor:pointer; border:0; background:transparent; color:var(--violet); margin-left:auto; padding:0; }
.sched-ok button:hover { text-decoration:underline; }

.skel { background:linear-gradient(90deg,#F1EFEA 25%,#E8E5DE 50%,#F1EFEA 75%); background-size:200% 100%; animation:sh 1.3s infinite; border-radius:8px; }
@keyframes sh { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ---------- calendar ---------- */
.cal-head { padding: 38px 0 6px; }
.cal-head h1 { font-family:'Space Grotesk'; font-weight:700; font-size:34px; letter-spacing:-.03em; }
.cal-head p { color:var(--muted); font-size:16px; margin-top:12px; max-width:58ch; }
.cal-summary { display:flex; gap:26px; margin-top:20px; flex-wrap:wrap; align-items:flex-end; }
.cal-stat .n { font-family:'Space Grotesk'; font-weight:700; font-size:26px; letter-spacing:-.02em; }
.cal-stat .n em { font-style:normal; color:var(--muted); font-size:16px; font-weight:500; }
.cal-stat .n.viral { color:var(--violet); }
.cal-stat .l { font-size:12.5px; color:var(--muted); }
.viral-banner { display:flex; align-items:center; gap:13px; background:var(--violet); color:#fff; border-radius:14px; padding:15px 18px; margin-top:22px; }
.viral-banner .ico { font-size:20px; }
.viral-banner h4 { font-family:'Space Grotesk'; font-weight:600; font-size:15px; }
.viral-banner p { font-size:13px; opacity:.85; margin-top:2px; }
.cal-toolbar { display:flex; gap:10px; margin:20px 0 14px; flex-wrap:wrap; }
.cal-toolbar button { font:inherit; font-size:13.5px; font-weight:600; cursor:pointer; padding:10px 16px; border-radius:10px; border:1.5px solid var(--line); background:#fff; color:var(--ink); }
.cal-toolbar button.primary { background:var(--violet); border-color:var(--violet); color:#fff; }
.cal-toolbar button.primary:hover { background:#4b30d8; }
.cal-toolbar button:hover { border-color:var(--violet); }
.week { display:grid; grid-template-columns:repeat(7,minmax(146px,1fr)); gap:10px; overflow-x:auto; padding-bottom:8px; }
.daycol { background:var(--card); border:1px solid var(--line); border-radius:15px; padding:13px 12px; display:flex; flex-direction:column; min-height:230px; }
.daycol.top { border-color:var(--violet); box-shadow:0 0 0 2px var(--violet-soft); }
.daycol-h { display:flex; align-items:center; justify-content:space-between; }
.daycol-h .dn { font-family:'Space Grotesk'; font-weight:600; font-size:14.5px; }
.daycol-h .flame { font-size:13px; }
.day-eng { display:flex; align-items:center; gap:6px; margin-top:6px; }
.day-eng .track { flex:1; height:5px; background:#F0EEE9; border-radius:4px; overflow:hidden; }
.day-eng .fill { height:100%; background:var(--violet); border-radius:4px; }
.day-eng .v { font-size:10.5px; font-family:'Space Mono'; color:var(--muted); }
.opt-chip { font-size:10.5px; font-family:'Space Mono'; color:var(--teal); background:#E5F8F4; border-radius:6px; padding:3px 7px; margin-top:10px; align-self:flex-start; }
.evts { display:flex; flex-direction:column; gap:7px; margin-top:11px; flex:1; }
.evt { border-radius:10px; padding:9px 10px; position:relative; border:1px solid var(--line); cursor:pointer; transition:transform .1s; }
.evt:hover { transform:translateY(-1px); }
.evt.peak { box-shadow:0 0 0 2px var(--violet); border-color:transparent; }
.evt .efmt { font-size:9.5px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; color:#fff; padding:2px 6px; border-radius:4px; display:inline-block; }
.evt .etime { font-family:'Space Mono'; font-weight:700; font-size:12px; margin-top:6px; }
.evt .etitle { font-size:11.5px; color:var(--ink); margin-top:3px; line-height:1.3; }
.evt .viral-tag { font-size:9px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; color:var(--violet); margin-top:5px; display:flex; align-items:center; gap:3px; }
.evt .edit-hint { font-size:9px; color:var(--muted); margin-top:4px; opacity:0; transition:opacity .1s; }
.evt:hover .edit-hint { opacity:1; }
.evt .rm { position:absolute; top:7px; right:7px; cursor:pointer; border:0; background:transparent; color:var(--muted); font-size:14px; line-height:1; padding:2px; }
.evt .rm:hover { color:var(--coral); }
.evt-add { margin-top:8px; font:inherit; font-size:12px; font-weight:600; cursor:pointer; border:1.5px dashed var(--line); background:transparent; color:var(--muted); border-radius:9px; padding:8px; width:100%; }
.evt-add:hover { border-color:var(--violet); color:var(--violet); }
.legend { display:flex; gap:16px; margin-top:18px; flex-wrap:wrap; }
.legend span { display:flex; align-items:center; gap:6px; font-size:12.5px; color:var(--muted); }
.legend i { width:11px; height:11px; border-radius:3px; display:inline-block; }

/* ---------- connect hub ---------- */
.connect-banner { display:flex; align-items:center; justify-content:space-between; gap:12px; border-radius:13px; padding:13px 16px; margin-top:22px; font-size:14px; font-weight:500; }
.connect-banner.ok { background:#E5F8F4; color:#04695a; }
.connect-banner.bad { background:#FFE9ED; color:#a11231; }
.connect-banner button { border:0; background:transparent; font-size:18px; line-height:1; cursor:pointer; color:inherit; opacity:.6; }
.connect-banner button:hover { opacity:1; }
.connect-cta { margin-top:32px; max-width:520px; }
.ig-connect { display:inline-flex; align-items:center; gap:10px; font:inherit; font-weight:600; font-size:16px; cursor:pointer; border:0; border-radius:14px; padding:15px 26px; color:#fff; background:linear-gradient(95deg,#5B3DF5,#C13584 55%,#FF4D6D); box-shadow:0 8px 24px rgba(193,53,132,.28); }
.ig-connect:hover { filter:brightness(1.06); }
.ig-connect svg { flex-shrink:0; }
.connect-cta .hint { margin-top:14px; }

.clients-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px; }
.client-card { display:flex; align-items:center; gap:13px; text-align:left; font:inherit; cursor:pointer; background:var(--card); border:1px solid var(--line); border-radius:15px; padding:15px 16px; transition:border-color .12s, transform .1s; }
.client-card:hover { border-color:var(--violet); transform:translateY(-2px); }
.client-av { width:46px; height:46px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; color:#fff; font-family:'Space Grotesk'; font-weight:700; font-size:16px; }
.client-info { min-width:0; flex:1; }
.client-info b { display:block; font-family:'Space Grotesk'; font-weight:600; font-size:15px; letter-spacing:-.01em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.client-info .ch { font-family:'Space Mono'; font-size:12px; color:var(--muted); }
.client-meta { text-align:right; flex-shrink:0; }
.client-meta .cf { display:block; font-family:'Space Grotesk'; font-weight:700; font-size:15px; }
.client-meta .cl2 { font-size:10.5px; color:var(--muted); }
.client-meta .just { font-size:10.5px; font-weight:700; color:var(--teal); background:#E5F8F4; padding:3px 8px; border-radius:20px; }
.client-card.add { border-style:dashed; color:var(--muted); }
.client-card.add:hover { color:var(--violet); }
.add-plus { width:46px; height:46px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:24px; background:#F1EFEA; color:var(--violet); }

.competitor { max-width:560px; }
.competitor .field { margin-bottom:12px; }

.comp-badge { display:inline-block; font-size:11px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; color:var(--violet); background:var(--violet-soft); padding:3px 9px; border-radius:6px; vertical-align:middle; margin-left:6px; }

.panel.locked { text-align:center; padding:36px 24px; }
.panel.locked .lock-ico { font-size:30px; }
.panel.locked h3 { font-family:'Space Grotesk'; font-weight:600; font-size:19px; margin-top:10px; }
.panel.locked p { color:var(--muted); font-size:14px; margin:8px auto 0; max-width:52ch; }
.panel.locked > div { justify-content:center; }

/* connect modal steps */
.connect-steps { margin-top:18px; display:flex; flex-direction:column; gap:14px; }
.cstep { display:flex; gap:13px; align-items:flex-start; }
.cstep span { flex-shrink:0; width:26px; height:26px; border-radius:8px; background:var(--violet); color:#fff; font-family:'Space Grotesk'; font-weight:700; font-size:13px; display:flex; align-items:center; justify-content:center; }
.cstep b { font-size:14.5px; font-weight:600; }
.cstep p { font-size:13px; color:var(--muted); margin-top:2px; }
.modal-note { font-size:12.5px; color:var(--muted); background:#FAF9F6; border:1px solid var(--line); border-radius:11px; padding:12px 14px; margin-top:18px; }
.modal-note + .send { margin-top:14px; }

.foot { text-align:center; color:var(--muted); font-size:12.5px; padding:50px 0 36px; }

/* marca en barra superior */
.brand-mark { background: linear-gradient(135deg,#5B3DF5,#FF4D6D) !important; }
.brand-mark span { background:#fff !important; box-shadow:0 0 0 3px rgba(255,255,255,.35) !important; }
.brand-lockup { line-height:1.05; }
.brand-name { font-family:'Space Grotesk'; font-weight:700; font-size:20px; letter-spacing:-.02em; background:linear-gradient(100deg,#5B3DF5,#C13584,#FF4D6D); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.brand-tag { font-family:'Space Mono'; font-size:10.5px; letter-spacing:.02em; color:var(--muted); margin-top:1px; }
@media (max-width:560px){ .brand-tag { display:none; } }

/* ===================== auditoría instantánea ===================== */
@keyframes segIn { from { opacity:0; transform: scale(.86); } to { opacity:1; transform:none; } }
.seg-in { animation: segIn .45s cubic-bezier(.2,.8,.3,1) both; transform-origin: 115px 115px; }
@keyframes pulseDot { 0%,100%{ box-shadow:0 0 0 0 rgba(0,181,150,.55) } 70%{ box-shadow:0 0 0 7px rgba(0,181,150,0) } }
.dot-live { width:7px; height:7px; border-radius:50%; background:var(--teal); display:inline-block; animation:pulseDot 2s infinite; }

.aud-box { margin-top:28px; max-width:560px; }
.aud-box.open { background:var(--card); border:1.5px solid var(--line); border-radius:18px; padding:20px; max-width:620px; box-shadow:0 14px 40px rgba(22,22,28,.07); }
.aud-field { display:flex; align-items:center; background:#fff; border:2px solid var(--violet); border-radius:14px; padding:5px 5px 5px 16px; box-shadow:0 10px 30px rgba(91,61,245,.16); }
.aud-field .at { font-family:'Space Mono'; color:var(--muted); font-size:17px; }
.aud-field input { flex:1; border:0; outline:0; font:inherit; font-size:16.5px; padding:14px 8px; background:transparent; min-width:0; }
.aud-field button { font:inherit; font-weight:700; font-size:15px; border:0; cursor:pointer; white-space:nowrap; padding:13px 22px; border-radius:10px; background:var(--violet); color:#fff; }
.aud-field button:hover { background:#4b30d8; }
.aud-field button:disabled { background:#C9C4D6; cursor:default; }
.aud-note { display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--muted); margin-top:12px; font-weight:500; }

.aud-head { display:flex; align-items:center; gap:10px; margin-bottom:4px; }
.aud-handle { font-family:'Space Mono'; font-weight:700; font-size:14px; }
.aud-back { margin-left:auto; font:inherit; font-size:12.5px; border:0; background:transparent; color:var(--violet); cursor:pointer; font-weight:600; }
.aud-back:hover { text-decoration:underline; }
.aud-q { margin-top:15px; }
.aud-q label { display:block; font-size:12.5px; font-weight:600; color:var(--muted); margin-bottom:8px; }
.aud-chips { display:flex; flex-wrap:wrap; gap:7px; }
.aud-chip { font:inherit; font-size:12.5px; font-weight:500; border:1.5px solid var(--line); background:#fff; cursor:pointer; padding:7px 13px; border-radius:20px; color:var(--ink); transition:all .12s; }
.aud-chip:hover { border-color:var(--violet); }
.aud-chip.on { background:var(--violet); color:#fff; border-color:var(--violet); }
.aud-chip:disabled { opacity:.5; cursor:default; }
.aud-go { width:100%; margin-top:20px; font:inherit; font-weight:700; font-size:15.5px; border:0; cursor:pointer; padding:15px; border-radius:12px; background:var(--violet); color:#fff; box-shadow:0 8px 26px rgba(91,61,245,.3); }
.aud-go:hover { background:#4b30d8; }
.aud-go:disabled { background:#EDEBF5; color:var(--muted); box-shadow:none; cursor:default; }
.aud-loading { display:flex; align-items:center; gap:14px; padding:26px 4px; }
.aud-loading b { display:block; font-size:15px; font-family:'Space Grotesk'; font-weight:600; }
.aud-loading span { font-size:12.5px; color:var(--muted); }

/* resultado */
.aud-result { margin-top:26px; background:var(--card); border:1.5px solid var(--violet); border-radius:20px; padding:24px; box-shadow:0 20px 55px rgba(91,61,245,.14); animation:reveal .5s ease both; }
.aud-res-top { display:flex; gap:20px; align-items:center; flex-wrap:wrap; }
.aud-res-lab { font-family:'Space Mono'; font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--violet); }
.aud-res-top h3 { font-family:'Space Grotesk'; font-weight:700; font-size:24px; letter-spacing:-.02em; margin-top:5px; }
.aud-res-top p { font-size:14px; color:#3a3845; margin-top:7px; max-width:56ch; }
.aud-win { display:flex; gap:12px; align-items:flex-start; background:var(--ink); color:#fff; border-radius:14px; padding:15px 18px; margin-top:20px; }
.aud-win-ico { font-size:19px; }
.aud-win b { font-family:'Space Grotesk'; font-weight:600; font-size:14px; }
.aud-win p { font-size:13.5px; color:rgba(255,255,255,.78); margin-top:3px; }
.aud-cols { display:grid; grid-template-columns:1fr 1fr; gap:22px; margin-top:22px; }
.aud-col-h { font-family:'Space Grotesk'; font-weight:600; font-size:12.5px; letter-spacing:.05em; text-transform:uppercase; color:var(--muted); margin-bottom:12px; }
.aud-item { display:flex; gap:11px; align-items:flex-start; margin-bottom:14px; }
.aud-item b { font-size:14px; font-weight:600; display:block; }
.aud-item p { font-size:12.5px; color:var(--muted); margin-top:3px; }
.aud-imp { font-size:9px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; color:#fff; padding:3px 7px; border-radius:5px; flex-shrink:0; margin-top:2px; }
.aud-num { width:20px; height:20px; border-radius:6px; background:var(--violet-soft); color:var(--violet); font-family:'Space Grotesk'; font-weight:700; font-size:11px; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
.aud-time { margin-top:6px; background:var(--violet-soft); border-radius:13px; padding:14px 17px; }
.aud-time span { font-size:11px; font-family:'Space Mono'; letter-spacing:.08em; text-transform:uppercase; color:var(--violet); }
.aud-time b { display:block; font-family:'Space Grotesk'; font-weight:700; font-size:17px; margin-top:4px; }
.aud-time p { font-size:12.5px; color:var(--muted); margin-top:3px; }
.aud-cta { display:flex; gap:20px; align-items:center; justify-content:space-between; flex-wrap:wrap; margin-top:22px; padding-top:20px; border-top:1px dashed var(--line); }
.aud-cta b { font-family:'Space Grotesk'; font-weight:600; font-size:15.5px; }
.aud-cta p { font-size:13px; color:var(--muted); margin-top:5px; max-width:48ch; }
.aud-cta-btns { display:flex; gap:9px; flex-wrap:wrap; }
.aud-2nd { font:inherit; font-weight:600; font-size:14px; cursor:pointer; border:1.5px solid var(--line); background:#fff; color:var(--ink); border-radius:11px; padding:13px 18px; }
.aud-2nd:hover { border-color:var(--violet); color:var(--violet); }
.aud-again { margin-top:16px; font:inherit; font-size:13px; font-weight:600; border:0; background:transparent; color:var(--muted); cursor:pointer; padding:0; }
.aud-again:hover { color:var(--violet); }

/* demo en vivo */
.demo-box { display:grid; grid-template-columns:.85fr 1.15fr; gap:22px; background:var(--card); border:1px solid var(--line); border-radius:20px; padding:24px; align-items:start; }
.demo-left b { font-family:'Space Grotesk'; font-weight:600; font-size:18px; letter-spacing:-.01em; }
.demo-left p { font-size:13.5px; color:var(--muted); margin-top:8px; }
.demo-chips { display:flex; flex-wrap:wrap; gap:7px; margin-top:16px; }
.demo-card { background:#FAF9F6; border:1px solid var(--line); border-radius:15px; padding:18px; min-height:190px; }
.demo-card.live { border-color:var(--violet); background:#fff; animation:reveal .45s ease both; }
.demo-card.empty { display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:var(--muted); gap:8px; }
.demo-card.empty span { font-size:26px; }
.demo-card.empty p { font-size:13px; max-width:24ch; }
.demo-badge { display:inline-block; font-size:10px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; background:var(--violet); color:#fff; padding:3px 9px; border-radius:6px; }
.demo-card h4 { font-family:'Space Grotesk'; font-weight:600; font-size:17px; letter-spacing:-.01em; margin-top:9px; }
.demo-hook { font-size:14px; font-weight:500; margin-top:9px; }
.demo-cap { font-size:12.5px; color:#3a3845; margin-top:10px; white-space:pre-wrap; max-height:120px; overflow:hidden; }
.demo-tags { display:flex; flex-wrap:wrap; gap:5px; margin-top:11px; }
.demo-tags span { font-size:11px; font-family:'Space Mono'; color:var(--violet); background:var(--violet-soft); padding:3px 8px; border-radius:5px; }

@media (max-width:820px){
  .aud-cols { grid-template-columns:1fr; }
  .demo-box { grid-template-columns:1fr; }
}
@media (prefers-reduced-motion: reduce){
  .seg-in, .dot-live, .aud-result, .demo-card.live { animation:none }
}

/* cuenta detectada por IA */
.acct-box { background:linear-gradient(135deg,#F6F3FF,#FFF4F6); border:1.5px solid var(--violet); border-radius:16px; padding:18px 20px; margin:22px 0 6px; }
.acct-box.analyzing { display:flex; align-items:center; gap:11px; font-size:14px; font-weight:500; color:var(--violet); background:var(--violet-soft); }
.spin { width:15px; height:15px; border:2px solid rgba(91,61,245,.25); border-top-color:var(--violet); border-radius:50%; display:inline-block; animation:spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.acct-top { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.acct-ig { font-family:'Space Mono'; font-weight:700; font-size:13.5px; color:var(--ink); }
.acct-tag { font-size:10.5px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:#fff; background:var(--violet); padding:3px 9px; border-radius:20px; }
.acct-switch { margin-left:auto; display:flex; align-items:center; gap:7px; font-size:12.5px; color:var(--muted); cursor:pointer; font-weight:500; }
.acct-switch input { width:15px; height:15px; accent-color:var(--violet); cursor:pointer; }
.acct-niche { font-family:'Space Grotesk'; font-weight:700; font-size:22px; letter-spacing:-.02em; margin-top:9px; }
.acct-sum { font-size:13.5px; color:#3a3845; margin-top:5px; max-width:70ch; }
.acct-meta { display:flex; gap:20px; flex-wrap:wrap; margin-top:11px; font-size:12.5px; color:var(--muted); }
.acct-meta b { color:var(--ink); font-weight:600; }
.acct-temas { display:flex; gap:6px; flex-wrap:wrap; margin-top:11px; }
.acct-temas span { font-size:11.5px; font-weight:500; background:#fff; border:1px solid var(--line); color:var(--ink); padding:4px 10px; border-radius:20px; }
@media (prefers-reduced-motion: reduce){ .spin{ animation:none } }

/* publicación */
.pub-ok { background:#E5F8F4; color:#04695a; font-size:13px; font-weight:600; padding:11px 14px; border-radius:10px; }
.pub-err { background:#FFE9ED; color:#a11231; font-size:13px; font-weight:600; padding:11px 14px; border-radius:10px; }
.pub-tag { font-size:9px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; color:var(--teal); background:#E5F8F4; border-radius:5px; padding:2px 6px; margin-top:5px; display:inline-block; }
.modal textarea { width:100%; font:inherit; font-size:15px; padding:12px 13px; border:1.5px solid var(--line); border-radius:10px; outline:0; margin-top:6px; background:#fff; }
.modal textarea:focus { border-color:var(--violet); }

@media (max-width:720px){
  .kpis { grid-template-columns:repeat(2,1fr); }
  .grid-2 { grid-template-columns:1fr; }
  .nav button { padding:8px 10px; font-size:12px; }
  .top-cta { display:none; }
  .plans { grid-template-columns:1fr; }
  .steps { grid-template-columns:1fr; }
  .posts { grid-template-columns:repeat(2,1fr); }
  .ctaband { padding:28px; }
}
@media (prefers-reduced-motion: reduce){ .skel{ animation:none } .evt{ transition:none } .wa-float{ transition:none } }

/* ===================== v3 · más llamativa ===================== */
@keyframes reveal { from { opacity:0; transform: translateY(16px); } to { opacity:1; transform:none; } }
@keyframes drift { 0%{transform:translate(0,0) scale(1)} 50%{transform:translate(34px,-22px) scale(1.12)} 100%{transform:translate(0,0) scale(1)} }
@keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
@keyframes shine { to { background-position:200% center; } }

.hero { position:relative; overflow:visible; }
.hero-aurora { position:absolute; inset:-60px -30px auto -30px; height:460px; z-index:0; pointer-events:none; filter:blur(64px); opacity:.5; }
.hero-aurora i { position:absolute; border-radius:50%; display:block; }
.hero-aurora .a1 { width:300px;height:300px; background:#5B3DF5; left:0; top:0; animation:drift 15s ease-in-out infinite; }
.hero-aurora .a2 { width:250px;height:250px; background:#FF4D6D; left:240px; top:40px; animation:drift 19s ease-in-out infinite reverse; }
.hero-aurora .a3 { width:210px;height:210px; background:#00B596; left:130px; top:130px; animation:drift 22s ease-in-out infinite; }
.hero > * { position:relative; z-index:1; }

.hero-grid { display:grid; grid-template-columns:1.05fr .95fr; gap:34px; align-items:center; }
.hero-visual { position:relative; display:flex; justify-content:center; align-items:center; min-height:340px; }
.glass { background:rgba(255,255,255,.74); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,.9); border-radius:26px; box-shadow:0 26px 64px rgba(91,61,245,.20); padding:20px 20px 8px; }
.hero-clockcard { text-align:center; animation:floaty 6s ease-in-out infinite; }
.hero-clockcard .cc-lab { font-family:'Space Mono'; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--violet); margin-bottom:2px; }
.float-chip { position:absolute; background:#fff; border:1px solid var(--line); border-radius:14px; padding:10px 13px; box-shadow:0 14px 34px rgba(0,0,0,.12); font-size:13px; font-weight:600; display:flex; align-items:center; gap:8px; white-space:nowrap; }
.float-chip .fdot { width:9px;height:9px;border-radius:50%; }
.fc-1 { top:2px; right:-6px; animation:floaty 5s ease-in-out infinite; }
.fc-2 { bottom:14px; left:-10px; animation:floaty 7s ease-in-out infinite; }

.grad-text { background:linear-gradient(100deg,#5B3DF5,#C13584,#FF4D6D,#5B3DF5); background-size:200% auto; -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; animation:shine 6s linear infinite; }

.hero-text, .section-h, .steps>*, .plans>*, .clients-grid>*, .kpi, .panel, .idea { animation:reveal .5s ease both; }
.steps>*:nth-child(2){animation-delay:.07s}.steps>*:nth-child(3){animation-delay:.14s}
.plans>*:nth-child(2){animation-delay:.07s}.plans>*:nth-child(3){animation-delay:.14s}
.clients-grid>*:nth-child(2){animation-delay:.05s}.clients-grid>*:nth-child(3){animation-delay:.1s}.clients-grid>*:nth-child(4){animation-delay:.15s}
.kpi:nth-child(2){animation-delay:.05s}.kpi:nth-child(3){animation-delay:.1s}.kpi:nth-child(4){animation-delay:.15s}

.ig-connect { box-shadow:0 10px 34px rgba(193,53,132,.44) !important; }
.gen-btn, .big { box-shadow:0 8px 26px rgba(91,61,245,.34); }
.plan.featured > button { box-shadow:0 10px 30px rgba(91,61,245,.36); }

.kpi { position:relative; overflow:hidden; }
.kpi::before { content:""; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--violet),var(--coral)); }
.nav button.on { color:var(--violet); }
.brand-name b { background:linear-gradient(100deg,#5B3DF5,#FF4D6D); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.pricing-h h2 { display:inline-block; }
.ctaband { background:linear-gradient(120deg,#16161C,#241a4d 70%,#3a1f52); }

@media (max-width:820px){ .hero-grid{grid-template-columns:1fr} .hero-visual{display:none} }
@media (prefers-reduced-motion: reduce){
  .hero-aurora i,.hero-clockcard,.float-chip,.grad-text{animation:none}
  .hero-text,.section-h,.steps>*,.plans>*,.clients-grid>*,.kpi,.panel,.idea{animation:none}
}
`;

// ---------- demo data ----------
const HOURLY = [8,5,3,2,2,3,9,18,32,41,38,44,52,48,40,46,58,71,86,94,82,63,40,20];
const DAYS = [
  { d: "Lun", v: 62 }, { d: "Mar", v: 71 }, { d: "Mié", v: 88 },
  { d: "Jue", v: 95 }, { d: "Vie", v: 79 }, { d: "Sáb", v: 54 }, { d: "Dom", v: 48 },
];
const POSTS = [
  { type: "Reel", eng: "12.4k", sub: "Alcance 184k · guardados 2.1k", c1: "#5B3DF5", c2: "#9D7BFF" },
  { type: "Carrusel", eng: "8.9k", sub: "Alcance 96k · guardados 3.4k", c1: "#FF4D6D", c2: "#FF9A6B" },
  { type: "Reel", eng: "7.2k", sub: "Alcance 142k · guardados 1.2k", c1: "#00B596", c2: "#5BE0C4" },
  { type: "Imagen", eng: "3.1k", sub: "Alcance 38k · guardados 410", c1: "#FFB02E", c2: "#FFD27A" },
  { type: "Carrusel", eng: "6.6k", sub: "Alcance 72k · guardados 2.8k", c1: "#5B3DF5", c2: "#C4B5FF" },
  { type: "Reel", eng: "9.8k", sub: "Alcance 158k · guardados 1.9k", c1: "#FF4D6D", c2: "#FFB0BE" },
];
const AUDIT = [
  { color: "#FF4D6D", h: "Publicas a horas de bajo alcance", p: "El 60% de tus posts salen antes de las 4 p.m., pero tu audiencia se activa entre 6 y 9 p.m. Reprogramar puede subir el alcance ~35%." },
  { color: "#FFB02E", h: "Pocos Reels frente a tu potencial", p: "Tus Reels rinden 3.1× más que las imágenes, pero solo son el 30% de tu feed. Sube a 5 Reels por semana." },
  { color: "#00B596", h: "Buen ritmo de guardados", p: "Tus carruseles generan muchos guardados — señal fuerte para el algoritmo. Mantén 2 carruseles educativos por semana." },
  { color: "#5B3DF5", h: "Constancia mejorable", p: "Tienes huecos de 4–5 días sin publicar. Un calendario fijo de 5 publicaciones/semana estabiliza el crecimiento." },
];
const NICHES = ["Fitness", "Gastronomía", "Moda", "Inmobiliaria", "Belleza", "Finanzas personales", "Viajes", "Marca personal", "Tecnología", "Salud y bienestar"];

const PLANS = [
  { name: "Auditoría Express", price: "Gratis", per: "", cta: "Agendar gratis",
    items: ["Diagnóstico completo de tu cuenta", "Tu mejor día y hora para publicar", "3 acciones de mejora priorizadas"] },
  { name: "Crecimiento", price: "$59", per: "/mes", featured: true, cta: "Empezar ahora",
    items: ["Todo lo de Auditoría Express", "Calendario mensual en horarios óptimos", "12 ideas con caption y hashtags", "Reporte de resultados cada mes"] },
  { name: "Agencia Total", price: "$149", per: "/mes", cta: "Hablar con el equipo",
    items: ["Todo lo de Crecimiento", "Contenido adaptado a todas tus plataformas", "Diseños listos para publicar", "Reunión de estrategia mensual"] },
];

// ---------- connected clients (demo) ----------
const DEMO_CLIENTS = [
  { id: "c1", handle: "cafe.aurora", name: "Café Aurora", initials: "CA", c1: "#5B3DF5", c2: "#FF4D6D", followers: "24.8k", niche: "Gastronomía" },
  { id: "c2", handle: "studiofit.co", name: "Studio Fit", initials: "SF", c1: "#00B596", c2: "#5BE0C4", followers: "11.2k", niche: "Fitness" },
  { id: "c3", handle: "moda.lena", name: "Moda Lena", initials: "ML", c1: "#FFB02E", c2: "#FF9A6B", followers: "48.1k", niche: "Moda" },
];

// Mapea una fila del backend (/api/clients) al formato visual de las tarjetas.
const CLIENT_PALETTE = [["#5B3DF5","#FF4D6D"],["#00B596","#5BE0C4"],["#FFB02E","#FF9A6B"],["#5B3DF5","#9D7BFF"],["#FF4D6D","#FFB0BE"]];
function mapClient(row, i) {
  const [c1, c2] = CLIENT_PALETTE[i % CLIENT_PALETTE.length];
  const f = row.followers_count;
  const followers = f == null ? "—" : f >= 1000 ? `${(f / 1000).toFixed(1)}k` : String(f);
  return {
    id: row.id,
    handle: row.username,
    name: row.username,
    initials: (row.username || "??").slice(0, 2).toUpperCase(),
    c1, c2, followers,
    niche: row.niche || null,
    real: true, // viene del backend: es una cuenta de Instagram conectada de verdad
  };
}

// ---------- calendar constants ----------
const FMT_COLORS = {
  Reel: { bg: "#5B3DF5", soft: "#EFEBFF" },
  Carrusel: { bg: "#FF4D6D", soft: "#FFE9ED" },
  Historia: { bg: "#00B596", soft: "#E5F8F4" },
  Post: { bg: "#FFB02E", soft: "#FFF3DF" },
};
const FMT_CYCLE = ["Reel", "Carrusel", "Historia", "Post"];
const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const WEEK_FULL = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// ---------- datos de tu marca (aparecen en el pie del PDF) ----------
// Edita esto con tus datos reales antes de enviar calendarios a clientes.
const BRAND = {
  name: "Pulso",
  tagline: "Inteligencia de contenido",
  site: "pulso-x2ws.vercel.app",
  email: "",          // ej. "hola@tudominio.com"
  phone: "",          // ej. "+57 300 000 0000"
  legal: "Documento generado automáticamente por Pulso.",
};
const DAY_OPTIMAL = ["19:00", "08:00", "12:30", "19:30", "18:00", "11:00", "19:00"];
const SEED_EVENTS = [
  { day: 0, time: "19:00", format: "Carrusel", title: "5 errores que frenan tu progreso" },
  { day: 2, time: "12:30", format: "Carrusel", title: "Guía rápida para principiantes" },
  { day: 3, time: "19:30", format: "Reel", title: "Antes y después · transformación real" },
  { day: 4, time: "18:00", format: "Reel", title: "3 tips en 15 segundos" },
  { day: 6, time: "19:00", format: "Reel", title: "Rutina de domingo paso a paso" },
];

function fmtTime(t) {
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ap}`;
}
function isPeak(t) {
  const h = Number(String(t).split(":")[0]);
  return h >= 19 && h < 21; // ventana viral: 7-9 PM
}

// ---------- contador animado ----------
function CountUp({ to, prefix = "", suffix = "", duration = 1400 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{prefix}{n}{suffix}</>;
}

// ---------- radial clock ----------
function RadialClock({ animate = false }) {
  const size = 230, cx = size / 2, cy = size / 2;
  const rOuter = 104, rInner = 58;
  const max = Math.max(...HOURLY);
  const seg = (h) => {
    const a0 = (h / 24) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((h + 1) / 24) * 2 * Math.PI - Math.PI / 2;
    const p = (rad, a) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
    const [x0, y0] = p(rInner, a0), [x1, y1] = p(rOuter, a0);
    const [x2, y2] = p(rOuter, a1), [x3, y3] = p(rInner, a1);
    return `M${x0},${y0} L${x1},${y1} A${rOuter},${rOuter} 0 0 1 ${x2},${y2} L${x3},${y3} A${rInner},${rInner} 0 0 0 ${x0},${y0} Z`;
  };
  const color = (v) => {
    const t = v / max;
    if (t > 0.82) return "#5B3DF5";
    if (t > 0.6) return "#7E63F7";
    if (t > 0.4) return "#A892FA";
    if (t > 0.22) return "#D3C8FD";
    return "#EEE9FB";
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Mejores horas para publicar">
      {HOURLY.map((v, h) => (
        <path
          key={h}
          d={seg(h)}
          fill={color(v)}
          stroke="#fff"
          strokeWidth="1.2"
          className={animate ? "seg-in" : ""}
          style={animate ? { animationDelay: `${h * 0.035}s` } : undefined}
        />
      ))}
      {[0, 6, 12, 18].map((h) => {
        const a = (h / 24) * 2 * Math.PI - Math.PI / 2;
        const x = cx + (rOuter + 14) * Math.cos(a), y = cy + (rOuter + 14) * Math.sin(a);
        return <text key={h} x={x} y={y + 4} textAnchor="middle" fontSize="11" fontFamily="Space Mono" fill="#6E6B78">{h}h</text>;
      })}
      <circle cx={cx} cy={cy} r={rInner - 6} fill="#fff" stroke="#E8E5DE" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="26" fill="#16161C">7-9</text>
      <text x={cx} y={cy + 15} textAnchor="middle" fontSize="11" fontFamily="Space Mono" fill="#6E6B78">P.M. PICO</text>
    </svg>
  );
}

function ScoreRing({ score, animate = false, size = 90 }) {
  const r = 34, c = 2 * Math.PI * r;
  const [shown, setShown] = useState(animate ? 0 : score);
  useEffect(() => {
    if (!animate) { setShown(score); return; }
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / 1200, 1);
      setShown(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score, animate]);
  const off = c - (shown / 100) * c;
  const col = shown >= 70 ? "#00B596" : shown >= 50 ? "#5B3DF5" : "#FF4D6D";
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" style={{ flexShrink: 0 }}>
      <circle cx="45" cy="45" r={r} fill="none" stroke="#EEEBE4" strokeWidth="9" />
      <circle cx="45" cy="45" r={r} fill="none" stroke={animate ? col : "var(--violet)"} strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 45 45)" />
      <text x="45" y="50" textAnchor="middle" fontFamily="Space Grotesk" fontWeight="700" fontSize="24" fill="#16161C">{shown}</text>
    </svg>
  );
}

// ---------- small reusable copy button ----------
function CopyButton({ text, label = "Copiar", okLabel = "¡Copiado!" }) {
  const [ok, setOk] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (_) {}
      document.body.removeChild(ta);
    }
    setOk(true); setTimeout(() => setOk(false), 1600);
  }
  return <button className={`copy-btn ${ok ? "ok" : ""}`} onClick={copy}>{ok ? okLabel : label}</button>;
}

// ============================================================
export default function Pulso() {
  const [view, setView] = useState("connect");

  // multi-cliente: cuentas conectadas por la agencia + cuenta activa
  const [clients, setClients] = useState(DEMO_CLIENTS);
  const [activeClient, setActiveClient] = useState(DEMO_CLIENTS[0]);
  const [mode, setMode] = useState("owner"); // "owner" (conectada) | "competitor" (datos públicos)
  const [connectOpen, setConnectOpen] = useState(false);
  const simCount = React.useRef(0);

  // shared calendar state
  const [events, setEvents] = useState(SEED_EVENTS.map((e, i) => ({ ...e, id: i })));
  const nextId = React.useRef(SEED_EVENTS.length);

  // CTA state
  const [lead, setLead] = useState(null);      // { plan } cuando el modal está abierto
  const [editing, setEditing] = useState(null); // evento en edición

  const WHATSAPP = "573000000000"; // <-- cambia por tu número real (código país + número, sin +)

  // Banner tras volver del login de Instagram (?connected=ok&user=...)
  const [connectedInfo, setConnectedInfo] = useState(null);

  // Al cargar: intenta traer las cuentas reales del backend. Si no hay backend
  // (p. ej. en la vista previa), se queda con las cuentas demo.
  useEffect(() => {
    let alive = true;
    fetch("/api/clients")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (!alive || !data || !Array.isArray(data.clients) || data.clients.length === 0) return;
        const mapped = data.clients.map(mapClient);
        setClients(mapped);
        setActiveClient(mapped[0]);
        analyzeAccount(mapped[0]); // deduce el nicho de la cuenta real
      })
      .catch(() => { /* sin backend: se usan los datos demo */ });

    // ¿Volvemos de autorizar en Instagram?
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    if (connected === "ok") {
      setConnectedInfo({ ok: true, user: params.get("user") });
      window.history.replaceState({}, "", window.location.pathname);
    } else if (connected === "error" || connected === "cancel") {
      setConnectedInfo({ ok: false });
      window.history.replaceState({}, "", window.location.pathname);
    }
    return () => { alive = false; };
  }, []);

  // Perfil de la cuenta detectado por IA (nicho, tono, audiencia, temas)
  const [accountProfile, setAccountProfile] = useState(null);   // { username, nicho, categoria, audiencia, tono, temas, resumen }
  const [analyzing, setAnalyzing] = useState(false);
  const analyzedFor = React.useRef(null);

  // Analiza una cuenta real conectada para deducir su nicho.
  async function analyzeAccount(client) {
    if (!client || !client.real || analyzedFor.current === client.id) return;
    analyzedFor.current = client.id;
    setAnalyzing(true);
    setAccountProfile(null);
    try {
      const r = await fetch(`/api/analyze-account?client_id=${encodeURIComponent(client.id)}`);
      if (!r.ok) throw new Error("fallo");
      const d = await r.json();
      setAccountProfile({ username: d.cuenta?.username || client.handle, ...(d.perfil || {}) });
    } catch (_) {
      analyzedFor.current = null; // permite reintentar más tarde
    } finally {
      setAnalyzing(false);
    }
  }

  function selectClient(client) {
    setActiveClient(client);
    setMode("owner");
    setView("dashboard");
    if (client?.real) analyzeAccount(client);
    else setAccountProfile(null);
  }
  function analyzeCompetitor(handle) {
    const h = handle.replace(/^@/, "").trim();
    if (!h) return;
    setActiveClient({ id: "comp", handle: h, name: h, initials: h.slice(0, 2).toUpperCase(), c1: "#6E6B78", c2: "#B7B4BF" });
    setMode("competitor");
    setAccountProfile(null);
    setView("dashboard");
  }
  function simulateConnect() {
    simCount.current += 1;
    const palette = [["#5B3DF5", "#9D7BFF"], ["#00B596", "#5BE0C4"], ["#FF4D6D", "#FF9A6B"], ["#FFB02E", "#FFD27A"]];
    const [c1, c2] = palette[simCount.current % palette.length];
    const nuevo = { id: `new${simCount.current}`, handle: `cuenta.nueva${simCount.current}`, name: `Cuenta nueva ${simCount.current}`, initials: "CN", c1, c2, followers: "—", justConnected: true };
    setClients((p) => [...p, nuevo]);
    setConnectOpen(false);
  }
  function openLead(plan) { setLead({ plan: plan || "Auditoría gratis" }); }

  // Publica una publicación en Instagram (vía backend). Sin backend: simula.
  async function publishEvent(evData) {
    try {
      const r = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: activeClient?.id,
          format: evData.format,
          caption: evData.caption,
          media_urls: evData.mediaUrl ? [evData.mediaUrl] : [],
        }),
      });
      if (r.ok) { updateEvent({ ...evData, published: true }); return { ok: true }; }
      const d = await r.json().catch(() => ({}));
      return { ok: false, error: d.error || "No se pudo publicar." };
    } catch (e) {
      // Vista previa sin backend: simular publicación.
      updateEvent({ ...evData, published: true });
      return { ok: true, demo: true };
    }
  }

  function addEvent(day) {
    const count = events.filter((e) => e.day === day).length;
    const format = FMT_CYCLE[(count + day) % FMT_CYCLE.length];
    setEvents((p) => [...p, { id: nextId.current++, day, time: DAY_OPTIMAL[day], format, title: "Nueva publicación" }]);
  }
  function removeEvent(id) { setEvents((p) => p.filter((e) => e.id !== id)); }
  function updateEvent(upd) { setEvents((p) => p.map((e) => (e.id === upd.id ? upd : e))); }
  function fillOptimal() { nextId.current = SEED_EVENTS.length; setEvents(SEED_EVENTS.map((e, i) => ({ ...e, id: i }))); }
  function clearAll() { setEvents([]); }
  function scheduleIdea(idea) {
    const order = idea.formato === "Reel" ? [3, 0, 6, 4, 2, 1, 5] : [3, 2, 4, 1, 0, 5, 6];
    let best = order[0], bestCount = Infinity;
    for (const d of order) {
      const cnt = events.filter((e) => e.day === d).length;
      if (cnt < bestCount) { bestCount = cnt; best = d; }
    }
    const time = DAY_OPTIMAL[best];
    setEvents((p) => [...p, { id: nextId.current++, day: best, time, format: idea.formato || "Post", title: idea.titulo }]);
    return { day: best, time };
  }

  return (
    <div className="pulso">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div className="wrap">
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark"><span /></div>
            <div className="brand-lockup">
              <div className="brand-name">Pulso</div>
              <div className="brand-tag">Inteligencia de contenido</div>
            </div>
          </div>
          <nav className="nav">
            <button className={view === "connect" ? "on" : ""} onClick={() => setView("connect")}>Inicio</button>
            <button className={view === "dashboard" ? "on" : ""} onClick={() => setView("dashboard")}>Análisis</button>
            <button className={view === "generator" ? "on" : ""} onClick={() => setView("generator")}>Ideas</button>
            <button className={view === "calendar" ? "on" : ""} onClick={() => setView("calendar")}>Calendario</button>
          </nav>
          <button className="top-cta" onClick={() => openLead("Auditoría gratis")}>Auditoría gratis</button>
        </header>

        {view === "connect" && <ConnectHub clients={clients} onConnect={() => setConnectOpen(true)} onSelect={selectClient} onCompetitor={analyzeCompetitor} openLead={openLead} connectedInfo={connectedInfo} onDismissBanner={() => setConnectedInfo(null)} />}
        {view === "dashboard" && <Dashboard client={activeClient} mode={mode} goGen={() => setView("generator")} goCal={() => setView("calendar")} openLead={openLead} goConnect={() => setView("connect")} />}
        {view === "generator" && <Generator scheduleIdea={scheduleIdea} goCal={() => setView("calendar")} openLead={openLead} accountProfile={accountProfile} analyzing={analyzing} activeClient={activeClient} mode={mode} />}
        {view === "calendar" && <Calendar events={events} addEvent={addEvent} removeEvent={removeEvent} fillOptimal={fillOptimal} clearAll={clearAll} onEdit={setEditing} openLead={openLead} user={activeClient?.handle} />}

        <div className="foot">Pulso · prototipo de demostración · Las métricas mostradas son datos de ejemplo</div>
      </div>

      {connectOpen && <ConnectModal onClose={() => setConnectOpen(false)} onSimulate={simulateConnect} />}
      {lead && <LeadModal lead={lead} onClose={() => setLead(null)} whatsapp={WHATSAPP} />}
      {editing && <EditEventModal event={editing} onClose={() => setEditing(null)} onSave={(u) => { updateEvent(u); setEditing(null); }} onDelete={(id) => { removeEvent(id); setEditing(null); }} onPublish={publishEvent} />}

      <a className="wa-float" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola, vengo de Pulso y quiero una auditoría de mi Instagram")}`} target="_blank" rel="noreferrer" aria-label="Escríbenos por WhatsApp">
        <svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.1 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2z"/></svg>
      </a>
    </div>
  );
}

// ---------- connect hub / landing ----------
// ---------- auditoría instantánea (sin conectar cuenta) ----------
const AUD_FREQ = ["Menos de 1 vez/semana", "1-2 por semana", "3-5 por semana", "A diario"];
const AUD_FMT = ["Reels", "Carruseles", "Fotos", "Historias"];
const AUD_LOADING = [
  "Revisando tu perfil…",
  "Comparando con cuentas de tu nicho…",
  "Detectando qué frena tu alcance…",
  "Preparando tu diagnóstico…",
];

function InstantAudit({ openLead, onConnect }) {
  const [step, setStep] = useState("form"); // form | q | loading | result
  const [handle, setHandle] = useState("");
  const [nicho, setNicho] = useState("");
  const [freq, setFreq] = useState("");
  const [fmt, setFmt] = useState("");
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState(0);
  const resultRef = React.useRef(null);

  useEffect(() => {
    if (step !== "loading") return;
    const t = setInterval(() => setMsg((m) => (m + 1) % AUD_LOADING.length), 1800);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    if (step === "result" && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  async function run() {
    setStep("loading"); setErr(""); setMsg(0);
    try {
      const r = await fetch("/api/auditoria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: handle.replace(/^@/, ""), nicho, frecuencia: freq, formato: fmt, objetivo: "crecer" }),
      });
      if (!r.ok) throw new Error("fallo");
      const d = await r.json();
      setRes(d); setStep("result");
    } catch (_) {
      setErr("No pudimos completar la auditoría. Inténtalo de nuevo en un momento.");
      setStep("q");
    }
  }

  function reset() { setStep("form"); setRes(null); setHandle(""); setNicho(""); setFreq(""); setFmt(""); }

  // --- paso 1: usuario ---
  if (step === "form") {
    return (
      <div className="aud-box">
        <div className="aud-field">
          <span className="at">@</span>
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handle.trim() && setStep("q")}
            placeholder="tu_usuario"
            aria-label="Tu usuario de Instagram"
          />
          <button disabled={!handle.trim()} onClick={() => setStep("q")}>Auditar gratis</button>
        </div>
        <div className="aud-note">
          <span className="dot-live" /> Resultado en 30 segundos · No pedimos contraseña ni permisos
        </div>
      </div>
    );
  }

  // --- paso 2: 3 preguntas rápidas ---
  if (step === "q" || step === "loading") {
    const ready = nicho && freq && fmt;
    return (
      <div className="aud-box open">
        <div className="aud-head">
          <span className="aud-handle">@{handle.replace(/^@/, "")}</span>
          <button className="aud-back" onClick={reset}>cambiar</button>
        </div>

        {step === "loading" ? (
          <div className="aud-loading">
            <span className="spin" />
            <div>
              <b>{AUD_LOADING[msg]}</b>
              <span>Analizando con inteligencia artificial</span>
            </div>
          </div>
        ) : (
          <>
            <div className="aud-q">
              <label>1 · ¿De qué es tu cuenta?</label>
              <div className="aud-chips">
                {NICHES.map((n) => (
                  <button key={n} className={`aud-chip ${nicho === n ? "on" : ""}`} onClick={() => setNicho(n)}>{n}</button>
                ))}
              </div>
            </div>
            <div className="aud-q">
              <label>2 · ¿Cada cuánto publicas?</label>
              <div className="aud-chips">
                {AUD_FREQ.map((f) => (
                  <button key={f} className={`aud-chip ${freq === f ? "on" : ""}`} onClick={() => setFreq(f)}>{f}</button>
                ))}
              </div>
            </div>
            <div className="aud-q">
              <label>3 · ¿Qué formato usas más?</label>
              <div className="aud-chips">
                {AUD_FMT.map((f) => (
                  <button key={f} className={`aud-chip ${fmt === f ? "on" : ""}`} onClick={() => setFmt(f)}>{f}</button>
                ))}
              </div>
            </div>
            {err && <div className="err" style={{ marginTop: 14 }}>{err}</div>}
            <button className="aud-go" disabled={!ready} onClick={run}>
              {ready ? "Ver mi diagnóstico →" : "Elige las 3 opciones"}
            </button>
          </>
        )}
      </div>
    );
  }

  // --- paso 3: resultado ---
  const score = Math.max(0, Math.min(100, Number(res?.puntaje) || 60));
  const impactColor = { alto: "var(--coral)", medio: "var(--amber)", bajo: "var(--teal)" };
  return (
    <div className="aud-result" ref={resultRef}>
      <div className="aud-res-top">
        <ScoreRing score={score} animate size={112} />
        <div>
          <div className="aud-res-lab">Diagnóstico de @{handle.replace(/^@/, "")}</div>
          <h3>{res.veredicto}</h3>
          <p>{res.diagnostico}</p>
        </div>
      </div>

      {res.quick_win && (
        <div className="aud-win">
          <span className="aud-win-ico">⚡</span>
          <div><b>Cámbialo mañana mismo</b><p>{res.quick_win}</p></div>
        </div>
      )}

      <div className="aud-cols">
        <div className="aud-col">
          <div className="aud-col-h">Qué te está frenando</div>
          {(res.errores || []).map((e, i) => (
            <div className="aud-item" key={i}>
              <span className="aud-imp" style={{ background: impactColor[e.impacto] || "var(--muted)" }}>{e.impacto}</span>
              <div><b>{e.titulo}</b><p>{e.detalle}</p></div>
            </div>
          ))}
        </div>
        <div className="aud-col">
          <div className="aud-col-h">Qué hacer esta semana</div>
          {(res.acciones || []).map((a, i) => (
            <div className="aud-item" key={i}>
              <span className="aud-num">{i + 1}</span>
              <div><b>{a.accion}</b><p>{a.resultado}</p></div>
            </div>
          ))}
        </div>
      </div>

      {res.mejor_momento && (
        <div className="aud-time">
          <span>Tu mejor momento estimado</span>
          <b>{res.mejor_momento.dia} · {res.mejor_momento.franja}</b>
          <p>{res.mejor_momento.razon}</p>
        </div>
      )}

      <div className="aud-cta">
        <div>
          <b>Esto es lo que se ve sin conectar tu cuenta.</b>
          <p>Con tus datos reales de Instagram sabrás tu hora exacta, tu alcance real y qué publicaciones te están funcionando de verdad.</p>
        </div>
        <div className="aud-cta-btns">
          <button className="gen-btn" onClick={() => openLead("Auditoría Express")}>Quiero mi auditoría completa</button>
          <button className="aud-2nd" onClick={onConnect}>Conectar Instagram</button>
        </div>
      </div>

      <button className="aud-again" onClick={reset}>← Auditar otra cuenta</button>
    </div>
  );
}

// ---------- demo en vivo del generador ----------
const DEMO_NICHES = ["Gastronomía", "Fitness", "Moda", "Inmobiliaria", "Belleza"];

function LiveDemo() {
  const [n, setN] = useState("Gastronomía");
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState(null);
  const [err, setErr] = useState("");

  async function go(nicho) {
    setN(nicho); setLoading(true); setErr(""); setIdea(null);
    try {
      const r = await fetch("/api/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: nicho, goal: "Crecer seguidores" }),
      });
      if (!r.ok) throw new Error("fallo");
      const d = await r.json();
      setIdea((d.ideas || [])[0] || null);
    } catch (_) {
      setErr("No se pudo generar ahora mismo. Inténtalo de nuevo.");
    } finally { setLoading(false); }
  }

  return (
    <div className="demo-box">
      <div className="demo-left">
        <b>Elige un nicho y mira a la IA trabajar</b>
        <p>Esto es exactamente lo que Pulso genera para cada cliente: gancho, caption y hashtags listos para publicar.</p>
        <div className="demo-chips">
          {DEMO_NICHES.map((x) => (
            <button key={x} className={`aud-chip ${n === x ? "on" : ""}`} onClick={() => go(x)} disabled={loading}>{x}</button>
          ))}
        </div>
      </div>
      <div className="demo-right">
        {loading && (
          <div className="demo-card">
            <div className="skel" style={{ height: 16, width: "70%" }} />
            <div className="skel" style={{ height: 12, width: "95%", marginTop: 12 }} />
            <div className="skel" style={{ height: 12, width: "85%", marginTop: 7 }} />
            <div className="skel" style={{ height: 40, width: "100%", marginTop: 14 }} />
          </div>
        )}
        {!loading && idea && (
          <div className="demo-card live">
            <span className="demo-badge">{idea.formato}</span>
            <h4>{idea.titulo}</h4>
            <div className="demo-hook">{idea.gancho}</div>
            <div className="demo-cap">{idea.caption}</div>
            <div className="demo-tags">{(idea.hashtags || []).slice(0, 4).map((t, i) => <span key={i}>{t}</span>)}</div>
          </div>
        )}
        {!loading && !idea && !err && (
          <div className="demo-card empty">
            <span>👆</span>
            <p>Toca un nicho para generar una idea real con IA</p>
          </div>
        )}
        {err && <div className="err">{err}</div>}
      </div>
    </div>
  );
}

function ConnectHub({ clients, onConnect, onSelect, onCompetitor, openLead, connectedInfo, onDismissBanner }) {
  const [comp, setComp] = useState("");
  return (
    <>
      {connectedInfo && (
        <div className={`connect-banner ${connectedInfo.ok ? "ok" : "bad"}`}>
          <span>{connectedInfo.ok
            ? `✓ ${connectedInfo.user ? "@" + connectedInfo.user : "Cuenta"} conectada correctamente. Ya aparece en tu lista.`
            : "No se pudo completar la conexión. Inténtalo de nuevo."}</span>
          <button onClick={onDismissBanner} aria-label="Cerrar">×</button>
        </div>
      )}
      <section className="hero">
        <div className="hero-aurora"><i className="a1" /><i className="a2" /><i className="a3" /></div>
        <div className="hero-grid">
          <div className="hero-text">
            <h1>Descubre en 30 segundos por qué tu Instagram <em className="grad-text">no crece</em>.</h1>
            <p>Auditoría gratis e instantánea. Sin registrarte, sin conectar nada. Te decimos qué está frenando tu cuenta y qué cambiar esta semana.</p>

            <InstantAudit openLead={openLead} onConnect={onConnect} />

            <div className="pillars" style={{ marginTop: 26 }}>
              <div className="pillar"><span className="pdot" style={{ background: "var(--coral)" }} /><div><b>Qué funciona</b><span>Formatos y posts que más rinden</span></div></div>
              <div className="pillar"><span className="pdot" style={{ background: "var(--violet)" }} /><div><b>Cuándo publicar</b><span>Tu día y hora pico exactos</span></div></div>
              <div className="pillar"><span className="pdot" style={{ background: "var(--teal)" }} /><div><b>Qué hacer para crecer</b><span>Estudio de mejoría accionable</span></div></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="glass hero-clockcard">
              <div className="cc-lab">Mejor hora para publicar</div>
              <RadialClock animate />
            </div>
            <div className="float-chip fc-1"><span className="fdot" style={{ background: "var(--teal)" }} /><CountUp to={86} prefix="+" suffix="% engagement" /></div>
            <div className="float-chip fc-2"><span className="fdot" style={{ background: "var(--coral)" }} />Jueves 7 PM · pico</div>
          </div>
        </div>
      </section>

      <div className="section-h">Genera contenido con IA en vivo</div>
      <LiveDemo />

      <div className="section-h">Tus cuentas conectadas</div>
      <div className="connect-cta" style={{ marginBottom: 18 }}>
        <button className="ig-connect" onClick={onConnect}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.3.07 1.69.07 4.9s0 3.6-.07 4.9c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.3.06-1.69.07-4.9.07s-3.6 0-4.9-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.4 2.21 8.8 2.2 12 2.2Zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4Zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3Zm6.85-11.2a1.54 1.54 0 1 0 1.55 1.54 1.54 1.54 0 0 0-1.55-1.54Z"/></svg>
          Conectar Instagram
        </button>
        <div className="hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#6E6B78" strokeWidth="2"/><path d="M12 8v5M12 16h.01" stroke="#6E6B78" strokeWidth="2" strokeLinecap="round"/></svg>
          <span>Tu cliente autoriza el acceso una vez con su cuenta Business o Creator. No se necesita página de Facebook.</span>
        </div>
      </div>

      <div className="section-h">Tus cuentas conectadas</div>
      <div className="clients-grid">
        {clients.map((cl) => (
          <button className="client-card" key={cl.id} onClick={() => onSelect(cl)}>
            <div className="client-av" style={{ background: `linear-gradient(135deg, ${cl.c1}, ${cl.c2})` }}>{cl.initials}</div>
            <div className="client-info">
              <b>{cl.name}</b>
              <span className="ch">@{cl.handle}</span>
            </div>
            <div className="client-meta">
              {cl.justConnected ? <span className="just">Recién conectada</span> : <><span className="cf">{cl.followers}</span><span className="cl2">seguidores</span></>}
            </div>
          </button>
        ))}
        <button className="client-card add" onClick={onConnect}>
          <div className="add-plus">＋</div>
          <div className="client-info"><b>Conectar otra cuenta</b><span className="ch">Añade un cliente nuevo</span></div>
        </button>
      </div>

      <div className="section-h">Analizar competencia</div>
      <div className="competitor">
        <div className="field">
          <span className="at">@</span>
          <input value={comp} onChange={(e) => setComp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onCompetitor(comp)} placeholder="cuenta_de_la_competencia" aria-label="Cuenta de competencia" />
          <button onClick={() => onCompetitor(comp)}>Analizar</button>
        </div>
        <div className="hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#6E6B78" strokeWidth="2"/><path d="M12 8v5M12 16h.01" stroke="#6E6B78" strokeWidth="2" strokeLinecap="round"/></svg>
          <span>De cuentas ajenas solo se pueden ver datos <b>públicos y limitados</b> (seguidores, publicaciones, posts recientes). El análisis completo requiere que la cuenta conecte con Pulso.</span>
        </div>
      </div>

      <div className="section-h">Cómo funciona</div>
      <div className="steps">
        <div className="step"><div className="sn">PASO 01</div><h4>Conecta la cuenta</h4><p>En un clic (o prueba con la cuenta demo). Sin instalar nada.</p></div>
        <div className="step"><div className="sn">PASO 02</div><h4>Recibe el diagnóstico</h4><p>Mejor horario, qué formato rinde y un estudio de mejoría priorizado.</p></div>
        <div className="step"><div className="sn">PASO 03</div><h4>Publica y crece</h4><p>Genera contenido optimizado y prográmalo en el calendario viral.</p></div>
      </div>

      <section className="pricing">
        <div className="pricing-h">
          <h2>Elige cómo quieres crecer</h2>
          <p>Empieza gratis con una auditoría. Sin permanencia.</p>
        </div>
        <div className="plans">
          {PLANS.map((pl) => (
            <div className={`plan ${pl.featured ? "featured" : ""}`} key={pl.name}>
              {pl.featured && <span className="badge">Más elegido</span>}
              <h3>{pl.name}</h3>
              <div className="price">{pl.price}<em>{pl.per}</em></div>
              <ul>{pl.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
              <button onClick={() => openLead(pl.name)}>{pl.cta}</button>
            </div>
          ))}
        </div>
      </section>

      <section className="ctaband">
        <div>
          <h2>¿Listo para volver <em>virales</em> a tus clientes?</h2>
          <p>Agenda una auditoría gratis y te mostramos exactamente qué cambiar esta semana.</p>
        </div>
        <button className="big" onClick={() => openLead("Auditoría gratis")}>Quiero mi auditoría gratis</button>
      </section>
    </>
  );
}

// ---------- dashboard ----------
function Dashboard({ client, mode, goGen, goCal, openLead, goConnect }) {
  const maxDay = Math.max(...DAYS.map((d) => d.v));
  const cl = client || { name: "Cuenta", handle: "cuenta", initials: "CU", c1: "#5B3DF5", c2: "#FF4D6D" };
  const isComp = mode === "competitor";

  return (
    <>
      {isComp ? (
        <div className="demo-flag" style={{ background: "#EFEBFF", color: "#3a2a8a" }}>🔍 <b>Modo competencia</b> — datos públicos limitados (Business Discovery)</div>
      ) : (
        <div className="demo-flag">● <b>Datos de demostración</b> — en producción, métricas reales vía la cuenta conectada</div>
      )}

      <div className="profile">
        <div className="avatar" style={{ background: `linear-gradient(135deg, ${cl.c1}, ${cl.c2})` }}>{cl.initials}</div>
        <div>
          <h2>{cl.name} {isComp && <span className="comp-badge">Competencia</span>}</h2>
          <div className="handle">@{cl.handle}</div>
        </div>
      </div>

      {isComp ? (
        <CompetitorView cl={cl} goConnect={goConnect} openLead={openLead} />
      ) : (
        <OwnerView cl={cl} maxDay={maxDay} goGen={goGen} goCal={goCal} openLead={openLead} />
      )}
    </>
  );
}

// vista de cuenta conectada (datos completos)
function OwnerView({ cl, maxDay, goGen, goCal, openLead }) {
  return (
    <>
      <div className="kpis">
        <div className="kpi"><div className="lab">Seguidores</div><div className="val">{cl.followers || "24.8k"}</div><div className="chg up">▲ 4.2% <span style={{color:"var(--muted)",fontWeight:400}}>14 días</span></div></div>
        <div className="kpi"><div className="lab">Alcance</div><div className="val">312k</div><div className="chg up">▲ 11.0%</div></div>
        <div className="kpi"><div className="lab">Engagement</div><div className="val">5.8%</div><div className="chg up">▲ 0.9 pts</div></div>
        <div className="kpi"><div className="lab">Guardados</div><div className="val">9.1k</div><div className="chg down">▼ 2.3%</div></div>
      </div>

      <div className="section-h">Cuándo publicar</div>
      <div className="grid-2">
        <div className="panel">
          <div className="panel-h"><h3>Mejor horario</h3><span className="tag">por engagement</span></div>
          <div className="panel-sub">Reloj de 24 h. El violeta intenso marca tus ventanas de mayor actividad.</div>
          <div className="clock-wrap"><RadialClock /></div>
          <div className="windows">
            <div className="window"><span className="rank">1</span><span className="time">7:00 – 9:00 PM</span><span className="meta">+86% engagement</span></div>
            <div className="window"><span className="rank">2</span><span className="time">12:00 – 1:00 PM</span><span className="meta">+52%</span></div>
            <div className="window"><span className="rank">3</span><span className="time">7:00 – 8:00 AM</span><span className="meta">+18%</span></div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-h"><h3>Mejor día</h3><span className="tag">últimos 90 días</span></div>
          <div className="panel-sub">El jueves concentra tu interacción más alta.</div>
          <div className="daybars">
            {DAYS.map((d) => (
              <div className="daybar" key={d.d}>
                <span className="d">{d.d}</span>
                <span className="track"><span className="fill" style={{ width: `${(d.v / maxDay) * 100}%`, background: d.v === maxDay ? "var(--coral)" : "var(--violet)" }} /></span>
                <span className="pct">{d.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-h">Qué rinde</div>
      <div className="panel">
        <div className="panel-h"><h3>Top publicaciones</h3><span className="tag">por engagement</span></div>
        <div className="panel-sub" style={{marginBottom:16}}>Los Reels lideran. Los carruseles generan los guardados.</div>
        <div className="posts">
          {POSTS.map((p, i) => (
            <div className="post" key={i}>
              <div className="thumb" style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}><span className="type">{p.type}</span></div>
              <div className="body"><div className="eng">{p.eng} <span style={{fontSize:12,color:"var(--muted)",fontWeight:500}}>interacciones</span></div><div className="sub">{p.sub}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-h">Estudio de mejoría</div>
      <div className="panel">
        <div className="score-ring">
          <ScoreRing score={72} />
          <div>
            <h3 style={{ fontFamily: "Space Grotesk", fontWeight: 600, fontSize: 19 }}>Salud de la cuenta: buena, con margen</h3>
            <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 6, maxWidth: "44ch" }}>Cuatro ajustes pueden subir tu alcance estimado un 30–40% en 30 días. Priorizados de mayor a menor impacto.</p>
          </div>
        </div>
        <div className="audit-list">
          {AUDIT.map((a, i) => (
            <div className="audit-item" key={i}>
              <span className="audit-dot" style={{ background: a.color }} />
              <div><h4>{a.h}</h4><p>{a.p}</p></div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
          <button className="gen-btn" onClick={goGen}>Generar contenido →</button>
          <button className="gen-btn" style={{ background: "var(--ink)" }} onClick={goCal}>Abrir calendario →</button>
          <button className="sched-btn" onClick={() => openLead("Crecimiento")}>Quiero que lo hagan por mí</button>
        </div>
      </div>
    </>
  );
}

// vista de competencia (solo datos públicos vía Business Discovery)
function CompetitorView({ cl, goConnect, openLead }) {
  return (
    <>
      <div className="kpis">
        <div className="kpi"><div className="lab">Seguidores</div><div className="val">31.5k</div><div className="chg" style={{ color: "var(--muted)" }}>público</div></div>
        <div className="kpi"><div className="lab">Publicaciones</div><div className="val">842</div><div className="chg" style={{ color: "var(--muted)" }}>público</div></div>
        <div className="kpi"><div className="lab">Engagement*</div><div className="val">~4.1%</div><div className="chg" style={{ color: "var(--muted)" }}>estimado</div></div>
        <div className="kpi"><div className="lab">Posts / semana</div><div className="val">5</div><div className="chg" style={{ color: "var(--muted)" }}>promedio</div></div>
      </div>

      <div className="section-h">Publicaciones recientes (públicas)</div>
      <div className="panel">
        <div className="panel-sub" style={{ marginBottom: 16 }}>Datos disponibles públicamente de esta cuenta profesional. Likes y comentarios de sus posts recientes.</div>
        <div className="posts">
          {POSTS.slice(0, 6).map((p, i) => (
            <div className="post" key={i}>
              <div className="thumb" style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}><span className="type">{p.type}</span></div>
              <div className="body"><div className="eng">{p.eng} <span style={{fontSize:12,color:"var(--muted)",fontWeight:500}}>interacciones</span></div><div className="sub" style={{ fontSize: 11.5 }}>público</div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-h">Análisis completo</div>
      <div className="panel locked">
        <div className="lock-ico">🔒</div>
        <h3>El análisis profundo requiere conexión</h3>
        <p>El mejor horario, la demografía de audiencia, el alcance real y el estudio de mejoría solo están disponibles para cuentas que conectan con Pulso. Meta no permite ver estos datos de cuentas ajenas.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 }}>
          <button className="gen-btn" onClick={goConnect}>Conectar una cuenta →</button>
          <button className="sched-btn" onClick={() => openLead("Crecimiento")}>Conviértela en cliente</button>
        </div>
      </div>
      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>* El engagement de competencia es una estimación a partir de datos públicos, no una métrica oficial de Meta.</p>
    </>
  );
}

// ---------- generator ----------
function Generator({ scheduleIdea, goCal, openLead, accountProfile, analyzing, activeClient, mode }) {
  const [niche, setNiche] = useState("Fitness");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("Crecer seguidores");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [scheduled, setScheduled] = useState({});
  // Si hay cuenta real analizada, generamos para ELLA (no por nicho genérico)
  const [useAccount, setUseAccount] = useState(true);

  const hasAccount = !!(accountProfile && mode === "owner");
  const forAccount = hasAccount && useAccount;

  // Cuando la IA detecta el nicho de la cuenta, preselecciona la categoría y la audiencia.
  useEffect(() => {
    if (!accountProfile) return;
    if (accountProfile.categoria && NICHES.includes(accountProfile.categoria)) setNiche(accountProfile.categoria);
    if (accountProfile.audiencia) setAudience(accountProfile.audiencia);
  }, [accountProfile]);

  const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  function handleSchedule(idea, i) { setScheduled((p) => ({ ...p, [i]: scheduleIdea(idea) })); }

  async function generate() {
    setLoading(true); setError(""); setIdeas([]); setScheduled({});
    try {
      let ideasOut = null;
      // 1) En producción: pide al backend (protege tu clave de Anthropic).
      try {
        const r = await fetch("/api/generar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ niche, audience, goal, account: forAccount ? accountProfile : null }),
        });
        if (r.ok) {
          const d = await r.json();
          if (d && Array.isArray(d.ideas) && d.ideas.length) ideasOut = d.ideas;
        }
      } catch (_) { /* sin backend: usamos el respaldo */ }

      // 2) Respaldo (vista previa sin backend): llamada directa.
      if (!ideasOut) {
        const prompt = `Eres un estratega de contenido senior para redes sociales. Genera 4 ideas de contenido para una cuenta del nicho "${niche}"${audience ? `, dirigida a: ${audience}` : ""}. Objetivo principal: ${goal}.

Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin markdown, sin backticks. Estructura exacta:
{"ideas":[{"titulo":"...","formato":"Reel|Carrusel|Historia|Post","gancho":"un hook de apertura potente de 1 frase","caption":"caption lista para publicar con saltos de línea \\n y 1-2 emojis","hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5"],"plataformas":["Instagram","TikTok","YouTube Shorts","Facebook","LinkedIn"],"por_que_funciona":"1 frase explicando el principio psicológico o de algoritmo"}]}

Las ideas deben ser específicas y accionables, no genéricas. Varía los formatos. Adapta plataformas según el tipo de contenido. Todo en español.`;
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1500, messages: [{ role: "user", content: prompt }] }),
        });
        const data = await res.json();
        let text = data.content.map((b) => (b.type === "text" ? b.text : "")).join("");
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(text);
        if (!parsed.ideas || !parsed.ideas.length) throw new Error("empty");
        ideasOut = parsed.ideas;
      }
      setIdeas(ideasOut);
    } catch (e) {
      setError("No se pudieron generar las ideas. Intenta de nuevo en un momento.");
    } finally { setLoading(false); }
  }

  return (
    <>
      <div className="gen-head">
        <h1>{forAccount ? "Ideas para esta cuenta" : "Ideas de contenido por nicho"}</h1>
        <p>{forAccount
          ? "Ideas hechas a la medida de la cuenta conectada — según su nicho real, su tono y su audiencia."
          : "Elige el nicho del cliente y obtén ideas listas para usar — con gancho, caption, hashtags y las plataformas donde mejor funciona cada una."}</p>
      </div>

      {analyzing && (
        <div className="acct-box analyzing">
          <span className="spin" /> Analizando la cuenta conectada para detectar su nicho…
        </div>
      )}

      {hasAccount && !analyzing && (
        <div className="acct-box">
          <div className="acct-top">
            <span className="acct-ig">@{accountProfile.username}</span>
            <span className="acct-tag">Nicho detectado</span>
            <label className="acct-switch">
              <input type="checkbox" checked={useAccount} onChange={(e) => setUseAccount(e.target.checked)} />
              <span>Personalizar para esta cuenta</span>
            </label>
          </div>
          <div className="acct-niche">{accountProfile.nicho || accountProfile.categoria}</div>
          {accountProfile.resumen && <div className="acct-sum">{accountProfile.resumen}</div>}
          <div className="acct-meta">
            {accountProfile.audiencia && <span><b>Audiencia:</b> {accountProfile.audiencia}</span>}
            {accountProfile.tono && <span><b>Tono:</b> {accountProfile.tono}</span>}
          </div>
          {Array.isArray(accountProfile.temas) && accountProfile.temas.length > 0 && (
            <div className="acct-temas">{accountProfile.temas.map((t, i) => <span key={i}>{t}</span>)}</div>
          )}
        </div>
      )}

      <div className="niche-row">
        {NICHES.map((n) => <button key={n} className={`chip ${niche === n ? "on" : ""}`} onClick={() => setNiche(n)}>{n}</button>)}
      </div>

      <div className="gen-controls">
        <div className="grp">
          <label>Audiencia objetivo <span style={{color:"var(--muted)",fontWeight:400}}>(opcional)</span></label>
          <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="ej. mujeres 25-40, principiantes" />
        </div>
        <div className="grp">
          <label>Objetivo</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option>Crecer seguidores</option><option>Más engagement</option><option>Generar ventas / leads</option><option>Construir autoridad</option><option>Más guardados y compartidos</option>
          </select>
        </div>
        <button className="gen-btn" onClick={generate} disabled={loading}>{loading ? "Generando…" : "Generar ideas"}</button>
      </div>

      {error && <div className="err">{error}</div>}

      {loading && (
        <div className="ideas">
          {[0,1,2].map((i) => (
            <div className="idea" key={i}>
              <div className="skel" style={{ height: 22, width: "55%" }} />
              <div className="skel" style={{ height: 14, width: "90%", marginTop: 16 }} />
              <div className="skel" style={{ height: 14, width: "80%", marginTop: 8 }} />
              <div className="skel" style={{ height: 60, width: "100%", marginTop: 16 }} />
            </div>
          ))}
        </div>
      )}

      {!loading && ideas.length > 0 && (
        <>
          <div className="ideas">
            {ideas.map((idea, i) => (
              <div className="idea" key={i}>
                <div className="idea-top">
                  <span className="idea-num">{i + 1}</span>
                  <div><h3>{idea.titulo}</h3><span className="fmt-badge">{idea.formato}</span></div>
                </div>
                <div className="hook"><div className="hook-lab">Gancho</div>{idea.gancho}</div>
                <div className="cap-block">
                  <div className="cap-lab">Caption lista para publicar</div>
                  <div className="cap">{idea.caption}</div>
                  <div className="tags">{(idea.hashtags || []).map((t, j) => <span className="tag-pill" key={j}>{t}</span>)}</div>
                  <div className="cap-actions">
                    <CopyButton text={idea.caption} label="Copiar caption" />
                    <CopyButton text={(idea.hashtags || []).join(" ")} label="Copiar hashtags" />
                    <CopyButton text={`${idea.caption}\n\n${(idea.hashtags || []).join(" ")}`} label="Copiar todo" />
                  </div>
                </div>
                <div className="platforms">{(idea.plataformas || []).map((p, j) => <span className="plat" key={j}>{p}</span>)}</div>
                <div className="why"><b>Por qué funciona:</b> {idea.por_que_funciona}</div>
                <div className="idea-actions">
                  {scheduled[i] ? (
                    <div className="sched-ok">
                      <span>✓ Programado para <b>{DAY_NAMES[scheduled[i].day]} · {fmtTime(scheduled[i].time)}</b></span>
                      <button onClick={goCal}>Ver en el calendario →</button>
                    </div>
                  ) : (
                    <button className="sched-btn" onClick={() => handleSchedule(idea, i)}>📅 Programar en horario óptimo</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <section className="ctaband" style={{ marginTop: 32 }}>
            <div>
              <h2>¿Prefieres que lo <em>creemos y programemos</em> por ti?</h2>
              <p>Nuestro equipo produce el contenido y lo deja listo en el calendario cada semana.</p>
            </div>
            <button className="big" onClick={() => openLead("Crecimiento")}>Hacer que lo hagan por mí</button>
          </section>
        </>
      )}
    </>
  );
}

// ---------- calendar ----------
function Calendar({ events, addEvent, removeEvent, fillOptimal, clearAll, onEdit, openLead, user }) {
  const maxDay = Math.max(...DAYS.map((d) => d.v));
  const topDay = DAYS.reduce((a, b, i) => (b.v > DAYS[a].v ? i : a), 0);
  const total = events.length;
  const viral = events.filter((e) => isPeak(e.time)).length;

  // Respaldo silencioso por si la librería de PDF no cargara.
  function exportCSV() {
    const rows = [["Dia", "Hora", "Formato", "Tema", "En_ventana_viral"]];
    [...events].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
      .forEach((e) => rows.push([WEEK_DAYS[e.day], fmtTime(e.time), e.format, `"${(e.title || "").replace(/"/g, "'")}"`, isPeak(e.time) ? "Sí" : "No"]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `calendario-${user || "pulso"}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ---------- Exportar el calendario como PDF con la marca Pulso ----------
  async function exportPDF() {
    let mod;
    try { mod = await import("jspdf"); }
    catch (_) { exportCSV(); return; }   // respaldo si la librería no está
    const { jsPDF } = mod;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 42;

    const rgb = (h) => { const n = parseInt(h.replace("#", ""), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
    const fill = (h) => doc.setFillColor(...rgb(h));
    const ink = (h) => doc.setTextColor(...rgb(h));
    const draw = (h) => doc.setDrawColor(...rgb(h));

    const C = { ink: "#16161C", muted: "#6E6B78", line: "#E8E5DE", violet: "#5B3DF5", soft: "#EFEBFF", paper: "#FAF9F6", row: "#F4F2EE" };

    const sorted = [...events].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
    const totalPosts = events.length;
    const viralPosts = events.filter((e) => isPeak(e.time)).length;
    const fecha = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });

    function header() {
      fill(C.violet); doc.roundedRect(M, 36, 24, 24, 7, 7, "F");
      doc.setFillColor(255, 255, 255); doc.circle(M + 12, 48, 4.4, "F");
      ink(C.ink); doc.setFont("helvetica", "bold"); doc.setFontSize(16);
      doc.text(BRAND.name, M + 32, 49);
      ink(C.muted); doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
      doc.text(BRAND.tagline, M + 32, 58);
      ink(C.muted); doc.setFontSize(9);
      doc.text("Calendario de contenido", W - M, 49, { align: "right" });
      draw(C.line); doc.setLineWidth(1); doc.line(M, 74, W - M, 74);
    }

    function footer(page, pages) {
      const y = H - 62;
      draw(C.line); doc.setLineWidth(1); doc.line(M, y, W - M, y);
      fill(C.violet); doc.roundedRect(M, y + 10, 13, 13, 4, 4, "F");
      doc.setFillColor(255, 255, 255); doc.circle(M + 6.5, y + 16.5, 2.4, "F");
      ink(C.ink); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
      doc.text(`${BRAND.name} · ${BRAND.tagline}`, M + 20, y + 20);
      ink(C.muted); doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
      const contacto = [BRAND.site, BRAND.email, BRAND.phone].filter(Boolean).join("   ·   ");
      if (contacto) doc.text(contacto, M + 20, y + 31);
      doc.text(BRAND.legal, M + 20, y + 41);
      doc.text(`Generado el ${fecha}`, W - M, y + 31, { align: "right" });
      doc.text(`Página ${page} de ${pages}`, W - M, y + 41, { align: "right" });
    }

    header();
    let y = 100;

    ink(C.ink); doc.setFont("helvetica", "bold"); doc.setFontSize(21);
    doc.text("Calendario de contenido", M, y); y += 17;
    ink(C.muted); doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    doc.text(`@${user || "cuenta"}   ·   Plan semanal`, M, y); y += 22;

    const boxW = (W - M * 2 - 16) / 3;
    [[String(totalPosts), "publicaciones"], [String(viralPosts), "en ventana viral"], [WEEK_FULL[topDay], "mejor día"]]
      .forEach((s, i) => {
        const x = M + i * (boxW + 8);
        fill(C.paper); draw(C.line); doc.setLineWidth(1);
        doc.roundedRect(x, y, boxW, 46, 8, 8, "FD");
        ink(i === 1 ? C.violet : C.ink); doc.setFont("helvetica", "bold"); doc.setFontSize(15);
        doc.text(s[0], x + 12, y + 23);
        ink(C.muted); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
        doc.text(s[1], x + 12, y + 36);
      });
    y += 62;

    fill(C.soft); doc.roundedRect(M, y, W - M * 2, 36, 8, 8, "F");
    ink(C.violet); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
    doc.text("Ventana viral: 7:00 - 9:00 PM", M + 14, y + 15);
    ink(C.muted); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
    doc.text("Las publicaciones marcadas como VIRAL caen en la franja de mayor engagement de la cuenta.", M + 14, y + 27);
    y += 52;

    WEEK_FULL.forEach((dn, di) => {
      const dayEvents = sorted.filter((e) => e.day === di);
      const need = 26 + Math.max(dayEvents.length, 1) * 22 + 8;
      if (y + need > H - 90) { doc.addPage(); header(); y = 100; }

      const isTop = di === topDay;
      fill(isTop ? C.soft : C.row);
      doc.roundedRect(M, y, W - M * 2, 22, 5, 5, "F");
      ink(isTop ? C.violet : C.ink); doc.setFont("helvetica", "bold"); doc.setFontSize(10);
      doc.text(isTop ? `${dn}  ·  mejor día` : dn, M + 10, y + 15);
      ink(C.muted); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      doc.text(`Hora óptima ${fmtTime(DAY_OPTIMAL[di])}`, W - M - 10, y + 15, { align: "right" });
      y += 26;

      if (!dayEvents.length) {
        ink(C.muted); doc.setFont("helvetica", "italic"); doc.setFontSize(9);
        doc.text("Sin publicaciones programadas", M + 12, y + 12);
        y += 22;
      } else {
        dayEvents.forEach((e) => {
          const c = FMT_COLORS[e.format] || FMT_COLORS.Post;
          ink(C.ink); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
          doc.text(fmtTime(e.time), M + 12, y + 13);

          const label = String(e.format || "Post").toUpperCase();
          doc.setFont("helvetica", "bold"); doc.setFontSize(7);
          const bw = doc.getTextWidth(label) + 12;
          fill(c.bg); doc.roundedRect(M + 74, y + 3, bw, 13, 3.5, 3.5, "F");
          doc.setTextColor(255, 255, 255);
          doc.text(label, M + 80, y + 12);

          const tx = M + 74 + bw + 10;
          const peak = isPeak(e.time);
          const maxW = W - M - tx - (peak ? 58 : 14);
          ink(C.ink); doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
          const lines = doc.splitTextToSize(String(e.title || ""), Math.max(maxW, 60));
          let linea = lines[0] || "";
          if (lines.length > 1) linea = linea.replace(/\s+\S*$/, "") + "...";
          doc.text(linea, tx, y + 13);

          if (peak) {
            doc.setFont("helvetica", "bold"); doc.setFontSize(6.5);
            const vw = doc.getTextWidth("VIRAL") + 12;
            fill(C.violet); doc.roundedRect(W - M - 12 - vw, y + 4, vw, 12, 3, 3, "F");
            doc.setTextColor(255, 255, 255);
            doc.text("VIRAL", W - M - 12 - vw + 6, y + 12.4);
          }

          draw("#F0EEE9"); doc.setLineWidth(0.5);
          doc.line(M + 12, y + 20, W - M - 12, y + 20);
          y += 22;
        });
      }
      y += 8;
    });

    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) { doc.setPage(i); footer(i, pages); }
    doc.save(`calendario-${user || "pulso"}.pdf`);
  }

  return (
    <>
      <div className="cal-head">
        <h1>Calendario de contenido</h1>
        <p>Cada publicación en su día y hora exactos para maximizar alcance. Toca cualquier tarjeta para editar el tema, la hora o el formato. Las casillas con borde violeta caen en tu ventana viral (7–9 p.m.).</p>
      </div>

      <div className="cal-summary">
        <div className="cal-stat"><div className="n">{total} <em>publicaciones</em></div><div className="l">esta semana</div></div>
        <div className="cal-stat"><div className="n viral">{viral} <em>en ventana viral</em></div><div className="l">7–9 p.m.</div></div>
        <div className="cal-stat"><div className="n">{WEEK_DAYS[topDay]}</div><div className="l">tu mejor día</div></div>
      </div>

      <div className="viral-banner">
        <span className="ico">⚡</span>
        <div>
          <h4>Estrategia para volverte viral</h4>
          <p>Publica tus Reels el jueves entre 7 y 9 p.m. (tu día y hora pico), y reserva los carruseles educativos para el mediodía. La constancia en estas franjas entrena al algoritmo.</p>
        </div>
      </div>

      <div className="cal-toolbar">
        <button className="primary" onClick={fillOptimal}>⚡ Llenar en horarios óptimos</button>
        <button onClick={exportPDF}>⬇ Descargar PDF</button>
        <button onClick={clearAll}>Vaciar semana</button>
      </div>

      <div className="week">
        {WEEK_DAYS.map((dn, di) => {
          const dayEvents = events.filter((e) => e.day === di).sort((a, b) => a.time.localeCompare(b.time));
          const eng = DAYS[di].v;
          return (
            <div className={`daycol ${di === topDay ? "top" : ""}`} key={di}>
              <div className="daycol-h"><span className="dn">{dn}</span>{di === topDay && <span className="flame" title="Tu mejor día">🔥</span>}</div>
              <div className="day-eng"><span className="track"><span className="fill" style={{ width: `${(eng / maxDay) * 100}%` }} /></span><span className="v">{eng}</span></div>
              <span className="opt-chip">óptimo · {fmtTime(DAY_OPTIMAL[di])}</span>
              <div className="evts">
                {dayEvents.map((e) => {
                  const c = FMT_COLORS[e.format] || FMT_COLORS.Post;
                  const peak = isPeak(e.time);
                  return (
                    <div className={`evt ${peak ? "peak" : ""}`} key={e.id} style={{ background: c.soft }} onClick={() => onEdit(e)}>
                      <button className="rm" onClick={(ev) => { ev.stopPropagation(); removeEvent(e.id); }} aria-label="Quitar">×</button>
                      <span className="efmt" style={{ background: c.bg }}>{e.format}</span>
                      <div className="etime">{fmtTime(e.time)}</div>
                      <div className="etitle">{e.title}</div>
                      {peak && <div className="viral-tag">⚡ Ventana viral</div>}
                      {e.published && <div className="pub-tag">✓ Publicado</div>}
                      <div className="edit-hint">Toca para editar</div>
                    </div>
                  );
                })}
              </div>
              <button className="evt-add" onClick={() => addEvent(di)}>+ Programar</button>
            </div>
          );
        })}
      </div>

      <div className="legend">
        <span><i style={{ background: "#5B3DF5" }} />Reel</span>
        <span><i style={{ background: "#FF4D6D" }} />Carrusel</span>
        <span><i style={{ background: "#00B596" }} />Historia</span>
        <span><i style={{ background: "#FFB02E" }} />Post</span>
        <span><i style={{ background: "#fff", boxShadow: "0 0 0 2px #5B3DF5" }} />Ventana viral (7–9 p.m.)</span>
      </div>

      <section className="ctaband" style={{ marginTop: 40 }}>
        <div>
          <h2>Deja que Pulso llene tu calendario <em>cada semana</em></h2>
          <p>Contenido creado y programado por nosotros en tus horarios pico. Tú solo apruebas.</p>
        </div>
        <button className="big" onClick={() => openLead("Agencia Total")}>Quiero mi calendario listo</button>
      </section>
    </>
  );
}

// ---------- connect Instagram modal ----------
function ConnectModal({ onClose, onSimulate }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Cerrar">×</button>
        <h3>Conectar Instagram</h3>
        <p className="sub">Así funciona en la versión real, con la API oficial de Meta.</p>
        <div className="connect-steps">
          <div className="cstep"><span>1</span><div><b>Tu cliente inicia sesión</b><p>Con su cuenta Business o Creator. No necesita página de Facebook.</p></div></div>
          <div className="cstep"><span>2</span><div><b>Autoriza el acceso una vez</b><p>Pulso recibe un token seguro para leer sus métricas y publicar.</p></div></div>
          <div className="cstep"><span>3</span><div><b>La cuenta aparece en tu panel</b><p>La administras junto a tus demás clientes, sin volver a entrar a su Instagram.</p></div></div>
        </div>
        <div className="modal-note">Al pulsar el botón, tu cliente inicia sesión en Instagram y autoriza a Pulso. Si aún no has desplegado el backend, usa "Simular" para ver el flujo.</div>
        <a className="send" href="/api/instagram/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, textDecoration: "none", background: "linear-gradient(95deg,#5B3DF5,#C13584 55%,#FF4D6D)" }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.3.07 1.69.07 4.9s0 3.6-.07 4.9c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.3.06-1.69.07-4.9.07s-3.6 0-4.9-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.4 2.21 8.8 2.2 12 2.2Zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4Zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3Zm6.85-11.2a1.54 1.54 0 1 0 1.55 1.54 1.54 1.54 0 0 0-1.55-1.54Z"/></svg>
          Conectar con Instagram
        </a>
        <button className="danger" onClick={onSimulate} style={{ marginTop: 4 }}>Simular una conexión (demo)</button>
      </div>
    </div>
  );
}

// ---------- lead capture modal ----------
function LeadModal({ lead, onClose, whatsapp }) {
  const [name, setName] = useState("");
  const [ig, setIg] = useState("");
  const [contact, setContact] = useState("");
  const [plan, setPlan] = useState(lead.plan);
  const [sent, setSent] = useState(false);

  const valid = name.trim() && contact.trim();
  const waText = encodeURIComponent(`Hola, soy ${name || "(nombre)"}. Me interesa el plan "${plan}" de Pulso. Mi Instagram: @${ig || "(usuario)"}. Contacto: ${contact}`);

  function submit() {
    if (!valid) return;
    // Demo: aquí, en producción, enviarías estos datos a tu backend / CRM.
    setSent(true);
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Cerrar">×</button>
        {!sent ? (
          <>
            <h3>Solicita tu {plan.toLowerCase().includes("auditor") ? "auditoría gratis" : "plan"}</h3>
            <p className="sub">Déjanos tus datos y te contactamos para empezar. Sin compromiso.</p>
            <span className="plan-tag">Plan: {plan}</span>
            <div className="form">
              <div><label>Tu nombre</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre y apellido" /></div>
              <div className="row2">
                <div><label>Instagram <span>(opcional)</span></label><input value={ig} onChange={(e) => setIg(e.target.value)} placeholder="@usuario" /></div>
                <div>
                  <label>Plan</label>
                  <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                    {PLANS.map((p) => <option key={p.name}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div><label>Email o WhatsApp</label><input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="tu@correo.com o +57..." /></div>
              <button className="send" onClick={submit} disabled={!valid}>Enviar solicitud</button>
              <a className="send" style={{ background: "#25D366", textAlign: "center", textDecoration: "none", display: "block" }} href={`https://wa.me/${whatsapp}?text=${waText}`} target="_blank" rel="noreferrer">O escríbenos por WhatsApp</a>
            </div>
          </>
        ) : (
          <div className="sent">
            <div className="big-check">✓</div>
            <h4>¡Solicitud recibida!</h4>
            <p>Gracias, {name.split(" ")[0]}. Te contactaremos muy pronto para tu plan <b>{plan}</b>. Si quieres agilizar, escríbenos ahora por WhatsApp.</p>
            <a className="send" style={{ background: "#25D366", textAlign: "center", textDecoration: "none", display: "block", marginTop: 16 }} href={`https://wa.me/${whatsapp}?text=${waText}`} target="_blank" rel="noreferrer">Abrir WhatsApp</a>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- edit event modal ----------
function EditEventModal({ event, onClose, onSave, onDelete, onPublish }) {
  const [title, setTitle] = useState(event.title);
  const [day, setDay] = useState(event.day);
  const [time, setTime] = useState(event.time);
  const [format, setFormat] = useState(event.format);
  const [caption, setCaption] = useState(event.caption || "");
  const [mediaUrl, setMediaUrl] = useState(event.mediaUrl || "");
  const [uploading, setUploading] = useState(false);
  const [pubState, setPubState] = useState(null); // null | "loading" | {ok,error,demo}

  const current = { ...event, title, day, time, format, caption, mediaUrl };

  async function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const r = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (!r.ok) throw new Error("no-backend");
      const { uploadUrl, publicUrl } = await r.json();
      await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      setMediaUrl(publicUrl);
    } catch (err) {
      // Sin almacenamiento configurado: vista previa local (no sirve para publicar de verdad).
      setMediaUrl(URL.createObjectURL(file));
    } finally {
      setUploading(false);
    }
  }

  async function publish() {
    setPubState("loading");
    const res = await onPublish(current);
    setPubState(res);
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Cerrar">×</button>
        <h3>Editar publicación</h3>
        <p className="sub">Ajusta el contenido y publícalo en Instagram cuando esté listo.</p>
        <div className="form">
          <div><label>Tema</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tema de la publicación" /></div>
          <div className="row2">
            <div>
              <label>Día</label>
              <select value={day} onChange={(e) => setDay(Number(e.target.value))}>
                {WEEK_DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
              </select>
            </div>
            <div><label>Hora</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
          </div>
          <div>
            <label>Formato</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              {FMT_CYCLE.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div><label>Caption</label><textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} placeholder="Texto de la publicación…" style={{ resize: "vertical", fontFamily: "inherit" }} /></div>
          <div>
            <label>Media <span style={{ color: "var(--muted)", fontWeight: 400 }}>(imagen o video)</span></label>
            <input type="file" accept="image/*,video/*" onChange={handleFile} style={{ padding: "10px 0", border: 0 }} />
            {uploading && <div style={{ fontSize: 12.5, color: "var(--violet)", fontWeight: 600 }}>Subiendo archivo…</div>}
          </div>
          <div>
            <label>…o pega una URL pública</label>
            <input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://…/imagen.jpg o video.mp4" />
            {mediaUrl && !uploading && <div style={{ fontSize: 12, color: "var(--teal)", fontWeight: 600, marginTop: 6 }}>✓ Media lista</div>}
          </div>
          {isPeak(time) && <div style={{ fontSize: 12.5, color: "var(--violet)", fontWeight: 600 }}>⚡ Cae en tu ventana viral (7–9 p.m.)</div>}

          {pubState && pubState !== "loading" && (
            <div className={pubState.ok ? "pub-ok" : "pub-err"}>
              {pubState.ok
                ? (pubState.demo ? "✓ Publicación simulada (sin backend). En producción se publicaría en Instagram." : "✓ ¡Publicado en Instagram!")
                : (pubState.error || "No se pudo publicar.")}
            </div>
          )}

          <button className="send" onClick={() => onSave(current)}>Guardar cambios</button>
          <button className="send" style={{ background: "linear-gradient(95deg,#5B3DF5,#C13584 55%,#FF4D6D)" }} onClick={publish} disabled={pubState === "loading" || format === "Historia"}>
            {pubState === "loading" ? "Publicando…" : format === "Historia" ? "Las Historias no se publican por API" : "📤 Publicar ahora en Instagram"}
          </button>
          <button className="danger" onClick={() => onDelete(event.id)}>Eliminar publicación</button>
        </div>
      </div>
    </div>
  );
}
