/* =========================================================
   data/syllables.js — DATA SUKU KATA
   Pola: konsonan + vokal (KV). BA BI BU BE BO, CA CI CU CE CO, ...
   Tambah/hapus konsonan pada SYLLABLE_CONSONANTS untuk mengubah materi.
   ========================================================= */

window.VOWELS = ["A","I","U","E","O"];

/* Konsonan yang dilatih (urut dari yang paling mudah/sering dipakai) */
window.SYLLABLE_CONSONANTS = [
  { c:"B", phonics:"beh" },
  { c:"D", phonics:"deh" },
  { c:"K", phonics:"keh" },
  { c:"L", phonics:"el"  },
  { c:"M", phonics:"em"  },
  { c:"N", phonics:"en"  },
  { c:"P", phonics:"peh" },
  { c:"S", phonics:"es"  },
  { c:"T", phonics:"teh" },
  { c:"G", phonics:"geh" },
  { c:"H", phonics:"ha"  },
  { c:"J", phonics:"jeh" },
  { c:"R", phonics:"er"  },
  { c:"C", phonics:"ceh" },
  { c:"W", phonics:"weh" },
  { c:"Y", phonics:"yeh" }
];

/* Bangun daftar suku kata: [{id:"BA", c:"B", v:"A"}, ...] */
window.SYLLABLES = (function(){
  var out = [];
  window.SYLLABLE_CONSONANTS.forEach(function(k){
    window.VOWELS.forEach(function(v){
      out.push({ id: k.c + v, c: k.c, v: v, phonics: k.phonics });
    });
  });
  return out;
})();
