// University of the Punjab (Lahore campuses): formulas, 2025 closing merits and sources.
(function () {
  var REGS = 'https://pu.edu.pk/downloads/Admission-Regulations-Book.pdf';
  var GUIDE = { label: 'PU Admission Guidelines for Undergraduate Programs 2026-27', url: 'https://pu.edu.pk/images/image/Admission-Notices/Instructions-Eligibility-Criteria-2026-27.pdf' };
  var NEWS = { label: 'PU news (14 June 2026): entry test carries 25% weightage', url: 'https://pu.edu.pk/home/section/exam/17189' };
  var MERIT = 'https://pu.edu.pk/downloads/Merit-of-Last-Year-2025.pdf';

  function regs(page, what) {
    return { label: 'PU Admission Regulations Book 2026-27, PDF p.' + page + ' (' + what + ')', url: REGS + '#page=' + page };
  }

  // Pages in the merit PDF. Each merit links to the page it appears on.
  var meritSources = {};
  [1, 2, 3, 4, 5].forEach(function (p) {
    meritSources['p' + p] = { label: 'PU Undergraduate Programs: Merit of Last Year 2025, page ' + p, short: 'PDF p.' + p, url: MERIT + '#page=' + p };
  });

  function v(morning, selfSupport, page) {
    var out = {};
    if (morning != null) out.M = { v: morning, src: 'p' + page };
    if (selfSupport != null) out.SS = { v: selfSupport, src: 'p' + page };
    return out;
  }
  function basic(name, dept, morning, selfSupport, page) {
    return { name: name, campus: dept, formula: 'basic', merits: v(morning, selfSupport, page) };
  }
  function eng(name, dept, morning, selfSupport, page, formulaPage) {
    return { name: name, campus: dept, formula: 'eng', formulaSource: regs(formulaPage, name + ' merit formula'), merits: v(morning, selfSupport, page) };
  }

  (window.MERIT_DATA.universities = window.MERIT_DATA.universities || []).push({
    id: 'pu',
    name: 'Punjab University',
    fullName: 'University of the Punjab, Lahore',
    campusNote: 'Lahore campuses only. Art & Design, LLB and Pakistan Studies are left out because they use separate tests or report merit in marks.',
    // Annexure-II footnote: provisional applicants are ranked on Intermediate Part-I marks.
    fscRule: 'fullOrPart1',
    fscNote: 'PU uses your full FSc marks, or Part-1 marks if you are still waiting for your Part-2 result.',
    fscSource: GUIDE,
    hafiz: { marks: 20, source: regs(27, 'Additional marks: Hafiz-e-Quran = 20') },
    lateSessions: { perYear: 2, max: 5, source: GUIDE },
    formulas: {
      basic: {
        label: 'BS programs (basic criteria)',
        academic: 'pu',
        academicWeight: 0.75,
        test: 0.25,
        testName: 'PU entry test',
        testTotal: null,
        summary: '75% × (¼ Matric + FSc + Hafiz) ÷ (¼ Matric total + FSc total) + 25% PU entry test',
        sources: [regs(13, 'Weightage: Entry Test 25%, Academic Record 75%'), regs(27, 'Annexure-II: Basic Criteria formula'), NEWS]
      },
      eng: {
        label: 'Engineering programs (B.Sc. Engg.)',
        academic: 'fscOnly',
        academicWeight: 0.67,
        test: 0.33,
        testName: 'ECAT',
        testTotal: 400,
        // PU also accepts these tests; the score needed in them is shown as a percentage beside the ECAT marks.
        altTests: 'PU-E/PU-M/PU-CSP or NUST',
        summary: 'FSc 67% + entry test 33% (ECAT, PU-E/PU-M/PU-CSP or NUST test). Matric is not counted.',
        sources: [regs(83, 'B.Sc. Electrical Engineering merit formula'), GUIDE]
      }
    },
    testTotalNote: 'BS programs use PU\'s own entry test. PU does not publish its total marks, so those scores are shown as a percentage. Engineering programs are shown out of 400 for ECAT. If you took PU-E, PU-M, PU-CSP or the NUST test instead, use the percentage shown under the ECAT marks.',
    columns: {
      M: 'Morning (regular)',
      SS: 'Evening / Replica / Self-Support'
    },
    groups: [{ id: 'both', label: 'Morning and Self-Support', columns: ['M', 'SS'] }],
    meritNote: 'PU\'s 2025 closing merits were calculated without an entry test (2026 is the first year the test counts). Treat these as estimates.',
    meritIndex: { label: 'PU Undergraduate Programs: Merit of Last Year 2025 (PDF)', url: MERIT },
    meritSources: meritSources,
    programs: [
      // Faculty of Computing & Information Technology (formula: Regulations Book PDF pp.147-151)
      basic('BS Computer Science (New Campus)', 'Faculty of Computing & IT', 87.18, 83.33, 5),
      basic('BS Computer Science (Old Campus)', 'Faculty of Computing & IT', 86.02, null, 5),
      basic('BS Software Engineering (New Campus)', 'Faculty of Computing & IT', 85.6, 80.35, 5),
      basic('BS Software Engineering (Old Campus)', 'Faculty of Computing & IT', 83.55, null, 5),
      basic('BS Information Technology (New Campus)', 'Faculty of Computing & IT', 84.13, null, 5),
      basic('BS Information Technology (Old Campus)', 'Faculty of Computing & IT', null, 78.59, 5),
      basic('BS Artificial Intelligence (Old Campus)', 'Faculty of Computing & IT', 85.51, null, 5),
      basic('BS Data Science', 'Faculty of Computing & IT', 86.1, 80.43, 5),
      basic('BS Cyber Security', 'Faculty of Computing & IT', null, 78.72, 5),

      // Engineering
      eng('B.Sc. Electrical Engineering', 'Institute of Electrical, Electronics & Computer Engineering', 76.691, null, 2, 83),
      eng('B.Sc. Energy Engineering', 'Institute of Energy & Environmental Engineering', 60.562, null, 2, 84),
      eng('B.Sc. Industrial Engineering & Management', 'Department of Industrial Engineering & Management', 60.688, null, 3, 89),
      eng('B.Sc. Chemical Engineering', 'Institute of Chemical Engineering & Technology', 72.885, 58.925, 3, 90),
      eng('B.Sc. Chemical Engineering (Petroleum & Gas)', 'Institute of Chemical Engineering & Technology', 76.198, 64.658, 3, 91),
      eng('B.Sc. Metallurgy & Materials Engineering', 'Institute of Metallurgy & Materials Engineering', 63.96, 50.10, 3, 93),

      // Pharmacy and Allied Health
      basic('Pharm-D (5 years)', 'Punjab University College of Pharmacy', 91.34, 81.00, 5),
      basic('Doctor of Physical Therapy (5 years)', 'Department of Allied Health Sciences', null, 78.22, 3),
      basic('BS Optometry & Vision Sciences', 'Department of Allied Health Sciences', null, 70.60, 3),
      basic('BS Medical Laboratory Technology', 'Department of Allied Health Sciences', null, 65.66, 3),
      basic('BS Audiology', 'Department of Allied Health Sciences', null, 54.27, 3),

      // Business, Commerce & Economics
      basic('BBA', 'Institute of Business Administration', 81.79, 72.84, 2),
      basic('BBIT', 'Institute of Business & Information Technology', 81.829, 70.919, 2),
      basic('BBIT (Evening)', 'Institute of Business & Information Technology', null, 66.547, 2),
      basic('BS Business Administration (BSBA)', 'Institute of Business & Information Technology', 74.297, 52.398, 2),
      basic('BS Business Administration (BSBA, Evening)', 'Institute of Business & Information Technology', null, 42.559, 2),
      basic('BS Management', 'Institute of Administrative Sciences', 72.04, 61.16, 2),
      basic('BS Management (Evening)', 'Institute of Administrative Sciences', null, 50.16, 2),
      basic('BS Commerce', 'Hailey College of Commerce', 60.25, 53.04, 2),
      basic('BS Commerce (Evening)', 'Hailey College of Commerce', null, 52.15, 2),
      basic('BS Accounting & Finance', 'Hailey College of Commerce', 78.45, 70.00, 2),
      basic('BS Accounting & Taxation', 'Hailey College of Commerce', 75.15, 64.16, 2),
      basic('BS Electronic Commerce', 'Hailey College of Commerce', 65.19, 64.22, 2),
      basic('BS Electronic Commerce (Evening)', 'Hailey College of Commerce', null, 56.13, 2),
      basic('BS Financial Technology', 'Hailey College of Commerce', 62.71, null, 2),
      basic('BS Computational Finance', 'Hailey College of Commerce', 55.15, null, 2),
      basic('BS Business Intelligence & Analytics', 'Hailey College of Commerce', 72.12, null, 2),
      basic('BBA (Banking & Finance)', 'Hailey College of Banking & Finance', 65.34, 63.9, 2),
      basic('BS Economics', 'School of Economics', 60.05, 47.57, 2),
      basic('BS Economics & Finance', 'School of Economics', 56.81, 48.57, 2),
      basic('BS Business Economics', 'School of Economics', 56.47, 47.07, 2),

      // Sciences
      basic('BS Physics', 'Department of Physics', 76.37, 50.71, 5),
      basic('BS Chemistry', 'School of Chemistry', 72.08, 52.11, 5),
      basic('BS Mathematics', 'Department of Mathematics', 59.65, 46.88, 5),
      basic('BS Mathematics with Computer Science', 'Department of Mathematics', 72.90, null, 5),
      basic('BS Space Science', 'Department of Space Science', 55.51, 49.46, 5),
      basic('BS Computational Physics', 'Centre for High Energy Physics', 58.81, 48.46, 5),
      basic('BS Solid State Physics', 'Centre of Excellence in Solid State Physics', 53.52, null, 5),
      basic('BS Nanoscience & Nanotechnology', 'Centre of Excellence in Solid State Physics', 55.22, null, 5),
      basic('BS Biophysics & Nano-Biotechnology', 'Centre of Excellence in Solid State Physics', 53.16, null, 5),
      basic('BS Statistics', 'College of Statistical & Actuarial Sciences', 59.070, 49.374, 5),
      basic('BS Biostatistics', 'College of Statistical & Actuarial Sciences', 49.212, 43.627, 5),
      basic('BS Computational Statistics & Data Analytics', 'College of Statistical & Actuarial Sciences', 69.768, null, 5),
      basic('BS Environmental Science', 'College of Earth & Environmental Sciences', 77.260, null, 5),
      basic('BS Hydrology & Water Resources Management', 'College of Earth & Environmental Sciences', 65.340, null, 5),
      basic('BS Tourism & Hospitality Management', 'College of Earth & Environmental Sciences', 65.009, null, 5),
      basic('BS Geology', 'Institute of Geology', 59.61, 47.31, 5),
      basic('BS Geographical Information Systems', 'Centre for Geographical Information System', 60.45, 40.97, 5),
      basic('BS Disaster Management', 'Centre for Integrated Mountain Research', 53.5, null, 5),
      basic('BS Geography', 'Institute of Geography', 42.18, 35.05, 5),

      // Life & Agricultural Sciences
      basic('BS Microbiology & Molecular Genetics', 'Institute of Microbiology & Molecular Genetics', 82.54, 73.22, 4),
      basic('BS Biotechnology', 'School of Biochemistry & Biotechnology', 79.32, 57.94, 4),
      basic('BS Biochemistry', 'School of Biochemistry & Biotechnology', 69.70, 51.80, 4),
      basic('BS Botany', 'Institute of Botany', 65.00, 53.00, 4),
      basic('BS Zoology', 'Institute of Zoology', 60.30, null, 4),
      basic('BS Food Sciences', 'Department of Food Sciences', 77.03, 52.00, 4),
      basic('B.Sc. (Hons) Agriculture', 'Institute of Agricultural Sciences', 61.22, 52.14, 4),
      basic('BS Agribusiness', 'Department of Horticulture', 58.51, null, 4),

      // Social & Behavioural Sciences
      basic('BS Clinical Psychology', 'Centre for Clinical Psychology', 79.43, 71.68, 1),
      basic('BS Applied Psychology', 'Institute of Applied Psychology', 73.43, 57.09, 1),
      basic('BS Political Science', 'Department of Political Science', 79.49, null, 1),
      basic('BS International Relations', 'Department of Political Science', null, 73.37, 1),
      basic('BS Human Nutrition & Dietetics', 'Department of Public Health', 83.2, 74.47, 1),
      basic('BS Public Health', 'Department of Public Health', 74.4, 55.08, 1),
      basic('BS Workplace Health & Safety Promotion', 'Department of Public Health', 57.17, 50.27, 1),
      basic('BS Sociology', 'Institute of Social & Cultural Studies', 72.00, 65.00, 1),
      basic('BS Criminology', 'Institute of Social & Cultural Studies', 60.00, 50.00, 1),
      basic('BS Demography', 'Institute of Social & Cultural Studies', 55.00, null, 1),
      basic('BS Social Work', 'Department of Social Work', 51.02, null, 1),
      basic('BS Social Entrepreneurship', 'Department of Social Work', 41.03, null, 1),
      basic('BS Gender Studies', 'Department of Gender Studies', 45.00, null, 1),
      basic('BS Gender and Climate Change', 'Department of Gender Studies', 44.00, null, 1),

      // Media & Information
      basic('BS Digital Media & Communication', 'Department of Digital Media', 72.79, 56.29, 2),
      basic('BS Journalism', 'Department of Journalism', 70.00, null, 2),
      basic('BS Information Management', 'Institute of Information Management', 68.00, 52.00, 2),
      basic('BS Public Relations & Advertising', 'Department of Public Relations and Advertising', 64.89, 54.02, 2),
      basic('BS Communication Studies', 'Department of Communication & Media Research', 60.94, 40.25, 2),
      basic('BS Media & Development Communication', 'Department of Media & Development Communication', 60.00, 55.00, 2),
      basic('BS Film & Broadcasting', 'Department of Film and Broadcasting', 56.39, 52.49, 2),

      // Arts, Humanities, Languages & Education
      basic('BS English Literature', 'Institute of English Studies', 77.73, 68.51, 1),
      basic('BS English (Applied Linguistics)', 'Institute of Education & Research', 80.00, 75.00, 3),
      basic('BS French', 'Department of French Language & Literature', 59.67, null, 1),
      basic('BS Philosophy', 'Department of Philosophy', 49.88, null, 1),
      basic('BS Archaeology', 'Department of Archaeology', 49.42, null, 1),
      basic('BS Physical Education', 'Department of Sports Sciences & Physical Education', 52.56, null, 1),
      basic('BS Urdu', 'Institute of Urdu Language & Literature', 60.25, null, 4),
      basic('BS Persian', 'Department of Persian', 60.00, null, 4),
      basic('BS Arabic', 'Department of Arabic', 47.92, null, 4),
      basic('BS Punjabi', 'Institute of Punjabi and Cultural Studies', 36.59, null, 4),
      basic('BS Islamic Studies (Hadith & Hadith Sciences)', 'Institute of Islamic Studies', 36.37, 33.40, 4),
      basic('BS Islamic Studies (Islamic Economics)', 'Institute of Islamic Studies', 35.6, 31.30, 4),
      basic('BS Islamic Studies (Quran & Quranic Sciences)', 'Institute of Islamic Studies', 36.11, 34.35, 4),
      basic('BS Islamic Studies (Seerah & History)', 'Institute of Islamic Studies', 35.19, 32.20, 4),
      basic('BS Islamic Studies (Study of World Religions)', 'Institute of Islamic Studies', 37.22, 32.00, 4),
      basic('BS Special Education', 'Institute of Special Education', 53.83, 56.70, 3),
      basic('BS Business Education', 'Institute of Education & Research', 60.00, 40.00, 3),
      basic('BS Science Education', 'Institute of Education & Research', 51.89, null, 3),
      basic('BS Technology Education', 'Institute of Education & Research', 58.14, 40.50, 3),
      basic('BS Child Rights and Safety Education', 'Institute of Education & Research', 41.5, null, 3)
    ]
  });
})();
