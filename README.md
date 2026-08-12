# JEJAK HURUF

**Petualangan Baca Tulis Anak**

Aplikasi web statis untuk mengenalkan huruf, melatih menulis, dan memulai membaca.
Berjalan sepenuhnya di sisi klien (client-side) — tanpa server, tanpa database,
tanpa login, dan bisa langsung diunggah ke GitHub Pages.

---

## 1. Tujuan

Menghubungkan lima tahap belajar dalam satu alur:

**DENGAR → LIHAT → SENTUH → TULIS → BACA**

Contoh huruf A: anak mendengar *"A… A seperti Apel"*, melihat gambar apel,
menyentuh huruf, lalu menelusuri jejak huruf A di kanvas, dan akhirnya
menyusunnya menjadi suku kata dan kata.

## 2. Target Pengguna

- PAUD dan TK
- SD kelas 1 / kelas awal yang belum lancar membaca
- Anak yang sedang belajar menulis
- Guru dan orang tua sebagai pendamping

Antarmuka dirancang khusus untuk anak: tombol besar, teks besar, satu layar
satu tugas, umpan balik positif, dan maskot pemandu bernama **Kiko**.

---

## 3. Fitur

| Menu | Isi |
|---|---|
| **Dengar Huruf** | Alfabet A–Z, ketuk huruf → suara + gambar + kata contoh |
| **Jejak Huruf** | Latihan menulis di kanvas dengan jari/stylus/tetikus, 3 tingkat bantuan, penilaian otomatis |
| **Bermain Huruf** | Cari Huruf, Huruf Awal, Pasangan (seret & lepas) |
| **Mulai Membaca** | Suku kata (BA BI BU BE BO…), Susun Kata, Baca Kalimat |
| **Kampung Hurufku** | Dunia hadiah yang bertumbuh setiap huruf dikuasai |
| **Orang Tua / Guru** | Ringkasan progres, huruf yang perlu latihan, pengaturan, reset |

Fitur pendukung:

- **Penilaian tracing tanpa AI** — jalur huruf diubah menjadi titik waypoint
  berurutan; goresan anak dinilai dari persentase waypoint yang terlewati,
  dengan radius toleransi longgar.
  - ≥ 80% → "Sangat bagus!"
  - 60–79% → "Bagus! Sedikit lagi."
  - < 60% → "Ayo coba lagi." (tanpa tanda silang merah)
- **Tinta Ajaib** — animasi hadiah saat huruf berhasil ditulis
  (kilau, konfeti, huruf memantul, plus animasi khusus: S → ular, I → ikan,
  B → balon, A → semut, K → kucing, O → gelembung, U → payung).
  Animasi baru dapat ditambahkan lewat `JH.Rewards.registerMagic("X", fn)`.
- **Latihan adaptif sederhana** — huruf yang sering salah (mis. b/d, m/n, p/q)
  otomatis muncul lebih sering di permainan, berdasarkan hitungan benar/salah.
- **Suara berlapis** — memakai rekaman MP3 bila tersedia; bila belum ada,
  otomatis memakai Text-to-Speech Bahasa Indonesia bawaan perangkat.
  Aplikasi **tidak error** walau folder audio kosong.
- **Aksesibilitas** — `aria-label`, focus state, area sentuh besar, kontras
  cukup, tombol speaker untuk mengulang, dan opsi **Kurangi Animasi**.
- **PWA** — dapat dipasang ke layar utama dan berjalan offline.

---

## 4. Teknologi

HTML5 · CSS3 · Vanilla JavaScript · Canvas API · Pointer Events ·
Web Audio + HTML Audio + Web Speech · localStorage · manifest.json · service worker

Tidak memakai PHP, Laravel, backend Python, MySQL, Firebase, framework berat,
API berbayar, atau proses build apa pun. Cukup buka `index.html`.

---

## 5. Struktur Proyek

```
jejak-huruf/
├── index.html            # seluruh layar aplikasi (satu halaman)
├── README.md
├── manifest.json         # PWA
├── service-worker.js     # cache offline (opsional)
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js            # perekat semua modul + inisialisasi
│   ├── navigation.js     # perpindahan layar, balon Kiko, toast
│   ├── audio.js          # file MP3 → TTS → efek suara
│   ├── illustrations.js  # ilustrasi SVG bawaan (pengganti gambar)
│   ├── tracing.js        # kanvas menulis + penilaian
│   ├── games.js          # tiga permainan huruf
│   ├── reading.js        # suku kata, susun kata, kalimat
│   ├── progress.js       # localStorage: save/load/reset + adaptif
│   └── rewards.js        # Tinta Ajaib + Kampung Hurufku
│
├── data/                 # KONTEN — ubah di sini, engine tidak perlu disentuh
│   ├── letters.js        # A–Z: kata, gambar, audio, fonik, goresan, hadiah
│   ├── syllables.js      # pola konsonan + vokal
│   └── words.js          # kata untuk Susun Kata + kalimat
│
└── assets/
    ├── audio/            # rekaman MP3 (lihat assets/audio/README.md)
    ├── images/           # ilustrasi (lihat assets/images/README.md)
    └── icons/            # ikon PWA
```

---

## 6. Menjalankan di Komputer Sendiri

**Cara paling cepat:** klik dua kali `index.html`.
Semua fitur berjalan, kecuali service worker (offline) yang memang hanya aktif
lewat `http://` atau `https://`.

**Dengan server lokal** (disarankan agar PWA ikut diuji):

```bash
# Python 3
python -m http.server 8000

# atau Node.js
npx serve .
```

Lalu buka `http://localhost:8000`.

---

## 7. Mengunggah ke GitHub

```bash
cd jejak-huruf
git init
git add .
git commit -m "Jejak Huruf: aplikasi baca tulis anak"
git branch -M main
git remote add origin https://github.com/USERNAME/jejak-huruf.git
git push -u origin main
```

## 8. Mengaktifkan GitHub Pages

1. Buka repository → **Settings** → **Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` · **Folder**: `/ (root)` → **Save**
4. Tunggu 1–2 menit. Alamat aplikasi:
   `https://USERNAME.github.io/jejak-huruf/`

Seluruh path di proyek ini memakai **relative path** (`./css/style.css`,
`./js/app.js`, `./assets/images/…`), sehingga aplikasi tetap jalan meskipun
berada di sub-folder repository. Jangan mengubahnya menjadi `/assets/…`.

---

## 9. Mengganti Audio

1. Rekam suara Bahasa Indonesia dalam format **MP3**.
2. Simpan di `assets/audio/` dengan nama sesuai `data/letters.js`
   (`a.mp3`, `apel.mp3`, `b.mp3`, `bola.mp3`, …).
3. Muat ulang halaman — aplikasi otomatis memakai rekaman itu.

Daftar lengkap file yang perlu direkam ada di **`assets/audio/README.md`**.
Selama file belum ada, aplikasi memakai Text-to-Speech perangkat.

## 10. Mengganti Gambar

1. Simpan gambar di `assets/images/` (SVG disarankan, PNG/WebP juga bisa).
2. Sesuaikan kolom `image` pada `data/letters.js` atau `data/words.js`.
3. Bila file tidak ditemukan, ilustrasi SVG bawaan (`js/illustrations.js`)
   otomatis dipakai. Tidak ada gambar berhak cipta di proyek ini.

## 11. Menambah Huruf / Kata / Kalimat

**Menambah atau mengubah kata contoh huruf** — buka `data/letters.js`:

```js
{ letter:"A", lower:"a", name:"A", phonics:"a", word:"Apel",
  image:"./assets/images/apel.svg",
  audio:{ letter:"a", word:"apel" },
  reward:{ id:"pohon", name:"Pohon Apel" },
  strokes:["M 22 90 L 50 12","M 50 12 L 78 90","M 33 62 L 67 62"] }
```

- `strokes` = urutan goresan menulis, ditulis sebagai path SVG pada kotak
  koordinat **100 × 100**. Urutan array menentukan nomor goresan (1, 2, 3).
- `reward.id` harus cocok dengan nama ilustrasi agar muncul di Kampung Hurufku.

**Menambah suku kata** — tambahkan konsonan pada `SYLLABLE_CONSONANTS`
di `data/syllables.js`.

**Menambah kata / kalimat** — tambahkan entri pada `WORDS` atau `SENTENCES`
di `data/words.js`.

## 12. Reset Data Anak

- Dari aplikasi: **Orang Tua / Guru → Reset Progres** (ada konfirmasi).
- Manual di browser: hapus kunci `jejakhuruf.v1` pada localStorage.

Semua progres tersimpan **hanya di perangkat**. Tidak ada akun, tidak ada
pengiriman data ke internet.

---

## 13. Catatan Pengujian

Sudah diperhitungkan saat pengembangan:

- Pointer Events (`pointerdown` / `pointermove` / `pointerup`) sehingga kanvas
  bekerja dengan jari, stylus, maupun tetikus; `touch-action: none` mencegah
  layar ikut menggulir saat menulis.
- Kanvas menyesuaikan `devicePixelRatio` dan digambar ulang saat layar diputar
  atau diubah ukurannya.
- Layout mobile-first 360–430px, responsif hingga tablet dan desktop.
- Progres tetap ada setelah halaman dimuat ulang.
- Aplikasi tetap berfungsi bila service worker gagal, audio belum ada, atau
  gambar belum ada.

Setelah dipasang, cek juga di perangkat asli: buka Console browser dan pastikan
tidak ada error, lalu uji satu huruf penuh dari Dengar → Tulis → Bermain.

---

## 14. Lisensi & Kredit

Seluruh kode, ilustrasi SVG, dan ikon dibuat khusus untuk proyek ini.
Silakan pakai dan modifikasi untuk keperluan pendidikan.
