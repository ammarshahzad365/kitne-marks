"""Build data/uet.js from UET Lahore's official Fall 2026 merit list PDFs.

For every (campus, program, category, session) we keep the closing merit from
the LATEST list it appears in, and record which list that was so the app can
link straight to the source PDF.

Usage:
    pip install pdfplumber
    python scripts/extract_uet.py

PDFs are downloaded into scripts/.cache/ (git-ignored).
"""
import json
import pathlib
import re
import urllib.request

import pdfplumber

BASE = "https://admission.uet.edu.pk/uploads/downloads/"

# In publication order. Titles are as shown on https://admission.uet.edu.pk/downloads
LISTS = [
    ("L1", "Merit List No. 1 (Minimum Aggregate)", "91a868d2-dfcb-4974-af21-453f6b6853d0"),
    ("L2", "Merit List No. 2 (Closing Merits)", "a8090b4d-2448-42e7-999a-a948573c7f3b"),
    ("L3", "Merit List No. 3 (Minimum Merit)", "f6d38fa4-a086-42a7-8c53-b2e9a52c99df"),
    ("L4", "Merit List No. 4 (Closing Merit Report)", "bce6493e-8fe7-4e9e-a013-92003937d908"),
    ("L7", "Merit List No. 7 (Waiting Queue Closing Merit)", "0116ccde-7b9b-465b-a103-71ebc625fd6a"),
    ("L8", "Merit List No. 8 (Waiting Queue Closing Merit)", "6b28c330-8368-43c3-809c-34f69e22422f"),
    ("L9", "Merit List No. 9 (Waiting Queue Closing Merit)", "6268b274-1681-45ee-bae6-e4a8de33ca11"),
    ("L10", "Merit List No. 10 (Minimum Aggregate)", "e4fcf3d0-6f9b-4e9d-9b5a-8e5337e5b86f"),
    ("L11", "Merit List No. 11 (Minimum Aggregate)", "31d4b7fb-9afd-43c8-8156-e497b099c56f"),
    ("L12", "Merit List No. 12 (Minimum Aggregate)", "bc454c2c-3f51-4ce9-919d-5160f768701f"),
    ("L13", "Available Leftover Seats & Closing Merits", "4a9dc699-5ac5-4fa7-b188-26b08d523b56"),
    ("L14", "Left Over Seats Closing Merit (8 Sep 2026)", "7b256eee-bf0b-4849-8f62-289dade2157b"),
]

CAMPUSES = {"Main Campus (LHR)", "New Campus (KSK)"}

ROOT = pathlib.Path(__file__).resolve().parent.parent
CACHE = ROOT / "scripts" / ".cache"
OUT = ROOT / "data" / "uet.js"


def squash(s):
    return re.sub(r"\s+", "", s or "")


def download(file_id):
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / f"{file_id}.pdf"
    if not path.exists():
        # The UET server rejects urllib's default user agent.
        req = urllib.request.Request(BASE + file_id + ".pdf", headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            path.write_bytes(resp.read())
    return path


def read_rows(path):
    """Return the list's rows as dicts keyed by normalised header names."""
    rows = []
    with pdfplumber.open(path) as pdf:
        header = None
        for page in pdf.pages:
            for table in page.extract_tables():
                for raw in table:
                    cells = [(c or "").replace("\n", " ").strip() for c in raw]
                    if cells and cells[0] in ("Campus", "Seat ID"):
                        header = [squash(c).lower() for c in cells]
                        continue
                    if header and len(cells) == len(header):
                        rows.append(dict(zip(header, cells)))
    return rows


def main():
    pretty = {}      # squashed name -> name with spaces
    types = {}       # (campus, program) -> "ECAT" / "Non-ECAT"
    latest = {}      # (campus, program, category, session) -> (value, list id)

    for list_id, _, file_id in LISTS:
        per_list = {}
        for r in read_rows(download(file_id)):
            campus = r.get("campus", "")
            program = r.get("discipline") or r.get("program", "")
            value = next(v for k, v in r.items() if "merit" in k or "aggregate" in k)
            # Some PDFs drop spaces ("EnglishLanguage"); keep the best-spaced spelling seen.
            for name in (campus, program):
                best = pretty.get(squash(name), "")
                if name.count(" ") > best.count(" "):
                    pretty[squash(name)] = name
            key = (squash(campus), squash(program), r["category"], r["session"])
            if r.get("type"):
                types[key[:2]] = r["type"].replace("Non-ECAT", "Non-ECAT")
            # Leftover-seat lists have one row per seat: the program closes at the lowest one.
            v = float(value)
            per_list[key] = min(v, per_list.get(key, v))
        for key, v in per_list.items():
            latest[key] = (v, list_id)

    programs = {}
    for (campus, program, category, session), (v, list_id) in sorted(latest.items()):
        campus_name = pretty.get(campus, campus)
        if campus_name not in CAMPUSES:
            continue
        name = pretty.get(program, program)
        if session != "Morning":
            name += f" ({session})"
        kind = types.get((campus, program), "ECAT")
        entry = programs.setdefault((campus_name, name), {
            "name": name,
            "campus": campus_name,
            "formula": "ecat" if kind == "ECAT" else "nonEcat",
            "merits": {},
        })
        entry["merits"][category] = {"v": v, "src": list_id}

    sources = {lid: {"label": f"UET {title}", "url": BASE + fid + ".pdf"} for lid, title, fid in LISTS}
    data = {"programs": list(programs.values()), "meritSources": sources}
    OUT.write_text(
        "// Generated by scripts/extract_uet.py from UET's official merit list PDFs. Do not edit by hand.\n"
        "window.MERIT_DATA = window.MERIT_DATA || {};\n"
        f"window.MERIT_DATA.uetMerits = {json.dumps(data, indent=2)};\n",
        encoding="utf-8",
    )
    print(f"wrote {len(programs)} programs to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
