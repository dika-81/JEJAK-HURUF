/* =========================================================
   js/illustrations.js — ILUSTRASI SVG BAWAAN (PLACEHOLDER)
   ---------------------------------------------------------
   Semua gambar dibuat sendiri dengan bentuk SVG sederhana
   (tidak memakai aset berhak cipta).

   Cara mengganti dengan gambar final:
     1. Simpan file gambar di ./assets/images/  (mis. apel.svg / apel.png)
     2. Pastikan `image` pada data/letters.js menunjuk ke file itu.
   Jika file tidak ditemukan, ilustrasi bawaan di bawah ini otomatis
   dipakai sehingga aplikasi TIDAK PERNAH error atau kosong.
   ========================================================= */

window.JH = window.JH || {};

JH.Illus = (function () {
  var P = {}; // kumpulan ilustrasi: slug -> isi svg

  P.apel = '<circle cx="50" cy="34" r="4" fill="#7B4B2A"/><rect x="47" y="20" width="6" height="16" rx="3" fill="#7B4B2A"/><path d="M50 32c-8-8-2-18 8-18 0 9-3 15-8 18z" fill="#4CAF50"/><circle cx="50" cy="60" r="28" fill="#E4443B"/><ellipse cx="40" cy="50" rx="6" ry="9" fill="#fff" opacity=".3"/>';
  P.bola = '<circle cx="50" cy="52" r="30" fill="#FAFAFA" stroke="#333" stroke-width="3"/><path d="M50 30l17 12-6 20H39l-6-20z" fill="#333"/><path d="M50 22v8M20 44l13 0M80 44l-13 0M34 76l6-14M66 76l-6-14" stroke="#333" stroke-width="3"/>';
  P.cicak = '<path d="M30 52c0-9 9-15 20-15s20 6 20 15-9 15-20 15c-7 0-10 4-13 8-5 7-15 8-19 2" fill="none" stroke="#8BC34A" stroke-width="8" stroke-linecap="round"/><circle cx="70" cy="48" r="10" fill="#8BC34A"/><circle cx="73" cy="45" r="2.4" fill="#2B2118"/><path d="M40 60l-6 12M56 60l-4 12M42 42l-6-10M58 42l-2-10" stroke="#8BC34A" stroke-width="5" stroke-linecap="round"/>';
  P.dadu = '<rect x="22" y="22" width="56" height="56" rx="14" fill="#fff" stroke="#333" stroke-width="3"/><g fill="#E4443B"><circle cx="38" cy="38" r="5"/><circle cx="62" cy="38" r="5"/><circle cx="50" cy="50" r="5"/><circle cx="38" cy="62" r="5"/><circle cx="62" cy="62" r="5"/></g>';
  P.ember = '<path d="M28 40h44l-6 42H34z" fill="#29A3D6"/><rect x="23" y="32" width="54" height="10" rx="5" fill="#1B7FA8"/><path d="M32 32c4-16 32-16 36 0" fill="none" stroke="#5B6B76" stroke-width="4"/><path d="M40 50l-2 24" stroke="#8ED8F0" stroke-width="4"/>';
  P.foto = '<rect x="18" y="24" width="64" height="54" rx="10" fill="#fff" stroke="#B07A4A" stroke-width="5"/><rect x="27" y="33" width="46" height="36" rx="4" fill="#BEE7F5"/><circle cx="40" cy="44" r="5" fill="#FFC107"/><path d="M27 69l15-18 10 11 8-9 13 16z" fill="#7CC576"/>';
  P.gajah = '<ellipse cx="44" cy="58" rx="26" ry="20" fill="#9AA5B1"/><rect x="28" y="70" width="10" height="16" rx="5" fill="#9AA5B1"/><rect x="50" y="70" width="10" height="16" rx="5" fill="#9AA5B1"/><circle cx="70" cy="44" r="17" fill="#A7B2BE"/><ellipse cx="58" cy="42" rx="10" ry="13" fill="#8792A0"/><path d="M80 54c10 6 8 20-1 24" fill="none" stroke="#A7B2BE" stroke-width="9" stroke-linecap="round"/><circle cx="74" cy="40" r="2.6" fill="#2B2118"/>';
  P.hujan = '<path d="M32 58a15 15 0 0 1 2-29 19 19 0 0 1 35-3 14 14 0 0 1 4 32z" fill="#AEBDC6"/><g stroke="#29A3D6" stroke-width="6" stroke-linecap="round"><path d="M36 66l-4 14"/><path d="M52 66l-4 14"/><path d="M68 66l-4 14"/></g>';
  P.ikan = '<path d="M20 50c13-18 42-18 55 0-13 18-42 18-55 0z" fill="#FF9800"/><path d="M75 50l14-13v26z" fill="#F57C00"/><circle cx="36" cy="46" r="3.4" fill="#2B2118"/><path d="M48 36v28" stroke="#F57C00" stroke-width="3"/><path d="M60 38v24" stroke="#F57C00" stroke-width="3"/>';
  P.jeruk = '<rect x="47" y="24" width="6" height="12" rx="3" fill="#7B4B2A"/><path d="M52 32c8-8 16-6 18-2-8 2-13 5-16 8z" fill="#4CAF50"/><circle cx="50" cy="58" r="28" fill="#FF9800"/><path d="M50 32v52M24 58h52M32 40l38 36M68 40L32 76" stroke="#F57C00" stroke-width="2" opacity=".5"/>';
  P.kucing = '<path d="M28 42L23 20l20 9zM72 42l5-22-20 9z" fill="#F6A96B"/><circle cx="50" cy="56" r="26" fill="#F6A96B"/><circle cx="41" cy="52" r="4" fill="#2B2118"/><circle cx="59" cy="52" r="4" fill="#2B2118"/><path d="M46 63h8l-4 5z" fill="#E4443B"/><path d="M50 68v3M50 71q-6 6-11 1M50 71q6 6 11 1" stroke="#2B2118" stroke-width="2.4" fill="none" stroke-linecap="round"/><g stroke="#2B2118" stroke-width="2" opacity=".8"><path d="M20 58h14M20 66h14M66 58h14M66 66h14"/></g>';
  P.lampu = '<circle cx="50" cy="44" r="22" fill="#FFD54F"/><path d="M40 44a10 10 0 0 1 10-10" stroke="#fff" stroke-width="4" fill="none" opacity=".8"/><rect x="40" y="64" width="20" height="13" rx="4" fill="#9AA5B1"/><rect x="42" y="77" width="16" height="7" rx="3" fill="#7A848D"/><g stroke="#FFB300" stroke-width="4" stroke-linecap="round"><path d="M50 12v-6M20 44h-7M87 44h-7M27 21l-5-5M73 21l5-5"/></g>';
  P.mobil = '<path d="M16 64l7-18h54l7 18v10H16z" fill="#E4443B"/><path d="M32 48h36l5 13H27z" fill="#BEE7F5"/><circle cx="32" cy="76" r="9" fill="#2B2118"/><circle cx="68" cy="76" r="9" fill="#2B2118"/><circle cx="32" cy="76" r="3.4" fill="#ccc"/><circle cx="68" cy="76" r="3.4" fill="#ccc"/>';
  P.nanas = '<path d="M50 34c-5-14-16-19-20-19 2 11 9 17 16 21zM50 34c5-14 16-19 20-19-2 11-9 17-16 21zM50 32V12" fill="#4CAF50" stroke="#4CAF50" stroke-width="3" stroke-linejoin="round"/><ellipse cx="50" cy="60" rx="22" ry="27" fill="#FFC107"/><g stroke="#E09C00" stroke-width="2.4"><path d="M32 48l36 24M68 48L32 72M50 34v52"/></g>';
  P.ombak = '<rect x="12" y="48" width="76" height="34" rx="12" fill="#29A3D6"/><g fill="none" stroke="#8ED8F0" stroke-width="5" stroke-linecap="round"><path d="M16 58q9-8 18 0 9 8 18 0 9-8 18 0"/><path d="M16 70q9-8 18 0 9 8 18 0 9-8 18 0"/></g>';
  P.pensil = '<path d="M26 78l6-19 34-34 13 13-34 34z" fill="#FFC107"/><path d="M66 25l13 13 6-6-13-13z" fill="#EF6F6C"/><path d="M26 78l6-19 8 8z" fill="#7B4B2A"/><path d="M38 65l30-30" stroke="#E0A800" stroke-width="3"/>';
  P.quran = '<path d="M20 26h24c5 0 6 3 6 6v46c0-4-3-6-8-6H20z" fill="#2E7D32"/><path d="M80 26H56c-5 0-6 3-6 6v46c0-4 3-6 8-6h22z" fill="#43A047"/><path d="M50 32v46" stroke="#1B5E20" stroke-width="3"/><path d="M64 44l3 6 6 1-4 5 1 6-6-3-6 3 1-6-4-5 6-1z" fill="#FFD54F"/>';
  P.rumah = '<rect x="24" y="44" width="52" height="38" fill="#FFF3E0"/><path d="M50 14L12 48h76z" fill="#EF6F6C"/><rect x="42" y="58" width="16" height="24" rx="2" fill="#B07A4A"/><rect x="28" y="54" width="11" height="11" rx="2" fill="#BEE7F5"/><rect x="61" y="54" width="11" height="11" rx="2" fill="#BEE7F5"/>';
  P.sepatu = '<path d="M18 70V46h14l11 10h19c11 0 18 6 18 15v5H18z" fill="#29A3D6"/><rect x="14" y="74" width="72" height="9" rx="4" fill="#2B2118"/><g stroke="#fff" stroke-width="3"><path d="M44 56l9 9M54 52l9 9"/></g>';
  P.topi = '<path d="M22 62c0-19 12-30 28-30s28 11 28 30z" fill="#E4443B"/><path d="M18 62h58c9 0 14 4 14 9H18z" fill="#B7332C"/><circle cx="50" cy="32" r="5" fill="#B7332C"/>';
  P.ular = '<path d="M20 76c16 0 16-15 30-15s16-15 28-15" fill="none" stroke="#7CC576" stroke-width="13" stroke-linecap="round"/><circle cx="78" cy="46" r="10" fill="#7CC576"/><circle cx="81" cy="43" r="2.4" fill="#2B2118"/><path d="M88 48l9 2-9 3" fill="none" stroke="#E4443B" stroke-width="2.6" stroke-linecap="round"/>';
  P.vas = '<path d="M50 46V28" stroke="#4CAF50" stroke-width="4"/><circle cx="50" cy="22" r="9" fill="#EF6F6C"/><circle cx="38" cy="30" r="7" fill="#FFC107"/><circle cx="62" cy="30" r="7" fill="#9B6BC9"/><path d="M38 52h24l-4 30H42z" fill="#29A3D6"/><rect x="33" y="45" width="34" height="9" rx="4" fill="#1B7FA8"/>';
  P.wortel = '<path d="M62 32L45 86 28 46z" fill="#FF7A18"/><path d="M62 30c9-10 19-8 21-4-9 2-14 6-16 10zM62 30c-2-13 5-19 11-19-2 9-5 15-7 19z" fill="#4CAF50"/><g stroke="#E06400" stroke-width="2.4"><path d="M36 52l16 6M40 64l14 5"/></g>';
  P.xilofon = '<rect x="16" y="28" width="68" height="10" rx="5" fill="#E4443B"/><rect x="19" y="42" width="62" height="10" rx="5" fill="#FF9800"/><rect x="22" y="56" width="56" height="10" rx="5" fill="#FFC107"/><rect x="25" y="70" width="50" height="10" rx="5" fill="#7CC576"/><path d="M78 22l10 12" stroke="#7B4B2A" stroke-width="4" stroke-linecap="round"/><circle cx="90" cy="36" r="5" fill="#7B4B2A"/>';
  P.yoyo = '<path d="M50 38V12" stroke="#7B4B2A" stroke-width="3"/><circle cx="50" cy="12" r="4" fill="#7B4B2A"/><circle cx="50" cy="62" r="25" fill="#9B6BC9"/><circle cx="50" cy="62" r="9" fill="#fff"/><path d="M50 37a25 25 0 0 1 18 8" stroke="#B48DE0" stroke-width="5" fill="none"/>';
  P.zebra = '<ellipse cx="50" cy="58" rx="30" ry="21" fill="#fff" stroke="#2B2118" stroke-width="3"/><g stroke="#2B2118" stroke-width="7" stroke-linecap="round"><path d="M36 42v32M46 40v36M56 40v36M66 44v28"/></g><rect x="34" y="76" width="8" height="12" rx="3" fill="#2B2118"/><rect x="58" y="76" width="8" height="12" rx="3" fill="#2B2118"/>';

  /* kata tambahan untuk Susun Kata */
  P.buku = '<path d="M50 34c-9-8-21-10-32-8v44c11-2 23 0 32 8z" fill="#29A3D6"/><path d="M50 34c9-8 21-10 32-8v44c-11-2-23 0-32 8z" fill="#8ED8F0"/><path d="M50 34v44" stroke="#1B7FA8" stroke-width="3"/>';
  P.sapi = '<ellipse cx="45" cy="58" rx="28" ry="19" fill="#fff" stroke="#2B2118" stroke-width="3"/><ellipse cx="36" cy="52" rx="9" ry="6" fill="#2B2118"/><ellipse cx="56" cy="63" rx="7" ry="5" fill="#2B2118"/><circle cx="76" cy="42" r="13" fill="#fff" stroke="#2B2118" stroke-width="3"/><circle cx="73" cy="40" r="2.4" fill="#2B2118"/><path d="M68 32l-5-7M85 32l5-7" stroke="#2B2118" stroke-width="4" stroke-linecap="round"/><rect x="32" y="74" width="8" height="13" rx="3" fill="#2B2118"/><rect x="54" y="74" width="8" height="13" rx="3" fill="#2B2118"/>';
  P.meja = '<rect x="14" y="42" width="72" height="11" rx="5" fill="#B07A4A"/><rect x="22" y="53" width="9" height="31" rx="4" fill="#7B4B2A"/><rect x="69" y="53" width="9" height="31" rx="4" fill="#7B4B2A"/>';
  P.roti = '<path d="M22 70c-3-24 12-34 28-34s31 10 28 34z" fill="#D9A05B"/><rect x="18" y="66" width="64" height="14" rx="7" fill="#B87F3B"/><g fill="none" stroke="#B87F3B" stroke-width="3"><path d="M34 50q7-9 13 0M53 48q7-9 13 0"/></g>';
  P.kuda = '<ellipse cx="42" cy="60" rx="25" ry="16" fill="#B07A4A"/><path d="M56 52l13-19 11 6-11 21z" fill="#B07A4A"/><ellipse cx="78" cy="32" rx="12" ry="8" fill="#B07A4A" transform="rotate(-22 78 32)"/><circle cx="81" cy="28" r="2.2" fill="#2B2118"/><rect x="28" y="72" width="8" height="16" rx="3" fill="#8A5A32"/><rect x="50" y="72" width="8" height="16" rx="3" fill="#8A5A32"/><path d="M18 54c-9 4-9 18 0 22" fill="none" stroke="#5D3B1F" stroke-width="6" stroke-linecap="round"/>';
  P.baju = '<path d="M34 26L16 36l9 15 9-5v34h32V46l9 5 9-15-18-10-8 7H42z" fill="#29A3D6"/><path d="M42 26h16l-8 8z" fill="#1B7FA8"/>';
  P.nasi = '<path d="M22 54h56c0 17-13 28-28 28S22 71 22 54z" fill="#fff" stroke="#2B2118" stroke-width="3"/><path d="M30 54c3-13 37-13 40 0z" fill="#F3F3F3"/><rect x="16" y="80" width="68" height="7" rx="3" fill="#29A3D6"/><g stroke="#BEE7F5" stroke-width="3" fill="none" stroke-linecap="round"><path d="M40 40q6-6 0-12M58 40q6-6 0-12"/></g>';
  P.susu = '<path d="M34 26h32l-4 58H38z" fill="#EAF6FF" stroke="#9CC6DA" stroke-width="3"/><path d="M36 44h28l-3 38H39z" fill="#fff"/>';

  /* item hadiah khusus Kampung Hurufku */
  P.pohon = '<rect x="45" y="54" width="10" height="32" rx="4" fill="#7B4B2A"/><circle cx="50" cy="38" r="24" fill="#4CAF50"/><circle cx="32" cy="50" r="14" fill="#43A047"/><circle cx="68" cy="50" r="14" fill="#43A047"/><circle cx="42" cy="36" r="4.5" fill="#E4443B"/><circle cx="59" cy="44" r="4.5" fill="#E4443B"/><circle cx="53" cy="26" r="4.5" fill="#E4443B"/>';
  P.balon = '<ellipse cx="50" cy="40" rx="21" ry="25" fill="#EF6F6C"/><ellipse cx="42" cy="32" rx="5" ry="8" fill="#fff" opacity=".35"/><path d="M45 64h10l-5 7z" fill="#C9524F"/><path d="M50 71c9 9-9 13 0 21" fill="none" stroke="#7B4B2A" stroke-width="2.6"/>';
  P.payung = '<path d="M12 54a38 38 0 0 1 76 0z" fill="#EF6F6C"/><path d="M12 54a38 38 0 0 1 76 0" fill="none" stroke="#C9524F" stroke-width="3"/><path d="M50 54v26c0 7-11 7-11 0" fill="none" stroke="#7B4B2A" stroke-width="4" stroke-linecap="round"/>';

  /* Ilustrasi cadangan bila slug tidak dikenal */
  function fallback(text) {
    var ch = (text || "?").charAt(0).toUpperCase();
    return '<rect x="14" y="14" width="72" height="72" rx="20" fill="#FFF1D0"/>' +
      '<text x="50" y="66" text-anchor="middle" font-size="46" font-weight="900" fill="#FB8500" font-family="sans-serif">' + ch + '</text>';
  }

  function slugFromPath(p) {
    if (!p) return "";
    var m = String(p).split("/").pop().split(".");
    return m[0].toLowerCase();
  }

  function svg(slug, label) {
    var body = P[slug] || fallback(label || slug);
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' +
      (label || slug || "gambar") + '">' + body + "</svg>";
  }

  /**
   * Menampilkan gambar ke dalam sebuah elemen.
   * Coba muat file gambar; kalau gagal (belum ada) pakai SVG bawaan.
   */
  function render(el, opts) {
    if (!el) return;
    opts = opts || {};
    var slug = opts.slug || slugFromPath(opts.image);
    var label = opts.label || slug;
    el.innerHTML = "";
    if (opts.image) {
      var img = new Image();
      img.alt = label;
      img.decoding = "async";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      img.onerror = function () { el.innerHTML = svg(slug, label); };
      img.src = opts.image;
      el.appendChild(img);
    } else {
      el.innerHTML = svg(slug, label);
    }
  }

  return { svg: svg, render: render, slugFromPath: slugFromPath, has: function (s) { return !!P[s]; } };
})();
