/* =========================================================
   js/rewards.js — "TINTA AJAIB" + KAMPUNG HURUFKU
   ---------------------------------------------------------
   Arsitektur modular: animasi hadiah per huruf didaftarkan
   lewat JH.Rewards.registerMagic("S", fn). Menambah animasi baru
   TIDAK perlu mengubah engine tracing.
   ========================================================= */

window.JH = window.JH || {};

JH.Rewards = (function () {
  var MAGIC = {};

  function reduced() {
    return document.body.classList.contains("reduce-motion");
  }

  function el(tag, cls, style) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (style) Object.assign(e.style, style);
    return e;
  }

  function animate(node, frames, opts) {
    if (reduced() || !node.animate) {
      setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 300);
      return;
    }
    var a = node.animate(frames, opts);
    a.onfinish = function () { if (node.parentNode) node.parentNode.removeChild(node); };
  }

  /* ---------------- EFEK DASAR (MVP) ---------------- */

  function sparkle(layer, count) {
    if (!layer) return;
    var n = reduced() ? 3 : (count || 12);
    for (var i = 0; i < n; i++) {
      var s = el("span", "spark", {
        left: (10 + Math.random() * 80) + "%",
        top: (20 + Math.random() * 60) + "%",
        animationDelay: (Math.random() * 0.4) + "s"
      });
      s.textContent = ["✨", "⭐", "💫"][i % 3];
      layer.appendChild(s);
      (function (node) { setTimeout(function () { node.remove(); }, 1500); })(s);
    }
    JH.Audio.sfx("sparkle");
  }

  function confetti(layer, count) {
    if (!layer || reduced()) return;
    var colors = ["#FFB703", "#FB8500", "#219EBC", "#EF6F6C", "#57A773", "#9B6BC9"];
    var n = count || 26;
    for (var i = 0; i < n; i++) {
      var c = el("i", "confetti", {
        left: (Math.random() * 100) + "%",
        top: "-20px",
        background: colors[i % colors.length],
        animationDelay: (Math.random() * 0.5) + "s"
      });
      layer.appendChild(c);
      (function (node) { setTimeout(function () { node.remove(); }, 2200); })(c);
    }
  }

  function bounceLetter(layer, letter) {
    if (!layer) return;
    var b = el("div", null, {
      position: "absolute", left: "50%", top: "50%",
      transform: "translate(-50%,-50%)",
      fontSize: "min(34vw,190px)", fontWeight: "900",
      color: "rgba(87,167,115,.35)", pointerEvents: "none"
    });
    b.textContent = letter;
    layer.appendChild(b);
    animate(b, [
      { transform: "translate(-50%,-50%) scale(.4)", opacity: 0 },
      { transform: "translate(-50%,-62%) scale(1.15)", opacity: 1, offset: 0.45 },
      { transform: "translate(-50%,-50%) scale(1)", opacity: 0 }
    ], { duration: 1200, easing: "cubic-bezier(.34,1.56,.64,1)" });
  }

  /* ---------------- ANIMASI KHUSUS PER HURUF ---------------- */

  function flyer(layer, emoji, frames, dur) {
    var f = el("div", null, {
      position: "absolute", fontSize: "48px", left: "0", top: "50%", pointerEvents: "none"
    });
    f.textContent = emoji;
    layer.appendChild(f);
    animate(f, frames, { duration: dur || 1800, easing: "ease-in-out" });
  }

  function registerMagic(letter, fn) { MAGIC[letter.toUpperCase()] = fn; }

  registerMagic("S", function (layer) {   // S -> ular meliuk
    flyer(layer, "🐍", [
      { transform: "translate(-60px,0) rotate(0deg)" },
      { transform: "translate(30vw,-40px) rotate(12deg)", offset: .33 },
      { transform: "translate(60vw,30px) rotate(-12deg)", offset: .66 },
      { transform: "translate(110%,0) rotate(0deg)" }
    ], 2200);
  });
  registerMagic("I", function (layer) {   // I -> ikan berenang
    flyer(layer, "🐟", [
      { transform: "translate(-60px,20px)" },
      { transform: "translate(50vw,-30px)", offset: .5 },
      { transform: "translate(110%,20px)" }
    ], 2000);
  });
  registerMagic("B", function (layer) {   // B -> balon naik
    ["🎈", "🎈", "🎈"].forEach(function (e, i) {
      var b = el("div", null, { position: "absolute", fontSize: "44px", left: (18 + i * 28) + "%", top: "80%" });
      b.textContent = e;
      layer.appendChild(b);
      animate(b, [
        { transform: "translateY(0) rotate(-6deg)", opacity: 1 },
        { transform: "translateY(-110%) rotate(8deg)", opacity: 0 }
      ], { duration: 1800 + i * 250, easing: "ease-out" });
    });
  });
  registerMagic("A", function (layer) {   // A -> semut berbaris
    ["🐜", "🐜", "🐜"].forEach(function (e, i) {
      var b = el("div", null, { position: "absolute", fontSize: "30px", left: "-40px", top: "68%" });
      b.textContent = e;
      layer.appendChild(b);
      animate(b, [
        { transform: "translateX(0)" }, { transform: "translateX(120vw)" }
      ], { duration: 2400, delay: i * 320, easing: "linear", fill: "forwards" });
    });
  });
  registerMagic("K", function (layer) {   // K -> kucing melompat
    var c = el("div", null, { position: "absolute", fontSize: "56px", left: "50%", top: "60%", transform: "translateX(-50%)" });
    c.textContent = "🐱";
    layer.appendChild(c);
    animate(c, [
      { transform: "translate(-50%,60px) scale(.5)", opacity: 0 },
      { transform: "translate(-50%,-20px) scale(1.1)", opacity: 1, offset: .5 },
      { transform: "translate(-50%,0) scale(1)", opacity: 0 }
    ], { duration: 1600 });
  });
  registerMagic("U", function (layer) {   // U -> payung jatuh perlahan
    flyer(layer, "☂️", [
      { transform: "translate(40vw,-60px) rotate(-10deg)" },
      { transform: "translate(46vw,80%) rotate(10deg)" }
    ], 2000);
  });
  registerMagic("O", function (layer) {   // O -> gelembung
    for (var i = 0; i < 5; i++) {
      var b = el("div", null, { position: "absolute", fontSize: (22 + i * 6) + "px", left: (15 + i * 16) + "%", top: "85%" });
      b.textContent = "🫧";
      layer.appendChild(b);
      animate(b, [{ transform: "translateY(0)", opacity: .9 }, { transform: "translateY(-90%)", opacity: 0 }],
        { duration: 1700 + i * 200, easing: "ease-out" });
    }
  });

  /**
   * Rayakan keberhasilan menulis satu huruf.
   * @param {HTMLElement} layer  lapisan efek (.fx-layer)
   * @param {string} letter
   * @param {number} score 0-100
   */
  function celebrate(layer, letter, score) {
    if (!layer) return;
    bounceLetter(layer, letter);
    sparkle(layer, score >= 80 ? 16 : 10);
    if (score >= 80) confetti(layer, 30);
    var fn = MAGIC[String(letter).toUpperCase()];
    if (fn) { try { fn(layer, letter); } catch (e) { console.warn("Magic error", e); } }
    JH.Audio.sfx(score >= 80 ? "win" : "success");
  }

  /* ---------------- KAMPUNG HURUFKU ---------------- */

  /** Berikan hadiah huruf. Mengembalikan objek hadiah bila baru. */
  function grantForLetter(letter) {
    var L = window.LETTER_MAP[letter];
    if (!L || !L.reward) return null;
    var isNew = JH.Progress.addReward(L.reward.id);
    return isNew ? L.reward : null;
  }

  function renderVillage(container) {
    if (!container) return;
    var p = JH.Progress.get();
    container.innerHTML = "";
    (window.LETTERS || []).forEach(function (L) {
      var unlocked = !!p.rewards[L.reward.id];
      var item = document.createElement("div");
      item.className = "village-item" + (unlocked ? "" : " locked");
      item.setAttribute("role", "img");
      item.setAttribute("aria-label", unlocked
        ? L.reward.name + ", sudah didapat dari huruf " + L.letter
        : "Belum didapat: hadiah huruf " + L.letter);
      var pic = document.createElement("div");
      pic.innerHTML = unlocked
        ? JH.Illus.svg(L.reward.id, L.reward.name)
        : JH.Illus.svg(L.reward.id, L.reward.name);
      var cap = document.createElement("span");
      cap.textContent = unlocked ? L.reward.name : "🔒 " + L.letter;
      item.appendChild(pic);
      item.appendChild(cap);
      container.appendChild(item);
    });
  }

  return {
    celebrate: celebrate, sparkle: sparkle, confetti: confetti,
    registerMagic: registerMagic, grantForLetter: grantForLetter,
    renderVillage: renderVillage
  };
})();
