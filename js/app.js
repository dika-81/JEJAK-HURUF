/* =========================================================
   js/app.js — PENGIKAT SELURUH MODUL
   ========================================================= */

(function () {
  "use strict";

  var h;
  var letterIndex = 0;

  /* ---------------- ALFABET ---------------- */
  function buildAlphabet(containerId, onPick) {
    var box = document.getElementById(containerId);
    if (!box) return;
    JH.UI.clear(box);
    window.LETTERS.forEach(function (L, i) {
      var btn = JH.UI.h("button", {
        class: "letter-btn c" + (i % 6),
        type: "button",
        role: "listitem",
        "aria-label": "Huruf " + L.letter + ", contoh kata " + L.word,
        onclick: function () {
          btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
          JH.Audio.unlock();
          onPick(i, L);
        }
      }, [document.createTextNode(L.letter)]);
      box.appendChild(btn);
    });
    refreshBadges(containerId);
  }

  /** Tanda bintang pada huruf yang sudah dikuasai */
  function refreshBadges(containerId) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var p = JH.Progress.get();
    Array.prototype.forEach.call(box.children, function (btn, i) {
      var L = window.LETTERS[i];
      if (!L) return;
      var old = btn.querySelector(".badge");
      if (old) old.remove();
      var mark = "";
      if (containerId === "trace-grid") mark = p.written[L.letter] ? "⭐" : (p.bestScore[L.letter] ? "•" : "");
      else mark = p.recognized[L.letter] ? "⭐" : (p.learned[L.letter] ? "•" : "");
      if (mark) {
        var s = document.createElement("span");
        s.className = "badge";
        s.setAttribute("aria-hidden", "true");
        s.textContent = mark;
        btn.appendChild(s);
      }
    });
  }

  /* ---------------- DETAIL HURUF ---------------- */
  function openLetter(i) {
    letterIndex = (i + window.LETTERS.length) % window.LETTERS.length;
    var L = window.LETTERS[letterIndex];

    var big = document.getElementById("letter-big");
    var pic = document.getElementById("letter-pic");
    var word = document.getElementById("letter-word");

    big.textContent = L.letter;
    big.classList.remove("big-letter"); void big.offsetWidth; big.classList.add("big-letter");
    word.textContent = L.word;
    JH.Illus.render(pic, { image: L.image, label: L.word });

    JH.Progress.markLearned(L.letter);
    sayLetter(L);
    var titleEl = document.getElementById("screen-title");
    if (titleEl) titleEl.textContent = "Huruf " + L.letter;
  }

  function sayLetter(L) {
    JH.UI.kiko(L.letter + "... " + L.letter + " seperti " + L.word + ".", [
      { file: L.audio.letter, text: L.name, gap: 260 },
      { file: L.audio.word, text: L.name + " seperti " + L.word }
    ]);
  }

  /* ---------------- KAMPUNG HURUFKU ---------------- */
  function renderVillage() {
    JH.Rewards.renderVillage(document.getElementById("village"));
    var s = JH.Progress.summary();
    var info = document.getElementById("village-info");
    if (info) info.textContent = "Kamu punya " + s.rewards + " dari " + s.total + " hadiah.";
    JH.UI.kiko(s.rewards === 0
      ? "Tulis huruf dengan benar untuk mendapat hadiah!"
      : "Lihat, kampungmu makin ramai!", false);
  }

  /* ---------------- AREA ORANG TUA / GURU ---------------- */
  function renderParent() {
    var root = document.getElementById("screen-parent");
    var p = JH.Progress.get();
    var s = JH.Progress.summary();
    h = JH.UI.h;
    JH.UI.clear(root);

    function bar(label, value, total, cls) {
      return JH.UI.h("div", {}, [
        JH.UI.h("div", { class: "stat-row" }, [
          JH.UI.h("span", { text: label }),
          JH.UI.h("small", { text: value + " / " + total })
        ]),
        JH.UI.h("div", { class: "bar " + (cls || "") }, [
          JH.UI.h("i", { style: "width:" + Math.round((value / total) * 100) + "%" })
        ])
      ]);
    }

    var stats = JH.UI.h("div", { class: "stat-card" }, [
      bar("Huruf dikenali", s.recognized, s.total, ""),
      bar("Huruf dapat ditulis", s.written, s.total, "blue"),
      bar("Suku kata dikuasai", s.syllables, window.SYLLABLES.length, "green"),
      JH.UI.h("div", { class: "stat-row" }, [
        JH.UI.h("span", { text: "Latihan menulis selesai" }),
        JH.UI.h("small", { text: String(s.practiceCount) })
      ]),
      JH.UI.h("div", { class: "stat-row" }, [
        JH.UI.h("span", { text: "Kata selesai disusun" }),
        JH.UI.h("small", { text: String(s.words) })
      ]),
      JH.UI.h("div", { class: "stat-row" }, [
        JH.UI.h("span", { text: "Kalimat dibaca" }),
        JH.UI.h("small", { text: String(s.sentences) })
      ]),
      JH.UI.h("div", { class: "stat-row" }, [
        JH.UI.h("span", { text: "Hadiah Kampung Hurufku" }),
        JH.UI.h("small", { text: s.rewards + " / " + s.total })
      ])
    ]);

    var need = s.needPractice.length
      ? s.needPractice.map(function (L) { return JH.UI.h("span", { class: "chip", text: L }); })
      : [JH.UI.h("span", { class: "chip ok", text: "Belum ada — semua lancar" })];

    var needCard = JH.UI.h("div", { class: "stat-card" }, [
      JH.UI.h("div", { class: "stat-row" }, [JH.UI.h("span", { text: "Huruf perlu latihan" })]),
      JH.UI.h("div", { class: "chips" }, need),
      JH.UI.h("p", { class: "note", text: "Huruf ini otomatis lebih sering muncul di permainan." })
    ]);

    function toggle(label, key, onChange) {
      var sw = JH.UI.h("div", {
        class: "switch", role: "switch", tabindex: "0",
        "aria-checked": String(!!p.settings[key]), "aria-label": label
      });
      function flip() {
        var v = sw.getAttribute("aria-checked") !== "true";
        sw.setAttribute("aria-checked", String(v));
        JH.Progress.setSetting(key, v);
        onChange(v);
        JH.Audio.sfx("tap");
      }
      sw.addEventListener("click", flip);
      sw.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
      });
      return JH.UI.h("div", { class: "switch-row" }, [JH.UI.h("span", { text: label }), sw]);
    }

    var settingsCard = JH.UI.h("div", { class: "stat-card" }, [
      toggle("Suara", "sound", function (v) { JH.Audio.setSound(v); }),
      toggle("Kurangi animasi", "reduceMotion", function (v) {
        document.body.classList.toggle("reduce-motion", v);
      }),
      JH.UI.h("p", { class: "note", text: "Suara memakai rekaman di folder assets/audio bila tersedia, jika belum ada aplikasi memakai suara bawaan perangkat (Text-to-Speech)." })
    ]);

    var resetBtn = JH.UI.h("button", {
      class: "danger-btn", type: "button",
      onclick: function () {
        if (confirm("Hapus semua progres anak? Tindakan ini tidak dapat dibatalkan.")) {
          JH.Progress.resetProgress();
          document.body.classList.remove("reduce-motion");
          JH.Audio.setSound(true);
          refreshBadges("listen-grid"); refreshBadges("trace-grid");
          renderParent();
          JH.UI.toast("Progres sudah direset.", "info");
        }
      }
    }, [document.createTextNode("🗑️ Reset Progres")]);

    var about = JH.UI.h("p", { class: "note", style: "margin-top:14px", text:
      "Data disimpan hanya di perangkat ini (localStorage). Tidak ada login dan tidak ada data yang dikirim ke internet." });

    root.appendChild(stats);
    root.appendChild(needCard);
    root.appendChild(settingsCard);
    root.appendChild(JH.UI.h("div", { class: "stat-card" }, [resetBtn, about]));
  }

  /* ---------------- INISIALISASI ---------------- */
  function init() {
    h = JH.UI.h;

    // 1. progres & pengaturan
    var p = JH.Progress.loadProgress();
    document.body.classList.toggle("reduce-motion", !!p.settings.reduceMotion);
    JH.Audio.setSound(p.settings.sound !== false);

    // 2. navigasi
    JH.Nav.init();
    document.getElementById("btn-back").addEventListener("click", function () {
      JH.Audio.sfx("tap"); JH.Nav.back();
    });
    document.getElementById("btn-repeat").addEventListener("click", function () { JH.UI.repeat(); });
    document.getElementById("kiko").addEventListener("click", function () {
      JH.Audio.unlock(); JH.UI.repeat();
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-go]"), function (btn) {
      btn.addEventListener("click", function () {
        JH.Audio.unlock(); JH.Audio.sfx("tap");
        JH.Nav.go(btn.dataset.go);
      });
    });

    // 3. alfabet
    buildAlphabet("listen-grid", function (i) {
      JH.Nav.go("screen-letter", "Huruf " + window.LETTERS[i].letter);
      openLetter(i);
    });
    buildAlphabet("trace-grid", function (i) {
      JH.Nav.go("screen-canvas", "Tulis " + window.LETTERS[i].letter);
      JH.Tracing.relayout();
      JH.Tracing.open(window.LETTERS[i]);
    });

    // 4. detail huruf
    document.getElementById("letter-play").addEventListener("click", function () {
      sayLetter(window.LETTERS[letterIndex]);
    });
    document.getElementById("letter-trace").addEventListener("click", function () {
      JH.Nav.go("screen-canvas", "Tulis " + window.LETTERS[letterIndex].letter);
      JH.Tracing.relayout();
      JH.Tracing.open(window.LETTERS[letterIndex]);
    });
    document.getElementById("letter-prev").addEventListener("click", function () { openLetter(letterIndex - 1); });
    document.getElementById("letter-next").addEventListener("click", function () { openLetter(letterIndex + 1); });

    // 5. tracing engine
    JH.Tracing.init();

    // 6. permainan & membaca
    Array.prototype.forEach.call(document.querySelectorAll("[data-game]"), function (btn) {
      btn.addEventListener("click", function () {
        JH.Audio.unlock(); JH.Audio.sfx("tap");
        JH.Games.start(btn.dataset.game);
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-read]"), function (btn) {
      btn.addEventListener("click", function () {
        JH.Audio.unlock(); JH.Audio.sfx("tap");
        JH.Reading.start(btn.dataset.read);
      });
    });

    // 7. layar yang perlu digambar ulang saat dibuka
    JH.Nav.on("screen-village", renderVillage);
    JH.Nav.on("screen-parent", renderParent);
    JH.Nav.on("screen-listen", function () {
      refreshBadges("listen-grid");
      JH.UI.kiko("Sentuh huruf untuk mendengarnya.", [{ text: "Sentuh huruf untuk mendengarnya" }]);
    });
    JH.Nav.on("screen-trace", function () {
      refreshBadges("trace-grid");
      JH.UI.kiko("Pilih huruf yang ingin kamu tulis.", [{ text: "Pilih huruf yang ingin kamu tulis" }]);
    });
    JH.Nav.on("screen-canvas", function () { JH.Tracing.relayout(); });
    JH.Nav.on("screen-home", function () {
      JH.UI.kiko("Hai! Mau belajar apa hari ini?", false);
    });
    JH.Nav.on("screen-play", function () { JH.UI.kiko("Pilih permainan.", false); });
    JH.Nav.on("screen-read", function () { JH.UI.kiko("Ayo mulai membaca.", false); });

    // 8. progres berubah -> perbarui lencana
    JH.Progress.onChange(function () {
      refreshBadges("listen-grid");
      refreshBadges("trace-grid");
    });

    // 9. buka audio pada sentuhan pertama (kebijakan autoplay browser)
    var unlockOnce = function () {
      JH.Audio.unlock();
      window.removeEventListener("pointerdown", unlockOnce);
      window.removeEventListener("keydown", unlockOnce);
    };
    window.addEventListener("pointerdown", unlockOnce);
    window.addEventListener("keydown", unlockOnce);

    // 10. sapaan awal
    JH.UI.kiko("Hai! Aku Kiko. Ayo belajar huruf!", false);

    // 11. PWA (opsional — aplikasi tetap jalan bila gagal)
    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("./service-worker.js").catch(function (e) {
          console.info("[JejakHuruf] Service worker tidak aktif:", e && e.message);
        });
      });
    }

    console.info("%cJejak Huruf siap 🎉", "color:#FB8500;font-weight:bold");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
