/* =========================================================
   js/games.js — PERMAINAN HURUF
   1) Cari Huruf     : dengar lalu pilih huruf
   2) Huruf Awal     : tebak huruf pertama dari gambar
   3) Pasangan       : seret huruf ke gambar (mendukung layar sentuh)

   Latihan adaptif: huruf yang sering salah muncul lebih sering
   (lihat JH.Progress.pickWeighted / weightFor).
   ========================================================= */

window.JH = window.JH || {};

JH.Games = (function () {
  var h = null, shuffle = null;
  var root, mode, round, maxRound, correctCount, current, locked;

  function ready() { h = JH.UI.h; shuffle = JH.UI.shuffle; }

  /* ---------- pemilihan soal (adaptif) ----------
     avoidLast = true -> huruf soal tidak diulang persis dua kali berturut-turut */
  var lastAsked = null;
  function pickTarget(avoidLast) {
    var pool = window.LETTERS.map(function (l) { return l.letter; });
    var L = JH.Progress.pickWeighted(pool);
    if (avoidLast) {
      var tries = 0;
      while (L === lastAsked && tries++ < 8) L = JH.Progress.pickWeighted(pool);
      lastAsked = L;
    }
    return window.LETTER_MAP[L];
  }

  function distractors(letter, n) {
    var conf = (window.CONFUSABLES[letter] || []).slice();
    var others = window.LETTERS.map(function (l) { return l.letter; })
      .filter(function (L) { return L !== letter && conf.indexOf(L) === -1; });
    var out = shuffle(conf).slice(0, Math.min(n, conf.length));
    out = out.concat(shuffle(others).slice(0, n - out.length));
    return out.slice(0, n);
  }

  /* ---------- kerangka layar ---------- */
  function frame(titleText, bodyNodes) {
    JH.UI.clear(root);
    var chip = h("div", { class: "center" }, [
      h("div", { class: "score-chip", id: "game-score", text: "⭐ " + correctCount + " / " + maxRound })
    ]);
    root.appendChild(chip);
    bodyNodes.forEach(function (n) { root.appendChild(n); });
  }

  function updateScore() {
    var el = document.getElementById("game-score");
    if (el) el.textContent = "⭐ " + correctCount + " / " + maxRound;
  }

  function summary() {
    JH.UI.clear(root);
    var msg = correctCount >= maxRound - 1 ? "Hebat sekali!" : (correctCount >= maxRound / 2 ? "Bagus! Terus berlatih." : "Kerja bagus! Ayo coba lagi.");
    JH.UI.kiko(msg, [{ text: msg }]);
    JH.Audio.sfx("win");
    root.appendChild(h("div", { class: "game-stage" }, [
      h("div", { class: "big-letter", text: "🎉" }),
      h("p", { class: "game-q", text: msg }),
      h("p", { class: "letter-word", text: correctCount + " / " + maxRound })
    ]));
    root.appendChild(h("div", { class: "row-btns" }, [
      h("button", { class: "big-btn primary", type: "button", onclick: function () { start(mode); } }, [document.createTextNode("🔁 Main lagi")]),
      h("button", { class: "big-btn soft", type: "button", onclick: function () { JH.Nav.back(); } }, [document.createTextNode("↩︎ Kembali")])
    ]));
  }

  function nextRound() {
    round++;
    if (round > maxRound) { summary(); return; }
    if (mode === "find") roundFind();
    else if (mode === "initial") roundInitial();
    else roundMatch();
  }

  /* =========================================================
     1) CARI HURUF
     ========================================================= */
  function roundFind() {
    var target = pickTarget(true);
    current = target;
    locked = false;

    var opts = shuffle([target.letter].concat(distractors(target.letter, 3)));

    var ask = function () {
      JH.Audio.say([{ text: "Mana huruf" }, { file: target.audio.letter, text: target.name, gap: 120 }]);
    };

    var grid = h("div", { class: "opt-grid" }, opts.map(function (L, i) {
      return h("button", {
        class: "opt-btn", type: "button", "aria-label": "Huruf " + L, text: L,
        onclick: function (e) { answerFind(e.currentTarget, L, target); }
      });
    }));

    frame("Cari Huruf", [
      h("div", { class: "game-stage" }, [
        h("p", { class: "game-q", text: "Mana huruf yang kamu dengar?" }),
        h("button", { class: "big-btn accent", type: "button", style: "margin:10px auto 0;max-width:240px", onclick: ask },
          [document.createTextNode("🔊 Dengar lagi")])
      ]),
      grid
    ]);

    JH.UI.kiko("Sentuh huruf yang kamu dengar.", false);
    setTimeout(ask, 350);
  }

  function answerFind(btn, chosen, target) {
    if (locked) return;
    if (chosen === target.letter) {
      locked = true;
      btn.classList.add("correct");
      JH.Audio.sfx("success");
      JH.Progress.recordAnswer(target.letter, true);
      correctCount++; updateScore();
      JH.UI.kiko("Hebat! Itu huruf " + target.letter + ".",
        [{ text: "Hebat! Itu huruf" }, { file: target.audio.letter, text: target.name }]);
      setTimeout(nextRound, 1300);
    } else {
      btn.classList.add("wrong");
      btn.disabled = true;
      JH.Audio.sfx("oops");
      JH.Progress.recordAnswer(target.letter, false);
      JH.UI.kiko("Belum. Coba dengarkan lagi.", [{ text: "Belum. Coba dengarkan lagi" }]);
      setTimeout(function () {
        JH.Audio.say([{ text: "Mana huruf" }, { file: target.audio.letter, text: target.name, gap: 120 }]);
      }, 900);
    }
  }

  /* =========================================================
     2) HURUF AWAL
     ========================================================= */
  function roundInitial() {
    var target = pickTarget(true);
    current = target;
    locked = false;

    var opts = shuffle([target.letter].concat(distractors(target.letter, 2)));
    var qText = target.word + " dimulai dengan huruf apa?";

    var pic = h("div", { class: "game-pic" });
    var plainWordFile = "kata_" + target.word.toLowerCase();
    var ask = function () {
      JH.Audio.say([
        { file: plainWordFile, text: target.word, gap: 160 },
        { file: "prompt_dimulai_huruf_apa", text: "dimulai dengan huruf apa?" }
      ]);
    };

    var stage = h("div", { class: "game-stage" }, [
      pic,
      h("p", { class: "game-q", text: qText }),
      h("button", { class: "big-btn accent", type: "button", style: "margin:10px auto 0;max-width:240px", onclick: ask },
        [document.createTextNode("🔊 Ulangi")])
    ]);

    var grid = h("div", { class: "opt-grid three" }, opts.map(function (L) {
      return h("button", {
        class: "opt-btn", type: "button", "aria-label": "Huruf " + L, text: L,
        onclick: function (e) { answerInitial(e.currentTarget, L, target); }
      });
    }));

    frame("Huruf Awal", [stage, grid]);
    JH.Illus.render(pic, { image: target.image, label: target.word });
    JH.UI.kiko("Lihat gambarnya. Huruf pertamanya apa?", false);
    setTimeout(ask, 350);
  }

  function answerInitial(btn, chosen, target) {
    if (locked) return;
    if (chosen === target.letter) {
      locked = true;
      btn.classList.add("correct");
      JH.Audio.sfx("success");
      JH.Progress.recordAnswer(target.letter, true);
      correctCount++; updateScore();
      JH.UI.kiko("Betul! " + target.word + " diawali huruf " + target.letter + ".",
        [{ text: "Betul!" }, { file: target.audio.letter, text: target.name, gap: 120 },
         { file: "kata_" + target.word.toLowerCase(), text: target.word }]);
      setTimeout(nextRound, 1400);
    } else {
      btn.classList.add("wrong");
      btn.disabled = true;
      JH.Audio.sfx("oops");
      JH.Progress.recordAnswer(target.letter, false);
      JH.UI.kiko("Belum. Dengarkan lagi kata " + target.word + ".",
        [{ text: "Belum. Dengarkan lagi" },
         { file: "kata_" + target.word.toLowerCase(), text: target.word, gap: 100 }]);
    }
  }

  /* =========================================================
     3) PASANGAN (DRAG & DROP, MENDUKUNG SENTUH)
     ========================================================= */
  function roundMatch() {
    locked = false;
    // pilih 3 huruf berbeda, condong ke huruf yang masih sering salah
    var picked = [];
    var guard = 0;
    while (picked.length < 3 && guard++ < 60) {
      var L = pickTarget();
      if (picked.indexOf(L) === -1) picked.push(L);
    }
    while (picked.length < 3) {
      var rnd = window.LETTERS[Math.floor(Math.random() * window.LETTERS.length)];
      if (picked.indexOf(rnd) === -1) picked.push(rnd);
    }
    var pool = picked;
    var solved = 0;

    var targets = h("div", { class: "match-targets" }, pool.map(function (L) {
      var t = h("div", { class: "match-target", "data-letter": L.letter, "aria-label": "Gambar " + L.word });
      var pic = h("div");
      t.appendChild(pic);
      t.appendChild(h("span", { text: L.word.toUpperCase() }));
      JH.Illus.render(pic, { image: L.image, label: L.word });
      pic.style.width = "74px"; pic.style.height = "74px";
      return t;
    }));

    var source = h("div", { class: "match-source" }, shuffle(pool).map(function (L) {
      return h("div", {
        class: "drag-letter", "data-letter": L.letter, text: L.letter,
        role: "button", tabindex: "0", "aria-label": "Huruf " + L.letter + ", seret ke gambar " + L.word
      });
    }));

    frame("Pasangan", [
      h("div", { class: "game-stage" }, [h("p", { class: "game-q", text: "Seret huruf ke gambar yang tepat." })]),
      h("div", { class: "match-wrap" }, [targets, source])
    ]);

    JH.UI.kiko("Seret huruf ke gambarnya.", [{ text: "Seret huruf ke gambarnya" }]);

    // --- drag dengan Pointer Events ---
    Array.prototype.forEach.call(source.querySelectorAll(".drag-letter"), function (item) {
      var startX, startY, rect, dragging = false, overEl = null;

      function begin(e) {
        if (locked) return;
        e.preventDefault();
        JH.Audio.unlock();
        rect = item.getBoundingClientRect();
        startX = e.clientX; startY = e.clientY;
        dragging = true;
        item.classList.add("dragging");
        item.style.left = rect.left + "px";
        item.style.top = rect.top + "px";
        item.style.width = rect.width + "px";
        item.style.height = rect.height + "px";
        try { item.setPointerCapture(e.pointerId); } catch (err) {}
        JH.Audio.sfx("tap");
      }
      function move(e) {
        if (!dragging) return;
        e.preventDefault();
        item.style.left = (rect.left + (e.clientX - startX)) + "px";
        item.style.top = (rect.top + (e.clientY - startY)) + "px";
        item.style.visibility = "hidden";
        var under = document.elementFromPoint(e.clientX, e.clientY);
        item.style.visibility = "";
        var t = under && under.closest ? under.closest(".match-target") : null;
        if (t !== overEl) {
          if (overEl) overEl.classList.remove("over");
          overEl = t;
          if (overEl && !overEl.classList.contains("done")) overEl.classList.add("over");
        }
      }
      function end(e) {
        if (!dragging) return;
        dragging = false;
        item.classList.remove("dragging");
        item.style.cssText = "";
        try { item.releasePointerCapture(e.pointerId); } catch (err) {}
        if (overEl) overEl.classList.remove("over");
        var t = overEl; overEl = null;
        if (!t || t.classList.contains("done")) return;

        var L = item.dataset.letter;
        var letterObj = window.LETTER_MAP[L];
        if (t.dataset.letter === L) {
          t.classList.add("done");
          item.classList.add("used");
          solved++;
          JH.Audio.sfx("success");
          JH.Progress.recordAnswer(L, true);
          JH.UI.kiko("Tepat! " + L + " untuk " + letterObj.word + ".",
            [{ file: letterObj.audio.letter, text: letterObj.name, gap: 100 },
             { file: "kata_" + letterObj.word.toLowerCase(), text: letterObj.word }]);
          if (solved >= 3) {
            locked = true;
            correctCount++; updateScore();
            JH.Rewards.sparkle(document.getElementById("fx-global"), 8);
            setTimeout(nextRound, 1200);
          }
        } else {
          JH.Audio.sfx("oops");
          JH.Progress.recordAnswer(L, false);
          JH.UI.kiko("Belum pas. Coba lagi ya.", [{ text: "Belum pas. Coba lagi ya" }]);
        }
      }

      item.addEventListener("pointerdown", begin);
      item.addEventListener("pointermove", move);
      item.addEventListener("pointerup", end);
      item.addEventListener("pointercancel", end);

      // Alternatif keyboard (aksesibilitas)
      item.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        var L = item.dataset.letter;
        var t = targets.querySelector('.match-target[data-letter="' + L + '"]');
        if (t && !t.classList.contains("done")) {
          t.classList.add("done"); item.classList.add("used"); solved++;
          JH.Audio.sfx("success"); JH.Progress.recordAnswer(L, true);
          if (solved >= 3) { correctCount++; updateScore(); setTimeout(nextRound, 900); }
        }
      });
    });
  }

  /* ---------- mulai ---------- */
  function start(which) {
    ready();
    root = document.getElementById("screen-game");
    mode = which;
    round = 0;
    correctCount = 0;
    maxRound = which === "match" ? 4 : 8;
    var titles = { find: "Cari Huruf", initial: "Huruf Awal", match: "Pasangan" };
    JH.Nav.enter("screen-game", titles[which] || "Bermain");
    nextRound();
  }

  return { start: start };
})();
