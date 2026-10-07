/* ARKAT service worker: önce ağ (hep güncel), internet yoksa önbellek */
const V = 'arkat-v5';
const CORE = [
  './', 'index.html', 'profile.html', 'user.html', 'badges.html', 'arkat.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png',
  'games/neon-dusus/info.html', 'games/neon-dusus/play.html',
  'games/neon-tower/info.html', 'games/neon-tower/play.html',
  'games/neon-viper/info.html', 'games/neon-viper/play.html',
  'games/neon-claim/info.html', 'games/neon-claim/play.html'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;          // Firebase, Google, fontlar: dokunma
  e.respondWith(
    fetch(r).then(res => {
      if (res && res.status === 200) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
      return res;
    }).catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match('index.html')))
  );
});
