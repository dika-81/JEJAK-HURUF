/* =========================================================
   data/words.js — KATA UNTUK "SUSUN KATA" DAN KALIMAT SEDERHANA
   ---------------------------------------------------------
   word    : kata yang harus disusun (huruf besar)
   syl     : pemenggalan suku kata (untuk suara "BU-KU")
   image   : path gambar; jika tidak ada file, ilustrasi bawaan dipakai
   audio   : nama file audio tanpa ekstensi (./assets/audio/<nama>.mp3)
   ========================================================= */

window.WORDS = [
  { word:"BUKU", syl:["BU","KU"],  image:"./assets/images/buku.svg",   audio:"buku"   },
  { word:"BOLA", syl:["BO","LA"],  image:"./assets/images/bola.svg",   audio:"bola"   },
  { word:"TOPI", syl:["TO","PI"],  image:"./assets/images/topi.svg",   audio:"topi"   },
  { word:"SAPI", syl:["SA","PI"],  image:"./assets/images/sapi.svg",   audio:"sapi"   },
  { word:"MEJA", syl:["ME","JA"],  image:"./assets/images/meja.svg",   audio:"meja"   },
  { word:"ROTI", syl:["RO","TI"],  image:"./assets/images/roti.svg",   audio:"roti"   },
  { word:"KUDA", syl:["KU","DA"],  image:"./assets/images/kuda.svg",   audio:"kuda"   },
  { word:"BAJU", syl:["BA","JU"],  image:"./assets/images/baju.svg",   audio:"baju"   },
  { word:"DADU", syl:["DA","DU"],  image:"./assets/images/dadu.svg",   audio:"dadu"   },
  { word:"IKAN", syl:["I","KAN"],  image:"./assets/images/ikan.svg",   audio:"ikan"   },
  { word:"NASI", syl:["NA","SI"],  image:"./assets/images/nasi.svg",   audio:"nasi"   },
  { word:"SUSU", syl:["SU","SU"],  image:"./assets/images/susu.svg",   audio:"susu"   }
];

/* Kalimat pendek — setiap kata dapat ditekan untuk dibacakan */
window.SENTENCES = [
  { text:"INI BUKU.",         audio:"ini_buku"        },
  { text:"INI BOLA.",         audio:"ini_bola"        },
  { text:"ITU MEJA.",         audio:"itu_meja"        },
  { text:"IBU BACA BUKU.",    audio:"ibu_baca_buku"   },
  { text:"BUDI MAKAN NASI.",  audio:"budi_makan_nasi" },
  { text:"ADI MINUM SUSU.",   audio:"adi_minum_susu"  },
  { text:"SAPI MAKAN RUMPUT.",audio:"sapi_makan_rumput" },
  { text:"AKU SUKA MEMBACA.", audio:"aku_suka_membaca"  }
];
