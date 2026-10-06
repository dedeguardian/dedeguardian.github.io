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
5. **Build → Firestore Database → Veritabanı oluştur** (production modu), sonra **Rules** sekmesine `firestore.rules` dosyasının içindekini (aşağıda da var) yapıştırıp **Publish** et.
   Kullanıcı adları, arkadaşlık, dünya sıralaması ve herkese açık profiller bu kurallara bağlı. Kurallar güncellenmezse bu özellikler çalışmaz.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Özel kullanıcı kaydı (e-posta, dil, son giriş): sadece sahibi
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // Herkese açık profil: herkes okur, sadece sahibi yazar
    match /profiles/{uid} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['uid','username','usernameLower','firstName','lastName','photo','photoSrc','best','badges','createdAt'])
        && (!('photo' in request.resource.data) || request.resource.data.photo.size() < 20000)
        // kullanıcı adı, ancak bu kişi adına ayrılmışsa yazılabilir
        && (!('usernameLower' in request.resource.data)
            || getAfter(/databases/$(database)/documents/usernames/$(request.resource.data.usernameLower)).data.uid == uid);
    }

    // Kullanıcı adı kaydı: bir ad ilk alan kişiye aittir, başkası alamaz
    match /usernames/{name} {
      allow read: if true;
      allow create: if request.auth != null
        && name.matches('^[a-z0-9_]{3,16}$')
        && request.resource.data.keys().hasOnly(['uid','username'])
        && request.resource.data.uid == request.auth.uid;
      allow delete: if request.auth != null && resource.data.uid == request.auth.uid;
      allow update: if false;
    }

    // Dünya sıralaması: herkes okur, herkes sadece kendi satırını yazar
    match /boards/{board}/entries/{uid} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['uid','name','photo','score','t'])
        && request.resource.data.uid == uid
        && request.resource.data.score is int
        && request.resource.data.score > 0
        && request.resource.data.score < 100000000
        && request.resource.data.photo.size() < 20000;
      allow update: if request.auth != null && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['uid','name','photo','score','t'])
        && request.resource.data.uid == uid
        && request.resource.data.score is int
        && request.resource.data.score >= resource.data.score
        && request.resource.data.score < 100000000
        && request.resource.data.photo.size() < 20000;
    }

    // Arkadaşlık istekleri ve arkadaşlıklar: sadece iki taraf görür
    match /friendships/{pair} {
      allow read: if request.auth != null && request.auth.uid in resource.data.users;
      allow create: if request.auth != null
        && request.resource.data.keys().hasOnly(['users','from','status','t'])
        && request.resource.data.users.size() == 2
        && request.auth.uid in request.resource.data.users
        && request.resource.data.from == request.auth.uid
        && request.resource.data.status == 'pending'
        && pair == request.resource.data.users[0] + '_' + request.resource.data.users[1];
      allow update: if request.auth != null
        && request.auth.uid in resource.data.users
        && resource.data.from != request.auth.uid
        && resource.data.status == 'pending'
        && request.resource.data.status == 'accepted'
        && request.resource.data.users == resource.data.users
        && request.resource.data.from == resource.data.from;
      allow delete: if request.auth != null && request.auth.uid in resource.data.users;
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
games/neon-viper/info.html
games/neon-viper/play.html
games/neon-claim/info.html
games/neon-claim/play.html
user.html
sw.js
manifest.webmanifest
icons/ (klasörün tamamı)
```
