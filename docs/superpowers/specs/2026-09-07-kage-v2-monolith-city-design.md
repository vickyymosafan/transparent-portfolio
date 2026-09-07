# Spec v2: Kage Portfolio — Monolith City, Scene Interludes & Richness Pass

Tanggal: 2026-09-07
Status: Approved (design)
Basis: feedback visual human (screenshot v1) + riset threeui (templeNightRenderer) + riset context7 (three r185 / R3F v9)
Branch kerja: `kage-redesign` (lanjutan; v1 + polish wave sudah di atasnya)

## 1. Masalah v1 (dari screenshot)

1. Scene terasa kosong: starfield polos, bulan pucat, monolit tak terlihat.
2. Kartu Projects hitam — scissor windows menunjuk area tanpa cahaya.
3. Layout monoton — tanpa momen tipografi besar; portrait bentrok bulan.
4. Animasi dangkal — tak ada parallax mouse, scroll-driven drama, atau reveal yang hidup.
5. Kehilangan rasa "berlapis" — Kage asli punya 6 layer foreground cutout; v1 tidak punya sama sekali.

## 2. Keputusan (disetujui)

1. **Monolith City** — menara dengan jendela menyala, HDR glow, fog berlapis, embers. Bukan sanctuary figuratif.
2. **Foreground layer dengan aset milik sendiri** — siluet SVG prosedural (React components), bukan aset Kage.
3. **Scene Interludes** — tiap chapter dibuka interlude 100vh (angka raksasa outline + judul display + tagline) sebelum konten.
4. **Bloom postprocessing** — `@react-three/postprocessing`, `mipmapBlur`, `luminanceThreshold={1}`; composer priority 1, scissor rig pindah ke priority 2. Teks DOM tetap tajam.
5. **Mouse parallax + scroll progress** — damp ke `state.pointer` (priority 0); progress scroll diakumulasi non-React, dibaca rig.
6. Bulan dipindah ke kiri-atas (tidak bentrok portrait). Portrait tetap.

## 3. Arsitektur Scene v2 (9 layer, atas → bawah)

| # | Layer | Implementasi | Nilai kunci |
|---|---|---|---|
| 1 | Sky dome | `SphereGeometry` BackSide + ShaderMaterial gradient | bottom `#0a0f16` → top `#05070a`, hint FBM |
| 2 | Stars | MistField diubah: flicker halus, fade by height | ~420 desktop / 180 weak |
| 3 | Blood Moon v2 | warna >1.0 `toneMapped={false}` + fresnel halo shell (BackSide, alpha `(1-|dot|)^3`) + halo quad additive | posisi kiri-atas `(-3.2, 3.8, -14)` |
| 4 | Monolith City | InstancedMesh menara + tekstur jendela canvas prosedural per-tower (grid jendela; sebagian menyala hangat `#ffb37a`, sisanya gelap); 3 hero towers emissive lebih kuat | jendela menyala = sumber bloom |
| 5 | Ridges | 2 plane siluet hitam crest noise | fog OFF, `#04070b` |
| 6 | Fog banks | 4 plane FBM scrolling, `depthWrite:false`, renderOrder eksplisit | kecepatan beda = parallax |
| 7 | Embers | Partikel hangat naik pelan, tint `vec3(1.6,.78,.42)` | ~460 desktop / 220 weak |
| 8 | Grade | `FogExp2(#050a0e, ~0.02)`; vignette+grain CSS tetap | kontras teal vs hangat |
| 9 | Bloom | `<EffectComposer multisampling={0}><Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={1.1} /></EffectComposer>` | hanya sumber >1 memendar |

Kamera/rig:
- `useFrame` priorities: parallax mouse = 0; composer (bloom) = 1 (internal); **scissor rig pindah ke 2** (render setelah composer, digambar di atas frame yang sudah dipost-process).
- Scroll progress: akumulator modul-level (`scroll-progress.ts`) di-update listener, rig damp ke sana; menambah drift kamera kecil per kedalaman.
- Mouse parallax: damp `camera.position.x/y` ke `pointer * (0.4/0.2)` (priority 0, sebelum render).

## 4. Foreground Layers (aset sendiri, kode)

- 3 komponen SVG prosedural: `DryTree`, `BrokenTower`, `GrassTufts` — path digenerate dari seed (fungsi noise), edge feathered (gradient alpha di SVG).
- Layer `fixed` bottom, z antara scrim dan konten (`z-[3]` dalam .page flow), `filter: saturate(.85) brightness(.8)`, sway 21s.
- Chapter-owned: tiap chapter menampilkan 1–2 siluet yang fade+rise saat chapter aktif (pola `[data-fg]` Kage), dissolve saat pindah.
- Parallax scroll ringan: translateY = -(progress * kecepatan-layer).

## 5. Scene Interludes (struktur chapter)

- Setiap chapter (About, Stats, Projects) = `<section data-chapter>` yang sekarang berisi: **interlude 100vh** + konten lama.
- Interlude: angka raksasa outline (`text-transparent` stroke bone/10, ~20vw, `aria-hidden`, parallax lambat) + judul display `clamp(48px, 10vw, 140px)` + satu kalimat tagline; reveal blur-in + letter-spacing settle.
- Anchor `#chapter-*` dan chips/rail tidak berubah (interlude di dalam section yang sama).
- Scrims: interlude lebih terbuka (`sec-scrim--open`), konten tetap pekat.

## 6. Kartu Projects v2 ("framing the lit")

- Registry LiveWindow baru: `{ el, cam: [x,y,z], look: [x,y,z] }` per kartu (bukan offset X):
  - Kartu 1 "Window Tower": kamera dekat hero tower berjendela.
  - Kartu 2 "Moon over Ridge": kamera tinggi menghadap kiri-atas (bulan + ridge).
  - Kartu 3 "Ember Drift": kamera rendah dekat arus ember + fog.
- Rig: `cardCam` posisi/lookAt dari registry (bukan copy+offset); aspect = r.width/r.height (sudah ada).
- CSS glow di dalam kartu pada posisi sumber cahaya (`--gx/--gy/--gr` persen), dua animasi desinkron: swell 9.7s (scale .93→1.07) + pulse 6.1s — moon breathes.
- Hover: target kamera kartu damp mendekat ~10% (push in).

## 7. Ekstra

- Kinetic marquee tipis di atas footer: `LIVE DATA · SHIPPED · OPEN SOURCE · NO FLUFF ·` loop lambat, stroke-text redup, reduced-motion = statis.
- Stats: angka count-up saat masuk viewport (framer-motion `animate`/`useSpring`).
- Finale: reveal berjenjang (eyebrow → judul → CTA).
- Bulan: kiri-atas; portrait hero tetap.

## 8. Performa & Ketahanan

- DPR tetap `[1, 1.75]`; embers/stars pakai heuristik perangkat yang ada (`countParticles`-style).
- Semua layer baru = shader/plane murah; fog banks 4 plane; tanpa shadow map baru.
- `prefers-reduced-motion`: bloom tetap (bukan motion), fog banks statis, embers near-static, interlude reveal instan, marquee statis.
- no-WebGL: fallback CSS tetap; foreground SVG tetap tampil (DOM).
- Pause render saat tab hidden (tetap).

## 9. Out of Scope

- Tidak meniru aset Kage (semua foreground = kode kita sendiri).
- Tidak mengubah layanan data / konten proyek.
- Tidak ada shadow maps baru; tidak ada model 3D eksternal.
- Warna palet tetap token v1 (+ jendela hangat `#ffb37a` sebagai nilai scene).
