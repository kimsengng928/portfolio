#!/usr/bin/env python3
"""Apply feed layout shell to all HTML pages except index.html (MyPortfolio v2)."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

HEADER_RE = re.compile(
    r"<body[^>]*>.*?<main\s+id=[\"']main[\"']\s*>",
    re.DOTALL | re.IGNORECASE,
)

NEW_HEADER = """<body class="case-page">
  <a class="skip-link" href="#main">Skip to main content</a>

  <div class="collapse navbar-collapse custom-navmenu" id="main-navbar">
    <div class="container-fluid container-feed px-3 px-lg-4 py-2 py-md-5">
      <div class="row align-items-start">
        <div class="col-md-2">
          <nav aria-label="Mobile menu">
            <ul class="custom-menu">
              <li><a href="index.html">Home</a></li>
              <li><a href="about.html">About Me</a></li>
            </ul>
          </nav>
        </div>
        <div class="col-md-6 d-none d-md-block mr-auto" aria-hidden="true"></div>
        <div class="col-md-4 d-none d-md-block">
          <h3 class="h5">Contact</h3>
          <p><a href="mailto:kimseng.ng@gmail.com">kimseng.ng@gmail.com</a></p>
        </div>
      </div>
    </div>
  </div>

  <header class="feed-header">
    <nav class="navbar navbar-light custom-navbar" aria-label="Site">
      <div class="container-fluid container-feed px-3 px-lg-4">
        <a class="navbar-brand" href="index.html">Kimseng Ng</a>
        <button type="button" class="burger" id="main-menu-toggle" data-bs-toggle="collapse" data-bs-target="#main-navbar" aria-controls="main-navbar" aria-expanded="false" aria-label="Open menu">
          <span class="visually-hidden">Menu</span>
          <span aria-hidden="true"></span>
        </button>
      </div>
    </nav>
  </header>

  <main id="main" class="case-content">"""


def patch_head(html: str) -> str:
    if "portfolio-redesign.css" not in html:
        html = re.sub(
            r'(<link href="assets/css/style\.css" rel="stylesheet">)',
            r'\1\n  <link href="assets/css/portfolio-redesign.css" rel="stylesheet">',
            html,
            count=1,
        )
    # Remove broken bundled Google Fonts comment+link
    html = re.sub(
        r"\s*<!--\s*Google Fonts\s*-->\s*\n\s*<link href=\"https://fonts\.googleapis\.com/css\?[^\"]+\"[^>]*>\s*",
        "\n",
        html,
    )
    # Remove standalone DM Sans if present (about)
    html = re.sub(
        r"\s*<link href=\"https://fonts\.googleapis\.com/css2\?family=DM\+Sans[^\"]+\"[^>]*>\s*\n?",
        "\n",
        html,
    )
    if "Plus+Jakarta+Sans" not in html:
        html = re.sub(
            r'(<link href="assets/img/apple-touch-icon\.png" rel="apple-touch-icon">)',
            r"""\1

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,500&display=swap" rel="stylesheet">""",
            html,
            count=1,
        )
    if 'name="theme-color"' not in html and "name='theme-color'" not in html:
        html = re.sub(
            r"(<meta[^>]*viewport[^>]*>)",
            r'\1\n  <meta name="theme-color" content="#ffffff">',
            html,
            count=1,
            flags=re.I,
        )
    return html


def patch_footer_container(html: str) -> str:
    html = re.sub(
        r'(<footer class="footer"[^>]*>\s*)<div class="container">',
        r'\1<div class="container-fluid container-feed px-3 px-lg-4 py-3">',
        html,
        count=1,
    )
    # Prev/next row
    html = re.sub(
        r'(<footer class="footer"[^>]*>\s*<div class="container-fluid container-feed[^>]*>\s*<div class="row)',
        r"\1 case-footer-nav",
        html,
        count=1,
    )
    return html


def patch_back_to_top(html: str) -> str:
    return re.sub(
        r'(<a href="#" class="back-to-top[^"]*")(\s*)(>)',
        r'\1\2 aria-label="Back to top"\3',
        html,
        count=1,
    )


def process_file(path: Path) -> bool:
    raw = path.read_text(encoding="utf-8", errors="replace")
    if path.name == "index.html":
        return False
    m = HEADER_RE.search(raw)
    if not m:
        print(f"SKIP (no main match): {path.name}")
        return False
    html = HEADER_RE.sub(NEW_HEADER, raw, count=1)
    html = patch_head(html)
    html = patch_footer_container(html)
    if 'aria-label="Back to top"' not in html:
        html = patch_back_to_top(html)
    path.write_text(html, encoding="utf-8")
    print(f"OK: {path.name}")
    return True


def main():
    for p in sorted(ROOT.glob("*.html")):
        if p.name == "index.html":
            continue
        process_file(p)


if __name__ == "__main__":
    main()
