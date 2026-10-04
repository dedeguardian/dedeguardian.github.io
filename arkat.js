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
      sec_games: 'OYUNLAR', count: '1 OYUN',
      g_neon_t: 'NEON DÜŞÜŞ',
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
      sec_games: 'GAMES', count: '1 GAME',
      g_neon_t: 'NEON DROP',
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
      sec_games: 'ゲーム', count: '1ゲーム',
      g_neon_t: 'NEON DROP',
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
    '#arkat-msg{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:50;background:#150c26;border:3px solid #ff2a6d;color:#f5f0ff;padding:10px 14px;font:18px "VT323","DotGothic16",monospace;max-width:90vw;display:none}';
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
      if (!snap.exists) {
        return ref.set({ name: u.displayName || '', email: u.email || '', photo: u.photoURL || '', lang: lang, createdAt: now, lastLogin: now, best: {} });
      }
      return ref.set({ name: u.displayName || '', photo: u.photoURL || '', lastLogin: now }, { merge: true });
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
  function signOut() { if (auth) auth.signOut(); }

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
    }).catch(function () {});
  }

  // ======= 6) Dışarı açılan API =======
  window.ARKAT = {
    t: t, getLang: function () { return lang; }, setLang: setLang,
    getUser: function () { return fbUser; },
    getDb: function () { return db; },
    whenReady: function () { return configured ? initFirebase() : Promise.resolve(); },
    saveScore: saveScore, signIn: signIn, signOut: signOut,
    isConfigured: function () { return configured; }
  };

  function boot() {
    buildBar(); applyI18n();
    if (configured) initFirebase().catch(function () {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
