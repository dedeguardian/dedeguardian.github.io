# ARKAT — Google ile giriş kurulumu (bir kerelik, ~5 dk)

Dil seçimi (TR / EN / JA) kurulum gerektirmez, hemen çalışır.
Google girişi için ücretsiz bir Firebase projesi lazım:

1. https://console.firebase.google.com → **Proje ekle** (adı: arkat).
2. Proje ayarları (⚙) → **Genel** → "Uygulamanız yok" bölümünden **Web (</>)** uygulaması ekle.
   Çıkan `firebaseConfig` içindeki `apiKey`, `authDomain`, `projectId`, `appId` değerlerini
   `arkat.js` dosyasının en üstündeki `FIREBASE_CONFIG` alanına yapıştır.
3. **Build → Authentication → Başlayın → Sign-in method → Google** → Etkinleştir → Kaydet.
4. Authentication → **Settings → Authorized domains** → **Add domain** → `dedeguardian.github.io`
   (localhost zaten ekli).
5. **Build → Firestore Database → Veritabanı oluştur** (production modu), sonra **Rules** sekmesine şunu yapıştırıp Yayınla:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

Not: Firebase `apiKey` gizli değildir, herkese açık sitede durması normaldir; güvenliği yukarıdaki kurallar sağlar.

## Dosya yapısı (GitHub'a bu şekilde yükle)
```
index.html
profile.html
arkat.js
games/neon-dusus/info.html
games/neon-dusus/play.html
```
