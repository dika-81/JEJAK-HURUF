/* =========================================================
   data/syllables.js — DATA SUKU KATA
   Pola: konsonan + vokal (KV). BA BI BU BE BO, CA CI CU CE CO, ...
   Tambah/hapus konsonan pada SYLLABLE_CONSONANTS untuk mengubah materi.
   ========================================================= */

window.VOWELS = ["A","I","U","E","O"];

/* Konsonan yang dilatih (urut dari yang paling mudah/sering dipakai) */
window.SYLLABLE_CONSONANTS = [
  { c:"B", phonics:"bé"  },
  { c:"D", phonics:"dé"  },
  { c:"K", phonics:"ka"  },
  { c:"L", phonics:"el"  },
  { c:"M", phonics:"em"  },
  { c:"N", phonics:"en"  },
  { c:"P", phonics:"pé"  },
  { c:"S", phonics:"es"  },
  { c:"T", phonics:"té"  },
  { c:"G", phonics:"gé"  },
  { c:"H", phonics:"ha"  },
  { c:"J", phonics:"jé"  },
  { c:"R", phonics:"er"  },
  { c:"C", phonics:"cé"  },
  { c:"W", phonics:"wé"  },
  { c:"Y", phonics:"yé"  }
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
