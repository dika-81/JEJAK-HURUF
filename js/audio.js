/* =========================================================
   js/audio.js — MESIN SUARA
   ---------------------------------------------------------
   Urutan sumber suara:
     1) File rekaman  ./assets/audio/<nama>.mp3   (paling bagus)
     2) Text-to-Speech bawaan browser (Bahasa Indonesia)
     3) Diam (tidak error) — teks tetap muncul di balon Kiko

   FILE AUDIO YANG PERLU DIREKAM (Bahasa Indonesia, suara ramah, pelan):
     a.mp3 .. z.mp3        -> nama huruf: "A", "Be", "Ce", ...
     apel.mp3, bola.mp3 .. -> "A seperti Apel", dst (lihat data/letters.js)
     ba.mp3, bi.mp3, ...   -> suku kata (opsional)
     buku.mp3, bola.mp3 .. -> kata (lihat data/words.js)
     ini_buku.mp3, ...     -> kalimat (lihat data/words.js)
     Kalimat instruksi Kiko (opsional):
       kiko_halo.mp3, kiko_bagus.mp3, kiko_coba_lagi.mp3
   Selama file belum ada, aplikasi otomatis memakai TTS.
   ========================================================= */

window.JH = window.JH || {};

JH.Audio = (function () {
  var AUDIO_DIR = "./assets/audio/";
  var missing = {};      // cache nama file yang tidak ditemukan (hindari 404 berulang)
  var cache = {};        // cache elemen Audio yang berhasil dimuat
  var ctx = null;        // WebAudio untuk efek suara
  var token = 0;         // pembatal antrian
  var current = null;    // elemen audio yang sedang berbunyi
  var voice = null;
  var voicesReady = false;
  var settings = { sound: true };

  var TTS = ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);

  /* ---------- inisialisasi suara TTS ---------- */
  function pickVoice() {
    if (!TTS) return;
    var list = window.speechSynthesis.getVoices() || [];
    if (!list.length) return;
    voice =
      list.find(function (v) { return /^id(-|_)?/i.test(v.lang); }) ||
      list.find(function (v) { return /indonesi/i.test(v.name); }) ||
      list.find(function (v) { return /^ms(-|_)?/i.test(v.lang); }) ||
      null;
    voicesReady = true;
  }
  if (TTS) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  /* ---------- WebAudio untuk efek ---------- */
  function ensureCtx() {
    try {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) ctx = new AC();
      }
      if (ctx && ctx.state === "suspended") ctx.resume();
    } catch (e) { ctx = null; }
    return ctx;
  }

  function beep(freq, start, dur, type, vol) {
    var c = ensureCtx();
    if (!c || !settings.sound) return;
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, c.currentTime + start);
    g.gain.setValueAtTime(0.0001, c.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol || 0.16, c.currentTime + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
    o.connect(g); g.connect(c.destination);
    o.start(c.currentTime + start);
    o.stop(c.currentTime + start + dur + 0.03);
  }

  var SFX = {
    tap:     function () { beep(660, 0, 0.09, "sine", 0.12); },
    pop:     function () { beep(880, 0, 0.08, "triangle", 0.14); },
    success: function () { beep(659, 0, 0.12); beep(784, 0.1, 0.12); beep(1046, 0.2, 0.26); },
    win:     function () { beep(523, 0, 0.12); beep(659, 0.1, 0.12); beep(784, 0.2, 0.12); beep(1046, 0.3, 0.34); },
    oops:    function () { beep(320, 0, 0.14, "sine", 0.1); beep(250, 0.12, 0.2, "sine", 0.1); },
    sparkle: function () { beep(1200, 0, 0.06, "triangle", 0.1); beep(1600, 0.06, 0.06, "triangle", 0.08); }
  };
  function sfx(name) { if (SFX[name]) SFX[name](); }

  /* ---------- memutar file audio ---------- */
  function playFile(name) {
    return new Promise(function (resolve, reject) {
      if (!name || missing[name] || !settings.sound) return reject(new Error("skip"));
      var a = cache[name];
      if (!a) {
        a = new Audio(AUDIO_DIR + name + ".mp3");
        a.preload = "auto";
      }
      var done = false;
      function ok() { if (!done) { done = true; cleanup(); resolve(); } }
      function fail(e) {
        if (!done) {
          done = true; cleanup();
          missing[name] = true;
          reject(new Error("audio tidak ditemukan: " + name));
        }
      }
      function cleanup() {
        a.removeEventListener("ended", ok);
        a.removeEventListener("error", fail);
      }
      a.addEventListener("ended", ok);
      a.addEventListener("error", fail);
      try {
        a.currentTime = 0;
        var p = a.play();
        current = a;
        cache[name] = a;
        if (p && p.catch) p.catch(fail);
      } catch (e) { fail(e); }
    });
  }

  /* ---------- Text to Speech ---------- */
  function speak(text, rate) {
    return new Promise(function (resolve) {
      if (!TTS || !text || !settings.sound) { setTimeout(resolve, 120); return; }
      try {
        if (!voicesReady) pickVoice();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = (voice && voice.lang) || "id-ID";
        if (voice) u.voice = voice;
        u.rate = rate || 0.85;
        u.pitch = 1.15;
        var guard = setTimeout(resolve, Math.max(1200, text.length * 130));
        u.onend = function () { clearTimeout(guard); resolve(); };
        u.onerror = function () { clearTimeout(guard); resolve(); };
        window.speechSynthesis.speak(u);
      } catch (e) { setTimeout(resolve, 120); }
    });
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function stop() {
    token++;
    try { if (TTS) window.speechSynthesis.cancel(); } catch (e) {}
    try { if (current) { current.pause(); current.currentTime = 0; } } catch (e) {}
  }

  /**
   * Ucapkan satu bagian: coba file dulu, kalau tidak ada pakai TTS.
   * part = { file:"a", text:"A", rate:0.8, gap:250 }
   */
  function sayOne(part) {
    if (typeof part === "string") part = { text: part };
    return playFile(part.file).catch(function () { return speak(part.text, part.rate); });
  }

  /**
   * Ucapkan berurutan. Memanggil say() baru akan membatalkan antrian lama.
   * JH.Audio.say([{file:"a",text:"A"},{text:"A seperti Apel", gap:200}])
   */
  function say(parts) {
    stop();
    var my = token;
    var list = Array.isArray(parts) ? parts.slice() : [parts];
    var chain = Promise.resolve();
    list.forEach(function (p) {
      chain = chain.then(function () {
        if (my !== token) return;
        return sayOne(p).then(function () {
          if (p && p.gap) return wait(p.gap);
        });
      });
    });
    return chain.catch(function () {});
  }

  /* ---------- aktivasi audio pada sentuhan pertama ---------- */
  function unlock() {
    ensureCtx();
    if (TTS && !voicesReady) pickVoice();
  }

  function setSound(on) {
    settings.sound = !!on;
    if (!on) stop();
  }

  return {
    say: say, speak: speak, playFile: playFile, sfx: sfx,
    stop: stop, unlock: unlock, setSound: setSound,
    get soundOn() { return settings.sound; },
    get ttsAvailable() { return TTS; }
  };
})();
