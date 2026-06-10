# Forum SAINTEK

Forum SAINTEK adalah platform diskusi daring yang dirancang khusus untuk mahasiswa Fakultas Sains dan Teknologi (SAINTEK). Proyek ini merupakan aplikasi web *front-end* yang dibangun menggunakan React, Vite, dan Tailwind CSS, serta terhubung dengan Express JS Back-End melalui REST API.

## Fitur Utama

- **Autentikasi Pengguna**: Registrasi akun baru, login, dan manajemen sesi menggunakan token Bearer.
- **Manajemen Thread**: Pengguna dapat membuat thread baru, melihat daftar thread terbaru, dan melihat detail thread secara mendalam.
- **Sistem Subforum**: Kategorisasi thread berdasarkan subforum atau topik tertentu.
- **Sistem Komentar**: Pengguna dapat berpartisipasi dalam diskusi dengan memberikan komentar atau membalas komentar pengguna lain.
- **Voting**: Sistem voting (upvote/downvote) dengan mekanisme *toggle* pada setiap thread atau komentar.

## Teknologi yang Digunakan

- **Framework**: [React](https://react.dev/) (v18+)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router Dom](https://reactrouter.com/) (v6+)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **HTTP Client**: [Axios](https://axios-http.com/)

## Persiapan & Instalasi

### Prasyarat
- [Node.js](https://nodejs.org/) (versi terbaru direkomendasikan)
- [npm](https://www.npmjs.com/)

### Langkah Instalasi
1. Clone repositori ini:
   ```bash
   git clone https://github.com/izzanbcy/front-end-forum-saintek
   cd front-end-forum-saintek
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Konfigurasi Environment Variables:
   Buat file `.env` di direktori akar dan tambahkan alamat base URL backend Anda:
   ```env
   VITE_API_BASE_URL=https://api.anda.com
   ```

4. Jalankan aplikasi dalam mode pengembangan:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173`.

## Struktur Folder

Proyek ini mengikuti struktur folder berikut sesuai dengan panduan pengembangan:

- `src/components`: Komponen UI yang dapat digunakan kembali (Navbar, ThreadCard, dll).
- `src/pages`: Komponen halaman utama (Home, Login, Register, ThreadDetail, SubforumDetail).
- `src/store`: Manajemen state menggunakan Zustand (seperti `authStore.js`).
- `src/services`: Konfigurasi Axios dan fungsi untuk pemanggilan API.

## Credits
Dikembangkan untuk memenuhi tugas akhir mata kuliah Komputasi Awan.
- [@izzanbcy](https://github.com/izzanbcy) (Front-End Developer)
- [@keyie2906-cmd](https://github.com/keyie2906-cmd) (Designer)
- [@alfathrozaqi](https://github.com/alfathrozaqi) (Back-End Developer)
