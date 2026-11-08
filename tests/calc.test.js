// Run with: node --test tests/
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const calc = require('../js/calc.js');

// Load the data files the same way the browser does.
function loadUniversities() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  for (const f of ['uet.js', 'uet-info.js', 'fast.js', 'itu.js', 'pu.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'data', f), 'utf8'), ctx);
  }
  return ctx.window.MERIT_DATA.universities;
}

const unis = loadUniversities();
const byId = Object.fromEntries(unis.map((u) => [u.id, u]));
const student = { matricObt: 1000, matricTot: 1100, p1Obt: 470, p1Tot: 550, fullObt: 950, fullTot: 1100 };

test('UET ECAT example matches a hand calculation', () => {
  const uet = byId.uet;
  const f = uet.formulas.ecat;
  // 0.17 * 90.909 + 0.50 * 85.4545 = 58.1818
  const academic = calc.academicShare(uet, f, student);
  assert.ok(Math.abs(academic - 58.1818) < 1e-3);
  // (85.37202 - 58.1818) / 0.33 = 82.394% of 400 = 329.58 -> 330
  const r = calc.required(f, academic, 85.37202);
  assert.strictEqual(r.marks, 330);
  assert.strictEqual(r.status, 'reach');
});

test('UET always uses Part-1, FAST uses full FSc when given', () => {
  assert.strictEqual(calc.pickFsc(byId.uet, student).label, 'FSc Part-1');
  assert.strictEqual(calc.pickFsc(byId.fast, student).label, 'Full FSc');
  assert.strictEqual(calc.pickFsc(byId.fast, { ...student, fullObt: null, fullTot: null }).label, 'FSc Part-1');
});

test('PU basic criteria matches the Regulations Book formula', () => {
  const pu = byId.pu;
  const f = pu.formulas.basic;
  // (1000/4 + 950) / (1100/4 + 1100) = 1200 / 1375 = 87.2727% -> x 0.75 = 65.4545
  assert.ok(Math.abs(calc.academicShare(pu, f, student) - 65.4545) < 1e-3);
  // Hafiz adds 20 marks: 1220 / 1375 = 88.7273% -> 66.5455
  assert.ok(Math.abs(calc.academicShare(pu, f, { ...student, hafiz: true }) - 66.5455) < 1e-3);
  // Two late years cost 4 percentage points of academic marks.
  assert.ok(Math.abs(calc.academicShare(pu, f, { ...student, lateYears: 2 }) - 0.75 * (87.2727 - 4)) < 1e-3);
});

test('Non-ECAT programs need no test', () => {
  const f = byId.uet.formulas.nonEcat;
  const academic = calc.academicShare(byId.uet, f, student); // 0.25*90.909 + 0.75*85.4545 = 86.818
  assert.strictEqual(calc.required(f, academic, 80).status, 'noTestAbove');
  assert.strictEqual(calc.required(f, academic, 90).status, 'noTestBelow');
});

test('every required score is the smallest one that reaches the closing merit', () => {
  const students = [
    student,
    { matricObt: 800, matricTot: 1100, p1Obt: 380, p1Tot: 550 },
    { matricObt: 1080, matricTot: 1100, p1Obt: 530, p1Tot: 550, hafiz: true },
  ];
  let checked = 0;
  for (const uni of unis) {
    for (const p of uni.programs) {
      const f = uni.formulas[p.formula];
      for (const s of students) {
        const academic = calc.academicShare(uni, f, s);
        for (const m of Object.values(p.merits)) {
          const r = calc.required(f, academic, m.v);
          if (r.status !== 'reach' && r.status !== 'tough') continue;
          const scorePct = r.marks != null ? (r.marks / r.total) * 100 : r.pctRounded;
          const step = r.marks != null ? 100 / r.total : 0.1;
          assert.ok(calc.aggregate(f, academic, scorePct) >= m.v - 1e-9, `${uni.id} ${p.name} too low`);
          assert.ok(calc.aggregate(f, academic, scorePct - step) < m.v, `${uni.id} ${p.name} not minimal`);
          checked++;
        }
      }
    }
  }
  assert.ok(checked > 100);
});

test('every formula, merit and source is wired up and linked', () => {
  for (const uni of unis) {
    assert.ok(uni.fscSource.url.startsWith('https://'), uni.id);
    assert.ok(uni.meritIndex.url.startsWith('https://'), uni.id);
    for (const f of Object.values(uni.formulas)) {
      assert.ok(f.sources.length > 0, `${uni.id} ${f.label} has no source`);
      for (const s of f.sources) assert.ok(s.url.startsWith('https://') && s.label, `${uni.id} bad source`);
    }
    for (const g of uni.groups) for (const c of g.columns) assert.ok(uni.columns[c], `${uni.id} column ${c}`);
    for (const p of uni.programs) {
      assert.ok(uni.formulas[p.formula], `${uni.id} ${p.name} formula`);
      for (const [col, m] of Object.entries(p.merits)) {
        assert.ok(uni.columns[col], `${uni.id} ${p.name} unknown column ${col}`);
        assert.ok(uni.meritSources[m.src] && uni.meritSources[m.src].url.startsWith('https://'), `${uni.id} ${p.name} source`);
        assert.ok(m.v > 20 && m.v < 100, `${uni.id} ${p.name} merit ${m.v}`);
      }
    }
  }
});
