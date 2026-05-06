// Wörterbuch Service Worker
// Versiyonu değiştirdiğinde tüm kullanıcılar güncel sürümü alır.
const CACHE_VERSION = 'woerterbuch-v1';

// Offline çalışacak temel dosyalar
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

// Yükleme: dosyaları önbelleğe al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      // Bazı opsiyonel dosyalar yoksa diye tek tek ekliyoruz, hata yutuyoruz
      return Promise.all(
        ASSETS.map((url) =>
          cache.add(url).catch(() => {
            console.warn('SW: cache atlandı', url);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Aktivasyon: eski versiyonları temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// İstekler: önce önbellek, sonra ağ (cache-first stratejisi)
// Sözlük verisi statik olduğu için bu en hızlısı.
self.addEventListener('fetch', (event) => {
  // Sadece GET istekleri
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Başarılıysa önbelleğe de ekle
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Ağ yoksa ve önbellekte yoksa, ana sayfayı dön
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
