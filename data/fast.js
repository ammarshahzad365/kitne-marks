// FAST-NUCES Lahore: formulas, closing merits and sources.
(function () {
  var ELIGIBILITY = { label: 'FAST-NUCES Eligibility Criteria (merit weightage table)', url: 'https://nu.edu.pk/Admissions/EligibilityCriteria' };
  var TEST = { label: 'FAST-NUCES Admission Test Pattern', url: 'https://nu.edu.pk/Admissions/TestPattern' };
  // FAST does not publish closing merits itself; these figures are from this post.
  var POST = 'https://www.instagram.com/p/DbV1u4xCA7T/';

  function m(first, second) {
    return { L1: { v: first, src: 'post' }, L2: { v: second, src: 'post' } };
  }

  (window.MERIT_DATA.universities = window.MERIT_DATA.universities || []).push({
    id: 'fast',
    name: 'FAST Lahore',
    fullName: 'FAST National University of Computer and Emerging Sciences, Lahore',
    campusNote: 'Lahore campus only.',
    // "Marks obtained in HSSC part I and II OR Marks obtained in HSSC part I if result of HSSC part II not available"
    fscRule: 'fullOrPart1',
    fscNote: 'FAST uses your full FSc marks if the result is out, otherwise Part-1.',
    fscSource: ELIGIBILITY,
    formulas: {
      computing: {
        label: 'Computing programs',
        academic: 'weighted',
        matric: 0.10,
        fsc: 0.40,
        test: 0.50,
        testName: 'NU admission test',
        testTotal: null,
        summary: 'Matric 10% + FSc 40% + NU test 50%',
        sources: [ELIGIBILITY, TEST]
      },
      engineering: {
        label: 'Engineering programs',
        academic: 'weighted',
        matric: 0.17,
        fsc: 0.50,
        test: 0.33,
        testName: 'NU admission test',
        testTotal: null,
        summary: 'Matric 17% + FSc 50% + NU test 33%',
        sources: [ELIGIBILITY, TEST]
      },
      business: {
        label: 'Business programs',
        academic: 'weighted',
        matric: 0.10,
        fsc: 0.40,
        test: 0.50,
        testName: 'NU admission test',
        testTotal: null,
        summary: 'Matric 10% + FSc 40% + NU test 50%',
        sources: [ELIGIBILITY, TEST]
      }
    },
    testTotalNote: 'FAST does not publish the NU test\'s total marks, so the score you need is shown as a percentage.',
    columns: {
      L2: '2nd (last) list closing merit',
      L1: '1st list closing merit'
    },
    groups: [
      { id: 'last', label: 'Last list (2nd closing merit)', columns: ['L2'] },
      { id: 'both', label: '1st and 2nd lists', columns: ['L1', 'L2'] }
    ],
    meritNote: 'FAST does not publish closing merits on its website. These figures are from a FUNGEP post listing FAST Lahore\'s 1st and 2nd closing merits.',
    meritIndex: { label: 'FUNGEP post: FAST Lahore closing merits', url: POST },
    meritSources: {
      post: { label: 'FUNGEP post: FAST Lahore 1st and 2nd closing merits (unofficial)', short: 'FUNGEP post', url: POST }
    },
    programs: [
      { name: 'BS Computer Science', campus: 'Lahore', formula: 'computing', merits: m(75.75, 74.35) },
      { name: 'BS Artificial Intelligence', campus: 'Lahore', formula: 'computing', merits: m(77.75, 77.00) },
      { name: 'BS Software Engineering', campus: 'Lahore', formula: 'computing', merits: m(75.25, 74.18) },
      { name: 'BS Data Science', campus: 'Lahore', formula: 'computing', merits: m(75.25, 74.25) },
      { name: 'BS Cyber Security', campus: 'Lahore', formula: 'computing', merits: m(75.05, 75.00) },
      { name: 'BS Computer Engineering', campus: 'Lahore', formula: 'engineering', merits: m(75.25, 75.25) },
      { name: 'BS Electrical Engineering', campus: 'Lahore', formula: 'engineering', merits: m(77.50, 74.00) },
      { name: 'BS Civil Engineering', campus: 'Lahore', formula: 'engineering', merits: m(70.00, 65.00) },
      { name: 'BBA', campus: 'Lahore', formula: 'business', merits: m(63.00, 60.00) },
      { name: 'BS Accounting & Finance', campus: 'Lahore', formula: 'business', merits: m(63.75, 60.00) },
      { name: 'BS Business Analytics', campus: 'Lahore', formula: 'business', merits: m(62.25, 61.00) },
      { name: 'BS Financial Technology', campus: 'Lahore', formula: 'business', merits: m(65.50, 64.50) }
    ]
  });
})();
