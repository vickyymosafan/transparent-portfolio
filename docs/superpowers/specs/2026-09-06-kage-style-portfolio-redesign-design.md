# Design: Kage-Style Portfolio Redesign (Logic Only, No Assets)

Tanggal: 2026-09-06
Status: Approved (design)
Referensi: threeui.com "Kage Landing Page" (repo: MengTo/threeui, `public/landing-pages/kage.html`) — **pola & logika saja, tanpa aset apa pun** (tanpa render kuil, gambar generated, PNG cut-out, font bundel Kage).

## 1. Latar & Keputusan

Portfolio saat ini: Next.js (App Router) + Tailwind, section Hero / About / Stats (Live GitHub + WakaTime) / Projects / Contact, dengan `Reveal` + `TextReveal` existing, noise overlay, dan grid pattern.

Keputusan yang disetujui:

1. **Scene latar**: WebGL abstrak atmosferik, murni shader — partikel kabut, glow bulan ember merah, siluet monolitik. Tanpa aset gambar.
2. **Palet**: dark Kage-family — near-black `#05070a`, vermilion `#e0231c`, ember `#ff5a3c`, bone `#dfe7e0`. **Tanpa elemen bahasa Jepang/kanji** sama sekali.
3. **Kopling scene ↔ chapter**: evolusi penuh per chapter (kamera, fog, warna, perilaku partikel berubah per section) dengan lerp ~1.2–1.5s.
4. **Pendekatan**: A — react-three-fiber (R3F) scene manager penuh + scissor windows + fallback CSS no-WebGL.

## 2. Arsitektur & Layer System

```
z-80  Custom Cursor (ring, pointer-fine saja)
z-60  Grain overlay (noise, mix-blend-overlay) — reuse existing
z-55  Vignette (radial-gradient fixed)
z-50  Nav (fixed; hide-on-scroll-down; blur wash saat stuck)
z-45  Progress Rail (kanan tengah, per chapter)
z-10  .page → konten section (chapters)
z-1   Scrim per-section (radial-gradient + mask, jaga copy terbaca)
z-0   <SceneCanvas> fixed full-viewport (tidak ikut scroll)
```

Struktur file baru/berubah:

```
src/components/canvas/
  SceneCanvas.tsx         # R3F Canvas fixed; DPR cap; pause saat hidden
  MistField.tsx           # Points + shader (partikel kabut / data-stream)
  Monoliths.tsx           # InstancedMesh boxes + fog (siluet karya)
  EmberMoon.tsx           # shader glow bulan ember
src/lib/
  scene-state.ts          # definisi state scene per chapter (kamera, fog, warna, partikel)
  use-chapter-observer.ts # IntersectionObserver → chapter aktif
src/components/ui/
  SceneScrims.tsx         # scrim per-section (CSS murni)
  ProgressRail.tsx        # rail kanan: garis per chapter, aktif = lebih panjang
  CustomCursor.tsx        # ring 26px, expand 52px saat hover interaktif
  Preloader.tsx           # mark + progress bar + persentase
```

State: **zustand** (dependency baru — R3F sendiri dibangun di atasnya) untuk store `activeChapter: 'hero' | 'about' | 'stats' | 'projects' | 'finale'`. Scene membaca store dan lerp ke state chapter target (~1.2–1.5s, easing `cubic-bezier(.16,1,.3,1)`) di dalam `useFrame`, tanpa re-render React.

**Dependencies baru:** `three`, `@react-three/fiber` (v9 — kompatibel React 19 / Next 16), `zustand`. `@react-three/drei` hanya jika ada helper konkret yang dibutuhkan (tidak wajib). Reveal yang sudah ada berbasis `framer-motion` + CSS dipertahankan/diperluas.

## 3. Scene — "Monolith of Work"

Dunia tunggal: kegelapan near-black + kabut partikel + deretan monolit samar + satu bulan ember merah. Monolit = metafora karya yang dibangun.

| Chapter | State scene |
|---|---|
| Prologue (Hero) | Wide shot; monolit jauh; bulan merah tinggi kanan; partikel drift lambat; fog bone redup |
| I — About | Kamera mendekat pelan; fog menghangat; satu monolit mulai tersirat |
| II — Stats (Live) | Shift dingin: partikel mengalir vertikal (data-stream); aksen biru-putih dingin + vermilion; denyut sinkron dengan data live |
| III — Projects | Kamera pan horizontal menyusuri deret monolit; kartu = scissor viewport ke scene |
| Finale (Contact) | Kamera mundur & naik; bulan membesar di tengah; gerak minimal — stillness |

Detail teknis scene:

- **MistField**: `THREE.Points` dengan shader partikel (size attenuation, soft-circle alpha, noise drift). ~2.5k partikel desktop, ~800 mobile. Mode "data-stream" = arah velocity vertikal + kecepatan berdenyut (uniform `uStream` 0→1 saat chapter Stats).
- **Monoliths**: `InstancedMesh` box, material gelap dengan emissive tepi tipis; dibuat terlihat samar lewat fog. Distribusi berbaris seperti skyline.
- **EmberMoon**: plane fullscreen shader atau sprite — radial glow dua lapis (vermilion inti, ember tepi), denyut pelan (dua track durasi yang tidak saling membagi, ala pola glow Kage).
- **Fog**: `scene.fog` warna mengikuti state chapter (bone → warm → cool → warm).
- Semua properti yang berubah antar chapter di-drive **uniform + lerp di useFrame**, bukan re-render React.

## 4. Section-by-Section

### Preloader
Monogram + bar 1px + persentase (tabular-nums), uppercase letter-spacing lebar. Fade + visibility off saat scene ready atau timeout ~2s. `body` terkunci scroll selama preloader.

### Hero (100svh)
- Eyebrow: dot vermilion glow + label uppercase 10px.
- H1 display uppercase — reveal per-kata: mask `overflow:hidden`, translateY 110% → 0, stagger ~80ms/kata.
- Sub max-width ~322px, weight 300.
- **Chapter index chips** di foot: 4 kolom (01 About, 02 Stats, 03 Projects, 04 Contact) — klik scroll ke chapter; chip aktif sinkron dengan scroll.
- Scroll cue kanan-bawah: track 54px, animasi scrub 2.8s infinite.
- Teks Hero SSR (bukan LCP blocker); scene fade-in di belakang.

### I — About
- Grid split `1.02fr / 1fr`; H2 `max-width: 11ch`; lead + paragraf kanan.
- Arrow link lingkaran 34px: hover fill bone, ikon near-black, translate ↗.
- Stats band: 3–4 angka besar weight 300 tabular-nums + label uppercase 10px muted; border-top hairline.

### II — Stats / Live Data
- Section head: nomor chapter kecil (vermilion) + H2 + rule line.
- Angka live GitHub/WakaTime: num besar tabular-nums, label uppercase 10px muted.
- Scrim radial lebih pekat di tengah; data-stream terlihat di tepi.

### III — Projects (live-window cards)
- Grid 3 kolom staggered: kartu 2 translateY ~74px, kartu 3 ~148px (desktop).
- Frame kartu 4/5, outline 1px hairline → **scissor viewport** (R3F `useFrame` scissor per ref rect) + gradient scrim bawah dalam frame.
- Label: judul uppercase + meta teknologi; hover: outline terang, arrow fade-in, glow ember.
- Mobile: stack 1 kolom, scissor per-frame tetap berfungsi.

### IV — Finale / Contact (100svh centered)
- H2 display `clamp(38px, 7.4vw, 124px)` uppercase.
- CTA pill: border 1px, radius 100px; hover fill bone menyapu dari bawah (translateY 101% → 0), teks jadi near-black.
- Footer: brand statement (1.4fr) + 3 kolom link ruled; foot-base uppercase 10px + hairline.

## 5. Furniture (porting logika Kage, tanpa aset)

| Elemen | Perilaku |
|---|---|
| Nav | Fixed; hide saat scroll turun, muncul saat naik; blur + wash saat stuck; mobile slide-in sheet kanan; hover link = slide vertikal dua layer |
| Progress Rail | Kanan tengah; 5 tick 14px; aktif 22px bone; klik lompat chapter; hilang di mobile |
| Custom Cursor | Ring 26px → 52px + fill 7% saat hover interaktif; hanya `pointer: fine` |
| Reveal system | Extend `Reveal` existing → `data-rv="up|fade"` + word-mask stagger; dipakai semua heading & copy |
| Section scrim | `radial-gradient` + `mask-image: linear-gradient(transparent, #000 44%)` — copy selalu terbaca; intensitas per-section berbeda (tengah pekat, finale terbuka) |

## 6. Fallback & Performa

**Fallback no-WebGL** (init gagal / context loss):
- Canvas hidden; body memakai CSS murni: radial-gradient bulan merah + fog + near-black.
- Kartu Projects pakai gradient statis (`150deg #101a1d → #0a0d10 → #1a0c0b`).
- Semua konten & wordmark berada di DOM — tidak bergantung scene.

**Performa:**
- DPR cap `[1, 1.75]`; pause saat tab hidden; heuristik perangkat lemah (cores/memory) → kurangi partikel.
- Overlay grain/vignette/scrim = CSS murni, `pointer-events-none`.
- `prefers-reduced-motion`: reveal instan, partikel near-static, transisi chapter crossfade sederhana.
- LCP: teks SSR; scene fade-in di belakang dan bukan LCP.

## 7. Testing & Verifikasi

- `tsc --noEmit` + `eslint` wajib lolos.
- Manual checklist:
  - Scroll 5 chapter → transisi scene lerp benar & scrims menjaga keterbacaan.
  - Kartu Projects scissor render benar (desktop + mobile).
  - Fallback no-WebGL (Chrome `--disable-webgl`) halaman tetap utuh.
  - Reduced-motion (emulasi DevTools) → tanpa animasi berat.
  - Nav hide/stuck, rail aktif mengikuti chapter, preloader tidak mengunci permanen.
  - Lighthouse perf & a11y tidak turun > 5 poin dari baseline.
- Repo belum punya test runner — verifikasi utama via typecheck, lint, dan manual checklist di atas. Unit test untuk `scene-state.ts` (mapping chapter → state) & `use-chapter-observer` hanya jika nanti ditambahkan runner (out of scope untuk redesign ini).

## 8. Out of Scope (YAGNI)

- Tidak menyalin aset/font/kode Kage — hanya pola.
- Tidak menambah halaman baru, CMS, atau i18n.
- Tidak mengubah layanan data GitHub/WakaTime yang ada.
