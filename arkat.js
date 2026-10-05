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
      sec_games: 'OYUNLAR', count: '2 OYUN',
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
      scores_h: 'SKORLARIM', badges_h: 'ROZETLER', badge_new: 'YENİ ROZET!',
      badge_tower_nova_n: 'NOVA AJAN',
      badge_tower_nova_d: 'Neon Tower\'ın 10 seviyesini de tamamla.',
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
      sec_games: 'GAMES', count: '2 GAMES',
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
      scores_h: 'MY HIGH SCORES', badges_h: 'BADGES', badge_new: 'NEW BADGE!',
      badge_tower_nova_n: 'NOVA AGENT',
      badge_tower_nova_d: 'Clear all 10 levels of Neon Tower.',
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
      sec_games: 'ゲーム', count: '2ゲーム',
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
      scores_h: 'マイハイスコア', badges_h: 'バッジ', badge_new: '新しいバッジ！',
      badge_tower_nova_n: 'ノヴァ・エージェント',
      badge_tower_nova_d: 'NEON TOWERの全10レベルをクリアしよう。',
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
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-title]').forEach(function () {});
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

  // ======= 4) Üst çubuk (dil + giriş) =======
  var css = '' +
    '#arkat-bar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:flex-end;font-family:"Press Start 2P","DotGothic16",system-ui,sans-serif}' +
    '#arkat-bar .langs{display:flex;gap:6px}' +
    '#arkat-bar .lang-btn{background:#150c26;color:#9c8fc4;border:2px solid #3a2a5c;padding:7px 8px;font:inherit;font-size:10px;cursor:pointer}' +
    '#arkat-bar .lang-btn:hover{color:#f5f0ff;border-color:#00fff2}' +
    '#arkat-bar .lang-btn.on{color:#0a0612;background:#00fff2;border-color:#00fff2}' +
    '#arkat-bar .auth-btn{background:#150c26;color:#f5f0ff;border:2px solid #00fff2;box-shadow:3px 3px 0 #ff2a6d;padding:8px 12px;font:inherit;font-size:10px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;text-decoration:none}' +
    '#arkat-bar .auth-btn:hover{transform:translate(1px,1px);box-shadow:2px 2px 0 #ff2a6d}' +
    '#arkat-bar .auth-btn[disabled]{opacity:.6;cursor:wait}' +
    '#arkat-bar .avatar{width:22px;height:22px;border:2px solid #ffb000;object-fit:cover;background:#3a2a5c;image-rendering:pixelated}' +
    '#arkat-bar .me{display:flex;align-items:center;gap:8px}' +
    '#arkat-bar .out{background:none;border:none;color:#9c8fc4;font:inherit;font-size:10px;cursor:pointer;padding:4px}' +
    '#arkat-bar .out:hover{color:#ff2a6d}' +
    '#arkat-lb{position:fixed;inset:0;z-index:300;background:rgba(10,6,18,.88);display:flex;align-items:center;justify-content:center;padding:16px}' +
    '#arkat-lb .box{width:100%;max-width:460px;max-height:86vh;display:flex;flex-direction:column;background:#150c26;border:3px solid #00fff2;box-shadow:6px 6px 0 #ff2a6d;font-family:"VT323","DotGothic16",monospace;color:#f5f0ff}' +
    '#arkat-lb .hd{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 16px;border-bottom:3px solid #3a2a5c}' +
    '#arkat-lb .hd h3{margin:0;font:12px/1.6 "Press Start 2P","DotGothic16",system-ui;color:#ffb000}' +
    '#arkat-lb .x{background:#150c26;color:#f5f0ff;border:2px solid #3a2a5c;font:10px "Press Start 2P","DotGothic16",system-ui;padding:8px 10px;cursor:pointer}' +
    '#arkat-lb .x:hover{border-color:#ff2a6d}' +
    '#arkat-lb .ls{overflow:auto;padding:8px 10px 12px}' +
    '#arkat-lb .msg{padding:22px;text-align:center;color:#9c8fc4;font-size:20px}' +
    '#arkat-lb .r{display:flex;align-items:center;gap:10px;padding:8px 8px;border-bottom:2px solid #24173f;font-size:21px}' +
    '#arkat-lb .r.me{background:#00fff21a;border:2px solid #00fff2}' +
    '#arkat-lb .n{flex:0 0 40px;text-align:right;font:11px "Press Start 2P",system-ui;color:#9c8fc4}' +
    '#arkat-lb .r:nth-child(1) .n{color:#ffd23f}#arkat-lb .r:nth-child(2) .n{color:#d6d6e6}#arkat-lb .r:nth-child(3) .n{color:#ff9d5c}' +
    '#arkat-lb .av{width:30px;height:30px;border:2px solid #3a2a5c;object-fit:cover;background:#3a2a5c;flex:0 0 auto}' +
    '#arkat-lb .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '#arkat-lb .yo{color:#00fff2;font-size:16px;margin-left:6px}' +
    '#arkat-lb .sc{color:#f5f0ff;font-size:24px}' +
    '#arkat-badge{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:350;background:#150c26;border:3px solid #ffd23f;box-shadow:0 0 0 4px #0a0612,8px 8px 0 #ff2a6d;padding:22px 26px;text-align:center;font-family:"VT323","DotGothic16",monospace;color:#f5f0ff;cursor:pointer;max-width:86vw;animation:abpop .35s steps(5)}' +
    '#arkat-badge .t{font:12px/1.6 "Press Start 2P","DotGothic16",system-ui;color:#ffd23f;margin-bottom:10px}' +
    '#arkat-badge .nm{font:13px/1.6 "Press Start 2P","DotGothic16",system-ui;margin-top:8px}' +
    '#arkat-badge .ds{color:#9c8fc4;font-size:19px;margin-top:6px}' +
    '#arkat-badge svg{width:120px;height:120px}' +
    '@keyframes abpop{0%{transform:translate(-50%,-50%) scale(.2)}100%{transform:translate(-50%,-50%) scale(1)}}' +
    '#arkat-msg{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:400;background:#150c26;border:3px solid #ff2a6d;color:#f5f0ff;padding:10px 14px;font:18px "VT323","DotGothic16",monospace;max-width:90vw;display:none}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var authBox;
  function buildBar() {
    var bar = document.getElementById('arkat-bar');
    if (!bar) return;
    var langs = document.createElement('div'); langs.className = 'langs';
    LANGS.forEach(function (l) {
      var b = document.createElement('button');
      b.className = 'lang-btn'; b.dataset.l = l[0]; b.textContent = l[1]; b.title = l[2];
      b.addEventListener('click', function () { setLang(l[0]); });
      langs.appendChild(b);
    });
    authBox = document.createElement('div');
    bar.appendChild(langs); bar.appendChild(authBox);
  }

  function toast(msg) {
    var m = document.getElementById('arkat-msg');
    if (!m) { m = document.createElement('div'); m.id = 'arkat-msg'; document.body.appendChild(m); }
    m.textContent = msg; m.style.display = 'block';
    clearTimeout(toast._t); toast._t = setTimeout(function () { m.style.display = 'none'; }, 3500);
  }

  var rootPath = document.currentScript && document.currentScript.getAttribute('data-root') || '';
  function renderAuth() {
    if (!authBox) return;
    authBox.innerHTML = '';
    if (fbUser) {
      var wrap = document.createElement('div'); wrap.className = 'me';
      var a = document.createElement('a'); a.className = 'auth-btn'; a.href = rootPath + 'profile.html';
      var img = document.createElement('img'); img.className = 'avatar'; img.alt = '';
      img.referrerPolicy = 'no-referrer';
      if (fbUser.photoURL) img.src = fbUser.photoURL; else img.style.visibility = 'hidden';
      var nm = document.createElement('span'); nm.textContent = (fbUser.displayName || t('profile')).split(' ')[0].toUpperCase();
      a.appendChild(img); a.appendChild(nm);
      var out = document.createElement('button'); out.className = 'out'; out.textContent = t('logout');
      out.addEventListener('click', signOut);
      wrap.appendChild(a); wrap.appendChild(out); authBox.appendChild(wrap);
    } else {
      var b = document.createElement('button'); b.className = 'auth-btn';
      b.textContent = busy ? t('signing') : ('G  ' + t('login'));
      if (busy) b.disabled = true;
      b.addEventListener('click', signIn);
      authBox.appendChild(b);
    }
  }

  // ======= 5) Firebase / Google giriş =======
  var fbUser = null, db = null, auth = null, busy = false, ready = false;
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
          fbUser = u; busy = false;
          if (u) ensureUser(u);
          renderAuth();
          ready = true;
          document.dispatchEvent(new CustomEvent('arkat:auth', { detail: u }));
        });
        auth.getRedirectResult().catch(function () {});
      });
    return initP;
  }

  // Otomatik kayıt: ilk girişte users/{uid} belgesi oluşturulur
  function ensureUser(u) {
    var ref = db.collection('users').doc(u.uid);
    ref.get().then(function (snap) {
      var now = firebase.firestore.FieldValue.serverTimestamp();
      var p;
      if (!snap.exists) {
        p = ref.set({ name: u.displayName || '', email: u.email || '', photo: u.photoURL || '', lang: lang, createdAt: now, lastLogin: now, best: {} });
      } else {
        p = ref.set({ name: u.displayName || '', photo: u.photoURL || '', lastLogin: now }, { merge: true });
      }
      syncBadges(snap.exists ? snap.data() : {});
      return p;
    }).catch(function () {});
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

  // Oyun skor kaydı: giriş yapılmışsa en yüksek puanı bulutta tutar
  function saveScore(game, diff, score) {
    if (!fbUser || !db || !(score > 0)) return Promise.resolve();
    var ref = db.collection('users').doc(fbUser.uid);
    return db.runTransaction(function (tx) {
      return tx.get(ref).then(function (s) {
        var best = (s.exists && s.data().best) || {};
        var g = best[game] || {};
        if (!(score > (g[diff] || 0))) return;
        g[diff] = score; best[game] = g;
        tx.set(ref, { best: best }, { merge: true });
      });
    }).catch(function () {}).then(function () { return writeBoard(game + '_' + diff, score); });
  }


  // ======= 5b) Dünya sıralaması =======
  // Tablo kimlikleri: oyun_zorluk (neon_e = Neon Düşüş Kolay, tower_h = Neon Tower Zor mod ...)
  var BOARDS = { neon_e: 1, neon_m: 1, neon_d: 1, tower_c: 1, tower_h: 1 };
  var boardCache = {};
  function shortName(n) {
    n = (n || '').trim(); if (!n) return 'Player';
    var p = n.split(/\s+/);
    return p.length > 1 ? p[0] + ' ' + p[p.length - 1].charAt(0).toUpperCase() + '.' : p[0];
  }
  function writeBoard(id, score) {
    score = Math.floor(score);
    if (!fbUser || !db || !BOARDS[id] || !(score > 0)) return Promise.resolve();
    var ref = db.collection('boards').doc(id).collection('entries').doc(fbUser.uid);
    return db.runTransaction(function (tx) {
      return tx.get(ref).then(function (s) {
        if (s.exists && !(score > s.data().score)) return;
        tx.set(ref, { uid: fbUser.uid, name: shortName(fbUser.displayName), photo: fbUser.photoURL || '', score: score, t: firebase.firestore.FieldValue.serverTimestamp() });
      });
    }).then(function () { delete boardCache[id]; }).catch(function () {});
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
  function showBoard(id, title) {
    closeBoard();
    var ov = document.createElement('div'); ov.id = 'arkat-lb';
    var box = document.createElement('div'); box.className = 'box';
    var hd = document.createElement('div'); hd.className = 'hd';
    var h = document.createElement('h3'); h.textContent = '\uD83C\uDF0D ' + t('world') + ' · ' + title;
    var x = document.createElement('button'); x.className = 'x'; x.textContent = t('lb_close'); x.addEventListener('click', closeBoard);
    hd.appendChild(h); hd.appendChild(x);
    var ls = document.createElement('div'); ls.className = 'ls';
    var m = document.createElement('div'); m.className = 'msg'; m.textContent = t('lb_loading'); ls.appendChild(m);
    box.appendChild(hd); box.appendChild(ls); ov.appendChild(box);
    ov.addEventListener('click', function (e) { if (e.target === ov) closeBoard(); });
    document.body.appendChild(ov);
    document.addEventListener('keydown', lbKey);
    getBoard(id, 100).then(function (list) {
      ls.innerHTML = '';
      if (!list.length) { var e = document.createElement('div'); e.className = 'msg'; e.textContent = t('lb_empty'); ls.appendChild(e); return; }
      var myUid = fbUser && fbUser.uid;
      list.forEach(function (it, i) {
        var higher = 0; for (var j = 0; j < list.length; j++) if (list[j].score > it.score) higher++;
        var r = document.createElement('div'); r.className = 'r' + (it.uid === myUid ? ' me' : '');
        var n = document.createElement('span'); n.className = 'n'; n.textContent = '#' + (higher + 1);
        var av = document.createElement('img'); av.className = 'av'; av.alt = ''; av.referrerPolicy = 'no-referrer';
        if (it.photo) av.src = it.photo; else av.style.visibility = 'hidden';
        av.onerror = function () { av.style.visibility = 'hidden'; };
        var nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = it.name;
        if (it.uid === myUid) { var y = document.createElement('span'); y.className = 'yo'; y.textContent = '◂ ' + t('you'); nm.appendChild(y); }
        var sc = document.createElement('span'); sc.className = 'sc'; sc.textContent = it.score;
        r.appendChild(n); r.appendChild(av); r.appendChild(nm); r.appendChild(sc); ls.appendChild(r);
      });
    }).catch(function () { ls.innerHTML = ''; var e = document.createElement('div'); e.className = 'msg'; e.textContent = t('lb_err'); ls.appendChild(e); });
  }

  // ======= 5c) Rozetler =======
  var BADGES = { tower_nova: { game: 'tower', n: 'badge_tower_nova_n', d: 'badge_tower_nova_d' } };
  function localBadges() { try { return JSON.parse(localStorage.getItem('arkat-badges') || '{}'); } catch (e) { return {}; } }
  function saveLocalBadges(o) { try { localStorage.setItem('arkat-badges', JSON.stringify(o)); } catch (e) {} }
  function awardBadge(id) {
    if (!BADGES[id]) return;
    var lb = localBadges(), fresh = !lb[id];
    if (fresh) { lb[id] = Date.now(); saveLocalBadges(lb); }
    if (fbUser && db) {
      var ref = db.collection('users').doc(fbUser.uid);
      ref.get().then(function (s) {
        var b = (s.exists && s.data().badges) || {};
        if (!b[id]) { var u = { badges: {} }; u.badges[id] = firebase.firestore.FieldValue.serverTimestamp(); return ref.set(u, { merge: true }); }
      }).catch(function () {});
    }
    if (fresh) badgePopup(id);
  }
  // Girişte: hesaptaki rozetler cihaza, cihazdaki (misafirken kazanılan) rozetler hesaba
  function syncBadges(data) {
    var cloud = (data && data.badges) || {}, local = localBadges(), changed = false, up = null;
    Object.keys(cloud).forEach(function (id) {
      if (!local[id]) { local[id] = cloud[id] && cloud[id].toMillis ? cloud[id].toMillis() : Date.now(); changed = true; }
    });
    Object.keys(local).forEach(function (id) {
      if (BADGES[id] && !cloud[id]) { up = up || { badges: {} }; up.badges[id] = firebase.firestore.FieldValue.serverTimestamp(); }
    });
    if (changed) saveLocalBadges(local);
    if (up && fbUser && db) db.collection('users').doc(fbUser.uid).set(up, { merge: true }).catch(function () {});
  }
  function badgePopup(id) {
    var old = document.getElementById('arkat-badge'); if (old) old.remove();
    var b = document.createElement('div'); b.id = 'arkat-badge';
    var tt = document.createElement('div'); tt.className = 't'; tt.textContent = t('badge_new');
    var art = document.createElement('div'); art.innerHTML = badgeSvg(id, false);
    var nm = document.createElement('div'); nm.className = 'nm'; nm.textContent = t(BADGES[id].n);
    var ds = document.createElement('div'); ds.className = 'ds'; ds.textContent = t(BADGES[id].d);
    b.appendChild(tt); b.appendChild(art); b.appendChild(nm); b.appendChild(ds);
    b.addEventListener('click', function () { b.remove(); });
    document.body.appendChild(b);
    setTimeout(function () { if (b.parentNode) b.remove(); }, 7000);
  }

  // ======= 5d) Oyun simgeleri ve rozet çizimleri (SVG) =======
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
    return '';
  }
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
    return '';
  }

  // ======= 6) Dışarı açılan API =======
  window.ARKAT = {
    t: t, getLang: function () { return lang; }, setLang: setLang,
    getUser: function () { return fbUser; },
    getDb: function () { return db; },
    whenReady: function () { return configured ? initFirebase() : Promise.resolve(); },
    saveScore: saveScore, signIn: signIn, signOut: signOut,
    getBoard: getBoard, rankOf: rankOf, showBoard: showBoard, syncBoards: syncBoards,
    awardBadge: awardBadge, BADGES: BADGES, localBadges: localBadges, badgeSvg: badgeSvg, icon: icon,
    isConfigured: function () { return configured; }
  };

  function boot() {
    buildBar(); applyI18n();
    if (configured) initFirebase().catch(function () {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
