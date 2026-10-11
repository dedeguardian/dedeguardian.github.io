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

    // Yönetici hesabı (Firebase uid). Aynı uid arkat.js içinde de tanımlı.
    function isAdmin() {
      return request.auth != null && request.auth.uid == 'Pufgl8aoeVgiwVZ0JMeoV2EhwFH3';
    }

    // Özel kullanıcı kaydı (e-posta, dil, son giriş): sadece sahibi
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // Herkese açık profil: herkes okur, sadece sahibi yazar
    match /profiles/{uid} {
      allow read: if true;
      allow create, update: if request.auth != null && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['uid','username','usernameLower','firstName','lastName','photo','photoSrc','best','badges','favs','online','createdAt'])
        && (!('photo' in request.resource.data) || request.resource.data.photo.size() < 20000)
        && (!('favs' in request.resource.data) || (request.resource.data.favs is list && request.resource.data.favs.size() <= 20))
        // kullanıcı adı, ancak bu kişi adına ayrılmışsa yazılabilir
        && (!('usernameLower' in request.resource.data)
            || getAfter(/databases/$(database)/documents/usernames/$(request.resource.data.usernameLower)).data.uid == uid);
      allow delete: if isAdmin();
    }

    // Kullanıcı adı kaydı: bir ad ilk alan kişiye aittir, başkası alamaz
    match /usernames/{name} {
      allow read: if true;
      allow create: if request.auth != null
        && name.matches('^[a-z0-9_]{3,16}$')
        && request.resource.data.keys().hasOnly(['uid','username'])
        && request.resource.data.uid == request.auth.uid;
      allow delete: if (request.auth != null && resource.data.uid == request.auth.uid) || isAdmin();
      allow update: if false;
    }

    // Online puan tabloları (online_...): puan değişimi, oyun sonucu işaret belgesiyle (applied) eşleşmek zorunda
    function onlineOk(uid, oldScore) {
      return request.resource.data.lastRoom is string
        && existsAfter(/databases/$(database)/documents/applied/$(request.resource.data.lastRoom + '_' + uid))
        && !exists(/databases/$(database)/documents/applied/$(request.resource.data.lastRoom + '_' + uid))
        && request.resource.data.score - oldScore == getAfter(/databases/$(database)/documents/applied/$(request.resource.data.lastRoom + '_' + uid)).data.pts;
    }

    // Dünya sıralaması: herkes okur, herkes sadece kendi satırını yazar
    match /boards/{board}/entries/{uid} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['uid','name','photo','score','t','lastRoom'])
        && request.resource.data.uid == uid
        && request.resource.data.score is int
        && request.resource.data.photo.size() < 20000
        && ( (!board.matches('online_.*') && request.resource.data.score > 0 && request.resource.data.score < 100000000)
             || (board.matches('online_.*') && onlineOk(uid, 0)) );
      allow update: if request.auth != null && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['uid','name','photo','score','t','lastRoom'])
        && request.resource.data.uid == uid
        && request.resource.data.score is int
        && request.resource.data.photo.size() < 20000
        && ( (!board.matches('online_.*') && request.resource.data.score >= resource.data.score && request.resource.data.score < 100000000)
             || request.resource.data.score == resource.data.score
             || (board.matches('online_.*') && onlineOk(uid, resource.data.score)) );
      allow delete: if isAdmin();
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

    // ---------- ONLINE OYUNLAR ----------
    match /rooms/{code} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && request.resource.data.hostUid == request.auth.uid
        && request.resource.data.code == code
        && request.resource.data.status == 'lobby'
        && request.resource.data.max in [2, 3, 4]
        && request.resource.data.players.size() == 1
        && request.auth.uid in request.resource.data.players;
      allow update: if request.auth != null && (
          // kurucu her şeyi güncelleyebilir (kurucu değişmez)
          (resource.data.hostUid == request.auth.uid && request.resource.data.hostUid == resource.data.hostUid)
          // oyuncu sadece lobide kendi satırını ekler/çıkarır
          || (resource.data.status == 'lobby'
              && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['players'])
              && request.resource.data.players.diff(resource.data.players).affectedKeys().hasOnly([request.auth.uid])
              && request.resource.data.players.size() <= resource.data.max
              && ((request.auth.uid in resource.data.players)
                  || existsAfter(/databases/$(database)/documents/rooms/$(code)/members/$(request.auth.uid)))));
      allow delete: if request.auth != null && resource.data.hostUid == request.auth.uid;

      // üyelik: şifreli odada doğru şifre özeti (proof) olmadan oluşturulamaz
      match /members/{uid} {
        allow read: if request.auth != null
          && (request.auth.uid == uid || get(/databases/$(database)/documents/rooms/$(code)).data.hostUid == request.auth.uid);
        allow create: if request.auth != null && request.auth.uid == uid
          && request.resource.data.keys().hasOnly(['uid','name','photo','proof'])
          && (getAfter(/databases/$(database)/documents/rooms/$(code)).data.private == false
              || request.resource.data.proof == getAfter(/databases/$(database)/documents/rooms/$(code)/secret/pw).data.hash);
        allow delete: if request.auth != null
          && (request.auth.uid == uid || get(/databases/$(database)/documents/rooms/$(code)).data.hostUid == request.auth.uid);
      }

      // eller: sadece sahibi ve kurucu okur, sadece kurucu yazar
      match /hands/{uid} {
        allow read: if request.auth != null
          && (request.auth.uid == uid || get(/databases/$(database)/documents/rooms/$(code)).data.hostUid == request.auth.uid);
        allow write: if request.auth != null && get(/databases/$(database)/documents/rooms/$(code)).data.hostUid == request.auth.uid;
      }
      // deste: sadece kurucu
      match /deck/{d} {
        allow read, write: if request.auth != null && get(/databases/$(database)/documents/rooms/$(code)).data.hostUid == request.auth.uid;
      }
      // oda şifresi özeti: kimse okuyamaz, sadece kurucu yazar
      match /secret/{d} {
        allow read: if false;
        allow write: if request.auth != null && getAfter(/databases/$(database)/documents/rooms/$(code)).data.hostUid == request.auth.uid;
      }
      // oyuncu hamleleri: oyuncu yazar, kurucu okur ve işler
      match /actions/{id} {
        allow create: if request.auth != null
          && request.resource.data.uid == request.auth.uid
          && request.resource.data.keys().hasOnly(['uid','type','card','suit','seq','t'])
          && request.auth.uid in get(/databases/$(database)/documents/rooms/$(code)).data.players;
        allow read, delete: if request.auth != null && get(/databases/$(database)/documents/rooms/$(code)).data.hostUid == request.auth.uid;
      }
    }

    // oyun sonucu işaret belgesi: her oyuncu her oyunda puanını en fazla bir kez, kurucunun yazdığı değerle uygular
    match /applied/{id} {
      allow read: if request.auth != null && (resource == null || resource.data.uid == request.auth.uid);
      allow create: if request.auth != null
        && request.resource.data.keys().hasOnly(['uid','room','game','pts'])
        && request.resource.data.uid == request.auth.uid
        && id == request.resource.data.room + '_' + string(request.resource.data.game) + '_' + request.auth.uid
        && get(/databases/$(database)/documents/rooms/$(request.resource.data.room)).data.status == 'finished'
        && get(/databases/$(database)/documents/rooms/$(request.resource.data.room)).data.gameNo == request.resource.data.game
        && get(/databases/$(database)/documents/rooms/$(request.resource.data.room)).data.results[request.auth.uid].pts == request.resource.data.pts;
    }

    // davetler: sadece gönderen ve alan görür
    match /invites/{id} {
      allow read, delete: if request.auth != null && (resource.data.to == request.auth.uid || resource.data.from == request.auth.uid);
      allow create: if request.auth != null
        && request.resource.data.from == request.auth.uid
        && request.resource.data.keys().hasOnly(['to','from','fromName','code','title','private','proof','t']);
    }
  }
}
```

## Online oyunlar (Pis Yedili)
- Ek bir Firebase hizmeti açmana gerek yok, mevcut Firestore kullanılıyor. Sadece yukarıdaki **kuralları yeniden yayınlaman** şart (odalar, davetler ve online puan bu kurallara bağlı).
- Ücretsiz Firestore kotası günde yaklaşık 20 bin yazma / 50 bin okuma. Bir Pis Yedili oyunu hamle başına birkaç yazma yapar, günde yaklaşık 20-40 oyuna yeter.
- Oda şifresi güvenlik kuralıyla denetlenir (şifre özeti sunucuda saklanır, kimse okuyamaz).

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
badges.html
online-games/index.html
online-games/pis-yedili/room.html
online-games/pis-yedili/engine.js
user.html
sw.js
manifest.webmanifest
icons/ (klasörün tamamı)
```
