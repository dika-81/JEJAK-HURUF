/* =========================================================
   data/letters.js — DATA ALFABET (terpisah dari engine)
   ---------------------------------------------------------
   Ubah isi file ini untuk mengganti kata contoh, gambar, atau
   audio TANPA menyentuh kode aplikasi.

   Struktur tiap huruf:
     letter   : huruf besar (A-Z)
     lower    : huruf kecil
     name     : nama huruf dalam Bahasa Indonesia (A, Be, Ce, ...)
     phonics  : bunyi huruf (dipakai untuk suara & suku kata)
     word     : kata contoh
     image    : path relatif gambar (SVG/PNG). Jika file belum ada,
                aplikasi otomatis memakai ilustrasi SVG bawaan
                (lihat js/illustrations.js) — TIDAK error.
     audio    : { letter, word } nama file audio tanpa ekstensi,
                dicari di ./assets/audio/<nama>.mp3
                Jika belum ada → otomatis pakai Text-to-Speech.
     reward   : hadiah untuk "Kampung Hurufku" { id, name }
     strokes  : urutan goresan menulis huruf besar, berupa path SVG
                pada kotak koordinat 100 x 100.
                Urutan array = urutan menulis (1, 2, 3, ...).

   REKAMAN AUDIO YANG PERLU DISIAPKAN (Bahasa Indonesia):
     ./assets/audio/a.mp3      -> "A"
     ./assets/audio/apel.mp3   -> "A seperti Apel"
     ... dan seterusnya untuk seluruh huruf & kata di bawah ini.
   ========================================================= */

window.LETTERS = [
  { letter:"A", lower:"a", name:"A",    phonics:"a",   word:"Apel",    image:"./assets/images/apel.svg",    audio:{letter:"a", word:"apel"},       reward:{id:"pohon",  name:"Pohon Apel"},
    strokes:["M 22 90 L 50 12","M 50 12 L 78 90","M 33 62 L 67 62"] },

  { letter:"B", lower:"b", name:"Be",   phonics:"beh", word:"Bola",    image:"./assets/images/bola.svg",    audio:{letter:"b", word:"bola"},       reward:{id:"balon",  name:"Balon"},
    strokes:["M 26 10 L 26 90","M 26 10 C 72 10 72 50 26 50","M 26 50 C 78 50 78 90 26 90"] },

  { letter:"C", lower:"c", name:"Ce",   phonics:"ceh", word:"Cicak",   image:"./assets/images/cicak.svg",   audio:{letter:"c", word:"cicak"},      reward:{id:"cicak",  name:"Cicak"},
    strokes:["M 78 26 C 56 4 18 14 18 50 C 18 86 56 96 78 74"] },

  { letter:"D", lower:"d", name:"De",   phonics:"deh", word:"Dadu",    image:"./assets/images/dadu.svg",    audio:{letter:"d", word:"dadu"},       reward:{id:"dadu",   name:"Dadu"},
    strokes:["M 26 10 L 26 90","M 26 10 C 82 10 82 90 26 90"] },

  { letter:"E", lower:"e", name:"E",    phonics:"e",   word:"Ember",   image:"./assets/images/ember.svg",   audio:{letter:"e", word:"ember"},      reward:{id:"ember",  name:"Ember"},
    strokes:["M 28 12 L 28 90","M 28 12 L 76 12","M 28 50 L 68 50","M 28 90 L 76 90"] },

  { letter:"F", lower:"f", name:"Ef",   phonics:"ef",  word:"Foto",    image:"./assets/images/foto.svg",    audio:{letter:"f", word:"foto"},       reward:{id:"foto",   name:"Bingkai Foto"},
    strokes:["M 28 12 L 28 90","M 28 12 L 76 12","M 28 50 L 66 50"] },

  { letter:"G", lower:"g", name:"Ge",   phonics:"geh", word:"Gajah",   image:"./assets/images/gajah.svg",   audio:{letter:"g", word:"gajah"},      reward:{id:"gajah",  name:"Gajah"},
    strokes:["M 78 26 C 56 4 18 14 18 50 C 18 86 60 96 80 72 L 80 56 L 56 56"] },

  { letter:"H", lower:"h", name:"Ha",   phonics:"ha",  word:"Hujan",   image:"./assets/images/hujan.svg",   audio:{letter:"h", word:"hujan"},      reward:{id:"hujan",  name:"Awan Hujan"},
    strokes:["M 26 10 L 26 90","M 74 10 L 74 90","M 26 50 L 74 50"] },

  { letter:"I", lower:"i", name:"I",    phonics:"i",   word:"Ikan",    image:"./assets/images/ikan.svg",    audio:{letter:"i", word:"ikan"},       reward:{id:"ikan",   name:"Ikan"},
    strokes:["M 30 12 L 70 12","M 50 12 L 50 88","M 30 88 L 70 88"] },

  { letter:"J", lower:"j", name:"Je",   phonics:"jeh", word:"Jeruk",   image:"./assets/images/jeruk.svg",   audio:{letter:"j", word:"jeruk"},      reward:{id:"jeruk",  name:"Pohon Jeruk"},
    strokes:["M 40 12 L 76 12","M 62 12 L 62 66 C 62 90 28 90 26 66"] },

  { letter:"K", lower:"k", name:"Ka",   phonics:"keh", word:"Kucing",  image:"./assets/images/kucing.svg",  audio:{letter:"k", word:"kucing"},     reward:{id:"kucing", name:"Kucing"},
    strokes:["M 26 10 L 26 90","M 74 12 L 30 52","M 40 44 L 76 90"] },

  { letter:"L", lower:"l", name:"El",   phonics:"el",  word:"Lampu",   image:"./assets/images/lampu.svg",   audio:{letter:"l", word:"lampu"},      reward:{id:"lampu",  name:"Lampu Taman"},
    strokes:["M 30 10 L 30 88","M 30 88 L 76 88"] },

  { letter:"M", lower:"m", name:"Em",   phonics:"em",  word:"Mobil",   image:"./assets/images/mobil.svg",   audio:{letter:"m", word:"mobil"},      reward:{id:"mobil",  name:"Mobil"},
    strokes:["M 20 90 L 20 12","M 20 12 L 50 56","M 50 56 L 80 12","M 80 12 L 80 90"] },

  { letter:"N", lower:"n", name:"En",   phonics:"en",  word:"Nanas",   image:"./assets/images/nanas.svg",   audio:{letter:"n", word:"nanas"},      reward:{id:"nanas",  name:"Nanas"},
    strokes:["M 24 90 L 24 12","M 24 12 L 76 88","M 76 88 L 76 12"] },

  { letter:"O", lower:"o", name:"O",    phonics:"o",   word:"Ombak",   image:"./assets/images/ombak.svg",   audio:{letter:"o", word:"ombak"},      reward:{id:"ombak",  name:"Kolam"},
    strokes:["M 50 10 C 26 10 15 28 15 50 C 15 72 26 90 50 90 C 74 90 85 72 85 50 C 85 28 74 10 50 10"] },

  { letter:"P", lower:"p", name:"Pe",   phonics:"peh", word:"Pensil",  image:"./assets/images/pensil.svg",  audio:{letter:"p", word:"pensil"},     reward:{id:"pensil", name:"Pensil"},
    strokes:["M 28 12 L 28 90","M 28 12 C 76 12 76 54 28 54"] },

  { letter:"Q", lower:"q", name:"Ki",   phonics:"keh", word:"Quran",   image:"./assets/images/quran.svg",   audio:{letter:"q", word:"quran"},      reward:{id:"quran",  name:"Kitab"},
    strokes:["M 50 10 C 26 10 15 28 15 50 C 15 72 26 90 50 90 C 74 90 85 72 85 50 C 85 28 74 10 50 10","M 58 66 L 84 92"] },

  { letter:"R", lower:"r", name:"Er",   phonics:"er",  word:"Rumah",   image:"./assets/images/rumah.svg",   audio:{letter:"r", word:"rumah"},      reward:{id:"rumah",  name:"Rumah"},
    strokes:["M 28 12 L 28 90","M 28 12 C 76 12 76 54 28 54","M 34 54 L 76 90"] },

  { letter:"S", lower:"s", name:"Es",   phonics:"es",  word:"Sepatu",  image:"./assets/images/sepatu.svg",  audio:{letter:"s", word:"sepatu"},     reward:{id:"ular",   name:"Ular Kecil"},
    strokes:["M 76 26 C 70 8 30 6 28 28 C 26 48 72 50 72 70 C 72 92 32 92 24 74"] },

  { letter:"T", lower:"t", name:"Te",   phonics:"teh", word:"Topi",    image:"./assets/images/topi.svg",    audio:{letter:"t", word:"topi"},       reward:{id:"topi",   name:"Topi"},
    strokes:["M 20 12 L 80 12","M 50 12 L 50 90"] },

  { letter:"U", lower:"u", name:"U",    phonics:"u",   word:"Ular",    image:"./assets/images/ular.svg",    audio:{letter:"u", word:"ular"},       reward:{id:"payung", name:"Payung"},
    strokes:["M 24 10 L 24 58 C 24 86 76 86 76 58 L 76 10"] },

  { letter:"V", lower:"v", name:"Ve",   phonics:"veh", word:"Vas",     image:"./assets/images/vas.svg",     audio:{letter:"v", word:"vas"},        reward:{id:"vas",    name:"Vas Bunga"},
    strokes:["M 22 10 L 50 90","M 50 90 L 78 10"] },

  { letter:"W", lower:"w", name:"We",   phonics:"weh", word:"Wortel",  image:"./assets/images/wortel.svg",  audio:{letter:"w", word:"wortel"},     reward:{id:"wortel", name:"Kebun Wortel"},
    strokes:["M 16 10 L 32 90","M 32 90 L 50 38","M 50 38 L 68 90","M 68 90 L 84 10"] },

  { letter:"X", lower:"x", name:"Eks",  phonics:"eks", word:"Xilofon", image:"./assets/images/xilofon.svg", audio:{letter:"x", word:"xilofon"},    reward:{id:"xilofon",name:"Xilofon"},
    strokes:["M 22 10 L 78 90","M 78 10 L 22 90"] },

  { letter:"Y", lower:"y", name:"Ye",   phonics:"yeh", word:"Yoyo",    image:"./assets/images/yoyo.svg",    audio:{letter:"y", word:"yoyo"},       reward:{id:"yoyo",   name:"Yoyo"},
    strokes:["M 24 10 L 50 50","M 76 10 L 50 50","M 50 50 L 50 90"] },

  { letter:"Z", lower:"z", name:"Zet",  phonics:"zeh", word:"Zebra",   image:"./assets/images/zebra.svg",   audio:{letter:"z", word:"zebra"},      reward:{id:"zebra",  name:"Zebra"},
    strokes:["M 22 12 L 78 12","M 78 12 L 22 88","M 22 88 L 78 88"] }
];

/* Peta cepat: "A" -> objek huruf */
window.LETTER_MAP = window.LETTERS.reduce(function(m, l){ m[l.letter] = l; return m; }, {});

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
