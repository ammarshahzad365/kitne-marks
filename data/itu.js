// ITU Lahore: formulas, closing merits and sources.
// Closing merit = merit of the last candidate on the program's final 2026 list.
(function () {
  var NORMS = { label: 'ITU Admissions: Norms & Criteria (Selection Criteria)', url: 'https://itu.edu.pk/admissions/application-process/' };
  var ML = 'https://itu.edu.pk/merit-lists-2026/';
  var ML2 = 'https://itu.edu.pk/merit-lists-2026-2/';
  var UP = 'https://itu.edu.pk/wp-content/uploads/';

  function pattern(label, path) {
    return { label: 'ITU test pattern (' + label + '): 60 MCQs, no negative marking', url: UP + path };
  }
  var CS_TEST = pattern('BS CS / BS AI 2026', '2026/03/BSCS-BSAI-Test-Pattern-2026.pdf');
  var ENG_TEST = pattern('BS EE / CE / SE', '2023/03/ITU-Admission-Test-Pattern-2023-BSEE_BSCE_BSSE.pdf');
  var MT_TEST = pattern('BS Management & Technology 2026', '2026/03/BSMT-2026.pdf');
  var FT_TEST = pattern('BS FinTech', '2025/05/BSFinTech-2025.pdf');
  var EDS_TEST = pattern('BS Economics with Data Science 2026', '2026/04/BSESDS-Test-Pattern-2026.pdf');

  var ASSUMED = 'ITU publishes only the total academic weight for this program. The Matric/Inter split is assumed to follow the same 15:35 ratio ITU uses for BS CS and BS AI.';

  function formula(label, matric, fsc, test, summary, testSource, assumed) {
    return {
      label: label,
      academic: 'weighted',
      matric: matric,
      fsc: fsc,
      test: test,
      testName: 'ITU admission test',
      testTotal: 60,
      summary: summary,
      assumed: assumed ? ASSUMED : null,
      sources: [NORMS, testSource]
    };
  }

  (window.MERIT_DATA.universities = window.MERIT_DATA.universities || []).push({
    id: 'itu',
    name: 'ITU',
    fullName: 'Information Technology University, Lahore',
    campusNote: 'Lahore.',
    // "Matric/O-Level 15% + Inter part I/Inter/A-Level 35%"
    fscRule: 'fullOrPart1',
    fscNote: 'ITU accepts Inter Part-1 or full Inter marks. Your full FSc is used if you enter it, otherwise Part-1.',
    fscSource: NORMS,
    formulas: {
      csai: formula('BS CS and BS AI', 0.15, 0.35, 0.50, 'Matric 15% + Inter 35% + ITU test 50%', CS_TEST, false),
      eng: formula('BS EE, SE and CE', 0.15, 0.35, 0.50, 'Academic 50% (Matric 15% + Inter 35%*) + ITU test 50%', ENG_TEST, true),
      mt: formula('BS Management & Technology', 0.12, 0.28, 0.60, 'Academic 40% (Matric 12% + Inter 28%*) + ITU test 60%', MT_TEST, true),
      ft: formula('BS Financial Technology', 0.12, 0.28, 0.60, 'Academic 40% (Matric 12% + Inter 28%*) + ITU test 60%', FT_TEST, true),
      eds: formula('BS Economics with Data Science', 0.15, 0.35, 0.50, 'Academic 50% (Matric 15% + Inter 35%*) + ITU test 50%', EDS_TEST, true)
    },
    columns: { closing: 'Closing merit (last list)' },
    groups: [{ id: 'closing', label: 'Open merit', columns: ['closing'] }],
    meritNote: 'ITU does not label a closing merit, so the merit of the last candidate on each program\'s final 2026 list is used. Some programs had a separate second admission round, which is shown as a note.',
    meritIndex: { label: 'ITU Merit Lists 2026', url: ML },
    meritSources: {
      cs2: { label: 'ITU BS Computer Science 2nd Merit List 2026 (last row: 79.50)', short: 'Merit list', url: ML + 'faculty-of-science/bs-computer-science-2nd-merit-list-2026/' },
      ai3: { label: 'ITU BS Artificial Intelligence 3rd Merit List 2026 (last row: 79.74)', short: 'Merit list', url: ML + 'bs-artificial-intelligence-3rd-merit-list-2026/' },
      se2: { label: 'ITU BS Software Engineering 2nd Merit List 2026 (last row: 79.02)', short: 'Merit list', url: ML2 + 'bs-software-engineering-2nd-merit-list-2026/' },
      ce2: { label: 'ITU BS Computer Engineering 2nd Merit List 2026 (last row: 74.09)', short: 'Merit list', url: ML2 + 'bs-computer-engineering-2nd-merit-list-2026/' },
      ee2: { label: 'ITU BS Electrical Engineering 2nd Merit List 2026 (last row: 60.02)', short: 'Merit list', url: ML2 + 'bs-electrical-engineering-2nd-merit-list-2026/' },
      eeR2: { label: 'ITU BS Electrical Engineering 1st Merit List 2026, Round 2 (last row: 61.24)', short: 'Round 2 list', url: ML2 + 'bs-electrical-engineering-1st-merit-list-2026-round-2/' },
      mt2: { label: 'ITU BS Management & Technology 2nd Merit List 2026 (last row: 55.33)', short: 'Merit list', url: ML2 + 'bs-management-technology-2nd-merit-list-2026/' },
      mtR2: { label: 'ITU BS Management & Technology 1st Merit List 2026, Round 2 (last row: 52.46)', short: 'Round 2 list', url: ML2 + 'bs-management-technology-1st-merit-list-2026-round-2/' },
      ft2: { label: 'ITU BS Financial Technology 2nd Merit List 2026 (last row: 55.40)', short: 'Merit list', url: ML2 + 'bs-financial-technology-2nd-merit-list-2026/' },
      ftR2: { label: 'ITU BS Financial Technology 1st Merit List 2026, Round 2 (last row: 51.49)', short: 'Round 2 list', url: ML2 + 'bs-financial-technology-1st-merit-list-2026-round-2/' },
      eds2: { label: 'ITU BS Economics with Data Science 2nd Merit List 2026 (last row: 60.09)', short: 'Merit list', url: ML2 + 'bs-economics-with-data-science-2nd-merit-list-2026/' },
      edsR2: { label: 'ITU BS Economics with Data Science 1st Merit List 2026, Round 2 (last row: 56.22)', short: 'Round 2 list', url: ML2 + 'bs-economics-with-data-science-1st-merit-list-2026-round-2/' }
    },
    programs: [
      { name: 'BS Computer Science', campus: 'Lahore', formula: 'csai', merits: { closing: { v: 79.50, src: 'cs2' } } },
      { name: 'BS Artificial Intelligence', campus: 'Lahore', formula: 'csai', merits: { closing: { v: 79.74, src: 'ai3' } } },
      { name: 'BS Software Engineering', campus: 'Lahore', formula: 'eng', merits: { closing: { v: 79.02, src: 'se2' } } },
      { name: 'BS Computer Engineering', campus: 'Lahore', formula: 'eng', merits: { closing: { v: 74.09, src: 'ce2' } } },
      { name: 'BS Electrical Engineering', campus: 'Lahore', formula: 'eng', merits: { closing: { v: 60.02, src: 'ee2' } }, extra: { v: 61.24, src: 'eeR2', label: 'Round 2 closed at' } },
      { name: 'BS Management & Technology', campus: 'Lahore', formula: 'mt', merits: { closing: { v: 55.33, src: 'mt2' } }, extra: { v: 52.46, src: 'mtR2', label: 'Round 2 closed at' } },
      { name: 'BS Financial Technology', campus: 'Lahore', formula: 'ft', merits: { closing: { v: 55.40, src: 'ft2' } }, extra: { v: 51.49, src: 'ftR2', label: 'Round 2 closed at' } },
      { name: 'BS Economics with Data Science', campus: 'Lahore', formula: 'eds', merits: { closing: { v: 60.09, src: 'eds2' } }, extra: { v: 56.22, src: 'edsR2', label: 'Round 2 closed at' } }
    ]
  });
})();
