# Wisnus Web Survey

![Logo BPS](public/bps_logo.png)

Wisnus Web Survey adalah platform survei online modern yang dirancang untuk memudahkan pengumpulan dan analisis data. Proyek ini dibangun menggunakan teknologi web terbaru untuk memberikan pengalaman pengguna yang cepat, responsif, dan intuitif.

## ✨ Fitur Utama

- **Autentikasi Pengguna**: Sistem login dan registrasi yang aman untuk responden dan administrator.
- **Manajemen Survei**: Membuat, mengedit, dan mengelola berbagai jenis survei dengan mudah.
- **Pengisian Survei Interaktif**: Antarmuka yang ramah pengguna untuk mengisi survei.
- **Desain Responsif**: Tampilan yang optimal di berbagai perangkat, mulai dari desktop hingga mobile.

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun dengan tumpukan teknologi modern, antara lain:

- **Framework**: [Next.js](https://nextjs.org/) - React framework untuk aplikasi web modern.
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) - Menambahkan tipe statis pada JavaScript.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utilitas CSS untuk desain yang cepat dan kustom.
- **UI Components**: [Lucide React](https://lucide.dev/) & [Heroicons](https://heroicons.com/) untuk ikonografi.
- **Animasi**: [Framer Motion](https://www.framer.com/motion/) untuk animasi antarmuka yang halus.

## 🚀 Instalasi & Menjalankan Proyek

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda.

**1. Clone Repositori**

```bash
git clone https://github.com/falanarh/wisnus-web-survey.git
cd wisnus-web-survey
```

**2. Instal Dependensi**

Pastikan Anda memiliki Node.js dan npm terinstal. Jalankan perintah berikut di root direktori proyek:

```bash
npm install
```

**3. Jalankan Server Pengembangan**

Proyek ini menggunakan Turbopack untuk pengembangan yang lebih cepat.

```bash
npm run dev
```

**4. Buka di Browser**

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat aplikasi berjalan.

## 📂 Struktur Proyek

Struktur direktori utama proyek ini adalah sebagai berikut:

```
wisnus-web-survey/
├── public/         # Aset statis (gambar, ikon)
├── src/
│   ├── app/        # Halaman dan routing utama (App Router)
│   ├── components/ # Komponen React yang dapat digunakan kembali
│   ├── context/    # Konteks React untuk manajemen state global
│   └── css/        # File CSS global
├── .gitignore
├── next.config.ts  # Konfigurasi Next.js
├── package.json    # Dependensi dan skrip proyek
└── README.md
```