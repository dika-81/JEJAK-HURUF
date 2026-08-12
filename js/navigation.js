/* =========================================================
   js/navigation.js — PERPINDAHAN LAYAR + UI DASAR
   Satu layar = satu tugas.
   ========================================================= */

window.JH = window.JH || {};

JH.UI = (function () {
  var bubbleEl, toastEl, toastTimer;
  var lastText = "", lastParts = null;

  /**
   * Kiko berbicara.
   * @param {string} text        kalimat pendek untuk balon dialog
   * @param {Array|false} parts  bagian audio; false = tampilkan teks saja
   */
  function kiko(text, audioParts) {
    bubbleEl = bubbleEl || document.getElementById("kiko-bubble");
    if (bubbleEl && text) bubbleEl.textContent = text;
    lastText = text || lastText;
    // `false` berarti benar-benar teks saja. Tombol ulangi tidak boleh
    // diam-diam memanggil TTS perangkat untuk pesan tanpa aset audio.
    lastParts = (audioParts === false) ? null : (audioParts || [{ text: text }]);
    if (audioParts !== false) JH.Audio.say(lastParts);
  }

  /** Tombol speaker / klik Kiko: ulangi kalimat terakhir */
  function repeat() {
    JH.Audio.unlock();
    JH.Audio.sfx("tap");
    if (lastParts) JH.Audio.say(lastParts);
  }

  function toast(text, type) {
    toastEl = toastEl || document.getElementById("toast");
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.className = "toast show " + (type || "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.className = "toast " + (type || ""); }, 2200);
  }

  function clear(el) { while (el && el.firstChild) el.removeChild(el.firstChild); }

  function h(tag, props, children) {
    var e = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (k === "class") e.className = props[k];
      else if (k === "html") e.innerHTML = props[k];
      else if (k === "text") e.textContent = props[k];
      else if (k.indexOf("on") === 0 && typeof props[k] === "function") e.addEventListener(k.slice(2), props[k]);
      else if (props[k] !== null && props[k] !== undefined) e.setAttribute(k, props[k]);
    });
    (children || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  return { kiko: kiko, repeat: repeat, toast: toast, clear: clear, h: h, shuffle: shuffle };
})();

JH.Nav = (function () {
  var stack = ["screen-home"];
  var handlers = {};
  var leaveHandlers = {};
  var currentId = "screen-home";

  function show(id, titleOverride) {
    var target = document.getElementById(id);
    if (!target) { console.warn("Layar tidak ditemukan:", id); return; }

    if (leaveHandlers[currentId]) { try { leaveHandlers[currentId](); } catch (e) { console.warn(e); } }

    Array.prototype.forEach.call(document.querySelectorAll(".screen"), function (s) {
      s.classList.toggle("is-active", s.id === id);
    });
    currentId = id;

    var title = titleOverride || target.getAttribute("data-title") || "Jejak Huruf";
    var titleEl = document.getElementById("screen-title");
    if (titleEl) titleEl.textContent = title;
    document.title = (id === "screen-home") ? "Jejak Huruf — Petualangan Baca Tulis Anak" : title + " — Jejak Huruf";

    var back = document.getElementById("btn-back");
    if (back) back.hidden = (id === "screen-home");

    try { window.scrollTo(0, 0); } catch (e) {}

    if (handlers[id]) { try { handlers[id](); } catch (e) { console.error("Gagal membuka layar " + id, e); } }
  }

  // Beberapa browser melarang History API pada protokol file://
  // Bila dilarang, navigasi tetap jalan memakai tumpukan internal.
  var historyOK = true;

  function go(id, titleOverride) {
    JH.Audio.stop();
    stack.push(id);
    if (historyOK) {
      try { history.pushState({ i: stack.length - 1 }, ""); }
      catch (e) { historyOK = false; }
    }
    show(id, titleOverride);
  }

  function back() {
    if (stack.length > 1) {
      if (historyOK) { history.back(); return; }
      stack.pop();
      show(stack[stack.length - 1]);
      return;
    }
    home();
  }

  function home() {
    JH.Audio.stop();
    stack = ["screen-home"];
    if (historyOK) { try { history.replaceState({ i: 0 }, ""); } catch (e) { historyOK = false; } }
    show("screen-home");
  }

  /** Masuk ke layar tanpa menumpuk riwayat bila sudah berada di layar itu */
  function enter(id, titleOverride) {
    if (currentId === id) { JH.Audio.stop(); show(id, titleOverride); }
    else go(id, titleOverride);
  }

  function on(id, fn) { handlers[id] = fn; }
  function onLeave(id, fn) { leaveHandlers[id] = fn; }
  function current() { return currentId; }

  function init() {
    try { history.replaceState({ i: 0 }, ""); } catch (e) { historyOK = false; }
    window.addEventListener("popstate", function () {
      JH.Audio.stop();
      if (stack.length > 1) { stack.pop(); show(stack[stack.length - 1]); }
      else show("screen-home");
    });
  }

  return { go: go, enter: enter, back: back, home: home, on: on, onLeave: onLeave, show: show, init: init, current: current };
})();
