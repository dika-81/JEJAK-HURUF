# Audio Bahasa Indonesia

Folder ini berisi **242 aset MP3 `id-ID`** agar pengucapan aplikasi konsisten
di semua perangkat. Materi utama tidak lagi bergantung pada suara bawaan
browser. `manifest.json` menjadi daftar pemeriksaan kelengkapan aset; audio
yang diputar akan disimpan otomatis oleh service worker untuk pemakaian offline.

Audio memakai suara neural Bahasa Indonesia. Nama huruf dan suku kata yang
rawan terbaca sebagai ejaan asing harus diuji satu per satu; aset `b.mp3`,
`w.mp3` dan `bi.mp3` diambil langsung dari bunyi pada kata acuan **cewek** dan
**bilingual**, lalu dipotong sebelum konsonan berikutnya. Khusus `b.mp3`, suara
dibuat langsung sebagai **bé**, dengan é seperti pada suku kata **me** dalam
**Amerika**. Dengan
begitu hasilnya adalah **be**, **we**, dan **bi** yang menyatu, bukan nama huruf
bergaya Inggris atau ejaan terpisah. Jika tersedia rekaman manusia, ganti
berkas dengan nama yang sama agar kode aplikasi tidak perlu diubah.

## Daftar file yang perlu direkam

### 1. Nama huruf (26 file)
`a.mp3` `b.mp3` `c.mp3` … `z.mp3`

Isi rekaman: nama huruf dalam Bahasa Indonesia.

| File | Ucapan | File | Ucapan |
|---|---|---|---|
| a.mp3 | "A" | n.mp3 | "En" |
| b.mp3 | "Be" | o.mp3 | "O" |
| c.mp3 | "Ce" | p.mp3 | "Pe" |
| d.mp3 | "De" | q.mp3 | "Ki" |
| e.mp3 | "E" | r.mp3 | "Er" |
| f.mp3 | "Ef" | s.mp3 | "Es" |
| g.mp3 | "Ge" | t.mp3 | "Te" |
| h.mp3 | "Ha" | u.mp3 | "U" |
| i.mp3 | "I" | v.mp3 | "Ve" |
| j.mp3 | "Je" | w.mp3 | "We" |
| k.mp3 | "Ka" | x.mp3 | "Eks" |
| l.mp3 | "El" | y.mp3 | "Ye" |
| m.mp3 | "Em" | z.mp3 | "Zet" |

### 2. Kata contoh (26 file)
Nama file mengikuti kolom `audio.word` pada `data/letters.js`, misalnya
`contoh_a_apel.mp3` dan `contoh_b_bola.mp3`.

Isi rekaman contoh: **"A seperti Apel"**.

Versi kata tanpa nama huruf memakai awalan `kata_`, misalnya
`kata_apel.mp3` dan `kata_bola.mp3`.

### 3. Fonik dan suku kata
`fonem_a.mp3` sampai `fonem_z.mp3`, serta:

`ba.mp3` `bi.mp3` `bu.mp3` `be.mp3` `bo.mp3` … sesuai `data/syllables.js`.

### 4. Kata untuk Susun Kata
`buku.mp3` `sapi.mp3` `meja.mp3` `roti.mp3` `kuda.mp3` `baju.mp3` `nasi.mp3` `susu.mp3`

### 5. Kalimat
`ini_buku.mp3` `ini_bola.mp3` `itu_meja.mp3` `ibu_baca_buku.mp3`
`budi_makan_nasi.mp3` `adi_minum_susu.mp3` `sapi_makan_rumput.mp3` `aku_suka_membaca.mp3`

### 6. Instruksi

Berkas berawalan `prompt_` berisi instruksi dan umpan balik Kiko, misalnya
`prompt_mana_huruf.mp3`, `prompt_susun_kata.mp3`, dan
`prompt_ikuti_garis.mp3`.

## Panduan mengganti dengan rekaman manusia
- Suara jelas, pelan, ramah, dan ceria.
- Potong hening di awal & akhir agar respons terasa cepat.
- Bitrate 96–128 kbps sudah cukup; ukuran file kecil = aplikasi ringan.
- Jangan mengubah nama berkas.
- Perbarui `manifest.json` hanya jika menambah atau menghapus berkas.
