/* =========================================================
   data/letters.js — DATA ALFABET (terpisah dari engine)
   ---------------------------------------------------------
   Ubah isi file ini untuk mengganti kata contoh, gambar, atau
   audio TANPA menyentuh kode aplikasi.

   Struktur tiap huruf:
     letter   : huruf besar (A-Z)
     lower    : huruf kecil
     name     : nama huruf resmi (A, Be, Ce, ... Qi, Ve, ... )
     phonics  : alias TTS Indonesia untuk latihan suku kata (tanpa "beh/ceh")
     word     : kata contoh
     image    : path relatif gambar (SVG/PNG). Jika file belum ada,
                aplikasi otomatis memakai ilustrasi SVG bawaan
                (lihat js/illustrations.js) — TIDAK error.
     audio    : { letter, word, phonics } nama file audio tanpa ekstensi,
                dicari di ./assets/audio/<nama>.mp3
                Jika belum ada → otomatis pakai Text-to-Speech.
     reward   : hadiah untuk "Kampung Hurufku" { id, name }
     strokes  : urutan goresan menulis huruf besar, berupa path SVG
     lowerStrokes: urutan goresan menulis huruf kecil
                pada kotak koordinat 100 x 100.
                Urutan array = urutan menulis (1, 2, 3, ...).

   REKAMAN AUDIO YANG PERLU DISIAPKAN (Bahasa Indonesia):
     ./assets/audio/a.mp3      -> "A"
     ./assets/audio/apel.mp3   -> "A seperti Apel"
     ... dan seterusnya untuk seluruh huruf & kata di bawah ini.
   ========================================================= */

window.LETTERS = [
  { letter:"A", lower:"a", name:"A",   phonics:"a",   word:"Apel",    image:"./assets/images/apel.svg",    audio:{letter:"a", word:"contoh_a_apel", phonics:"fonem_a"},       reward:{id:"pohon",  name:"Pohon Apel"},
    strokes:["M 22 90 L 50 12","M 50 12 L 78 90","M 33 62 L 67 62"],
    lowerStrokes:["M 68 42 C 58 28 30 30 26 55 C 22 78 48 88 68 70 C 73 64 73 48 68 42","M 70 35 L 70 84"] },

  { letter:"B", lower:"b", name:"Be",   phonics:"bé", word:"Bola",    image:"./assets/images/bola.svg",    audio:{letter:"b", word:"contoh_b_bola", phonics:"fonem_b"},       reward:{id:"balon",  name:"Balon"},
    strokes:["M 26 10 L 26 90","M 26 10 C 72 10 72 50 26 50","M 26 50 C 78 50 78 90 26 90"],
    lowerStrokes:["M 30 10 L 30 82","M 30 48 C 42 31 72 34 75 57 C 78 79 48 90 30 72"] },

  { letter:"C", lower:"c", name:"Ce",   phonics:"cé", word:"Cicak",   image:"./assets/images/cicak.svg",   audio:{letter:"c", word:"contoh_c_cicak", phonics:"fonem_c"},      reward:{id:"cicak",  name:"Cicak"},
    strokes:["M 78 26 C 56 4 18 14 18 50 C 18 86 56 96 78 74"],
    lowerStrokes:["M 72 43 C 58 27 29 35 27 58 C 25 80 57 88 72 72"] },

  { letter:"D", lower:"d", name:"De",   phonics:"dé", word:"Dadu",    image:"./assets/images/dadu.svg",    audio:{letter:"d", word:"contoh_d_dadu", phonics:"fonem_d"},       reward:{id:"dadu",   name:"Dadu"},
    strokes:["M 26 10 L 26 90","M 26 10 C 82 10 82 90 26 90"],
    lowerStrokes:["M 69 45 C 55 29 29 36 26 58 C 23 80 52 89 69 71","M 70 10 L 70 83"] },

  { letter:"E", lower:"e", name:"E",   phonics:"é",   word:"Ember",   image:"./assets/images/ember.svg",   audio:{letter:"e", word:"contoh_e_ember", phonics:"fonem_e"},      reward:{id:"ember",  name:"Ember"},
    strokes:["M 28 12 L 28 90","M 28 12 L 76 12","M 28 50 L 68 50","M 28 90 L 76 90"],
    lowerStrokes:["M 26 58 L 73 58 C 73 36 46 29 31 43 C 14 59 29 84 51 84 C 62 84 69 80 74 74"] },

  { letter:"F", lower:"f", name:"Ef",   phonics:"ef",  word:"Foto",    image:"./assets/images/foto.svg",    audio:{letter:"f", word:"contoh_f_foto", phonics:"fonem_f"},       reward:{id:"foto",   name:"Bingkai Foto"},
    strokes:["M 28 12 L 28 90","M 28 12 L 76 12","M 28 50 L 66 50"],
    lowerStrokes:["M 65 16 C 55 7 39 12 38 29 L 38 84","M 24 42 L 61 42"] },

  { letter:"G", lower:"g", name:"Ge",   phonics:"gé", word:"Gajah",   image:"./assets/images/gajah.svg",   audio:{letter:"g", word:"contoh_g_gajah", phonics:"fonem_g"},      reward:{id:"gajah",  name:"Gajah"},
    strokes:["M 78 26 C 56 4 18 14 18 50 C 18 86 60 96 80 72 L 80 56 L 56 56"],
    lowerStrokes:["M 69 43 C 57 29 30 34 27 57 C 24 79 51 87 69 71","M 70 38 L 70 82 C 70 101 42 101 31 90"] },

  { letter:"H", lower:"h", name:"Ha",   phonics:"ha",  word:"Hujan",   image:"./assets/images/hujan.svg",   audio:{letter:"h", word:"contoh_h_hujan", phonics:"fonem_h"},      reward:{id:"hujan",  name:"Awan Hujan"},
    strokes:["M 26 10 L 26 90","M 74 10 L 74 90","M 26 50 L 74 50"],
    lowerStrokes:["M 30 10 L 30 84","M 30 52 C 42 32 70 35 70 56 L 70 84"] },

  { letter:"I", lower:"i", name:"I",   phonics:"i",   word:"Ikan",    image:"./assets/images/ikan.svg",    audio:{letter:"i", word:"contoh_i_ikan", phonics:"fonem_i"},       reward:{id:"ikan",   name:"Ikan"},
    strokes:["M 30 12 L 70 12","M 50 12 L 50 88","M 30 88 L 70 88"],
    lowerStrokes:["M 50 40 L 50 84","M 50 20 L 50 22"] },

  { letter:"J", lower:"j", name:"Je",   phonics:"jé", word:"Jeruk",   image:"./assets/images/jeruk.svg",   audio:{letter:"j", word:"contoh_j_jeruk", phonics:"fonem_j"},      reward:{id:"jeruk",  name:"Pohon Jeruk"},
    strokes:["M 40 12 L 76 12","M 62 12 L 62 66 C 62 90 28 90 26 66"],
    lowerStrokes:["M 60 40 L 60 82 C 60 101 34 101 29 90","M 60 20 L 60 22"] },

  { letter:"K", lower:"k", name:"Ka",   phonics:"ka", word:"Kucing",  image:"./assets/images/kucing.svg",  audio:{letter:"k", word:"contoh_k_kucing", phonics:"fonem_k"},     reward:{id:"kucing", name:"Kucing"},
    strokes:["M 26 10 L 26 90","M 74 12 L 30 52","M 40 44 L 76 90"],
    lowerStrokes:["M 30 10 L 30 84","M 70 39 L 31 64","M 46 54 L 73 84"] },

  { letter:"L", lower:"l", name:"El",   phonics:"el",  word:"Lampu",   image:"./assets/images/lampu.svg",   audio:{letter:"l", word:"contoh_l_lampu", phonics:"fonem_l"},      reward:{id:"lampu",  name:"Lampu Taman"},
    strokes:["M 30 10 L 30 88","M 30 88 L 76 88"],
    lowerStrokes:["M 48 10 L 48 84"] },

  { letter:"M", lower:"m", name:"Em",   phonics:"em",  word:"Mobil",   image:"./assets/images/mobil.svg",   audio:{letter:"m", word:"contoh_m_mobil", phonics:"fonem_m"},      reward:{id:"mobil",  name:"Mobil"},
    strokes:["M 20 90 L 20 12","M 20 12 L 50 56","M 50 56 L 80 12","M 80 12 L 80 90"],
    lowerStrokes:["M 18 42 L 18 84","M 18 54 C 27 34 45 36 45 56 L 45 84","M 45 54 C 55 34 76 36 76 57 L 76 84"] },

  { letter:"N", lower:"n", name:"En",   phonics:"en",  word:"Nanas",   image:"./assets/images/nanas.svg",   audio:{letter:"n", word:"contoh_n_nanas", phonics:"fonem_n"},      reward:{id:"nanas",  name:"Nanas"},
    strokes:["M 24 90 L 24 12","M 24 12 L 76 88","M 76 88 L 76 12"],
    lowerStrokes:["M 27 42 L 27 84","M 27 54 C 40 33 70 35 70 58 L 70 84"] },

  { letter:"O", lower:"o", name:"O",   phonics:"o",   word:"Ombak",   image:"./assets/images/ombak.svg",   audio:{letter:"o", word:"contoh_o_ombak", phonics:"fonem_o"},      reward:{id:"ombak",  name:"Kolam"},
    strokes:["M 50 10 C 26 10 15 28 15 50 C 15 72 26 90 50 90 C 74 90 85 72 85 50 C 85 28 74 10 50 10"],
    lowerStrokes:["M 50 34 C 24 34 22 84 50 84 C 78 84 76 34 50 34"] },

  { letter:"P", lower:"p", name:"Pe",   phonics:"pé", word:"Pensil",  image:"./assets/images/pensil.svg",  audio:{letter:"p", word:"contoh_p_pensil", phonics:"fonem_p"},     reward:{id:"pensil", name:"Pensil"},
    strokes:["M 28 12 L 28 90","M 28 12 C 76 12 76 54 28 54"],
    lowerStrokes:["M 29 39 L 29 98","M 29 49 C 45 28 74 36 75 58 C 76 80 47 89 29 71"] },

  { letter:"Q", lower:"q", name:"Qi",   phonics:"ki", word:"Quran",   image:"./assets/images/quran.svg",   audio:{letter:"q", word:"contoh_q_quran", phonics:"fonem_q"},      reward:{id:"quran",  name:"Kitab"},
    strokes:["M 50 10 C 26 10 15 28 15 50 C 15 72 26 90 50 90 C 74 90 85 72 85 50 C 85 28 74 10 50 10","M 58 66 L 84 92"],
    lowerStrokes:["M 69 43 C 56 28 29 34 27 57 C 25 79 51 88 69 71","M 70 39 L 70 98"] },

  { letter:"R", lower:"r", name:"Er",   phonics:"er",  word:"Rumah",   image:"./assets/images/rumah.svg",   audio:{letter:"r", word:"contoh_r_rumah", phonics:"fonem_r"},      reward:{id:"rumah",  name:"Rumah"},
    strokes:["M 28 12 L 28 90","M 28 12 C 76 12 76 54 28 54","M 34 54 L 76 90"],
    lowerStrokes:["M 34 42 L 34 84","M 34 55 C 43 39 58 36 70 43"] },

  { letter:"S", lower:"s", name:"Es",   phonics:"es",  word:"Sepatu",  image:"./assets/images/sepatu.svg",  audio:{letter:"s", word:"contoh_s_sepatu", phonics:"fonem_s"},     reward:{id:"ular",   name:"Ular Kecil"},
    strokes:["M 76 26 C 70 8 30 6 28 28 C 26 48 72 50 72 70 C 72 92 32 92 24 74"],
    lowerStrokes:["M 70 43 C 61 31 31 32 29 48 C 27 62 69 57 69 72 C 69 88 37 89 27 77"] },

  { letter:"T", lower:"t", name:"Te",   phonics:"té", word:"Topi",    image:"./assets/images/topi.svg",    audio:{letter:"t", word:"contoh_t_topi", phonics:"fonem_t"},       reward:{id:"topi",   name:"Topi"},
    strokes:["M 20 12 L 80 12","M 50 12 L 50 90"],
    lowerStrokes:["M 49 19 L 49 73 C 49 84 60 87 69 80","M 30 42 L 67 42"] },

  { letter:"U", lower:"u", name:"U",   phonics:"u",   word:"Ular",    image:"./assets/images/ular.svg",    audio:{letter:"u", word:"contoh_u_ular", phonics:"fonem_u"},       reward:{id:"payung", name:"Payung"},
    strokes:["M 24 10 L 24 58 C 24 86 76 86 76 58 L 76 10"],
    lowerStrokes:["M 28 41 L 28 67 C 28 88 60 89 70 69","M 70 41 L 70 84"] },

  { letter:"V", lower:"v", name:"Ve",   phonics:"fé", word:"Vas",     image:"./assets/images/vas.svg",     audio:{letter:"v", word:"contoh_v_vas", phonics:"fonem_v"},        reward:{id:"vas",    name:"Vas Bunga"},
    strokes:["M 22 10 L 50 90","M 50 90 L 78 10"],
    lowerStrokes:["M 25 41 L 50 84 L 75 41"] },

  { letter:"W", lower:"w", name:"We",   phonics:"wé", word:"Wortel",  image:"./assets/images/wortel.svg",  audio:{letter:"w", word:"contoh_w_wortel", phonics:"fonem_w"},     reward:{id:"wortel", name:"Kebun Wortel"},
    strokes:["M 16 10 L 32 90","M 32 90 L 50 38","M 50 38 L 68 90","M 68 90 L 84 10"],
    lowerStrokes:["M 16 41 L 31 84 L 49 51 L 67 84 L 84 41"] },

  { letter:"X", lower:"x", name:"Eks",   phonics:"eks", word:"Xilofon", image:"./assets/images/xilofon.svg", audio:{letter:"x", word:"contoh_x_xilofon", phonics:"fonem_x"},    reward:{id:"xilofon",name:"Xilofon"},
    strokes:["M 22 10 L 78 90","M 78 10 L 22 90"],
    lowerStrokes:["M 27 41 L 72 84","M 72 41 L 27 84"] },

  { letter:"Y", lower:"y", name:"Ye",   phonics:"yé", word:"Yoyo",    image:"./assets/images/yoyo.svg",    audio:{letter:"y", word:"contoh_y_yoyo", phonics:"fonem_y"},       reward:{id:"yoyo",   name:"Yoyo"},
    strokes:["M 24 10 L 50 50","M 76 10 L 50 50","M 50 50 L 50 90"],
    lowerStrokes:["M 24 41 L 49 82 L 73 41","M 49 82 C 43 98 31 101 24 94"] },

  { letter:"Z", lower:"z", name:"Zet",   phonics:"zet", word:"Zebra",   image:"./assets/images/zebra.svg",   audio:{letter:"z", word:"contoh_z_zebra", phonics:"fonem_z"},      reward:{id:"zebra",  name:"Zebra"},
    strokes:["M 22 12 L 78 12","M 78 12 L 22 88","M 22 88 L 78 88"],
    lowerStrokes:["M 27 42 L 73 42 L 28 84 L 74 84"] }
];

/* Peta cepat: "A" -> objek huruf */
window.LETTER_MAP = window.LETTERS.reduce(function(m, l){ m[l.letter] = l; return m; }, {});

/* Ucapan huruf untuk TTS/fallback. Nama resmi tetap disimpan di field `name`. */
window.LETTERS.forEach(function (l) {
  l.pronunciation = l.phonics;
});

/* Pasangan huruf yang sering tertukar (untuk latihan adaptif) */
window.CONFUSABLES = {
  B:["D","P","R"], D:["B","P","O"], P:["B","D","R"], Q:["O","G","P"],
  M:["N","W","H"], N:["M","U","H"], W:["M","V","N"], V:["W","U","Y"],
  U:["V","N","O"], O:["Q","C","G"], C:["G","O","S"], G:["C","O","Q"],
  E:["F","L","B"], F:["E","T","P"], I:["L","T","J"], L:["I","J","T"],
  J:["I","L","U"], S:["Z","C","G"], Z:["S","N","X"], T:["I","F","L"],
  A:["V","H","R"], H:["N","M","K"], K:["X","R","H"], R:["P","B","K"],
  X:["K","Y","Z"], Y:["V","X","T"]
};
