# Design: Work Experience Chapter (02)

Tanggal: 2026-09-11
Status: Approved (design + copy)
Repo: main @ 4f6ba15 (post Kage v2)

## Keputusan

- Section **Work Experience** ditambahkan sebagai **chapter 02**, setelah About, sebelum Stats.
- Semua teks **bahasa Inggris** (draf disetujui user; lihat §Konten).
- Gaya mengikuti disiplin Kage yang sudah ada: hairline, hover wash `lesson-row`, interlude 100vh dengan angka outline.

## Nomor Chapter (5 chapter)

| # | Chapter | Interlude | Head |
|---|---|---|---|
| 01 | About | The Builder (tetap) | `01 / 05 — About` |
| 02 | Experience | **The Journey** (baru) | `02 / 05 — Experience` |
| 03 | Stats | Live Pulse (dari 02) | `03 / 05 — Live Data` |
| 04 | Projects | The Work (dari 03) | `04 / 05 — Projects` |
| 05 | Contact | — | — |

## Konten (`EXPERIENCE` di `src/services/mockData.ts`)

1. **MQL5 Algo Trading** — Jember Regency, East Java, Indonesia · August 2026 — Present · *Algorithmic Trading Developer*
   - Developed an automated algorithmic trading system (Expert Advisors) and custom technical indicators for the MetaTrader 5 platform using MQL5.
   - Published and sold the financial software on the MQL5 Market, with ongoing maintenance through bug fixes, feature additions, and version updates to keep performance optimal for traders.
2. **Universitas Muhammadiyah Jember** — Jember Regency, East Java, Indonesia · July 2025 — August 2026 · *Freelance Website Developer*
   - Developed a web-based elderly health monitoring system for Posyandu.
   - Features include BMI checks, blood pressure (systolic and diastolic), cholesterol, and uric acid tracking, with automatic trend analysis and health status summaries.
   - Built with Next.js on the frontend, Express.js + Prisma ORM on the backend, and PostgreSQL for the database.
   - Designed for ease of use by Posyandu staff and accurate health data management.
3. **PT. Antosa Architect** — Jember Regency, East Java, Indonesia · April 2025 — July 2025 · *Project Web Architect — Information Systems*
   - Designed and implemented a web-based information system to support architectural project management and company information needs.
   - Responsible for system architecture, user interface (UI), and database design based on project requirements and business workflows.
   - Built web features that improve management, accessibility, and operational efficiency, integrating frontend and backend into a functional, structured system.
   - Applied modern web development practices with a focus on maintainability, usability, and system performance.

## Perubahan Teknis

- `ChapterId` + `CHAPTER_ORDER` + `CHAPTER_LABELS`: sisipkan `"experience"` di posisi 2.
- `CHAPTER_SCENES`: entri baru `experience` — camera `[0.9, 1.15, 7.2]`, lookAt `[0.4, 1.5, 0]`, fogColor `#0b0f14`, fogDensity `0.05`, moonX `-3.0`, moonY `3.6`, moonScale `1.0`, stream `0`, drift `1`.
- `ForegroundLayers` SETS: entri `experience` (DryTree kiri + GrassTufts kanan flip).
- Hero chips: 5 item (about, experience, stats, projects, finale), grid `md:grid-cols-5`, desc experience "Where I've worked".
- SiteNav LINKS + Contact footer Index: tambah `Experience` → `#chapter-experience`.
- Renumber: interlude Stats 02→03, Projects 03→04; head About `/04`→`/05`, Stats `02/04`→`03/05`, Projects `03/04`→`04/05`.
- Section baru `src/components/features/Experience.tsx`: section `id="chapter-experience" data-chapter="experience"`; Interlude numeral `02` title `The Journey` tagline "From freelance builds to algorithmic trading — every stop taught a system."; head `02 / 05 — Experience`; H2 WordMask "Where I've worked"; entri timeline (perusahaan + lokasi kiri, periode kanan tabular, role italic, bullet dengan penanda vermilion tipis); hairline + `lesson-row` hover.
- `page.tsx`: mount `<Experience />` antara `<About />` dan `<StatsSection />`.

## Out of Scope

- Tidak mengubah data/proyek lain, tidak menyentuh scene/komponen lain selain daftar di atas.
- Tidak ada section baru lain.
