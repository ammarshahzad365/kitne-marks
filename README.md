# Kitne Marks?

**Live: https://ammarshahzad365.github.io/kitne-marks/**

Find out how many entry test marks you need for each program at **UET Lahore**, **FAST Lahore**, **ITU** and **Punjab University**, based on last year's closing merit.

Enter your Matric and FSc marks, pick a university and seat category, and the app shows the test score that would have reached each program's closing merit. Every formula and every closing merit links to the page or document it came from.

## Features

- Required test score for every program and seat category, colour-coded: already above, reachable, tough (90%+ of the test) or out of reach
- Uses full FSc or Part-1 marks, whichever each university accepts
- PU extras: Hafiz-e-Quran marks and the late-session deduction
- Search, sort (hardest, easiest, A–Z) and campus filters
- Light and dark themes: follows the device by default, with a toggle in the header that remembers your choice
- Remembers your marks and last university on your device; links like `#pu` open a university's tab directly
- Works on phones down to 320px wide

## How it works

For each program:

```
marks needed = (closing merit − your academic share) ÷ test weight × test total
```

The result is rounded **up** to the next whole mark, so scoring exactly that much reaches the closing merit. When a university doesn't publish its test's total marks, the score is shown as a percentage instead.

## Formulas and sources

| University | Programs | Formula | Test | Source |
|---|---|---|---|---|
| UET Lahore | ECAT programs | Matric 17% + FSc Part-1 50% + ECAT 33% | ECAT, 400 marks | [Prospectus Fall 2026, p.20](https://admission.uet.edu.pk/uploads/downloads/2f6405b8-22a6-485e-b8aa-65deefb4c942.pdf#page=20), [FAQ](https://admission.uet.edu.pk/faqs) |
| UET Lahore | Non-ECAT programs | Matric 25% + FSc Part-1 75% | none | [Prospectus Fall 2026, p.20](https://admission.uet.edu.pk/uploads/downloads/2f6405b8-22a6-485e-b8aa-65deefb4c942.pdf#page=20) |
| FAST Lahore | Computing, Business | Matric 10% + FSc 40% + Test 50% | NU test (%) | [Eligibility Criteria](https://nu.edu.pk/Admissions/EligibilityCriteria) |
| FAST Lahore | Engineering | Matric 17% + FSc 50% + Test 33% | NU test (%) | [Eligibility Criteria](https://nu.edu.pk/Admissions/EligibilityCriteria) |
| ITU | CS, AI | Matric 15% + Inter 35% + Test 50% | 60 MCQs | [Norms & Criteria](https://itu.edu.pk/admissions/application-process/), [test pattern](https://itu.edu.pk/wp-content/uploads/2026/03/BSCS-BSAI-Test-Pattern-2026.pdf) |
| ITU | EE, SE, CE, Econ & DS | Academic 50% + Test 50% | 60 MCQs | [Norms & Criteria](https://itu.edu.pk/admissions/application-process/) |
| ITU | M&T, FinTech | Academic 40% + Test 60% | 60 MCQs | [Norms & Criteria](https://itu.edu.pk/admissions/application-process/) |
| Punjab University | BS programs | 75% × (¼ Matric + FSc + Hafiz) ÷ (¼ Matric total + FSc total) + 25% Test | PU entry test (%) | [Admission Regulations Book 2026-27](https://pu.edu.pk/downloads/Admission-Regulations-Book.pdf) pp.13, 27 |
| Punjab University | B.Sc. Engineering | FSc 67% + Test 33% | ECAT, 400 marks (or PU-E/PU-M/PU-CSP/NUST as %) | [Admission Regulations Book 2026-27](https://pu.edu.pk/downloads/Admission-Regulations-Book.pdf#page=83) |

### Closing merits

Merit data is from the **2025–26 admission cycle** (last updated November 2026).

- **UET:** official [merit list PDFs](https://admission.uet.edu.pk/downloads), Main and KSK campuses. For each program and category the latest list it appears in is used (lists 1–12 and the leftover-seat lists).
- **FAST:** FAST doesn't publish closing merits, so these come from a [FUNGEP post](https://www.instagram.com/p/DbV1u4xCA7T/) (2nd list).
- **ITU:** merit of the last candidate on each program's final [2026 merit list](https://itu.edu.pk/merit-lists-2026/).
- **PU:** [Merit of Last Year 2025](https://pu.edu.pk/downloads/Merit-of-Last-Year-2025.pdf), Lahore campuses.

### Assumptions

- ITU only publishes the Matric/Inter split for BS CS and BS AI (15:35). The same ratio is assumed for its other programs, and the app marks these with an asterisk.
- PU's 2025 closing merits were calculated without an entry test, so PU results are estimates.
- FAST and PU's own entry test don't publish their total marks, so those results are shown as a percentage of the test.
- PU engineering accepts ECAT, PU-E, PU-M, PU-CSP or the NUST test. The app shows marks out of 400 for ECAT, plus the percentage needed in any of the others.
- The form starts with Punjab boards' current totals (Matric 1200, FSc Part-1 600, full FSc 1200). Students on the older 1100/550 scheme can change the totals.

## Running it

It's a static site with no build step. Open `index.html` in a browser, or serve the folder:

```
npx serve .
```

### Project layout

```
index.html            page markup, meta and share-preview tags
css/styles.css        styles; light theme in :root, dark theme below it
js/calc.js            merit formulas (shared by the page and the tests)
js/app.js             rendering, filters, saved inputs, theme toggle
data/*.js             formulas, closing merits and sources per university
scripts/extract_uet.py  rebuilds data/uet.js from UET's merit list PDFs
tests/calc.test.js    formula and data tests
```

### Tests

```
npm test
```

The tests check the formulas against hand calculations. They also check that every required score is the smallest one that reaches the closing merit, and that every formula and merit has a working source link.

### Updating the data

```
pip install pdfplumber
python scripts/extract_uet.py
```

The other universities' data lives in `data/fast.js`, `data/itu.js` and `data/pu.js`. When you load a new admission cycle, also update the "Merit data" line in the footer of `index.html` and the date in this README.

## Deploying

The site is hosted on GitHub Pages from the `main` branch, root folder (Settings → Pages). Every push to `main` goes live within a couple of minutes. Browsers may keep the old version for up to 10 minutes, so hard-refresh (Ctrl+F5) to see a change straight away.

The share-preview tags in `index.html` (`og:url`, `og:image`) point at https://ammarshahzad365.github.io/kitne-marks/. If the site moves to another address, update them.

## Author

Made by Ammar Shahzad · [github.com/ammarshahzad365](https://github.com/ammarshahzad365)
