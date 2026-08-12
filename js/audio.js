/* =========================================================
   js/audio.js — MESIN SUARA BAHASA INDONESIA (V3)
   ---------------------------------------------------------
   Prioritas:
     1) Rekaman lokal di ./assets/audio/ (MP3/M4A/WAV/OGG/WEBM)
     2) TTS browser HANYA dengan target bahasa Indonesia id-ID

   V3 sengaja TIDAK memakai fallback bahasa Melayu (ms-MY) atau
   bahasa Inggris. Teks legacy seperti "beh", "ceh", "deh" juga
   dinormalisasi sebelum dibacakan agar tidak terdengar "beh/ceh".
   ========================================================= */
window.JH = window.JH || {};

JH.Audio = (function () {
  "use strict";

  var AUDIO_DIR = "./assets/audio/";
  var AUDIO_EXTS = ["mp3", "m4a", "wav", "ogg", "webm"];
  var missing = {};
  var cache = {};
  var ctx = null;
  var token = 0;
  var current = null;
  var voice = null;
  var voicesReady = false;
  var settings = { sound: true };
  var TTS = ("speechSynthesis" in window) && ("SpeechSynthesisUtterance" in window);

  /* ---------- pemilihan voice Indonesia ---------- */
  function isIndonesianVoice(v) {
    return !!v && /^id(?:-|_)/i.test(String(v.lang || ""));
  }

  function voiceScore(v) {
    var n = String(v.name || "");
    var score = 0;
    if (isIndonesianVoice(v)) score += 1000;
    if (/Gadis|Ardi|Bahasa Indonesia|Indonesian/i.test(n)) score += 220;
    if (/Natural|Neural|Online/i.test(n)) score += 120;
    if (/Microsoft|Google/i.test(n)) score += 50;
    if (v.localService === false) score += 15; // online voices sering lebih natural
    return score;
  }

  function pickVoice() {
    if (!TTS) return null;
    var list = window.speechSynthesis.getVoices() || [];
    if (!list.length) return null;

    var ids = list.filter(isIndonesianVoice);
    ids.sort(function (a, b) { return voiceScore(b) - voiceScore(a); });
    voice = ids.length ? ids[0] : null;
    voicesReady = true;
    return voice;
  }

  if (TTS) {
    pickVoice();
    window.speechSynthesis.onvoiceschanged = function () { pickVoice(); };
  }

  /* ---------- normalisasi ucapan Indonesia ---------- */
  var REPLACEMENTS = [
    [/\bbeh\b/gi, "bé"],
    [/\bceh\b/gi, "cé"],
    [/\bdeh\b/gi, "dé"],
    [/\bgeh\b/gi, "gé"],
    [/\bjeh\b/gi, "jé"],
    [/\bkeh\b/gi, "ka"],
    [/\bpeh\b/gi, "pé"],
    [/\bteh\b/gi, "té"],
    [/\bveh\b/gi, "fé"],
    [/\bweh\b/gi, "wé"],
    [/\byeh\b/gi, "yé"],
    [/\bzeh\b/gi, "zet"],

    // nama huruf yang sering dibaca seperti bahasa asing oleh TTS
    [/\bQi\b/g, "ki"],
    [/\bVe\b/g, "fé"],
    [/\bBe\b/g, "bé"],
    [/\bCe\b/g, "cé"],
    [/\bDe\b/g, "dé"],
    [/\bGe\b/g, "gé"],
    [/\bJe\b/g, "jé"],
    [/\bPe\b/g, "pé"],
    [/\bTe\b/g, "té"],
    [/\bWe\b/g, "wé"],
    [/\bYe\b/g, "yé"]
  ];

  function normalizeIndonesian(text) {
    var s = String(text == null ? "" : text).trim();
    REPLACEMENTS.forEach(function (r) { s = s.replace(r[0], r[1]); });

    // Hindari seluruh kata kapital dibaca sebagai singkatan.
    // Huruf tunggal tetap dibiarkan karena beberapa bagian UI memang menampilkan huruf.
    s = s.replace(/\b[A-Z]{2,}\b/g, function (w) {
      return w.charAt(0) + w.slice(1).toLowerCase();
    });

    // Rapikan jeda agar pelafalan tidak terburu-buru.
    s = s.replace(/\s+/g, " ");
    return s;
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

  /* ---------- file audio lokal ---------- */
  function hasExplicitExt(name) {
    return /\.(mp3|m4a|wav|ogg|webm)$/i.test(String(name || ""));
  }

  function tryAudioUrl(url, key) {
    return new Promise(function (resolve, reject) {
      var a = cache[url];
      if (!a) {
        a = new Audio(url);
        a.preload = "auto";
      }
      var done = false;
      function ok() {
        if (done) return;
        done = true; cleanup(); resolve();
      }
      function fail() {
        if (done) return;
        done = true; cleanup(); reject(new Error("audio tidak ditemukan: " + key));
      }
      function cleanup() {
        a.removeEventListener("ended", ok);
        a.removeEventListener("error", fail);
      }
      a.addEventListener("ended", ok);
      a.addEventListener("error", fail);
      try {
        a.currentTime = 0;
        current = a;
        cache[url] = a;
        var p = a.play();
        if (p && p.catch) p.catch(fail);
      } catch (e) { fail(); }
    });
  }

  function playFile(name) {
    return new Promise(function (resolve, reject) {
      if (!name || missing[name] || !settings.sound) {
        reject(new Error("skip")); return;
      }

      var urls;
      if (hasExplicitExt(name)) {
        urls = [AUDIO_DIR + name];
      } else {
        urls = AUDIO_EXTS.map(function (ext) { return AUDIO_DIR + name + "." + ext; });
      }

      var i = 0;
      function next() {
        if (i >= urls.length) {
          missing[name] = true;
          reject(new Error("audio tidak ditemukan: " + name));
          return;
        }
        var url = urls[i++];
        tryAudioUrl(url, name).then(resolve).catch(next);
      }
      next();
    });
  }

  /* ---------- TTS Bahasa Indonesia ---------- */
  function speak(text, rate) {
    return new Promise(function (resolve) {
      if (!TTS || !text || !settings.sound) {
        setTimeout(resolve, 100); return;
      }

      try {
        if (!voicesReady || !voice) pickVoice();
        var spoken = normalizeIndonesian(text);
        var u = new SpeechSynthesisUtterance(spoken);

        // Jangan pernah memaksa voice Melayu/Inggris.
        // Bila voice id-ID tersedia, pakai voice tersebut. Bila belum terdaftar,
        // minta browser menyintesis dengan locale id-ID tanpa menetapkan voice asing.
        u.lang = "id-ID";
        if (voice && isIndonesianVoice(voice)) u.voice = voice;

        u.rate = Math.max(0.68, Math.min(1.0, Number(rate) || 0.82));
        u.pitch = 1.0;
        u.volume = 1.0;

        var guard = setTimeout(resolve, Math.max(1400, spoken.length * 145));
        u.onend = function () { clearTimeout(guard); resolve(); };
        u.onerror = function () { clearTimeout(guard); resolve(); };
        window.speechSynthesis.speak(u);
      } catch (e) {
        setTimeout(resolve, 100);
      }
    });
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function stop() {
    token++;
    try { if (TTS) window.speechSynthesis.cancel(); } catch (e) {}
    try { if (current) { current.pause(); current.currentTime = 0; } } catch (e) {}
  }

  function sayOne(part) {
    if (typeof part === "string") part = { text: part };
    return playFile(part && part.file).catch(function () {
      return speak(part && part.text, part && part.rate);
    });
  }

  function say(parts) {
    stop();
    var my = token;
    var list = Array.isArray(parts) ? parts.slice() : [parts];
    var chain = Promise.resolve();
    list.forEach(function (p) {
      chain = chain.then(function () {
        if (my !== token) return;
        return sayOne(p || {}).then(function () {
          if (p && p.gap) return wait(p.gap);
        });
      });
    });
    return chain.catch(function () {});
  }

  function unlock() {
    ensureCtx();
    if (TTS) pickVoice();
  }

  function setSound(on) {
    settings.sound = !!on;
    if (!on) stop();
  }

  function voiceInfo() {
    if (TTS && (!voicesReady || !voice)) pickVoice();
    return {
      available: !!voice,
      name: voice ? voice.name : "",
      lang: voice ? voice.lang : "id-ID (requested)",
      isIndonesian: !!voice && isIndonesianVoice(voice)
    };
  }

  return {
    say: say,
    speak: speak,
    playFile: playFile,
    sfx: sfx,
    stop: stop,
    unlock: unlock,
    setSound: setSound,
    normalizeIndonesian: normalizeIndonesian,
    voiceInfo: voiceInfo,
    get soundOn() { return settings.sound; },
    get ttsAvailable() { return TTS; }
  };
})();
