# Wörterbuch — Almanca-Türkçe Sözlük (PWA)

Çevrimdışı çalışan, ana ekrana eklenebilen, telefonda uygulama gibi davranan
küçük bir Almanca-Türkçe sözlük. Toplam boyut: **~30 KB** (simgeler dahil).

## Dosyalar

| Dosya | Görev |
|---|---|
| `index.html` | Tüm uygulama (arayüz + sözlük verisi + arama mantığı) |
| `manifest.json` | "Ana ekrana ekle"yi mümkün kılan manifest |
| `service-worker.js` | Çevrimdışı çalışmayı sağlayan arka plan dosyası |
| `icon.svg` | Vektör simge kaynağı |
| `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` | PWA simgeleri |
| `apple-touch-icon.png` | iOS ana ekran simgesi |

## Yayına alma — en kolay yol: GitHub Pages (ücretsiz)

PWA'nın çalışması için **HTTPS** üzerinden sunulması gerekiyor. Yerel dosyayı
çift tıklayıp açmak işe yaramaz (Service Worker çalışmaz). En kolay yol:

### Adımlar

1. **GitHub hesabı aç** (yoksa): github.com
2. **Yeni repo oluştur**, ad olarak `sozluk` veya istediğin bir şey ver,
   "Public" seçeneğini işaretle.
3. Bu klasördeki **tüm dosyaları** repoya yükle (sürükle-bırak veya
   "Add file → Upload files" ile).
4. Repoda **Settings → Pages** sekmesine git.
5. "Source" bölümünde **Deploy from a branch** seç, branch olarak `main`,
   klasör olarak `/ (root)` seç ve **Save**'e tıkla.
6. 1-2 dakika sonra `https://kullaniciadin.github.io/sozluk/` adresinde
   yayına girer.

### iPhone'da yükleme

1. Safari'de yukarıdaki adresi aç.
2. Alttaki **Paylaş** simgesine tıkla (kare + ok).
3. **Ana Ekrana Ekle**'yi seç.
4. İsim ve simge çıkar — **Ekle**'ye bas.
5. Artık ana ekranda uygulama gibi simgesi olur. Aç → tam ekran → uçak
   modunda bile çalışır.

### Android'de yükleme

Chrome otomatik olarak "Yükle" düğmesi gösterir. Ya da menüden
"Ana ekrana ekle" seçilebilir.

## Kelime ekleme / değiştirme

`index.html` dosyasını bir editörle aç. Alt kısımda büyük bir `dictionary`
dizisi var:

```js
const dictionary = [
  { de: "Hallo", tr: "Merhaba" },
  { de: "Mutter", tr: "anne", article: "die" },
  ...
];
```

Yeni satır eklemen yeterli. `article` (der/die/das) opsiyonel — sadece
isimler için kullan. Sıfat, fiil, edat vs. için boş bırakabilirsin.

Dosyayı kaydet, GitHub'a tekrar yükle. 1-2 dakika sonra herkesin telefonunda
güncel sürüm olur (Service Worker eski sürümü temizler — `service-worker.js`
içindeki `CACHE_VERSION`'u değiştirmen yeterli, mesela `'woerterbuch-v2'`).

## Çevrimdışı nasıl çalışıyor?

İlk açılışta tarayıcı bütün dosyaları (HTML, simgeler, sözlük) telefona
indiriyor. Sonra Service Worker bunları yakalıyor — internet olmasa bile
"önbelleğimde var, oradan vereyim" diyor. Sözlük veritabanı zaten HTML'in
içinde JavaScript dizisi olarak yüklü, dış istek yok.

## Kullanım

- Almanca veya Türkçe yazabilirsin — iki yönde de arar.
- Türkçe karakter (ç, ş, ı) ve Alman umlaut'ları (ä, ö, ü, ß) otomatik
  normalize edilir. "uber" yazsan da "über" bulur.
- Önce tam eşleşme, sonra başlayanlar, sonra içerenler sıralanır.

## Boyut özeti

| | |
|---|---|
| HTML + sözlük | ~30 KB |
| Simgeler | ~76 KB toplam |
| Service Worker | ~1.5 KB |
| Manifest | ~1 KB |
| **Toplam** | **~110 KB** |

Sıkıştırma sonrası transfer ~25 KB. Yani ilk yüklemede mobil verinden çok
çok az tüketir.
