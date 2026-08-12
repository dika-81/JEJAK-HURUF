/* =========================================================
   js/reading.js — SUKU KATA, SUSUN KATA, BACA KALIMAT
   ========================================================= */

window.JH = window.JH || {};

JH.Reading = (function () {
  var h, shuffle, root;

  function ready() {
    h = JH.UI.h; shuffle = JH.UI.shuffle;
    root = document.getElementById("screen-reading");
  }

  /* =========================================================
     1) SUKU KATA
     ========================================================= */
  function startSyllable() {
    var active = window.SYLLABLE_CONSONANTS[0].c;

    function draw() {
      JH.UI.clear(root);
      var p = JH.Progress.get();

      var tabs = h("div", { class: "syl-tabs", role: "group", "aria-label": "Pilih konsonan" },
        window.SYLLABLE_CONSONANTS.map(function (k) {
          return h("button", {
            class: "syl-tab", type: "button", text: k.c,
            "aria-pressed": String(k.c === active), "aria-label": "Suku kata dengan huruf " + k.c,
            onclick: function () { active = k.c; JH.Audio.sfx("tap"); draw(); }
          });
        }));

      var set = window.SYLLABLES.filter(function (s) { return s.c === active; });
      var grid = h("div", { class: "syl-grid" }, set.map(function (s) {
        var btn = h("button", {
          class: "syl-btn" + (p.syllables[s.id] ? " mastered" : ""),
          type: "button", "aria-label": "Suku kata " + s.id,
          onclick: function () { saySyllable(btn, s); }
        }, [h("span", { class: "merge", text: s.id })]);
        return btn;
      }));

      root.appendChild(h("p", { class: "instruction", text: "Sentuh suku kata untuk mendengarnya." }));
      root.appendChild(tabs);
      root.appendChild(grid);
    }

    function saySyllable(btn, s) {
      btn.classList.remove("merging");
      void btn.offsetWidth;              // paksa animasi diulang
      btn.classList.add("merging");
      JH.Audio.sfx("pop");
      var cLetter = window.LETTER_MAP[s.c];
      var vLetter = window.LETTER_MAP[s.v];
      JH.Audio.say([
        { file: s.c.toLowerCase(), text: cLetter ? cLetter.phonics : s.c, gap: 220 },
        { file: s.v.toLowerCase(), text: vLetter ? vLetter.phonics : s.v, gap: 220 },
        { file: s.id.toLowerCase(), text: s.id, gap: 200 },
        { file: s.id.toLowerCase(), text: s.id }
      ]);
      JH.UI.kiko(s.c + "... " + s.v + "... " + s.id + "!", false);
      JH.Progress.markSyllable(s.id);
      btn.classList.add("mastered");
    }

    JH.Nav.go("screen-reading", "Suku Kata");
    draw();
    JH.UI.kiko("Sentuh suku kata, dengarkan bunyinya.", [{ text: "Sentuh suku kata, dengarkan bunyinya" }]);
  }

  /* =========================================================
     2) SUSUN KATA (drag & drop + ketuk)
     ========================================================= */
  /* Antrian acak kata:
     - kata yang BELUM diselesaikan diprioritaskan
     - setiap kata muncul sekali dulu sebelum ada pengulangan
     - kata yang baru saja tampil tidak langsung muncul lagi        */
  var wordQueue = [];
  var lastWord = null;

  function nextWordItem() {
    var p = JH.Progress.get();
    var unfinished = window.WORDS.filter(function (w) { return !p.words[w.word]; });
    var base = unfinished.length ? unfinished : window.WORDS.slice();

    // buang isi antrian yang sudah tidak relevan (mis. sudah diselesaikan)
    wordQueue = wordQueue.filter(function (w) { return base.indexOf(w) !== -1; });

    if (!wordQueue.length) {
      wordQueue = shuffle(base);
      // hindari kata yang sama muncul dua kali berturut-turut antar siklus
      if (wordQueue.length > 1 && wordQueue[0].word === lastWord) wordQueue.push(wordQueue.shift());
    }
    var item = wordQueue.shift();
    lastWord = item.word;
    return item;
  }

  function startWord() {
    var item = nextWordItem();
    var target = item.word.split("");
    var filled = new Array(target.length).fill(null);

    JH.Nav.enter("screen-reading", "Susun Kata");
    JH.UI.clear(root);

    var pic = h("div", { class: "game-pic" });
    var stage = h("div", { class: "game-stage" }, [
      pic, h("p", { class: "game-q", text: "Susun huruf menjadi kata." })
    ]);

    var slotsWrap = h("div", { class: "word-slots" }, target.map(function (_, i) {
      return h("div", { class: "slot", "data-index": String(i), "aria-label": "Kotak huruf ke-" + (i + 1) });
    }));

    var tiles = shuffle(target.map(function (L, i) { return { L: L, id: i }; }));
    var sourceWrap = h("div", { class: "match-source" }, tiles.map(function (t) {
      return h("div", {
        class: "drag-letter", "data-letter": t.L, "data-id": String(t.id), text: t.L,
        role: "button", tabindex: "0", "aria-label": "Huruf " + t.L
      });
    }));

    var hint = h("button", {
      class: "big-btn accent wide", type: "button",
      onclick: function () { JH.Audio.say([{ file: item.audio, text: item.word }]); }
    }, [document.createTextNode("🔊 Dengar katanya")]);

    root.appendChild(stage);
    root.appendChild(slotsWrap);
    root.appendChild(sourceWrap);
    root.appendChild(h("div", { class: "row-btns", style: "margin-top:12px" }, [hint,
      h("button", { class: "big-btn soft", type: "button", onclick: startWord }, [document.createTextNode("🔁 Kata lain")])
    ]));

    JH.Illus.render(pic, { image: item.image, label: item.word });
    JH.UI.kiko("Susun huruf menjadi kata.", [{ text: "Susun huruf menjadi kata" }]);

    /* --- batas suku kata untuk pembacaan bertahap --- */
    var bounds = [], acc = 0;
    (item.syl || [item.word]).forEach(function (s) { acc += s.length; bounds.push(acc); });

    function place(tile, slot) {
      var idx = Number(slot.dataset.index);
      if (filled[idx]) return false;
      if (tile.dataset.letter !== target[idx]) {
        JH.Audio.sfx("oops");
        JH.UI.kiko("Belum pas. Coba kotak lain.", [{ text: "Belum pas. Coba kotak lain" }]);
        return false;
      }
      filled[idx] = tile.dataset.letter;
      slot.textContent = tile.dataset.letter;
      slot.classList.add("filled");
      tile.classList.add("used");
      JH.Audio.sfx("pop");
      checkSyllable(idx);
      return true;
    }

    function checkSyllable(idx) {
      // apakah satu suku kata baru saja lengkap?
      var start = 0;
      for (var b = 0; b < bounds.length; b++) {
        var end = bounds[b];
        if (idx < end) {
          var complete = true;
          for (var i = start; i < end; i++) if (!filled[i]) complete = false;
          if (complete) {
            var syl = target.slice(start, end).join("");
            var parts = target.slice(start, end).map(function (L) {
              var lo = window.LETTER_MAP[L];
              return { file: L.toLowerCase(), text: lo ? lo.phonics : L, gap: 180 };
            });
            parts.push({ file: syl.toLowerCase(), text: syl });
            JH.Audio.say(parts);
            JH.UI.kiko(target.slice(start, end).join("... ") + "... " + syl, false);
          }
          break;
        }
        start = end;
      }
      if (filled.every(Boolean)) setTimeout(done, 900);
    }

    function done() {
      JH.Progress.markWord(item.word);
      JH.Rewards.sparkle(document.getElementById("fx-global"), 10);
      JH.Rewards.confetti(document.getElementById("fx-global"), 20);
      JH.Audio.sfx("win");
      var spell = target.map(function (L) {
        var lo = window.LETTER_MAP[L];
        return { file: L.toLowerCase(), text: lo ? lo.name : L, gap: 130 };
      });
      spell.push({ file: item.audio, text: item.word, gap: 200 });
      JH.Audio.say(spell);
      JH.UI.kiko(target.join("-") + ". " + item.word + "!", false);
      JH.UI.toast("Hebat! " + item.word, "good");
      setTimeout(function () {
        if (JH.Nav.current() === "screen-reading") startWord();
      }, 3200);
    }

    /* --- interaksi: seret atau ketuk --- */
    Array.prototype.forEach.call(sourceWrap.querySelectorAll(".drag-letter"), function (tile) {
      var dragging = false, rect, sx, sy, over = null;

      tile.addEventListener("pointerdown", function (e) {
        if (tile.classList.contains("used")) return;
        e.preventDefault(); JH.Audio.unlock();
        rect = tile.getBoundingClientRect(); sx = e.clientX; sy = e.clientY; dragging = true;
        tile.classList.add("dragging");
        tile.style.left = rect.left + "px"; tile.style.top = rect.top + "px";
        tile.style.width = rect.width + "px"; tile.style.height = rect.height + "px";
        try { tile.setPointerCapture(e.pointerId); } catch (err) {}
      });
      tile.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        e.preventDefault();
        tile.style.left = (rect.left + e.clientX - sx) + "px";
        tile.style.top = (rect.top + e.clientY - sy) + "px";
        tile.style.visibility = "hidden";
        var under = document.elementFromPoint(e.clientX, e.clientY);
        tile.style.visibility = "";
        var s = under && under.closest ? under.closest(".slot") : null;
        if (s !== over) {
          if (over) over.classList.remove("over");
          over = s;
          if (over && !over.classList.contains("filled")) over.classList.add("over");
        }
      });
      function endDrag(e) {
        if (!dragging) return;
        dragging = false;
        tile.classList.remove("dragging");
        tile.style.cssText = "";
        try { tile.releasePointerCapture(e.pointerId); } catch (err) {}
        var s = over; if (over) over.classList.remove("over"); over = null;
        var moved = Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 12;
        if (s) place(tile, s);
        else if (!moved) tapPlace(tile);      // ketuk = taruh di kotak kosong pertama yang cocok
      }
      tile.addEventListener("pointerup", endDrag);
      tile.addEventListener("pointercancel", endDrag);
      tile.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tapPlace(tile); }
      });
    });

    function tapPlace(tile) {
      if (tile.classList.contains("used")) return;
      var L = tile.dataset.letter;
      var slots = slotsWrap.querySelectorAll(".slot");
      for (var i = 0; i < slots.length; i++) {
        if (!filled[i] && target[i] === L) { place(tile, slots[i]); return; }
      }
      JH.Audio.sfx("oops");
      JH.UI.kiko("Huruf itu belum dibutuhkan sekarang.", false);
    }
  }

  /* =========================================================
     3) BACA KALIMAT
     ========================================================= */
  function startSentence() {
    JH.Nav.go("screen-reading", "Baca Kalimat");
    JH.UI.clear(root);
    root.appendChild(h("p", { class: "instruction", text: "Sentuh kata untuk mendengarnya." }));

    var list = h("div", { class: "sentence-list" }, window.SENTENCES.map(function (s) {
      var words = s.text.replace(/\.$/, "").split(/\s+/);
      var chips = words.map(function (w) {
        var clean = w.replace(/[^A-Za-z]/g, "");
        return h("button", {
          class: "word-chip", type: "button", text: w, "aria-label": "Kata " + clean,
          onclick: function (e) { readWord(e.currentTarget, clean); }
        });
      });
      var card = h("div", { class: "sentence-card" }, chips.concat([
        h("button", {
          class: "sentence-play", type: "button",
          onclick: function () { readAll(chips, words, s); }
        }, [document.createTextNode("🔊 Bacakan kalimat")])
      ]));
      return card;
    }));
    root.appendChild(list);
    JH.UI.kiko("Sentuh kata untuk mendengarnya.", [{ text: "Sentuh kata untuk mendengarnya" }]);
  }

  function readWord(chip, word) {
    document.querySelectorAll(".word-chip.on").forEach(function (c) { c.classList.remove("on"); });
    chip.classList.add("on");
    JH.Audio.sfx("tap");
    JH.Audio.say([{ file: word.toLowerCase(), text: word }]);
    setTimeout(function () { chip.classList.remove("on"); }, 1200);
  }

  function readAll(chips, words, sentence) {
    JH.Audio.stop();
    JH.Progress.addSentence();
    var i = 0;
    (function step() {
      chips.forEach(function (c) { c.classList.remove("on"); });
      if (i >= chips.length) {
        JH.Audio.sfx("success");
        return;
      }
      chips[i].classList.add("on");
      var clean = words[i].replace(/[^A-Za-z]/g, "");
      JH.Audio.say([{ file: clean.toLowerCase(), text: clean }]).then(function () {
        i++;
        setTimeout(step, 120);
      });
    })();
  }

  function start(which) {
    ready();
    if (which === "syllable") startSyllable();
    else if (which === "word") startWord();
    else startSentence();
  }

  return { start: start };
})();
