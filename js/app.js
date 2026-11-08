(function () {
  'use strict';

  var UNIS = window.MERIT_DATA.universities;
  var STORE_KEY = 'merit-target-v1';
  var $ = function (id) { return document.getElementById(id); };

  var state = {
    uni: UNIS[0].id,
    groups: {},          // selected seat-category group per university
    campus: 'all',
    search: '',
    sort: 'default',
    input: {}
  };

  // ---------- helpers ----------

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function link(src, text) {
    return '<a href="' + esc(src.url) + '" target="_blank" rel="noopener" title="' + esc(src.label) + '">' + esc(text || src.label) + '</a>';
  }
  function fmt(n, dp) {
    return Number(n.toFixed(dp == null ? 2 : dp)).toString();
  }
  function pctText(n) { return fmt(n, 2) + '%'; }
  function currentUni() {
    return UNIS.filter(function (u) { return u.id === state.uni; })[0];
  }
  function currentGroup(uni) {
    var id = state.groups[uni.id];
    return uni.groups.filter(function (g) { return g.id === id; })[0] || uni.groups[0];
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ uni: state.uni, groups: state.groups, input: state.input })); } catch (e) { /* storage unavailable */ }
  }
  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (saved) {
        if (UNIS.some(function (u) { return u.id === saved.uni; })) state.uni = saved.uni;
        state.groups = saved.groups || {};
        state.input = saved.input || {};
      }
    } catch (e) { /* ignore */ }
    var hash = location.hash.replace('#', '');
    if (UNIS.some(function (u) { return u.id === hash; })) state.uni = hash;
  }

  // ---------- inputs ----------

  var fields = ['matricObt', 'matricTot', 'p1Obt', 'p1Tot', 'fullObt', 'fullTot'];
  var fieldIds = { matricObt: 'matric-obt', matricTot: 'matric-tot', p1Obt: 'p1-obt', p1Tot: 'p1-tot', fullObt: 'full-obt', fullTot: 'full-tot' };

  function readInputs() {
    var input = {};
    fields.forEach(function (f) {
      var v = $(fieldIds[f]).value;
      input[f] = v === '' ? null : Number(v);
    });
    input.hasFull = $('has-full').checked;
    input.hafiz = $('hafiz').checked;
    input.lateYears = Number($('late').value);
    state.input = input;
    save();
  }

  function writeInputs() {
    var input = state.input;
    var defaults = { matricTot: 1100, p1Tot: 550, fullTot: 1100 };
    fields.forEach(function (f) {
      var v = input[f] != null ? input[f] : defaults[f];
      $(fieldIds[f]).value = v != null ? v : '';
    });
    $('has-full').checked = !!input.hasFull;
    $('hafiz').checked = !!input.hafiz;
    $('late').value = String(input.lateYears || 0);
  }

  // Returns the student object for MeritCalc, or an error message.
  function student() {
    var i = state.input;
    function bad(o, t) { return o == null || t == null || !(t > 0) || o < 0 || o > t; }
    if (i.matricObt == null || i.p1Obt == null) return { error: null };
    if (bad(i.matricObt, i.matricTot)) return { error: 'Matric marks must be between 0 and the total.' };
    if (bad(i.p1Obt, i.p1Tot)) return { error: 'FSc Part-1 marks must be between 0 and the total.' };
    var s = { matricObt: i.matricObt, matricTot: i.matricTot, p1Obt: i.p1Obt, p1Tot: i.p1Tot, hafiz: i.hafiz, lateYears: i.lateYears };
    if (i.hasFull && i.fullObt != null) {
      if (bad(i.fullObt, i.fullTot)) return { error: 'Full FSc marks must be between 0 and the total.' };
      s.fullObt = i.fullObt;
      s.fullTot = i.fullTot;
    }
    return { student: s };
  }

  // ---------- rendering ----------

  function renderTabs() {
    $('uni-tabs').innerHTML = UNIS.map(function (u) {
      return '<button type="button" class="tab" data-uni="' + u.id + '" aria-pressed="' + (u.id === state.uni) + '">' + esc(u.name) + '</button>';
    }).join('');
  }

  function renderSide(uni) {
    $('fsc-note').innerHTML = esc(uni.fscNote) + ' ' + link(uni.fscSource, 'Source');
    $('full-field').hidden = !$('has-full').checked;

    var puExtras = !!(uni.hafiz || uni.lateSessions);
    $('pu-extras').hidden = !puExtras;
    if (puExtras) {
      $('hafiz-marks').textContent = uni.hafiz.marks;
      $('pu-extras-note').innerHTML =
        'Hafiz-e-Quran: ' + link(uni.hafiz.source, 'Regulations Book') +
        '. Late sessions: ' + uni.lateSessions.perYear + ' marks off per year, up to ' + uni.lateSessions.max + ' years. ' +
        link(uni.lateSessions.source, 'Guidelines 2026-27') + '.';
    }

    var group = currentGroup(uni);
    $('group').innerHTML = uni.groups.map(function (g) {
      return '<option value="' + g.id + '"' + (g.id === group.id ? ' selected' : '') + '>' + esc(g.label) + '</option>';
    }).join('');
    $('group').disabled = uni.groups.length < 2;
    $('group-note').innerHTML = uni.columnSource ? link(uni.columnSource, 'What do the category codes mean?') : '';
  }

  function weightsHtml(f) {
    var boxes;
    if (f.academic === 'weighted') {
      boxes = [[f.matric, 'Matric'], [f.fsc, 'FSc']];
    } else if (f.academic === 'pu') {
      boxes = [[f.academicWeight, '¼ Matric + FSc']];
    } else {
      boxes = [[f.academicWeight, 'FSc']];
    }
    var html = boxes.map(function (b) {
      return '<div class="weight"><b>' + fmt(b[0] * 100, 0) + '%</b><span>' + esc(b[1]) + '</span></div>';
    }).join('');
    if (f.test) {
      // Long test names ("ITU admission test") wrap badly in the small box.
      var testLabel = f.testName.length > 8 ? 'Test' : f.testName;
      html += '<div class="weight test"><b>' + fmt(f.test * 100, 0) + '%</b><span>' + esc(testLabel) + (f.testTotal ? ' /' + f.testTotal : '') + '</span></div>';
    }
    return '<div class="weights" style="grid-template-columns: repeat(' + (boxes.length + (f.test ? 1 : 0)) + ', minmax(0, 1fr))">' + html + '</div>';
  }

  function renderFormulas(uni, s) {
    var used = {};
    uni.programs.forEach(function (p) { used[p.formula] = true; });
    var html = Object.keys(uni.formulas).filter(function (k) { return used[k]; }).map(function (k) {
      var f = uni.formulas[k];
      var share = '';
      if (s) {
        var a = MeritCalc.academicShare(uni, f, s);
        var max = f.academic === 'weighted' ? (f.matric + f.fsc) * 100 : f.academicWeight * 100;
        var fscLabel = MeritCalc.pickFsc(uni, s).label === 'Full FSc' ? 'full FSc' : 'FSc Part-1';
        share = '<div class="share"><span>Your ' + esc(f.academic === 'fscOnly' ? fscLabel : 'Matric + ' + fscLabel) + ' share</span>' +
          '<b>' + fmt(a, 2) + ' <small>of ' + fmt(max, 0) + '</small></b></div>';
      }
      return '<div class="formula">' +
        '<div class="formula-name">' + esc(f.label) + '</div>' +
        weightsHtml(f) +
        '<div class="summary">' + esc(f.summary) + '</div>' +
        (f.assumed ? '<div class="assumed">* ' + esc(f.assumed) + '</div>' : '') +
        share +
        '<ul class="src-list">' + f.sources.map(function (src) { return '<li>' + link(src) + '</li>'; }).join('') + '</ul>' +
        '</div>';
    }).join('');
    if (uni.testTotalNote) html += '<p class="hint">' + esc(uni.testTotalNote) + '</p>';
    $('formulas').innerHTML = html;
  }

  // Works out one result cell: { cls, text, sub, meta, bar }
  function cell(uni, program, col, s) {
    var m = program.merits[col];
    if (!m) return { cls: 'none', text: 'Not offered', meta: '', bar: 0 };
    var src = uni.meritSources[m.src];
    var meta = 'closing ' + pctText(m.v) + ' · ' + link(src, src.short || 'source');
    if (!s) return { cls: 'none', text: 'Enter marks', meta: meta, bar: 0 };

    var f = uni.formulas[program.formula];
    var academic = MeritCalc.academicShare(uni, f, s);
    var r = MeritCalc.required(f, academic, m.v);
    var out = { cls: r.status, meta: meta, sort: r.needPct };

    if (r.status === 'noTestAbove' || r.status === 'noTestBelow') {
      out.text = r.status === 'noTestAbove' ? 'No test · above' : 'No test · below';
      out.meta = 'yours ' + pctText(r.aggregate) + ' · ' + meta;
      out.bar = 100;
      out.sort = m.v - r.aggregate;
      return out;
    }
    if (r.status === 'above') { out.text = 'Already above'; out.bar = 100; return out; }
    if (r.status === 'out') {
      out.text = 'Out of reach';
      out.sub = 'needs ' + fmt(r.needPct, 1) + '%';
      out.bar = 100;
      return out;
    }
    out.bar = r.needPct;
    if (r.marks != null) {
      out.text = String(r.marks);
      out.sub = '/ ' + r.total;
    } else {
      out.text = fmt(r.pctRounded, 1) + '%';
      out.sub = 'of test';
    }
    return out;
  }

  function programMeta(uni, p) {
    var f = uni.formulas[p.formula];
    var bits = [p.campus];
    if (Object.keys(uni.formulas).length > 1) bits.push(f.label);
    var html = esc(bits.join(' · '));
    if (f.assumed) html += ' *';
    if (p.formulaSource) html += ' · ' + link(p.formulaSource, 'formula');
    return html;
  }

  function extraNote(uni, p) {
    if (!p.extra) return '';
    var src = uni.meritSources[p.extra.src];
    return '<div class="meta">' + esc(p.extra.label) + ' ' + pctText(p.extra.v) + ' · ' + link(src, 'list') + '</div>';
  }

  function visiblePrograms(uni, group, s) {
    var q = state.search.trim().toLowerCase();
    var list = uni.programs.filter(function (p) {
      if (!group.columns.some(function (c) { return p.merits[c]; })) return false;
      if (state.campus !== 'all' && p.campus !== state.campus) return false;
      if (q && (p.name + ' ' + p.campus).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    if (state.sort === 'name') {
      list = list.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    } else if (state.sort !== 'default') {
      var key = function (p) {
        var vals = group.columns.map(function (c) { return p.merits[c] ? p.merits[c].v : null; }).filter(function (v) { return v != null; });
        return Math.max.apply(null, vals);
      };
      list = list.slice().sort(function (a, b) { return state.sort === 'hard' ? key(b) - key(a) : key(a) - key(b); });
    }
    return list;
  }

  function renderCampusChips(uni) {
    var campuses = [];
    uni.programs.forEach(function (p) { if (campuses.indexOf(p.campus) === -1) campuses.push(p.campus); });
    var box = $('campus-chips');
    // Only worth showing when there are a few distinct campuses, not one per department.
    if (campuses.length < 2 || campuses.length > 4) { box.innerHTML = ''; state.campus = 'all'; return; }
    if (state.campus !== 'all' && campuses.indexOf(state.campus) === -1) state.campus = 'all';
    box.innerHTML = ['all'].concat(campuses).map(function (c) {
      return '<button type="button" class="chip" data-campus="' + esc(c) + '" aria-pressed="' + (state.campus === c) + '">' + esc(c === 'all' ? 'All campuses' : c) + '</button>';
    }).join('');
  }

  function renderResults(uni, s) {
    var group = currentGroup(uni);
    var anyF = uni.formulas[Object.keys(uni.formulas)[0]];
    var testy = Object.keys(uni.formulas).map(function (k) { return uni.formulas[k]; }).filter(function (f) { return f.test; });
    var names = testy.map(function (f) { return f.testName; }).filter(function (n, i, a) { return a.indexOf(n) === i; });
    $('results-title').textContent = (names.length === 1 ? names[0] : 'Entry test') + ' score you need' +
      (testy.length && testy.every(function (f) { return f.testTotal === anyF.testTotal && f.testTotal; }) ? ' (out of ' + anyF.testTotal + ')' : '');

    var programs = visiblePrograms(uni, group, s);
    $('empty').hidden = programs.length > 0;

    // Desktop table
    var head = '<tr><th scope="col">Program</th>' + group.columns.map(function (c) {
      return '<th scope="col">' + esc(uni.columns[c]) + '</th>';
    }).join('') + '</tr>';
    var rows = programs.map(function (p) {
      return '<tr><td><div class="prog-name">' + esc(p.name) + '</div><div class="prog-meta">' + programMeta(uni, p) + '</div>' + extraNote(uni, p) + '</td>' +
        group.columns.map(function (c) {
          var r = cell(uni, p, c, s);
          return '<td><div class="result"><span class="pill ' + r.cls + '">' + esc(r.text) + (r.sub ? ' <small>' + esc(r.sub) + '</small>' : '') + '</span>' +
            (r.meta ? '<span class="meta">' + r.meta + '</span>' : '') + '</div></td>';
        }).join('') + '</tr>';
    }).join('');
    $('table-box').innerHTML = programs.length ? '<table><thead>' + head + '</thead><tbody>' + rows + '</tbody></table>' : '';
    $('table-box').hidden = !programs.length;

    // Mobile cards
    $('cards').innerHTML = programs.map(function (p) {
      var parts = group.columns.filter(function (c) { return p.merits[c]; }).map(function (c) {
        var r = cell(uni, p, c, s);
        return '<div class="pcard-row"><div class="pcard-col">' + esc(uni.columns[c]) + '</div>' +
          '<div class="big ' + r.cls + '">' + esc(r.text) + (r.sub ? ' <small>' + esc(r.sub) + '</small>' : '') + '</div></div>' +
          '<div class="bar" aria-hidden="true"><span class="' + r.cls + '" style="width:' + Math.max(0, Math.min(100, r.bar)) + '%"></span></div>' +
          '<div class="pcard-foot"><span>' + r.meta + '</span></div>';
      }).join('');
      return '<article class="pcard"><div><div class="prog-name">' + esc(p.name) + '</div><div class="prog-meta">' + programMeta(uni, p) + '</div>' + extraNote(uni, p) + '</div>' + parts + '</article>';
    }).join('');
  }

  function renderSources(uni) {
    var used = {};
    uni.programs.forEach(function (p) {
      Object.keys(p.merits).forEach(function (c) { used[p.merits[c].src] = true; });
      if (p.extra) used[p.extra.src] = true;
    });
    var list = Object.keys(uni.meritSources).filter(function (k) { return used[k]; }).map(function (k) {
      return '<li>' + link(uni.meritSources[k]) + '</li>';
    }).join('');
    $('sources').innerHTML =
      '<p><b>' + esc(uni.fullName) + '.</b> ' + esc(uni.campusNote) + '</p>' +
      '<p>' + esc(uni.meritNote) + ' ' + link(uni.meritIndex) + '</p>' +
      '<p>Required marks are rounded up to the next whole mark (or 0.1%), so scoring exactly that much reaches last year\'s closing merit.</p>' +
      '<details><summary>All merit sources for ' + esc(uni.name) + '</summary><ul class="src-list">' + list + '</ul></details>';
  }

  function render() {
    var uni = currentUni();
    var res = student();
    var s = res.student || null;
    $('form-error').hidden = !res.error;
    $('form-error').textContent = res.error || '';

    renderTabs();
    renderSide(uni);
    renderFormulas(uni, s);
    renderCampusChips(uni);
    renderResults(uni, s);
    renderSources(uni);
  }

  // ---------- events ----------

  function init() {
    load();
    writeInputs();

    $('uni-tabs').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-uni]');
      if (!btn) return;
      state.uni = btn.getAttribute('data-uni');
      state.campus = 'all';
      history.replaceState(null, '', '#' + state.uni);
      save();
      render();
    });
    $('marks-form').addEventListener('input', function (e) {
      if (e.target.id === 'group') return;
      readInputs();
      render();
    });
    $('marks-form').addEventListener('submit', function (e) { e.preventDefault(); });
    $('group').addEventListener('change', function () {
      state.groups[state.uni] = $('group').value;
      save();
      render();
    });
    $('search').addEventListener('input', function () { state.search = $('search').value; render(); });
    $('sort').addEventListener('change', function () { state.sort = $('sort').value; render(); });
    $('campus-chips').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-campus]');
      if (!btn) return;
      state.campus = btn.getAttribute('data-campus');
      render();
    });

    readInputs();
    render();
  }

  init();
})();
