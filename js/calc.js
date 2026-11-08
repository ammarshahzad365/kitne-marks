// Merit calculations. Works in the browser (window.MeritCalc) and in Node (require).
(function (root) {
  var EPS = 1e-9;

  function pct(obtained, total) {
    return (obtained / total) * 100;
  }

  // Which intermediate marks a university uses for this student.
  function pickFsc(uni, input) {
    var hasFull = input.fullObt != null && input.fullTot;
    if (uni.fscRule === 'fullOrPart1' && hasFull) {
      return { obtained: input.fullObt, total: input.fullTot, label: 'Full FSc' };
    }
    return { obtained: input.p1Obt, total: input.p1Tot, label: 'FSc Part-1' };
  }

  // Points (out of 100) the student already has from Matric + FSc for this formula.
  function academicShare(uni, formula, input) {
    var fsc = pickFsc(uni, input);
    var hafiz = uni.hafiz && input.hafiz ? uni.hafiz.marks : 0;

    if (formula.academic === 'weighted') {
      return formula.matric * pct(input.matricObt, input.matricTot) + formula.fsc * pct(fsc.obtained, fsc.total);
    }
    if (formula.academic === 'pu') {
      // PU basic criteria: (1/4 Matric + FSc + additional marks) / (1/4 Matric total + FSc total)
      var earned = input.matricObt / 4 + fsc.obtained + hafiz;
      var total = input.matricTot / 4 + fsc.total;
      var academic = pct(earned, total);
      if (uni.lateSessions && input.lateYears) {
        academic -= uni.lateSessions.perYear * Math.min(input.lateYears, uni.lateSessions.max);
      }
      return formula.academicWeight * Math.min(academic, 100);
    }
    if (formula.academic === 'fscOnly') {
      return formula.academicWeight * Math.min(pct(fsc.obtained + hafiz, fsc.total), 100);
    }
    throw new Error('Unknown academic rule: ' + formula.academic);
  }

  // What the student needs in the test to reach a closing merit.
  function required(formula, academic, closing) {
    if (!formula.test) {
      return { status: academic + EPS >= closing ? 'noTestAbove' : 'noTestBelow', aggregate: academic };
    }
    var needPct = ((closing - academic) / formula.test);
    var result = { needPct: needPct };
    if (needPct <= 0) result.status = 'above';
    else if (needPct > 100 + EPS) result.status = 'out';
    else result.status = needPct >= 90 ? 'tough' : 'reach';

    if (formula.testTotal) {
      result.total = formula.testTotal;
      result.marks = Math.max(0, Math.ceil((needPct / 100) * formula.testTotal - EPS));
    } else {
      result.pctRounded = Math.max(0, Math.ceil(needPct * 10 - EPS) / 10);
    }
    return result;
  }

  // Aggregate a student would get with a given test score (used to check results).
  function aggregate(formula, academic, testPct) {
    return academic + formula.test * testPct;
  }

  var api = { pickFsc: pickFsc, academicShare: academicShare, required: required, aggregate: aggregate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.MeritCalc = api;
})(this);
