/* =========================================================
   service-worker.js — DUKUNGAN OFFLINE (opsional)
   ---------------------------------------------------------
   Aplikasi TETAP berjalan normal walau service worker gagal
   atau tidak didukung. Semua path memakai relative path agar
   cocok dengan GitHub Pages project site:
   https://username.github.io/nama-repository/
   ========================================================= */

var CACHE = "jejak-huruf-v1";

var ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./data/letters.js",
  "./data/syllables.js",
  "./data/words.js",
  "./js/illustrations.js",
  "./js/audio.js",
  "./js/progress.js",
  "./js/rewards.js",
  "./js/navigation.js",
  "./js/tracing.js",
  "./js/games.js",
  "./js/reading.js",
  "./js/app.js",
  "./assets/icons/icon.svg",
  "./assets/icons/icon-192.svg",
  "./assets/icons/icon-512.svg"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // addAll gagal bila satu file hilang -> pakai add satu per satu
      return Promise.all(ASSETS.map(function (url) {
        return c.add(url).catch(function () { /* abaikan file yang belum ada */ });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        // offline & belum ter-cache: untuk navigasi kembalikan halaman utama
        if (req.mode === "navigate") return caches.match("./index.html");
        return new Response("", { status: 504, statusText: "Offline" });
      });
    })
  );
});
