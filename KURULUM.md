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
5. **Build → Firestore Database → Veritabanı oluştur** (production modu), sonra **Rules** sekmesine şunu yapıştırıp **Publish** et.
   (Dünya sıralaması için `boards` bölümü de içinde. Bu kurallar güncellenmezse sıralama boş kalır.)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Kullanıcının kendi profili: sadece kendisi okuyup yazabilir
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // Dünya sıralaması: herkes okuyabilir, herkes sadece kendi satırını yazabilir
    match /boards/{board}/entries/{uid} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['uid','name','photo','score','t'])
        && request.resource.data.uid == uid
        && request.resource.data.score is int
        && request.resource.data.score > 0
        && request.resource.data.score < 100000000;
      allow update: if request.auth != null && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['uid','name','photo','score','t'])
        && request.resource.data.uid == uid
        && request.resource.data.score is int
        && request.resource.data.score > resource.data.score
        && request.resource.data.score < 100000000;
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
games/neon-tower/info.html
games/neon-tower/play.html
```
