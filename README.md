<div align="center">

# 🚀 Portfolio Transparent

<img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png" alt="Next.js Logo" width="120" height="120" />

### ✨ Data-Driven Fullstack Developer Portfolio ✨

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br/>

*Modern, responsive, dan transparent portfolio yang menampilkan perjalanan development secara real-time*

---

</div>

## 📋 Daftar Isi

- [🎯 Tentang Project](#-tentang-project)
- [✨ Fitur Utama](#-fitur-utama)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Struktur Project](#-struktur-project)
- [🚀 Quick Start](#-quick-start)
- [📜 Scripts](#-scripts)
- [🎨 Design System](#-design-system)
- [🤝 Contributing](#-contributing)

---

## 🎯 Tentang Project

**Portfolio Transparent** adalah portfolio website modern yang dibangun dengan prinsip **transparansi** dan **data-driven development**. Website ini tidak hanya menampilkan hasil kerja, tetapi juga proses development secara real-time, termasuk:

- 📊 **Live commit statistics**
- ⏱️ **Coding hours tracking**
- 🔄 **Real-time project updates**
- 📈 **Progress visualization**

> *"Transparency builds trust. This portfolio shows not just what I built, but how I built it."*

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🦸 **Hero Section** | Landing page yang eye-catching dengan animasi smooth |
| 📊 **Live Stats** | Statistik real-time dari GitHub & coding activity |
| 🎨 **Project Showcase** | Gallery project dengan detail informasi |
| 🌙 **Dark Mode** | UI yang nyaman di mata dengan tema gelap |
| 📱 **Responsive** | Perfect experience di semua device |
| ⚡ **Performance** | Optimized dengan Next.js 16 App Router |

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="120">
<img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
<br>Next.js 16
</td>
<td align="center" width="120">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br>React 19
</td>
<td align="center" width="120">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
<br>TypeScript 5
</td>
<td align="center" width="120">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
<br>Tailwind CSS 4
</td>
</tr>
</table>

### 📦 Dependencies Utama

```text
├── 🎭 framer-motion    → Animasi smooth & gesture support
├── 🎨 lucide-react     → Icon library yang consisten
├── 🔗 clsx + twMerge   → Utility untuk conditional styling
└── 🗄️ zustand          → State management ringan
```

---

## 📁 Struktur Project

```bash
📦 frontend
├── 📂 public/              # Static assets
├── 📂 src/
│   ├── 📂 app/             # Next.js App Router
│   │   ├── 📄 page.tsx     # Homepage
│   │   ├── 📄 layout.tsx   # Root layout
│   │   └── 📄 globals.css  # Global styles
│   ├── 📂 components/
│   │   ├── 📂 features/    # Feature components
│   │   │   ├── 🦸 Hero.tsx
│   │   │   ├── 📊 Stats.tsx
│   │   │   └── 📋 ProjectList.tsx
│   │   ├── 📂 layout/      # Layout components
│   │   └── 📂 ui/          # Reusable UI components
│   │       ├── 🎬 Animations.tsx
│   │       ├── 🔘 Button.tsx
│   │       ├── 🃏 Card.tsx
│   │       └── ✏️ Typography.tsx
│   ├── 📂 hooks/           # Custom React hooks
│   ├── 📂 lib/             # Utilities & helpers
│   ├── 📂 services/        # API services
│   └── 📂 styles/          # Additional styles
└── 📄 package.json
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17 atau lebih baru
- **npm**, **yarn**, **pnpm**, atau **bun**

### Installation

```bash
# 1. Clone repository
git clone https://github.com/username/portfolio-transparent.git

# 2. Masuk ke folder frontend
cd portfolio-transparent/frontend

# 3. Install dependencies
npm install
# atau
pnpm install

# 4. Jalankan development server
npm run dev
```

### 🌐 Buka di Browser

```
http://localhost:3000
```

---

## 📜 Scripts

| Script | Command | Deskripsi |
|--------|---------|-----------|
| 🔧 **Dev** | `npm run dev` | Jalankan development server |
| 🏗️ **Build** | `npm run build` | Build untuk production |
| 🚀 **Start** | `npm run start` | Jalankan production server |
| 🔍 **Lint** | `npm run lint` | Check code quality dengan ESLint |

---

## 🎨 Design System

Portfolio ini menggunakan design system yang konsisten:

### 🎨 Color Palette

| Token | Contoh | Deskripsi |
|-------|--------|-----------|
| `primary` | 🟣 Purple | Warna utama untuk CTA |
| `secondary` | 🔵 Blue | Warna pendukung |
| `accent` | 🟢 Emerald | Highlight & status |
| `background` | ⚫ Dark | Base dark theme |
| `foreground` | ⚪ Light | Text color |

### 📱 Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

---

## 🤝 Contributing

Kontribusi sangat diterima! Berikut langkah-langkahnya:

1. **Fork** repository ini
2. **Create branch** untuk fitur baru (`git checkout -b feature/amazing-feature`)
3. **Commit** perubahan (`git commit -m 'Add amazing feature'`)
4. **Push** ke branch (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

---

<div align="center">

### 📫 Connect with Me

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/vickyymosafan)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/vickymosafan)

---

**Made with ❤️ and ☕ by Vicky Mosafan**

<sub>Built with Next.js 16 • React 19 • TypeScript • Tailwind CSS 4</sub>

</div>
