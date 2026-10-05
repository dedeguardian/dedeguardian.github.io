/* ARKAT — ortak dil (TR/EN/JA) + Google ile giriş + profil
   Tüm sayfalar bu dosyayı yükler. Dil seçimi localStorage'da 'arkat-lang' anahtarında tutulur;
   oyun (play.html) de aynı anahtarı okur. */
(function () {
  // ======= 1) FIREBASE AYARLARI — buraya kendi değerlerini yapıştır (README'ye bak) =======
  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyCO8-WpcDOMVLT8tkYhk-d1_Fbw8koh7NU",
    authDomain: "dedeguardiangame.firebaseapp.com",
    projectId: "dedeguardiangame",
    storageBucket: "dedeguardiangame.firebasestorage.app",
    messagingSenderId: "533664538206",
    appId: "1:533664538206:web:0e28d0956a5abc24215ecf"
  };

  // ======= 2) Diller =======
  var LANGS = [['tr', 'TR', 'Türkçe'], ['en', 'EN', 'English'], ['ja', 'JA', '日本語']];

  var D = {
    tr: {
      lang_name: 'Türkçe',
      login: 'GİRİŞ YAP', logout: 'ÇIKIŞ YAP', profile: 'PROFİL', signing: 'BAĞLANIYOR…',
      auth_off: 'Giriş henüz ayarlanmadı (Firebase ayarları boş).',
      auth_err: 'Giriş yapılamadı. Tekrar dene.',
      // index
      idx_title: 'ARKAT — Retro Oyun Salonu',
      idx_desc: 'Tarayıcıda ücretsiz oynanan retro oyunlar.',
      nav_games: 'OYUNLAR',
      hero: 'OYNAMAK İÇİN<br>JETON AT',
      hero_p: 'Tarayıcıda oynanan, indirmesiz retro oyunlar. Telefonda da masaüstünde de çalışır.',
      go_games: '▸ OYUNLARA GİT',
      sec_games: 'OYUNLAR', count: '3 OYUN',
      g_neon_t: 'NEON DÜŞÜŞ',
      g_tower_t: 'NEON TOWER',
      g_neon_d: 'Çizgi çizerek düşen renkli kutuları yönlendir, aynı renkten dördünü bir araya getirip patlat.',
      tag_arcade: 'ARCADE',
      soon_t: 'SIRADA', soon_d: 'Yeni bir oyun buraya eklenecek.',
      footer: 'ARKAT · kişisel retro oyun koleksiyonu',
      // info
      info_title: 'Neon Düşüş — Nasıl Oynanır',
      back_arkat: '◂ ARKAT\'A DÖN',
      game_name: 'NEON DÜŞÜŞ',
      tagline: 'Çizgi çiz, kutuları yönlendir, aynı renkleri patlat.',
      sec_states: 'KUTULARIN HALLERİ',
      s1: 'Düşüyor — henüz hiçbir şeye değmedi.',
      s2: 'Havadayken çizgine değince aktif olur ve parlar.',
      s3: 'Çizgine değmeden inerse × olur, bir daha aktif olmaz.',
      s4: 'Aynı renkten 4 aktif kutu birleşince hepsi patlar.',
      sec_controls: 'KONTROLLER',
      c1: '<b>Parmak / fare:</b> ekrana basılı tutup sürükleyerek çizgi çiz.',
      c2: '<b>En fazla 2 çizgi:</b> 3. çizgiyi çizince en eski çizgi hemen silinir.',
      c3: '<b>Kaybetme:</b> kutu yığını kırmızı çizgiye ulaşıp orada kalırsa oyun biter.',
      start: '▸ OYUNA BAŞLA',
      // Neon Tower
      g_tower_d: 'Neon kulede platformdan platforma zıpla, kristal topla, engelleri aş ve olabildiğince yükseğe tırman.',
      tw_info_title: 'Neon Tower — Nasıl Oynanır',
      tw_tagline: 'Neon kulede zıpla, kristal topla, yükseğe tırman.',
      tw_sec_items: 'EŞYALAR',
      tw_i1: '<b>◆ Kristal:</b> topla, cüzdanına eklenir. Karakter almak ve dirilmek için harcarsın.',
      tw_i2: '<b>J Jetpack:</b> kısa süre yukarı uçurur ve engellerden korur.',
      tw_i3: '<b>M Mıknatıs:</b> yakındaki kristalleri kendine çeker.',
      tw_i4: '<b>Yay:</b> çok yükseğe zıplatır, kısa süre kalkan verir.',
      tw_sec_modes: 'MODLAR',
      tw_m1: '<b>Klasik:</b> sonsuz tırmanış, hız giderek artar. En yüksek skorun kaydedilir.',
      tw_m2: '<b>Seviye modu:</b> 10 seviye, her biri yeni engeller getirir. İlk geçişte kristal bonusu var.',
      tw_m3: '<b>Zor mod:</b> 10. seviyeyi bitirince açılır, bitiş çizgisi yok.',
      tw_sec_extra: 'ÖZEL J VE DİRİLME',
      tw_e1: '<b>Özel J:</b> oyunun ilk saniyelerinde 300 ◆ ödeyip 30 kat birden uç.',
      tw_e2: '<b>Diril:</b> düşünce 850 ◆ ödeyip bir kez devam et.',
      tw_c1: '<b>Klavye:</b> ◀ ▶ / A D hareket · BOŞLUK / ▲ / W zıpla · P duraklat · J özel J.',
      tw_c2: '<b>Dokunmatik:</b> ekrandaki ◀ ▶ ve ▲ düğmeleri. Düzeni menüden değiştirebilirsin.',
      tw_c3: '<b>Kaybetme:</b> ekranın altına düşersen oyun biter (bir kez dirilebilirsin).',
      best_drop: 'EN YÜKSEK PUANLAR · NEON DÜŞÜŞ',
      best_tower: 'NEON TOWER',
      mode_classic: 'Klasik', mode_hard: 'Zor mod', lv_done: 'Biten seviye',
      // Giriş ekranı, sıralama, rozet
      gate_title: 'HOŞ GELDİN',
      gate_sub: 'Dilini seç, sonra nasıl devam edeceğini belirle.',
      gate_lang: 'DİL',
      gate_google: 'GOOGLE İLE GİRİŞ YAP',
      gate_guest: 'MİSAFİR OLARAK DEVAM ET',
      gate_note: 'Giriş yaparsan puanların ve rozetlerin hesabında saklanır ve dünya sıralamasına girersin. Misafir olarak da oynayabilirsin ama sıralamada yer almazsın.',
      world: 'DÜNYA', you: 'SEN',
      lb_empty: 'Bu sıralamada henüz kimse yok.',
      lb_loading: 'YÜKLENİYOR…', lb_close: 'KAPAT',
      lb_err: 'Sıralama yüklenemedi.',
      tap_rank: 'Sıralamayı görmek için bir skora dokun.',
      scores_h2: 'SKORLAR', scores_h: 'SKORLARIM', badges_h: 'ROZETLER', badge_new: 'YENİ ROZET!',
      badge_tower_nova_n: 'NOVA AJAN',
      badge_tower_nova_d: 'Neon Tower\'ın 10 seviyesini de tamamla.',
      // Arama, ayarlar, arkadaşlar, kurulum, yeni oyun
      g_viper_t: 'NEON VIPER',
      g_viper_d: 'Neon ızgarada yılanı yönlendir, elmasları ye, uzadıkça hızlan ve engellere çarpma.',
      search: 'ARA',
      search_ph: 'Oyun veya kişi ara…',
      sr_people: 'KİŞİLER',
      sr_none: 'Sonuç bulunamadı.',
      sr_type: 'Kişi aramak için en az 2 harf yaz.',
      sr_game_tag: 'OYUN',
      settings_h: 'AYARLAR',
      set_photo: 'PROFİL RESMİ',
      set_upload: 'FOTOĞRAF YÜKLE',
      set_google: 'GOOGLE FOTOĞRAFIM',
      set_presets: 'YA DA BİR AVATAR SEÇ',
      set_username: 'KULLANICI ADI',
      set_name: 'İSİM (İSTEĞE BAĞLI)',
      set_first: 'Ad',
      set_last: 'Soyad',
      set_save: 'KAYDET',
      set_saved: 'Kaydedildi!',
      set_err: 'Kaydedilemedi, tekrar dene.',
      set_photo_err: 'Bu görsel okunamadı. Başka bir görsel dene.',
      set_hint_name: 'İstediğin kadarını değiştir: sadece ad ya da sadece soyad olabilir. Boş bıraktığın alan değişmez.',
      un_title: 'KULLANICI ADI SEÇ',
      un_sub: 'Sıralamada ve arkadaş listelerinde bu adla görüneceksin. Her ad benzersizdir, başkası aynı adı alamaz.',
      un_rules: '3–16 karakter: harf, rakam ve _',
      un_ph: 'kullanici_adi',
      un_ok: 'Bu ad boşta!',
      un_taken: 'Bu ad alınmış, başka bir tane dene.',
      un_bad: 'Sadece harf (a-z), rakam ve _ kullan; 3–16 karakter olmalı.',
      un_reserved: 'Bu ad kullanılamaz.',
      un_checking: 'Kontrol ediliyor…',
      un_take: 'BU ADI AL',
      un_same: 'Şu an kullandığın ad.',
      friends_h: 'ARKADAŞLAR',
      fr_add: 'ARKADAŞ EKLE',
      fr_sent: 'İSTEK GÖNDERİLDİ',
      fr_cancel: 'İSTEĞİ GERİ AL',
      fr_accept: 'KABUL ET',
      fr_decline: 'REDDET',
      fr_friends: 'ARKADAŞSIN ✓',
      fr_remove: 'ARKADAŞLIKTAN ÇIKAR',
      fr_requests: 'GELEN İSTEKLER',
      fr_waiting: 'Yanıt bekleniyor',
      fr_none: 'Henüz arkadaşın yok. Arama düğmesiyle kişileri bulup ekleyebilirsin.',
      fr_login: 'Arkadaş eklemek için giriş yap.',
      user_notfound: 'Kullanıcı bulunamadı.',
      user_title: 'ARKAT — Oyuncu',
      this_you: 'BU SENSİN',
      install: 'UYGULAMAYI YÜKLE',
      install_short: 'YÜKLE',
      ios_title: 'ANA EKRANA EKLE',
      ios_steps: 'Safari\'de alttaki Paylaş simgesine dokun, sonra "Ana Ekrana Ekle"yi seç.',
      mode_unlimited: 'Sınırsız mod',
      mode_level: 'Seviye modu',
      badge_viper_master_n: 'VIPER USTASI',
      badge_viper_master_d: 'Neon Viper\'ın 10 seviyesini de bitir.',
      badge_tower_solo_n: 'NOVA\'SIZ KAHRAMAN',
      badge_tower_solo_d: 'Neon Tower\'ın 10 seviyesini de Nova ve Nova kostümleri olmadan bitir.',
      vp_info_title: 'Neon Viper — Nasıl Oynanır',
      vp_tagline: 'Yılanı yönlendir, elmasları ye, hayatta kal.',
      vp_sec_items: 'ÖĞELER',
      vp_i1: '<b>◆ Elmas:</b> yersen yılan uzar ve puan kazanırsın. Seviye modunda her seviye 10 elmasla biter.',
      vp_i2: '<b>★ Bonus:</b> kısa süre ekranda kalır, yersen +30 puan.',
      vp_i3: '<b>✕ Engel:</b> seviye modunda çıkar, çarparsan oyun biter.',
      vp_m1: '<b>Sınırsız mod:</b> duvardan geçersin, öbür taraftan çıkarsın. Sadece kendine ve engellere çarpma.',
      vp_m2: '<b>Klasik mod:</b> duvara ya da kendine çarparsan biter. Yılan yedikçe hızlanır.',
      vp_m3: '<b>Seviye modu:</b> 10 seviye, her birinde 10 elma ye. Engeller ve hız artar. Hepsini bitirince özel rozet kazanırsın.',
      vp_c1: '<b>Klavye:</b> ◀ ▲ ▼ ▶ / WASD yön · P duraklat · M ses.',
      vp_c2: '<b>Dokunmatik:</b> ekranda parmağını kaydır ya da yön tuşlarını kullan. Tuşları menüden istediğin yere taşıyabilirsin.',
      vp_c3: '<b>Kaybetme:</b> duvara (sınırsız modda hariç), kendine ya da engele çarparsan oyun biter.',
      inst_hint: 'Telefonuna uygulama gibi yükle',
      // profil
      prof_title: 'ARKAT — Profil',
      back_home: '◂ ANA SAYFA',
      prof_h: 'PROFİL',
      prof_need: 'Profilini görmek için Google ile giriş yap.',
      f_email: 'E-POSTA', f_joined: 'KATILIM', f_lastseen: 'SON GİRİŞ',
      best_h: 'EN YÜKSEK PUANLAR · NEON DÜŞÜŞ',
      easy: 'Kolay', medium: 'Orta', hard: 'Zor',
      no_score: 'Henüz puan yok.',
      loading: 'YÜKLENİYOR…'
    },
    en: {
      lang_name: 'English',
      login: 'SIGN IN', logout: 'SIGN OUT', profile: 'PROFILE', signing: 'CONNECTING…',
      auth_off: 'Sign-in is not set up yet (Firebase config is empty).',
      auth_err: 'Could not sign in. Please try again.',
      idx_title: 'ARKAT — Retro Arcade',
      idx_desc: 'Free retro games you can play right in your browser.',
      nav_games: 'GAMES',
      hero: 'INSERT COIN<br>TO PLAY',
      hero_p: 'Retro games that run in your browser — no downloads. Works on phones and desktops.',
      go_games: '▸ BROWSE GAMES',
      sec_games: 'GAMES', count: '3 GAMES',
      g_neon_t: 'NEON DROP',
      g_tower_t: 'NEON TOWER',
      g_neon_d: 'Draw lines to steer the falling colored boxes, then line up four of the same color to blow them up.',
      tag_arcade: 'ARCADE',
      soon_t: 'UP NEXT', soon_d: 'A new game will be added here.',
      footer: 'ARKAT · a personal retro game collection',
      info_title: 'Neon Drop — How to Play',
      back_arkat: '◂ BACK TO ARKAT',
      game_name: 'NEON DROP',
      tagline: 'Draw lines, steer the boxes, blow up matching colors.',
      sec_states: 'BOX STATES',
      s1: 'Falling — hasn\'t touched anything yet.',
      s2: 'Touches your line while falling and becomes active — it glows.',
      s3: 'Lands without touching your line and becomes ×, never active again.',
      s4: '4 active boxes of the same color together and they all explode.',
      sec_controls: 'CONTROLS',
      c1: '<b>Finger / mouse:</b> press and drag on the screen to draw a line.',
      c2: '<b>Max 2 lines:</b> drawing a 3rd line instantly erases the oldest one.',
      c3: '<b>Losing:</b> if the stack reaches the red line and stays there, the game is over.',
      start: '▸ START GAME',
      // Neon Tower
      g_tower_d: 'Hop from platform to platform up a neon tower, collect crystals, dodge hazards and climb as high as you can.',
      tw_info_title: 'Neon Tower — How to Play',
      tw_tagline: 'Jump up the neon tower, collect crystals, climb high.',
      tw_sec_items: 'ITEMS',
      tw_i1: '<b>◆ Crystal:</b> collect it to add to your wallet. Spend it on characters and revives.',
      tw_i2: '<b>J Jetpack:</b> flies you upward for a short time and protects you from hazards.',
      tw_i3: '<b>M Magnet:</b> pulls nearby crystals toward you.',
      tw_i4: '<b>Spring:</b> launches you very high and gives a short shield.',
      tw_sec_modes: 'MODES',
      tw_m1: '<b>Classic:</b> endless climb that keeps getting faster. Your high score is saved.',
      tw_m2: '<b>Level mode:</b> 10 levels, each adding new hazards. The first clear gives a crystal bonus.',
      tw_m3: '<b>Hard mode:</b> unlocks after level 10, no finish line.',
      tw_sec_extra: 'SPECIAL J & REVIVE',
      tw_e1: '<b>Special J:</b> in the first seconds of a run, pay 300 ◆ to fly up 30 floors at once.',
      tw_e2: '<b>Revive:</b> when you fall, pay 850 ◆ to continue once.',
      tw_c1: '<b>Keyboard:</b> ◀ ▶ / A D move · SPACE / ▲ / W jump · P pause · J special J.',
      tw_c2: '<b>Touch:</b> on-screen ◀ ▶ and ▲ buttons. You can rearrange them from the menu.',
      tw_c3: '<b>Losing:</b> if you fall below the screen, the run ends (you can revive once).',
      best_drop: 'HIGH SCORES · NEON DROP',
      best_tower: 'NEON TOWER',
      mode_classic: 'Classic', mode_hard: 'Hard mode', lv_done: 'Levels cleared',
      // Welcome screen, rankings, badges
      gate_title: 'WELCOME',
      gate_sub: 'Pick your language, then choose how to continue.',
      gate_lang: 'LANGUAGE',
      gate_google: 'SIGN IN WITH GOOGLE',
      gate_guest: 'CONTINUE AS GUEST',
      gate_note: 'Sign in to keep your scores and badges on your account and join the world rankings. You can play as a guest, but you won\'t appear in the rankings.',
      world: 'WORLD', you: 'YOU',
      lb_empty: 'Nobody is on this leaderboard yet.',
      lb_loading: 'LOADING…', lb_close: 'CLOSE',
      lb_err: 'Could not load the leaderboard.',
      tap_rank: 'Tap a score to see the rankings.',
      scores_h2: 'HIGH SCORES', scores_h: 'MY HIGH SCORES', badges_h: 'BADGES', badge_new: 'NEW BADGE!',
      badge_tower_nova_n: 'NOVA AGENT',
      badge_tower_nova_d: 'Clear all 10 levels of Neon Tower.',
      // Arama, ayarlar, arkadaşlar, kurulum, yeni oyun
      g_viper_t: 'NEON VIPER',
      g_viper_d: 'Steer the snake across the neon grid, eat diamonds, grow longer and avoid the obstacles.',
      search: 'SEARCH',
      search_ph: 'Search games or people…',
      sr_people: 'PEOPLE',
      sr_none: 'No results.',
      sr_type: 'Type at least 2 letters to search people.',
      sr_game_tag: 'GAME',
      settings_h: 'SETTINGS',
      set_photo: 'PROFILE PICTURE',
      set_upload: 'UPLOAD PHOTO',
      set_google: 'USE MY GOOGLE PHOTO',
      set_presets: 'OR PICK AN AVATAR',
      set_username: 'USERNAME',
      set_name: 'NAME (OPTIONAL)',
      set_first: 'First name',
      set_last: 'Last name',
      set_save: 'SAVE',
      set_saved: 'Saved!',
      set_err: 'Could not save, please try again.',
      set_photo_err: 'Could not read that image. Try another one.',
      set_hint_name: 'Change as much as you like: just the first name or just the last name is fine. Empty fields stay as they are.',
      un_title: 'CHOOSE A USERNAME',
      un_sub: 'You\'ll appear under this name in rankings and friend lists. Every username is unique, nobody else can take it.',
      un_rules: '3–16 characters: letters, numbers and _',
      un_ph: 'username',
      un_ok: 'This name is available!',
      un_taken: 'That name is taken, try another one.',
      un_bad: 'Use only letters (a-z), numbers and _; 3–16 characters.',
      un_reserved: 'This name can\'t be used.',
      un_checking: 'Checking…',
      un_take: 'TAKE THIS NAME',
      un_same: 'This is your current name.',
      friends_h: 'FRIENDS',
      fr_add: 'ADD FRIEND',
      fr_sent: 'REQUEST SENT',
      fr_cancel: 'CANCEL REQUEST',
      fr_accept: 'ACCEPT',
      fr_decline: 'DECLINE',
      fr_friends: 'FRIENDS ✓',
      fr_remove: 'REMOVE FRIEND',
      fr_requests: 'INCOMING REQUESTS',
      fr_waiting: 'Waiting for reply',
      fr_none: 'No friends yet. Use the search button to find people and add them.',
      fr_login: 'Sign in to add friends.',
      user_notfound: 'User not found.',
      user_title: 'ARKAT — Player',
      this_you: 'THIS IS YOU',
      install: 'INSTALL APP',
      install_short: 'INSTALL',
      ios_title: 'ADD TO HOME SCREEN',
      ios_steps: 'In Safari, tap the Share icon, then choose "Add to Home Screen".',
      mode_unlimited: 'Unlimited mode',
      mode_level: 'Level mode',
      badge_viper_master_n: 'VIPER MASTER',
      badge_viper_master_d: 'Clear all 10 levels of Neon Viper.',
      badge_tower_solo_n: 'NO-NOVA HERO',
      badge_tower_solo_d: 'Clear all 10 levels of Neon Tower without Nova or any Nova costume.',
      vp_info_title: 'Neon Viper — How to Play',
      vp_tagline: 'Steer the snake, eat the diamonds, stay alive.',
      vp_sec_items: 'ITEMS',
      vp_i1: '<b>◆ Diamond:</b> eat it to grow longer and score. In level mode each level ends after 10 diamonds.',
      vp_i2: '<b>★ Bonus:</b> stays on screen for a short time, +30 points if you eat it.',
      vp_i3: '<b>✕ Obstacle:</b> appears in level mode, hit one and the run ends.',
      vp_m1: '<b>Unlimited mode:</b> walls wrap around to the other side. Just don\'t hit yourself or obstacles.',
      vp_m2: '<b>Classic mode:</b> hitting a wall or yourself ends the run. The snake speeds up as you eat.',
      vp_m3: '<b>Level mode:</b> 10 levels, eat 10 diamonds in each. Obstacles and speed increase. Clear them all to earn a special badge.',
      vp_c1: '<b>Keyboard:</b> ◀ ▲ ▼ ▶ / WASD steer · P pause · M sound.',
      vp_c2: '<b>Touch:</b> swipe on the screen or use the on-screen arrows. You can move the arrows anywhere from the menu.',
      vp_c3: '<b>Losing:</b> hitting a wall (except in unlimited mode), yourself or an obstacle ends the run.',
      inst_hint: 'Install it on your phone like an app',
      prof_title: 'ARKAT — Profile',
      back_home: '◂ HOME',
      prof_h: 'PROFILE',
      prof_need: 'Sign in with Google to see your profile.',
      f_email: 'EMAIL', f_joined: 'JOINED', f_lastseen: 'LAST SIGN-IN',
      best_h: 'HIGH SCORES · NEON DROP',
      easy: 'Easy', medium: 'Medium', hard: 'Hard',
      no_score: 'No scores yet.',
      loading: 'LOADING…'
    },
    ja: {
      lang_name: '日本語',
      login: 'ログイン', logout: 'ログアウト', profile: 'プロフィール', signing: '接続中…',
      auth_off: 'ログインはまだ設定されていません（Firebase設定が空です）。',
      auth_err: 'ログインできませんでした。もう一度お試しください。',
      idx_title: 'ARKAT — レトロゲームセンター',
      idx_desc: 'ブラウザで無料で遊べるレトロゲーム。',
      nav_games: 'ゲーム',
      hero: 'コインを入れて<br>スタート',
      hero_p: 'ダウンロード不要、ブラウザで遊べるレトロゲーム。スマホでもPCでも動きます。',
      go_games: '▸ ゲーム一覧へ',
      sec_games: 'ゲーム', count: '3ゲーム',
      g_neon_t: 'NEON DROP',
      g_tower_t: 'NEON TOWER',
      g_neon_d: '線を描いて落ちてくる色つきブロックを誘導し、同じ色を4つそろえて爆発させよう。',
      tag_arcade: 'アーケード',
      soon_t: '近日公開', soon_d: 'ここに新しいゲームが追加されます。',
      footer: 'ARKAT · 個人のレトロゲームコレクション',
      info_title: 'NEON DROP — 遊び方',
      back_arkat: '◂ ARKATに戻る',
      game_name: 'NEON DROP',
      tagline: '線を描いて、ブロックを誘導して、同じ色を爆発させよう。',
      sec_states: 'ブロックの状態',
      s1: '落下中——まだ何にも触れていない。',
      s2: '落下中に線に触れるとアクティブになり、光る。',
      s3: '線に触れずに着地すると×になり、二度とアクティブにならない。',
      s4: '同じ色のアクティブなブロック4つがそろうと、全部爆発する。',
      sec_controls: '操作方法',
      c1: '<b>指 / マウス:</b> 画面を押したままドラッグして線を描く。',
      c2: '<b>線は最大2本:</b> 3本目を描くと、いちばん古い線がすぐ消える。',
      c3: '<b>ゲームオーバー:</b> ブロックの山が赤い線に届いたままになると負け。',
      start: '▸ ゲームスタート',
      // Neon Tower
      g_tower_d: 'ネオンの塔を足場から足場へ跳び、クリスタルを集め、障害をかわしてできるだけ高く登ろう。',
      tw_info_title: 'NEON TOWER — 遊び方',
      tw_tagline: 'ネオンの塔を跳んで、クリスタルを集めて、高みを目指そう。',
      tw_sec_items: 'アイテム',
      tw_i1: '<b>◆ クリスタル：</b>集めるとウォレットに入る。キャラ購入や復活に使える。',
      tw_i2: '<b>J ジェットパック：</b>短時間上昇し、障害物から身を守る。',
      tw_i3: '<b>M マグネット：</b>近くのクリスタルを引き寄せる。',
      tw_i4: '<b>バネ：</b>高く跳ね上がり、短時間シールドが付く。',
      tw_sec_modes: 'モード',
      tw_m1: '<b>クラシック：</b>だんだん速くなる無限の登り。ハイスコアが記録される。',
      tw_m2: '<b>レベルモード：</b>全10レベル、進むほど新しい障害が登場。初回クリアでクリスタルボーナス。',
      tw_m3: '<b>ハードモード：</b>レベル10クリアで解放、ゴールなし。',
      tw_sec_extra: 'スペシャルJと復活',
      tw_e1: '<b>スペシャルJ：</b>開始直後に300 ◆を払うと30階まで一気に飛べる。',
      tw_e2: '<b>復活：</b>落ちたら850 ◆で一度だけ続行できる。',
      tw_c1: '<b>キーボード：</b>◀ ▶ / A D 移動 · スペース / ▲ / W ジャンプ · P 一時停止 · J スペシャルJ。',
      tw_c2: '<b>タッチ：</b>画面の ◀ ▶ と ▲ ボタン。配置はメニューから変更できる。',
      tw_c3: '<b>ゲームオーバー：</b>画面の下に落ちると終了（一度だけ復活できる）。',
      best_drop: 'ハイスコア · NEON DROP',
      best_tower: 'NEON TOWER',
      mode_classic: 'クラシック', mode_hard: 'ハードモード', lv_done: 'クリア済みレベル',
      // ようこそ画面・ランキング・バッジ
      gate_title: 'ようこそ',
      gate_sub: '言語を選んで、続け方を選んでください。',
      gate_lang: '言語',
      gate_google: 'GOOGLEでログイン',
      gate_guest: 'ゲストとして続ける',
      gate_note: 'ログインするとスコアとバッジがアカウントに保存され、世界ランキングに参加できます。ゲストでも遊べますが、ランキングには載りません。',
      world: '世界', you: 'あなた',
      lb_empty: 'このランキングにはまだ誰もいません。',
      lb_loading: '読み込み中…', lb_close: '閉じる',
      lb_err: 'ランキングを読み込めませんでした。',
      tap_rank: 'スコアをタップするとランキングが見られます。',
      scores_h2: 'ハイスコア', scores_h: 'マイハイスコア', badges_h: 'バッジ', badge_new: '新しいバッジ！',
      badge_tower_nova_n: 'ノヴァ・エージェント',
      badge_tower_nova_d: 'NEON TOWERの全10レベルをクリアしよう。',
      // Arama, ayarlar, arkadaşlar, kurulum, yeni oyun
      g_viper_t: 'NEON VIPER',
      g_viper_d: 'ネオンのグリッドでヘビを操り、ダイヤを食べて長くなり、障害物を避けよう。',
      search: '検索',
      search_ph: 'ゲームや人を検索…',
      sr_people: 'ユーザー',
      sr_none: '見つかりませんでした。',
      sr_type: 'ユーザー検索は2文字以上入力してください。',
      sr_game_tag: 'ゲーム',
      settings_h: '設定',
      set_photo: 'プロフィール画像',
      set_upload: '写真をアップロード',
      set_google: 'Googleの写真を使う',
      set_presets: 'またはアバターを選ぶ',
      set_username: 'ユーザー名',
      set_name: '名前（任意）',
      set_first: '名',
      set_last: '姓',
      set_save: '保存',
      set_saved: '保存しました！',
      set_err: '保存できませんでした。もう一度お試しください。',
      set_photo_err: 'この画像を読み込めませんでした。別の画像をお試しください。',
      set_hint_name: '変更は自由です。名だけ、姓だけでもOK。空欄の項目は変更されません。',
      un_title: 'ユーザー名を決めよう',
      un_sub: 'ランキングやフレンド一覧にこの名前で表示されます。ユーザー名は一人ひとり固有で、他の人は同じ名前を使えません。',
      un_rules: '3〜16文字：英字・数字・_',
      un_ph: 'username',
      un_ok: 'この名前は使えます！',
      un_taken: 'この名前はすでに使われています。別の名前をお試しください。',
      un_bad: '英字(a-z)・数字・_のみ、3〜16文字で入力してください。',
      un_reserved: 'この名前は使えません。',
      un_checking: '確認中…',
      un_take: 'この名前にする',
      un_same: '現在のユーザー名です。',
      friends_h: 'フレンド',
      fr_add: 'フレンド申請',
      fr_sent: '申請済み',
      fr_cancel: '申請を取り消す',
      fr_accept: '承認',
      fr_decline: '拒否',
      fr_friends: 'フレンド ✓',
      fr_remove: 'フレンド解除',
      fr_requests: '届いている申請',
      fr_waiting: '返事待ち',
      fr_none: 'まだフレンドがいません。検索ボタンで人を探して追加しましょう。',
      fr_login: 'フレンドを追加するにはログインしてください。',
      user_notfound: 'ユーザーが見つかりません。',
      user_title: 'ARKAT — プレイヤー',
      this_you: 'あなたです',
      install: 'アプリをインストール',
      install_short: 'インストール',
      ios_title: 'ホーム画面に追加',
      ios_steps: 'Safariで共有アイコンをタップし、「ホーム画面に追加」を選んでください。',
      mode_unlimited: '無制限モード',
      mode_level: 'レベルモード',
      badge_viper_master_n: 'バイパーマスター',
      badge_viper_master_d: 'NEON VIPERの全10レベルをクリアしよう。',
      badge_tower_solo_n: 'ノヴァなしの英雄',
      badge_tower_solo_d: 'ノヴァとノヴァのコスチュームを使わずに、NEON TOWERの全10レベルをクリアしよう。',
      vp_info_title: 'NEON VIPER — 遊び方',
      vp_tagline: 'ヘビを操って、ダイヤを食べて、生き残ろう。',
      vp_sec_items: 'アイテム',
      vp_i1: '<b>◆ ダイヤ：</b>食べるとヘビが伸びてスコアが入る。レベルモードでは10個で1レベルクリア。',
      vp_i2: '<b>★ ボーナス：</b>短時間だけ現れる。食べると+30点。',
      vp_i3: '<b>✕ 障害物：</b>レベルモードで登場。ぶつかるとゲームオーバー。',
      vp_m1: '<b>無制限モード：</b>壁を通り抜けて反対側に出る。自分と障害物にだけ注意。',
      vp_m2: '<b>クラシックモード：</b>壁か自分にぶつかると終了。食べるほど速くなる。',
      vp_m3: '<b>レベルモード：</b>全10レベル、各レベルでダイヤを10個食べる。障害物と速度が増える。全クリアで特別バッジ。',
      vp_c1: '<b>キーボード：</b>◀ ▲ ▼ ▶ / WASD 移動 · P 一時停止 · M サウンド。',
      vp_c2: '<b>タッチ：</b>画面をスワイプするか、画面上の矢印を使う。矢印の位置はメニューから動かせる。',
      vp_c3: '<b>ゲームオーバー：</b>壁（無制限モード以外）、自分、障害物にぶつかると終了。',
      inst_hint: 'スマホにアプリのようにインストール',
      prof_title: 'ARKAT — プロフィール',
      back_home: '◂ ホーム',
      prof_h: 'プロフィール',
      prof_need: 'Googleでログインするとプロフィールが見られます。',
      f_email: 'メール', f_joined: '登録日', f_lastseen: '最終ログイン',
      best_h: 'ハイスコア · NEON DROP',
      easy: 'かんたん', medium: 'ふつう', hard: 'むずかしい',
      no_score: 'まだスコアがありません。',
      loading: '読み込み中…'
    }
  };

  // ======= 3) Dil yönetimi =======
  var KEY = 'arkat-lang';
  function detect() {
    try { var s = localStorage.getItem(KEY); if (s && D[s]) return s; } catch (e) {}
    var n = (navigator.language || 'tr').slice(0, 2).toLowerCase();
    return D[n] ? n : 'tr';
  }
  var lang = detect();
  function t(k) { return (D[lang] && D[lang][k] != null) ? D[lang][k] : (D.en[k] || k); }

  function applyI18n() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (e) { e.innerHTML = t(e.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (e) { e.setAttribute('placeholder', t(e.getAttribute('data-i18n-ph'))); });
    document.querySelectorAll('[data-i18n-title]').forEach(function (e) { e.setAttribute('title', t(e.getAttribute('data-i18n-title'))); });
    var tk = document.documentElement.getAttribute('data-title');
    if (tk) document.title = t(tk);
    var dk = document.documentElement.getAttribute('data-desc');
    var md = document.querySelector('meta[name=description]');
    if (dk && md) md.setAttribute('content', t(dk));
    document.querySelectorAll('.lang-btn').forEach(function (b) { b.classList.toggle('on', b.dataset.l === lang); });
    renderAuth();
    document.dispatchEvent(new CustomEvent('arkat:lang', { detail: lang }));
  }
  function setLang(l) {
    if (!D[l]) return;
    lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    applyI18n();
    if (fbUser && db) { db.collection('users').doc(fbUser.uid).set({ lang: l }, { merge: true }).catch(function () {}); }
  }

  // ======= 4) Yardımcılar =======
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function toast(msg) {
    var m = document.getElementById('arkat-msg');
    if (!m) { m = document.createElement('div'); m.id = 'arkat-msg'; document.body.appendChild(m); }
    m.textContent = msg; m.style.display = 'block';
    clearTimeout(toast._t); toast._t = setTimeout(function () { m.style.display = 'none'; }, 3500);
  }
  function serverTs() { return firebase.firestore.FieldValue.serverTimestamp(); }

  // Profil resmi: çizgili (CRT) görünüm sayfa katmanından gelir; pencerelerde .avt kendi çizgisini ekler
  function avatar(photo, size, cls) {
    var w = el('span', 'avt' + (cls ? ' ' + cls : ''));
    w.style.width = w.style.height = size + 'px';
    var img = document.createElement('img');
    img.alt = ''; img.referrerPolicy = 'no-referrer';
    if (photo) img.src = photo; else img.style.visibility = 'hidden';
    img.onerror = function () { img.style.visibility = 'hidden'; };
    w.appendChild(img);
    return w;
  }
  function publicName(p) {
    if (!p) return '';
    var f = (p.firstName || '').trim(), l = (p.lastName || '').trim();
    if (!f && !l) return '';
    return l ? (f + ' ' + l.charAt(0).toUpperCase() + '.').trim() : f;
  }
  function shownName(p) { return (p && p.username) || publicName(p) || 'Player'; }
  function userLink(uid, username) {
    if (fbUser && uid === fbUser.uid) return rootPath + 'profile.html';
    return rootPath + 'user.html?' + (username ? 'u=' + encodeURIComponent(username) : 'id=' + encodeURIComponent(uid));
  }

  // ======= 5) Üst çubuk (arama + dil + giriş) =======
  var css = '' +
    '#arkat-bar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:flex-end;font-family:"Press Start 2P","DotGothic16",system-ui,sans-serif}' +
    '#arkat-bar .langs{display:flex;gap:6px}' +
    '#arkat-bar .lang-btn,#arkat-bar .srch-btn{background:#150c26;color:#9c8fc4;border:2px solid #3a2a5c;padding:7px 8px;font:inherit;font-size:10px;cursor:pointer}' +
    '#arkat-bar .lang-btn:hover,#arkat-bar .srch-btn:hover{color:#f5f0ff;border-color:#00fff2}' +
    '#arkat-bar .lang-btn.on{color:#0a0612;background:#00fff2;border-color:#00fff2}' +
    '#arkat-bar .srch-btn{display:inline-flex;align-items:center;justify-content:center;padding:6px 8px}' +
    '#arkat-bar .srch-btn svg{width:16px;height:16px}' +
    '#arkat-bar .auth-btn{background:#150c26;color:#f5f0ff;border:2px solid #00fff2;box-shadow:3px 3px 0 #ff2a6d;padding:8px 12px;font:inherit;font-size:10px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;text-decoration:none}' +
    '#arkat-bar .auth-btn:hover{transform:translate(1px,1px);box-shadow:2px 2px 0 #ff2a6d}' +
    '#arkat-bar .auth-btn[disabled]{opacity:.6;cursor:wait}' +
    '#arkat-bar .auth-btn .nmx{max-width:96px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#arkat-bar .pend{background:#ff2a6d;color:#fff;font-size:9px;min-width:16px;height:16px;line-height:16px;text-align:center;padding:0 3px}' +
    '#arkat-bar .me{display:flex;align-items:center;gap:8px}' +
    '#arkat-bar .out{background:none;border:none;color:#9c8fc4;font:inherit;font-size:10px;cursor:pointer;padding:4px}' +
    '#arkat-bar .out:hover{color:#ff2a6d}' +
    // profil resmi
    '.avt{position:relative;display:inline-block;flex:0 0 auto;overflow:hidden;background:#3a2a5c;border:2px solid #ffb000;vertical-align:middle}' +
    '.avt img{display:block;width:100%;height:100%;object-fit:cover}' +
    '.avt.big{border-width:3px;box-shadow:0 0 14px #ffb00066}' +
    '#arkat-lb .avt,#arkat-search .avt{border-color:#3a2a5c}' +
    '#arkat-lb .avt::after,#arkat-search .avt::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(rgba(0,0,0,0) 0 2px,rgba(0,0,0,.16) 2px 4px);mix-blend-mode:multiply;pointer-events:none}' +
    // sıralama ve arama pencereleri
    '#arkat-lb,#arkat-search{position:fixed;inset:0;z-index:300;background:rgba(10,6,18,.88);display:flex;align-items:center;justify-content:center;padding:16px}' +
    '#arkat-search{align-items:flex-start;padding-top:8vh}' +
    '#arkat-lb .box,#arkat-search .box{width:100%;max-width:460px;max-height:86vh;display:flex;flex-direction:column;background:#150c26;border:3px solid #00fff2;box-shadow:6px 6px 0 #ff2a6d;font-family:"VT323","DotGothic16",monospace;color:#f5f0ff}' +
    '#arkat-lb .hd,#arkat-search .hd{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 16px;border-bottom:3px solid #3a2a5c}' +
    '#arkat-lb .hd h3{margin:0;font:12px/1.6 "Press Start 2P","DotGothic16",system-ui;color:#ffb000}' +
    '#arkat-lb .x,#arkat-search .x{background:#150c26;color:#f5f0ff;border:2px solid #3a2a5c;font:10px "Press Start 2P","DotGothic16",system-ui;padding:8px 10px;cursor:pointer}' +
    '#arkat-lb .x:hover,#arkat-search .x:hover{border-color:#ff2a6d}' +
    '#arkat-lb .ls,#arkat-search .ls{overflow:auto;padding:8px 10px 12px}' +
    '#arkat-lb .msg,#arkat-search .msg{padding:22px;text-align:center;color:#9c8fc4;font-size:20px}' +
    '#arkat-lb .r,#arkat-search .r{display:flex;align-items:center;gap:10px;padding:8px 8px;border-bottom:2px solid #24173f;font-size:21px;color:inherit;text-decoration:none;cursor:pointer}' +
    '#arkat-lb .r:hover,#arkat-search .r:hover{background:#1d1136}' +
    '#arkat-lb .r.me{background:#00fff21a;border:2px solid #00fff2}' +
    '#arkat-lb .r.focus{background:#ffb0001a;border:2px solid #ffb000}' +
    '#arkat-lb .n{flex:0 0 40px;text-align:right;font:11px "Press Start 2P",system-ui;color:#9c8fc4}' +
    '#arkat-lb .r:nth-child(1) .n{color:#ffd23f}#arkat-lb .r:nth-child(2) .n{color:#d6d6e6}#arkat-lb .r:nth-child(3) .n{color:#ff9d5c}' +
    '#arkat-lb .nm,#arkat-search .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#arkat-search .nm small{display:block;color:#9c8fc4;font-size:16px;line-height:1}' +
    '#arkat-lb .yo{color:#00fff2;font-size:16px;margin-left:6px}' +
    '#arkat-lb .sc{color:#f5f0ff;font-size:24px}' +
    '#arkat-search .sin{flex:1;min-width:0;background:#0a0612;color:#f5f0ff;border:3px solid #3a2a5c;padding:10px 12px;font:22px "VT323","DotGothic16",monospace;outline:none}' +
    '#arkat-search .sin:focus{border-color:#00fff2}' +
    '#arkat-search .sec{font:10px/1.6 "Press Start 2P","DotGothic16",system-ui;color:#ffb000;margin:12px 6px 6px}' +
    '#arkat-search .gi{width:36px;height:36px;border:2px solid #3a2a5c;flex:0 0 auto;overflow:hidden;background:#0d0818}' +
    '#arkat-search .gi svg{display:block;width:100%;height:100%}' +
    '#arkat-search .tg{font:9px "Press Start 2P","DotGothic16",system-ui;color:#0a0612;background:#ffb000;padding:4px 6px}' +
    // kullanıcı adı penceresi
    '#arkat-un{position:fixed;inset:0;z-index:500;background:rgba(10,6,18,.96);display:flex;align-items:center;justify-content:center;padding:18px;overflow:auto}' +
    '#arkat-un .box{width:100%;max-width:440px;background:#150c26;border:3px solid #ffb000;box-shadow:7px 7px 0 #ff2a6d;padding:24px 22px;text-align:center;font-family:"VT323","DotGothic16",monospace;color:#f5f0ff}' +
    '#arkat-un h2{margin:0 0 12px;font:14px/1.6 "Press Start 2P","DotGothic16",system-ui;color:#ffb000}' +
    '#arkat-un p{margin:0 0 14px;color:#9c8fc4;font-size:20px;line-height:1.3}' +
    '.unin{width:100%;background:#0a0612;color:#f5f0ff;border:3px solid #3a2a5c;padding:12px;font:24px "VT323","DotGothic16",monospace;text-align:center;outline:none}' +
    '.unin:focus{border-color:#00fff2}' +
    '.unst{min-height:26px;margin:8px 0 12px;font-size:19px;color:#9c8fc4}' +
    '.unst.ok{color:#39ff14}.unst.bad{color:#ff2a6d}' +
    '.abtn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#150c26;color:#f5f0ff;border:3px solid #00fff2;box-shadow:4px 4px 0 #ff2a6d;padding:13px 16px;font:11px/1.5 "Press Start 2P","DotGothic16",system-ui;cursor:pointer;text-decoration:none}' +
    '.abtn:hover:not([disabled]){transform:translate(2px,2px);box-shadow:2px 2px 0 #ff2a6d}' +
    '.abtn[disabled]{opacity:.4;cursor:not-allowed;box-shadow:none}' +
    '.abtn.sm{padding:9px 10px;font-size:9px;box-shadow:3px 3px 0 #ff2a6d}' +
    '.abtn.ghost{border-color:#3a2a5c;box-shadow:3px 3px 0 #000}' +
    '.abtn.warn{border-color:#ff2a6d;box-shadow:3px 3px 0 #000}' +
    // iOS yükleme yardımı
    '#arkat-ios{position:fixed;inset:0;z-index:450;background:rgba(10,6,18,.9);display:flex;align-items:center;justify-content:center;padding:18px}' +
    '#arkat-ios .box{max-width:400px;width:100%;background:#150c26;border:3px solid #00fff2;box-shadow:6px 6px 0 #ff2a6d;padding:22px;text-align:center;font:21px/1.3 "VT323","DotGothic16",monospace;color:#f5f0ff}' +
    '#arkat-ios h3{margin:0 0 12px;font:12px/1.6 "Press Start 2P","DotGothic16",system-ui;color:#ffb000}' +
    // rozet penceresi
    '#arkat-badge{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:350;background:#150c26;border:3px solid #ffd23f;box-shadow:0 0 0 4px #0a0612,8px 8px 0 #ff2a6d;padding:22px 26px;text-align:center;font-family:"VT323","DotGothic16",monospace;color:#f5f0ff;cursor:pointer;max-width:86vw;animation:abpop .35s steps(5)}' +
    '#arkat-badge .t{font:12px/1.6 "Press Start 2P","DotGothic16",system-ui;color:#ffd23f;margin-bottom:10px}' +
    '#arkat-badge .nm{font:13px/1.6 "Press Start 2P","DotGothic16",system-ui;margin-top:8px}' +
    '#arkat-badge .ds{color:#9c8fc4;font-size:19px;margin-top:6px}' +
    '#arkat-badge svg{width:120px;height:120px}' +
    '@keyframes abpop{0%{transform:translate(-50%,-50%) scale(.2)}100%{transform:translate(-50%,-50%) scale(1)}}' +
    '#arkat-msg{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:600;background:#150c26;border:3px solid #ff2a6d;color:#f5f0ff;padding:10px 14px;font:18px "VT323","DotGothic16",monospace;max-width:90vw;display:none}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var authBox;
  var SEARCH_SVG = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M10 10L14.5 14.5"/></svg>';
  function buildBar() {
    var bar = document.getElementById('arkat-bar');
    if (!bar) return;
    var sb = el('button', 'srch-btn'); sb.type = 'button'; sb.innerHTML = SEARCH_SVG;
    sb.setAttribute('aria-label', 'search');
    sb.addEventListener('click', openSearch);
    var langs = el('div', 'langs');
    LANGS.forEach(function (l) {
      var b = el('button', 'lang-btn', l[1]);
      b.dataset.l = l[0]; b.title = l[2];
      b.addEventListener('click', function () { setLang(l[0]); });
      langs.appendChild(b);
    });
    authBox = el('div');
    bar.appendChild(sb); bar.appendChild(langs); bar.appendChild(authBox);
  }

  var rootPath = '';
  try { rootPath = document.currentScript.getAttribute('data-root') || ''; } catch (e) {}

  function renderAuth() {
    if (!authBox) return;
    authBox.innerHTML = '';
    if (fbUser) {
      var wrap = el('div', 'me');
      var a = el('a', 'auth-btn'); a.href = rootPath + 'profile.html';
      a.appendChild(avatar((profile && profile.photo) || fbUser.photoURL, 22, 'tiny'));
      var label = (profile && profile.username) || (fbUser.displayName || t('profile')).split(' ')[0];
      a.appendChild(el('span', 'nmx', label.toUpperCase()));
      var pc = pendingCount();
      if (pc) a.appendChild(el('span', 'pend', String(pc)));
      var out = el('button', 'out', t('logout'));
      out.addEventListener('click', signOut);
      wrap.appendChild(a); wrap.appendChild(out); authBox.appendChild(wrap);
    } else {
      var b = el('button', 'auth-btn', busy ? t('signing') : ('G  ' + t('login')));
      if (busy) b.disabled = true;
      b.addEventListener('click', signIn);
      authBox.appendChild(b);
    }
  }

  // ======= 6) Firebase / Google giriş =======
  var fbUser = null, db = null, auth = null, busy = false, profile = null, friendCache = null;
  var configured = !!(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);
  var SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }
  var initP = null;
  function initFirebase() {
    if (!configured) return Promise.reject(new Error('no-config'));
    if (initP) return initP;
    initP = loadScript(SDK + 'firebase-app-compat.js')
      .then(function () { return Promise.all([loadScript(SDK + 'firebase-auth-compat.js'), loadScript(SDK + 'firebase-firestore-compat.js')]); })
      .then(function () {
        firebase.initializeApp(FIREBASE_CONFIG);
        auth = firebase.auth(); db = firebase.firestore();
        auth.onAuthStateChanged(function (u) {
          fbUser = u; busy = false; profile = null; friendCache = null;
          renderAuth();
          if (!u) { document.dispatchEvent(new CustomEvent('arkat:auth', { detail: null })); return; }
          ensureUser(u).catch(function () {
            // Firestore kuralları güncel değilse bile siteyi kullanılabilir tut
            if (!profile) profile = { uid: u.uid, firstName: '', lastName: '', photo: u.photoURL || '', best: {}, badges: {} };
          }).then(function () {
            if (fbUser !== u) return;
            renderAuth();
            document.dispatchEvent(new CustomEvent('arkat:auth', { detail: u }));
            document.dispatchEvent(new CustomEvent('arkat:profile', { detail: profile }));
            maybePromptUsername();
            loadFriendships(true).then(renderAuth);
          });
        });
        auth.getRedirectResult().catch(function () {});
      });
    return initP;
  }

  // Kayıt + geçiş: users (özel) ve profiles (herkese açık) belgeleri
  function legacyPatch(p, ud) {
    var best = JSON.parse(JSON.stringify(p.best || {})), bch = false, ob = (ud && ud.best) || {};
    Object.keys(ob).forEach(function (g) {
      Object.keys(ob[g] || {}).forEach(function (d) {
        var v = ob[g][d];
        if (v > ((best[g] || {})[d] || 0)) { best[g] = best[g] || {}; best[g][d] = v; bch = true; }
      });
    });
    var badges = Object.assign({}, p.badges || {}), kch = false, obd = (ud && ud.badges) || {};
    Object.keys(obd).forEach(function (id) { if (!badges[id]) { badges[id] = obd[id]; kch = true; } });
    var patch = null;
    if (bch || kch) { patch = {}; if (bch) patch.best = best; if (kch) patch.badges = badges; }
    return patch;
  }
  function ensureUser(u) {
    var uref = db.collection('users').doc(u.uid), pref = db.collection('profiles').doc(u.uid);
    return Promise.all([uref.get(), pref.get()]).then(function (r) {
      var us = r[0], ps = r[1], ud = us.exists ? us.data() : {}, now = serverTs(), jobs = [], created = false;
      jobs.push(uref.set(us.exists ? { lastLogin: now, lang: lang } : { email: u.email || '', lang: lang, createdAt: now, lastLogin: now }, { merge: true }));
      if (ps.exists) {
        profile = ps.data();
        var patch = legacyPatch(profile, ud) || {};
        if (profile.photoSrc !== 'custom' && u.photoURL && profile.photo !== u.photoURL) { patch.photo = u.photoURL; patch.photoSrc = 'google'; }
        if (Object.keys(patch).length) { jobs.push(pref.set(patch, { merge: true })); Object.assign(profile, patch); }
      } else {
        var parts = (u.displayName || '').trim().split(/\s+/);
        var np = { uid: u.uid, firstName: parts[0] || '', lastName: parts.slice(1).join(' '), photo: u.photoURL || '', photoSrc: 'google', best: ud.best || {}, badges: ud.badges || {}, createdAt: ud.createdAt || now };
        jobs.push(pref.set(np)); profile = np; created = true;
      }
      return Promise.all(jobs).then(function () {
        return created ? pref.get().then(function (s) { if (s.exists) profile = s.data(); }) : null;
      });
    }).then(function () { syncBadges(profile); });
  }

  function signIn() {
    if (!configured) { toast(t('auth_off')); return; }
    busy = true; renderAuth();
    initFirebase().then(function () {
      var p = new firebase.auth.GoogleAuthProvider();
      return auth.signInWithPopup(p).catch(function (e) {
        if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) return auth.signInWithRedirect(p);
        throw e;
      });
    }).catch(function (e) {
      busy = false; renderAuth();
      if (!e || e.code !== 'auth/popup-closed-by-user') toast(t('auth_err'));
    });
  }
  function signOut() {
    try { localStorage.removeItem('arkat-entry'); } catch (e) {}
    if (auth) auth.signOut();
    document.dispatchEvent(new CustomEvent('arkat:signout'));
  }

  // ======= 7) Skor kaydı =======
  function saveScore(game, diff, score) {
    score = Math.floor(score);
    if (!fbUser || !db || !(score > 0)) return Promise.resolve();
    var ref = db.collection('profiles').doc(fbUser.uid);
    return db.runTransaction(function (tx) {
      return tx.get(ref).then(function (s) {
        var d = s.exists ? s.data() : {}, best = d.best || {}, g = best[game] || {};
        if (!(score > (g[diff] || 0))) return;
        g[diff] = score; best[game] = g;
        tx.set(ref, { best: best }, { merge: true });
        if (profile) profile.best = best;
      });
    }).catch(function () {}).then(function () { return writeBoard(game + '_' + diff, score); });
  }

  // ======= 8) Dünya sıralaması =======
  // Tablo kimlikleri: oyun_zorluk (neon_e = Neon Düşüş Kolay, tower_h = Neon Tower Zor mod ...)
  var BOARDS = { neon_e: 1, neon_m: 1, neon_d: 1, tower_c: 1, tower_h: 1, viper_u: 1, viper_c: 1, viper_l: 1 };
  var boardCache = {};
  function shortName(n) {
    n = (n || '').trim(); if (!n) return 'Player';
    var p = n.split(/\s+/);
    return p.length > 1 ? p[0] + ' ' + p[p.length - 1].charAt(0).toUpperCase() + '.' : p[0];
  }
  function boardIdentity() {
    return {
      name: (profile && profile.username) || shortName(fbUser && fbUser.displayName),
      photo: (profile && profile.photo) || (fbUser && fbUser.photoURL) || ''
    };
  }
  function writeBoard(id, score) {
    score = Math.floor(score);
    if (!fbUser || !db || !BOARDS[id] || !(score > 0)) return Promise.resolve();
    var ref = db.collection('boards').doc(id).collection('entries').doc(fbUser.uid);
    var who = boardIdentity();
    return db.runTransaction(function (tx) {
      return tx.get(ref).then(function (s) {
        if (s.exists && !(score > s.data().score)) return;
        tx.set(ref, { uid: fbUser.uid, name: who.name, photo: who.photo, score: score, t: serverTs() });
      });
    }).then(function () { delete boardCache[id]; }).catch(function () {});
  }
  // Ad ya da resim değişince tablolardaki satırları da güncelle
  function refreshBoardEntries() {
    if (!fbUser || !db) return Promise.resolve();
    var who = boardIdentity();
    return Promise.all(Object.keys(BOARDS).map(function (id) {
      var ref = db.collection('boards').doc(id).collection('entries').doc(fbUser.uid);
      return ref.get().then(function (s) {
        if (!s.exists) return;
        return ref.update({ name: who.name, photo: who.photo }).then(function () { delete boardCache[id]; });
      }).catch(function () {});
    }));
  }
  // Profilde, tablolara henüz yazılmamış eski skorları bir kez içeri aktarır
  function syncBoards(best) {
    if (!fbUser || !best) return Promise.resolve();
    var k = 'arkat-synced-' + fbUser.uid;
    try { if (sessionStorage.getItem(k)) return Promise.resolve(); sessionStorage.setItem(k, '1'); } catch (e) {}
    var jobs = [];
    Object.keys(BOARDS).forEach(function (id) {
      var gd = id.split('_'), v = best[gd[0]] && best[gd[0]][gd[1]];
      if (v > 0) jobs.push(writeBoard(id, v));
    });
    return Promise.all(jobs);
  }
  function getBoard(id, limit) {
    if (boardCache[id]) return boardCache[id];
    var p = initFirebase().then(function () {
      return db.collection('boards').doc(id).collection('entries').orderBy('score', 'desc').limit(limit || 100).get();
    }).then(function (q) {
      return q.docs.map(function (d) { var x = d.data(); return { uid: x.uid || d.id, name: x.name || '', photo: x.photo || '', score: x.score || 0 }; });
    });
    boardCache[id] = p;
    p.catch(function () { delete boardCache[id]; });
    return p;
  }
  // Sıra = senden yüksek skor sayısı + 1 (eşit skor aynı sırayı paylaşır). İlk 100'de değilse null.
  function rankOf(list, uid) {
    var me = null, i;
    for (i = 0; i < list.length; i++) if (list[i].uid === uid) { me = list[i]; break; }
    if (!me) return null;
    var higher = 0;
    for (i = 0; i < list.length; i++) if (list[i].score > me.score) higher++;
    return higher + 1;
  }
  function closeBoard() {
    var o = document.getElementById('arkat-lb'); if (o) o.remove();
    document.removeEventListener('keydown', lbKey);
  }
  function lbKey(e) { if (e.key === 'Escape') closeBoard(); }
  function showBoard(id, title, focusUid) {
    closeBoard();
    var ov = el('div'); ov.id = 'arkat-lb';
    var box = el('div', 'box');
    var hd = el('div', 'hd');
    hd.appendChild(el('h3', null, '\uD83C\uDF0D ' + t('world') + ' · ' + title));
    var x = el('button', 'x', t('lb_close')); x.addEventListener('click', closeBoard);
    hd.appendChild(x);
    var ls = el('div', 'ls');
    ls.appendChild(el('div', 'msg', t('lb_loading')));
    box.appendChild(hd); box.appendChild(ls); ov.appendChild(box);
    ov.addEventListener('click', function (e) { if (e.target === ov) closeBoard(); });
    document.body.appendChild(ov);
    document.addEventListener('keydown', lbKey);
    getBoard(id, 100).then(function (list) {
      ls.innerHTML = '';
      if (!list.length) { ls.appendChild(el('div', 'msg', t('lb_empty'))); return; }
      var myUid = fbUser && fbUser.uid;
      list.forEach(function (it) {
        var higher = 0; for (var j = 0; j < list.length; j++) if (list[j].score > it.score) higher++;
        var r = el('a', 'r' + (it.uid === myUid ? ' me' : (it.uid === focusUid ? ' focus' : '')));
        r.href = userLink(it.uid, null);
        r.appendChild(el('span', 'n', '#' + (higher + 1)));
        r.appendChild(avatar(it.photo, 30));
        var nm = el('span', 'nm', it.name);
        if (it.uid === myUid) nm.appendChild(el('span', 'yo', '◂ ' + t('you')));
        r.appendChild(nm);
        r.appendChild(el('span', 'sc', String(it.score)));
        ls.appendChild(r);
      });
    }).catch(function () { ls.innerHTML = ''; ls.appendChild(el('div', 'msg', t('lb_err'))); });
  }

  // ======= 9) Rozetler =======
  var BADGES = {
    tower_nova: { game: 'tower', n: 'badge_tower_nova_n', d: 'badge_tower_nova_d' },
    tower_solo: { game: 'tower', n: 'badge_tower_solo_n', d: 'badge_tower_solo_d' },
    viper_master: { game: 'viper', n: 'badge_viper_master_n', d: 'badge_viper_master_d' }
  };
  function localBadges() { try { return JSON.parse(localStorage.getItem('arkat-badges') || '{}'); } catch (e) { return {}; } }
  function saveLocalBadges(o) { try { localStorage.setItem('arkat-badges', JSON.stringify(o)); } catch (e) {} }
  function awardBadge(id) {
    if (!BADGES[id]) return;
    var lb = localBadges(), fresh = !lb[id];
    if (fresh) { lb[id] = Date.now(); saveLocalBadges(lb); }
    if (fbUser && db && profile && !(profile.badges && profile.badges[id])) {
      var u = { badges: {} }; u.badges[id] = serverTs();
      db.collection('profiles').doc(fbUser.uid).set(u, { merge: true }).catch(function () {});
      profile.badges = profile.badges || {}; profile.badges[id] = { toMillis: function () { return Date.now(); } };
    }
    if (fresh) badgePopup(id);
  }
  // Girişte: hesaptaki rozetler cihaza, cihazdaki (misafirken kazanılan) rozetler hesaba
  function syncBadges(p) {
    var cloud = (p && p.badges) || {}, local = localBadges(), changed = false, up = null;
    Object.keys(cloud).forEach(function (id) {
      if (!local[id]) { local[id] = cloud[id] && cloud[id].toMillis ? cloud[id].toMillis() : Date.now(); changed = true; }
    });
    Object.keys(local).forEach(function (id) {
      if (BADGES[id] && !cloud[id]) { up = up || { badges: {} }; up.badges[id] = serverTs(); }
    });
    if (changed) saveLocalBadges(local);
    if (up && fbUser && db) db.collection('profiles').doc(fbUser.uid).set(up, { merge: true }).catch(function () {});
  }
  function badgePopup(id) {
    var old = document.getElementById('arkat-badge'); if (old) old.remove();
    var b = el('div'); b.id = 'arkat-badge';
    b.appendChild(el('div', 't', t('badge_new')));
    var art = el('div'); art.innerHTML = badgeSvg(id, false); b.appendChild(art);
    b.appendChild(el('div', 'nm', t(BADGES[id].n)));
    b.appendChild(el('div', 'ds', t(BADGES[id].d)));
    b.addEventListener('click', function () { b.remove(); });
    document.body.appendChild(b);
    setTimeout(function () { if (b.parentNode) b.remove(); }, 7000);
  }

  // ======= 10) Simgeler, avatarlar ve rozet çizimleri (SVG) =======
  function heroSvg(skin, hair, accent) {
    return '<rect x="-5" y="-9" width="4" height="9" fill="#1b1040" stroke="' + accent + '" stroke-width="1"/>' +
      '<rect x="1" y="-9" width="4" height="9" fill="#1b1040" stroke="' + accent + '" stroke-width="1"/>' +
      '<rect x="-8" y="-23" width="16" height="15" rx="3" fill="#1b1040" stroke="' + accent + '" stroke-width="1.5"/>' +
      '<circle cx="-11" cy="-27" r="4" fill="' + hair + '"/><circle cx="11" cy="-27" r="4" fill="' + hair + '"/>' +
      '<circle cx="0" cy="-31" r="9" fill="' + skin + '"/>' +
      '<path d="M-9.5 -31A9.5 9.5 0 0 1 9.5 -31Q4 -38 0 -38Q-4 -38 -9.5 -31Z" fill="' + hair + '"/>' +
      '<rect x="-5" y="-31" width="2.6" height="4.4" fill="#0a0612"/><rect x="2.4" y="-31" width="2.6" height="4.4" fill="#0a0612"/>';
  }
  function icon(name) {
    if (name === 'drop') {
      return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" fill="#0d0818"/>' +
        '<rect x="9" y="30" width="14" height="14" fill="#2f8bff55" stroke="#2f8bff" stroke-width="2"/>' +
        '<rect x="25" y="13" width="14" height="14" fill="#ffe60055" stroke="#ffe600" stroke-width="2"/>' +
        '<rect x="41" y="34" width="14" height="14" fill="#39ff1455" stroke="#39ff14" stroke-width="2"/>' +
        '<path d="M6 57H58" stroke="#ff2a55" stroke-width="3" stroke-dasharray="5 3"/></svg>';
    }
    if (name === 'tower') {
      return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" fill="#0d0818"/>' +
        '<rect x="2" y="36" width="11" height="28" fill="#1b1040"/><rect x="51" y="26" width="11" height="38" fill="#1b1040"/>' +
        '<rect x="30" y="31" width="24" height="4" rx="2" fill="#19e6ff"/>' +
        '<rect x="8" y="55" width="30" height="4" rx="2" fill="#ff2bd6"/>' +
        '<g transform="translate(23 55) scale(.78)">' + heroSvg('#ffe3d6', '#ff2bd6', '#19e6ff') + '</g>' +
        '<polygon points="44,10 50,19 44,28 38,19" fill="#19e6ff" stroke="#fff" stroke-width="1"/></svg>';
    }
    if (name === 'viper') {
      return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="64" fill="#0d0818"/>' +
        '<g stroke="#7850ff33" stroke-width="1"><path d="M0 16H64M0 32H64M0 48H64M16 0V64M32 0V64M48 0V64"/></g>' +
        '<rect x="8" y="38" width="9" height="9" rx="2" fill="hsl(300,100%,60%)"/><rect x="17" y="38" width="9" height="9" rx="2" fill="hsl(285,100%,58%)"/>' +
        '<rect x="26" y="38" width="9" height="9" rx="2" fill="hsl(255,100%,58%)"/><rect x="26" y="29" width="9" height="9" rx="2" fill="hsl(235,100%,60%)"/>' +
        '<rect x="26" y="20" width="9" height="9" rx="2" fill="hsl(205,100%,60%)"/><rect x="35" y="20" width="9" height="9" rx="2" fill="#e8ffff"/>' +
        '<polygon points="52,28 56,34 52,40 48,34" fill="#ff2bd6" stroke="#fff" stroke-width="1"/></svg>';
    }
    return '';
  }
  function heroAvatar(o) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="' + (o.bg || '#150c26') + '"/>' +
      (o.ear ? '<polygon points="20,22 22,10 29,18" fill="' + o.hair + '"/><polygon points="44,22 42,10 35,18" fill="' + o.hair + '"/>' : '') +
      (o.halo ? '<ellipse cx="32" cy="8" rx="11" ry="3.4" fill="none" stroke="' + o.halo + '" stroke-width="2"/>' : '') +
      '<g transform="translate(32 63) scale(1.28)">' + heroSvg(o.skin, o.hair, o.accent) + '</g></svg>';
  }
  var PRESETS = [
    heroAvatar({ skin: '#ffe3d6', hair: '#ff2bd6', accent: '#19e6ff', bg: '#1b1040' }),
    heroAvatar({ skin: '#f6d3c0', hair: '#ff3b5c', accent: '#ffd23f', halo: '#ffd23f', bg: '#150c26' }),
    heroAvatar({ skin: '#f6d3c0', hair: '#19e6ff', accent: '#ffffff', halo: '#19e6ff', bg: '#10143a' }),
    heroAvatar({ skin: '#ffe3d6', hair: '#00ffb3', accent: '#ff2bd6', halo: '#ff2bd6', ear: 1, bg: '#0d2a2a' }),
    icon('drop'),
    icon('tower'),
    icon('viper')
  ];
  function svgDataUrl(svg) { return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg); }
  function badgeSvg(id, locked) {
    var col = locked ? '#5b5170' : '#ffd23f', hair = locked ? '#6b6080' : '#ff3b5c', skin = locked ? '#8a8099' : '#f6d3c0', acc = locked ? '#5b5170' : '#ff2a6d';
    if (id === 'tower_nova') {
      return '<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">' +
        '<polygon points="48,3 87,25 87,71 48,93 9,71 9,25" fill="#150c26" stroke="' + col + '" stroke-width="4"/>' +
        '<polygon points="48,11 80,29 80,67 48,85 16,67 16,29" fill="none" stroke="' + acc + '" stroke-width="2" opacity=".8"/>' +
        '<ellipse cx="48" cy="21" rx="17" ry="5.5" fill="none" stroke="' + col + '" stroke-width="3"/>' +
        '<rect x="29" y="43" width="6" height="22" fill="' + hair + '"/><rect x="61" y="43" width="6" height="22" fill="' + hair + '"/>' +
        '<circle cx="48" cy="46" r="18" fill="' + skin + '"/>' +
        '<path d="M29 45A19 19 0 0 1 67 45Q58 35 48 35Q38 35 29 45Z" fill="' + hair + '"/>' +
        '<rect x="39" y="47" width="5" height="7" fill="#0a0612"/><rect x="52" y="47" width="5" height="7" fill="#0a0612"/>' +
        '<rect x="44" y="58" width="8" height="2.5" fill="#0a0612"/>' +
        '<polygon points="48,70 53,77 48,84 43,77" fill="' + (locked ? '#5b5170' : '#19e6ff') + '"/>' +
        '</svg>';
    }
    if (id === 'tower_solo') {
      var c2 = locked ? '#5b5170' : '#19e6ff', pk = locked ? '#6b6080' : '#ff2bd6', sk2 = locked ? '#8a8099' : '#ffe3d6', rd = locked ? '#5b5170' : '#ff2a55';
      return '<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">' +
        '<polygon points="48,3 87,25 87,71 48,93 9,71 9,25" fill="#150c26" stroke="' + c2 + '" stroke-width="4"/>' +
        '<polygon points="48,11 80,29 80,67 48,85 16,67 16,29" fill="none" stroke="' + pk + '" stroke-width="2" opacity=".8"/>' +
        '<circle cx="31" cy="46" r="6" fill="' + pk + '"/><circle cx="65" cy="46" r="6" fill="' + pk + '"/>' +
        '<circle cx="48" cy="45" r="17" fill="' + sk2 + '"/>' +
        '<path d="M31 44A17.5 17.5 0 0 1 65 44Q57 34 48 34Q39 34 31 44Z" fill="' + pk + '"/>' +
        '<rect x="40" y="46" width="4.5" height="7" fill="#0a0612"/><rect x="51.5" y="46" width="4.5" height="7" fill="#0a0612"/>' +
        '<ellipse cx="48" cy="22" rx="16" ry="5" fill="none" stroke="' + (locked ? '#5b5170' : '#ffd23f') + '" stroke-width="3"/>' +
        '<path d="M28 12L68 32" stroke="' + rd + '" stroke-width="5" stroke-linecap="round"/>' +
        '<polygon points="48,68 53,75 48,82 43,75" fill="' + c2 + '"/>' +
        '</svg>';
    }
    if (id === 'viper_master') {
      var g1 = locked ? '#5b5170' : '#19e6ff', g2 = locked ? '#6b6080' : '#ff2bd6', gd = locked ? '#5b5170' : '#ffd23f';
      return '<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">' +
        '<polygon points="48,3 87,25 87,71 48,93 9,71 9,25" fill="#150c26" stroke="' + gd + '" stroke-width="4"/>' +
        '<polygon points="48,11 80,29 80,67 48,85 16,67 16,29" fill="none" stroke="' + g2 + '" stroke-width="2" opacity=".8"/>' +
        '<path d="M32 66C20 56 30 48 48 48C66 48 70 38 58 30" fill="none" stroke="' + g2 + '" stroke-width="9" stroke-linecap="round"/>' +
        '<path d="M32 66C20 56 30 48 48 48C66 48 70 38 58 30" fill="none" stroke="' + g1 + '" stroke-width="5" stroke-linecap="round"/>' +
        '<rect x="52" y="20" width="16" height="16" rx="4" fill="' + (locked ? '#8a8099' : '#e8ffff') + '"/>' +
        '<rect x="56" y="25" width="3" height="3" fill="#0a0612"/><rect x="62" y="25" width="3" height="3" fill="#0a0612"/>' +
        '<polygon points="26,76 31,70 36,76 31,82" fill="' + g2 + '"/>' +
        '</svg>';
    }
    return '';
  }

  // ======= 11) Oyun listesi + paylaşılan kartlar (kendi profil + başkasının profili) =======
  var GAMES = [
    { id: 'neon', t: 'g_neon_t', icon: 'drop', href: 'games/neon-dusus/info.html', kw: ['neon', 'drop', 'düşüş', 'dusus', 'ネオン'],
      boards: [['e', 'easy'], ['m', 'medium'], ['d', 'hard']], extra: [] },
    { id: 'tower', t: 'g_tower_t', icon: 'tower', href: 'games/neon-tower/info.html', kw: ['neon', 'tower', 'kule', 'タワー'],
      boards: [['c', 'mode_classic'], ['h', 'mode_hard']], extra: [['lv', 'lv_done', 10]] },
    { id: 'viper', t: 'g_viper_t', icon: 'viper', href: 'games/neon-viper/info.html', kw: ['neon', 'viper', 'yılan', 'yilan', 'snake', 'ヘビ', 'バイパー'],
      boards: [['u', 'mode_unlimited'], ['c', 'mode_classic'], ['l', 'mode_level']], extra: [['lv', 'lv_done', 10]] }
  ];
  function renderBadges(box, data) {
    box.innerHTML = '';
    var have = Object.assign({}, (data && data.badges) || {});
    Object.keys(BADGES).forEach(function (id) {
      var b = BADGES[id], got = !!have[id];
      var c = el('div', 'badge' + (got ? '' : ' lock'));
      var art = el('div'); art.innerHTML = badgeSvg(id, !got); c.appendChild(art);
      c.appendChild(el('div', 'bn', t(b.n)));
      c.appendChild(el('div', 'bd', t(b.d)));
      box.appendChild(c);
    });
  }
  function renderScoreCards(box, data, uid) {
    box.innerHTML = '';
    var best = (data && data.best) || {};
    GAMES.forEach(function (g) {
      var card = el('div', 'gcard');
      var head = el('div', 'ghead');
      var ic = el('div', 'gicon'); ic.innerHTML = icon(g.icon);
      head.appendChild(ic); head.appendChild(el('div', 'gname', t(g.t)));
      card.appendChild(head);
      var mine = best[g.id] || {};
      g.boards.forEach(function (bd) {
        var id = g.id + '_' + bd[0], score = mine[bd[0]] || 0;
        var row = el('button', 'srow'); row.type = 'button';
        row.appendChild(el('span', 'sl', t(bd[1])));
        var sv = el('span', 'sv');
        sv.appendChild(el('b', null, score ? String(score) : '—'));
        var rk = el('i', 'rk'); rk.appendChild(el('small', null, t('world')));
        var rv = el('span', null, score ? '…' : '—'); rk.appendChild(rv); sv.appendChild(rk);
        sv.appendChild(el('span', 'go', '›'));
        row.appendChild(sv);
        row.addEventListener('click', function () { showBoard(id, t(g.t) + ' · ' + t(bd[1]), uid); });
        card.appendChild(row);
        if (score) {
          getBoard(id, 100).then(function (list) {
            var r = rankOf(list, uid);
            rv.textContent = r ? '#' + r : (list.length >= 100 ? '100+' : '—');
          }).catch(function () { rv.textContent = '—'; });
        }
      });
      g.extra.forEach(function (ex) {
        var v = mine[ex[0]] || 0;
        var row = el('div', 'srow');
        row.appendChild(el('span', 'sl', t(ex[1])));
        var sv = el('span', 'sv'); sv.appendChild(el('b', null, v + ' / ' + ex[2]));
        row.appendChild(sv); card.appendChild(row);
      });
      box.appendChild(card);
    });
  }

  // ======= 12) Kullanıcı adı (benzersiz) =======
  var RESERVED = ['admin', 'administrator', 'arkat', 'moderator', 'mod', 'support', 'system', 'root', 'null', 'undefined', 'owner', 'staff', 'official', 'dedeguardian'];
  function validUsername(n) { return /^[a-zA-Z0-9_]{3,16}$/.test(n); }
  // Sonuç: 'bad' | 'reserved' | 'taken' | 'same' | 'ok'
  function checkUsername(n) {
    if (!validUsername(n)) return Promise.resolve('bad');
    var low = n.toLowerCase();
    if (RESERVED.indexOf(low) >= 0) return Promise.resolve('reserved');
    if (profile && profile.usernameLower === low) return Promise.resolve('same');
    return initFirebase().then(function () { return db.collection('usernames').doc(low).get(); })
      .then(function (s) { return s.exists ? 'taken' : 'ok'; });
  }
  function setUsername(n) {
    if (!fbUser || !db) return Promise.reject(new Error('auth'));
    return checkUsername(n).then(function (r) {
      if (r !== 'ok' && r !== 'same') throw new Error(r);
      var low = n.toLowerCase(), old = profile && profile.usernameLower;
      var batch = db.batch();
      if (old !== low) {
        batch.set(db.collection('usernames').doc(low), { uid: fbUser.uid, username: n });
        if (old) batch.delete(db.collection('usernames').doc(old));
      }
      batch.set(db.collection('profiles').doc(fbUser.uid), { username: n, usernameLower: low }, { merge: true });
      return batch.commit().catch(function (e) {
        if (e && e.code === 'permission-denied') throw new Error('taken');
        throw e;
      }).then(function () {
        profile = Object.assign(profile || {}, { username: n, usernameLower: low });
        renderAuth(); refreshBoardEntries();
        document.dispatchEvent(new CustomEvent('arkat:profile', { detail: profile }));
        return n;
      });
    });
  }
  // Ortak giriş kutusu davranışı (karşılama penceresi ve ayarlar)
  function bindUsernameField(inp, status, btn) {
    var timer = null;
    function say(key, cls) { status.textContent = key ? t(key) : ''; status.className = 'unst' + (cls ? ' ' + cls : ''); }
    inp.addEventListener('input', function () {
      var v = inp.value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 16);
      if (v !== inp.value) inp.value = v;
      btn.disabled = true; clearTimeout(timer);
      if (!v) { say(''); return; }
      if (!validUsername(v)) { say('un_bad', 'bad'); return; }
      say('un_checking', '');
      timer = setTimeout(function () {
        checkUsername(v).then(function (r) {
          if (inp.value !== v) return;
          if (r === 'ok') { say('un_ok', 'ok'); btn.disabled = false; }
          else if (r === 'same') { say('un_same', 'ok'); btn.disabled = (profile && profile.username === v); }
          else say(r === 'taken' ? 'un_taken' : (r === 'reserved' ? 'un_reserved' : 'un_bad'), 'bad');
        }).catch(function () { say('set_err', 'bad'); });
      }, 350);
    });
    return say;
  }
  function submitUsername(inp, status, btn, done) {
    btn.disabled = true;
    setUsername(inp.value).then(function () {
      status.textContent = t('set_saved'); status.className = 'unst ok';
      if (done) done();
    }).catch(function (e) {
      var m = e && e.message;
      status.textContent = t(m === 'taken' ? 'un_taken' : (m === 'reserved' ? 'un_reserved' : (m === 'bad' ? 'un_bad' : 'set_err')));
      status.className = 'unst bad';
    });
  }
  function maybePromptUsername() {
    if (!fbUser || !profile || profile.username) return;
    if (!document.getElementById('arkat-bar')) return;   // oyun sayfalarında oyunu bölme
    showUsernameModal();
  }
  function showUsernameModal() {
    if (document.getElementById('arkat-un')) return;
    var ov = el('div'); ov.id = 'arkat-un';
    var box = el('div', 'box');
    box.appendChild(el('h2', null, t('un_title')));
    box.appendChild(el('p', null, t('un_sub')));
    var inp = el('input', 'unin'); inp.type = 'text'; inp.maxLength = 16; inp.placeholder = t('un_ph');
    inp.autocomplete = 'off'; inp.autocapitalize = 'off'; inp.spellcheck = false;
    var status = el('div', 'unst', t('un_rules'));
    var btn = el('button', 'abtn', t('un_take')); btn.type = 'button'; btn.disabled = true;
    bindUsernameField(inp, status, btn);
    btn.addEventListener('click', function () { submitUsername(inp, status, btn, function () { setTimeout(function () { ov.remove(); }, 500); }); });
    box.appendChild(inp); box.appendChild(status); box.appendChild(btn);
    ov.appendChild(box); document.body.appendChild(ov);
    setTimeout(function () { inp.focus(); }, 50);
  }

  // ======= 13) Profil resmi ve isim ayarları =======
  function fileToAvatar(file) {
    return new Promise(function (res, rej) {
      var fr = new FileReader();
      fr.onload = function () {
        var im = new Image();
        im.onload = function () {
          var c = document.createElement('canvas'); c.width = c.height = 80;
          var x = c.getContext('2d'), s = Math.min(im.width, im.height);
          x.drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, 0, 0, 80, 80);
          res(c.toDataURL('image/jpeg', 0.72));
        };
        im.onerror = rej; im.src = fr.result;
      };
      fr.onerror = rej; fr.readAsDataURL(file);
    });
  }
  function setPhoto(url, src) {
    if (!fbUser || !db) return Promise.reject(new Error('auth'));
    return db.collection('profiles').doc(fbUser.uid).set({ photo: url, photoSrc: src }, { merge: true }).then(function () {
      profile = Object.assign(profile || {}, { photo: url, photoSrc: src });
      renderAuth(); refreshBoardEntries();
      document.dispatchEvent(new CustomEvent('arkat:profile', { detail: profile }));
    });
  }
  function updateNames(first, last) {
    if (!fbUser || !db) return Promise.reject(new Error('auth'));
    var patch = {};
    first = (first || '').trim().slice(0, 24); last = (last || '').trim().slice(0, 24);
    if (first) patch.firstName = first;
    if (last) patch.lastName = last;
    if (!Object.keys(patch).length) return Promise.resolve();
    return db.collection('profiles').doc(fbUser.uid).set(patch, { merge: true }).then(function () {
      profile = Object.assign(profile || {}, patch);
      document.dispatchEvent(new CustomEvent('arkat:profile', { detail: profile }));
    });
  }

  // ======= 14) Arkadaşlar =======
  function pendingCount() {
    return (friendCache || []).filter(function (f) { return f.status === 'pending' && f.from !== (fbUser && fbUser.uid); }).length;
  }
  function loadFriendships(force) {
    if (!fbUser || !db) return Promise.resolve([]);
    if (friendCache && !force) return Promise.resolve(friendCache);
    var me = fbUser.uid;
    return db.collection('friendships').where('users', 'array-contains', me).get().then(function (q) {
      friendCache = q.docs.map(function (d) {
        var x = d.data();
        return { other: x.users[0] === me ? x.users[1] : x.users[0], status: x.status, from: x.from };
      });
      return friendCache;
    }).catch(function () { friendCache = []; return friendCache; });
  }
  function relation(other) {
    var f = (friendCache || []).filter(function (x) { return x.other === other; })[0];
    if (!f) return 'none';
    if (f.status === 'accepted') return 'friends';
    return f.from === (fbUser && fbUser.uid) ? 'sent' : 'received';
  }
  function pairRef(other) {
    var ids = [fbUser.uid, other].sort();
    return db.collection('friendships').doc(ids[0] + '_' + ids[1]);
  }
  function requestFriend(other) {
    var ids = [fbUser.uid, other].sort();
    return pairRef(other).set({ users: ids, from: fbUser.uid, status: 'pending', t: serverTs() }).then(function () { return loadFriendships(true); });
  }
  function acceptFriend(other) { return pairRef(other).update({ status: 'accepted' }).then(function () { return loadFriendships(true); }); }
  function removeFriend(other) { return pairRef(other).delete().then(function () { return loadFriendships(true); }); }
  function getProfileById(uid) {
    return initFirebase().then(function () { return db.collection('profiles').doc(uid).get(); })
      .then(function (s) { return s.exists ? s.data() : null; });
  }
  function getProfileByName(name) {
    return initFirebase().then(function () { return db.collection('usernames').doc(String(name).toLowerCase()).get(); })
      .then(function (s) { return s.exists ? getProfileById(s.data().uid) : null; });
  }

  // ======= 15) Arama (oyun + kişi) =======
  function closeSearch() {
    var o = document.getElementById('arkat-search'); if (o) o.remove();
    document.removeEventListener('keydown', srKey);
  }
  function srKey(e) { if (e.key === 'Escape') closeSearch(); }
  function openSearch() {
    if (document.getElementById('arkat-search')) return;
    var ov = el('div'); ov.id = 'arkat-search';
    var box = el('div', 'box');
    var hd = el('div', 'hd');
    var inp = el('input', 'sin'); inp.type = 'text'; inp.placeholder = t('search_ph');
    inp.autocomplete = 'off'; inp.autocapitalize = 'off'; inp.spellcheck = false;
    var x = el('button', 'x', t('lb_close')); x.addEventListener('click', closeSearch);
    hd.appendChild(inp); hd.appendChild(x);
    var ls = el('div', 'ls');
    box.appendChild(hd); box.appendChild(ls); ov.appendChild(box);
    ov.addEventListener('click', function (e) { if (e.target === ov) closeSearch(); });
    document.body.appendChild(ov);
    document.addEventListener('keydown', srKey);
    var token = 0, timer = null;

    function gameRows(q) {
      var rows = GAMES.filter(function (g) {
        return !q || t(g.t).toLowerCase().indexOf(q) >= 0 || g.kw.some(function (k) { return k.toLowerCase().indexOf(q) >= 0 || (q.length > 1 && q.indexOf(k.toLowerCase()) >= 0); });
      });
      return rows;
    }
    function build(q, people, loading) {
      ls.innerHTML = '';
      var games = gameRows(q), any = false;
      if (games.length) {
        any = true;
        ls.appendChild(el('div', 'sec', t('sec_games')));
        games.forEach(function (g) {
          var r = el('a', 'r'); r.href = rootPath + g.href;
          var gi = el('span', 'gi'); gi.innerHTML = icon(g.icon); r.appendChild(gi);
          r.appendChild(el('span', 'nm', t(g.t)));
          r.appendChild(el('span', 'tg', t('sr_game_tag')));
          ls.appendChild(r);
        });
      }
      if (q.length >= 2) {
        ls.appendChild(el('div', 'sec', t('sr_people')));
        if (loading) ls.appendChild(el('div', 'msg', t('lb_loading')));
        else if (people && people.length) {
          any = true;
          people.forEach(function (p) {
            var r = el('a', 'r'); r.href = userLink(p.uid, p.username);
            r.appendChild(avatar(p.photo, 34));
            var nm = el('span', 'nm', '@' + p.username);
            var sub = publicName(p);
            if (sub) nm.appendChild(el('small', null, sub));
            r.appendChild(nm);
            if (fbUser && p.uid === fbUser.uid) r.appendChild(el('span', 'tg', t('you')));
            ls.appendChild(r);
          });
        } else ls.appendChild(el('div', 'msg', t('sr_none')));
      } else if (q.length === 1) {
        ls.appendChild(el('div', 'msg', t('sr_type')));
      } else if (!any) ls.appendChild(el('div', 'msg', t('sr_none')));
    }
    function run() {
      var q = inp.value.trim().toLowerCase().replace(/^@/, '');
      var my = ++token;
      if (q.length < 2) { build(q, null, false); return; }
      build(q, null, true);
      initFirebase().then(function () {
        return db.collection('profiles').where('usernameLower', '>=', q).where('usernameLower', '<=', q + '\uf8ff').limit(8).get();
      }).then(function (snap) {
        if (my !== token) return;
        build(q, snap.docs.map(function (d) { return d.data(); }).filter(function (p) { return p.username; }), false);
      }).catch(function () { if (my === token) build(q, [], false); });
    }
    inp.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(run, 280); });
    build('', null, false);
    setTimeout(function () { inp.focus(); }, 50);
  }

  // ======= 16) Uygulama olarak yükleme (PWA) =======
  var deferredPrompt = null;
  function isStandalone() {
    return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); deferredPrompt = e;
    document.dispatchEvent(new CustomEvent('arkat:installable'));
  });
  window.addEventListener('appinstalled', function () {
    deferredPrompt = null; document.dispatchEvent(new CustomEvent('arkat:installable'));
  });
  function canInstall() { return !isStandalone() && (!!deferredPrompt || isIOS()); }
  function install() {
    if (deferredPrompt) {
      var p = deferredPrompt; deferredPrompt = null;
      p.prompt();
      if (p.userChoice) p.userChoice.then(function () { document.dispatchEvent(new CustomEvent('arkat:installable')); });
      return;
    }
    if (isIOS()) {
      var ov = el('div'); ov.id = 'arkat-ios';
      var b = el('div', 'box');
      b.appendChild(el('h3', null, t('ios_title')));
      b.appendChild(el('p', null, t('ios_steps')));
      var c = el('button', 'abtn', t('lb_close')); c.addEventListener('click', function () { ov.remove(); });
      b.appendChild(c); ov.appendChild(b);
      ov.addEventListener('click', function (e) { if (e.target === ov) ov.remove(); });
      document.body.appendChild(ov);
    }
  }
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register(rootPath + 'sw.js').catch(function () {}); });
  }

  // ======= 17) Dışarı açılan API =======
  window.ARKAT = {
    t: t, getLang: function () { return lang; }, setLang: setLang,
    getUser: function () { return fbUser; },
    getProfile: function () { return profile; },
    getDb: function () { return db; },
    whenReady: function () { return configured ? initFirebase() : Promise.resolve(); },
    isConfigured: function () { return configured; },
    signIn: signIn, signOut: signOut, toast: toast,
    saveScore: saveScore,
    getBoard: getBoard, rankOf: rankOf, showBoard: showBoard, syncBoards: syncBoards,
    awardBadge: awardBadge, BADGES: BADGES, localBadges: localBadges, badgeSvg: badgeSvg,
    icon: icon, GAMES: GAMES, renderBadges: renderBadges, renderScoreCards: renderScoreCards,
    el: el, avatar: avatar, publicName: publicName, shownName: shownName, userLink: userLink,
    PRESETS: PRESETS, svgDataUrl: svgDataUrl, fileToAvatar: fileToAvatar, setPhoto: setPhoto, updateNames: updateNames,
    checkUsername: checkUsername, setUsername: setUsername, bindUsernameField: bindUsernameField, submitUsername: submitUsername,
    getProfileById: getProfileById, getProfileByName: getProfileByName,
    loadFriendships: loadFriendships, relation: relation, requestFriend: requestFriend, acceptFriend: acceptFriend, removeFriend: removeFriend,
    getFriendList: function () { return friendCache || []; },
    openSearch: openSearch,
    canInstall: canInstall, install: install
  };

  function boot() {
    buildBar(); applyI18n();
    if (configured) initFirebase().catch(function () {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
