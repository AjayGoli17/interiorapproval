/* =====================================================================
   ipcs-sync.js  -  shared data layer for the 3 panels (prototype, localStorage only)

   Canonical store : localStorage['ipcs.demo.v2']   (the Admin panel's own schema)
   Admin panel     : reads/writes the store natively (only needs a storage listener)
   PM panel        : IPCS.pm.open() / IPCS.pm.save()      (adapter: PM shape <-> store)
   Client portal   : IPCS.client.open() / IPCS.client.save()

   Rules the adapters follow
   - Never localStorage.clear(); only the ipcs.* keys are touched.
   - Writes are 3-way merges (native now vs. native at last sync vs. store now):
     only fields the panel actually changed are written, so a stale tab cannot
     overwrite someone else's edit, and items are never duplicated.
   - Extra data the Admin schema has no slot for lives in optional keys
     (task.blocked, design.comments, c.pmx, c.portal ...). Admin ignores them.
   ===================================================================== */
(function (G) {
  'use strict';
  const KEY = 'ipcs.demo.v2', PICK = 'ipcs.portal.client', DAY = 864e5;
  const pad = n => String(n).padStart(2, '0');
  const iso = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const days = s => { const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((new Date(s + 'T00:00:00') - t) / DAY); };
  const J = JSON.stringify, clone = o => JSON.parse(J(o)), same = (a, b) => J(a) === J(b);
  const num = id => parseInt(String(id).replace(/\D/g, ''), 10) || 0;
  const nid = (pre, arr, base = 0) => pre + (Math.max(base, ...arr.map(x => num(x.id))) + 1);
  const rid = () => Date.now() + Math.random().toString(36).slice(2, 6);
  const arr = v => (Array.isArray(v) ? v : []);

  let syncChan = null;
  try { if (typeof BroadcastChannel !== 'undefined') syncChan = new BroadcastChannel('ipcs_sync'); } catch (e) {}
  function broadcastSync() { try { if (syncChan) syncChan.postMessage({ type: 'sync', key: KEY }); } catch (e) {} }

  function read() { try { const o = JSON.parse(localStorage.getItem(KEY)); return o && o.v === 2 && Array.isArray(o.projects) ? o : null; } catch (e) { return null; } }
  function write(c) { try { localStorage.setItem(KEY, J(c)); broadcastSync(); return true; } catch (e) { return false; } }

  /* ---- same side effects the Admin panel produces (activity feed + notification bell) ---- */
  const log = (c, type, text, pid) => { (c.activity = arr(c.activity)).unshift({ id: 'A-' + rid(), type, text, projectId: pid, at: new Date().toISOString() }); };
  const notify = (c, type, title, pid, link) => {
    const k = type === 'handover' ? 'delay' : type; if (c.settings && c.settings.notify && c.settings.notify[k] === false) return;
    (c.notifications = arr(c.notifications)).unshift({ id: 'N-' + rid(), key: 'ev:' + rid(), type, title, projectId: pid, link, at: new Date().toISOString(), read: false });
  };
  const hist = (d, text) => { (d.history = arr(d.history)).push({ at: iso(), text }); d.updated = iso(); };
  const START = { Design: 5, 'Client Approval': 25, Procurement: 45, 'Site Execution': 60, Handover: 90 };
  const MS_NAMES = ['Concept & design', 'Client approval', 'Material procurement', 'Site execution', 'Handover'];
  const proj = (c, id) => c.projects.find(p => p.id === id);
  const team = (c, id) => c.team.find(t => t.id === id) || {};
  const spent = (c, pid) => arr(c.expenses).filter(e => e.projectId === pid).reduce((a, e) => a + (e.amount || 0), 0);
  const nextMs = (c, pid) => arr(c.milestones).filter(m => m.projectId === pid && !m.actual).sort((a, b) => a.idx - b.idx)[0];

  /* same rules Admin applies when site tasks move / designs are decided */
  function rollProgress(c, pid) {
    const p = proj(c, pid); if (!p || p.stage !== 'Site Execution') return;
    const all = c.tasks.filter(x => x.projectId === pid); if (!all.length) return;
    p.progress = Math.max(p.progress, Math.min(98, Math.round(60 + 35 * all.filter(x => x.status === 'Done').length / all.length)));
  }
  function afterDecision(c, d) {
    const p = proj(c, d.projectId), all = c.designs.filter(x => x.projectId === p.id);
    if (p.status === 'active' && ['Design', 'Client Approval'].includes(p.stage) && all.every(x => x.status === 'Approved')) {
      p.stage = 'Procurement'; p.progress = Math.max(p.progress, START.Procurement); log(c, 'project', 'All designs approved, moved to Procurement', p.id);
    }
  }
  /* design status side effects, shared by PM + Client (and identical to Admin's d-send / d-approve / d-revise) */
  function designChanged(c, d, ch, who) {
    const p = proj(c, d.projectId); if (!p || !ch) return;
    if (ch.version && !ch.status) hist(d, `v${d.version} uploaded`);
    if (ch.status === 'Sent') {
      d.sentOn = d.updated = iso(); d.remindedOn = null; hist(d, `v${d.version} sent to client`);
      if (p.status === 'active' && p.stage === 'Design') { p.stage = 'Client Approval'; p.approvalSince = iso(); p.progress = Math.max(p.progress, START['Client Approval']); }
      log(c, 'approval', `${d.room} design v${d.version} sent to client`, p.id);
    } else if (ch.status === 'Approved') {
      hist(d, `v${d.version} approved by client`); log(c, 'approval', `${d.room} design v${d.version} approved by client`, p.id);
      notify(c, 'approval', `Client approved ${d.room} design for ${p.name}`, p.id, '#design?p=' + p.id); afterDecision(c, d);
    } else if (ch.status === 'Revision') {
      hist(d, 'Client requested revision' + (d.note ? ': ' + d.note : '')); log(c, 'approval', `${d.room}: client requested a revision`, p.id);
      notify(c, 'approval', `Revision requested on ${d.room}, ${p.name}`, p.id, '#design?status=Revision');
    } else if (ch.status === 'Draft') hist(d, `v${d.version} saved as draft (${who})`);
  }

  /* ---- generic 3-way reconcile of one entity list ---------------------------------
     list = store array (mutated) | nat = panel's current items | base = panel items at last sync
     E = { pre, mk(n), toC(n), after(rec, n, changes|null) }  -> returns {oldId:newId} for new items */
  function reconcile(list, nat, base, E) {
    const bm = new Map(base.map(x => [x.id, x])), seen = new Set(nat.map(x => x.id)), idMap = {};
    nat.forEach(n => {
      const b = bm.get(n.id); let r = list.find(x => x.id === n.id);
      if (!r) {
        if (b) return;                                   // removed elsewhere meanwhile: do not resurrect
        const old = n.id; r = E.mk(n); r.id = nid(E.pre, list, E.base || 0); Object.assign(r, E.toC(n)); list.push(r);
        n.id = r.id; idMap[old] = r.id; if (E.after) E.after(r, n, null); return;
      }
      const nc = E.toC(n), bc = b ? E.toC(b) : {}, ch = {};
      Object.keys(nc).forEach(k => { if (!same(nc[k], bc[k])) ch[k] = nc[k]; });
      if (Object.keys(ch).length) { Object.assign(r, ch); if (E.after) E.after(r, n, ch); }
    });
    base.forEach(b => { if (!seen.has(b.id)) { const i = list.findIndex(x => x.id === b.id); if (i >= 0) list.splice(i, 1); E.removed && E.removed(b); } });
    return idMap;
  }

  /* =====================================================================
     PROJECT MANAGER PANEL
     native: { p:[{id,n,st,b:[spent,budget](k INR),ms:[name,days],rooms,nx,pg,cid,custom}],
               t:[task], d:[design], m:[material], i:[site item], cl:{}, ucl:{} }
     ===================================================================== */
  const PM_ST = { Design: 'Design Development', 'Client Approval': 'Design Development', Procurement: 'Execution', 'Site Execution': 'Execution', Handover: 'Handover Prep' };
  const PM_ST_BACK = { 'Design Development': 'Design', Execution: 'Site Execution', 'Handover Prep': 'Handover' };
  const T_C = { todo: 'To do', prog: 'In progress', blocked: 'To do', done: 'Done' }, PRI_C = { High: 'High', Med: 'Medium', Low: 'Low' }, PRI_N = { High: 'High', Medium: 'Med', Low: 'Low' };
  const D_C = { prep: 'Draft', await: 'Sent', changes: 'Revision', approved: 'Approved' }, D_N = { Draft: 'prep', Sent: 'await', Revision: 'changes', Approved: 'approved' };
  const SV_C = { high: 'High', med: 'Medium', low: 'Low' }, SV_N = { High: 'high', Medium: 'med', Low: 'low' };
  const verNum = v => parseInt(String(v).replace(/\D/g, ''), 10) || 1;

  function pmEnts(c) {
    const tid = name => (c.team.find(t => t.name === name) || {}).id || '';
    const sup = r => { if (!r.supplierName) return; let s = arr(c.suppliers).find(x => x.name.toLowerCase() === r.supplierName.toLowerCase());
      if (!s) { (c.suppliers = arr(c.suppliers)).push(s = { id: nid('S-', c.suppliers), name: r.supplierName, category: 'General', area: '-', contact: '-', phone: '', custom: true }); } r.supplierId = s.id; };
    return {
      t: { pre: 'TK-',
        mk: n => ({ projectId: n.p, progress: 0, custom: true, desc: n.desc || '' }),
        toC: n => ({ title: n.t, room: n.r, assignee: tid(n.o), priority: PRI_C[n.pr] || 'Medium', status: T_C[n.s] || 'To do', blocked: n.s === 'blocked', auto: !!n.auto, due: n.d, designId: n.ds || '', materialId: n.m || '', desc: n.desc || '' }),
        after(r, n, ch) {
          if (!ch || ch.status) r.progress = r.status === 'Done' ? 100 : r.status === 'To do' ? 0 : Math.max(40, r.progress > 0 && r.progress < 100 ? r.progress : 50);
          if (!ch) { log(c, 'task', `Task added: ${r.title}`, r.projectId); notify(c, 'task', `New task: ${r.title}, ${(proj(c, r.projectId) || {}).name}`, r.projectId, '#site?tab=tasks&p=' + r.projectId); }
          else if (ch.status === 'Done') log(c, 'task', `Task completed: ${r.title}`, r.projectId);
          rollProgress(c, r.projectId);
        }, removed: b => rollProgress(c, b.p) },
      d: { pre: 'D-',
        mk: n => { const p = proj(c, n.p) || {}; return { projectId: n.p, room: n.r || (arr(p.rooms)[0]) || 'General', designer: p.pmId || '', sentOn: null, remindedOn: null, history: [], comments: [], custom: true }; },
        toC: n => ({ title: n.t, version: verNum(n.v), status: D_C[n.s] || 'Draft', note: n.f || '' }),
        after(r, n, ch) { if (!ch) { hist(r, `v${r.version} uploaded: created by project manager`); log(c, 'approval', `New design item: ${r.room}`, r.projectId); if (r.status !== 'Draft') designChanged(c, r, { status: r.status }, 'PM'); } else designChanged(c, r, ch, 'PM'); } },
      m: { pre: 'PO-', base: 2040,
        mk: n => ({ projectId: n.p, materialId: '', amount: 0, delivered: null, custom: true }),
        toC: n => { const q = /^\s*([\d.,]+)\s*(.*)$/.exec(n.q || ''), s = n.s; return { item: n.n, room: n.r, supplierName: n.sp, qtyText: n.q, qty: q ? parseFloat(q[1].replace(/,/g, '')) || 1 : 1, unit: q && q[2] ? q[2] : 'unit', expected: n.e,
          status: s === 'delivered' ? 'Delivered' : s === 'delayed' ? 'Delayed' : s === 'partial' ? 'Dispatched' : 'Ordered', toOrder: s === 'toorder', partial: s === 'partial' }; },
        after(r, n, ch) { sup(r); r.delivered = r.status === 'Delivered' ? (r.delivered || iso()) : null;
          if (!ch) { log(c, 'material', `Material added: ${r.item}`, r.projectId); } else if (ch.status === 'Delayed') notify(c, 'procurement', `Delivery delayed: ${r.item} for ${(proj(c, r.projectId) || {}).name}`, r.projectId, '#procurement?status=Delayed'); } },
      i: { pre: 'IS-',
        mk: n => ({ projectId: n.p, raised: iso(), owner: (proj(c, n.p) || {}).pmId || '', custom: true }),
        toC: n => ({ title: n.t, room: n.r, severity: SV_C[n.sv] || 'Medium', status: n.s === 'resolved' ? 'Resolved' : 'Open', inProgress: n.s === 'prog', kind: n.y }),
        after(r, n, ch) { if (!ch) log(c, 'task', `Site item logged: ${r.title}`, r.projectId); } }
    };
  }
  function pmProj(c, p) {
    const m = nextMs(c, p.id);
    return { id: p.id, n: p.name, st: PM_ST[p.stage] || 'Execution', b: [Math.round(spent(c, p.id) / 1000), Math.max(1, Math.round((p.budget || 0) / 1000))],
      ms: m ? [m.name, days(m.planned)] : ['Handover', days(p.handoverOn)], rooms: arr(p.rooms).slice(), nx: p.nextAction || 'Review open approvals and tasks', pg: p.progress, cid: p.clientId, custom: !!p.pmCreated };
  }
  const PM = {
    open() {
      const c = read(); if (!c) return null;
      const only = new URLSearchParams(location.search).get('pm');
      const ps = c.projects.filter(p => !p.archived && ['active', 'on_hold'].includes(p.status) && (!only || p.pmId === only || c.tasks.some(t => t.projectId === p.id && t.assignee === only))), ids = new Set(ps.map(p => p.id));
      const S = { p: ps.map(p => pmProj(c, p)), cl: {}, ucl: {}, t: [], d: [], m: [], i: [] };
      S.t = c.tasks.filter(x => ids.has(x.projectId) && (!only || x.assignee === only || (proj(c, x.projectId) || {}).pmId === only)).map(x => ({ id: x.id, t: x.title, p: x.projectId, r: x.room || '-', o: team(c, x.assignee).name || 'Unassigned', pr: PRI_N[x.priority] || 'Med', d: x.due,
        s: x.status === 'Done' ? 'done' : x.blocked ? 'blocked' : x.status === 'In progress' ? 'prog' : 'todo', ds: x.designId || '', m: x.materialId || '', desc: x.desc || '', custom: !!x.custom, ...(x.auto ? { auto: 1 } : {}) }));
      S.d = c.designs.filter(x => ids.has(x.projectId)).map(x => ({ id: x.id, t: x.title || x.room, p: x.projectId, v: 'v' + x.version, s: D_N[x.status] || 'prep', f: x.note || '', r: x.room, custom: !!x.custom }));
      S.m = c.pos.filter(x => ids.has(x.projectId)).map(x => ({ id: x.id, n: x.item, p: x.projectId, r: x.room || '-', sp: x.supplierName || ((c.suppliers || []).find(s => s.id === x.supplierId) || {}).name || '-', q: x.qtyText || `${x.qty} ${x.unit}`, e: x.expected,
        s: x.status === 'Delivered' ? 'delivered' : x.status === 'Delayed' ? 'delayed' : x.partial ? 'partial' : x.toOrder ? 'toorder' : 'ordered', custom: !!x.custom }));
      S.i = c.issues.filter(x => ids.has(x.projectId)).map(x => ({ id: x.id, p: x.projectId, r: x.room || '-', t: x.title, sv: SV_N[x.severity] || 'med', s: x.status === 'Resolved' ? 'resolved' : x.inProgress ? 'prog' : 'open', y: x.kind || 'Issue', custom: !!x.custom }));
      ps.forEach(p => { const x = c.pmx || {}; S.cl[p.id] = ((x.cl || {})[p.id] || [0, 0, 0, 0, 0, 0]).slice(); S.ucl[p.id] = clone((x.ucl || {})[p.id] || []); });
      return { state: S, base: clone(S), owners: c.team.map(t => t.name), skipped: ps.length === 0 };
    },
    save(link, S) {
      const c = read(); if (!c) return false; const B = link.base, E = pmEnts(c);
      /* 1. projects created / deleted in the PM panel */
      const lead = (c.team.find(t => t.lead) || c.team[0] || {}).id, pmap = {};
      S.p.forEach(n => { if (c.projects.some(p => p.id === n.id)) return; if (B.p.some(b => b.id === n.id)) return;
        const budget = Math.round(n.b[1] * 1000), st = PM_ST_BACK[n.st] || 'Site Execution', old = n.id, id = nid('P-', c.projects, 100), ho = iso(new Date(Date.now() + 120 * DAY));
        const p = { id, name: n.n, location: '-', clientId: n.cid || '', type: 'Apartment', stage: st, status: 'active', progress: START[st] || 0, pmId: lead, createdOn: iso(), handoverOn: ho, completedOn: null, approvalSince: null, archived: false,
          value: Math.round(budget / 0.82 / 1000) * 1000, budget, rooms: n.rooms.slice(), delayReason: '', custom: true, pmCreated: true, nextAction: n.nx };
        c.projects.push(p); pmap[old] = id; n.id = id;
        const span = 120; [0.2, 0.35, 0.6, 0.88, 1].forEach((f, k) => c.milestones.push({ id: nid('M-', c.milestones), projectId: id, name: MS_NAMES[k], planned: iso(new Date(Date.now() + span * f * DAY)), actual: null, idx: k, reason: '', custom: true }));
        c.invoices.push({ id: nid('INV-', c.invoices, 1000), projectId: id, title: 'Booking advance', amount: Math.round(p.value * .2), issued: iso(), due: iso(new Date(Date.now() + 15 * DAY)), sent: false, custom: true });
        if (n.b[0] > 0) c.expenses.push({ id: nid('E-', c.expenses), projectId: id, category: 'Materials', desc: 'Opening spend entered by project manager', vendor: '-', amount: Math.round(n.b[0] * 1000), date: iso() });
        log(c, 'project', 'Project created', id); });
      B.p.forEach(b => { if (S.p.some(n => n.id === b.id)) return; const p = proj(c, b.id); if (!p || !p.pmCreated) return; const id = b.id;
        c.projects = c.projects.filter(x => x.id !== id); ['milestones', 'invoices', 'payments', 'expenses', 'tasks', 'designs', 'pos', 'issues', 'activity', 'notifications'].forEach(k => { if (Array.isArray(c[k])) c[k] = c[k].filter(x => x.projectId !== id); }); });
      S.p.forEach(n => { const p = proj(c, n.id); if (!p) return; const b = B.p.find(x => x.id === n.id) || {};
        if (n.nx !== b.nx) p.nextAction = n.nx; if (!same(n.rooms, b.rooms)) p.rooms = n.rooms.slice(); });
      /* re-key anything that pointed at a project id that was just minted */
      Object.keys(pmap).forEach(o => { ['t', 'd', 'm', 'i'].forEach(k => S[k].forEach(x => { if (x.p === o) x.p = pmap[o]; })); S.cl[pmap[o]] = S.cl[o]; delete S.cl[o]; S.ucl[pmap[o]] = S.ucl[o]; delete S.ucl[o]; });
      /* 2. designs + materials first (tasks link to them), then tasks, then site items */
      const dm = reconcile(c.designs, S.d, B.d, E.d), mm = reconcile(c.pos, S.m, B.m, E.m);
      S.t.forEach(t => { if (dm[t.ds]) t.ds = dm[t.ds]; if (mm[t.m]) t.m = mm[t.m]; });
      reconcile(c.tasks, S.t, B.t, E.t); reconcile(c.issues, S.i, B.i, E.i);
      /* 3. handover checklists (PM-only data) */
      const x = c.pmx = c.pmx || { cl: {}, ucl: {} }; x.cl = x.cl || {}; x.ucl = x.ucl || {};
      Object.keys(S.cl).forEach(id => { if (!same(S.cl[id], (B.cl || {})[id])) x.cl[id] = S.cl[id]; });
      Object.keys(S.ucl).forEach(id => { if (!same(S.ucl[id], (B.ucl || {})[id])) x.ucl[id] = S.ucl[id]; });
      const ok = write(c); link.base = clone(S);
      /* progress / stage may have moved: tell the panel so its ring + labels stay in sync */
      S.p.forEach(n => { const p = proj(c, n.id); if (p) { n.pg = p.progress; n.st = PM_ST[p.stage] || n.st; } });
      return ok;
    }
  };

  /* =====================================================================
     CLIENT PORTAL  (one client -> their project)
     ===================================================================== */
  const C_STAGES = ['Design', 'Approvals', 'Procurement', 'Execution', 'Final Inspection', 'Handover'];
  const C_ST = { Design: 'Design', 'Client Approval': 'Approvals', Procurement: 'Procurement', 'Site Execution': 'Execution', Handover: 'Handover' };
  const DC_N = { Sent: 'Awaiting approval', Approved: 'Approved', Revision: 'Revision requested', Draft: 'In progress' }, DC_C = { 'Awaiting approval': 'Sent', Approved: 'Approved', 'Revision requested': 'Revision', 'In progress': 'Draft' };
  const HERO = 'photo-1618221195710-dd6b41faaea6';
  const defHandover = () => ({ confirmed: null, items: [
    { id: 'inspection', label: 'Final inspection', done: false, client: true, note: 'After execution' }, { id: 'issues', label: 'Outstanding issues resolved', done: false, client: true, note: 'Snag list not started' },
    { id: 'photos', label: 'Final photographs', done: false, client: true, note: 'After inspection' }, { id: 'docs', label: 'Project documents', done: true, note: 'Ready to view' },
    { id: 'warranty', label: 'Warranty documents', done: false, optional: true, note: 'Not supplied yet' }, { id: 'confirm', label: 'Handover confirmation', done: false, note: 'When you are satisfied' }] });
  const liveProjects = c => c.projects.filter(p => !p.archived && p.status !== 'cancelled');
  function pickProject(c) {
    const live = liveProjects(c); let want = new URLSearchParams(location.search).get('client'); try { want = want || localStorage.getItem(PICK); } catch (e) {}
    let cl = want && live.some(p => p.clientId === want) ? want : null;
    if (!cl) { const demo = live.filter(p => p.status === 'active' && p.stage === 'Site Execution').sort((a, b) => num(a.id) - num(b.id))[0];
      const last = demo || live.slice().sort((a, b) => (a.createdOn < b.createdOn ? 1 : a.createdOn > b.createdOn ? -1 : num(b.id) - num(a.id)))[0]; cl = last && last.clientId; }
    const mine = live.filter(p => p.clientId === cl).sort((a, b) => (a.status === 'active' ? 0 : 1) - (b.status === 'active' ? 0 : 1) || (a.createdOn < b.createdOn ? 1 : -1));
    return mine[0] || null;
  }
  function cDesigns(c, p) {
    const out = [];
    c.designs.filter(d => d.projectId === p.id).forEach(d => {
      const draftHidden = d.status === 'Draft' && !d.clientAdded, n = draftHidden ? d.version - 1 : d.version; if (n < 1) return;
      const vm = d.vmeta || {}, cm = arr(d.comments).slice();
      if (d.status === 'Revision' && d.note && !cm.some(x => x.text === d.note)) cm.push({ v: 'V' + d.version, text: d.note, date: d.updated || iso() });
      const versions = []; for (let v = 1; v <= n; v++) {
        const m = vm[v] || {}, last = v === n, st = !last ? 'Superseded' : draftHidden ? 'Revision requested' : DC_N[d.status] || 'In progress';
        const ver = { v: 'V' + v, img: m.img || '', date: m.date || (last ? d.sentOn || d.updated : d.updated) || iso(), status: st, note: m.note || (last ? (d.clientAdded ? d.note : d.title) || '' : '') };
        if (st === 'Approved') ver.decided = m.decided || d.updated || iso(); versions.push(ver); }
      out.push({ id: d.id, room: d.room, current: 'V' + n, comments: cm, versions, ...(d.clientAdded ? { custom: true } : {}) });
    });
    return out;
  }
  function cPayments(c, p) {
    const invs = c.invoices.filter(i => i.projectId === p.id).sort((a, b) => (a.due < b.due ? -1 : 1)), out = [];
    invs.forEach((i, k) => {
      const pays = c.payments.filter(x => x.invoiceId === i.id), got = pays.reduce((a, x) => a + x.amount, 0), paid = got >= i.amount, d = days(i.due);
      out.push({ id: i.id, label: i.title, amount: i.amount, paid, date: paid ? (pays.map(x => x.date).sort().pop() || i.due) : i.due, no: i.id, issued: !!i.sent || got > 0,
        ...(paid ? {} : { tag: d <= 7 ? 'Due soon' : 'Upcoming' }), ...(i.clientAdded ? { custom: true } : {}) });
    });
    if (out.reduce((a, x) => a + x.amount, 0) < (p.value || 0)) out.push({ id: 'balance', label: 'Remaining balance', amount: null, paid: false, date: p.handoverOn, tag: 'Upcoming', no: 'INV-BAL' });
    return out;
  }
  /* change-request helpers: portal wording <-> admin days */
  const impStr = d => (d <= 0 ? 'No delay' : d === 1 ? '+1 day' : '+' + d + ' days');
  const impDays = s => { s = String(s || ''); if (/no delay/i.test(s)) return 0; if (/week/i.test(s)) return 7; const m = s.match(/(\d+)(?:\s*to\s*(\d+))?/); return m ? (m[2] ? Math.round((+m[1] + +m[2]) / 2) : +m[1]) : 0; };
  const cChanges = (c, p) => arr(c.changes).filter(x => x.projectId === p.id).map(x => {
    const st = x.status === 'Approved' ? 'Approved' : x.status === 'Rejected' ? 'Declined' : 'Under review', d = x.decidedOn || x.raised || iso(), hist = [{ s: 'Submitted', date: x.raised || iso() }];
    if (st !== 'Under review') hist.push({ s: 'Studio proposal sent', date: d }, { s: st, date: d });
    return { id: x.id, title: x.title, desc: x.desc || 'Raised by the studio.', estimate: x.clientReq ? (x.estimate || 0) : 0, proposal: st === 'Under review' ? null : { cost: x.amount || 0, impact: impStr(x.days), date: d },
      cost: st === 'Approved' ? (x.amount || 0) : null, impact: impStr(x.days), ref: x.ref || '', status: st, history: hist, ...(x.clientReq ? { custom: true } : {}) };
  });
  const CL = {
    clients() { const c = read(); if (!c) return []; const ids = new Set(liveProjects(c).map(p => p.clientId)); return c.clients.filter(x => ids.has(x.id)).map(x => ({ id: x.id, name: x.name })); },
    select(id) { try { localStorage.setItem(PICK, id); } catch (e) {} },
    resetPortal(pid) { const c = read(); if (c && c.portal) { delete c.portal[pid]; write(c); } },
    current() { const c = read(), p = c && pickProject(c); return p ? p.clientId : ''; },
    open() {
      const c = read(); if (!c) return null; const p = pickProject(c); if (!p) return null;
      const cl = c.clients.find(x => x.id === p.clientId) || {}, pm = team(c, p.pmId), pf = (c.portal || {})[p.id] || {}, st = c.settings || {};
      const nm = cl.contact || cl.name || 'Client', m = nextMs(c, p.id), tasks = c.tasks.filter(t => t.projectId === p.id);
      const rooms = arr(p.rooms).map(r => { const ts = tasks.filter(t => String(t.room).toLowerCase() === String(r).toLowerCase()), ca = c.designs.find(d => d.projectId === p.id && d.clientAdded && d.room === r);
        return { ...(ca ? { id: ca.id, custom: true } : {}), room: r, pct: ts.length ? Math.round(100 * ts.filter(t => t.status === 'Done').length / ts.length) : ca ? 0 : p.progress }; });
      const designs = cDesigns(c, p), notes = arr(pf.notifications).slice(), have = new Set(notes.map(n => n.id));
      const smp = G.__PORTAL_SAMPLE || {}, late = p.status === 'completed' || ['Procurement', 'Site Execution', 'Handover'].includes(p.stage), changes = cChanges(c, p);
      const apprSum = arr(c.changes).filter(x => x.projectId === p.id && x.status === 'Approved').reduce((a, x) => a + (x.amount || 0), 0);
      arr(c.changes).filter(x => x.projectId === p.id && x.decidedOn && x.status !== 'Pending').forEach(x => { const id = 'nc-' + x.id + '-' + x.status;
        if (!have.has(id)) notes.push({ id, text: 'Change request decision recorded', sub: `${x.title} · ${x.status === 'Approved' ? 'Approved' : 'Declined'}`, date: x.decidedOn, read: false, go: 'changes' }); });
      designs.forEach(d => { const cv = d.versions[d.versions.length - 1], id = 'nd-' + d.id + '-' + cv.v; if (cv.status === 'Awaiting approval' && !have.has(id)) notes.push({ id, text: 'New design submitted for approval', sub: `${d.room} · ${cv.v}`, date: cv.date, read: false, go: 'designs', design: d.id }); });
      const S = { v: 2, pid: p.id, cid: p.clientId,
        profile: { name: nm, initials: nm.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase(), project: p.name, location: p.location && p.location !== '-' ? p.location : cl.city || 'Hyderabad', email: cl.email || '', phone: cl.phone || '',
          designer: pm.name || 'Design team', designerRole: pm.role || 'Project manager', studioPhone: st.phone || '', studioEmail: st.email || '' },
        hero: pf.hero || HERO, stages: C_STAGES.slice(), stage: p.status === 'completed' ? 'Handover' : C_ST[p.stage] || 'Design', progress: p.progress, project: { start: p.createdOn, end: p.handoverOn },
        milestone: m ? { title: m.name, date: m.planned } : { title: 'Handover', date: p.handoverOn }, delay: p.delayReason || null, budget: { original: Math.max(0, (p.value || 0) - apprSum) },
        rooms, designs, materials: pf.materials !== undefined ? arr(pf.materials) : late ? clone(arr(smp.materials)) : [], updates: pf.updates !== undefined ? arr(pf.updates) : late ? clone(arr(smp.updates)) : [], payments: cPayments(c, p), changes, handover: pf.handover || defHandover(), docs: arr(pf.docs), notifications: notes };
      return { state: S, base: clone(S), pid: p.id };
    },
    save(link, S) {
      const c = read(); if (!c) return false; const p = proj(c, link.pid); if (!p) return false; const B = link.base;
      const DE = { pre: 'D-',
        mk: n => ({ projectId: p.id, designer: p.pmId || '', sentOn: null, remindedOn: null, history: [], comments: [], custom: true, clientAdded: true, title: n.room + ' (requested by client)', version: 1 }),
        toC: n => { const cv = n.versions[n.versions.length - 1] || {}, vm = {}; n.versions.forEach(v => { vm[verNum(v.v)] = { img: v.img || '', date: v.date, note: v.note || '', ...(v.decided ? { decided: v.decided } : {}) }; });
          const last = arr(n.comments).filter(x => x.v === cv.v).pop();
          return { room: n.room, version: verNum(n.current), status: DC_C[cv.status] || 'Draft', comments: n.comments, vmeta: vm, ...(cv.status === 'Revision requested' && last ? { note: last.text } : cv.status === 'In progress' ? { note: cv.note || '' } : {}) }; },
        after(r, n, ch) { if (!ch) { if (!arr(p.rooms).some(x => x.toLowerCase() === r.room.toLowerCase())) (p.rooms = arr(p.rooms)).push(r.room); hist(r, 'Room requested by client'); log(c, 'approval', `Client requested a new room: ${r.room}`, p.id); notify(c, 'approval', `Client added room ${r.room}, ${p.name}`, p.id, '#design?p=' + p.id); }
          else { designChanged(c, r, ch, 'client'); } },
        removed: b => { const r = b.room; if (b.custom && Array.isArray(p.rooms)) p.rooms = p.rooms.filter(x => x !== r); } };
      reconcile(c.designs, S.designs, B.designs, DE);
      const IE = { pre: 'INV-', base: 1000, mk: n => ({ projectId: p.id, issued: iso(), sent: false, custom: true, clientAdded: true }), toC: n => ({ title: n.label, amount: n.amount, due: n.date }),
        after: (r, n, ch) => { if (!ch) log(c, 'payment', `Client added payment milestone: ${r.title}`, p.id); } };
      const cus = a => arr(a).filter(x => x.custom);
      reconcile(c.invoices, cus(S.payments), cus(B.payments), IE);
      const CE = { pre: 'CR-', mk: n => ({ projectId: p.id, status: 'Pending', raised: iso(), custom: true, clientReq: true }),
        toC: n => { const o = { title: n.title, desc: n.desc || '', ref: n.ref || '' }; if (n.status === 'Under review') { o.estimate = Number(n.estimate) || 0; o.amount = Number(n.estimate) || 0; o.days = impDays(n.impact); } return o; },
        after: (r, n, ch) => { if (!ch) { log(c, 'task', `Change request from client: ${r.title}`, p.id); notify(c, 'change', `New change request from client: ${r.title}, ${p.name}`, p.id, '#site?tab=changes'); } } };
      reconcile(c.changes = arr(c.changes), arr(S.changes), arr(B.changes), CE);
      arr(S.materials).forEach(m => { const b = arr(B.materials).find(x => x.id === m.id); if (b && b.status !== m.status && m.status === 'Approved') { const o = (arr(m.options).find(x => x.id === m.selected) || {}).name || '';
        log(c, 'approval', `Client approved ${m.name}${o ? ': ' + o : ''}`, p.id); notify(c, 'approval', `Client approved ${m.name}${o ? ' (' + o + ')' : ''}, ${p.name}`, p.id, '#projects?id=' + p.id); } });
      const keys = ['hero', 'materials', 'updates', 'handover', 'docs', 'notifications'], pick = o => { const r = {}; keys.forEach(k => { r[k] = o[k]; }); return r; };
      if (!same(pick(S), pick(B))) { (c.portal = c.portal || {})[p.id] = pick(clone(S)); }
      const ok = write(c); link.base = clone(S);
      S.progress = p.progress; S.stage = p.status === 'completed' ? 'Handover' : C_ST[p.stage] || S.stage; return ok;
    }
  };

  /* live refresh: another panel / tab wrote the shared store */
  function onChange(cb) {
    let t;
    const trigger = () => { clearTimeout(t); t = setTimeout(cb, 50); };
    G.addEventListener('storage', e => { if (e.key === KEY || e.key === null) trigger(); });
    if (syncChan) {
      syncChan.addEventListener('message', e => {
        if (e && e.data && e.data.key === KEY) trigger();
      });
    }
  }

  G.IPCS = { KEY, read, pm: PM, client: CL, onChange, connected: () => !!read() };
})(window);
