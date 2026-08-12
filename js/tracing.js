/* =========================================================
   js/tracing.js — JEJAK HURUF (CANVAS + POINTER EVENTS)
   ---------------------------------------------------------
   • Bekerja dengan jari (touchscreen), stylus, dan tetikus.
   • Penilaian geometris sederhana (tanpa AI):
       - jalur huruf diubah menjadi titik-titik waypoint berurutan
       - waypoint dianggap "terlewati" bila goresan anak masuk
         dalam radius toleransi (dibuat longgar untuk anak)
       - skor = persentase waypoint yang terlewati
   • Tiga tingkat bantuan (progressively fading guidance).
   ========================================================= */

window.JH = window.JH || {};

JH.Tracing = (function () {
  var SVG_NS = "http://www.w3.org/2000/svg";

  // --- konstanta dalam satuan kotak 0..100 ---
  var WAYPOINT_STEP = 6;    // jarak antar waypoint
  var TOLERANCE = 10;       // radius toleransi (longgar, anak-anak)
  var LOOKAHEAD = 5;        // boleh melompati beberapa waypoint
  var INK_WIDTH = 7;
  var GUIDE_WIDTH = 13;

  var canvas, ctx, wrap, fx, bar, hiddenSvg;
  var dpr = 1, size = 300, pad = 0, scale = 1, ox = 0, oy = 0;

  var st = {
    letter: null,     // objek huruf dari data/letters.js
    level: 1,
    strokes: [],      // [{pts:[{x,y}..], cursor:int, visited:[bool]}]
    ink: [],          // goresan anak (koordinat 0..100)
    cur: null,        // goresan yang sedang dibuat
    active: 0,        // indeks stroke yang sedang dikerjakan
    finished: false,
    drawing: false
  };

  /* ---------------- util ---------------- */
  function ensureSvg() {
    if (!hiddenSvg) {
      hiddenSvg = document.createElementNS(SVG_NS, "svg");
      hiddenSvg.setAttribute("width", "0");
      hiddenSvg.setAttribute("height", "0");
      hiddenSvg.setAttribute("aria-hidden", "true");
      hiddenSvg.style.cssText = "position:absolute;left:-9999px;top:0;width:0;height:0;overflow:hidden";
      document.body.appendChild(hiddenSvg);
    }
    return hiddenSvg;
  }

  /** Ubah path SVG (kotak 0..100) menjadi deretan waypoint berurutan */
  function samplePath(d) {
    var svg = ensureSvg();
    var p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d", d);
    svg.appendChild(p);
    var pts = [], len = 0;
    try {
      len = p.getTotalLength();
      var n = Math.max(2, Math.round(len / WAYPOINT_STEP));
      for (var i = 0; i <= n; i++) {
        var q = p.getPointAtLength((len * i) / n);
        pts.push({ x: q.x, y: q.y });
      }
    } catch (e) {
      console.warn("[JejakHuruf] Gagal membaca path huruf:", d, e);
      pts = [{ x: 20, y: 20 }, { x: 80, y: 80 }];
    }
    svg.removeChild(p);
    return { pts: pts, len: len, d: d };
  }

  function dist2(a, b) { var dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy; }

  /* ---------------- layout & skala ---------------- */
  function layout() {
    if (!canvas || !wrap) return;
    var r = wrap.getBoundingClientRect();
    var w = Math.max(120, Math.round(r.width));
    var h = Math.max(120, Math.round(r.height));
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    size = Math.min(w, h);
    pad = size * 0.11;
    scale = (size - pad * 2) / 100;
    ox = (w - 100 * scale) / 2;
    oy = (h - 100 * scale) / 2;
  }

  function toCanvas(p) { return { x: ox + p.x * scale, y: oy + p.y * scale }; }
  function toModel(cx, cy) { return { x: (cx - ox) / scale, y: (cy - oy) / scale }; }

  /* ---------------- menggambar ---------------- */
  function drawGuideLines() {
    ctx.save();
    ctx.strokeStyle = "rgba(33,158,188,.18)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 8]);
    [10, 50, 90].forEach(function (y) {
      var a = toCanvas({ x: 0, y: y }), b = toCanvas({ x: 100, y: y });
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    ctx.restore();
  }

  function pathFromPts(pts) {
    ctx.beginPath();
    pts.forEach(function (p, i) {
      var c = toCanvas(p);
      if (i === 0) ctx.moveTo(c.x, c.y); else ctx.lineTo(c.x, c.y);
    });
  }

  function drawGhost(alpha, widthUnits, dashed) {
    ctx.save();
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(120,120,120," + alpha + ")";
    ctx.lineWidth = widthUnits * scale;
    if (dashed) ctx.setLineDash([10 * scale, 9 * scale]);
    st.strokes.forEach(function (s) { pathFromPts(s.pts); ctx.stroke(); });
    ctx.restore();
  }

  function drawArrow(s, idx) {
    var pts = s.pts;
    var i = Math.min(Math.max(1, Math.round(pts.length * 0.18)), pts.length - 2);
    var a = toCanvas(pts[i - 1]), b = toCanvas(pts[i + 1]);
    var ang = Math.atan2(b.y - a.y, b.x - a.x);
    var m = toCanvas(pts[i]);
    var sz = 9 * scale;
    ctx.save();
    ctx.translate(m.x, m.y); ctx.rotate(ang);
    ctx.fillStyle = "rgba(251,133,0,.9)";
    ctx.beginPath();
    ctx.moveTo(sz, 0); ctx.lineTo(-sz * 0.7, sz * 0.62); ctx.lineTo(-sz * 0.7, -sz * 0.62);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawStartDot(s, idx, withNumber) {
    var c = toCanvas(s.pts[0]);
    var r = 9 * scale;
    var done = s.cursor >= s.pts.length;
    ctx.save();
    ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
    ctx.fillStyle = done ? "#57A773" : (idx === st.active ? "#FB8500" : "rgba(251,133,0,.35)");
    ctx.fill();
    if (idx === st.active && !done) {
      ctx.beginPath(); ctx.arc(c.x, c.y, r * 1.55, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(251,133,0,.45)"; ctx.lineWidth = 3; ctx.stroke();
    }
    if (withNumber) {
      ctx.fillStyle = "#fff";
      ctx.font = "700 " + Math.round(11 * scale) + "px system-ui, sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(String(idx + 1), c.x, c.y + 0.5);
    }
    ctx.restore();
  }

  function drawWaypoints() {
    ctx.save();
    st.strokes.forEach(function (s) {
      s.pts.forEach(function (p, i) {
        if (i % 2) return;
        var c = toCanvas(p);
        ctx.beginPath();
        ctx.arc(c.x, c.y, 2.2 * scale, 0, Math.PI * 2);
        ctx.fillStyle = s.visited[i] ? "rgba(87,167,115,.85)" : "rgba(0,0,0,.13)";
        ctx.fill();
      });
    });
    ctx.restore();
  }

  function drawCornerHint() {
    // Level 3: contoh huruf kecil di sudut
    ctx.save();
    var s2 = scale * 0.26;
    ctx.translate(8, 8);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(33,41,55,.28)";
    ctx.lineWidth = 9 * s2;
    st.strokes.forEach(function (s) {
      ctx.beginPath();
      s.pts.forEach(function (p, i) {
        var x = p.x * s2, y = p.y * s2;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawInk() {
    ctx.save();
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = "#126782";
    ctx.lineWidth = INK_WIDTH * scale;
    var all = st.ink.concat(st.cur ? [st.cur] : []);
    all.forEach(function (path) {
      if (path.length === 1) {
        var c = toCanvas(path[0]);
        ctx.beginPath(); ctx.arc(c.x, c.y, INK_WIDTH * scale / 2, 0, Math.PI * 2);
        ctx.fillStyle = "#126782"; ctx.fill();
        return;
      }
      pathFromPts(path); ctx.stroke();
    });
    ctx.restore();
  }

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGuideLines();

    if (st.level === 1) {
      drawGhost(0.16, GUIDE_WIDTH, false);
      drawWaypoints();
      st.strokes.forEach(function (s, i) {
        if (s.cursor < s.pts.length) drawArrow(s, i);
        drawStartDot(s, i, true);
      });
    } else if (st.level === 2) {
      drawGhost(0.13, GUIDE_WIDTH * 0.55, true);
      drawWaypoints();
      st.strokes.forEach(function (s, i) { drawStartDot(s, i, false); });
    } else {
      drawCornerHint();
    }

    drawInk();
    updateBar();
  }

  /* ---------------- penilaian ---------------- */
  function totals() {
    var total = 0, hit = 0;
    st.strokes.forEach(function (s) {
      total += s.pts.length;
      s.visited.forEach(function (v) { if (v) hit++; });
    });
    return { total: total || 1, hit: hit };
  }

  function score() {
    var t = totals();
    return Math.round((t.hit / t.total) * 100);
  }

  function updateBar() {
    if (!bar) return;
    bar.style.width = Math.min(100, score()) + "%";
  }

  /** Cek apakah titik goresan menyentuh waypoint berikutnya */
  function checkHit(p) {
    var tol2 = TOLERANCE * TOLERANCE;
    var s = st.strokes[st.active];
    if (!s) return;
    var advanced = false;
    for (var k = s.cursor; k < Math.min(s.pts.length, s.cursor + LOOKAHEAD); k++) {
      if (dist2(p, s.pts[k]) <= tol2) {
        for (var j = s.cursor; j <= k; j++) s.visited[j] = true;
        s.cursor = k + 1;
        advanced = true;
      }
    }
    if (advanced && s.cursor >= s.pts.length) strokeComplete();
  }

  function strokeComplete() {
    JH.Audio.sfx("pop");
    // pindah ke goresan berikutnya yang belum selesai
    var next = -1;
    for (var i = 0; i < st.strokes.length; i++) {
      if (st.strokes[i].cursor < st.strokes[i].pts.length) { next = i; break; }
    }
    if (next === -1) {
      st.active = st.strokes.length;
      setTimeout(finish, 350);
    } else {
      st.active = next;
      if (st.strokes.length > 1) {
        JH.UI.kiko("Bagus! Sekarang garis nomor " + (next + 1) + ".", [{ text: "Bagus! Sekarang garis nomor " + (next + 1) }]);
      }
    }
  }

  /** Pilih goresan terdekat saat anak mulai menggores */
  function chooseStroke(p) {
    var best = -1, bestD = Infinity;
    st.strokes.forEach(function (s, i) {
      if (s.cursor >= s.pts.length) return;
      var d = dist2(p, s.pts[s.cursor]);
      if (d < bestD) { bestD = d; best = i; }
    });
    if (best >= 0 && bestD <= (TOLERANCE * 2.6) * (TOLERANCE * 2.6)) st.active = best;
  }

  /* ---------------- pointer events ---------------- */
  function pos(e) {
    var r = canvas.getBoundingClientRect();
    return toModel(e.clientX - r.left, e.clientY - r.top);
  }

  function onDown(e) {
    if (st.finished) return;
    e.preventDefault();
    JH.Audio.unlock();
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    st.drawing = true;
    var p = pos(e);
    chooseStroke(p);
    st.cur = [p];
    checkHit(p);
    render();
  }

  function onMove(e) {
    if (!st.drawing || !st.cur) return;
    e.preventDefault();
    var events = (e.getCoalescedEvents && e.getCoalescedEvents()) || [e];
    for (var i = 0; i < events.length; i++) {
      var p = pos(events[i]);
      var last = st.cur[st.cur.length - 1];
      if (!last || dist2(last, p) > 0.35) { st.cur.push(p); checkHit(p); }
    }
    render();
  }

  function onUp(e) {
    if (!st.drawing) return;
    st.drawing = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch (err) {}
    if (st.cur && st.cur.length) st.ink.push(st.cur);
    st.cur = null;
    // Goresan hampir selesai dianggap selesai (toleransi untuk anak)
    var s = st.strokes[st.active];
    if (s && s.cursor >= Math.floor(s.pts.length * 0.85) && s.cursor < s.pts.length) {
      for (var i = s.cursor; i < s.pts.length; i++) s.visited[i] = true;
      s.cursor = s.pts.length;
      strokeComplete();
    }
    render();
  }

  /* ---------------- selesai & umpan balik ---------------- */
  var lastFinishAt = 0;
  function finish() {
    var now = Date.now();
    if (now - lastFinishAt < 1500) return;   // cegah penilaian ganda
    lastFinishAt = now;
    var sc = score();
    var msg, tone;
    if (sc >= 80) { msg = "Wah, sangat bagus!"; tone = "good"; }
    else if (sc >= 60) { msg = "Bagus! Sedikit lagi."; tone = "good"; }
    else { msg = "Ayo coba lagi dari titik yang bercahaya."; tone = "info"; }

    JH.Progress.markWritten(st.letter.letter, sc);
    JH.UI.kiko(msg, [{ text: msg }]);
    JH.UI.toast(msg + "  " + sc + "%", tone);

    if (sc >= 60) {
      JH.Rewards.celebrate(fx, st.letter.letter, sc);
      var reward = JH.Rewards.grantForLetter(st.letter.letter);
      if (reward) {
        setTimeout(function () {
          JH.UI.toast("Hadiah baru: " + reward.name + " 🎁", "good");
        }, 1600);
      }
    } else {
      JH.Audio.sfx("oops");
    }
    render();
  }

  /* ---------------- API ---------------- */
  function reset() {
    st.ink = []; st.cur = null; st.drawing = false; st.finished = false;
    st.strokes.forEach(function (s) { s.cursor = 0; s.visited = s.pts.map(function () { return false; }); });
    st.active = 0;
    render();
  }

  function setLevel(n) {
    st.level = n;
    Array.prototype.forEach.call(document.querySelectorAll(".lvl"), function (b) {
      b.setAttribute("aria-pressed", String(Number(b.dataset.level) === n));
    });
    reset();
  }

  function open(letterObj, level) {
    st.letter = letterObj;
    st.level = level || st.level || 1;
    st.strokes = (letterObj.strokes || []).map(function (d) {
      var s = samplePath(d);
      s.cursor = 0;
      s.visited = s.pts.map(function () { return false; });
      return s;
    });
    layout();
    reset();
    setLevel(st.level);
    JH.Progress.markLearned(letterObj.letter);
    var say = "Ikuti garis huruf " + letterObj.letter + ". Mulai dari titik yang bercahaya.";
    JH.UI.kiko(say, [{ text: "Ayo tulis huruf" }, { file: letterObj.audio.letter, text: letterObj.name, gap: 150 },
                     { text: "Ikuti garis, mulai dari titik yang bercahaya" }]);
  }

  function init() {
    canvas = document.getElementById("trace-canvas");
    wrap = document.getElementById("canvas-wrap");
    fx = document.getElementById("fx-layer");
    bar = document.getElementById("trace-bar");
    if (!canvas) return;

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", function (e) { if (st.drawing) onUp(e); });
    // cegah scroll/zoom saat menulis
    canvas.addEventListener("touchstart", function (e) { e.preventDefault(); }, { passive: false });
    canvas.addEventListener("touchmove", function (e) { e.preventDefault(); }, { passive: false });

    Array.prototype.forEach.call(document.querySelectorAll(".lvl"), function (b) {
      b.addEventListener("click", function () {
        setLevel(Number(b.dataset.level));
        JH.Audio.sfx("tap");
      });
    });

    var clearBtn = document.getElementById("trace-clear");
    if (clearBtn) clearBtn.addEventListener("click", function () {
      reset(); JH.Audio.sfx("tap");
      JH.UI.kiko("Sudah bersih. Ayo coba lagi!", [{ text: "Sudah bersih. Ayo coba lagi!" }]);
    });

    var checkBtn = document.getElementById("trace-check");
    if (checkBtn) checkBtn.addEventListener("click", function () { finish(); });

    var ro = window.ResizeObserver ? new ResizeObserver(function () { layout(); render(); }) : null;
    if (ro && wrap) ro.observe(wrap);
    window.addEventListener("resize", function () { layout(); render(); });
    window.addEventListener("orientationchange", function () { setTimeout(function () { layout(); render(); }, 200); });
  }

  return { init: init, open: open, reset: reset, setLevel: setLevel, relayout: function () { layout(); render(); } };
})();
