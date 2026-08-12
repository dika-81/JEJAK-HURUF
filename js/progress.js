/* =========================================================
   js/progress.js — PENYIMPANAN PROGRES (localStorage)
   ---------------------------------------------------------
   Semua data disimpan di perangkat anak. Tidak ada server,
   tidak ada login, tidak ada data yang dikirim ke mana pun.
   Kunci penyimpanan: "jejakhuruf.v1"
   ========================================================= */

window.JH = window.JH || {};

JH.Progress = (function () {
  var KEY = "jejakhuruf.v1";

  function blank() {
    return {
      v: 1,
      learned: {},        // huruf yang pernah didengar/dibuka
      recognized: {},     // huruf yang dikenali (benar di permainan >= 2x)
      written: {},        // huruf yang berhasil ditulis (skor >= 60)
      bestScore: {},      // skor tracing terbaik per huruf
      practiceCount: 0,   // jumlah latihan menulis yang diselesaikan
      letterStats: {},    // { A:{correct:0, wrong:0} } untuk latihan adaptif
      syllables: {},      // suku kata yang dikuasai
      words: {},          // kata yang selesai disusun
      sentences: 0,       // jumlah kalimat yang dibaca
      rewards: {},        // hadiah Kampung Hurufku
      settings: { sound: true, reduceMotion: false },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  var state = blank();
  var listeners = [];

  /* ---------------- API DASAR ---------------- */

  function loadProgress() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var data = JSON.parse(raw);
        var base = blank();
        Object.keys(base).forEach(function (k) {
          if (data[k] !== undefined && data[k] !== null) base[k] = data[k];
        });
        base.settings = Object.assign({ sound: true, reduceMotion: false }, data.settings || {});
        state = base;
      }
    } catch (e) {
      console.warn("[JejakHuruf] Gagal memuat progres, memakai data baru.", e);
      state = blank();
    }
    return state;
  }

  function saveProgress() {
    state.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      // Mode privat / penyimpanan penuh: aplikasi tetap berjalan
      console.warn("[JejakHuruf] Progres tidak dapat disimpan.", e);
    }
    listeners.forEach(function (fn) { try { fn(state); } catch (e) {} });
    return state;
  }

  function resetProgress() {
    state = blank();
    try { localStorage.removeItem(KEY); } catch (e) {}
    saveProgress();
    return state;
  }

  function get() { return state; }
  function onChange(fn) { listeners.push(fn); }

  /* ---------------- PENCATATAN ---------------- */

  function markLearned(letter) {
    if (!letter) return;
    state.learned[letter] = true;
    saveProgress();
  }

  /** Catat hasil latihan menulis. score 0-100 */
  function markWritten(letter, score) {
    if (!letter) return;
    state.practiceCount++;
    var best = state.bestScore[letter] || 0;
    if (score > best) state.bestScore[letter] = Math.round(score);
    if (score >= 60) {
      state.written[letter] = true;
      state.learned[letter] = true;
    }
    saveProgress();
  }

  /** Catat jawaban permainan untuk latihan adaptif */
  function recordAnswer(letter, correct) {
    if (!letter) return;
    var s = state.letterStats[letter] || { correct: 0, wrong: 0 };
    if (correct) s.correct++; else s.wrong++;
    state.letterStats[letter] = s;
    if (correct && s.correct >= 2) state.recognized[letter] = true;
    state.learned[letter] = true;
    saveProgress();
  }

  function markSyllable(id) { if (id) { state.syllables[id] = true; saveProgress(); } }
  function markWord(w) { if (w) { state.words[w] = true; saveProgress(); } }
  function addSentence() { state.sentences++; saveProgress(); }

  function addReward(id) {
    if (!id || state.rewards[id]) return false;
    state.rewards[id] = true;
    saveProgress();
    return true; // true = hadiah baru
  }

  function setSetting(key, value) {
    state.settings[key] = value;
    saveProgress();
  }

  /* ---------------- ANALISIS ---------------- */

  function count(obj) { return Object.keys(obj || {}).length; }

  /** Huruf yang perlu latihan: rasio salah tinggi atau belum dikenali */
  function needPractice(limit) {
    var out = [];
    Object.keys(state.letterStats).forEach(function (L) {
      var s = state.letterStats[L];
      var total = s.correct + s.wrong;
      if (total >= 2 && s.wrong / total >= 0.34) {
        out.push({ letter: L, ratio: s.wrong / total, wrong: s.wrong });
      }
    });
    out.sort(function (a, b) { return b.ratio - a.ratio || b.wrong - a.wrong; });
    return out.slice(0, limit || 6).map(function (o) { return o.letter; });
  }

  /**
   * Bobot huruf untuk permainan (adaptive learning sederhana).
   * Huruf yang sering salah muncul lebih sering.
   */
  function weightFor(letter) {
    var s = state.letterStats[letter];
    if (!s) return 1.6;                       // belum pernah dicoba -> agak sering
    var total = s.correct + s.wrong;
    if (!total) return 1.6;
    var errRate = s.wrong / total;
    var w = 1 + errRate * 4;                  // 1 .. 5
    if (s.correct >= 4 && errRate < 0.2) w = 0.5; // sudah lancar -> jarang
    return w;
  }

  /** Ambil satu huruf acak berbobot dari daftar huruf */
  function pickWeighted(letters) {
    var pool = letters || Object.keys(window.LETTER_MAP);
    var weights = pool.map(weightFor);
    var sum = weights.reduce(function (a, b) { return a + b; }, 0);
    var r = Math.random() * sum;
    for (var i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  function summary() {
    var total = (window.LETTERS || []).length || 26;
    return {
      total: total,
      learned: count(state.learned),
      recognized: count(state.recognized),
      written: count(state.written),
      practiceCount: state.practiceCount,
      syllables: count(state.syllables),
      words: count(state.words),
      sentences: state.sentences,
      rewards: count(state.rewards),
      needPractice: needPractice(6)
    };
  }

  return {
    loadProgress: loadProgress, saveProgress: saveProgress, resetProgress: resetProgress,
    get: get, onChange: onChange,
    markLearned: markLearned, markWritten: markWritten, recordAnswer: recordAnswer,
    markSyllable: markSyllable, markWord: markWord, addSentence: addSentence,
    addReward: addReward, setSetting: setSetting,
    needPractice: needPractice, pickWeighted: pickWeighted, weightFor: weightFor,
    summary: summary
  };
})();

/* Alias global sesuai permintaan struktur: saveProgress() / loadProgress() / resetProgress() */
window.saveProgress = JH.Progress.saveProgress;
window.loadProgress = JH.Progress.loadProgress;
window.resetProgress = JH.Progress.resetProgress;
