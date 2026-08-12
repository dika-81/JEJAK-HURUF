# Folder Gambar

Letakkan ilustrasi di folder ini. Format bebas: **SVG** (disarankan), PNG, atau WebP.

Selama file belum ada, aplikasi otomatis memakai **ilustrasi SVG bawaan** yang
digambar sendiri di `js/illustrations.js` — jadi aplikasi tidak pernah kosong
atau error. Tidak ada gambar berhak cipta yang dipakai.

## Nama file yang dibaca aplikasi

Huruf A–Z (lihat `data/letters.js` kolom `image`):

```
apel  bola  cicak  dadu  ember  foto  gajah  hujan  ikan  jeruk
kucing lampu mobil nanas ombak pensil quran rumah sepatu topi
ular  vas   wortel xilofon yoyo  zebra
```

Kata untuk Susun Kata (lihat `data/words.js`):

```
buku  sapi  meja  roti  kuda  baju  nasi  susu
```

## Cara mengganti

1. Simpan gambar, contoh: `assets/images/apel.svg`
2. Pastikan `data/letters.js` menunjuk ke file tersebut:
   `image: "./assets/images/apel.svg"`
3. Muat ulang halaman. Jika file tidak ditemukan, ilustrasi bawaan dipakai lagi.

## Saran ukuran
- SVG: `viewBox="0 0 100 100"`, objek utama di tengah.
- PNG/WebP: bujur sangkar, minimal 256×256 px, latar transparan.
