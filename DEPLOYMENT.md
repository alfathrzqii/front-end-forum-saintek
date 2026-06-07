# Deployment Guide for Forum Saintek Frontend

## Analisis Persiapan Production

Sebelum project ini dapat dideploy ke production, ada beberapa hal yang sebelumnya kurang dan telah ditambahkan:

1. **Environment Variables untuk Production (`.env.production`)**
   - Sebelumnya project hanya memiliki `.env.example` yang mana `VITE_API_BASE_URL` mengarah ke `http://localhost:5000`.
   - Untuk production, React (Vite) harus dibuild dengan variable lingkungan yang benar. Kita telah menambahkan file `.env.production` dengan nilai `VITE_API_BASE_URL=https://api.forumsaintek.my.id`.

2. **Nginx Configuration (`nginx.conf.example`)**
   - Project React yang menggunakan React Router (Client-Side Routing / SPA) memerlukan konfigurasi server khusus.
   - Jika pengguna mengakses `https://forumsaintek.my.id/login` secara langsung, Nginx secara default akan mencari folder/file bernama `login`, yang mana akan menyebabkan error `404 Not Found`.
   - Oleh karena itu, kita harus menambahkan instruksi `try_files $uri $uri/ /index.html;` agar Nginx selalu mengembalikan file `index.html` dan membiarkan React Router yang menangani routing halamannya.
   - Konfigurasi untuk Cloudflare Origin Certificate (SSL) juga telah disiapkan pada file ini.

---

## Langkah-langkah Lengkap Deployment ke VM (Google Cloud)

### 1. Setup Cloudflare SSL (Origin Certificate)
Karena kamu menggunakan mode Strict di Cloudflare, kita perlu membuat Origin Certificate.
1. Buka dashboard Cloudflare, pilih domain `forumsaintek.my.id`.
2. Buka menu **SSL/TLS** -> **Origin Server**.
3. Klik **Create Certificate**. Biarkan setting default (RSA, 15 years), lalu klik **Create**.
4. Kamu akan mendapatkan dua text box: **Origin Certificate** (PEM) dan **Private Key** (KEY).
5. Masuk ke VM kamu via SSH.
6. Buat file sertifikat:
   ```bash
   sudo nano /etc/ssl/certs/cloudflare_forumsaintek.pem
   ```
   *Paste isi dari kotak "Origin Certificate" ke dalam file ini, lalu save (Ctrl+X, Y, Enter).*
7. Buat file private key:
   ```bash
   sudo nano /etc/ssl/private/cloudflare_forumsaintek.key
   ```
   *Paste isi dari kotak "Private Key" ke dalam file ini, lalu save.*

### 2. Mempersiapkan Folder untuk Frontend
Kita akan menempatkan hasil build (folder `dist`) di direktori yang biasa digunakan oleh Nginx.
1. Buat foldernya:
   ```bash
   sudo mkdir -p /var/www/forumsaintek.my.id/html
   ```
2. Berikan permissions yang sesuai:
   ```bash
   sudo chown -R $USER:$USER /var/www/forumsaintek.my.id/html
   sudo chmod -R 755 /var/www/forumsaintek.my.id
   ```

### 3. Build Project di VM
Karena kamu sudah melakukan clone repository di VM:
1. Masuk ke folder repository project frontend-mu.
   ```bash
   cd /path/to/your/cloned/repo
   ```
2. Pastikan file `.env.production` sudah ada dengan isi `VITE_API_BASE_URL=https://api.forumsaintek.my.id`. (Kamu bisa mengeceknya dengan `cat .env.production` atau buat filenya jika belum ter-pull: `echo "VITE_API_BASE_URL=https://api.forumsaintek.my.id" > .env.production`).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build project-nya:
   ```bash
   npm run build
   ```
   *Perintah ini akan membuat folder `dist/` di dalam project.*
5. Copy/pindahkan hasil build ke folder Nginx yang kita buat sebelumnya:
   ```bash
   cp -r dist/* /var/www/forumsaintek.my.id/html/
   ```

### 4. Konfigurasi Nginx
1. Buat file konfigurasi Nginx baru untuk domain ini:
   ```bash
   sudo nano /etc/nginx/sites-available/forumsaintek.my.id
   ```
2. Copy isi file `nginx.conf.example` yang ada di repository ini dan paste ke dalam nano editor. Jika ada perbedaan lokasi file SSL atau folder root, sesuaikan dengan instruksi yang sudah kamu lakukan. Simpan file tersebut.
3. Enable konfigurasi dengan membuat symlink ke `sites-enabled`:
   ```bash
   sudo ln -s /etc/nginx/sites-available/forumsaintek.my.id /etc/nginx/sites-enabled/
   ```
4. Test konfigurasi Nginx untuk memastikan tidak ada typo atau error:
   ```bash
   sudo nginx -t
   ```
5. Jika test sukses (`syntax is ok`), reload Nginx:
   ```bash
   sudo systemctl reload nginx
   ```

### 5. Finalisasi di Cloudflare
Pastikan pengaturan DNS di Cloudflare (Menu **DNS**) untuk `forumsaintek.my.id` (A Record) sudah mengarah ke IP Address VM Google Cloud kamu, dan status Proxy-nya **Proxied (Awan Orange)**.

Selamat! Frontend aplikasi Forum Saintek sudah berhasil di-deploy. Buka browser dan akses `https://forumsaintek.my.id`.