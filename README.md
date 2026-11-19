# PT Darren Adhi Jaya — Portfolio Website

Static website (HTML/CSS/JS, no build step). Open `index.html` in a browser to view it.

## Pages
- `index.html` — Home: hero, stats, about, featured projects, ongoing projects, services, process, contact
- `projects.html` — All projects with **All / Completed / Ongoing** filter
- `project.html?id=coz` — One project page (photos + facts)

Languages: English, Russian, Dutch, Portuguese (BR), Indonesian — switch at the top right.

## How to update (no coding needed)

| What | File |
|---|---|
| WhatsApp, email, Instagram, years, stats | `assets/js/config.js` |
| Add / edit villas, ongoing progress | `assets/js/projects.js` |
| Change any text / translation | `assets/js/i18n.js` |

### Adding photos
Put photos in `assets/img/projects/<project-id>/`:
- `cover.jpg` — main photo (landscape, at least 2000px wide)
- `1.jpg`, `2.jpg`, `3.jpg` … — gallery photos

Example: `assets/img/projects/coz/cover.jpg`. Until photos exist, a soft placeholder is shown.

**After adding or replacing photos, run:**
```
bash tools/optimize-images.sh
```
It makes fast WebP versions of every photo (800px for phones/cards, 1920px for large views).
The site loads those automatically and falls back to the JPG if you forget — but pages will be slower.
(Needs `cwebp`: `brew install webp`.)

### Inquiry form
The contact section has a "Start your project" form (name, country, contact, land, size, need, start date).
Answers always reach the team **in English**, whatever language the visitor uses.
- By default it opens **WhatsApp** with all answers filled in (needs `whatsapp` in `config.js`), or the email app if only `email` is set.
- To receive inquiries directly by email instead, create a free form at formspree.io and paste its URL into `formEndpoint` in `config.js`.

### Adding an ongoing project
Copy the example at the bottom of `projects.js`, set `status: "ongoing"`, `progress` (0–100) and `stage`
(`foundation`, `structure`, `roof`, `finishing`, `landscaping`). It appears automatically in the
"Currently under construction" section and the Ongoing filter.

## Before launch
- [ ] Fill in WhatsApp number and email in `config.js`
- [ ] Photos: temporary photos were taken from the villas' public Airbnb listings (2026-11-18).
      Get the original high-res files + written permission from the villa owners / photographers before launch.
- [ ] Fill in year, bedrooms, building area, scope per project
- [ ] Ongoing villas (Yugen, Coppa, Born to Live) use drawn "Sample image" placeholders + guessed progress/stage/location — replace with real site photos (same file names: cover.jpg, 1.jpg, 2.jpg, 3.jpg) and real numbers in `projects.js`, then run `bash tools/optimize-images.sh`
- [ ] **Trust content in `assets/js/trust.js` is all SAMPLE data**: replace the client quotes (real clients, with their OK),
      and the NIB / NPWP / AHU / SBU numbers, engineer
      count and warranty terms with the real ones. Then set `sample: false` to remove the "Sample content" labels.
      Never launch with invented quotes or licence numbers.
- [ ] Have RU / NL / PT translations checked by a native speaker (review sheets + brief in `translation-review/`).
      Re-export the sheets after adding the real quotes.
- [ ] Get a vector logo (SVG) from the designer to replace `logo-mark.jpg`
