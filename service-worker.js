/* =========================================================
   service-worker.js — OFFLINE CACHE V11
   ---------------------------------------------------------
   V11 memakai network-first untuk HTML/JS/CSS/data agar update
   GitHub Pages tidak tertahan cache lama. Audio/gambar tetap
   cache-first supaya hemat data dan responsif.
   ========================================================= */

var CACHE = "jejak-huruf-v11-direct-be";
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
      return Promise.all(ASSETS.map(function (url) {
        return c.add(url).catch(function () { /* file opsional boleh tidak ada */ });
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

function sameOrigin(req) {
  try { return new URL(req.url).origin === self.location.origin; }
  catch (e) { return false; }
}

function isAppCode(req) {
  var p = new URL(req.url).pathname;
  return req.mode === "navigate" || /\.(?:html|js|css|json)$/i.test(p);
}

function networkFirst(req) {
  return fetch(req).then(function (res) {
    if (res && res.status === 200) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); });
    }
    return res;
  }).catch(function () {
    return caches.match(req).then(function (hit) {
      if (hit) return hit;
      if (req.mode === "navigate") return caches.match("./index.html");
      return new Response("", { status: 504, statusText: "Offline" });
    });
  });
}

function cacheFirst(req) {
  return caches.match(req).then(function (hit) {
    if (hit) return hit;
    return fetch(req).then(function (res) {
      if (res && res.status === 200) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return res;
    });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || !sameOrigin(req)) return;
  e.respondWith(isAppCode(req) ? networkFirst(req) : cacheFirst(req));
});
